# The Bloody - Complete Repository Analysis

## Executive Summary

**The Bloody** (血染钟楼) is a sophisticated AI benchmark system for evaluating Large Language Model (LLM) performance in complex multi-agent social deduction games. Built on the board game "Blood on the Clocktower" (specifically the "Trouble Brewing" script), it provides both:

1. **Single-player mode** - Real humans play with AI companions and AI storyteller
2. **AI Arena** - 12 different LLMs compete in fully automated tournaments

**Status**: Production-ready, fully documented, ~14K lines of code across 30+ files
**Technology**: Pure frontend (HTML/CSS/JavaScript) + Node.js benchmark system
**Language**: Chinese game text with English code comments
**Last Updated**: April 17, 2026

---

## What is "Blood on the Clocktower"?

Blood on the Clocktower is a social deduction game similar to Werewolf/Mafia but with unique mechanics:

### Core Concepts
- **22 roles** across 4 teams (not a simple 2-team game)
- **2 game phases**: Night (secret actions) and Day (public discussion)
- **Information-centric**: Players have partial, fallible information
- **Complex interactions**: 30+ role abilities create intricate game states
- **Strategic depth**: Combination of communication, logic, and deception

### The Script: "Trouble Brewing" (暗流涌动)
The game uses the "Trouble Brewing" script, which is the classic beginner-friendly expansion. It features:
- 13 Townspeople (镇民)
- 4 Outsiders (外来者)
- 4 Minions/Cultists (爪牙)
- 1 Demon (恶魔)

---

## Project Structure Overview

```
The-Bloody/
├── 📖 Documentation
│   ├── README.md (29KB) - Main guide in Chinese
│   ├── START_HERE.md - Navigation hub
│   ├── CODEBASE_ANALYSIS.md (27KB) - Deep technical reference
│   ├── QUICK_REFERENCE.md (9KB) - Quick start
│   ├── EXPLORATION_SUMMARY.txt (18KB) - Executive summary
│   └── DOCUMENTATION_INDEX.md - Navigation cross-references

├── 🎮 Single-Player Mode (Frontend)
│   ├── index.html (27KB) - Main game interface
│   ├── leaderboard.html (64KB) - AI tournament rankings
│   ├── viewer.html - Game replay/analysis tool
│   │
│   ├── js/ (20 files, ~8-9K lines)
│   │   ├── main.js - Entry point & event binding
│   │   ├── constants.js - 22 roles, game rules, prompts
│   │   ├── state.js - Game state persistence (localStorage)
│   │   ├── game-logic.js - Core game loop
│   │   ├── night-actions.js - Night phase resolution
│   │   ├── discussion.js - Day discussion & AI turns
│   │   ├── nomination.js - Voting mechanics
│   │   ├── private-chat.js - Secure messaging
│   │   ├── api.js - API calls & token tracking
│   │   ├── model-catalog.js - Model management
│   │   ├── prompts.js - AI prompt construction
│   │   ├── tts.js - Text-to-speech engine
│   │   ├── bgm.js - Background music player
│   │   ├── chat.js - Message rendering
│   │   ├── ui-helpers.js - UI components
│   │   ├── settings.js - Settings panel
│   │   ├── export.js - Save/replay export
│   │   └── utils.js - Helper functions
│   │
│   ├── css/ (11 files)
│   │   ├── variables.css - Color scheme, fonts
│   │   ├── base.css - Base styles
│   │   ├── layout.css - Main 3-column layout
│   │   ├── players.css - Player seats (circular arrangement)
│   │   ├── chat.css - Chat area
│   │   ├── phases.css - Phase indicator
│   │   ├── themes.css - Day/night theme toggle
│   │   ├── bgm.css - Music player
│   │   └── responsive.css - Mobile adaptation
│   │
│   ├── music/ (15 tracks, 140MB)
│   │   └── Thematic background music for game phases
│   │
│   └── model_catalog.yaml - API key configuration

├── 🏆 AI Benchmark System (Node.js)
│   ├── benchmark/
│   │   ├── config.js (51 lines) - Tournament setup & model list
│   │   ├── engine.js (2,965 lines) - Main game engine
│   │   ├── llm.js (197 lines) - LLM API wrapper
│   │   ├── run.js (345 lines) - Main orchestrator
│   │   ├── schedule.js (361 lines) - Fair tournament bracket
│   │   ├── stats.js (223 lines) - Results analyzer
│   │   ├── gen-index.js (29 lines) - File indexer
│   │   ├── role_boards.json (97 lines) - 5 preset board configs
│   │   ├── role_assignment.txt - Human-readable boards
│   │   └── README.md (550 lines) - Benchmark guide
│   │
│   └── results/ (generated)
│       ├── <timestamp>/
│       │   ├── raw/
│       │   │   ├── game_001.json - Full game state
│       │   │   └── game_001_trajectories/ - Per-player LLM logs
│       │   └── leaderboard.json - Tournament results
│       └── leaderboard.json - Final rankings

└── 📸 Supporting Files
    ├── pictures/ - Game art (1 image)
    ├── package.json - NPM dependencies
    ├── begin_qwen.mp4 (9.2MB) - Opening animation
    └── progress.md - Development notes
```

