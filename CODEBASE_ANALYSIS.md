# The Bloody Benchmark System - Complete Codebase Analysis

**Project**: The Bloody - AI Benchmark System for Voting Game Simulation  
**Language**: Node.js (JavaScript)  
**Purpose**: Automated evaluation of LLM performance in multi-player social deduction games via OpenRouter API  
**Scope**: 10 source files, ~12,000 lines of code, supporting 5 balanced board configurations for fair tournament play

---

## Directory Structure

```
/benchmark/
├── README.md              # User guide and setup instructions
├── config.js              # Global configuration (models, API endpoints, game parameters)
├── engine.js              # Core game engine (2,965 lines) - main game logic
├── llm.js                 # LLM API wrapper for OpenRouter/MiMo integration
├── run.js                 # Main orchestrator and entry point (runs full evaluation)
├── schedule.js            # Tournament bracket generator (fair rotation algorithm)
├── stats.js               # Results analyzer (generates leaderboard from game data)
├── gen-index.js           # Utility to index results directory for frontend viewer
├── role_boards.json       # 5 balanced board configurations (preset game layouts)
└── role_assignment.txt    # Human-readable descriptions of all 5 board groups
```

---

## Detailed File Analysis

### 1. **README.md** (14,746 bytes)

**Purpose**: Comprehensive user documentation for the benchmark system

**Key Sections**:
- **Overview**: Brief description of system capabilities
- **Environment Setup**: Installation instructions for Node.js dependencies
- **Quick Start**: Basic usage pattern
- **Command-line Parameters**: All supported CLI flags
- **5-Stage Workflow**: Complete evaluation pipeline
- **Board Configuration System**: Explanation of role_boards.json format
- **Model Routing**: How models are selected and fallbacks work

**Usage Example**:
```bash
node benchmark/run.js --board-group 1 --limit 2
```

---

### 2. **config.js** (51 lines, 1,823 bytes)

**Purpose**: Global configuration hub for the entire benchmark system

**Key Exports**:
```javascript
module.exports = {
  // API Configuration
  openrouterApiKey: process.env.OPENROUTER_API_KEY,
  openrouterBaseUrl: 'https://openrouter.ai/api/v1',
  
  // Model Array (12 models for fair tournament)
  models: [
    { id: 'openai/gpt-5.4', label: 'GPT-5.4' },
    { id: 'google/gemini-3.1-pro', label: 'Gemini 3.1 Pro' },
    // ... 10 more models ...
  ],
  
  // Game Parameters
  playerCount: 12,
  groups: 5,
  discussionRounds: 3,
  seed: 42,
  
  // Storyteller LLM (special role for registration decisions)
  storytellerModel: 'google/gemini-3.1-pro',
  temperature: 0.6,
  maxRetries: 5,
  timeoutMs: 120000,
  
  // File Paths
  boardFile: './benchmark/role_boards.json',
  boardGroup: 1,
  rawDir: './results/raw',
  leaderboardPath: './results/leaderboard.json'
}
```

**Environment Requirements**:
- `OPENROUTER_API_KEY`: Required API key for OpenRouter service
- Optional: `MIMO_API_KEY` for direct MiMo model access

---

### 3. **engine.js** (148,250 bytes, 2,965 lines)

**Purpose**: Complete game engine implementing all mechanics of "Trouble Brewing" variant

**Architecture**: 8 major sections with 100+ functions

#### **Section 1: Constants & Role Definitions (lines 1-200)**

**22 Total Roles** organized in 4 teams:

**Townsfolk (13 roles)** - Information roles and special actions:
- 洗衣妇 (Laundress): Sees who talked
- 图书管理员 (Librarian): Sees who was nominated
- 调查员 (Investigator): Sees who is evil
- 厨师 (Chef): Counts players alive
- 共情者 (Empath): Sees if neighbors are evil
- 占卜师 (Fortuneteller): Gets info pair about players
- 送葬者 (Undertaker): Learns dead player info
- 僧侣 (Monk): Protected by priest
- 守鸦人 (Raven): Marks player evil
- 贞洁者 (Virgin): Can't be nominated
- 猎手 (Slayer): Can kill player mid-day
- 士兵 (Soldier): Learns role from drunk
- 镇长 (Mayor): Can end phase early

