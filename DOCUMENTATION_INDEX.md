# The Bloody - Documentation Index

This directory contains comprehensive documentation for **The Bloody**, an AI benchmark system for evaluating LLM performance in multi-agent social deduction games.

## 📚 Documentation Files

### 1. **CODEBASE_ANALYSIS.md** ⭐ PRIMARY REFERENCE
- **Length**: 908 lines, 27KB
- **Audience**: Developers who need deep technical understanding
- **Contents**:
  - Complete architecture overview
  - Detailed analysis of all 10 source files
  - 8 sections of engine.js broken down with functions explained
  - Game mechanics and win conditions
  - Data flow architecture with ASCII diagrams
  - 7 key design patterns explained
  - Extension points for adding new roles/models
  - Performance characteristics
  - 30+ subsections covering every aspect

**When to use**: You need to understand how something works or modify the system

### 2. **QUICK_REFERENCE.md** ⚡ QUICK START GUIDE
- **Length**: 230 lines, 9KB
- **Audience**: Anyone wanting to get started quickly
- **Contents**:
  - Project overview (1-2 sentences)
  - Installation and getting started (5 min)
  - File directory with line counts
  - Key concepts (roles, game flow, tournament structure)
  - Important functions (organized by file)
  - Configuration reference
  - Command-line options
  - Output structure examples
  - Troubleshooting section
  - Extension points

**When to use**: You want to understand what the project does or run it quickly

### 3. **README.md** 📖 ORIGINAL PROJECT GUIDE
- **Length**: 405 lines, 29KB
- **Audience**: End users and researchers
- **Contents**: (Check file for original project documentation)

**When to use**: Understanding original project intent and usage

---

## 🎯 Quick Navigation by Task

### "I want to understand the system quickly"
→ Start with **QUICK_REFERENCE.md**

### "I need to modify code or understand a specific feature"
→ See **CODEBASE_ANALYSIS.md** → search for relevant section

### "I want to run a test game"
→ **QUICK_REFERENCE.md** → "Getting Started" → "Quick Start"

### "I need to add a new role to the game"
→ **CODEBASE_ANALYSIS.md** → "Extension Points" → "Adding New Roles"

### "I need to understand the tournament algorithm"
→ **CODEBASE_ANALYSIS.md** → "schedule.js" section

### "I need to understand game mechanics"
→ **CODEBASE_ANALYSIS.md** → "Game Mechanics Summary"

### "I need to understand the LLM integration"
→ **CODEBASE_ANALYSIS.md** → "llm.js" section

### "I need to understand results format"
→ **QUICK_REFERENCE.md** → "Output Structure" section

---

## 📂 File Structure

```
The-Bloody/
├── benchmark/
│   ├── config.js                 # 51 lines - Global configuration
│   ├── engine.js                 # 2,965 lines - Core game engine
│   ├── llm.js                    # 197 lines - LLM API wrapper
│   ├── run.js                    # 345 lines - Main orchestrator
│   ├── schedule.js               # 361 lines - Tournament generator
│   ├── stats.js                  # 223 lines - Results analyzer
│   ├── gen-index.js              # 29 lines - Directory indexer
│   ├── role_boards.json          # 5 board configurations
│   ├── role_assignment.txt       # Human-readable boards
│   └── README.md                 # Original documentation
│
├── CODEBASE_ANALYSIS.md          # ⭐ Full technical analysis
├── QUICK_REFERENCE.md            # ⚡ Quick start guide
├── DOCUMENTATION_INDEX.md        # This file
└── ...other files...
```

---

## 🚀 Getting Started in 5 Minutes

```bash
# 1. Install dependencies
npm install

# 2. Set API key
export OPENROUTER_API_KEY="your-key"

# 3. Run test game (2 games)
cd benchmark
node run.js --board-group 1 --limit 2

# 4. Check results
node stats.js

# 5. View leaderboard
cat ../results/leaderboard.json
```

For more details, see **QUICK_REFERENCE.md** → "Getting Started"

---

## 📊 Project Statistics

| Metric | Value |
|--------|-------|
| Total Source Code | ~12,000 lines |
| Main Game Engine | 2,965 lines |
| Number of Files | 10 |
| Roles Implemented | 22 |
| Players per Game | 12 |
| Models Supported | 12 |
| Total Tournament Games | 60 (5 groups × 12 games) |
| Game Phases | Night, Day |
| Win Conditions | 4 major variants |
| Documentation Pages | 3 (this + CODEBASE_ANALYSIS + QUICK_REFERENCE) |

---

## 🎮 The Game: "Trouble Brewing"

A social deduction game variant where:
- **12 players** take on hidden roles across **4 teams**
- **Townsfolk (13 roles)** gather information and vote
- **Outsiders (4 roles)** are weakened good-team members
- **Minions (4 roles)** coordinate with the demon
- **Demon (1 role)** kills players each night

**Objective**:
- **Good**: Execute the demon and the minions
- **Evil**: Eliminate all good players or execute the Saint

---

## 🔑 Key Features