**Total codebase**: ~14,284 lines across 30+ files

---

## The 22 Roles

### Townspeople (13 roles) - Information Gatherers

| Role | Ability | Notes |
|------|---------|-------|
| **Laundress** (洗衣妇) | First night: learn if one of two players is a specific townsperson | Information role |
| **Librarian** (图书管理员) | First night: learn if one of two players is an outsider (or none exist) | Information role |
| **Investigator** (调查员) | First night: learn if one of two players is a minion | Information role |
| **Chef** (厨师) | First night: learn count of adjacent evil players (0-3 pairs) | Information role |
| **Empath** (共情者) | Each night: learn evil count among adjacent neighbors (0/1/2) | Ongoing info |
| **Fortune Teller** (占卜师) | Each night: pick two players, learn if demon present (includes decoy) | Ongoing info |
| **Undertaker** (送葬者) | Each night (after first): learn role of today's executed player | Delayed info |
| **Raven** (守鸦人) | If killed at night: wake up and learn one player's role | Death-triggered |
| **Chastity** (贞洁者) | When nominated first by a townsperson: that nominor dies | Reactive power |
| **Slayer** (猎手) | Once per game: public declaration kills demon if target | Combat role |
| **Soldier** (士兵) | Immune to demon's nightly kill | Defense role |
| **Mayor** (镇长) | Three players alive + no execution = good wins (Mayor Day) | Win condition |
| **Monk** (僧侣) | Each night (after first): protect one player from demon kill | Defense role |

### Outsiders (4 roles) - Miscellaneous Good Players

| Role | Ability | Notes |
|------|---------|-------|
| **Butler** (管家) | Each night: choose a "master"; next day can only vote with master | Restriction role |
| **Drunk** (酒鬼) | Thinks they're a townsperson but isn't; skills fail, info unreliable | Decoy role |
| **Recluse** (陌客) | May be detected as evil/minion/demon; pollutes information | Pollution role |
| **Saint** (圣徒) | If executed: good loses immediately | Penalty role |

### Minions (4 roles) - Evil Servants

| Role | Ability | Notes |
|------|---------|-------|
| **Poisoner** (投毒者) | Each night: poison one player (skill fails, info unreliable) | Sabotage |
| **Spy** (间谍) | Each night: view grimoire; may register as good/townsperson/outsider | Information thief |
| **Scarlet Woman** (红唇女郎) | If demon dies (≥5 alive): become new demon | Succession |
| **Baron** (男爵) | Adds +2 outsiders, -2 townspeople to game | Composition change |

### Demon (1 role)

| Role | Ability | Notes |
|------|---------|-------|
| **Demon** (小恶魔) | Each night (after first): kill one player; can self-kill to transfer | Leader |

---

## Game Flow & Rules

### Phase Sequence