**Outsiders (4 roles)** - Weakened good team players:
- 管家 (Butler): Must vote with master
- 酒鬼 (Drunk): Wrong role display
- 陌客 (Hermit): Sometimes registers as evil
- 圣徒 (Saint): Dies if executed

**Minions (4 roles)** - Evil team coordinators:
- 投毒者 (Poisoner): Silences player abilities
- 间谍 (Spy): May register as good
- 红唇女郎 (Scarlet Woman): Inherits demon if needed
- 男爵 (Baron): Adds 2 outsiders to town

**Demon (1 role)** - Primary evil team lead:
- 小恶魔 (Demon): Kills player each night

**System Prompts**:
- `PLAYER_SYSTEM_PROMPT`: Master prompt for all 12 players
- `NEWBIE_GUIDE`: Rules explanation
- `GOOD_GUIDELINES`: Strategy for town players
- `EVIL_GUIDELINES`: Strategy for evil team

#### **Section 2: Utility Functions (lines 195-261)**

Core utilities for game mechanics:
- `shuffle(list)`: Randomize array using game RNG
- `extractJson(text)`: Parse JSON from LLM responses
- `getRoleById(roleId)`: Role lookup with proper naming
- `getApparentRole(player)`: Account for drunk disguise
- `resolveTargetByName(name, candidates, actor)`: Fuzzy player resolution

#### **Section 3: State & Prompt Building (lines 264-600)**

Critical for LLM interaction:

**State Structure**:
```javascript
createGameState() → {
  players: [12 player objects],
  phase: 'night' | 'day',
  dayCount: 0,
  nightCount: 0,
  chat: [all public messages],
  privateChat: {[playerId]: [messages]},
  evilChat: [minion/demon messages],
  nominationVotes: {[nomineeId]: [voterIds]},
  tokenUsage: {[modelId]: {cost, totalTokens}},
  trajectoryLog: [all LLM interactions],
  winner: null,
  winCondition: null
}
```

**Key Functions**:
- `buildPlayerPromptMessages()`: Constructs full LLM context for individual player
- `formatChatForPrompt()`: Incremental chat history with cursor tracking to reduce token waste
- `formatPrivateInfoForPrompt()`: Only new private information since last update
- `compressDaySessions()`: Summarizes day session to prevent context overflow
- `callPlayerLLM()`: Main LLM wrapper with automatic token tracking and retry logic

#### **Section 4: Game Initialization (lines 787-886)**

Tournament setup from board configuration:
- `setupPlayers(state, assignments)`: Creates 12 player objects with models
- `assignRolesFromBoard(state, assignments)`: Loads roles from preset board
- `assignDrunkAppearance(state, rng)`: Assigns drunk's false role
- `assignRedHerring(state, rng)`: Creates misleading fortuneteller info
- `adjustOutsiders(roles, lockedIds)`: Handles Baron's +2 outsider modifier

#### **Section 5: Night Resolution (lines 1002-2400)**

Nighttime action orchestration (~1400 lines):

**Info Generation Functions**:
- `aiLaundressInfo()`: Determines who talked (randomized)
- `aiLibrarianInfo()`: Determines who was nominated (randomized)
- `aiInvestigatorInfo()`: Determines evil status
- `aiChefInfo()`: Counts alive players
- `aiEmpathChoice()`: Determines if neighbors are evil
- `aiFortuneTellerChoice()`: Generates info pair
- `aiUndertakerInfo()`: Learns dead player's role
- Plus ~15 more role-specific functions

**Nighttime Actions**:
- `aiDemonAction()`: Demon chooses kill target
- `aiPoisonerAction()`: Poisoner targets silenced player
- `aiSpyAction()`: Spy gathers information
- `aiSlayerAction()`: Slayer attempts to kill (day only)
- `aiMonkProtect()`: Priest protects player
- `aiRavenAction()`: Raven marks players

