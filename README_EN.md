<h1 align="center"><img src="logo.png" width="40" align="absmiddle"> Blood on the Clocktower · Trouble Brewing</h1>

<p align="center">
  <img src="logo2.png" width="800" alt="BloodyArena Banner">
</p>

<p align="center">
  <a href="https://bloodarena.github.io/"><img src="https://img.shields.io/badge/🌐_Project_Page-bloodarena.github.io-blue?style=for-the-badge" alt="Project Page"></a>
  <a href="https://github.com/BloodArena/BloodArena"><img src="https://img.shields.io/badge/💻_GitHub-BloodArena-black?style=for-the-badge&logo=github" alt="GitHub"></a>
  <a href="https://bloodarena.github.io/#rankings"><img src="https://img.shields.io/badge/🏆_Leaderboard-Leaderboard-orange?style=for-the-badge" alt="Leaderboard"></a>
</p>

> An AI-powered Blood on the Clocktower web game and AI evaluation platform. You can play as a human player alongside an AI Storyteller and AI players to experience the classic social deduction script "Trouble Brewing"; or pit 12 different LLMs against each other in fully automated matches to generate leaderboards that evaluate each model's social reasoning abilities.

---

## ✨ Features

### 🕹️ Single-Player Mode (index.html)

| | Feature | Description |
|---|---|---|
| 🎭 | Full Trouble Brewing Script | 13 Townsfolk, 4 Outsiders, 4 Minions, 1 Demon — a faithful recreation of the tabletop experience |
| 🤖 | Multi-Model AI Players | Supports `DeepSeek`, `Gemini`, `Claude`, `GPT`, `MiMo`, `OpenRouter`, etc. Each AI player can be individually configured with a different model |
| 🧠 | AI Storyteller | Storyteller decisions are driven by LLMs, intelligently generating information and rulings based on game state — replacing hard-coded logic |
| 😈 | Evil Team Private Chat | After the first night and before public discussion, the Demon and Minions hold a private chat to coordinate strategies and align their stories |
| 📋 | Daily AI Summaries | At the end of each day, player summaries are generated in parallel to prevent long games from exceeding the `context` limit, without blocking gameplay |
| 🗣️ | AI Voice Narration (`TTS`) | Powered by the `mimo-v2-tts` engine with 15 unique voice styles |
| 🎵 | BGM Playlist System | 15 built-in background music tracks, categorized by atmosphere (opening, discussion, deduction, nightfall, finale, ending) |
| 🎙️ | Voice Input | Supports browser speech recognition — speak instead of type |
| 💬 | Public Chat + Private Chat | Private chat is available on the first day for exchanging clues; subsequent days feature public discussion |
| 📊 | `Token` Usage Tracking | Real-time display of `Token` consumption and estimated costs per model |
| 📝 | Export Game Review | Export game `JSON` and `LLM` traces for post-game analysis |
| 🎬 | Opening Animation | An intro video plays at game start for added atmosphere |
| 💾 | Auto-Save | Game state is saved in the browser's `localStorage` — refreshing the page won't lose your progress |

### 🏆 AI Battle Evaluation System (benchmark/)