```
┌─────────────────────────────────────┐
│  GAME SETUP                          │
│  • Assign roles (using preset board) │
│  • Give private info to info roles   │
└────────────┬────────────────────────┘
             │
    ┌────────▼────────┐
    │  FIRST NIGHT    │
    │  • Abilities    │ Demon doesn't kill
    │  • Poison       │ on first night
    │  • Gather info  │
    └────────┬────────┘
             │
    ┌────────▼──────────────────────────────┐
    │  EVIL MINIONS' SECRET CHAT             │
    │  (Before first public discussion)      │
    │  • Minions learn each other           │
    │  • Learn 3 false identities (bluffs)  │
    │  • Coordinate cover stories          │
    └────────┬──────────────────────────────┘
             │
    ┌────────▼──────────────┐
    │  FIRST DAY            │
    │  • Public discussion  │
    │  • PRIVATE CHAT (!)   │ Only today
    │  • 3 rounds of talk   │
    └────────┬──────────────┘
             │
    ┌────────▼───────────────┐
    │  NOMINATION & VOTING   │
    │  • Each player nominate│
    │  • Defended + vote     │
    │  • Execute if >50%     │
    └────────┬───────────────┘
             │
    ┌────────▼─────────────┐
    │ CHECK WIN CONDITIONS  │
    │ • Demon dead? Good    │
    │ • 2 alive+demon? Evil │
    │ • Saint executed?Evil │
    │ • Mayor day? Good     │
    └────────┬─────────────┘
             │
    ┌────────▼──────────────┐
    │  DAY 2+ NIGHT         │
    │  • Demon kills        │
    │  • Other abilities    │
    └────────┬──────────────┘
             │
    └────────┼──────────────────→ (Repeat day → night)
             │
             ◀─ WIN CONDITIONS OR MAX DAYS

```

### Key Mechanics

**Information System**:
- Each info role has unique knowledge
- Drunk/poisoned players receive incorrect/failed info
- Spy/Recluse can pollute info roles
- LLM Storyteller dynamically decides info truthfulness

**Evil Teamwork**:
- Minions learn demon's identity
- Demon learns all minions
- First night secret chat before public discussion
- Can reveal true identities only to each other

**Death & Voting**:
- Dead players still speak and have ONE dead vote (遗言票)
- Votes must exceed 50% to execute
- Slayer can kill (must use exact format)
- Chastity triggers if nominated by townsperson

### Win Conditions

| Condition | Winner | Notes |
|-----------|--------|-------|
| Demon executed or killed by Slayer | Good | Scarlet Woman can replace |
| 2 players alive + demon alive | Evil | Time pressure wins |
| Saint executed | Evil | Immediate loss |
| 3 players + no execution | Good | Mayor day rule |
| Max days exceeded | Draw | Safety limit |

---

## AI Integration & LLM System

### Supported Models (40+)

The system uses **OpenRouter** as a unified interface, supporting:

- **OpenAI**: GPT-5.4, GPT-5, GPT-5.1
- **Anthropic**: Claude Opus 4.6, Sonnet 4.5, Haiku
- **Google**: Gemini 3.1 Pro, 3.1 Flash
- **DeepSeek**: V3.2, V3, Chat, Reasoner
- **Alibaba**: Qwen 3.5 397B, 3.0 235B
- **Xiaomi**: MiMo V2 Pro, V2 Omni
- **And 15+ more**: MiniMax, Grok, Step, GLM, Kimi, Seed, etc.

### Default Tournament Lineup (12 models)

1. GPT-5.4
2. Gemini 3.1 Pro
3. Claude Sonnet 4.6
4. MiMo V2 Pro
5. MiniMax M2.7
6. Grok 4.20 Beta
7. DeepSeek V3.2
8. Qwen 3.5 397B
9. Seed 2.0 Lite
10. Step 3.5 Flash
11. GLM-5
12. Kimi K2.5

### LLM Features

