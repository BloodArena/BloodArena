# Blood on the Clocktower AI Battle Benchmark System — Getting Started Guide

<p align="center">
  <a href="https://bloodarena.github.io/"><img src="https://img.shields.io/badge/🌐_Project_Page-bloodarena.github.io-blue?style=for-the-badge" alt="Project Page"></a>
  <a href="https://github.com/BloodArena/BloodArena"><img src="https://img.shields.io/badge/💻_GitHub-BloodArena-black?style=for-the-badge&logo=github" alt="GitHub"></a>
  <a href="https://bloodarena.github.io/#rankings"><img src="https://img.shields.io/badge/🏆_Leaderboard-Leaderboard-orange?style=for-the-badge" alt="Leaderboard"></a>
</p>

## What Is This

This is a pure Node.js all-AI battle benchmark script. 12 different LLMs each play as a player in a 12-player Blood on the Clocktower game under the Trouble Brewing script. The script automatically runs the complete game flow (night resolution → daytime discussion → nomination voting → execution), and ultimately computes each model's win rate to generate a leaderboard.

**Current configuration: Uses professionally designed Storyteller character setups (5 groups available). Each group runs 12 games in rotation, so every model plays each of the 12 roles exactly once.**

### Core Features

- **Preset Board Setup Mode**: 5 balanced character setups carefully designed by professional Storytellers, avoiding the inherent unfairness of random setups
- **Fair Rotation**: 12 games per group, 12 models rotate through 12 seats, each model plays each role exactly once
- **Unified OpenRouter Routing**: All competing models and the Storyteller model are called through the unified OpenRouter interface
- **Reasoning Chain Logging**: All LLM calls enable reasoning (effort=high), with the full chain of thought recorded to trajectory files
- **Storyteller LLM Decisions**: The Storyteller (referee) is driven by an independent LLM, dynamically deciding information truthfulness, Spy/Recluse registration profiles, and other key referee judgments
- **Daily Summary Compression**: Session history is automatically compressed at the end of each day, with differentiated compression templates for Good and Evil teams, preventing context overflow in long games
- **Private Chat & Evil Team Huddle**: The first day supports private chats between players to exchange clues; the Evil team can hold an internal huddle before public discussion to coordinate tactics
- **Resume from Checkpoint**: Simply re-run the same command after an interruption to continue

---

## Requirements

- **Node.js 18+** (requires built-in `fetch` support)
- **OpenRouter API Key** (for calling all models, including competing models and the Storyteller model)

Check your Node version:
```bash
node --version  # Requires v18.0.0 or higher
```

---

## Quick Start

### Step 1: Set Up Your API Key

```bash
export OPENROUTER_API_KEY="sk-or-v1-your-key-here"
```