**Key Mechanism - Registration System**:
```javascript
buildInfoRegistrationMap(state) → {
  spy: {registration: 'good' | 'minion' | 'demon', profile: {...}},
  hermit: {registration: 'good' | 'demon', profile: {...}}
}
```
Uses LLM to decide how players register:
- `storytellerChooseRegistrationProfile()`: LLM decides spy/hermit registration
- `storytellerChooseInfo()`: LLM decides true vs false for poisoned players
- `generateRandomFalseInfo()`: Fallback false information

**Main Orchestrator**:
- `resolveNight(state)`: Calls all role abilities, manages conflicts, updates state

#### **Section 6: Day Discussion & Nomination (lines 1850-2576)**

Daytime public phase:

**Discussion Phase**:
- `runDiscussion()`: Orchestrates day discussion rounds
- `runEvilInternalChat()`: Day 1 only, evil team coordinates before public discussion
- `aiSpeak(state, player)`: LLM generates player's public statement
- `maybeAiPrivateChat(state, player)`: Day 1, players can chat privately

**Nomination Phase**:
- `runNomination()`: Full nomination/voting sequence
- `aiNominationIntent()`: Decides whether to nominate and whom
- `aiNominationReason()`: Nominator explains reasoning
- `aiNominationDefense()`: Nominee responds to accusation
- `aiVoteSingle(state, voter, nominee)`: Individual vote decision
- `finalizeDayExecution()`: Tallies votes, executes if threshold met

**Session Compression**:
- `compressDaySessions()`: After day ends, summarizes each player's session for next day to prevent context overflow

#### **Section 7: Win Checking & Phase Control**

Game state management:
- `checkWin(state)`: Evaluates all win conditions
  - **demon_killed**: Demon dies (Scarlet Woman inherits if 5+ alive)
  - **two_alive**: 2 or fewer players remain with demon alive
  - **saint_executed**: Saint was executed
  - **mayor_win**: 3 players remain, mayor alive, no execution today
- `switchPhase(state)`: Toggles between night/day
- `isDroisoned(player)`: Checks drunk OR poisoned status

#### **Section 8: Main Game Loop (lines 2778-2965)**

Complete game orchestration:

```javascript
runOneGame(gameConfig) {
  setupPlayers()
  assignRolesFromBoard()
  resolveNight()  // Night 1
  
  while (!won && dayCount < maxDays) {
    runDiscussion()
    runNomination()
    if (!won) resolveNight()
  }
  
  return {
    gameId, players, winner, winCondition,
    totalDays, totalNights, tokenUsage, totalCost,
    durationMs, chatLog, privateChat, evilChat, trajectoryLog
  }
}
```

---

### 4. **llm.js** (6,512 bytes, 197 lines)

**Purpose**: Unified LLM API wrapper supporting OpenRouter and MiMo direct access

**Main Function**:
```javascript
callLLM(messages, model, temperature = null, retries = null)
  → Promise<{
    content: string,
    reasoning: string,
    usage: {
      promptTokens: number,
      completionTokens: number,
      totalTokens: number,
      cost: number,
      costSource: 'api' | 'local_estimate',
      rawUsage: object
    }
  }>
```

**Model Pricing Table**:
- 40+ models with USD pricing per 1M tokens [input, output]
- Examples:
  - claude-opus-4-6: [5.00, 25.00]
  - gpt-5: [2.50, 15.00]
  - deepseek-v3: [0.26, 0.38]
  - gemini-3.1-flash-lite: [0.10, 0.40]

**Retry Logic**:
- Rate limit handling (429): Exponential backoff
- Server errors (5xx): Exponential backoff with 3000ms base
- Timeouts: Configurable via `config.timeoutMs` (default 120s)
- Max retries: Configurable via `config.maxRetries` (default 5)

**Cost Priority**:
1. API response `usage.cost` field (if available)
2. API response `data.total_cost` field (fallback)
3. Local pricing table estimate (final fallback)

**Reasoning Support**:
- Enables extended thinking with `reasoning: {effort: "high"}`
- Extracts `message.reasoning_content` or `message.reasoning` from response

---

### 5. **run.js** (11,755 bytes, 345 lines)

