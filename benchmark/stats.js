/**
 * stats.js — Read raw game results and generate leaderboard.json
 *
 * Usage:
 *   require('./stats').generateLeaderboard()           — read from config.rawDir
 *   require('./stats').generateLeaderboard(gamePaths)   — read from explicit file list
 *
 * CLI (scan all timestamped runs):
 *   node benchmark/stats.js --scan-all
 *   node benchmark/stats.js --scan-all --out results/leaderboard_all.json
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');

/**
 * Collect all game_*.json file paths from a directory (non-recursive).
 */
function collectGameFiles(dir) {
  try {
    return fs.readdirSync(dir)
      .filter(f => /^game_\d+\.json$/.test(f))
      .sort()
      .map(f => path.join(dir, f));
  } catch (_) {
    return [];
  }
}

// Scan all timestamped run directories under results/ and collect game files.
// Looks for results/<tag>/raw/game_*.json
function scanAllRuns(resultsRoot = "./results") {
  const allFiles = [];
  let entries;
  try {
    entries = fs.readdirSync(resultsRoot, { withFileTypes: true });
  } catch (_) {
    return allFiles;
  }
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const rawDir = path.join(resultsRoot, entry.name, "raw");
    const files = collectGameFiles(rawDir);
    allFiles.push(...files);
  }
  // Also check results/raw/ directly (non-timestamped runs)
  const directFiles = collectGameFiles(path.join(resultsRoot, "raw"));
  allFiles.push(...directFiles);
  return allFiles.sort();
}

/**
 * Generate leaderboard from game result files.
 * @param {string[]|null} gamePaths - explicit list of game JSON paths, or null to read from config.rawDir
 * @param {string|null} outputPath - where to write leaderboard JSON, or null for config.leaderboardPath
 */
function generateLeaderboard(gamePaths = null, outputPath = null) {
  // Resolve file list
  let files;
  if (gamePaths && gamePaths.length) {
    files = gamePaths;
  } else {
    const rawDir = config.rawDir;
    files = collectGameFiles(rawDir);
  }

  if (!files.length) {
    console.warn("  [Stats] No game files found.");
    return;
  }

  const modelMap = {};
  // Initialize all models from config
  for (const m of config.models) {
    modelMap[m.id] = createModelEntry(m.id, m.label);
  }

  let totalGames = 0;
  let totalCost = 0;

  for (const filePath of files) {
    let game;
    try {
      game = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      console.warn(`  [Stats] Skipping invalid file: ${filePath}`);
      continue;
    }

    totalGames++;
    totalCost += game.totalCost || 0;

    const winner = game.winner;
    const goodWon = winner === "good";
    const evilWon = winner === "evil";

    for (const player of game.players) {
      const modelId = player.model;
      if (!modelMap[modelId]) {
        modelMap[modelId] = createModelEntry(modelId, modelId);
      }
      const entry = modelMap[modelId];
      entry.games++;

      const isEvil = player.team === "demon" || player.team === "minion";
      const isDemon = player.team === "demon";
      const isMinion = player.team === "minion";
      const isTownsfolk = player.team === "townsfolk";
      const isOutsider = player.team === "outsider";

      if (isDemon) entry.demonGames++;
      if (isMinion) entry.minionGames++;
      if (isTownsfolk) entry.townsfolkGames++;
      if (isOutsider) entry.outsiderGames++;
      if (isEvil) entry.evilGames++;
      if (!isEvil) entry.goodGames++;

      const won = (isEvil && evilWon) || (!isEvil && goodWon);
      if (won) {
        entry.totalWins++;
        if (isDemon) entry.demonWins++;
        if (isMinion) entry.minionWins++;
        if (isTownsfolk) entry.townsfolkWins++;
        if (isOutsider) entry.outsiderWins++;
        if (isEvil) entry.evilWins++;
        if (!isEvil) entry.goodWins++;
      }

      const usage = game.tokenUsage?.[modelId];
      if (usage) {
        entry.totalCost += usage.cost || 0;
        entry.totalTokens += usage.totalTokens || 0;
      }
    }
  }

  // Compute rates
  const models = Object.values(modelMap).map(e => ({
    ...e,
    demonWinRate: e.demonGames > 0 ? +(e.demonWins / e.demonGames).toFixed(3) : null,
    minionWinRate: e.minionGames > 0 ? +(e.minionWins / e.minionGames).toFixed(3) : null,
    townsfolkWinRate: e.townsfolkGames > 0 ? +(e.townsfolkWins / e.townsfolkGames).toFixed(3) : null,
    outsiderWinRate: e.outsiderGames > 0 ? +(e.outsiderWins / e.outsiderGames).toFixed(3) : null,
    evilWinRate: e.evilGames > 0 ? +(e.evilWins / e.evilGames).toFixed(3) : null,
    goodWinRate: e.goodGames > 0 ? +(e.goodWins / e.goodGames).toFixed(3) : null,
    overallWinRate: e.games > 0 ? +(e.totalWins / e.games).toFixed(3) : null,
    avgCostPerGame: e.games > 0 ? +(e.totalCost / e.games).toFixed(4) : 0,
    avgTokensPerGame: e.games > 0 ? Math.round(e.totalTokens / e.games) : 0
  }));

  models.sort((a, b) => (b.overallWinRate || 0) - (a.overallWinRate || 0));

  const leaderboard = {
    generatedAt: new Date().toISOString(),
    totalGames,
    totalCost: +totalCost.toFixed(3),
    config: {
      playerCount: config.playerCount,
      seed: config.seed,
      groups: config.groups,
      discussionRounds: config.discussionRounds
    },
    models
  };

  const outFile = outputPath || config.leaderboardPath;
  const outDir = path.dirname(outFile);
  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(outFile, JSON.stringify(leaderboard, null, 2));

  printLeaderboard(models, totalGames, totalCost);
  console.log(`  Leaderboard saved to ${outFile}`);
}

