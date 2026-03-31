/**
 * stats.js — Read raw game results and generate leaderboard.json
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');

function generateLeaderboard() {
  const rawDir = config.rawDir;
  const files = fs.readdirSync(rawDir).filter(f => f.endsWith('.json')).sort();

  if (!files.length) {
    console.warn("  [Stats] No game files found in", rawDir);
    return;
  }

  const modelMap = {};
  // Initialize all models from config
  for (const m of config.models) {
    modelMap[m.id] = {
      model: m.id,
      label: m.label,
      games: 0,
      demonGames: 0, minionGames: 0, townsfolkGames: 0, outsiderGames: 0, goodGames: 0, evilGames: 0,
      demonWins: 0, minionWins: 0, townsfolkWins: 0, outsiderWins: 0, evilWins: 0, goodWins: 0, totalWins: 0,
      totalCost: 0, totalTokens: 0
    };
  }

  let totalGames = 0;
  let totalCost = 0;

  for (const file of files) {
    const filePath = path.join(rawDir, file);
    let game;
    try {
      game = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    } catch (e) {
      console.warn(`  [Stats] Skipping invalid file: ${file}`);
      continue;
    }

    totalGames++;
    totalCost += game.totalCost || 0;

    const winner = game.winner; // "good", "evil", "draw"
    const goodWon = winner === "good";
    const evilWon = winner === "evil";

    for (const player of game.players) {
      const modelId = player.model;
      if (!modelMap[modelId]) {
        modelMap[modelId] = {
          model: modelId, label: modelId,
          games: 0,
          demonGames: 0, minionGames: 0, townsfolkGames: 0, outsiderGames: 0, goodGames: 0, evilGames: 0,
          demonWins: 0, minionWins: 0, townsfolkWins: 0, outsiderWins: 0, evilWins: 0, goodWins: 0, totalWins: 0,
          totalCost: 0, totalTokens: 0
        };
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

      // Token/cost per model
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

  // Sort by overall win rate descending
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

  fs.writeFileSync(config.leaderboardPath, JSON.stringify(leaderboard, null, 2));

  // Print to terminal
  console.log(`\n  Leaderboard (${totalGames} games, $${totalCost.toFixed(2)} total):`);
  console.log("  " + "-".repeat(110));
  console.log(`  ${"Rank".padEnd(5)} ${"Model".padEnd(22)} ${"Overall".padEnd(9)} ${"Towns".padEnd(9)} ${"Outs".padEnd(9)} ${"Good".padEnd(9)} ${"Evil".padEnd(9)} ${"Demon".padEnd(9)} ${"Cost".padEnd(10)}`);
  console.log("  " + "-".repeat(110));
  models.forEach((m, i) => {
    const rank = String(i + 1).padEnd(5);
    const name = m.label.padEnd(22);
    const fmtRate = r => r !== null ? (r * 100).toFixed(1) + "%" : "N/A";
    console.log(`  ${rank} ${name} ${fmtRate(m.overallWinRate).padEnd(9)} ${fmtRate(m.townsfolkWinRate).padEnd(9)} ${fmtRate(m.outsiderWinRate).padEnd(9)} ${fmtRate(m.goodWinRate).padEnd(9)} ${fmtRate(m.evilWinRate).padEnd(9)} ${fmtRate(m.demonWinRate).padEnd(9)} ${"$" + m.totalCost.toFixed(3)}`);
  });
  console.log("  " + "-".repeat(110));
}

module.exports = { generateLeaderboard };