**Reasoning/Extended Thinking**:
- All LLM calls enable `reasoning: { effort: "high" }`
- Models that support extended thinking return full reasoning chains
- Recorded in trajectory logs for analysis

**Cost Tracking**:
- 3-layer cost estimation:
  1. API response `usage.cost` (if available)
  2. API response `total_cost` (fallback)
  3. Local pricing table (final fallback)
- Tracks cost source for debugging
- Real-time display during gameplay

**Retry Logic**:
- Rate limits (429): Exponential backoff with `Retry-After` header
- Server errors (5xx): Exponential backoff
- Timeouts: Automatic retry (max 3 times)
- Configurable timeout (default 120s)

---

## Single-Player Mode Features

### 🎮 Gameplay Features

1. **AI Storyteller**
   - LLM-driven decision making
   - Dynamically decides info truthfulness
   - Generates reasonable game narration
   - Handles special cases (Chastity trigger, Slayer judgment, etc.)

2. **AI Players**
   - 12 positions filled with configurable models
   - Each AI maintains game context + role info
   - Generates discussion based on alignment and knowledge
   - Tracks private chat and personal insights

3. **Evil Minion Chat**
   - First night: minions learn each other (if enabled)
   - Pre-discussion: coordinate strategy + cover identities
   - Bluff identities provided to demon

4. **Session Compression**
   - Prevents context overflow on long games
   - Summarizes previous days from player perspective
   - Maintains all crucial information

5. **Incremental Chat System**
   - Only sends new messages to avoid duplication
   - Cursor tracking per player per session
   - ~60-70% token consumption reduction

### 🎙️ Audio & Media

**TTS System** (Text-to-Speech):
- 15 unique voice styles
  - Adult male (deep magnetic voice)
  - Young female (energetic/cute)
  - Various regional accents
  - Comedy/dramatic styles
- Integration with mimo-v2-tts engine
- Per-player voice assignment
- Volume control

**Background Music**:
- 15 curated tracks (140MB total)
- Themed by game phase:
  - Opening ceremony (intense themes)
  - Discussion (deduction music)
  - Critical moments (dramatic)
  - Night phase (mysterious)
  - Victory/defeat (emotional)
- Can be toggled on/off
- Volume control independent of TTS

**Opening Animation**:
- 9.2MB video (begin_qwen.mp4)
- Skippable introduction
- Sets game atmosphere

### 💬 Communication

1. **Public Chat**
   - All players see all messages
   - AI and human can speak
   - Searchable by player/keyword
   - Message history maintained

2. **Private Chat** (First day only)
   - Player selects target
   - LLM decides whether to initiate
   - Only visible to both participants
   - Used for info exchange (good) or coordination (evil)

3. **Voice Input**
   - Browser Web Speech API support
   - Convert speech to text
   - Submit as regular message

### 📊 Dashboard Elements

**Left Panel - Town Square**:
- Circular seat arrangement (all players visible)
- Living/dead status with colors
- Click-to-annotate role guesses
- Add status tags and notes
- Per-player model selection
- Role distribution summary
- Token usage & cost tracking

**Center Panel - Chat & Actions**:
- Public/private chat tabs
- Chronological message display
- @ mention support
- Slayer format button (quick declare)
- Voice input button
- Important event log

**Right Panel - Personal Info**:
- Your assigned role (revealed at game end)
- Your secret info from night actions
- Upcoming night actions (if applicable)
- Current objectives
- Personal event timeline

**Bottom - BGM Player**:
- Track selection
- Play/pause controls
- Volume slider
- Role board reference (quick view)

### 🎯 Configuration Options

**Game Settings**:
- Player count: 5-15
- Your name/seat/role (or random)
- AI model distribution (uniform or random)

**Model Configuration**:
- Default model selector
- Temperature control (0-1)
- Discussion time limit
- Model health check button

**Game Control**:
- Auto-night resolution toggle
- LLM trajectory recording
- Manual pause/resume buttons
- Force nomination/voting buttons
- Game reset button

**Audio**:
- TTS on/off toggle
- Voice volume slider
- BGM volume slider

