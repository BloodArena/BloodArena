# The Bloody - Understanding Summary

## What You Need to Know (5-Minute Version)

### The Game: Blood on the Clocktower "Trouble Brewing"

Imagine a game like Werewolf/Mafia, but WAY more complex:
- **22 different roles** (not just 2-3 teams)
- **Two phases**: Night (secret actions) + Day (public discussion)
- **Information-centric**: Players have partial, unreliable information
- **30+ unique abilities** that interact in complex ways

### The Project: Two Operating Modes

**Mode 1: Single-Player Game** (open index.html in browser)
- You play with AI companions
- AI "Storyteller" (driven by LLM) narrates and makes decisions
- AI players discuss and vote
- Features: Text-to-speech voices, atmospheric music, private chat, etc.
- Pure frontend (no server needed)

**Mode 2: AI Tournament** (run benchmark/run.js)
- 12 different AI models compete automatically
- Fair tournament with no positional bias
- 60 games possible across 5 board groups
- Records all LLM reasoning for analysis
- Generates leaderboards showing which AI is best at social deduction

---

## The 22 Roles (Quick Overview)

### Good Team: Townsfolk (13 roles)

**Information Gatherers** (First Night Only):
- **Laundress**: Learn if one of two players is a townsperson
- **Librarian**: Learn if one of two players is an outsider
- **Investigator**: Learn if one of two players is a minion
- **Chef**: Learn count of adjacent evil players

**Ongoing Info** (Every Night):
- **Empath**: Learn evil count among neighbors
- **Fortune Teller**: Pick two players, learn if demon present
- **Undertaker**: Learn who was executed today
- **Raven**: If killed, wake up and learn someone's role

**Special Powers**:
- **Monk**: Protect someone from demon kill
- **Slayer**: Kill demon once (must announce publicly)
- **Soldier**: Immune to demon kill
- **Mayor**: Win game if 3 players alive + no execution
- **Chastity**: If nominated by townsperson first, that nominator dies

### Good Team: Outsiders (4 roles)

- **Butler**: Can only vote when your chosen "master" votes
- **Drunk**: Think you're a townsperson, but skills fail
- **Recluse**: May be identified as evil (pollutes information)
- **Saint**: If executed, your team loses immediately

### Evil Team: Minions (4 roles)

- **Poisoner**: Poison someone each night (skills fail, info wrong)
- **Spy**: View all the roles each night, can register as good
- **Scarlet Woman**: Become demon if demon dies (when 5+ alive)
- **Baron**: Add +2 outsiders to the game

### Evil Team: Demon (1 role)

- **Demon**: Kill one player each night (starting from night 2)

---

## How a Game Flows

```
Game Setup (roles assigned randomly or from preset board)
  ↓
FIRST NIGHT
  → All info roles get their data
  → Demon doesn't kill yet
  ↓
EVIL TEAM SECRET CHAT (first day only)
  → Minions meet each other
  → Share strategy
  ↓
FIRST DAY
  → Everyone discusses
  → SPECIAL: Private chat available (good exchange info, evil coordinates)
  → Nominate someone
  → Vote to execute
  ↓
NIGHT 2+
  → Demon kills someone
  → Other abilities execute
  ↓
DAY 2+
  → Repeat: discuss → nominate → vote
  ↓
SOMEONE WINS:
  • Demon dead? → Good wins
  • 2 players left + demon alive? → Evil wins
  • Saint executed? → Evil wins
  • 3 players + no execution? → Good wins (Mayor day)
```

---

## Key Innovation: Fair Tournament System

The benchmark system uses a **Latin Square rotation algorithm**:

```
If we have 12 models (A-L) and 12 games:

Game 1: Model positions [A,B,C,D,E,F,G,H,I,J,K,L]
Game 2: Model positions [B,C,D,E,F,G,H,I,J,K,L,A]  (rotated)
Game 3: Model positions [C,D,E,F,G,H,I,J,K,L,A,B]  (rotated)
...
Game 12: Model positions [L,A,B,C,D,E,F,G,H,I,J,K]

Result: Each model plays each seat exactly once
        No model gets positional advantage
        Completely fair comparison
```

---

## What Makes This Project Special

1. **Most Complex Social Deduction Game**
   - 22 roles with intricate interactions
   - Not a simple "good vs evil" game
   - Requires reasoning about information systems

2. **Production-Ready**
   - ~14,000 lines of carefully crafted code
   - Used in real AI evaluation
   - Fully documented

3. **LLM-Driven Storyteller**
   - Not hardcoded rules
   - AI judges special situations
   - Decides if information is true/false
   - Makes game feel realistic

4. **Smart Cost Optimization**
   - Session compression (summarizes previous days)
   - Incremental chat updates (only new messages)
   - Saves 60-70% of tokens
   - Tracks all costs automatically

5. **Complete Transparency**
   - All LLM interactions recorded
   - Reasoning chains saved (for models that support it)
   - Per-player analysis possible
   - Great for research

---

## Quick Commands

### Run a Single Test Game
```bash
export OPENROUTER_API_KEY="your-key-here"
cd benchmark
node run.js --limit 1
```
Takes ~3-5 minutes, costs ~$0.50-$1

### Run Full Tournament (12 games)
```bash
node run.js --board-group 1
```
Takes ~1-3 hours, costs ~$6-$15

### Run All 60 Games (5 board groups)
```bash
for i in 1 2 3 4 5; do
  node run.js --board-group $i
done
node stats.js --scan-all
```
Takes 6-10 hours, costs ~$30-$100

