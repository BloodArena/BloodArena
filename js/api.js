/**
 * api.js — API-related helpers extracted from singleplayer_demo.html
 *
 * Pricing lookup, token-usage tracking, trajectory recording,
 * session-message management, Claude/OpenAI fetch helpers,
 * and the token-usage display renderer.
 */

import { state } from "./state.js";
import { MODEL_PRICING, USE_PERSISTENT_MESSAGES, USE_INCREMENTAL_CHAT_CONTEXT } from "./constants.js";
import { getModelConfig } from "./model-catalog.js";
import { markActorPromptCursors, getPhaseLabel } from "./prompts.js";

/* ─── pricing ─────────────────────────────────────────────── */

export function lookupPricing(modelName) {
  if (!modelName) return null;
  const name = modelName.replace(/^[^/]+\//, ""); /* strip provider/ prefix */
  /* exact match first */
  if (MODEL_PRICING[name]) return MODEL_PRICING[name];
  /* prefix match */
  for (const key of Object.keys(MODEL_PRICING)) {
    if (name.startsWith(key)) return MODEL_PRICING[key];
  }
  return null;
}

/* ─── token usage ─────────────────────────────────────────── */

export function ensureTokenUsage() {
  if (!state) return;
  if (!state.tokenUsage) state.tokenUsage = {};
}

export function recordTokenUsage(model, usage) {
  if (!state || !usage) return;
  ensureTokenUsage();
  const key = model || "unknown";
  if (!state.tokenUsage[key]) {
    state.tokenUsage[key] = { promptTokens: 0, completionTokens: 0, totalTokens: 0, calls: 0 };
  }
  const u = state.tokenUsage[key];
  u.promptTokens += usage.prompt_tokens || usage.input_tokens || 0;
  u.completionTokens += usage.completion_tokens || usage.output_tokens || 0;
  u.totalTokens += usage.total_tokens || ((usage.prompt_tokens || usage.input_tokens || 0) + (usage.completion_tokens || usage.output_tokens || 0));
  u.calls += 1;
}

export function getTokenUsageSummary() {
  if (!state || !state.tokenUsage) return { models: {}, totalCost: 0, totalTokens: 0 };
  let totalCost = 0;
  let totalTokens = 0;
  const models = {};
  for (const [model, u] of Object.entries(state.tokenUsage)) {
    const pricing = lookupPricing(model);
    let cost = 0;
    if (pricing) {
      cost = (u.promptTokens / 1e6) * pricing[0] + (u.completionTokens / 1e6) * pricing[1];
    }
    models[model] = { ...u, cost, hasPricing: Boolean(pricing) };
    totalCost += cost;
    totalTokens += u.totalTokens;
  }
  return { models, totalCost, totalTokens };
}

/* ─── trajectory ──────────────────────────────────────────── */

export function shouldRecordTrajectory() {
  return Boolean(state && state.recordTrajectories);
}

export function recordTrajectoryEntry(actor, sessionKey, provider, model, messages, responseText, reasoningText = "") {
  if (!shouldRecordTrajectory()) return;
  if (!Array.isArray(state.trajectoryLog)) state.trajectoryLog = [];
  state.trajectoryLog.push({
    time: new Date().toISOString(),
    phase: getPhaseLabel(),
    day: state.dayCount,
    night: state.nightCount,
    actor: actor ? actor.name : "说书人",
    actorId: actor ? actor.id : "storyteller",
    sessionKey: sessionKey || "default",
    provider: provider || "",
    model: model || "",
    messages: JSON.parse(JSON.stringify(messages || [])),
    response: responseText || "",
    reasoning_content: reasoningText || ""
  });
}

/* ─── session messages ────────────────────────────────────── */

export function getMessageSession(actor, sessionKey) {
  if (!actor) return null;
  if (!actor.messageSessions || typeof actor.messageSessions !== "object") {
    actor.messageSessions = {};
  }
  const key = sessionKey || "default";
  if (!Array.isArray(actor.messageSessions[key])) {
    actor.messageSessions[key] = [];
  }
  return actor.messageSessions[key];
}

export function dedupeSystemMessages(session, messages) {
  if (!session || !session.length) return messages.slice();
  return messages.filter((msg) => {
    if (msg.role !== "system") return true;
    return !session.some((m) => m.role === "system" && m.content === msg.content);
  });
}

export function buildSessionMessages(actor, sessionKey, messages) {
  if (!USE_PERSISTENT_MESSAGES || !actor) {
    return { finalMessages: messages, session: null, newMessages: messages };
  }
  const session = getMessageSession(actor, sessionKey);
  const newMessages = dedupeSystemMessages(session, messages);
  return {
    finalMessages: session.concat(newMessages),
    session,
    newMessages
  };
}

export function commitSessionMessages(actor, sessionKey, messages, assistantContent) {
  if (!actor) return;
  if (USE_PERSISTENT_MESSAGES) {
    const session = getMessageSession(actor, sessionKey);
    const newMessages = dedupeSystemMessages(session, messages);
    if (newMessages.length) session.push(...newMessages);
    session.push({ role: "assistant", content: assistantContent });
  }
  markActorPromptCursors(actor, sessionKey);
}

/* ─── Claude helpers ──────────────────────────────────────── */

export function splitClaudeMessages(messages) {
  const systemParts = [];
  const chat = [];
  messages.forEach((msg) => {
    if (!msg || typeof msg.content === "undefined") return;
    if (msg.role === "system") {
      systemParts.push(String(msg.content));
      return;
    }
    const role = msg.role === "assistant" ? "assistant" : "user";
    chat.push({ role, content: String(msg.content) });
  });
  return { system: systemParts.join("\n"), messages: chat };
}

export function extractClaudeText(data) {
  if (!data) return "";
  if (Array.isArray(data.content)) {
    return data.content.map((part) => part.text || "").join("");
  }
  if (typeof data.output_text === "string") return data.output_text;
  return "";
}

export function extractClaudeReasoning(data) {
  if (!data) return "";
  if (Array.isArray(data.content)) {
    return data.content
      .filter((part) => part.type === "thinking" || part.type === "reasoning")
      .map((part) => part.thinking || part.text || part.reasoning || "")
      .join("");
  }
  if (typeof data.thinking === "string") return data.thinking;
  if (typeof data.reasoning === "string") return data.reasoning;
  return "";
}

export function isClaudeMessagesEndpoint(endpoint) {
  return /\/messages$/i.test(endpoint) || endpoint.includes("/v1/messages");
}

/* ─── fetch helpers ───────────────────────────────────────── */

export async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function fetchWithRetry(url, options, timeoutMs, maxRetries = 2) {
  let lastError = null;
  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    try {
      const response = await fetchWithTimeout(url, options, timeoutMs);
      if (response.ok) return response;
      const errorText = await response.text();
      if ((response.status >= 500 || response.status === 429) && attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
        continue;
      }
      throw new Error(errorText || `API 请求失败 (${response.status})`);
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        await new Promise((resolve) => setTimeout(resolve, 800 * (attempt + 1)));
        continue;
      }
      throw error;
    }
  }
  throw lastError || new Error("API 请求失败");
}

