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
const { callLLM } = require('./llm');

// Parse CLI args
const args = process.argv.slice(2);
let limit = Infinity;
let skipProbe = false;
let runTag = "";
let timestamped = false;
let progressMode = "concise";
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--limit' && args[i + 1]) {
    limit = parseInt(args[i + 1], 10);
  }
  if (args[i] === '--skip-probe') {
    skipProbe = true;
  }
  if (args[i] === '--run-tag' && args[i + 1]) {
    runTag = args[i + 1];
  }
  if (args[i] === '--timestamped') {
    timestamped = true;
  }
  if ((args[i] === '--progress-mode' || args[i] === '--progress') && args[i + 1]) {
    progressMode = args[i + 1];
  }
}

function makeTimestampTag() {
  const now = new Date();
  const pad = (n) => String(n).padStart(2, '0');
  return [
    now.getUTCFullYear(),
    pad(now.getUTCMonth() + 1),
    pad(now.getUTCDate())
  ].join('') + '_' + [
    pad(now.getUTCHours()),
    pad(now.getUTCMinutes()),
    pad(now.getUTCSeconds())
  ].join('');
}

function applyRunTag(tag) {
  const taggedResultsDir = path.join("./results", tag);
  config.resultsDir = taggedResultsDir;
  config.rawDir = path.join(taggedResultsDir, "raw");
  config.leaderboardPath = path.join(taggedResultsDir, "leaderboard.json");
}

async function probeModel(entry) {
  try {
    const result = await callLLM(
      [{ role: "user", content: "Reply with exactly: hello" }],
      entry.id,
      0,
      0
    );
    return {
      ...entry,
      ok: true,
      preview: (result.content || "").trim().slice(0, 40)
    };
  } catch (error) {
    return {
      ...entry,
      ok: false,
      error: error.message
    };
  }
}

async function probeModels(entries) {
  return Promise.all(entries.map(probeModel));
}

function printProbeResults(title, results) {
  if (!results.length) return;
  console.log(title);
  for (const result of results) {
    const name = result.label ? `${result.label} [${result.id}]` : result.id;
    if (result.ok) {
      console.log(`  - ${name} ... OK${result.preview ? ` (${result.preview})` : ""}`);
    } else {
      console.log(`  - ${name} ... FAIL (${result.error})`);
    }
  }
}

async function runModelProbe() {
  const benchmarkEntries = config.models.map((model, index) => ({ ...model, index }));
  const storytellerEntry = config.storytellerModel
    ? { id: config.storytellerModel, label: "Storyteller" }
    : null;
  const fallbackModelId = "xiaomi/mimo-v2-pro";

  config.modelRuntimeOverrides = {};
  config.storytellerApiModel = config.storytellerModel;

  console.log("Running model connectivity probe...");

  const benchmarkResults = await probeModels(benchmarkEntries);
  printProbeResults("  Benchmark models:", benchmarkResults);

  const benchmarkFailures = benchmarkResults.filter(result => !result.ok);
  if (benchmarkFailures.length) {
    const fallbackProbeEntry = { id: fallbackModelId, label: "Unified fallback model" };
    const [fallbackResult] = await probeModels([fallbackProbeEntry]);
    printProbeResults("  Unified fallback check:", [fallbackResult]);

    if (!fallbackResult.ok) {
      console.error("\nModel probe failed and unified fallback model is also unavailable.");
      for (const failure of benchmarkFailures) {
        console.error(`  - ${failure.label} [${failure.id}]: ${failure.error}`);
      }
      console.error(`  - Fallback [${fallbackResult.id}]: ${fallbackResult.error}`);
      throw new Error("Unified fallback model is unavailable");
    }

    console.warn(`\nUnavailable benchmark models will use unified fallback: ${fallbackModelId}`);
    for (const failure of benchmarkFailures) {
      config.modelRuntimeOverrides[failure.id] = fallbackModelId;
      console.warn(`  - ${failure.label} [${failure.id}] -> ${fallbackModelId}`);
    }
    console.warn("  These replacements will be used for this run.\n");
  }

  let storytellerResult = null;
  if (storytellerEntry) {
    const [result] = await probeModels([storytellerEntry]);
    storytellerResult = result;
    printProbeResults("  Storyteller model:", [storytellerResult]);

    if (!storytellerResult.ok) {
      const fallbackProbeEntry = { id: fallbackModelId, label: "Unified fallback model" };
      const [fallbackResult] = await probeModels([fallbackProbeEntry]);
      if (!fallbackResult.ok) {
        console.error(`\nStoryteller model probe failed: ${storytellerResult.error}`);
        console.error(`Unified fallback model also failed: ${fallbackResult.error}`);
        throw new Error("Storyteller model probe failed and unified fallback is unavailable");
      }

      console.warn(`\nStoryteller model is unavailable and will use unified fallback: ${fallbackModelId}`);
      console.warn(`  - Storyteller [${config.storytellerModel}] -> ${fallbackModelId}\n`);
      config.storytellerApiModel = fallbackModelId;
    }
  }

  console.log("  Final benchmark roster:");
  for (const model of config.models) {
    const actualModel = config.modelRuntimeOverrides[model.id] || model.id;
    if (actualModel === model.id) {
      console.log(`  - ${model.label} [${model.id}]`);
    } else {
      console.log(`  - ${model.label} [${model.id}] -> runtime API ${actualModel}`);
    }
  }
  if ((config.storytellerApiModel || config.storytellerModel) === config.storytellerModel) {
    console.log(`  Storyteller: ${config.storytellerModel}`);
  } else {
    console.log(`  Storyteller: ${config.storytellerModel} -> runtime API ${config.storytellerApiModel}`);
  }
  console.log("Model connectivity probe passed.\n");
}

async function main() {
  console.log("=== Blood on the Clocktower — AI Benchmark ===\n");

  const validProgressModes = new Set(["concise", "balanced", "detailed"]);
  if (!validProgressModes.has(progressMode)) {
    console.error(`ERROR: Unsupported progress mode: ${progressMode}`);
    console.error("Use one of: concise, balanced, detailed");
    process.exit(1);
  }
  config.progressMode = progressMode;

  if (timestamped && !runTag) {
    runTag = makeTimestampTag();
  }
  if (runTag) {
    applyRunTag(runTag);
    console.log(`Run tag: ${runTag}`);
    console.log(`Results dir: ${config.resultsDir}`);
    console.log(`Raw results: ${config.rawDir}`);
    console.log(`Leaderboard: ${config.leaderboardPath}\n`);
  }
  console.log(`Progress mode: ${config.progressMode}\n`);

  // Validate
  if (!config.openrouterApiKey) {
    console.error("ERROR: OPENROUTER_API_KEY not set. Use env variable or edit config.js.");
    process.exit(1);
  }
  if (config.models.length !== 12) {
    console.error(`ERROR: Expected 12 models, got ${config.models.length}.`);
    process.exit(1);
  }

  if (!skipProbe) {
    await runModelProbe();
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
