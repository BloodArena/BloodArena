/**
 * model-catalog.js
 * ----------------
 * All model-catalog related functions extracted from singleplayer_demo.html.
 * Handles parsing, normalizing, health-checking, and applying the model catalog,
 * as well as runtime model selection helpers.
 */

// --- State imports ---
// These mutable state variables are shared with the rest of the app.
// In ES-module form we import getter/setter access; for now we import references
// and mutate them directly.
import {
  loadedModelCatalog, setLoadedModelCatalog,
  customProviderMap, setCustomProviderMap,
  catalogApiKeys, setCatalogApiKeys,
  modelCatalogLoadStatus, setModelCatalogLoadStatus,
  modelCatalogHealth, setModelCatalogHealth,
  modelHealthWarned, setModelHealthWarned
} from "./state.js";

import { DEFAULT_MODEL, MODEL_OPTIONS, setMODEL_OPTIONS } from "./constants.js";

// --- DOM element and function imports ---
import {
  modelSelect, modelHealthBox, tempInput,
  renderAll
} from "./ui-helpers.js";
import { initModelSelect } from "./settings.js";
import { showModal } from "./overlays.js";

// ============================================================================
// Embedded default catalog (fallback when YAML fetch fails)
// ============================================================================

const DEFAULT_CATALOG_YAML = `
api_keys:
  mimo: "YOUR_MIMO_KEY"
  deepseek: "YOUR_DEEPSEEK_KEY"
  gemini: "YOUR_GEMINI_KEY"
  claude: "YOUR_CLAUDE_KEY"
  gpt: "YOUR_GPT_KEY"
  openrouter: "YOUR_OPENROUTER_KEY"

providers:
  deepseek:
    label: "DeepSeek"
    base_url: "https://api.deepseek.com/v1"
    api_key: "\${deepseek}"
    protocol: "openai"
    models:
      - "deepseek-chat"
      - "deepseek-reasoner"
    default_model: "deepseek-chat"

  gemini:
    label: "Gemini"
    base_url: ""
    api_key: "\${gemini}"
    protocol: "openai"
    models:
      - "gemini-3-pro-preview-high"
      - "gemini-3-pro-preview-low"
      - "gemini-3-pro-preview"
      - "gemini-3-flash-preview"

  claude:
    label: "Claude"
    base_url: ""
    api_key: "\${claude}"
    protocol: "claude"
    models:
      - "claude-3-5-haiku-20241022"
      - "claude-3-7-sonnet-20250219"
      - "claude-3-7-sonnet-20250219-thinking"
      - "claude-3-haiku-20240307"
      - "claude-haiku-4-5-20251001"
      - "claude-haiku-4-5-20251001-thinking"
      - "claude-opus-4-1-20250805"
      - "claude-opus-4-1-20250805-thinking"
      - "claude-opus-4-20250514"
      - "claude-opus-4-20250514-thinking"
      - "claude-opus-4-5-20251101"
      - "claude-opus-4-5-20251101-thinking"
      - "claude-sonnet-4-20250514"
      - "claude-sonnet-4-20250514-thinking"
      - "claude-sonnet-4-5-20250929"
      - "claude-sonnet-4-5-20250929-thinking"

  gpt:
    label: "GPT"
    base_url: ""
    api_key: "\${gpt}"
    protocol: "openai"
    models:
      - "gpt-5.1-2025-11-13"
      - "gpt-5-chat-2025-08-07"

  mimo:
    label: "MiMo"
    base_url: "https://api.xiaomimimo.com/v1"
    api_key: "\${mimo}"
    protocol: "openai"
    models:
      - "mimo-v2-pro"
      - "mimo-v2-omni"
    default_model: "mimo-v2-pro"

  openrouter:
    label: "OpenRouter"
    base_url: "https://openrouter.ai/api/v1"
    api_key: "\${openrouter}"
    protocol: "openai"
    models:
      - "xiaomi/mimo-v2-pro"
      - "minimax/minimax-m2.7"
      - "openai/gpt-5.4"
      - "google/gemini-3.1-pro-preview"
      - "anthropic/claude-sonnet-4.6"
    default_model: "anthropic/claude-sonnet-4.6"
    headers:
      HTTP-Referer: "\${origin}"
`;