function createModelEntry(id, label) {
  return {
    model: id, label: label || id, games: 0,
    demonGames: 0, minionGames: 0, townsfolkGames: 0, outsiderGames: 0, goodGames: 0, evilGames: 0,
    demonWins: 0, minionWins: 0, townsfolkWins: 0, outsiderWins: 0, evilWins: 0, goodWins: 0, totalWins: 0,
    totalCost: 0, totalTokens: 0
  };
}

function printLeaderboard(models, totalGames, totalCost) {
  console.log(`\n  Leaderboard (${totalGames} games, $${totalCost.toFixed(2)} total):`);
  console.log("  " + "-".repeat(110));
  console.log(`  ${"Rank".padEnd(5)} ${"Model".padEnd(22)} ${"Overall".padEnd(9)} ${"Towns".padEnd(9)} ${"Outs".padEnd(9)} ${"Good".padEnd(9)} ${"Evil".padEnd(9)} ${"Demon".padEnd(9)} ${"Cost".padEnd(10)}`);
  console.log("  " + "-".repeat(110));
  const fmtRate = r => r !== null ? (r * 100).toFixed(1) + "%" : "N/A";
  models.forEach((m, i) => {
    console.log(`  ${String(i + 1).padEnd(5)} ${m.label.padEnd(22)} ${fmtRate(m.overallWinRate).padEnd(9)} ${fmtRate(m.townsfolkWinRate).padEnd(9)} ${fmtRate(m.outsiderWinRate).padEnd(9)} ${fmtRate(m.goodWinRate).padEnd(9)} ${fmtRate(m.evilWinRate).padEnd(9)} ${fmtRate(m.demonWinRate).padEnd(9)} ${"$" + m.totalCost.toFixed(3)}`);
  });
  console.log("  " + "-".repeat(110));
}

module.exports = { generateLeaderboard, scanAllRuns };

// CLI entry point
if (require.main === module) {
  const args = process.argv.slice(2);
  const scanAll = args.includes("--scan-all");
  let outPath = null;
  const outIdx = args.indexOf("--out");
  if (outIdx !== -1 && args[outIdx + 1]) {
    outPath = args[outIdx + 1];
  }

  if (scanAll) {
    console.log("Scanning all runs under results/ ...");
    const allFiles = scanAllRuns("./results");
    console.log(`  Found ${allFiles.length} game file(s)\n`);
    if (!allFiles.length) {
      console.log("  No game files found. Run some games first.");
      process.exit(0);
    }
    generateLeaderboard(allFiles, outPath || "./results/leaderboard_all.json");
  } else {
    console.log(`Reading from ${config.rawDir} ...`);
    generateLeaderboard(null, outPath);
  }
}
