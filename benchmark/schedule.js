/**
 * schedule.js — Role assignment scheduler for 120 games
 *
 * Ensures each of 12 models gets exactly:
 * - 10 games as demon
 * - 20 games as minion
 * - 90 games as good (townsfolk + outsider)
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');

// Seeded PRNG: mulberry32
function mulberry32(seed) {
  let s = seed | 0;
  return function () {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle(array, rng) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/* ── Role-team lookup (mirrors SCRIPT.roles in engine.js) ── */
const ROLE_TEAM = {
  "洗衣妇":"townsfolk","图书管理员":"townsfolk","调查员":"townsfolk","厨师":"townsfolk",
  "共情者":"townsfolk","占卜师":"townsfolk","送葬者":"townsfolk","僧侣":"townsfolk",
  "守鸦人":"townsfolk","贞洁者":"townsfolk","猎手":"townsfolk","士兵":"townsfolk","镇长":"townsfolk",
  "管家":"outsider","酒鬼":"outsider","陌客":"outsider","圣徒":"outsider",
  "投毒者":"minion","间谍":"minion","红唇女郎":"minion","男爵":"minion",
  "小恶魔":"demon"
};

function factionFromTeam(team) {
  if (team === "demon") return "demon";
  if (team === "minion") return "minion";
  return "good";
}

/**
 * Deduplicate model IDs by appending #1, #2, etc. to duplicates.
 * E.g. ["a", "a", "b"] → ["a#1", "a#2", "b"]
 */
function deduplicateModelIds(ids) {
  const counts = {};
  ids.forEach(id => { counts[id] = (counts[id] || 0) + 1; });
  const hasDupes = Object.values(counts).some(c => c > 1);
  if (!hasDupes) return ids;
  const seen = {};
  return ids.map(id => {
    if (counts[id] === 1) return id;
    seen[id] = (seen[id] || 0) + 1;
    return `${id}#${seen[id]}`;
  });
}

/**
 * Generate schedule from a preset board file (role_boards.json).
 * Each board defines 12 seats with fixed roles. 12 models rotate through
 * all 12 seats across 12 games, so every model plays every role once.
 */
function generateBoardSchedule() {
  const { models, boardFile, boardGroup } = config;
  if (models.length !== 12) throw new Error(`Expected 12 models, got ${models.length}`);

  const boardPath = path.resolve(boardFile);
  const boards = JSON.parse(fs.readFileSync(boardPath, "utf-8"));
  const board = boards[boardGroup - 1];
  if (!board) throw new Error(`Board group ${boardGroup} not found (file has ${boards.length} groups)`);

  // Deduplicate model IDs: if duplicates exist, append #1, #2, etc.
  const modelIds = deduplicateModelIds(models.map(m => m.id));
  const schedule = [];

  for (let i = 0; i < 12; i++) {
    const gameId = `game_${String(i + 1).padStart(3, "0")}`;
    const assignments = [];

    for (let seat = 0; seat < 12; seat++) {
      const modelIndex = (seat - i + 12) % 12;
      const bp = board.players[seat]; // board player entry
      const team = ROLE_TEAM[bp.roleName];
      if (!team) throw new Error(`Unknown role "${bp.roleName}" at board ${boardGroup} seat ${bp.seat}`);

      assignments.push({
        seat,
        modelId: modelIds[modelIndex],
        faction: factionFromTeam(team),
        roleName: bp.roleName,
        apparentRoleName: bp.apparentRoleName || "",
      });
    }

    schedule.push({
      gameId,
      groupIndex: 0,
      gameInGroup: i,
      seed: config.seed * 1000 + i,
      assignments,
      bluffs: board.bluffs || [],
      redHerringSeat: board.redHerringSeat != null ? board.redHerringSeat : -1,
    });
  }

  // Verify: each model occupies each seat exactly once
  for (let seat = 0; seat < 12; seat++) {
    const modelsAtSeat = new Set(schedule.map(g => g.assignments[seat].modelId));
    if (modelsAtSeat.size !== 12) throw new Error(`Seat ${seat + 1} does not have 12 unique models`);
  }
  for (const mid of modelIds) {
    const seats = schedule.map(g => g.assignments.findIndex(a => a.modelId === mid));
    if (new Set(seats).size !== 12) throw new Error(`Model ${mid} does not occupy 12 unique seats`);
  }

  console.log(`  [Schedule] Board mode: group ${boardGroup}, 12 games (rotation)`);
  console.log(`  [Schedule] Board verification passed`);
  return schedule;
}

