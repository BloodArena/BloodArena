/**
 * config.js — Benchmark experiment configuration
 */

module.exports = {
  // 实验参数
  totalGames: 12,           // 先跑 12 局试验轮（后续可改为 120）
  groups: 1,                // 分组数（totalGames / 12），扩展到 120 局时改为 10
  playerCount: 12,
  concurrency: 1,
  seed: 42,
  boardFile: "./benchmark/role_boards.json",  // 预设配板文件路径，设为 "" 则用随机配板
  boardGroup: 1,                               // 使用第几组配板（1-5）
  maxDays: 10,
  discussionRounds: 3,    // 每个白天讨论轮数
  maxNominationsPerDay: 3,

  // OpenRouter 配置
  openrouterApiKey: process.env.OPENROUTER_API_KEY || "",
  openrouterBaseUrl: "https://openrouter.ai/api/v1",

  // LLM 参数
  temperature: 0.6,
  timeoutMs: 120000,
  maxRetries: 3,

  // 说书人模型（用于夜晚信息判定和叙述生成）
  storytellerModel: "google/gemini-3.1-pro-preview",

  // 参与评测的 12 个模型
  models: [
    { id: "openai/gpt-5.4", label: "GPT-5.4" },
    { id: "google/gemini-3.1-pro-preview", label: "Gemini 3.1 Pro" },
    { id: "anthropic/claude-sonnet-4.6", label: "Claude Sonnet 4.6" },
    { id: "xiaomi/mimo-v2-pro", label: "MiMo V2 Pro" },
    { id: "minimax/minimax-m2.7", label: "MiniMax M2.7" },
    { id: "x-ai/grok-4.20-beta", label: "Grok 4.20 Beta" },
    { id: "deepseek/deepseek-v3.2", label: "DeepSeek V3.2" },
    { id: "qwen/qwen3.5-397b-a17b", label: "Qwen3.5 397B" },
    { id: "bytedance-seed/seed-2.0-lite", label: "Seed 2.0 Lite" },
    { id: "stepfun/step-3.5-flash", label: "step 3.5 flash" },
    { id: "z-ai/glm-5", label: "GLM-5" },
    { id: "moonshotai/kimi-k2.5", label: "kimi k2.5" }
  ],

  // 输出路径
  resultsDir: "./results",
  rawDir: "./results/raw",
  leaderboardPath: "./results/leaderboard.json"
};