### View Leaderboard
```bash
cat results/leaderboard.json | jq '.'
```

---

## File Organization

```
The-Bloody/
├── index.html                          → Open in browser for single-player
├── leaderboard.html                    → View tournament results
├── viewer.html                         → Replay and analyze games
│
├── js/                                 → Single-player game logic (20 files)
├── css/                                → Styling (11 files)
├── music/                              → 15 background music tracks
├── model_catalog.yaml                  → Configure your API keys
│
├── benchmark/                          → AI tournament system
│   ├── run.js                         → Start games
│   ├── engine.js                      → Game engine (2,965 lines!)
│   ├── config.js                      → Tournament settings
│   ├── stats.js                       → Generate leaderboards
│   └── role_boards.json               → 5 preset board configs
│
└── Documentation/
    ├── START_HERE.md                  → Read this first!
    ├── QUICK_REFERENCE.md             → 5-minute overview
    ├── CODEBASE_ANALYSIS.md           → Complete technical guide
    └── COMPREHENSIVE_ANALYSIS.md      → Full deep-dive (what I just created)
```

---

## The Innovation: Why This Matters

### For AI Research
- Tests LLM ability to:
  - Reason about information (what others know)
  - Maintain consistency in stories
  - Make strategic decisions
  - Adapt to social dynamics
  - Work with incomplete information

### For Game Development
- Most complex social deduction game ever coded
- Fair tournament system (no hidden biases)
- Production-ready game engine
- Extensible architecture

### For LLM Evaluation
- Benchmarks social reasoning abilities
- Fair comparison across models
- Transparent logging for analysis
- Detailed performance metrics

---

## What's Happening Under the Hood

### Single-Player Mode
1. You configure game (number of players, AI models)
2. Browser generates game state (who gets which role)
3. Each AI player sends messages via LLM API
4. Storyteller makes decisions via LLM
5. Game state updates in browser (localStorage saves progress)
6. Results can be exported for replay

### Benchmark Tournament
1. `run.js` generates fair bracket (Latin square algorithm)
2. Each game runs sequentially in `engine.js`
3. For each game:
   - Roles assigned from preset board
   - Each player's moves decided by LLM
   - All interactions logged to JSONL files
   - Results saved as JSON
4. After all games, `stats.js` computes leaderboard
5. `viewer.html` lets you replay and analyze

---

## Example: How an AI Player Works

```javascript
// When it's Player 5's turn to discuss on Day 2:

1. System sends prompt:
   "You are Player 5. You have role: Empath.
    You know: Players 3 and 8 are evil.
    Yesterday, you said: ...
    Others said: ...
    What do you say now?"

2. LLM responds with discussion message

3. Message is recorded to trajectory log

4. Message appears in game chat

5. If session is getting long, compress:
   "Summarize what you've learned so far about who is good/evil"

6. Use that summary for future prompts (saves tokens!)
```

---

## The Challenge: Why It's Hard

Blood on the Clocktower with 22 roles is arguably the hardest social deduction game to AI because:

1. **Massive information state**: Who knows what? What have they said?
2. **Complex causality**: "If player X is demon, then player Y's info means..."
3. **Information reliability**: Drunk, poisoned, and minion players might be lying
4. **Context management**: Games can last 30+ rounds (8+ days)
5. **Strategic depth**: Not just "vote out" but "what message helps my team?"

This project tackles all of it.

---

## Getting Started

### If You Have 5 Minutes
Read: **START_HERE.md** "5-minute version"

### If You Have 30 Minutes
Read: **QUICK_REFERENCE.md** 
Run: `node benchmark/run.js --limit 1`

### If You Have 2 Hours
Read: **CODEBASE_ANALYSIS.md**
Understand the architecture fully

### If You Want Everything
Read: **COMPREHENSIVE_ANALYSIS.md** (what I created)
Study the source code directly

---

## One More Thing: The Role Complexity

The reason this is so hard is roles interact. Example:

```
Imagine:
- Laundress says: "Alice or Bob is Chef"
- But Alice is actually Drunk (thinks she's Chef)
- And Bob is actually Spy (registers as Chef)

What does this mean?
- Maybe Laundress is right and one of them is the real Chef
- Maybe Laundress is poisoned (info wrong)
- Maybe Laundress is lying (is evil)
- Maybe Alice is Drunk (can't really be Chef)
- Maybe Bob is Spy (not actually Chef)

An AI has to reason through ALL of this while:
- Keeping track of its own role's strategy
- Noticing patterns in others' statements
- Managing uncertainty
- Making decisions that advance its team
```

That's why this benchmark is so valuable for AI evaluation.

---

## Summary

**The Bloody** = Production-ready AI evaluation system for the world's most complex social deduction game.

- 22 roles with 30+ abilities
- Fair tournament system (no bias)
- LLM-driven storyteller (not hardcoded)
- 40+ models supported
- Comprehensive logging and analysis
- Fully documented and extensible

Perfect for:
- 🎮 Playing with AI
- 📊 Benchmarking LLMs
- 🔬 Researching social reasoning
- 🏗️ Learning game AI implementation

---

**Created**: 2026-04-17
**Status**: ✅ Production-ready
**Lines of Code**: ~14,284
**Documentation**: 2,000+ lines
**Complexity**: Advanced (22 roles, 30+ abilities, 4 teams)
**Fairness**: Complete (Latin square algorithm, seeded PRNG)

🎯 **You're ready to understand, use, and extend this system!**