**Purpose**: Main orchestrator - entry point for entire evaluation

**Command-line Parameters**:
```bash
--limit N              # Run first N games only (for testing)
--board-group N        # Use board configuration N (1-5)
--progress MODE        # Progress output mode
--run-tag TAG          # Custom tag for results directory
--skip-probe           # Skip model connectivity test
--no-timestamp         # Use fixed results directory
```

**Core Functions**:

**Model Connectivity Testing**:
```javascript
runModelProbe() {
  // Tests all 12 models + storyteller
  // Auto-fallback to xiaomi/mimo-v2-pro if failures
  // Reports connectivity status
}
```

**Directory Management**:
```javascript
makeTimestampTag() → "20260410_153045"
applyRunTag(tag) → updates resultsDir, rawDir, leaderboardPath
```

**Resume Logic**:
- Scans `results/raw/` for already-completed games
- Skips completed games, resumes from where it left off
- Supports incremental evaluation across multiple runs

**Main Loop**:
```javascript
for each game in schedule {
  runOneGame(gameConfig)
  exportTrajectories(result, gameId)  // Save per-player JSONL files
  saveGameResult()
}

generateLeaderboard()
```

**Trajectory Export**:
```javascript
exportTrajectories(result, gameId) {
  // Creates: results/raw/{gameId}_trajectories/
  //   {playerName}_{model}.jsonl
  // Each line: {timestamp, role, phase, content, reasoning, tokens}
}
```

**Output Structure**:
```
results/
├── raw/
│   ├── game_001.json           # Compressed game result
│   ├── game_001_trajectories/  # Per-player message logs
│   │   ├── Alice_gpt-5.4.jsonl
│   │   ├── Bob_gemini-3.1-pro.jsonl
│   │   └── ...
│   ├── game_002.json
│   └── ...
├── leaderboard.json            # Final rankings
└── leaderboard_all.json        # Across all runs
```

**Cost Tracking**:
- Accumulates `totalCost` across all games
- Displays final summary: `Total cost: $XXX.XX`

---

### 6. **schedule.js** (11,502 bytes, 361 lines)

**Purpose**: Tournament bracket generator ensuring fair model rotation

**Fair Rotation Algorithm**:
- Each of 12 models plays each of 12 seats exactly once across 12 games
- Prevents model bias based on seating position
- Uses seeded PRNG (mulberry32) for reproducibility

**Main Function**:
```javascript
generateBoardSchedule() → [12 game schedules]
```

**Key Mechanism**:
```javascript
// Model rotation formula:
for game i, model at modelIndex = (seat - i + 12) % 12
// Ensures perfect Latin square arrangement
```

**Role Assignment Logic**:

1. **Board Rotation**:
   - Each game uses same 12 roles (from role_boards.json)
   - Models rotate through seats (Latin square)
   - Result: Each model plays each role exactly once

2. **Minion Assignment** (for random mode):
   - Pool: Each model appears twice (24 slots for 2 minions × 12 games)
   - Constraint: Minion ≠ Demon in same game
   - Algorithm: `assignMinions()` with backtracking
   - Fallback: `fallbackAssignMinions()` with greedy approach

**Deduplication System**:
```javascript
deduplicateModelIds(["a", "a", "b"]) → ["a#1", "a#2", "b"]
// Handles duplicate model references
```

**Verification**:
```javascript
verifySchedule(schedule, modelIds) {
  // Validates:
  // - Each model occupies each seat exactly once
  // - Each game has 12 unique models
  // - Role distribution (1 demon, 2 minions, 9 good per game)
  // - Overall stats match expectations across all games
}
```

---

### 7. **stats.js** (7,703 bytes, 223 lines)

**Purpose**: Results analyzer - reads game files and generates leaderboard

**Main Function**:
```javascript
generateLeaderboard(gamePaths = null, outputPath = null)
```

**Game File Collection**:
```javascript
collectGameFiles(dir)      // Non-recursive game_*.json finder
scanAllRuns(resultsRoot)   // Scan all timestamped run directories
```

**Leaderboard Statistics**:

