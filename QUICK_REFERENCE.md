# The Bloody - Quick Reference Guide

## Project Overview
- **Type**: AI Benchmark System for Social Deduction Games
- **Language**: Node.js/JavaScript
- **Size**: ~12,000 lines of code across 10 files
- **Purpose**: Evaluate LLM performance in multi-agent strategic scenarios
- **Game**: "Trouble Brewing" variant with 22 roles across 4 teams

## Getting Started

### Installation
```bash
npm install  # Install Node.js dependencies
export OPENROUTER_API_KEY="your-key-here"  # Set API key
```

### Quick Start (Test with 2 games)
```bash
node benchmark/run.js --board-group 1 --limit 2
```

### Full Evaluation (60 games, 5 groups × 12 games)
```bash
node benchmark/run.js --board-group 1
node benchmark/run.js --board-group 2
# ... repeat for groups 3-5
```

### Generate Leaderboard
```bash
node benchmark/stats.js                    # Current run
node benchmark/stats.js --scan-all         # All runs
```

## File Directory

| File | Lines | Purpose |
|------|-------|---------|
| `config.js` | 51 | Global configuration (models, API, parameters) |
| `engine.js` | 2,965 | Core game engine with all mechanics |
| `llm.js` | 197 | LLM API wrapper for OpenRouter |
| `run.js` | 345 | Main orchestrator and entry point |
| `schedule.js` | 361 | Tournament bracket generator |
| `stats.js` | 223 | Results analyzer and leaderboard generator |
| `gen-index.js` | 29 | Results directory indexer for viewer |
| `README.md` | 405 | User documentation |
| `role_boards.json` | 97 | 5 balanced board configurations |
| `role_assignment.txt` | 5 | Human-readable board descriptions |

## Key Concepts

### The 22 Roles
**Townsfolk (13)**: Laundress, Librarian, Investigator, Chef, Empath, Fortuneteller, Undertaker, Monk, Raven, Virgin, Slayer, Soldier, Mayor

**Outsiders (4)**: Butler, Drunk, Hermit, Saint

**Minions (4)**: Poisoner, Spy, Scarlet Woman, Baron

**Demon (1)**: Demon (主要evil首脑)

### Game Flow
1. **Night 1**: Information roles gather data, demon kills
2. **Day**: Public discussion, nomination, voting, execution
3. **Repeat**: Night → Day until win condition met
4. **Win**: Demon dies, Saint executed, Good outnumbered, or Mayor wins

### 12 Models (Fair Tournament)
- GPT-5.4, Gemini 3.1 Pro, Claude Sonnet 4.6, MiMo V2 Pro, MiniMax M2.7
- Grok 4.20 Beta, DeepSeek V3.2, Qwen3.5 397B, Seed 2.0 Lite
- Step 3.5 Flash, GLM-5, Kimi K2.5

### Tournament Structure
- **Latin Square Rotation**: Each model plays each seat exactly once
- **5 Board Groups**: 5 professionally designed balanced boards
- **12 Games Per Group**: 12 models × 12 games = Fair comparison
- **60 Total Games**: 5 groups × 12 games = Complete evaluation

## Important Functions

### engine.js - Main Game Loop
```javascript
runOneGame(gameConfig)       // Main game orchestrator
resolveNight(state)          // Handle nighttime abilities
runDiscussion(state)         // Run day phase discussion
runNomination(state)         // Handle voting and execution
checkWin(state)              // Check all win conditions
```

### schedule.js - Tournament
```javascript
generateBoardSchedule()      // Generate 12-game schedule
deduplicateModelIds(ids)     // Handle duplicate model references
verifySchedule(schedule)     // Validate fairness constraints
```

### llm.js - API Integration
```javascript
callLLM(messages, model)     // Call LLM via OpenRouter
estimateCost(model, promptTokens, completionTokens)  // Calculate cost
lookupPricing(modelName)     // Get model pricing
```

### run.js - Orchestration
```javascript
runModelProbe()              // Test model connectivity
generateSchedule()           // Create bracket
runOneGame(gameConfig)       // Run individual game
exportTrajectories(result)   // Save per-player logs
```

### stats.js - Analysis
```javascript
generateLeaderboard()        // Generate rankings JSON
collectGameFiles(dir)        // Find game results
scanAllRuns(resultsRoot)     // Scan timestamped runs
```

## Configuration (config.js)

```javascript
models: [12 model specifications]      // Players
playerCount: 12                        // Players per game
groups: 5                              // Board groups
discussionRounds: 3                    // Day discussion rounds
seed: 42                               // PRNG seed
temperature: 0.6                       // LLM temperature
maxRetries: 5                          // API retry count
timeoutMs: 120000                      // 2 min timeout
storytellerModel: 'google/gemini-3.1-pro'
boardFile: './benchmark/role_boards.json'
boardGroup: 1                          // Which board to use
```