Get your OpenRouter Key by registering at [openrouter.ai](https://openrouter.ai). Make sure your account has a balance.

### Step 2: Try Running 1 Game First

```bash
node benchmark/run.js --limit 1
```

By default, this uses preset board group 1. You can specify a different group with `--board-group`:

```bash
node benchmark/run.js --limit 1 --board-group 3
```

Before running, a **model connectivity probe** is performed, checking each of the 12 competing models and the Storyteller model for availability. To skip the probe:

```bash
node benchmark/run.js --limit 1 --skip-probe
```

You'll see output similar to:
```
=== Blood on the Clocktower — AI Benchmark ===

Run tag: 20260402_143025
Results dir: ./results/20260402_143025
Progress mode: concise

Running model connectivity probe...
  Benchmark models:
  - GPT-5.4 [openai/gpt-5.4] ... OK (hello)
  - Gemini 3.1 Pro [google/gemini-3.1-pro-preview] ... OK (hello)
  ...
Model connectivity probe passed.

Generating schedule...
  [Schedule] Board mode: group 1, 12 games (rotation)
  [Schedule] Board verification passed

[1/1] Running game_001...
    [game_001] Game start | seed=42000
    [game_001] Night 1 start
    [game_001] Night 1 end | dead=none
    [game_001] Day 1 discussion start | rounds=3
    [game_001] Day 1 session compression start
    [game_001] Day 1 session compression done
    [game_001] Day 1 nomination start
    [game_001] Day 1 execution | Player5
    ...
    Trajectories saved to ./results/20260402_143025/raw/game_001_trajectories/ (13 files)
  ✓ game_001 done — good wins (demon_killed) — 4 days — $0.350 — 120s
```

Each run **includes a timestamp by default**, and results are automatically saved to a separate directory (e.g., `results/20260402_143025/`), so previous results are never overwritten.

### Step 3: Check Results

Results are saved in `results/<timestamp>/raw/game_001.json`.

```bash
# View basic information
node -e "
  const g = require('./results/<timestamp>/raw/game_001.json');
  console.log('Winner:', g.winner, '(' + g.winCondition + ')');
  console.log('Days:', g.totalDays, 'Nights:', g.totalNights);
  console.log('Cost: \$' + (g.totalCost || 0).toFixed(3));
  console.log('Players:');
  g.players.forEach(p => console.log('  ' + p.name, p.role, '(' + p.team + ')', p.alive ? 'alive' : 'dead'));
"
```

### Step 4: Check Trajectories

After each game, **individual trajectory files for each player** are automatically generated:

```
results/<timestamp>/raw/game_001_trajectories/
├── Player1_openai_gpt-5.4.jsonl
├── Player2_google_gemini-3.1-pro-preview.jsonl
├── ...
└── Storyteller_google_gemini-3.1-pro-preview.jsonl
```

Each `.jsonl` file records all LLM calls for that player in chronological order (system prompt + user message + assistant response). If the model supports reasoning, a `reasoning_content` field is also included to record the chain of thought.

**What to check:**
- Whether the game ended normally (winner is not "draw")
- Whether the number of days is reasonable (typically 3-8 days)
- Whether token usage is reasonable
- Whether the AI is having normal discussions in the trajectory files

### Step 5: Run the Full 12 Games

```bash
node benchmark/run.js
```

**Resume from checkpoint is supported**: If interrupted midway (Ctrl+C or network error), simply run **the same command** again. Note: since timestamps are enabled by default, a second run will create a new directory. To resume the same batch, use `--run-tag` to specify the same tag:

```bash
node benchmark/run.js --run-tag my_run_01
# Resume after interruption:
node benchmark/run.js --run-tag my_run_01
```

### Step 6: Run Multiple Board Groups & Aggregate

5 preset board groups, each can run a batch of 12 games:

```bash
# Board group 1
node benchmark/run.js --board-group 1

# Board group 2
node benchmark/run.js --board-group 2

# Aggregate all batches and generate an overall leaderboard
node benchmark/stats.js --scan-all
```

`--scan-all` scans all subdirectories under `results/` for game results and outputs the aggregate to `results/leaderboard_all.json`. You can also specify the output path:

```bash
node benchmark/stats.js --scan-all --out results/my_leaderboard.json
```

### Step 7: View Leaderboard & Trajectory Viewer & Visualization

```bash
# Start an HTTP server in the project root directory
cd /path/to/BloodArena
python3 -m http.server 8000
```

- **Leaderboard**: Open `http://localhost:8000/leaderboard.html` in your browser.
- **Trajectory Viewer & Visualization**: Open `http://localhost:8000/viewer.html` in your browser (you need to generate the file index first: `node benchmark/gen-index.js`).

The leaderboard reads from `results/leaderboard.json` by default. If you used `--scan-all`, you need to copy the generated file over:

```bash
cp results/leaderboard_all.json results/leaderboard.json
```

---

## Command-Line Arguments

### `run.js`

```bash
node benchmark/run.js [options]
```

| Argument | Default | Description |
|----------|---------|-------------|
| `--limit N` | No limit | Only run the first N games |
| `--board-group N` / `--board N` | 1 | Which preset board group to use (1-5) |
| `--progress MODE` | concise | Log verbosity: `concise` / `balanced` / `detailed` |
| `--run-tag TAG` | None | Specify a run tag (used for result directory name and resume) |
| `--timestamped` | Enabled by default | Use a timestamp as the run tag |
| `--no-timestamp` | — | Disable timestamp; results are written directly to `results/raw/` |
| `--skip-probe` | — | Skip model connectivity probe |

**Progress mode details:**

- **`concise`**: Only shows game-level key events (night start/end, daytime discussion/nomination/execution)
- **`balanced`**: Adds LLM call completion notifications (with duration and cumulative token/cost), discussion rounds, nomination and voting details, daily summary compression status; prints an LLM wait heartbeat every 10 seconds
- **`detailed`**: Adds LLM call start events, first 80 characters of response preview, private chat detection, specific night actions, session compression details

```bash
# Use detailed for full logging when debugging
node benchmark/run.js --progress detailed --limit 1
```

### `stats.js`

```bash
node benchmark/stats.js [options]
```

| Argument | Description |
|----------|-------------|
| `--scan-all` | Scan all subdirectories under `results/` to generate an aggregated leaderboard |
| `--out PATH` | Specify leaderboard output path (default: `results/leaderboard_all.json`) |
| No arguments | Only reads results from `config.rawDir` |

### `gen-index.js`

```bash
node benchmark/gen-index.js
```

Scans the `results/` directory to generate `results/file_index.json`, used by the `viewer.html` data browser. Re-run after new game results to update the index.

---

## File Structure

```
benchmark/
├── config.js            # Configuration: model list, board setups, API parameters, Storyteller model
├── llm.js               # LLM call wrapper (unified OpenRouter interface, with reasoning chain support & local pricing estimation)
├── schedule.js          # Role assignment scheduler (preset board rotation / random board)
├── engine.js            # Game engine (full game mechanics + Storyteller LLM decisions + daily summary compression)
├── run.js               # Main entry point (model probing + running benchmark + saving results and trajectories)
├── stats.js             # Statistics aggregation (generates leaderboard JSON, supports multi-batch aggregation)
├── gen-index.js         # Generate file index (for the data browser)
├── role_boards.json     # 5 preset board setups (JSON format)
├── role_assignment.txt  # Original board setup descriptions (human-readable version)
└── README.md            # This document

results/
├── <timestamp>/           # Separate directory for each run
│   ├── raw/               # Per-game results
│   │   ├── game_001.json
│   │   ├── game_001_trajectories/   # Per-player trajectory JSONL files
│   │   │   ├── Player1_openai_gpt-5.4.jsonl
│   │   │   └── ...
│   │   └── ...
│   └── leaderboard.json   # Leaderboard for this batch
├── file_index.json        # File index generated by gen-index.js
├── leaderboard_all.json   # Aggregated leaderboard from --scan-all
└── leaderboard.json       # Leaderboard file read by the web page

# Project root
leaderboard.html           # Leaderboard web page
viewer.html                # Data browser web page
```

---

## Configuration Reference (config.js)

| Parameter | Default | Description |
|-----------|---------|-------------|
| `totalGames` | 12 | Total number of games (must be a multiple of 12) |
| `groups` | 1 | Number of groups (totalGames / 12) |
| `seed` | 42 | Random seed |
| `boardFile` | `"./benchmark/role_boards.json"` | Preset board setup file path; set to `""` for random board setup |
| `boardGroup` | 1 | Which board group to use (1-5), can be overridden by `--board-group` |
| `discussionRounds` | 3 | Number of discussion rounds per day |
| `maxNominationsPerDay` | 3 | Maximum nominations per day |
| `temperature` | 0.6 | LLM temperature (lower values make model output more stable and consistent) |
| `maxDays` | 10 | Maximum days per game (prevents infinite loops) |
| `timeoutMs` | 120000 | Single LLM call timeout (milliseconds); the engine layer also has a 600-second hard timeout as a safety net |
| `maxRetries` | 3 | Maximum LLM call retry count |
| `storytellerModel` | `google/gemini-3.1-pro-preview` | Storyteller model (referee, not ranked) |
| `models` | 12 models | List of competing models (must be exactly 12) |
| `openrouterApiKey` | Environment variable | OpenRouter API Key |

### Current Competing Model List

| # | Model ID | Display Label |
|---|----------|---------------|
| 1 | `openai/gpt-5.4` | GPT-5.4 |
| 2 | `google/gemini-3.1-pro-preview` | Gemini 3.1 Pro |
| 3 | `anthropic/claude-sonnet-4.6` | Claude Sonnet 4.6 |
| 4 | `xiaomi/mimo-v2-pro` | MiMo V2 Pro |
| 5 | `minimax/minimax-m2.7` | MiniMax M2.7 |
| 6 | `x-ai/grok-4.20-beta` | Grok 4.20 Beta |
| 7 | `deepseek/deepseek-v3.2` | DeepSeek V3.2 |
| 8 | `qwen/qwen3.5-397b-a17b` | Qwen3.5 397B |
| 9 | `bytedance-seed/seed-2.0-lite` | Seed 2.0 Lite |
| 10 | `stepfun/step-3.5-flash` | step 3.5 flash |
| 11 | `z-ai/glm-5` | GLM-5 |
| 12 | `moonshotai/kimi-k2.5` | kimi k2.5 |

---

## Preset Board Setup Mode

The system uses preset board setup mode by default (enabled when `boardFile` is non-empty). `role_boards.json` contains 5 balanced character setups designed by professional Storytellers. Each group specifies:

- The role for each of the 12 seats (including the Drunk's apparent role)
- The Demon's 3 bluffs (not-in-play identities)
- The Fortune Teller's red herring

Each board group generates a 12-game rotation schedule: in game i, models rotate according to the formula `(seat - i + 12) % 12`, ensuring each model plays each seat exactly once.

### Overview of the 5 Board Groups

| Group | Demon | Minions | Outsiders | Drunk's Apparent Role | Red Herring | Bluffs |
|-------|-------|---------|-----------|----------------------|-------------|--------|
| Group 1 | Imp (seat 2) | Scarlet Woman (seat 7), Poisoner (seat 11) | Drunk (seat 1), Recluse (seat 4) | Virgin | None | Fortune Teller, Undertaker, Saint |
| Group 2 | Imp (seat 9) | Baron (seat 7), Poisoner (seat 10) | Saint (seat 2), Recluse (seat 5), Butler (seat 4), Drunk (seat 8) | Washerwoman | Saint (seat 2) | Empath, Undertaker, Mayor |
| Group 3 | Imp (seat 7) | Poisoner (seat 4), Scarlet Woman (seat 9) | Saint (seat 2), Recluse (seat 12) | None | None | Butler, Fortune Teller, Mayor |
| Group 4 | Imp (seat 8) | Poisoner (seat 4), Baron (seat 10) | Recluse (seat 6), Saint (seat 9), Butler (seat 12), Drunk (seat 5) | Monk | Soldier (seat 2) | Chef, Empath, Undertaker |
| Group 5 | Imp (seat 5) | Spy (seat 7), Poisoner (seat 9) | Drunk (seat 4), Saint (seat 8) | Ravenkeeper | None | Butler, Fortune Teller, Chef |

> Note: Groups 2 and 4 include a Baron, which adds +2 Outsiders and -2 Townsfolk.

To revert to random board setup mode, set `boardFile` to `""` in `config.js`.

---

## Model Routing

All LLM calls are routed through the unified **OpenRouter** interface — no additional API channels need to be configured.

All calls enable reasoning chains (`reasoning: { effort: "high" }`). Models that support reasoning will return a `reasoning_content` field, which is recorded in the trajectory files.

### Cost Estimation

`llm.js` includes a built-in local pricing table for 40+ models (USD per 1M tokens) for cost estimation. Cost calculation priority:
1. The `usage.cost` field returned by the API
2. The `data.total_cost` field returned by the API
3. Local pricing table estimation

### Retry Mechanism

- **429 Rate Limiting**: Exponential backoff, preferring the `Retry-After` response header
- **5xx Server Errors**: Exponential backoff (3s × 2^attempt)
- **Timeout/Interruption**: Automatic retry, up to 3 times

---

## Game Engine Core Mechanics

The game engine (`engine.js`) implements the complete rules of Blood on the Clocktower: Trouble Brewing, including the following core subsystems:

### Storyteller LLM Decision System

The Storyteller is not a simple rule executor but makes strategic referee decisions through **multiple independent LLM calls**:

| Decision Function | Purpose | Temperature |
|-------------------|---------|-------------|
| `storytellerChooseRegistrationProfile()` | Decides the Spy/Recluse registration profile (how they appear in information resolution) | 0.2 |
| `storytellerChooseInfo()` | Decides whether to give drunk/poisoned players true or false information | 0.2 |
| `storytellerChooseTrueInfoPair()` | Selects the optimal true information pair for information-gathering roles | 0.2 |
| `storytellerJudgeRecluseSlayer()` | Judges whether the Recluse registers as a Demon when targeted by the Slayer | 0.2 |
| `storytellerChooseMayorRedirect()` | Decides which Good player to redirect the kill to when the Mayor's ability triggers | 0.2 |

The Storyteller uses a lower temperature (0.2) to ensure stability and consistency in referee decisions.

### Spy/Recluse Registration System

This is one of the most complex information mechanics in the game:

- **Spy**: Can register as a Good/Townsfolk/Outsider role, deceiving information-gathering roles like the Washerwoman, Librarian, and Investigator
- **Recluse**: Can register as an Evil/Minion/Demon role, contaminating the results of information-gathering roles
- Registration profiles are **dynamically decided** by the Storyteller LLM based on the current game state (alive Good/Evil ratio, existing claims, game balance)
- Includes a rule-based fallback mechanism to ensure the game continues if the LLM fails

### Night Information Resolution

The process by which information roles receive their information at night:

| Role | Information | Special Handling |
|------|-------------|-----------------|
| Washerwoman | First night: learns two players and one Townsfolk role | Affected by Spy/Recluse registration |
| Librarian | First night: learns two players and one Outsider role | May learn "there are no Outsiders" |
| Investigator | First night: learns two players and one Minion role | Affected by Spy/Recluse registration |
| Chef | First night: learns the number of adjacent Evil player pairs | Spy/Recluse may distort the count |
| Empath | Each night: learns the number of alive Evil neighbors | Affected by registration profiles |
| Fortune Teller | Each night: picks two players, learns if either is the Demon | Red herring always shows as Demon |
| Undertaker | Non-first nights: learns the role of the player executed that day | May be wrong if drunk/poisoned |
| Ravenkeeper | When dying at night: learns one player's role | Only triggers on death |
| Monk | Non-first nights: protects one player | Protected target is immune to Demon kill |
| Butler | Each night: chooses a master | Next day, can only vote if the master votes yes |

**Drunk/Poisoned Handling**: Drunk or poisoned players' information **may be wrong**. The Storyteller LLM decides whether to give true or false information (via the `storytellerChooseInfo` function).

### Daytime Flow

#### Evil Team Huddle (Before the First Day Only)

Before the first day's public discussion, all Evil team members hold an **internal huddle** (visible only to Evil members):
- Up to 3 rounds, each player up to 3 messages per round
- Used to discuss bluff assignment, disguise strategies, and target selection
- The Demon informs Minions of the three bluffs, and they coordinate their cover stories

#### Public Discussion

- Each day has `discussionRounds` (default 3) rounds of public discussion
- All alive players speak in turn; AI generates statements based on known information, private chat records, team guidelines, etc.
- Discussion supports **Slayer declarations**: anyone can claim to shoot, but must use the strict format `"I am the Slayer, I want to shoot PlayerX"`

#### Private Chat System (First Day Only)

- Private chats are only available on the first day
- Players use AI decisions to choose whether to initiate a private chat and with whom
- Private chat content is only visible to both parties
- Good team can exchange clues and build trust; Evil team can coordinate disguises
- After the first day, private chat content is preserved through daily summary compression

### Nomination & Voting

1. **Nomination**: Each alive player decides whether to nominate and whom to nominate (with reasoning)
2. **Constraints**: Each player can nominate at most once per day, each player can be nominated at most once per day, maximum `maxNominationsPerDay` (default 3) nominations per day
3. **Defense**: The nominated player gets a chance to defend themselves
4. **Voting**: Starting from the seat adjacent to the nominee, players vote in order; execution occurs if votes are greater than or equal to half of alive players
5. **Ghost Vote**: Dead players have exactly one ghost vote (deathbed vote) for the remainder of the game
6. **Butler Restriction**: The Butler can only vote yes when their master votes yes (this restriction is lifted when drunk/poisoned)

### Special Role Mechanics

| Role | Trigger Condition | Effect |
|------|-------------------|--------|
| **Virgin** | First time nominated, if the nominator is a Townsfolk | The nominator is immediately executed (once per game, requires not drunk/poisoned) |
| **Slayer** | Publicly declares a shot during the day (strict format) | If the target is the Demon, the Demon dies (once per game, requires sober and not poisoned) |
| **Saint** | Executed | Good team immediately loses |
| **Scarlet Woman** | If alive players >= 5 | When the Imp dies, she automatically becomes the new Imp; the game continues |
| **Mayor** | Only 3 players remain and no one is executed during the day | Good team wins (Mayor victory) |
| **Mayor** | About to be killed at night | Another Good player may die instead (decided by the Storyteller LLM) |
| **Soldier** | Chosen as the Demon's night kill target | Immune to Demon kill |
| **Imp** | Chooses to kill itself | A Minion becomes the new Imp (starpass) |

### Victory Conditions

| Condition | Winner |
|-----------|--------|
| Demon dies or Slayer kills (no Scarlet Woman succession) | Good |
| Mayor victory (only 3 remain and no daytime execution) | Good |
| Alive players <= 2 and Demon is alive | Evil |
| Saint is executed (not drunk/poisoned) | Evil |
| Exceeds maximum day limit (`maxDays`) | Forced end |

---

## Daily Summary Compression

To prevent session history from exceeding the model's context limit in long games, the system automatically compresses session history **at the end of each day**:

1. Processes both the `"chat"` and `"json"` sessions separately for each alive player
2. Preserves system messages (role profile, rules, etc.) and compresses user/assistant conversation history
3. Calls the player's own model to generate a summary from that player's perspective, retaining all key information
4. Replaces the original conversation history with the summary; subsequent calls continue appending on top of the summary
5. Each day's summary is preserved and will not be overwritten by subsequent compressions

### Team-Differentiated Compression

- **Good team template**: Focuses on claim analysis, contradiction tracking, credibility assessment, and investigation planning
- **Evil team template**: Focuses on teammate coordination, cover identity maintenance, threat assessment, and next-step action planning

### Incremental Context System

The system uses `publicChatCursorBySession` and `privateInfoCursorBySession` to track the message offset each player has seen in each session. Subsequent prompts only inject **incremental new content**, avoiding redundant injection of already-known information and saving token consumption.

Compression is performed at the end of each day (as long as there is conversation history). Compression failure does not affect game continuation.

---

## Model Connectivity Probe

A connectivity probe is automatically run before each execution to check if all models are available:

- **Competing models**: Test requests are sent concurrently. Unavailable models automatically fall back to a backup model (`xiaomi/mimo-v2-pro`)
- **Storyteller model**: Same behavior — falls back to the backup model if unavailable
- The run log clearly shows which models were replaced and prints the final competing lineup

If the backup model is also unavailable, the program will exit with an error.

Use `--skip-probe` to skip the probe (to speed up startup when models are confirmed available).

---

## FAQ

### Q: Error "OPENROUTER_API_KEY not set"
Set the environment variable: `export OPENROUTER_API_KEY="your-key-here"`

### Q: Error "fetch is not defined"
Your Node.js version is below 18. Please upgrade.

### Q: A model fails the connectivity probe
The model will automatically fall back to the backup model (`xiaomi/mimo-v2-pro`). If the backup also fails, check your API Key and network connection.

### Q: Run was interrupted midway
Use `--run-tag` with the same tag to resume: `node benchmark/run.js --run-tag your_previous_tag`

### Q: Want to switch board groups
```bash
node benchmark/run.js --board-group 3  # Use board group 3
```

### Q: Want to use random board setup instead of presets
Set `boardFile` to `""` in `config.js`, then run normally. In random mode, each model is assigned exactly 1 Demon game, 2 Minion games, and 9 Good games.

### Q: How long does one game take
A 12-player game typically takes 3-6 hours per game.

### Q: How much does it cost approximately
Each game costs $5-$18. The terminal displays per-game cost in real time during execution.

### Q: How do I switch models
Edit the `models` array in `config.js`. There must be exactly 12. All models use the OpenRouter format (e.g., `"openai/gpt-5.4"`). Duplicate models are supported — for example, use 11 `xiaomi/mimo-v2-pro` + 1 `deepseek/deepseek-v3.2` to test a specific model's performance. The system will automatically add `#1`, `#2`, etc. suffixes to distinguish duplicate model IDs, and the suffixes are automatically stripped during API calls.

### Q: Want to regenerate the leaderboard only (without re-running games)
```bash
# Single batch
node benchmark/stats.js

# Aggregate all batches
node benchmark/stats.js --scan-all
```

### Q: Don't want to create a new directory every time
```bash
node benchmark/run.js --no-timestamp
```
Results will be written to `results/raw/`, and each run will skip already completed games.

### Q: How to use the data browser
```bash
node benchmark/gen-index.js           # Generate file index
python3 -m http.server 8000           # Start HTTP server
# Open http://localhost:8000/viewer.html in your browser
```