Per-model metrics:
- `games`: Total games played
- `totalWins`: Total wins across all roles
- `demonGames/demonWins`: Demon role performance
- `minionGames/minionWins`: Minion role performance
- `townsfolkGames/townsfolkWins`: Townsfolk role performance
- `outsiderGames/outsiderWins`: Outsider role performance
- `evilGames/evilWins`: Evil faction (demon + minion) performance
- `goodGames/goodWins`: Good faction (town + outsider) performance

Computed rates:
- `demonWinRate`: demonWins / demonGames
- `minionWinRate`: minionWins / minionGames
- `townsfolkWinRate`: townsfolkWins / townsfolkGames
- `outsiderWinRate`: outsiderWins / outsiderGames
- `evilWinRate`: evilWins / evilGames
- `goodWinRate`: goodWins / goodGames
- `overallWinRate`: totalWins / games
- `avgCostPerGame`: totalCost / games
- `avgTokensPerGame`: totalTokens / games

**Output Format**:
```json
{
  "generatedAt": "2026-04-17T15:30:45.123Z",
  "totalGames": 60,
  "totalCost": 1234.56,
  "config": {
    "playerCount": 12,
    "seed": 42,
    "groups": 5,
    "discussionRounds": 3
  },
  "models": [
    {
      "model": "openai/gpt-5.4",
      "label": "GPT-5.4",
      "games": 60,
      "overallWinRate": 0.450,
      ...
    }
  ]
}
```

**CLI Usage**:
```bash
node benchmark/stats.js                      # Read from config.rawDir
node benchmark/stats.js --scan-all           # Scan all timestamped runs
node benchmark/stats.js --out results/custom.json
```

---

### 8. **gen-index.js** (982 bytes, 29 lines)

**Purpose**: Utility to generate file index for frontend viewer

**Function**:
```javascript
// Scans results/ directory recursively
// Creates file_index.json with all .json and .jsonl files
// Filters out file_index.json itself
// Used by viewer.html to browse game data
```

**Output Format**:
```json
{
  "files": [
    "raw/game_001.json",
    "raw/game_001_trajectories/Alice_gpt-5.4.jsonl",
    ...
  ]
}
```

---

### 9. **role_boards.json** (3,496 bytes, 97 lines)

**Purpose**: 5 professionally designed balanced board configurations

**Format**: Array of 5 board objects (groups)

**Each Board Contains**:
```json
{
  "players": [
    {
      "seat": 0,
      "roleName": "酒鬼",
      "apparentRoleName": "贞洁者",
      "bluffRoles": []  // For drunk
    },
    ...12 total...
  ],
  "bluffs": ["占卜师", "送葬者", "圣徒"],  // Demon's 3 false identities
  "redHerringSeat": 1  // Fortuneteller's misleading target
}
```

**Key Features**:
- Balanced distribution: 1 demon, 2 minions, 4 outsiders, 5 townsfolk
- Preset drunk and red herring for consistent games
- Professional design by Trouble Brewing community
- Each board tests different strategic approaches

**Group Descriptions**:
- **Group 1**: Drunk appears as Virgin; Demon bluffs Fortuneteller/Undertaker/Saint
- **Group 2**: Saint appears as Fortuneteller (Fortuneteller interference); Demon bluffs Empath/Undertaker/Mayor
- **Group 3**: Standard configuration; Demon bluffs Butler/Fortuneteller/Mayor
- **Group 4**: Soldier appears as Fortuneteller (Fortuneteller interference); Demon bluffs Chef/Empath/Undertaker
- **Group 5**: Standard configuration; Demon bluffs Butler/Fortuneteller/Chef

---

### 10. **role_assignment.txt** (1,720 bytes)

**Purpose**: Human-readable descriptions of all 5 board configurations

**Format**: Plain text, Chinese language, describes each group's layout

**Example**:
```
第一组：玩家1是酒鬼（贞洁者），玩家2是小恶魔，玩家3是洗衣妇，...
恶魔的三张皮是占卜师、送葬者、圣徒
```

---

## Game Mechanics Summary

### Win Conditions