export async function probeModelConnection(actor = null, timeoutMs = 8000) {
  const config = getModelConfig(actor);
  const requiresKey = config.requiresKey !== false;
  const probeMaxTokens = 64;
  if (!config.endpoint) {
    return { ok: false, provider: config.provider, model: config.model, message: "缺少请求端点" };
  }
  if (requiresKey && !config.apiKey) {
    return { ok: false, provider: config.provider, model: config.model, message: "缺少 API Key" };
  }

  const useClaude = config.protocol === "claude" || isClaudeMessagesEndpoint(config.endpoint);
  try {
    if (useClaude) {
      const headers = {
        "content-type": "application/json",
        "x-api-key": config.apiKey || "",
        "anthropic-version": "2023-06-01"
      };
      Object.assign(headers, config.headers || {});
      const response = await fetchWithTimeout(config.endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({
          model: config.model,
          messages: [{ role: "user", content: "ping" }],
          max_tokens: probeMaxTokens,
          temperature: 0
        })
      }, timeoutMs);
      if (!response.ok) {
        const errorText = await response.text().catch(() => "");
        return {
          ok: false,
          provider: config.provider,
          model: config.model,
          message: `HTTP ${response.status}${errorText ? `: ${errorText.slice(0, 120)}` : ""}`
        };
      }
      return { ok: true, provider: config.provider, model: config.model, message: "" };
    }

    const headers = {
      "Content-Type": "application/json"
    };
    Object.assign(headers, config.headers || {});
    if (config.apiKey) {
      headers.Authorization = `Bearer ${config.apiKey}`;
    }
    const response = await fetchWithTimeout(config.endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        model: config.model,
        messages: [{ role: "user", content: "ping" }],
        temperature: 0,
        max_tokens: probeMaxTokens,
        stream: false
      })
    }, timeoutMs);
    if (!response.ok) {
      const errorText = await response.text().catch(() => "");
      return {
        ok: false,
        provider: config.provider,
        model: config.model,
        message: `HTTP ${response.status}${errorText ? `: ${errorText.slice(0, 120)}` : ""}`
      };
    }
    return { ok: true, provider: config.provider, model: config.model, message: "" };
  } catch (error) {
    return {
      ok: false,
      provider: config.provider,
      model: config.model,
      message: error?.name === "AbortError" ? "连接超时" : (error?.message || "请求失败")
    };
  }
}

