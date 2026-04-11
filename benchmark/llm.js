/**
 * llm.js — LLM call layer for benchmark (OpenRouter unified interface)
 */

const config = require('./config');

/* ─── Local pricing fallback (USD per 1M tokens: [input, output]) ─── */
const MODEL_PRICING = {
  "deepseek-chat-v3-0324":[0.20, 0.77],
  "deepseek-chat":        [0.20, 0.77],
  "deepseek-reasoner":    [0.55, 2.19],
  "deepseek-v3.2":        [0.26, 0.38],
  "deepseek-v3":          [0.26, 0.38],
  "gemini-3-pro":         [2.00, 12.00],
  "gemini-3.1-pro":       [2.00, 12.00],
  "gemini-3.1-flash-lite":[0.10, 0.40],
  "gemini-3-flash":       [0.10, 0.40],
  "claude-3-haiku":       [0.25, 1.25],
  "claude-3-5-haiku":     [0.80, 4.00],
  "claude-haiku-4.5":     [0.80, 4.00],
  "claude-haiku-4-5":     [0.80, 4.00],
  "claude-3-7-sonnet":    [3.00, 15.00],
  "claude-sonnet-4.5":    [3.00, 15.00],
  "claude-sonnet-4":      [3.00, 15.00],
  "claude-sonnet-4-5":    [3.00, 15.00],
  "claude-opus-4":        [15.00, 75.00],
  "claude-opus-4-1":      [15.00, 75.00],
  "claude-opus-4-5":      [15.00, 75.00],
  "claude-opus-4-6":      [5.00, 25.00],
  "gpt-5.1":              [2.00, 8.00],
  "gpt-5":                [2.50, 15.00],
  "gpt-5.4":              [2.50, 15.00],
  "gpt-4.1":              [2.00, 8.00],
  "mimo-v2-pro":          [1.00, 3.00],
  "minimax-m2.7":         [0.30, 1.20],
  "minimax-m1":           [0.50, 2.00],
  "grok-4.20-beta":       [2.00, 6.00],
  "grok-4.1-fast":        [0.20, 0.50],
  "grok-4.1":             [3.00, 15.00],
  "grok-3-mini":          [0.30, 0.50],
  "qwen3.5-397b":         [0.39, 2.34],
  "qwen3-235b":           [0.70, 0.70],
  "step-3.5-flash":       [0.10, 0.30],
  "step-3.5":             [0.10, 0.30],
  "step-2":               [0.50, 2.00],
  "nemotron-3-super":     [0.10, 0.50],
  "nemotron-ultra":       [0.50, 2.00],
  "glm-5":                [0.72, 2.30],
  "glm-4-plus":           [0.50, 2.00],
  "kimi-k2.5":            [0.42, 2.20],
  "kimi-k2":              [0.50, 2.00],
  "seed-2.0-lite":        [0.25, 2.00],
};

function lookupPricing(modelName) {
  if (!modelName) return null;
  const name = modelName.replace(/^[^/]+\//, ""); // strip provider/ prefix
  if (MODEL_PRICING[name]) return MODEL_PRICING[name];
  for (const key of Object.keys(MODEL_PRICING)) {
    if (name.startsWith(key)) return MODEL_PRICING[key];
  }
  return null;
}

function estimateCost(model, promptTokens, completionTokens) {
  const pricing = lookupPricing(model);
  if (!pricing) return 0;
  return (promptTokens / 1e6) * pricing[0] + (completionTokens / 1e6) * pricing[1];
}

/**
 * Call LLM via OpenRouter API
 * @param {Array} messages - Chat messages array
 * @param {string} model - Model ID (e.g. "openai/gpt-4.1")
 * @param {number} temperature - Temperature (default from config)
 * @param {number} retries - Max retries
 * @returns {{ content: string, reasoning: string, usage: { promptTokens: number, completionTokens: number, totalTokens: number, cost: number } }}
 */
async function callLLM(messages, model, temperature = null, retries = null) {
  const temp = temperature ?? config.temperature;
  const maxRetries = retries ?? config.maxRetries;

  const apiKey = config.openrouterApiKey;
  const baseUrl = config.openrouterBaseUrl;
  const apiModel = model;
  const extraHeaders = { "HTTP-Referer": "https://github.com/The-Bloody" };
  if (!apiKey) throw new Error("OPENROUTER_API_KEY not set");

  const url = `${baseUrl}/chat/completions`;
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    ...extraHeaders
  };

  const body = {
    model: apiModel,
    messages,
    temperature: temp,
    stream: false,
    reasoning: {
      effort: "high",
    }
  };

  let lastError = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), config.timeoutMs);

      const response = await fetch(url, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();

        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After");
          const waitMs = retryAfter ? parseInt(retryAfter) * 1000 : 5000 * (attempt + 1);
          console.warn(`  [LLM] Rate limited (429), waiting ${waitMs}ms...`);
          await sleep(waitMs);
          continue;
        }

        if (response.status >= 500 && attempt < maxRetries) {
          const waitMs = 3000 * Math.pow(2, attempt);
          console.warn(`  [LLM] Server error (${response.status}), retrying in ${waitMs}ms...`);
          await sleep(waitMs);
          continue;
        }

        throw new Error(`API error ${response.status}: ${errorText.slice(0, 200)}`);
      }

      const data = await response.json();
      const message = data.choices?.[0]?.message || {};
      const content = message.content || "";
      const reasoning = message.reasoning_content || message.reasoning || "";

      const rawUsage = data.usage || {};
      const promptTokens = rawUsage.prompt_tokens || 0;
      const completionTokens = rawUsage.completion_tokens || 0;
      const totalTokens = rawUsage.total_tokens || (promptTokens + completionTokens);

      // Cost priority: API usage.cost > data.total_cost > local estimate
      let cost = 0;
      let costSource = "local_estimate";
      if (typeof rawUsage.cost === "number") {
        cost = rawUsage.cost;
        costSource = "api";
      } else if (typeof data.total_cost === "number") {
        cost = data.total_cost;
        costSource = "api";
      } else {
        cost = estimateCost(model, promptTokens, completionTokens);
      }

      return {
        content,
        reasoning,
        usage: { promptTokens, completionTokens, totalTokens, cost, costSource, rawUsage }
      };

    } catch (error) {
      lastError = error;

      if (error.name === "AbortError") {
        console.warn(`  [LLM] Timeout, retrying (${attempt + 1}/${maxRetries})...`);
      }

      if (attempt < maxRetries) {
        const waitMs = 3000 * Math.pow(2, attempt);
        await sleep(waitMs);
        continue;
      }

      throw error;
    }
  }

  throw lastError || new Error("LLM call failed after retries");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

module.exports = { callLLM, sleep };