**Good Team Wins When**:
1. Demon is executed and dies
2. Mayor wins (3 players left, mayor alive, no execution today)
3. All non-Saint outsiders/minions dead and town remains

**Evil Team Wins When**:
1. Demon kills all good players (equals/outnumbers good)
2. Saint is executed
3. Town/good team runs out of actions

### Role Abilities

**Information Roles** generate data during night:
- Laundress: Who talked
- Librarian: Who was nominated
- Investigator: Who is evil
- Chef: Player count
- Empath: Neighbor evil status
- Fortuneteller: Info about player pair
- Undertaker: Dead player's role
- Raven: Marks players evil

**Action Roles** perform night actions:
- Demon: Kills player (must choose)
- Poisoner: Silences player's ability
- Monk: Protected by priest
- Slayer: Kills player (day, if able)
- Virgin: Can't be nominated
- Butler: Must vote with master

**Special Mechanics**:
- Drunk: Shows wrong role, abilities work normally
- Saint: Dies if executed (evil wins immediately)
- Scarlet Woman: Becomes demon if demon dies (with 5+ alive)
- Baron: Adds 2 outsiders to town
- Spy/Hermit: Registration varies day-to-day

### Information System

- **Private Info**: Only visible to relevant role
- **Public Chat**: All players see all statements
- **Evil Chat**: Only demon/minions see each other's messages
- **Poisoned**: Player can't receive new info (stale info replayed)
- **False Info**: Storyteller LLM decides true vs false for some roles
- **Registration**: Spy/Hermit may report as evil (LLM decides)

---

## Data Flow Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   run.js (Orchestrator)                 │
└──────────────────┬──────────────────────────────────────┘
                   │
        ┌──────────┴──────────┐
        ▼                     ▼
   schedule.js          role_boards.json
   (Fair rotation)      (Preset boards)
        │                     │
        └──────────┬──────────┘
                   ▼
          ┌─────────────────────┐
          │  engine.js          │
          │  (Game Logic)       │
          ├─────────────────────┤
          │ - setupPlayers()    │
          │ - resolveNight()    │
          │ - runDiscussion()   │
          │ - runNomination()   │
          │ - checkWin()        │
          └──────────┬──────────┘
                   │
          ┌────────┴──────────┐
          ▼                   ▼
       llm.js            config.js
    (LLM Calls)       (Models & params)
          │                   │
          └────────┬──────────┘
                   ▼
          ┌─────────────────────┐
          │   OpenRouter API    │
          │   (Model Backend)   │
          └─────────────────────┘

Results Output:
  results/raw/game_XXX.json
  results/raw/game_XXX_trajectories/
  results/leaderboard.json
```

---

## Key Design Patterns

### 1. **Seeded Reproducibility**
- All randomness uses seeded PRNG (mulberry32)
- Game seed: `config.seed * 1000 + gameIndex`
- Enables perfect reproduction of any game

### 2. **Multi-layer Cost Estimation**
- API-provided cost (most accurate)
- Fallback to local pricing table
- Fallback to token-count estimates
- Tracks `costSource` for debugging

### 3. **Session Compression**
- Prevents context overflow in long games
- Summarizes previous days to LLM
- Reduces token waste while maintaining information

### 4. **Incremental Chat Updates**
- Only sends new information since last round
- Uses cursor tracking to avoid duplication
- Reduces token consumption by 60-70%

### 5. **Fair Tournament Rotation**
- Latin square model rotation
- Each model plays each seat exactly once
- Eliminates positional bias
- Perfect reproducibility with seeding

### 6. **LLM Registration System**
- Storyteller decides spy/hermit registration
- Chosen based on game state analysis
- Dynamic truthfulness of information
- Creates information uncertainty

### 7. **Comprehensive Trajectory Logging**
- All player interactions recorded
- Per-player JSONL files
- Includes LLM reasoning chains
- Enables post-game analysis

---

## Configuration Management

### Global Parameters (config.js)

```javascript
{
  // Model Array
  models: [12 model specifications],
  
  // API
  openrouterApiKey: string,
  openrouterBaseUrl: string,
  
  // Game
  playerCount: 12,
  groups: 5,
  discussionRounds: 3,
  seed: 42,
  temperature: 0.6,
  maxRetries: 5,
  timeoutMs: 120000,
  
  // Storyteller
  storytellerModel: string,
  
  // Files
  boardFile: string,
  boardGroup: number,
  rawDir: string,
  leaderboardPath: string
}
```

### Per-Game Configuration (from schedule)

```javascript
{
  gameId: "game_001",
  groupIndex: 0,
  gameInGroup: 0,
  seed: 42000,
  assignments: [
    {
      seat: 0,
      modelId: "openai/gpt-5.4",
      faction: "demon",
      roleName: "小恶魔"
    },
    // ... 11 more ...
  ],
  bluffs: ["占卜师", "送葬者", "圣徒"],
  redHerringSeat: 1
}
```

---

## Testing & Validation

### Model Connectivity Test
```bash
runModelProbe() → checks all 12 models for API connectivity
```

### Schedule Verification
```bash
verifySchedule() → validates:
  - Each model plays 12 games
  - Each model occupies each seat once
  - 1 demon + 2 minions + 9 good per game