---

## AI Benchmark/Arena System

### 🏆 Tournament Structure

**Preset Board Configuration**:
- 5 professionally designed board setups
- Each board: 12 role assignments + bluffs + decoy
- Ensures balanced gameplay (not random)
- Verified for fairness

**Fair Rotation Algorithm** (Latin Square):
- 12 models × 12 games per board group
- Each model plays each seat exactly once
- Eliminates positional bias
- Perfect reproducibility with seeded PRNG

**Tournament Layout**:
- 5 board groups available
- 12 games per group
- 60 total games possible
- Customizable game count via `--limit`

### 🎮 Game Configuration

| Parameter | Value |
|-----------|-------|
| Players | 12 (fixed) |
| Roles | 1 demon + 2 minions + 2 outsiders + 7 townspeople |
| Temperature | 0.6 (stable responses) |
| Timeout | 120 seconds per LLM call |
| Max retries | 3 (with exponential backoff) |
| Discussion rounds | 3 per day |
| Max nominations | 3 per day |
| Max days | 10 (safety limit) |

### 📈 Measurement

**Leaderboard Metrics**:
- Win rate (overall)
- Win rate by role (demon/minion/townspeople/outsider)
- Evil team win rate
- Good team win rate
- Average cost per game
- Average tokens per game
- Total games played

**Detailed Analysis**:
- Per-game results (winner, win condition, duration)
- Token usage breakdown
- Cost breakdown
- Role-specific performance
- Team performance comparison

### 🔍 Game Replay & Analysis

**Trajectory Files** (JSONL format):
- Per-player logs with all LLM interactions
- Includes system prompt + user message + assistant response
- Reasoning chains (if model supports extended thinking)
- Timestamp for each interaction

**Game JSON**:
- Full game state at end
- All player assignments
- Chat history (public + private + evil)
- Voting/nomination records
- Execution order
- Token usage per player
- Cost tracking

**Viewer Interface** (viewer.html):
- Game selection from dropdown
- Message filtering by player
- Timeline visualization
- Role reveal at end
- Trajectory inspection

### 🚀 Usage Pattern

**Quick Test**:
```bash
node benchmark/run.js --limit 2
```
- Runs 2 games
- Takes ~10 minutes
- Tests connectivity and basic functionality

**Full Tournament**:
```bash
node benchmark/run.js --board-group 1
```
- Runs all 12 games from board group 1
- Takes ~1-3 hours
- Generates leaderboard

**Multi-Board Tournament**:
```bash
for i in 1 2 3 4 5; do
  node benchmark/run.js --board-group $i
done
node benchmark/stats.js --scan-all
```
- Runs all 60 games (5 × 12)
- Takes ~6-10 hours
- Comprehensive model comparison

**Resume After Interrupt**:
```bash
node benchmark/run.js --run-tag my_run_01
# Automatically continues from last completed game
```

---

## Configuration Files

### model_catalog.yaml (Single-Player)

Specifies API keys and model providers:

```yaml
api_keys:
  mimo: "YOUR_MIMO_KEY"
  deepseek: "YOUR_DEEPSEEK_KEY"
  gemini: "YOUR_GEMINI_KEY"
  claude: "YOUR_CLAUDE_KEY"
  gpt: "YOUR_GPT_KEY"
  openrouter: "YOUR_OPENROUTER_KEY"

providers:
  deepseek:
    label: "DeepSeek"
    base_url: "https://api.deepseek.com/v1"
    protocol: "openai"
    models:
      - "deepseek-chat"
      - "deepseek-reasoner"
```

### config.js (Benchmark)

Tournament parameters:

```javascript
module.exports = {
  totalGames: 12,
  playerCount: 12,
  seed: 42,
  boardFile: "./benchmark/role_boards.json",
  boardGroup: 1,
  maxDays: 10,
  discussionRounds: 3,
  temperature: 0.6,
  timeoutMs: 120000,
  maxRetries: 3,
  storytellerModel: "google/gemini-3.1-pro-preview",
  models: [ /* 12 models */ ],
  openrouterApiKey: process.env.OPENROUTER_API_KEY
};
```