export async function probeGameStartConnections() {
  const targets = [{ label: "说书人", actor: null }];
  if (state && Array.isArray(state.players)) {
    state.players
      .filter((player) => !player.isHuman)
      .forEach((player) => targets.push({ label: player.name, actor: player }));
  }

  const uniqueTargets = [];
  const seen = new Set();
  targets.forEach((entry) => {
    const config = getModelConfig(entry.actor);
    const key = `${config.provider}:${config.model}`;
    if (!config.provider || seen.has(key)) return;
    seen.add(key);
    uniqueTargets.push({ ...entry, config });
  });

  const failures = [];
  for (const entry of uniqueTargets) {
    const result = await probeModelConnection(entry.actor);
    if (!result.ok) {
      failures.push({
        label: entry.label,
        provider: result.provider,
        model: result.model,
        message: result.message
      });
    }
  }

  if (!failures.length) {
    return { ok: true, failures: [], message: "" };
  }

  const summary = failures
    .slice(0, 3)
    .map((item) => `${item.provider || "未知 provider"} / ${item.model || "未知模型"}：${item.message}`)
    .join("\n");
  return {
    ok: false,
    failures,
    message: `开局前模型连通性检查失败：\n${summary}${failures.length > 3 ? `\n另有 ${failures.length - 3} 个失败项。` : ""}`
  };
}

/* ─── main API call ───────────────────────────────────────── */