// ============================================================================
// localStorage API key helpers
// ============================================================================

const LOCAL_API_KEYS_STORAGE = "botc_user_api_keys";

let lastRawCatalogData = null;

export function loadLocalApiKeys() {
  try {
    const raw = localStorage.getItem(LOCAL_API_KEYS_STORAGE);
    if (!raw) return {};
    return JSON.parse(raw);
  } catch { return {}; }
}

export function saveLocalApiKeys(keys) {
  localStorage.setItem(LOCAL_API_KEYS_STORAGE, JSON.stringify(keys || {}));
}

export function clearLocalApiKeys() {
  localStorage.removeItem(LOCAL_API_KEYS_STORAGE);
}

export function getKnownApiKeyNames() {
  if (lastRawCatalogData) {
    const keys = lastRawCatalogData.api_keys || lastRawCatalogData.variables || lastRawCatalogData.secrets || {};
    return Object.keys(keys);
  }
  return ["deepseek", "gemini", "claude", "gpt", "mimo", "openrouter"];
}

export function reapplyApiKeysFromUI(newKeys) {
  saveLocalApiKeys(newKeys);
  if (!lastRawCatalogData) return;
  const catalog = normalizeModelCatalog(lastRawCatalogData);
  if (catalog) {
    setModelCatalogLoadStatus({ ok: true, message: "已应用用户密钥" });
    applyModelCatalog(catalog);
  }
}

// ============================================================================
// Pure / low-level helpers
// ============================================================================

export function looksLikePlaceholderKey(value) {
  const raw = String(value || "").trim();
  if (!raw) return true;
  if (/\$\{[^}]+\}/.test(raw)) return true;
  if (/^YOUR_[A-Z0-9_]*KEY$/i.test(raw)) return true;
  if (/^(your|replace|example|test)[-_ ]?(api)?[-_ ]?key$/i.test(raw)) return true;
  return false;
}

export function buildProviderEndpoint(providerConfig) {
  if (!providerConfig) return "";
  const cleaned = String(providerConfig.baseUrl || "").trim().replace(/\/+$/, "");
  const protocol = providerConfig.protocol || "openai";
  if (!cleaned) return "";
  if (protocol === "claude") {
    return cleaned.includes("/messages") ? cleaned : `${cleaned}/v1/messages`;
  }
  if (cleaned.includes("/chat/completions")) {
    return cleaned;
  }
  return cleaned.endsWith("/v1") ? `${cleaned}/chat/completions` : `${cleaned}/v1/chat/completions`;
}

export function getProviderHealth(providerId) {
  if (!providerId) return null;
  return modelCatalogHealth.find((item) => item.id === providerId) || null;
}

export function getDefaultModelChoice() {
  return modelSelect?.value || DEFAULT_MODEL;
}

export function getEffectiveModelChoice(actor) {
  if (actor && actor.modelChoice && actor.modelChoice !== "default") {
    return actor.modelChoice;
  }
  return getDefaultModelChoice();
}

export function parseModelChoice(choice) {
  if (!choice) return { provider: "", model: "" };
  const parts = choice.split(":");
  if (parts.length < 2) return { provider: parts[0], model: "" };
  return { provider: parts[0], model: parts.slice(1).join(":") };
}

// ============================================================================
// Internal normalization helpers
// ============================================================================

function resolveCatalogString(value, variables) {
  if (typeof value !== "string") return value;
  return value.replace(/\$\{([A-Za-z0-9_-]+)\}/g, (match, key) => {
    if (variables && Object.prototype.hasOwnProperty.call(variables, key)) {
      return String(variables[key]);
    }
    return match;
  });
}