### role_boards.json (Preset Boards)

5 professionally designed board configurations:

```json
{
  "board_1": {
    "roles": ["洗衣妇", "小恶魔", /* ... */, "投毒者"],
    "bluffs": ["占卜师", "送葬者", "圣徒"],
    "redHerring": null
  },
  /* 4 more boards */
}
```

Each board includes:
- Exact seat assignments
- Demon's 3 false identities
- Fortune Teller's decoy player

---

## Tech Stack & Architecture

### Frontend (Single-Player)

**Technologies**:
- HTML5 Canvas (for circular seat arrangement)
- CSS Grid/Flexbox (responsive layout)
- ES6 JavaScript (modular, imported modules)
- LocalStorage API (game persistence)
- Web Speech API (voice input)
- Fetch API (LLM calls)

**Architecture**:
- Pure frontend (no backend server required)
- Direct API calls to model providers
- Browser-based state management
- localStorage for save/resume

**Performance**:
- ~14-30MB bundle (including music)
- Loads instantly
- Responsive UI with game threading

### Backend (Benchmark)

**Technologies**:
- Node.js 18+ (native fetch support)
- OpenRouter API (unified LLM routing)
- Seeded PRNG (mulberry32)
- JSONL format (trajectory logging)

**Architecture**:
- CLI orchestrator (`run.js`)
- Game engine (`engine.js`)
- LLM wrapper (`llm.js`)
- Tournament scheduler (`schedule.js`)
- Results analyzer (`stats.js`)

**Performance**:
- ~3-5 minutes per game
- ~120-180 seconds per game (12 players)
- Parallelizable to 60 games in 6-10 hours
- Disk: 10-20MB per 60-game run

### API Integration

**OpenRouter Specifics**:
- Unified endpoint for 40+ models
- HTTP-Referer header required
- Support for custom base_url (for proxies)
- Pricing table fallback
- Retry logic with exponential backoff

**Features Enabled**:
- Reasoning: `{ effort: "high" }`
- Stream: false (we want full response at once)
- Token usage tracking
- Error message preservation

---

## Game Mechanics Deep Dive

### Information System

**How Info Roles Work**:

1. **First Night Info** (Laundress, Librarian, Investigator, Chef):
   - Each gets specific information type
   - May be affected by Drunk/Poisoned
   - May be corrupted by Spy/Recluse
   - Stored in player's private data

2. **Ongoing Info** (Empath, Fortune Teller, Undertaker):
   - Checked each night
   - Subject to same corruption
   - Cumulative knowledge advantage

3. **Death-Triggered Info** (Raven):
   - Only if killed at night
   - Single query for one role
   - Powerful but death-dependent

4. **Registration System** (Spy/Recluse):
   - Storyteller LLM decides registration profile
   - Can register as good/townsperson/outsider (Spy)
   - Can register as evil/minion/demon (Recluse)
   - Affects how info roles see them

### Evil Team Mechanics

**First Night Secret Chat**:
- Happens after all first night abilities
- Before first public discussion
- Minions learn:
  - Demon's identity
  - Other minions' identities
  - 3 false identities (bluffs)
- Demon learns:
  - All minions' identities
  - 3 false identities to use

**Evil Coordination**:
- Can verify each other publicly (only evil members know)
- Can edit who uses which bluff identity
- Can coordinate discussion strategy
- Private evil chat available in private messages

### Special Mechanics

**Chastity (贞洁者)**:
- Only triggers on FIRST nomination
- Only if nominator is townsperson
- Immediate execution of nominator
- One-time use per game

**Slayer (猎手)**:
- Must use exact format: "我是猎手，我要向玩家X开枪"
- Only one shot per game per player (first declaration counts)
- Only works if target is demon
- Only works if slayer is alive and not poisoned
- Can be used as bluff (failed shot proves nothing)

