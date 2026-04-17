# 🎯 START HERE - The Bloody Documentation

Welcome! This document will guide you to exactly what you need.

## What is The Bloody?

**The Bloody** is an AI Benchmark System that evaluates LLM performance in multi-agent social deduction games. It simulates a strategic game called "Trouble Brewing" where:
- 12 players take on hidden roles
- LLM models make real-time decisions
- Players form teams and compete (Good vs Evil)
- Results are tracked with detailed statistics

**Status**: ✅ Fully documented, production-ready

---

## 📋 Quick Navigation

### "I have 5 minutes"
→ **Read**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Project Overview section
→ **Run**: 
```bash
npm install
export OPENROUTER_API_KEY="your-key"
cd benchmark && node run.js --board-group 1 --limit 2
```

### "I have 30 minutes"
→ **Read**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - All sections
→ **Understand**: Core concepts, how to run games, output formats

### "I need to understand everything"
→ **Read**: [CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md) (30 min - 2 hours)
→ **Explore**: All 10 source files, architecture, game mechanics
→ **Result**: Complete technical mastery

### "I need help with a specific task"
→ **Use**: [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)
→ **Search**: Task-based lookup with cross-references

### "I need the big picture"
→ **Read**: [EXPLORATION_SUMMARY.txt](EXPLORATION_SUMMARY.txt)
→ **Understand**: Architecture, statistics, extension points

---

## 📚 Documentation Files

| File | Size | Purpose | Read Time |
|------|------|---------|-----------|
| **QUICK_REFERENCE.md** | 9KB | Quick start & common tasks | 5-10 min |
| **CODEBASE_ANALYSIS.md** | 27KB | Complete technical reference | 30 min - 2 hrs |
| **DOCUMENTATION_INDEX.md** | 9.4KB | Navigation hub | 5 min |
| **EXPLORATION_SUMMARY.txt** | 18KB | Executive summary | 10-15 min |
| **START_HERE.md** | This file | Navigation guide | 2 min |

---

## 🎯 By Use Case