function normalizeModelEntry(entry) {
  if (!entry) return null;
  if (typeof entry === "string") {
    const name = entry.trim();
    return name ? { name } : null;
  }
  if (typeof entry === "object") {
    const name = String(entry.name || entry.id || entry.model || "").trim();
    return name ? { name } : null;
  }
  return null;
}

function normalizeProviderHeaders(rawHeaders, variables = null) {
  if (!rawHeaders || typeof rawHeaders !== "object" || Array.isArray(rawHeaders)) {
    return {};
  }
  const normalized = {};
  Object.entries(rawHeaders).forEach(([key, value]) => {
    const headerName = String(key || "").trim();
    if (!headerName) return;
    const headerValue = resolveCatalogString(String(value || "").trim(), variables);
    if (!headerValue) return;
    normalized[headerName] = headerValue;
  });
  return normalized;
}

function normalizeProviderEntry(entry, variables = null) {
  if (!entry) return null;
  const id = String(entry.id || entry.name || entry.provider || "").trim();
  if (!id) return null;
  const label = String(entry.label || entry.title || id).trim();
  const baseUrlRaw = String(entry.base_url || entry.baseUrl || entry.url || "").trim();
  const apiKeyRaw = String(entry.api_key || entry.apiKey || entry.key || "").trim();
  const baseUrl = resolveCatalogString(baseUrlRaw, variables);
  const apiKey = resolveCatalogString(apiKeyRaw, variables);
  const protocolRaw = String(entry.protocol || entry.connection || entry.endpoint_type || entry.type || "").trim().toLowerCase();
  const protocol = protocolRaw === "claude" || protocolRaw === "anthropic" ? "claude" : "openai";
  const defaultModel = resolveCatalogString(String(entry.default_model || entry.defaultModel || "").trim(), variables);
  const apiKeyRequired = typeof entry.api_key_required === "boolean" ? entry.api_key_required : null;
  const headers = normalizeProviderHeaders(entry.headers || entry.extra_headers || entry.default_headers, variables);
  let rawModels = Array.isArray(entry.models) ? entry.models : (entry.model ? [entry.model] : []);
  if (!rawModels.length && defaultModel) rawModels = [defaultModel];
  const models = rawModels
    .map((item) => {
      if (typeof item === "string") {
        return resolveCatalogString(item, variables);
      }
      if (item && typeof item === "object") {
        const name = resolveCatalogString(item.name || item.id || item.model || "", variables);
        return name ? { name } : null;
      }
      return item;
    })
    .map(normalizeModelEntry)
    .filter(Boolean);
  return { id, label, baseUrl, apiKey, protocol, defaultModel, apiKeyRequired, headers, models };
}

// ============================================================================
// Health check helpers
// ============================================================================

function validateProviderHealth(provider) {
  const errors = [];
  const warnings = [];
  const models = Array.isArray(provider.models) ? provider.models.map((m) => m.name).filter(Boolean) : [];
  const requiresKey = typeof provider.apiKeyRequired === "boolean"
    ? provider.apiKeyRequired
    : true;
  const endpoint = buildProviderEndpoint(provider);

  if (!provider.baseUrl) {
    errors.push("缺少 base_url");
  } else if (!/^https?:\/\//i.test(provider.baseUrl)) {
    warnings.push("base_url 不是 http/https 地址");
  }
  if (!endpoint) {
    errors.push("无法生成请求端点");
  }
  if (!models.length) {
    errors.push("models 为空");
  }
  if (provider.defaultModel && models.length && !models.includes(provider.defaultModel)) {
    warnings.push("default_model 不在 models 列表中");
  }
  if (requiresKey) {
    if (!provider.apiKey) {
      errors.push("缺少 api_key");
    } else if (looksLikePlaceholderKey(provider.apiKey)) {
      errors.push("api_key 仍是占位值或未解析变量");
    }
  }

  const status = errors.length ? "error" : (warnings.length ? "warning" : "ready");
  return {
    id: provider.id,
    label: provider.label || provider.id,
    protocol: provider.protocol || "openai",
    modelCount: models.length,
    status,
    errors,
    warnings
  };
}