export async function callDeepSeek(messages, temperature, actor = null, sessionKey = "default", persist = true, options = null) {
  const config = getModelConfig(actor);
  const requiresKey = config.requiresKey !== false;
  if (!config.endpoint) {
    alert("模型配置缺少 Base URL，请检查 YAML 或设置项。");
    throw new Error("Missing endpoint");
  }
  if (requiresKey && !config.apiKey) {
    const label = config.label || config.provider || "模型";
    alert(`请先填写 ${label} API Key。`);
    throw new Error("Missing API key");
  }
  const sessionPayload = buildSessionMessages(actor, sessionKey, messages);
  const timeoutMs = 60000;
  const useClaude = config.protocol === "claude" || isClaudeMessagesEndpoint(config.endpoint);
  if (useClaude) {
    const headers = {
      "content-type": "application/json",
      "x-api-key": config.apiKey || "",
      "anthropic-version": "2023-06-01"
    };
    Object.assign(headers, config.headers || {});
    const { system, messages: claudeMessages } = splitClaudeMessages(sessionPayload.finalMessages);
    const body = {
      model: config.model,
      messages: claudeMessages,
      max_tokens: 32000,
      temperature: typeof temperature === "number" ? temperature : config.temperature
    };
    if (system) body.system = system;
    if (/thinking/i.test(config.model)) {
      body.thinking = { type: "enabled", budget_tokens: 10000 };
    }
    const response = await fetchWithRetry(config.endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body)
    }, timeoutMs);
    const data = await response.json();
    const content = extractClaudeText(data);
    const reasoning = extractClaudeReasoning(data);
    if (data.usage) recordTokenUsage(config.model, data.usage);
    if (persist && actor) {
      commitSessionMessages(actor, sessionKey, messages, content);
    }
    recordTrajectoryEntry(actor, sessionKey, config.provider, config.model, sessionPayload.newMessages, content, reasoning);
    renderTokenUsageDisplay();
    return content;
  }
  const headers = {
    "Content-Type": "application/json"
  };
  Object.assign(headers, config.headers || {});
  if (config.apiKey) {
    headers.Authorization = `Bearer ${config.apiKey}`;
  }
  const body = {
    model: config.model,
    messages: sessionPayload.finalMessages,
    temperature: typeof temperature === "number" ? temperature : config.temperature,
    stream: false
  };
  if (options && options.responseFormat) {
    body.response_format = options.responseFormat;
  }
  const response = await fetchWithRetry(config.endpoint, {
    method: "POST",
    headers,
    body: JSON.stringify(body)
  }, timeoutMs);
  const data = await response.json();
  const message = data.choices?.[0]?.message || {};
  const content = message.content || "";
  const reasoning = message.reasoning_content || message.reasoning || "";
  if (data.usage) recordTokenUsage(config.model, data.usage);
  if (persist && actor) {
    commitSessionMessages(actor, sessionKey, messages, content);
  }
  recordTrajectoryEntry(actor, sessionKey, config.provider, config.model, sessionPayload.newMessages, content, reasoning);
  renderTokenUsageDisplay();
  return content;
}

/* ─── token usage display ─────────────────────────────────── */

export function renderTokenUsageDisplay() {
  const section = document.getElementById("tokenUsageSection");
  const container = document.getElementById("tokenUsageDisplay");
  if (!section || !container) return;
  const summary = getTokenUsageSummary();
  if (summary.totalTokens === 0) {
    section.style.display = "none";
    return;
  }
  section.style.display = "";
  const modelKeys = Object.keys(summary.models);
  const fmtNum = (n) => n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : String(n);
  const fmtCost = (c) => c < 0.01 ? "<$0.01" : "$" + c.toFixed(2);
  let rows = modelKeys.map((m) => {
    const u = summary.models[m];
    const costStr = u.hasPricing ? fmtCost(u.cost) : "—";
    return `<tr><td title="${m}">${m.length > 28 ? m.slice(0, 26) + "…" : m}</td><td>${u.calls}</td><td>${fmtNum(u.promptTokens)}</td><td>${fmtNum(u.completionTokens)}</td><td>${fmtNum(u.totalTokens)}</td><td>${costStr}</td></tr>`;
  }).join("");
  const hasAnyPricing = modelKeys.some((m) => summary.models[m].hasPricing);
  container.innerHTML =
    `<table class="token-usage-table"><tr><th>模型</th><th>调用</th><th>输入</th><th>输出</th><th>总计</th><th>费用</th></tr>${rows}</table>` +
    `<div class="token-usage-total"><span>总 Token: <b>${fmtNum(summary.totalTokens)}</b></span>` +
    (hasAnyPricing ? `<span>预估总花费: <span class="cost">${fmtCost(summary.totalCost)}</span></span>` : `<span style="color:var(--muted)">部分模型无定价数据</span>`) +
    `</div>`;
}
