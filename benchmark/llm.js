/**
 * llm.js — LLM call layer for benchmark (OpenRouter unified interface)
 */

const config = require('./config');

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

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY not set");
  }

  const url = `${config.openrouterBaseUrl}/chat/completions`;
  const headers = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
    "HTTP-Referer": "https://github.com/The-Bloody"
  };

  const body = {
    model,
    messages,
    temperature: temp,
    stream: false
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
          console.warn(`  [LLM] Server error (${response.status}), retrying in ${800 * (attempt + 1)}ms...`);
          await sleep(800 * (attempt + 1));
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

      // OpenRouter may return total_cost directly
      let cost = 0;
      if (typeof data.total_cost === "number") {
        cost = data.total_cost;
      } else if (typeof rawUsage.total_cost === "number") {
        cost = rawUsage.total_cost;
      }

      return {
        content,
        reasoning,
        usage: { promptTokens, completionTokens, totalTokens, cost }
      };

    } catch (error) {
      lastError = error;

      if (error.name === "AbortError") {
        console.warn(`  [LLM] Timeout, retrying (${attempt + 1}/${maxRetries})...`);
        if (attempt < maxRetries) {
          await sleep(800 * (attempt + 1));
          continue;
        }
      }

      if (attempt < maxRetries) {
        await sleep(800 * (attempt + 1));
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