function runModelCatalogHealthCheck() {
  const providers = loadedModelCatalog?.providers;
  if (!Array.isArray(providers) || !providers.length) {
    setModelCatalogHealth([]);
    renderModelHealthCheck();
    return modelCatalogHealth;
  }
  const seen = new Set();
  setModelCatalogHealth(providers.map((provider) => {
    const result = validateProviderHealth(provider);
    if (seen.has(result.id)) {
      result.status = "error";
      result.errors = result.errors.concat("provider id 重复");
    }
    seen.add(result.id);
    return result;
  }));
  renderModelHealthCheck();

  const readyCount = modelCatalogHealth.filter((item) => item.status === "ready" || item.status === "warning").length;
  if (!readyCount && !modelHealthWarned) {
    setModelHealthWarned(true);
    showModal("模型配置校验未通过：当前没有可用 provider，请在设置中填写 API 密钥或检查 model_catalog.yaml。");
  }
  return modelCatalogHealth;
}

// ============================================================================
// Exported catalog functions
// ============================================================================

export function parseModelCatalogText(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) {
    return { data: null, error: "model_catalog.yaml 为空" };
  }
  if (window.jsyaml && typeof window.jsyaml.load === "function") {
    try {
      return { data: window.jsyaml.load(trimmed), error: "" };
    } catch (error) {
      return { data: null, error: `YAML 解析失败：${error?.message || "格式错误"}` };
    }
  }
  try {
    return { data: JSON.parse(trimmed), error: "" };
  } catch (error) {
    return { data: null, error: `JSON 解析失败：${error?.message || "格式错误"}` };
  }
}

export function normalizeModelCatalog(raw) {
  if (!raw) return null;
  lastRawCatalogData = raw;
  const userVariables = raw.api_keys || raw.variables || raw.secrets || {};
  const localKeys = loadLocalApiKeys();
  const mergedKeys = { ...userVariables };
  Object.entries(localKeys).forEach(([k, v]) => {
    if (v && typeof v === "string" && v.trim()) mergedKeys[k] = v.trim();
  });
  setCatalogApiKeys(mergedKeys);
  const runtimeVariables = {
    origin: window.location?.origin || "",
    host: window.location?.host || "",
    protocol: window.location?.protocol || ""
  };
  const variables = {
    ...runtimeVariables,
    ...mergedKeys
  };
  let providers = [];
  if (Array.isArray(raw)) {
    providers = raw;
  } else if (Array.isArray(raw.providers)) {
    providers = raw.providers;
  } else if (raw.providers && typeof raw.providers === "object") {
    providers = Object.entries(raw.providers).map(([id, value]) => ({
      ...(value || {}),
      id
    }));
  }
  const normalized = providers.map((entry) => normalizeProviderEntry(entry, variables)).filter(Boolean);
  return normalized.length ? { providers: normalized } : null;
}

function refreshModelOptionsFromCatalog() {
  const hasCatalog =
    loadedModelCatalog &&
    Array.isArray(loadedModelCatalog.providers) &&
    loadedModelCatalog.providers.length > 0;
  if (!hasCatalog) {
    setMODEL_OPTIONS([]);
    return;
  }
  const newOptions = [];
  const seen = new Set();
  loadedModelCatalog.providers.forEach((provider) => {
    const modelNames = provider.models.map((m) => m.name);
    modelNames.forEach((name) => {
      const value = `${provider.id}:${name}`;
      if (seen.has(value)) return;
      newOptions.push({ value, label: `${provider.label} / ${name}` });
      seen.add(value);
    });
  });
  setMODEL_OPTIONS(newOptions);
}