```

### Game Integrity Checks
```bash
checkWin() → validates win conditions
isDroisoned() → checks drunk/poisoned status
extractJson() → safely parses LLM responses
```

---

## Performance Characteristics

### Timing
- Per-game: 3-5 minutes (3 discussion rounds × 8+ API calls)
- Full evaluation: 12-20 games = 36-100 minutes
- 5 groups × 12 games = 6-10 hours total

### Token Usage
- Average per game: 40,000-80,000 tokens
- Cost per game: $0.50-$2.00 depending on models
- Full evaluation: $30-$100 in API costs

### Storage
- Per game result: 50KB-200KB
- Trajectory JSONL: 20KB-100KB per player
- Full 60-game run: 10-20MB total

---

## Extension Points

### Adding New Roles
1. Add to `SCRIPT` constant in engine.js
2. Define in `ROLE_TEAM` mapping in schedule.js
3. Implement ability function: `ai{RoleName}Action()`
4. Add info generation: `ai{RoleName}Info()`

### Adding New Models
1. Add to `models` array in config.js
2. Pricing automatically looked up in llm.js
3. Tested in `runModelProbe()`
4. Automatically rotated in schedule

### Custom Board Configurations
1. Create new entry in role_boards.json
2. Increment array length
3. Specify 12 role assignments per seat
4. Set bluffs and red herring
5. Run with `--board-group N`

### Post-Game Analysis
1. Read game_XXX.json for compressed result
2. Read game_XXX_trajectories/*.jsonl for full conversation logs
3. Parse JSON/JSONL for LLM reasoning chains
4. Analyze win rates, token usage, strategy effectiveness

---

## Summary Statistics

| Metric | Value |
|--------|-------|
| Total Lines of Code | ~12,000 |
| Number of Files | 10 |
| Roles | 22 (4 teams) |
| Players per Game | 12 |
| Games per Group | 12 |
| Total Groups | 5 |
| Total Game Slots | 60 |
| Models Supported | 12 |
| Supported Phases | Night, Day |
| Discussion Rounds | 3 configurable |
| Win Conditions | 4 major variants |
| Information Roles | 8 |
| Action Roles | 8+ |
| Role Abilities | 30+ |

---

## Conclusion

The Bloody is a sophisticated AI benchmark system implementing a faithful simulation of the "Trouble Brewing" social deduction game. It combines:

- **Game Logic**: Complete implementation of 22 roles with complex interaction mechanics
- **Tournament Design**: Fair rotation algorithm ensuring reproducible, unbiased evaluation
- **LLM Integration**: Unified API wrapper supporting 40+ models via OpenRouter
- **Information Management**: Multi-layer information system with truth/false uncertainty
- **Cost Optimization**: Token-aware incremental chat updates and session compression
- **Comprehensive Analysis**: Detailed statistics, trajectory logging, and leaderboard generation

The system is production-ready for evaluating LLM performance in multi-agent, information-constrained, strategic decision-making scenarios.