> 📊 For detailed model evaluation results and leaderboards, see [leaderboard.html](leaderboard.html) or visit our [online leaderboard](https://bloodarena.github.io).
> 📖 For detailed usage instructions for the Benchmark system, refer to [benchmark/README_EN.md](benchmark/README_EN.md)

| | Feature | Description |
|---|---|---|
| 🏆 | Fully Automated AI Battles | 12 LLMs each play as one player, automatically completing a full game |
| ⚖️ | Pre-Designed Fair Role Rotation | 5 balanced role boards designed by a professional Storyteller, with 12 games per board, ensuring each model plays each role exactly once |
| 📈 | Leaderboard System | Automatically tallies win rates and generates a leaderboard (`leaderboard.html`) |
| 🔍 | Data Viewer | Replay and analyze game details via `viewer.html` |
| 🔗 | Reasoning Chain Logging | All `LLM` calls have `reasoning` enabled, with full chain-of-thought recorded in trace files |
| 🔄 | Resume from Checkpoint | Simply re-run the same command after an interruption to continue |


---

## 📋 Prerequisites

1. **Modern Browser** (required)
   - `Chrome` or `Edge` recommended; `IE` is not supported

2. **`Python 3`** (recommended, for running a local server)

3. **`Node.js` 18+** (required for Benchmark evaluation)

4. **At least one LLM `API Key`** (required)
   - Choose one of the following:
     - **`DeepSeek`** (affordable with good performance): Sign up at [platform.deepseek.com](https://platform.deepseek.com)
     - **`OpenRouter`** (one key for multiple models): Sign up at [openrouter.ai](https://openrouter.ai)
     - **`Gemini`** / **`Claude`** / **`GPT`**: Obtain keys from their respective platforms

---

## 🔧 Installation

### Step 1: Download the Project

```bash
# Option 1: Clone with git (recommended)
git clone https://github.com/BloodArena/BloodArena
cd BloodArena

# Option 2: Download the ZIP archive directly and extract to any folder
```

### Step 2: Install Dependencies (Optional)

The project has only one small dependency — skipping this step won't affect gameplay:

```bash
npm install
```

> 💡 If you don't have `Node.js` / `npm` installed, you can skip this step — it won't affect normal usage.

### Step 3: Configure Your `API Key`

This is the most important step! You need to edit the **`model_catalog.yaml`** file in the project root directory.

1. Open `model_catalog.yaml` with any text editor (`VS Code` recommended; Notepad works too)
2. Find the `api_keys` section at the top:

```yaml
api_keys:
  mimo: "YOUR_MIMO_KEY"              # Key for TTS voice (optional)
  deepseek: "YOUR_DEEPSEEK_KEY"   # ← Replace the content in quotes with your DeepSeek API Key
  gemini: "YOUR_GEMINI_KEY"            # Gemini API Key (optional)
  claude: "YOUR_CLAUDE_KEY"            # Claude API Key (optional)
  gpt: "YOUR_GPT_KEY"  # GPT API Key (optional)
  openrouter: "YOUR_OPENROUTER_KEY"        # OpenRouter API Key (optional)
```

3. **Paste your `API Key` into the corresponding quotes**. For example, you can get a DeepSeek API key from [https://platform.deepseek.com/api_keys](https://platform.deepseek.com/api_keys) and update your YAML configuration as follows:

```yaml
api_keys:
  deepseek: "sk-xxxxxxxxxxxxxxxxxxxxxxxx"
```

4. Save the file

> ⚠️ **Note**: You don't need to fill in all keys — just one is enough to play! Providers without a key will be shown as unavailable.

### Step 4: Configure Model Providers (Advanced, Optional)

If you're using a self-hosted API proxy, you can modify the `base_url` for the corresponding provider in the `providers` section:

```yaml
providers:
  gemini:
    label: "Gemini"
    base_url: "https://your-proxy-url/v1"    # ← Change to your API endpoint
    api_key: "${gemini}"                      # Automatically references the gemini key from api_keys above
    protocol: "openai"                        # Protocol type: openai or claude
    models:
      - "gemini-3-pro-preview"
      - "gemini-3-flash-preview"
```

---

## 🚀 Starting the Game

### Option 1: Using a `Python` Local Server (Recommended)

```bash
# Run in the project root directory
python3 -m http.server 8000
```

Then open in your browser:

| Page | URL | Description |
|------|-----|-------------|
| **Single-Player Mode** | http://localhost:8000 | Main human-vs-AI game |
| **Leaderboard** | http://localhost:8000/leaderboard.html | AI battle evaluation leaderboard |
| **Data Viewer** | http://localhost:8000/viewer.html | Game replay and detailed analysis |

> 💡 Using a local server allows the browser to automatically load the `model_catalog.yaml` configuration file.

### Option 2: Open the `HTML` File Directly

Simply open the `index.html` file in the project with your browser.

> ⚠️ With this method, the browser may not be able to automatically read `model_catalog.yaml`. The page will prompt you to manually select the configuration file — click the **"Select `model_catalog.yaml`"** button and locate the file in the project directory.

---

## 🖥️ Interface Guide

<details>
<summary>🔝 <strong>Top Navigation Bar</strong><br>&nbsp;&nbsp;&nbsp;&nbsp;<sub>Settings Gear · Phase Indicator · Export Review · Export Traces · Reset</sub></summary>

| Element | Description |
|---------|-------------|
| ⚙️ Gear Button | Opens the left-side settings drawer panel |
| Title Area | Displays "Blood on the Clocktower · Single-Player Mode" and the current script name |
| Phase Indicator | Shows the current game phase (Not Started / Night / Day / Dusk, etc.) |
| "Export Review" Button | Exports game records as a `JSON` file |
| "Export Traces" Button | Exports `LLM` call traces (trace recording must be enabled in settings first) |
| "Reset" Button | Resets the entire game, clearing all data |

</details>

<details>
<summary>⚙️ <strong>Left Settings Panel</strong> (click gear to open)<br>&nbsp;&nbsp;&nbsp;&nbsp;<sub>Game Settings · Model Configuration · Game Controls · TTS Voice Settings</sub></summary>

| Section | Option | Description |
|---------|--------|-------------|
| **Game Settings** | Player Count | Set the number of players (5–15) |
| | Your Name / Seat / Role | Set your identity; role can be set to "Random" |
| | Generate Players → Deal Cards → Start Game | Click in order to begin |
| | Random Models | Randomly assign a different model to each AI player |
| **Model Configuration** | Default Model / Temperature | Choose a model and adjust creativity (0–1) |
| | Day Discussion Duration | 1–30 minutes, default is 8 minutes |
| | Model Health Check | Shows whether each model is correctly configured and whether keys are valid |
| **Game Controls** | Auto Night Resolution | When enabled, night resolves automatically without manual clicking |
| | Record `LLM` Traces | Records detailed information for all AI calls (including `system prompt`) |
| | Manual Control Buttons | Pause / Night Resolution / AI Rotation / Force Nomination / Vote Resolution / End Game |
| **`TTS` Settings** | AI Voice Narration / Volume | Toggle voice narration on/off and adjust volume |

</details>

<details>
<summary>🏠 <strong>Main Game Area</strong> (three-column layout)<br>&nbsp;&nbsp;&nbsp;&nbsp;<sub>Town Square (Seating Circle · Token Usage) · Chat & Actions (Public Chat · Private Chat · @Mentions) · Personal Info (Identity · Night Actions)</sub></summary>

**Left Column — Town Square**

| Element | Description |
|---------|-------------|
| Seating Circle | Displays all player seats, names, and alive/dead status in a ring layout; click a seat to annotate guessed roles, click ➕ to add status tags and labels |
| Configure Player Models | Choose a model for each individual AI player |
| Configuration Summary | Shows the current role distribution |
| `Token` Usage | Call counts and cost statistics per model |

**Center Column — Chat & Actions**

| Element | Description |
|---------|-------------|
| Public Chat | All players speak publicly; supports filtering by player and keyword search |
| Private Chat | Available only on the first day — privately exchange clues with a chosen player |
| Message Input | Enter your message; supports @mentions, Slayer declaration button, and voice input |
| Event Log | Records important game events (deaths, nominations, etc.) |

**Right Column — Personal Info**

| Element | Description |
|---------|-------------|
| Your Identity | Displays the role you were assigned |
| Your Private Info | Night information given to you by the Storyteller |
| Your Night Actions | Night actions requiring your input (e.g., Fortune Teller choosing targets, Monk protecting someone) |
| Current Task | Tells you what you should be doing right now |
| Event Log | Your personal event log |

</details>

<details>
<summary>🎵 <strong>Bottom BGM Player</strong><br>&nbsp;&nbsp;&nbsp;&nbsp;<sub>Playlist Panel · Playback Controls · Volume Control · Role Sheet Overview</sub></summary>

| Element | Description |
|---------|-------------|
| ♪ Button | Opens the BGM playlist panel |
| ▶ Button | Play/pause the current track |
| Track Name | Displays the currently playing track |
| Volume Slider | Adjusts background music volume |
| 📜 Sheet Button | View the Trouble Brewing role sheet (all roles at a glance) |

</details>

---

## 🎮 Gameplay Walkthrough (Full Tutorial)

<details>
<summary>🎲 <strong>I. Game Setup</strong><br>&nbsp;&nbsp;&nbsp;&nbsp;<sub>Set player count, name, seat, and role; choose AI models; click "Generate Players → Deal Cards → Start Game" to begin</sub></summary>

1. Open the game page and click **"Start Game"** (you can skip the intro video)
2. Click the ⚙️ gear in the top-left corner to open the settings panel and configure basic info:
   - **Player Count**: **7–8 players** is recommended for beginners (faster pace, easier to learn)
   - **Your Name / Seat / Role**: Role can be set to "Random"
3. Select a **Default Model** (the corresponding `API Key` must be configured)
4. Click in order: **"Generate Players"** → **"Deal Cards"** → **"Start Game"**

> 💡 Click **"Random Models"** to assign a different model to each AI player for more diverse conversation styles!

</details>

<details>
<summary>🌙 <strong>II. The First Night</strong><br>&nbsp;&nbsp;&nbsp;&nbsp;<sub>The Storyteller wakes each role in order to use their ability. The Demon does not kill on the first night. If you have a night action, an action panel will appear on the right</sub></summary>

1. After setup, the game automatically enters the first night. The Storyteller wakes each role in order:
   - Poisoner chooses a target → Spy views the Grimoire → Information roles receive first-night info → Fortune Teller investigates…
2. **If your role has a night action**, an action panel will appear in the "Your Night Actions" area on the right — follow the prompts to select your target
3. **The Demon does not kill on the first night**, so no one dies on the first day
4. If "Auto Night Resolution" is enabled, this happens automatically; otherwise, click **"Night Resolution"** manually

</details>

<details>
<summary>😈 <strong>III. Evil Team Private Chat</strong> <code>🆕</code><br>&nbsp;&nbsp;&nbsp;&nbsp;<sub>After the first night and before public discussion, the Demon and Minions hold a round of private chat to coordinate strategies and align their stories</sub></summary>

After the first night ends and before the first day's public discussion, the Demon and Minions hold a round of private chat:

- Each Evil player takes turns speaking, up to 3 messages each
- Good players cannot speak; the interface shows "Evil team private chat in progress…"
- If you are on the Evil team, you can strategize with your teammates and reveal your true identities to each other
- After the private chat ends, the game automatically proceeds to normal daytime discussion

> 💡 This mechanic gives the Evil team a chance to align their stories before the first day's discussion, more closely resembling the real tabletop experience.

</details>

<details>
<summary>☀️ <strong>IV. Daytime Discussion</strong><br>&nbsp;&nbsp;&nbsp;&nbsp;<sub>AI players take turns speaking; you can type your message or @mention someone. Private chat is available on the first day for exchanging clues. Discussion is limited to 8 minutes</sub></summary>

1. At dawn, the Storyteller announces last night's deaths, and the discussion phase begins
2. AI players speak in seat order; when it's your turn, type in the input box or click **"Skip Discussion"**
3. Use the **@ feature** to call out a specific player and prompt them to respond
4. **First day only — Private Chat**: Switch to the "Private Chat" tab to privately exchange clues with a selected player (⚠️ available on the first day only)
5. Discussion has a time limit (default 8 minutes); when time runs out, the game automatically proceeds to the nomination phase
6. At the end of each day, the system automatically generates AI summaries in parallel, compressing conversation history to prevent exceeding the `context` limit

</details>

<details>
<summary>⚖️ <strong>V. Nominations & Voting (Dusk)</strong><br>&nbsp;&nbsp;&nbsp;&nbsp;<sub>Each player may nominate one person; the nominee must defend themselves; all players vote to decide execution. A majority puts someone on the block; the player with the most votes is executed</sub></summary>

**Nomination Phase**: Each living player may nominate one person (including themselves); each player gets only one nomination, and each player can only be nominated once

**Voting Phase**:
1. The nominator states their case → The nominee defends → Everyone votes in order
2. When it's your turn: click **✓ Vote Yes** or **✗ Vote No** (hotkeys **Y** / **N**)
3. Votes ≥ half of living players → placed on the execution block; the player on the block with the most votes is executed (if tied, no one is executed)
4. After execution is resolved, the game proceeds to the next night

</details>

<details>
<summary>🔁 <strong>VI. Subsequent Nights</strong><br>&nbsp;&nbsp;&nbsp;&nbsp;<sub>The Imp kills one player each night; other roles continue using their night abilities; at dawn the Storyteller announces deaths</sub></summary>

- Starting from the second night, **the Imp chooses one player to kill each night**
- Roles with night actions continue using their abilities (Monk protects, Fortune Teller investigates, etc.)
- At dawn, the Storyteller announces who died last night (the deceased's role is not publicly revealed)

</details>

<details>
<summary>⚡ <strong>VII. Special Situations</strong><br>&nbsp;&nbsp;&nbsp;&nbsp;<sub>Slayer shot, dead player voting, special trigger conditions for the Virgin/Saint/Mayor</sub></summary>

| Situation | Description |
|-----------|-------------|
| 🔫 Slayer Shot | During the day, use the "Slayer Declaration" button to shoot — if the target is the Demon, they die immediately. Once per game |
| 💀 Dead Players | Dead players can still speak and discuss, and have **one ghost vote** (once per game) |
| 🛡️ Virgin Nominated | If the nominator is a Townsfolk, the nominator is executed instead |
| ⛪ Saint Executed | The Good team immediately loses |
| 🏛️ Mayor's Victory | Only 3 players remain and no one is executed during the day → Good wins |
| 😈 Evil Self-Reveal | Evil players are allowed to reveal their true identities to each other |

</details>

<details>
<summary>🏁 <strong>VIII. Game Over</strong><br>&nbsp;&nbsp;&nbsp;&nbsp;<sub>Good wins if the Demon is executed or killed by the Slayer; Evil wins if only 2 players remain with the Demon alive, or if the Saint is executed. Post-game chat is available</sub></summary>

**Victory Conditions**

| Result | Condition |
|--------|-----------|
| ✅ Good Wins | The Demon is executed, or the Slayer kills the Demon |
| ✅ Good Wins | Mayor's Victory triggered (only 3 players remain and no one is executed) |
| ❌ Evil Wins | Only 2 living players remain and the Demon is still alive |
| ❌ Evil Wins | The Saint is executed |

**Post-Game Content**
- A review panel is displayed: all players' true roles, night actions, and chat logs
- Click "Generate Review" to have AI write a game recap, or "Export Review" to save the full record
- Enter post-game chat mode: continue discussing the game with AI players; click "AI Rotation" to let AI players share their post-game thoughts

</details>

---

## 🎯 Role Overview

<details>
<summary>😇 <strong>Good Team</strong> — 13 Townsfolk + 4 Outsiders<br>&nbsp;&nbsp;&nbsp;&nbsp;<sub>👇 Expand to see detailed Good team roles: Washerwoman · Librarian · Investigator · Chef · Empath · Fortune Teller · Undertaker · Monk · Ravenkeeper · Virgin · Slayer · Soldier · Mayor · Butler · Drunk · Recluse · Saint</sub></summary>

### Townsfolk (Good Team) — 13 Roles

| Role | Ability Summary |
|------|-----------------|
| Washerwoman | On the first night, learns which of two players is a specific Townsfolk |
| Librarian | On the first night, learns which of two players is a specific Outsider (or that there are no Outsiders) |
| Investigator | On the first night, learns which of two players is a specific Minion |
| Chef | On the first night, learns the number of pairs of adjacent Evil players (up to 3 pairs) |
| Empath | Each night, learns the number of Evil players among their living neighbors |
| Fortune Teller | Each night, chooses two players to check whether either is the Demon (one Good player is a false positive) |
| Undertaker | Each night (not the first), learns the role of the player who was executed that day |
| Monk | Each night (not the first), protects one player from being killed by the Demon |
| Ravenkeeper | If killed at night, may choose one player to learn their role |
| Virgin | The first time nominated by a Townsfolk, the nominator is executed instead |
| Slayer | Once per game, may declare a shot at a player during the day — if the target is the Demon, they die |
| Soldier | Immune to the Demon's kill ability |
| Mayor | If only 3 players remain and no one is executed, Good wins; at night, someone else may die in the Mayor's place |

### Outsiders (Good Team) — 4 Roles

| Role | Ability Summary |
|------|-----------------|
| Butler | Each night, chooses a "master" — the next day, may only vote when the master votes |
| Drunk | Believes they are a Townsfolk, but their ability has no effect and their information may be wrong |
| Recluse | May be detected as Evil or as a Minion/Demon role |
| Saint | If executed, the Good team immediately loses |

</details>

<details>
<summary>😈 <strong>Evil Team</strong> — 4 Minions + 1 Demon<br>&nbsp;&nbsp;&nbsp;&nbsp;<sub>👇 Expand to see detailed Evil team roles: Poisoner · Spy · Scarlet Woman · Baron · Imp</sub></summary>

### Minions (Evil Team) — 4 Roles

| Role | Ability Summary |
|------|-----------------|
| Poisoner | Each night, chooses one player to poison — their ability has no effect and their information may be wrong |
| Spy | Each night, views the Grimoire; may be detected as Good |
| Scarlet Woman | When the Demon dies (≥5 players alive), becomes the new Demon |
| Baron | The game has 2 extra Outsiders (replacing Townsfolk) |

### Demon — 1 Role

| Role | Ability Summary |
|------|-----------------|
| Imp | Kills one player each night; if the Imp kills themselves, a Minion becomes the new Demon |

</details>

<details>
<summary>📊 <strong>Player Count & Role Distribution</strong><br>&nbsp;&nbsp;&nbsp;&nbsp;<sub>Role composition table for 5–15 players</sub></summary>

| Players | Townsfolk | Outsiders | Minions | Demons |
|---------|-----------|-----------|---------|--------|
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

> 💡 If the Baron is in play, 2 additional Outsiders are added (replacing 2 Townsfolk).

</details>

The Trouble Brewing role sheet can be found here:

![Trouble Brewing Role Sheet](pictures/trouble_brewing.jpg)

---

## 🔧 Advanced Features

### AI Storyteller (`LLM Storyteller`)

Storyteller decisions are now driven by LLMs, replacing the previous hard-coded logic. The AI Storyteller intelligently adapts to the current game state to:

- Generate appropriate first-night and nightly information for information roles (Washerwoman, Librarian, Investigator, etc.)
- Adjudicate special situations (e.g., Recluse being detected, Slayer shot rulings, etc.)
- Deliver a gameplay experience closer to that of a live human Storyteller

### `TTS` Voice Narration

When `TTS` is enabled, AI players' messages are automatically read aloud. Each AI has a unique voice style (e.g., "mature male with a deep resonant voice," "energetic cheerful girl," "bold and hearty regional accent," etc. — 15 styles in total).
Our `TTS` uses `Mimo TTS`, requires a `mimo API Key`, and `Mimo TTS` is currently free.

**How to configure**:
1. Enter your `mimo` key in the `api_keys` section of `model_catalog.yaml`
2. Enable the **"AI Voice Narration"** toggle in the settings panel
3. Adjust the voice volume slider

### Custom Models

- **Global Default Model**: Select from the "Default Model" dropdown in the settings panel
- **Individual Configuration**: Click the **"Configure Player Models"** button below the Town Square to assign a different model to each AI player
- **Random Assignment**: Click the **"Random Models"** button to automatically assign random models to each AI player
- **Temperature**: The "Temperature" slider in the settings panel controls AI randomness (0 = most deterministic, 1 = most random)
- **Duplicate Model Support**: The same model can be used by multiple AI players simultaneously

### `LLM` Trace Recording

Enable **"Record `LLM` Traces"** in the settings panel to log all AI call details (including `system prompt`, input, and output). Use the **"Export Traces"** button at the top to export as a file for debugging or research.

### `Token` Usage Tracking

`Token` usage and costs are automatically tracked for each model during gameplay. View detailed statistics in the **"`Token` Usage & Cost"** section on the left side of the Town Square.

---

## 📁 Project Structure

```
BloodArena/
├── index.html                 # Main page (single-player mode entry)
├── leaderboard.html           # AI battle leaderboard page
├── viewer.html                # Game data viewer (replay & analysis)
├── model_catalog.yaml         # Model configuration file (API Keys go here)
├── package.json               # Node.js dependency declaration
├── begin_qwen.mp4             # Opening video
├── progress.md                # Development progress log
│
├── js/                        # Single-player mode JavaScript source
│   ├── main.js                # Entry point, initialization and event binding
│   ├── constants.js           # Role data, game rules, prompt templates
│   ├── state.js               # Game state management and persistence
│   ├── game-logic.js          # Core game flow (setup, phase transitions, win conditions)
│   ├── night-actions.js       # Night action resolution logic
│   ├── discussion.js          # Daytime discussion logic (AI rotation, Evil chat, daily summaries)
│   ├── nomination.js          # Nomination and voting logic
│   ├── private-chat.js        # Private chat system
│   ├── api.js                 # API calls, Token statistics
│   ├── model-catalog.js       # Model catalog parsing and health checks
│   ├── prompts.js             # AI prompt construction
│   ├── tts.js                 # TTS voice narration engine
│   ├── bgm.js                 # Background music player
│   ├── voice.js               # Voice input (microphone recognition)
│   ├── chat.js                # Chat message rendering
│   ├── ui-helpers.js          # UI rendering helper functions
│   ├── overlays.js            # Pop-ups and overlay layers
│   ├── settings.js            # Settings panel logic
│   ├── export.js              # Export and review features
│   └── utils.js               # General utility functions
│
├── benchmark/                 # AI battle evaluation system (see benchmark/README_EN.md)
│   ├── config.js              # Configuration: model list, role boards, API parameters
│   ├── llm.js                 # LLM call wrapper (OpenRouter + MiMo direct connect)
│   ├── schedule.js            # Role assignment scheduler (pre-designed board rotation)
│   ├── engine.js              # Game engine (core logic + daily summary compression)
│   ├── run.js                 # Main entry (model detection + run evaluation)
│   ├── stats.js               # Statistics aggregation (generates leaderboard)
│   ├── gen-index.js           # Generates file index (for data viewer)
│   ├── role_boards.json       # 5 pre-designed role boards
│   ├── role_assignment.txt    # Original role board descriptions
│   └── README.md              # Benchmark detailed usage instructions
│
├── css/                       # Stylesheets
│   ├── variables.css          # CSS variables (colors, fonts, etc.)
│   ├── base.css               # Base styles
│   ├── themes.css             # Themes (day/night toggle)
│   ├── layout.css             # Page layout
│   ├── components.css         # Common component styles
│   ├── chat.css               # Chat area styles
│   ├── players.css            # Player cards and seating circle styles
│   ├── phases.css             # Phase indicator styles
│   ├── sidebar.css            # Sidebar styles
│   ├── bgm.css                # BGM player styles
│   └── responsive.css         # Responsive design
│
├── music/                     # Background music files (15 MP3s)
└── pictures/                  # Image assets
    └── trouble_brewing.jpg    # Trouble Brewing role sheet image
```

---

## ❓ FAQ

<details>
<summary><b>Q: The model list is empty after opening the page — what should I do?</b></summary>

**A**: This usually happens because the browser can't read the `model_catalog.yaml` file. Try one of the following:
- **Recommended**: Start a local server with `python3 -m http.server 8000`, then access via `http://localhost:8000`
- A **"Select model_catalog.yaml"** button will appear on the page — click it to manually select the configuration file

</details>

<details>
<summary><b>Q: I got an error after clicking "Start Game" — what should I do?</b></summary>

**A**: Check the following:
1. Make sure you've entered at least one valid `API Key` in `model_catalog.yaml`
2. Ensure you've selected an available default model in the settings panel
3. Click the **"Re-check Model Configuration"** button to verify model health status
4. Make sure your network can reach the corresponding API service

</details>

<details>
<summary><b>Q: I refreshed the page during a game — will I lose my data?</b></summary>

**A**: No! Game state is automatically saved in the browser's `localStorage`. After refreshing, your progress will be automatically restored. If you want to start over, click the **"Reset"** button at the top.

</details>

<details>
<summary><b>Q: How do I restart with a different role?</b></summary>

**A**: Click the **"Reset"** button at the top to clear the current game, then reconfigure the player count and role in the settings panel and go through the "Generate Players → Deal Cards → Start Game" process again.

</details>

<details>
<summary><b>Q: TTS voice isn't producing any sound — what should I do?</b></summary>

**A**: Check the following:
1. Make sure you've entered the `mimo` `API Key` in `model_catalog.yaml`
2. The "AI Voice Narration" toggle in the settings panel is turned on
3. The voice volume slider is not set to 0
4. Your browser is not muted

</details>

<details>
<summary><b>Q: AI responses are very slow — what can I do?</b></summary>

**A**: AI response speed depends on the model's response time and your network conditions. Suggestions:
- Use faster models (e.g., `DeepSeek Chat`, `Gemini Flash`)
- Ensure a stable network connection
- Reduce the number of players to decrease the number of AI calls

</details>

<details>
<summary><b>Q: How much does it cost?</b></summary>

**A**: Costs vary significantly between models. The "`Token` Usage & Cost" section in the game interface shows real-time costs (in USD). As a rough guide:
- **`DeepSeek Chat`**: ~$0.01–0.05 per game (cheapest)
- **`Claude Haiku`**: ~$0.1–0.5 per game
- **`Claude Sonnet`/`MiMo-V2-pro`**: ~$0.5–2 per game
- **`Claude Opus`**: ~$5+ per game (most expensive)

💡 Beginners are advised to start with cheaper models to learn the ropes, then try more advanced models once comfortable.

</details>

<details>
<summary><b>Q: Can I play on mobile?</b></summary>

**A**: The page has basic responsive design, but playing on a **desktop browser** is recommended for the best experience. Mobile screens are small and the controls may be inconvenient.

</details>

<details>
<summary><b>Q: How do I use the AI battle evaluation system?</b></summary>

**A**: Please refer to [benchmark/README_EN.md](benchmark/README_EN.md) for detailed instructions on the evaluation system, including environment setup, running evaluations, and viewing the leaderboard.

</details>

---

## ⚠️ Important Notes

1. **`API Key` Security**: `API Keys` are read from `model_catalog.yaml` and are never uploaded to any server. Game state is saved in the browser's `localStorage`. Keep your configuration file safe and avoid using it on public computers
2. **Cost Control**: AI model calls incur costs — keep an eye on the `Token` usage panel. Costs can be significant when using premium models (e.g., `Claude Opus`)
3. **Network Requirements**: The game requires an internet connection to call AI `APIs` — ensure your network is stable
4. **Browser Compatibility**: Latest `Chrome` or `Edge` is recommended. Voice input requires browser support for the `Web Speech API`
5. **Personal Use Only**: This project is intended for personal learning and testing purposes. Please comply with the terms of service of each model provider
6. **Do Not Share Your Configuration File**: `model_catalog.yaml` contains your `API Keys` — do not upload it to public repositories or share it with others

---

## 📜 About

This project is based on the rules of the tabletop game *Blood on the Clocktower*, using Large Language Models (`LLMs`) to power AI Storytellers and AI players. It features:

- **Single-Player Mode**: A human player experiences the full game alongside AI
- **AI Battle Evaluation**: 12 LLMs play fully automated games, evaluating each model's social reasoning abilities

The script is "Trouble Brewing," the most classic beginner-friendly script in *Blood on the Clocktower*, ideal for newcomers learning the game rules.

**Tech Stack**:
- Single-Player Mode: Pure front-end implementation (`HTML` + `CSS` + `JavaScript`), no backend server required — the browser directly calls each model's API
- Evaluation System: `Node.js` command-line tool supporting `OpenRouter` unified routing and `MiMo` direct connection

---

## 🔗 Links

**GitHub**: [https://github.com/BloodArena/BloodArena](https://github.com/BloodArena/BloodArena)

**Project Page**: [https://bloodarena.github.io/](https://bloodarena.github.io/)