/**
 * Generate the game schedule.
 * If config.boardFile is set, uses preset board rotation.
 * Otherwise, totalGames must be a multiple of 12 (one group = 12 games).
 * Each group ensures every model plays exactly 1 demon, 2 minion, 9 good.
 */
function generateSchedule() {
  if (config.boardFile) {
    return generateBoardSchedule();
  }
  const { models, seed, totalGames, playerCount, groups } = config;

  if (models.length !== 12) {
    throw new Error(`Expected 12 models, got ${models.length}`);
  }
  if (playerCount !== 12) {
    throw new Error(`Expected 12 players, got ${playerCount}`);
  }
  const groupCount = groups || Math.floor(totalGames / 12);
  const expectedTotal = groupCount * 12;
  if (totalGames !== expectedTotal) {
    throw new Error(`totalGames (${totalGames}) must equal groups * 12 (${expectedTotal})`);
  }

  const modelIds = models.map(m => m.id);
  const rng = mulberry32(seed);
  const schedule = [];
  const gamesPerGroup = 12;

  for (let g = 0; g < groupCount; g++) {
    // Each group: 12 games, each model plays exactly once as demon
    const demonOrder = seededShuffle(modelIds, rng);

    // Each model needs 2 minion slots in this group (24 total minion slots)
    // Constraint: minion can't be same model as demon in that game
    const minionAssignments = assignMinions(demonOrder, modelIds, rng);

    for (let i = 0; i < gamesPerGroup; i++) {
      const gameIndex = g * gamesPerGroup + i;
      const gameId = `game_${String(gameIndex + 1).padStart(3, "0")}`;
      const gameSeed = seed * 1000 + gameIndex;

      const demon = demonOrder[i];
      const minions = minionAssignments[i];

      // Remaining 9 models are good
      const goodModels = modelIds.filter(
        m => m !== demon && !minions.includes(m)
      );

      // Shuffle seat assignments
      const allModels = [demon, ...minions, ...goodModels];
      const factions = [
        "demon",
        "minion", "minion",
        ...Array(9).fill("good")
      ];

      // Shuffle together
      const indices = seededShuffle(
        Array.from({ length: 12 }, (_, idx) => idx),
        mulberry32(gameSeed)
      );

      const assignments = indices.map((origIdx, seat) => ({
        seat,
        modelId: allModels[origIdx],
        faction: factions[origIdx]
      }));

      schedule.push({
        gameId,
        groupIndex: g,
        gameInGroup: i,
        seed: gameSeed,
        assignments
      });
    }
  }

  // Verify
  verifySchedule(schedule, modelIds);
  return schedule;
}

/**
 * Assign minions for a group of 12 games.
 * Each game has 2 minion slots. Each model needs exactly 2 minion assignments.
 * Constraint: minion != demon in same game.
 */
function assignMinions(demonOrder, modelIds, rng) {
  // Build a pool: each model needs 2 minion assignments
  // 12 games × 2 minions = 24 slots = 12 models × 2

  const maxAttempts = 100;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const result = tryAssignMinions(demonOrder, modelIds, rng);
    if (result) return result;
  }

  // Fallback: relaxed assignment
  console.warn("  [Schedule] Using fallback minion assignment");
  return fallbackAssignMinions(demonOrder, modelIds, rng);
}