export function applyModelCatalog(catalog) {
  setLoadedModelCatalog(catalog);
  const newMap = {};
  if (catalog && Array.isArray(catalog.providers)) {
    catalog.providers.forEach((provider) => {
      newMap[provider.id] = provider;
    });
  }
  setCustomProviderMap(newMap);
  refreshModelOptionsFromCatalog();
  initModelSelect();
  runModelCatalogHealthCheck();
  renderAll();
}

export function getCustomProviderConfig(providerId) {
  if (!providerId) return null;
  return customProviderMap[providerId] || null;
}

export function renderModelHealthCheck() {
  if (!modelHealthBox) return;
  modelHealthBox.innerHTML = "";
  const summary = document.createElement("div");
  summary.className = "model-health-summary";

  if (!modelCatalogLoadStatus.ok) {
    summary.classList.add("error");
    summary.textContent = `加载失败：${modelCatalogLoadStatus.message || "无法读取 model_catalog.yaml"}`;
    modelHealthBox.appendChild(summary);
    return;
  }

  const total = modelCatalogHealth.length;
  const okCount = modelCatalogHealth.filter((item) => item.status === "ready").length;
  const warnCount = modelCatalogHealth.filter((item) => item.status === "warning").length;
  const errCount = modelCatalogHealth.filter((item) => item.status === "error").length;
  summary.textContent = `启动健康检查：可用 ${okCount + warnCount}/${total}（通过 ${okCount}，警告 ${warnCount}，失败 ${errCount}）`;
  modelHealthBox.appendChild(summary);

  const list = document.createElement("div");
  list.className = "model-health-list";
  modelCatalogHealth.forEach((item) => {
    const card = document.createElement("div");
    card.className = `model-health-item ${item.status}`;
    const head = document.createElement("div");
    head.className = "model-health-head";
    const name = document.createElement("span");
    name.className = "model-health-provider";
    name.textContent = `${item.label} (${item.protocol})`;
    const badge = document.createElement("span");
    badge.className = "model-health-badge";
    badge.textContent = item.status === "ready" ? "通过" : item.status === "warning" ? "警告" : "失败";
    head.appendChild(name);
    head.appendChild(badge);
    card.appendChild(head);

    const details = [];
    details.push(`models: ${item.modelCount}`);
    if (item.errors.length) details.push(`错误: ${item.errors.join("；")}`);
    if (item.warnings.length) details.push(`警告: ${item.warnings.join("；")}`);
    const detail = document.createElement("div");
    detail.className = "model-health-detail";
    detail.textContent = details.join("\n");
    card.appendChild(detail);
    list.appendChild(card);
  });
  modelHealthBox.appendChild(list);
}

export function showModelCatalogFallback() {
  const el = document.getElementById("modelCatalogFallback");
  if (el) el.style.display = "block";
}

export function hideModelCatalogFallback() {
  const el = document.getElementById("modelCatalogFallback");
  if (el) el.style.display = "none";
}

export function loadModelCatalogFromText(text) {
  const parsed = parseModelCatalogText(text);
  if (!parsed.data) {
    if (typeof alert === "function") alert(parsed.error || "解析失败");
    return false;
  }
  const catalog = normalizeModelCatalog(parsed.data);
  if (!catalog) {
    if (typeof alert === "function") alert("providers 为空或格式不正确");
    return false;
  }
  setModelCatalogLoadStatus({ ok: true, message: "已从本地文件加载" });
  applyModelCatalog(catalog);
  renderModelHealthCheck();
  hideModelCatalogFallback();
  return true;
}

