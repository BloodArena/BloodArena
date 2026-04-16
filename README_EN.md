# 🩸 Blood on the Clocktower · Trouble Brewing

> An AI-powered Blood on the Clocktower web game and benchmark platform. Play as the sole human player alongside an AI Storyteller and AI players in the classic social deduction script *Trouble Brewing* — or pit 12 different LLMs against each other in fully automated matches to see which model reasons best.

---

## ✨ Features

### Single-Player Mode (`index.html`)

- 🎭 **Full Trouble Brewing script** — all 13 Townsfolk, 4 Outsiders, 4 Minions, and 1 Demon, faithfully recreating the tabletop experience
- 🤖 **Multi-model AI players** — mix and match DeepSeek, Gemini, Claude, GPT, MiMo, OpenRouter, and more; each AI player can run on a different model
- 🧠 **LLM Storyteller** — the Storyteller's decisions are driven by a language model, generating contextually appropriate information and rulings instead of hard-coded logic
- 😈 **Evil Chat** — before Day 1 discussion opens, the Demon and Minions hold a private coordination chat, mirroring the "evil team wakes" phase in the real tabletop game
- 📋 **Daily AI summaries** — at the end of each day, the game generates per-player AI summaries in parallel, compressing conversation history to retain key reasoning while keeping context size in check
- 🗣️ **TTS voice acting** — powered by the mimo-v2-tts engine; each AI player has a distinct voice persona
- 🎵 **BGM playlist** — 15 background tracks categorized by mood (opening, discussion, deduction, night, finale, ending), switching automatically to match the game phase
- 🎙️ **Voice input** — browser-based speech recognition so you can speak instead of type
- 💬 **Public & private chat** — on Day 1, whisper privately to exchange clues; from Day 2 onward, all discussion is public
- 📊 **Token usage tracking** — live display of token consumption and cost estimates per model
- 📝 **Export & replay** — export game JSON or full LLM trace files for post-game analysis
- 🎬 **Opening cinematic** — an intro video plays at game start for atmosphere
- 💾 **Auto-save** — game state is persisted in localStorage; a page refresh won't lose your progress

### AI Benchmark System (`benchmark/`)

- 🏆 **Fully automated AI matches** — 12 LLMs each play one seat and run through the complete game flow automatically
- ⚖️ **Fair rotation with preset boards** — 5 balanced role configurations designed by an experienced Storyteller; each model plays every role exactly once across 12 games
- 📈 **Leaderboard** — win rates are tallied and rendered in `leaderboard.html`
- 🔍 **Data browser** — replay and inspect any game in detail via `viewer.html`
- 🔗 **Chain-of-thought logging** — all LLM calls run with reasoning enabled; full thinking traces are saved to trajectory files
- 🔄 **Resume support** — interrupted runs pick up exactly where they left off

> 📖 For full benchmark usage instructions, see [benchmark/README.md](benchmark/README.md).

---

## 📋 Prerequisites

1. **A modern browser** (required)
   - Chrome or Edge (latest) recommended; Firefox and Safari also work
   - ⚠️ IE is not supported

2. **Python 3** (recommended, for the local dev server)
   - Only needed to serve files locally; the game itself is pure front-end

3. **Node.js 18+** (benchmark only)
   - Required only for the automated AI benchmark; not needed for single-player mode