## Command-line Options

```bash
--limit N              # Run first N games (testing)
--board-group N        # Use board 1-5 (default: 1)
--progress MODE        # Progress output style
--run-tag TAG          # Custom results directory tag
--skip-probe           # Skip model connectivity test
--no-timestamp         # Fixed results directory name
```

## Output Structure

```
results/
├── raw/
│   ├── game_001.json                    # Compressed game result
│   ├── game_001_trajectories/
│   │   ├── Alice_gpt-5.4.jsonl         # Per-player message log
│   │   ├── Bob_gemini-3.1-pro.jsonl
│   │   └── ...12 players...
│   ├── game_002.json
│   └── ...
├── leaderboard.json                     # Final rankings
└── leaderboard_all.json                # Across all runs
```

## Game Result Structure (game_XXX.json)

```json
{
  "gameId": "game_001",
  "players": [
    {
      "id": 0,
      "name": "Alice",
      "model": "openai/gpt-5.4",
      "roleId": "小恶魔",
      "team": "demon",
      "alive": false,
      "won": false
    },
    // ... 11 more players
  ],
  "winner": "good",
  "winCondition": "demon_killed",
  "totalDays": 3,
  "totalNights": 3,
  "totalCost": 2.34,
  "tokenUsage": {
    "openai/gpt-5.4": {
      "promptTokens": 45000,
      "completionTokens": 12000,
      "totalTokens": 57000,
      "cost": 2.34
    }
    // ... per model
  },
  "durationMs": 180000,
  "chatLog": [
    {
      "phase": "day_1",
      "speaker": "Alice",
      "content": "I think Bob is suspicious...",
      "timestamp": "2026-04-17T15:30:45.123Z"
    }
    // ... all messages
  ]
}
```

## Leaderboard Structure (leaderboard.json)

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
      "totalWins": 27,
      "overallWinRate": 0.450,
      "demonWinRate": 0.333,
      "minionWinRate": 0.450,
      "townsfolkWinRate": 0.555,
      "outsiderWinRate": 0.400,
      "evilWinRate": 0.417,
      "goodWinRate": 0.513,
      "avgCostPerGame": 1.23,
      "avgTokensPerGame": 45000
    }
    // ... 12 models total, sorted by overallWinRate descending
  ]
}
```

## Key Design Patterns

1. **Seeded PRNG**: mulberry32 for reproducible randomness
2. **Session Compression**: Summarizes long games to prevent context overflow
3. **Incremental Chat**: Only sends new messages to reduce token waste (60-70% savings)
4. **Fair Tournament**: Latin square rotation eliminates positional bias
5. **Multi-layer Pricing**: API cost → local table → token estimate
6. **Trajectory Logging**: All interactions saved for post-game analysis

## Performance Metrics

| Metric | Value |
|--------|-------|
| Per-game duration | 3-5 minutes |
| Full evaluation | 6-10 hours |
| Avg tokens per game | 40,000-80,000 |
| Cost per game | $0.50-$2.00 |
| Full 60-game cost | $30-$100 |
| Storage per game | 50KB-200KB |

## Troubleshooting

### Game won't start
- Check `OPENROUTER_API_KEY` is set
- Verify models are accessible: `node benchmark/run.js --skip-probe`
- Check game config seed validity

### API rate limiting (429 errors)
- System automatically retries with exponential backoff
- Wait 5-30 seconds between runs
- Check OpenRouter account quota

### Context overflow errors
- Session compression activates automatically
- Increase `discussionRounds` if games end too quickly
- Check game is progressing (days incrementing)

### Results not saving
- Verify `results/raw/` directory exists or is creatable
- Check file permissions in directory
- Ensure sufficient disk space (20MB per full run)

## Extension Points

### Adding New Roles
1. Add to `SCRIPT` constant in engine.js
2. Implement `ai{RoleName}Action()` function
3. Add info generation `ai{RoleName}Info()`
4. Update `ROLE_TEAM` mapping in schedule.js

### Adding Models
1. Add to `models` array in config.js
2. Pricing auto-lookup in llm.js (add if new)
3. Automatically tested and rotated

### Custom Boards
1. Create new object in role_boards.json
2. Specify all 12 seat assignments
3. Set bluffs and red herring
4. Run with `--board-group N`

## Resources

- **Full Documentation**: `CODEBASE_ANALYSIS.md` (908 lines)
- **User Guide**: `README.md` in benchmark directory
- **Board Config**: `role_boards.json` (5 presets)
- **Results Viewer**: Supports JSONL format for trajectory analysis

---

For complete details, see **CODEBASE_ANALYSIS.md**