export async function autoLoadModelCatalog() {
  setModelCatalogLoadStatus({ ok: false, message: "正在加载 model_catalog.yaml..." });
  renderModelHealthCheck();

  let text = null;
  let fromYaml = false;

  try {
    const response = await fetch("model_catalog.yaml", { cache: "no-store" });
    if (response.ok) {
      text = await response.text();
      fromYaml = true;
    }
  } catch {}

  if (!text) {
    text = DEFAULT_CATALOG_YAML;
    fromYaml = false;
  }

  const parsed = parseModelCatalogText(text);
  if (!parsed.data) {
    setModelCatalogLoadStatus({ ok: false, message: parsed.error || "解析失败" });
    renderModelHealthCheck();
    showModelCatalogFallback();
    return modelCatalogLoadStatus;
  }

  const catalog = normalizeModelCatalog(parsed.data);
  if (!catalog) {
    setModelCatalogLoadStatus({ ok: false, message: "providers 为空或格式不正确" });
    renderModelHealthCheck();
    showModelCatalogFallback();
    return modelCatalogLoadStatus;
  }

  const msg = fromYaml ? "加载成功" : "已使用内置默认配置（请在页面中填写 API 密钥）";
  setModelCatalogLoadStatus({ ok: true, message: msg });
  applyModelCatalog(catalog);
  if (fromYaml) {
    hideModelCatalogFallback();
  }
  return modelCatalogLoadStatus;
}

export function getModelConfig(actor) {
  const choice = getEffectiveModelChoice(actor);
  const { provider, model } = parseModelChoice(choice);
  const temperature = Number(tempInput.value) || 1.0;
  const custom = getCustomProviderConfig(provider);
  if (!custom) {
    alert("未找到模型配置，请在设置中填写 API 密钥或检查 model_catalog.yaml。");
    return {
      provider: provider || "",
      model: model || "",
      apiKey: "",
      endpoint: "",
      temperature,
      protocol: "openai",
      requiresKey: true
    };
  }
  const protocol = custom.protocol || "openai";
  const endpoint = buildProviderEndpoint(custom);
  const modelName = model === "default"
    ? (custom.defaultModel || custom.models?.[0]?.name || model)
    : model;
  const requiresKey = typeof custom.apiKeyRequired === "boolean"
    ? custom.apiKeyRequired
    : true;
  const providerHealth = getProviderHealth(provider);
  if (providerHealth && providerHealth.status === "error") {
    const reason = providerHealth.errors[0] || "配置不完整";
    alert(`${providerHealth.label} 配置异常：${reason}`);
  }
  return {
    provider,
    model: modelName,
    apiKey: custom.apiKey || "",
    endpoint,
    temperature,
    protocol,
    requiresKey,
    headers: custom.headers || {},
    label: custom.label || provider
  };
}

// Also export the additional helper functions that may be needed externally
export { runModelCatalogHealthCheck, validateProviderHealth };

export function getModelStartupReadiness() {
  if (!modelCatalogLoadStatus.ok) {
    return { ok: false, message: `模型配置加载失败：${modelCatalogLoadStatus.message || "请检查 model_catalog.yaml"}` };
  }
  if (!Array.isArray(modelCatalogHealth) || !modelCatalogHealth.length) {
    return { ok: false, message: "未发现可检查的 provider，请检查 model_catalog.yaml.providers。" };
  }
  const usable = modelCatalogHealth.filter((item) => item.status !== "error");
  if (!usable.length) {
    return { ok: false, message: "模型配置未通过健康检查：没有可用 provider。" };
  }
  const choice = getDefaultModelChoice();
  const parsed = parseModelChoice(choice);
  if (!parsed.provider) {
    return { ok: false, message: "默认模型未设置，请先在设置中选择模型。" };
  }
  const selectedHealth = getProviderHealth(parsed.provider);
  if (!selectedHealth) {
    return { ok: false, message: `默认模型 provider 未找到：${parsed.provider}` };
  }
  if (selectedHealth.status === "error") {
    const firstReason = selectedHealth.errors[0] || "配置异常";
    return { ok: false, message: `默认模型 provider 校验失败（${selectedHealth.label}）：${firstReason}` };
  }
  return { ok: true, message: "" };
}