function tryAssignMinions(demonOrder, modelIds, rng) {
  // Create a pool of (model, slotIndex) pairs
  const pool = [];
  for (const m of modelIds) {
    pool.push(m, m); // each model appears twice
  }
  const shuffled = seededShuffle(pool, rng);

  const result = Array.from({ length: 12 }, () => []);
  let cursor = 0;

  for (let game = 0; game < 12; game++) {
    const demon = demonOrder[game];
    const assigned = [];

    while (assigned.length < 2 && cursor < shuffled.length) {
      const candidate = shuffled[cursor];
      cursor++;

      // Can't be same as demon, can't be duplicate in this game
      if (candidate !== demon && !assigned.includes(candidate)) {
        assigned.push(candidate);
      } else {
        // Put it back (swap with a later element)
        for (let j = cursor; j < shuffled.length; j++) {
          if (shuffled[j] !== demon && !assigned.includes(shuffled[j])) {
            [shuffled[cursor - 1], shuffled[j]] = [shuffled[j], shuffled[cursor - 1]];
            assigned.push(shuffled[cursor - 1]);
            break;
          }
        }
      }
    }

    if (assigned.length < 2) return null; // Failed
    result[game] = assigned;
  }

  return result;
}

function fallbackAssignMinions(demonOrder, modelIds, rng) {
  // Greedy approach with backtracking
  const remaining = {};
  for (const m of modelIds) remaining[m] = 2;

  const result = [];
  for (let game = 0; game < 12; game++) {
    const demon = demonOrder[game];
    const candidates = modelIds.filter(m => m !== demon && remaining[m] > 0);
    const picked = seededShuffle(candidates, rng).slice(0, 2);

    // If we can't get 2 unique non-demon candidates, just pick any available
    while (picked.length < 2) {
      const any = modelIds.find(m => m !== demon && remaining[m] > 0 && !picked.includes(m));
      if (any) picked.push(any);
      else break;
    }

    for (const m of picked) remaining[m]--;
    result.push(picked);
  }

  return result;
}

function verifySchedule(schedule, modelIds) {
  const groupCount = schedule.length / 12;
  const expectedDemon = groupCount;
  const expectedMinion = groupCount * 2;
  const expectedGood = groupCount * 9;
  const expectedTotal = schedule.length;

  const stats = {};
  for (const m of modelIds) {
    stats[m] = { demon: 0, minion: 0, good: 0, total: 0 };
  }

  for (const game of schedule) {
    const modelsInGame = new Set();
    for (const a of game.assignments) {
      if (modelsInGame.has(a.modelId)) {
        throw new Error(`Duplicate model ${a.modelId} in ${game.gameId}`);
      }
      modelsInGame.add(a.modelId);

      if (!stats[a.modelId]) {
        throw new Error(`Unknown model ${a.modelId}`);
      }

      if (a.faction === "demon") stats[a.modelId].demon++;
      else if (a.faction === "minion") stats[a.modelId].minion++;
      else stats[a.modelId].good++;
      stats[a.modelId].total++;
    }

    if (modelsInGame.size !== 12) {
      throw new Error(`${game.gameId} has ${modelsInGame.size} unique models, expected 12`);
    }
  }

  let ok = true;
  for (const m of modelIds) {
    const s = stats[m];
    if (s.demon !== expectedDemon) {
      console.warn(`  [Schedule] ${m}: demon=${s.demon} (expected ${expectedDemon})`);
      ok = false;
    }
    if (s.minion !== expectedMinion) {
      console.warn(`  [Schedule] ${m}: minion=${s.minion} (expected ${expectedMinion})`);
      ok = false;
    }
    if (s.good !== expectedGood) {
      console.warn(`  [Schedule] ${m}: good=${s.good} (expected ${expectedGood})`);
      ok = false;
    }
    if (s.total !== expectedTotal) {
      console.warn(`  [Schedule] ${m}: total=${s.total} (expected ${expectedTotal})`);
      ok = false;
    }
  }

  if (ok) console.log(`  [Schedule] Verification passed (${schedule.length} games, ${groupCount} groups)`);
}

module.exports = { generateSchedule, mulberry32, seededShuffle };
