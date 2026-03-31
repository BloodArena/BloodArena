#!/usr/bin/env node
/**
 * run.js — Main entry point for the benchmark.
 * Usage:
 *   node benchmark/run.js
 *   OPENROUTER_API_KEY=sk-xxx node benchmark/run.js
 *   node benchmark/run.js --limit 3
 */

const fs = require('fs');
const path = require('path');
const config = require('./config');
const { generateSchedule } = require('./schedule');
const { runOneGame } = require('./engine');
const { generateLeaderboard } = require('./stats');

// Parse CLI args
const args = process.argv.slice(2);
let limit = Infinity;
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--limit' && args[i + 1]) {
    limit = parseInt(args[i + 1], 10);
  }
}

async function main() {
  console.log("=== Blood on the Clocktower — AI Benchmark ===\n");

  // Validate
  if (!config.openrouterApiKey) {
    console.error("ERROR: OPENROUTER_API_KEY not set. Use env variable or edit config.js.");
    process.exit(1);
  }
  if (config.models.length !== 12) {
    console.error(`ERROR: Expected 12 models, got ${config.models.length}.`);
    process.exit(1);
  }

  // Create output dirs
  fs.mkdirSync(config.rawDir, { recursive: true });

  // Generate schedule
  console.log("Generating schedule...");
  const schedule = generateSchedule();
  console.log(`Schedule: ${schedule.length} games in ${config.groups} group(s)\n`);

  // Find completed games (for resume)
  const completedGames = new Set();
  try {
    const files = fs.readdirSync(config.rawDir);
    for (const f of files) {
      const match = f.match(/^game_(\d+)\.json$/);
      if (match) completedGames.add(parseInt(match[1], 10));
    }
  } catch (_) {}
  if (completedGames.size > 0) {
    console.log(`Found ${completedGames.size} completed game(s), resuming...\n`);
  }

  // Run games
  const effectiveLimit = Math.min(limit, schedule.length);
  let completed = 0;
  let totalCost = 0;

  for (let i = 0; i < effectiveLimit; i++) {
    const gameConfig = schedule[i];
    const gameNum = parseInt(gameConfig.gameId.replace("game_", ""), 10);

    if (completedGames.has(gameNum)) {
      console.log(`[${i + 1}/${effectiveLimit}] ${gameConfig.gameId} — already done, skipping`);
      completed++;
      continue;
    }

    console.log(`[${i + 1}/${effectiveLimit}] Running ${gameConfig.gameId}...`);

    try {
      const result = await runOneGame(gameConfig);

      // Save result
      const outPath = path.join(config.rawDir, `${gameConfig.gameId}.json`);
      fs.writeFileSync(outPath, JSON.stringify(result, null, 2));

      const cost = result.totalCost || 0;
      totalCost += cost;
      const duration = Math.round((result.durationMs || 0) / 1000);
      console.log(`  ✓ ${gameConfig.gameId} done — ${result.winner} wins (${result.winCondition}) — ${result.totalDays} days — $${cost.toFixed(3)} — ${duration}s\n`);
      completed++;
    } catch (error) {
      console.error(`  ✗ ${gameConfig.gameId} FAILED: ${error.message}\n`);
    }
  }

  console.log(`\n=== Completed ${completed}/${effectiveLimit} games — Total cost: $${totalCost.toFixed(3)} ===\n`);

  // Generate leaderboard
  console.log("Generating leaderboard...");
  try {
    generateLeaderboard();
    console.log(`Leaderboard saved to ${config.leaderboardPath}`);
  } catch (error) {
    console.error(`Leaderboard generation failed: ${error.message}`);
  }
}

main().catch(err => {
  console.error("Fatal error:", err);
  process.exit(1);
});