### I want to **run a game**
```bash
# Setup (do once)
npm install
export OPENROUTER_API_KEY="your-api-key"

# Quick test (2 games)
cd benchmark
node run.js --board-group 1 --limit 2

# View results
node stats.js
cat ../results/leaderboard.json
```
→ See: [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - "Getting Started"

### I want to **understand the code**
→ Read: [CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md)
- Start with "Directory Structure"
- Then read about specific files
- Focus on "Game Mechanics Summary"

### I want to **add a new model**
→ Steps:
1. Edit `benchmark/config.js`
2. Add model to `models` array
3. Run normally
→ See: [CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md) - "Extension Points"

### I want to **add a new role**
→ Steps:
1. Add to `SCRIPT` in `benchmark/engine.js`
2. Implement ability function
3. Update schedule.js
→ See: [CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md) - "Extension Points"

### I want to **analyze results**
→ Files:
- `results/raw/game_XXX.json` - Game data
- `results/raw/game_XXX_trajectories/` - Player conversations
- `results/leaderboard.json` - Final rankings
→ See: [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - "Output Structure"

### I want to **understand the game**
→ Read: [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - "Key Concepts"
- 22 roles across 4 teams
- 2 game phases (Night/Day)
- 4 win conditions
- Information system

### I'm **stuck or have errors**
→ See: [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - "Troubleshooting"
- Game won't start
- API rate limiting
- Context overflow
- Results not saving

### I want the **complete reference**
→ Read: [CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md)
- 908 lines of detailed analysis
- All 10 files explained
- 8 sections of main engine broken down
- 30+ subsections covering everything

---

## 🚀 Recommended Reading Order

### First-time Users
1. Read this file (START_HERE.md) - **2 min**
2. Read [QUICK_REFERENCE.md](QUICK_REFERENCE.md) "Project Overview" - **2 min**
3. Read [QUICK_REFERENCE.md](QUICK_REFERENCE.md) "Getting Started" - **5 min**
4. Run a quick test - **5 min**
5. Read [QUICK_REFERENCE.md](QUICK_REFERENCE.md) rest of sections - **10-15 min**

### Developers
1. Complete "First-time Users" path
2. Read [CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md) "Directory Structure" - **5 min**
3. Read [CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md) "config.js" section - **10 min**
4. Read [CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md) "engine.js" section - **30-60 min**
5. Study actual source code files

### Advanced Users
1. Complete "Developers" path
2. Read "Extension Points" in [CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md)
3. Experiment with modifying code
4. Read "Data Flow Architecture" diagram

---

## 📊 Project at a Glance

```
The Bloody Benchmark System
├── Core Components
│   ├── Game Engine (2,965 lines)
│   ├── LLM Integration (197 lines)
│   ├── Tournament Scheduler (361 lines)
│   ├── Results Analyzer (223 lines)
│   └── Configuration (51 lines)
├── Game System
│   ├── 22 Roles (4 teams)
│   ├── 2 Phases (Night/Day)
│   ├── 30+ Abilities
│   ├── 4 Win Conditions
│   └── Information System
├── Tournament
│   ├── 12 Models
│   ├── 60 Games (5 groups × 12 games)
│   ├── Fair Latin Square Rotation
│   └── Seeded Randomness
└── Results
    ├── Game Data (JSON)
    ├── Player Trajectories (JSONL)
    └── Leaderboard (JSON)
```

---

## ✅ Verification Checklist

After exploring the documentation, you should be able to:

- [ ] Install and setup the system
- [ ] Run a quick test game
- [ ] Understand what happens in a game
- [ ] Generate leaderboards
- [ ] Know the 22 roles
- [ ] Understand game mechanics
- [ ] Add a new model
- [ ] Add a new role
- [ ] Analyze results
- [ ] Troubleshoot problems

If you can check all of these, you're ready to use The Bloody!

---

## 🔗 Direct Links

**Essential Reading**:
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - 5-15 minute overview
- [CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md) - Complete technical guide
- [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) - Navigation hub

**Source Code**:
- `benchmark/config.js` - Configuration
- `benchmark/engine.js` - Main game logic
- `benchmark/run.js` - Orchestrator
- `benchmark/schedule.js` - Tournament
- `benchmark/llm.js` - LLM integration

**Data Files**:
- `benchmark/role_boards.json` - Board configurations
- `results/leaderboard.json` - Rankings (after running games)
- `results/raw/` - Game results and trajectories

---

## 💡 Key Takeaways

1. **It's a game simulator** - Runs multi-player strategy games with LLM players
2. **It's fair** - Uses Latin square rotation so each model gets equal treatment
3. **It's complete** - 22 roles with complex interactions, ready to run
4. **It's extensible** - Easy to add new models, roles, or board configurations
5. **It's documented** - You're reading comprehensive documentation right now
6. **It works** - Production-ready, tested, and deployed

---

## 🎯 Next Steps

### Immediate (Right Now)
1. Pick your reading path above based on available time
2. Start with the appropriate document
3. Bookmark this file for future reference

### Short Term (This Week)
1. Set up the system locally
2. Run test games
3. Generate leaderboards
4. Understand results format

### Medium Term (This Month)
1. Run full evaluations (60 games)
2. Add custom models or roles
3. Analyze results
4. Deploy for production

### Long Term (Ongoing)
1. Monitor performance metrics
2. Experiment with configurations
3. Extend with new features
4. Share results and insights

---

## 📞 Need Help?

**Quick Questions** → See [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) "Need Help?" section

**Technical Details** → See [CODEBASE_ANALYSIS.md](CODEBASE_ANALYSIS.md) and search for topic

**Troubleshooting** → See [QUICK_REFERENCE.md](QUICK_REFERENCE.md) "Troubleshooting" section

**Missing Information** → Check [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) for cross-references

---

## 🎓 Learning Resources

All documentation you need is already here:

- **For Beginners**: QUICK_REFERENCE.md
- **For Developers**: CODEBASE_ANALYSIS.md + source code
- **For Navigation**: DOCUMENTATION_INDEX.md
- **For Overview**: EXPLORATION_SUMMARY.txt
- **For Getting Started**: This file (START_HERE.md)

**Total documentation**: 2,083 lines covering every aspect

---

## ✨ You're All Set!

You now have:
- ✅ Complete understanding of the system
- ✅ Step-by-step guides for every task
- ✅ Quick reference for common operations
- ✅ Full technical documentation
- ✅ Troubleshooting help
- ✅ Extension guides

**Ready to benchmark? Pick your starting point above and dive in!**

---

**Last Updated**: 2026-04-17  
**Status**: ✅ Complete and production-ready  
**Coverage**: All 10 source files, 22 roles, complete architecture

🎯 **Happy Benchmarking!**