4. **At least one AI API key** (required)
   - Recommended options:
     - **DeepSeek** — affordable and capable: [platform.deepseek.com](https://platform.deepseek.com)
     - **OpenRouter** — one key for many models: [openrouter.ai](https://openrouter.ai)
     - **Gemini / Claude / GPT** — from their respective platforms

---

## 🔧 Setup

### Step 1 — Clone the repo

```bash
git clone <repo-url>
cd The-Bloody
```

Or download and unzip the archive directly.

### Step 2 — Install dependencies (optional)

```bash
npm install
```

This is optional and only needed for benchmark tooling. The single-player game works without it.

### Step 3 — Add your API keys

Open `model_catalog.yaml` in any text editor and fill in the `api_keys` section:

```yaml
api_keys:
  mimo: "YOUR_MIMO_KEY"          # optional, for TTS
  deepseek: "YOUR_DEEPSEEK_KEY"
  gemini: "YOUR_GEMINI_KEY"      # optional
  claude: "YOUR_CLAUDE_KEY"      # optional
  gpt: "YOUR_GPT_KEY"            # optional
  openrouter: "YOUR_OPENROUTER_KEY"  # optional
```

You only need one key to get started — providers without a key are simply unavailable in-game.

### Step 4 — Custom API endpoints (optional)

If you're routing through a proxy, update the `base_url` for that provider:

```yaml
providers:
  gemini:
    label: "Gemini"
    base_url: "https://your-proxy/v1"
    api_key: "${gemini}"
    protocol: "openai"
    models:
      - "gemini-3-pro-preview"
      - "gemini-3-flash-preview"
```

---

## 🚀 Running the Game

### Option A — Local server (recommended)

```bash
python3 -m http.server 8000
```

Then open in your browser:

| Page | URL | Description |
|------|-----|-------------|
| **Single-player** | http://localhost:8000 | Main game |
| **Leaderboard** | http://localhost:8000/leaderboard.html | Benchmark rankings |
| **Data browser** | http://localhost:8000/viewer.html | Replay & analysis |

A local server lets the browser read `model_catalog.yaml` automatically.

### Option B — Open directly

Just open `index.html` in your browser. You'll be prompted to select `model_catalog.yaml` manually via the file picker button that appears on the page.

---

## 🖥️ UI Overview

### Top bar

| Element | Function |
|---------|----------|
| ⚙️ gear button | Opens the settings drawer |
| Title area | Shows script name and current game phase |
| Phase indicator | Current phase (setup / night / day / dusk / etc.) |
| Export Replay | Exports the full game record as JSON |
| Export Trace | Exports LLM call logs (requires trace recording to be enabled) |
| Reset | Wipes the current game and starts fresh |

### Settings drawer (⚙️)

**Game settings**
- Player count (5–15), your name, your seat, your role
- **Generate Players** → **Deal Roles** → **Start Game**
- **Randomize Models** — assigns a different AI model to each player

**Model config**
- Default model, temperature (0–1), day discussion length (1–30 min, default 8)
- Model health check — verifies API keys and connectivity

**Game controls**
- Auto night resolution toggle, LLM trace recording toggle
- Manual controls: Pause / Resolve Night / AI Round / Force Nomination / Resolve Vote / End Game

**TTS**
- Enable/disable voice acting, volume slider

### Main game area

**Left — Town Square**
- Seat ring showing all players (alive/dead). Click a seat to annotate your read on that player; click ➕ to add tags and notes.
- Configure per-player models, role summary, token usage

**Center — Chat & Actions**
- Public chat with player filter and keyword search
- Private whisper tab (Day 1 only)
- Message input, @mentions, Slayer declaration button, voice input
- Event log (deaths, nominations, etc.)

**Right — Personal Info**
- Your role and private information from the Storyteller
- Your night action interface
- Current task prompt and personal event log

### Bottom — BGM player

♪ opens the playlist; ▶ plays/pauses; volume slider; 📜 shows the Trouble Brewing character sheet.

---

## 🎮 How to Play

### 1. Starting a game

1. Click **Start Game** on the welcome screen (skip the intro video if you like)
2. Open ⚙️ settings and set player count, your name, seat, and role
3. Pick a **Default Model** from the dropdown
4. Click **Generate Players** → **Deal Roles** → **Start Game**

> 💡 Hit **Randomize Models** to give each AI player a different model for more varied conversations.

### 2. First night

The Storyteller wakes roles in order — Poisoner, Spy, information roles (Washerwoman, Librarian, Investigator, Chef, Empath, Fortune Teller), and so on. If your role has a night action, the action panel appears on the right. The Demon doesn't kill on Night 1, so nobody dies before Day 1.

### 3. Evil Chat

> 🆕 This phase mirrors the evil team's "eyes open" moment in the physical game.

Right after Night 1 and before Day 1 discussion, the Demon and Minions hold a private coordination chat — up to 3 rounds, 3 messages per player per round. Good team players can't act during this time; the UI shows a countdown. Evil-aligned players may freely reveal their true roles to each other here.

### 4. Day discussion

The Storyteller announces overnight deaths, then players take turns speaking in seat order. Use the @mention feature to address someone directly. On Day 1 only, you can switch to the **Private** tab to whisper to any player. Discussion ends after the countdown (default 8 min), then nominations begin. At the end of each day, the game generates AI summaries for every player in parallel to keep context manageable.

### 5. Nomination & voting

Any living player — including yourself — can nominate anyone, including themselves (e.g. to claim a role and invite verification). Each player may nominate once and be nominated once per day. Once nominated, the nominator makes their case and the nominee defends; then everyone votes in seat order (**Y** / **N** or click). Any nominee reaching ≥ ½ of living votes goes to the block; the one with the most votes is executed (ties = no execution).

### 6. Subsequent nights

From Night 2, the Demon kills each night. The Storyteller announces the death at dawn but not the victim's role.

### 7. Special cases

- **Slayer** — declare "I am the Slayer, I shoot [player]" during the day. If the target is the Demon, they die immediately. Once per game.
- **Dead players** — may still speak and cast one ghost vote (once per game, total)
- **Chaste** — if a Townsfolk nominates the Chaste, the nominator is executed instead
- **Saint** — if the Saint is executed by vote, Good loses immediately
- **Mayor's day** — if only 3 players remain alive and nobody is executed, Good wins
- **Evil self-exposure** — evil-aligned players are allowed to reveal their true identities to each other

### 8. End conditions

| Result | Condition |
|--------|-----------|
| ✅ Good wins | Demon is executed (or killed by the Slayer) |
| ✅ Good wins | Mayor's day triggered (3 players, no execution) |
| ❌ Evil wins | Only 2 living players remain and the Demon is alive |
| ❌ Evil wins | Saint is executed |

After the game ends, a **recap panel** shows all true roles and night actions. You can generate an AI-written game summary, export the record, or continue chatting with the AI players in post-game mode.

---

## 🎯 Roles

### Townsfolk (Good) — 13

| Role | Ability |
|------|---------|
| Washerwoman | Learns which of two players is a specific Townsfolk on Night 1 |
| Librarian | Learns which of two players is a specific Outsider on Night 1 (or that there are none) |
| Investigator | Learns which of two players is a specific Minion on Night 1 |
| Chef | Learns how many pairs of adjacent evil players exist (up to 3) |
| Empath | Each night, learns how many of their two neighbors are evil |
| Fortune Teller | Each night, picks two players; learns if either is the Demon (one good player is a false positive) |
| Undertaker | Each night (not Night 1), learns the role of the player executed that day |
| Monk | Each night (not Night 1), protects one player from the Demon's kill |
| Ravenkeeper | If killed at night, may learn one player's role |
| Chaste | The first Townsfolk to nominate the Chaste is executed instead |
| Slayer | Once per game, publicly declares a shot; kills the target if they're the Demon |
| Soldier | Immune to the Demon's kill |
| Mayor | If only 3 players remain and no execution happens, Good wins; someone may die in their place at night |

### Outsiders (Good) — 4

| Role | Ability |
|------|---------|
| Butler | Each night, picks a master; can only vote when their master votes |
| Drunk | Believes they have a Townsfolk role, but their ability doesn't work and their info may be wrong |
| Recluse | May register as evil or as a Minion/Demon to certain abilities |
| Saint | If executed by vote, Good loses immediately |

### Minions (Evil) — 4

| Role | Ability |
|------|---------|
| Poisoner | Each night, poisons one player — their ability fails and their info may be wrong |
| Spy | Each night, sees the Grimoire; may register as good to certain abilities |
| Scarlet Woman | If the Demon dies while 5+ players are alive, becomes the new Demon |
| Baron | Adds 2 extra Outsiders to the game (replacing 2 Townsfolk) |

### Demon — 1

| Role | Ability |
|------|---------|
| Imp | Kills one player each night; if it kills itself, a Minion becomes the new Imp |

### Player count & role distribution

| Players | Townsfolk | Outsiders | Minions | Demon |
|---------|-----------|-----------|---------|-------|
| 5 | 3 | 0 | 1 | 1 |
| 6 | 3 | 1 | 1 | 1 |
| 7 | 5 | 0 | 1 | 1 |
| 8 | 5 | 1 | 1 | 1 |
| 9 | 5 | 2 | 1 | 1 |
| 10 | 7 | 0 | 2 | 1 |
| 11 | 7 | 1 | 2 | 1 |
| 12 | 7 | 2 | 2 | 1 |
| 13 | 9 | 0 | 3 | 1 |
| 14 | 9 | 1 | 3 | 1 |
| 15 | 9 | 2 | 3 | 1 |

> 💡 If the Baron is in play, add 2 extra Outsiders (replacing 2 Townsfolk).

---

## 🔧 Advanced Features

### LLM Storyteller

The Storyteller's logic is now driven by a language model rather than hard-coded rules. It generates contextually appropriate information for info roles, adjudicates edge cases (Recluse registration, Slayer shots, etc.), and generally makes the experience feel closer to playing with a human Storyteller.

### TTS voice acting

When TTS is enabled, every AI player's messages are read aloud. There are 15 voice personas to choose from — deep and magnetic, bubbly and youthful, northeastern accent, and more.

To set it up: add your `mimo` API key to `model_catalog.yaml`, then toggle **AI Voice** on in the settings panel.

### Custom models

- Set a global default model from the settings dropdown
- Configure each AI player individually via **Configure Player Models**
- Hit **Randomize Models** to auto-assign varied models
- Adjust **temperature** (0 = deterministic, 1 = creative)
- The same model can be assigned to multiple players simultaneously

### LLM trace recording

Enable **Record LLM Trace** in the settings panel to capture every AI call — system prompts, inputs, and outputs. Export via the **Export Trace** button in the top bar.

### Token & cost tracking

Live token usage and cost estimates per model are shown in the **Token Usage & Cost** panel in the Town Square.

---

## 📁 Project Structure

```
The-Bloody/
├── index.html                 # Single-player game
├── leaderboard.html           # Benchmark leaderboard
├── viewer.html                # Game data browser (replay & analysis)
├── model_catalog.yaml         # API keys and model configuration
├── package.json
├── begin_qwen.mp4             # Opening cinematic
├── progress.md                # Dev notes
│
├── js/                        # Single-player source
│   ├── main.js                # Entry point, event bindings
│   ├── constants.js           # Role data, game rules, prompt templates
│   ├── state.js               # Game state & persistence
│   ├── game-logic.js          # Core flow (setup, phase transitions, win conditions)
│   ├── night-actions.js       # Night resolution
│   ├── discussion.js          # Day discussion (AI turns, Evil Chat, daily summaries)
│   ├── nomination.js          # Nomination & voting
│   ├── private-chat.js        # Whisper system
│   ├── api.js                 # API calls, token tracking
│   ├── model-catalog.js       # Model catalog parsing & health checks
│   ├── prompts.js             # Prompt construction
│   ├── tts.js                 # TTS engine
│   ├── bgm.js                 # BGM player
│   ├── voice.js               # Microphone input
│   ├── chat.js                # Chat rendering
│   ├── ui-helpers.js          # UI utilities
│   ├── overlays.js            # Modals & overlays
│   ├── settings.js            # Settings panel
│   ├── export.js              # Export & replay
│   └── utils.js               # General utilities
│
├── benchmark/                 # AI benchmark system (see benchmark/README.md)
│   ├── config.js
│   ├── llm.js
│   ├── schedule.js
│   ├── engine.js
│   ├── run.js
│   ├── stats.js
│   ├── gen-index.js
│   ├── role_boards.json
│   ├── role_assignment.txt
│   └── README.md
│
├── css/                       # Stylesheets
├── music/                     # 15 background tracks (MP3)
└── pictures/
    └── trouble_brewing.jpg    # Trouble Brewing character sheet
```

---

## ❓ FAQ

**The model list is empty after opening the page.**
The browser can't read `model_catalog.yaml` directly from the filesystem. Run `python3 -m http.server 8000` and access via `http://localhost:8000`, or use the **Select model_catalog.yaml** button that appears on the page.

**The game errors out when I click Start.**
Check that at least one valid API key is set in `model_catalog.yaml`, that a working default model is selected, and that your network can reach the API endpoint. Click **Re-check Model Config** to see the health status.

**I refreshed the page — is my progress gone?**
No. Game state is saved in localStorage and restores automatically. Click **Reset** to start a new game.

**TTS produces no sound.**
Confirm that the `mimo` API key is set, the **AI Voice** toggle is on, the volume slider is above 0, and your browser isn't muted.

**AI responses are slow.**
Speed depends on the model and your network. Try faster models (e.g. DeepSeek Chat, Gemini Flash) or reduce player count to cut down on API calls.

**How much does a game cost?**
It varies widely by model. The **Token Usage & Cost** panel shows live estimates in USD. Rough ballpark:
- DeepSeek Chat — ~$0.01–0.05 / game
- Claude Haiku — ~$0.1–0.5 / game
- Claude Sonnet / MiMo-V2-pro — ~$0.5–2 / game
- Claude Opus — ~$5+ / game

Start cheap to learn the ropes, then experiment with more capable models.

**Does it work on mobile?**
There's basic responsive layout, but a desktop browser gives a much better experience.

**How do I use the AI benchmark?**
See [benchmark/README.md](benchmark/README.md) for full instructions.

---

## ⚠️ Notes

- **API key safety** — keys are read from `model_catalog.yaml` locally and never sent to any server other than the model provider. Don't use this on a shared computer or commit `model_catalog.yaml` to a public repo.
- **Cost awareness** — keep an eye on the Token Usage panel, especially with expensive models.
- **Network** — the game needs internet access to call the AI APIs.
- **Browser compatibility** — Chrome or Edge (latest) recommended. Voice input requires Web Speech API support.
- **Personal use only** — this project is for personal learning and experimentation. Please follow each provider's terms of service.

---

## 📜 About

This project implements the rules of *Blood on the Clocktower* and uses large language models to power both the Storyteller and the AI players. It offers two modes:

- **Single-player** — play as the only human alongside AI players on the classic *Trouble Brewing* script
- **AI benchmark** — run fully automated 12-model matches and generate a ranked leaderboard to evaluate LLM social reasoning ability

**Tech stack:**
- Single-player mode: pure front-end (HTML + CSS + JavaScript), no backend required
- Benchmark system: Node.js CLI, routing through OpenRouter with direct MiMo integration