**Scarlet Woman (红唇女郎)**:
- Activates when demon dies (not killed by Slayer during day)
- Only if 5+ players alive
- Becomes new demon
- Game continues until new demon dies

**Mayor (镇长)**:
- Activates when exactly 3 players alive
- AND white day has no execution
- Immediate good team victory
- One condition, not a repeated mechanic

---

## Visual Design & Branding

### UI Theme

**Colors** (Dark mode + Light mode):
- Primary: Deep red (#8B0000 evil), Blue (#1E40AF good)
- Accent: Gold (#D4AF37)
- Background: Dark charcoal or light gray
- Text: White or dark, high contrast

**Typography**:
- Header: Bold serif (game titles)
- Body: Clean sans-serif (readability)
- Code: Monospace (console output)
- Chinese: Simplified Chinese font

**Layout**:
- 3-column main interface
  - Left: Town square (seats + status)
  - Center: Chat + actions
  - Right: Personal info
- Responsive (adapts to smaller screens)
- Circular seat arrangement (symbolic of council)

### Branding Elements

**Game Atmosphere**:
- Detective mystery theme (Conan inspiration - see BGM)
- Board game aesthetic (elegant, strategic)
- Chinese culture (simplified characters, cultural music)
- Professional presentation (not cartoonish)

**Visual Assets**:
- 1 game board image (trouble_brewing.jpg)
- 15 atmospheric music tracks
- Opening video (Qwen model promo)
- No 3D graphics or heavy animations

### User Experience Priorities

1. **Clarity**: All information visible at glance
2. **Usability**: One-click actions for common tasks
3. **Accessibility**: High contrast, keyboard navigation
4. **Performance**: Instant feedback, no loading screens
5. **Immersion**: BGM, voice, visual transitions

---

## Extension Points

### Adding a New Model

1. **For Single-Player**:
   ```yaml
   # In model_catalog.yaml
   providers:
     my_provider:
       label: "My Model"
       base_url: "https://api.example.com/v1"
       api_key: "${my_api_key}"
       protocol: "openai"
       models:
         - "my-model-v1"
   ```

2. **For Benchmark**:
   ```javascript
   // In config.js
   models: [
     { id: "openai/gpt-5.4", label: "GPT-5.4" },
     { id: "provider/my-model-v1", label: "My Model" },
     // ... others
   ]
   ```

### Adding a New Role

1. **Define in constants.js**:
   ```javascript
   SCRIPT.roles.push({
     id: "1_99",
     name: "New Role",
     team: "townsfolk",
     ability: "Your ability description"
   });
   ```

2. **Implement in engine.js** (Night phase):
   ```javascript
   case "newrole":
     await handleNewRoleAbility(player, gameState);
     break;
   ```

3. **Update schedule.js** for board generation

4. **Add to role_boards.json** if adding to presets

### Adding a New Board Configuration

1. Create board JSON in role_boards.json with 12 roles + bluffs + decoy
2. Run validation script to ensure fairness
3. Update CLI to reference new board group number
4. Test with `--board-group N`

### Adding Analysis Features

- Modify `stats.js` for new leaderboard metrics
- Add fields to game JSON output
- Create visualization in `viewer.html`
- Export new data formats (CSV, etc.)

---

## Performance Characteristics

### Timing

| Scenario | Duration | Notes |
|----------|----------|-------|
| Single game (12 players) | 3-5 min | LLM calls dominate |
| 12-game tournament | 36-60 min | Linear scaling |
| 60-game full evaluation | 6-10 hours | Can batch |

### Token Usage

| Per Game | Typical |
|----------|---------|
| Average tokens | 40-80K |
| Average cost | $0.50-$2.00 |
| Full tournament | ~$30-$100 |

### Storage

| Per Game | Size |
|----------|------|
| Game JSON | 50-200 KB |
| Per player trajectory | 20-100 KB |
| Full 60-game run | 10-20 MB |

---

## Key Design Patterns

1. **Seeded Reproducibility**
   - All randomness uses mulberry32 PRNG
   - Seed: `config.seed * 1000 + gameIndex`
   - Enables exact reproduction of any game

2. **Multi-Layer Cost Estimation**
   - Try API response cost field
   - Fall back to local pricing table
   - Maintains transparency

3. **Session Compression**
   - Summarizes daily history
   - Preserves context
   - Prevents overflow on long games

4. **Incremental Chat Updates**
   - Only sends new messages
   - Cursor tracking per session
   - 60-70% token savings

5. **Fair Tournament Rotation**
   - Latin square algorithm
   - Each model each seat once
   - Eliminates positional bias

6. **LLM Registration System**
   - Storyteller decides spy/recluse registration
   - Creates information uncertainty
   - Adds game depth

7. **Comprehensive Trajectory Logging**
   - All LLM interactions recorded
   - Per-player JSONL files
   - Includes reasoning chains

---

## Documentation Structure

### For Quick Start
- **START_HERE.md** - Navigation and 5-minute overview
- **QUICK_REFERENCE.md** - Setup and common tasks

### For Developers
- **CODEBASE_ANALYSIS.md** - Complete technical reference
- **README.md** - Original project guide
- **benchmark/README.md** - Tournament system guide

### For Navigation
- **DOCUMENTATION_INDEX.md** - Cross-referenced hub
- **EXPLORATION_SUMMARY.txt** - Executive summary

**Total Documentation**: 2,000+ lines covering every aspect

---

## What You Can Do

✅ Run complete 12-player games with AI and humans
✅ Run full tournaments with 12 different LLM models
✅ Generate leaderboards and performance metrics
✅ Analyze game trajectories and LLM reasoning
✅ Configure custom model lineups
✅ Create new board configurations
✅ Add new roles to the game
✅ Export games for replay/analysis
✅ Track token usage and costs
✅ Compare model performance across roles
✅ Deploy for production use
✅ Extend with custom features

---

## Example Usage

### Running a Quick Test

```bash
export OPENROUTER_API_KEY="sk-or-v1-..."
cd benchmark
node run.js --limit 1
```

Output:
```
=== Blood on the Clocktower — AI Benchmark ===
Run tag: 20260417_143025
[1/1] Running game_001...
    [game_001] Night 1 start
    [game_001] Night 1 end | dead=none
    [game_001] Day 1 discussion start | rounds=3
    [game_001] Day 1 session compression done
    [game_001] Day 1 nomination start
    [game_001] Day 1 execution | Player 5
    ✓ game_001 done — good wins (demon_killed) — 4 days — $0.350 — 120s

Results saved to ./results/20260417_143025/raw/game_001.json
Trajectories saved to ./results/20260417_143025/raw/game_001_trajectories/ (13 files)
```

### Viewing Results

```bash
node stats.js
# Generates leaderboard.json
cat results/leaderboard.json | jq '.models[] | {model, games, overallWinRate}'
```

Output:
```json
{
  "model": "openai/gpt-5.4",
  "games": 12,
  "overallWinRate": 0.583
}
```

### Viewing Game Replay

```bash
node benchmark/gen-index.js
python3 -m http.server 8000
# Open http://localhost:8000/viewer.html
```

---

## Summary

**The Bloody** is a sophisticated, production-ready system for:

1. **Playing strategic games** with AI that understands social deduction
2. **Benchmarking LLMs** on complex multi-agent reasoning tasks
3. **Analyzing AI behavior** through detailed trajectory logging
4. **Fair tournament competition** using advanced scheduling algorithms
5. **Extensible game engine** supporting custom roles and configurations

With over 14,000 lines of carefully crafted code, comprehensive documentation, and professional game design, it represents a complete solution for evaluating LLM performance in challenging social reasoning environments.

---

**Status**: ✅ Production-ready, fully documented, battle-tested
**Last Updated**: 2026-04-17
**Total Documentation**: 2,000+ lines
**Codebase**: ~14,284 lines
**Supported Models**: 40+
**Features**: 22 roles, 2 game phases, 4 win conditions, tournament system, trajectory analysis