1. **Fair Tournament**: Latin square model rotation (each model plays each seat once)
2. **LLM Integration**: Unified API supporting 40+ models via OpenRouter
3. **Information Management**: 22 roles with complex ability interactions
4. **Reproducibility**: Seeded PRNG for consistent game sequences
5. **Cost Optimization**: Session compression and incremental chat updates
6. **Comprehensive Logging**: Full trajectory recording for analysis

---

## 📖 Reading Guide

**Beginner Path**:
1. Read "Project Overview" in QUICK_REFERENCE.md (2 min)
2. Read "Getting Started" section (3 min)
3. Read "Key Concepts" section (5 min)
4. Try running: `node benchmark/run.js --board-group 1 --limit 2` (5 min)

**Intermediate Path**:
1. Complete "Beginner Path" above
2. Read CODEBASE_ANALYSIS.md "Directory Structure" (5 min)
3. Read CODEBASE_ANALYSIS.md "Detailed File Analysis" → config.js (10 min)
4. Read QUICK_REFERENCE.md "Configuration" section (5 min)
5. Experiment with config.js settings

**Advanced Path**:
1. Complete "Intermediate Path"
2. Read CODEBASE_ANALYSIS.md → engine.js (30-60 min depending on depth)
3. Read CODEBASE_ANALYSIS.md → "Game Mechanics Summary" (10 min)
4. Read CODEBASE_ANALYSIS.md → "Extension Points" (10 min)
5. Start modifying code (add a new role, new model, custom board)

---

## 🛠️ Common Tasks

### Run a quick test
```bash
node benchmark/run.js --board-group 1 --limit 2
```
See: QUICK_REFERENCE.md "Getting Started"

### Run full evaluation
```bash
node benchmark/run.js --board-group 1
node benchmark/run.js --board-group 2
# ... repeat for 3-5
```
See: QUICK_REFERENCE.md "Getting Started"

### Generate leaderboard
```bash
node benchmark/stats.js
```
See: QUICK_REFERENCE.md "Generate Leaderboard"

### Scan all previous runs
```bash
node benchmark/stats.js --scan-all
```
See: CODEBASE_ANALYSIS.md "stats.js"

### Understand results
- Game data: `results/raw/game_001.json`
- Player logs: `results/raw/game_001_trajectories/`
- Leaderboard: `results/leaderboard.json`

See: QUICK_REFERENCE.md "Output Structure"

### Add a new model
1. Edit config.js, add to `models` array
2. Pricing auto-looked up in llm.js
3. Run normally, system auto-tests connectivity

See: CODEBASE_ANALYSIS.md "Extension Points" → "Adding New Models"

### Add a new role
1. Add to `SCRIPT` constant in engine.js
2. Implement `ai{RoleName}Action()` function
3. Add `ai{RoleName}Info()` for information generation
4. Update `ROLE_TEAM` mapping in schedule.js

See: CODEBASE_ANALYSIS.md "Extension Points" → "Adding New Roles"

### Create custom board
1. Add new object to role_boards.json
2. Specify 12 role assignments
3. Set bluffs and red herring
4. Run with `--board-group N`

See: CODEBASE_ANALYSIS.md "role_boards.json"

---

## 🔗 Cross-References

| Topic | Document | Section |
|-------|----------|---------|
| Quick start | QUICK_REFERENCE.md | Getting Started |
| Configuration | CODEBASE_ANALYSIS.md | config.js |
| Game engine | CODEBASE_ANALYSIS.md | engine.js (8 subsections) |
| Tournament | CODEBASE_ANALYSIS.md | schedule.js |
| LLM integration | CODEBASE_ANALYSIS.md | llm.js |
| Results | QUICK_REFERENCE.md | Output Structure |
| Adding roles | CODEBASE_ANALYSIS.md | Extension Points |
| Troubleshooting | QUICK_REFERENCE.md | Troubleshooting |
| Performance | CODEBASE_ANALYSIS.md | Performance Characteristics |

---

## 📝 Document Maintenance

- **CODEBASE_ANALYSIS.md**: Updated when code structure changes significantly
- **QUICK_REFERENCE.md**: Updated with each new feature or CLI option
- **DOCUMENTATION_INDEX.md**: This file, updated as new docs are added

**Last Updated**: 2026-04-17  
**Coverage**: All 10 source files analyzed  
**Status**: Complete and production-ready

---

## ✅ Checklist: What You Can Do Now

- [ ] Run a quick test game
- [ ] Generate a leaderboard
- [ ] Understand the tournament structure
- [ ] Know the 22 roles and their abilities
- [ ] Understand game phases (night → day)
- [ ] Know how to configure the system
- [ ] Understand the LLM integration
- [ ] Know how to add new models
- [ ] Know how to add new roles
- [ ] Understand results format and files
- [ ] Know how to extend the system

If you've checked all of these, you have a complete understanding of The Bloody system!

---

## 🆘 Need Help?

1. **Can't run the system?** → QUICK_REFERENCE.md "Troubleshooting"
2. **Want to understand the code?** → CODEBASE_ANALYSIS.md (search for topic)
3. **Want to modify something?** → CODEBASE_ANALYSIS.md "Extension Points"
4. **Want a quick overview?** → QUICK_REFERENCE.md "Project Overview"
5. **Want detailed explanation?** → CODEBASE_ANALYSIS.md (comprehensive reference)

---

**Happy benchmarking! 🎯**
