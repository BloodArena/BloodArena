/**
 * tts.js — TTS engine (mimo-v2-tts)
 * Extracted from singleplayer_demo.html
 */

import { catalogApiKeys } from "./state.js";

const TTS_ENDPOINT = "https://api.xiaomimimo.com/v1/chat/completions";
const TTS_MODEL = "mimo-v2-tts";
const MAX_QUEUE = 6;
const MAX_AUDIO_CACHE = 48;

const VOICE_STYLES = [
  "成熟男性 低沉磁性",
  "年轻女性 温柔甜美",
  "中年男性 沉稳威严",
  "少年 活泼开朗",
  "老年男性 沙哑沧桑",
  "年轻男性 阳光爽朗",
  "少女 元气可爱",
  "中年女性 知性优雅",
  "青年女性 英姿飒爽",
  "男童 天真稚嫩",
  "东北口音 豪爽大方",
  "四川口音 温柔亲切",
  "北京口音 爽朗大气",
  "天津口音 幽默风趣",
  "河南口音 朴实憨厚",
];

const ttsToggle = document.getElementById("ttsToggle");
const ttsAutoToggle = document.getElementById("ttsAutoToggle");
const ttsPauseBtn = document.getElementById("ttsPauseBtn");
const ttsQuickPauseBtn = document.getElementById("ttsQuickPauseBtn");
const ttsQuickClearBtn = document.getElementById("ttsQuickClearBtn");
const ttsVolumeSlider = document.getElementById("ttsVolumeSlider");
const ttsStatusEl = document.getElementById("ttsStatus");
const ttsQuickStatusEl = document.getElementById("ttsQuickStatus");
const bgmAudio = document.getElementById("bgmAudio");

const TTS_STORAGE_KEY = "tts_settings";

function loadTtsSettings() {
  try {
    return JSON.parse(localStorage.getItem(TTS_STORAGE_KEY)) || {};
  } catch {
    return {};
  }
}

function saveTtsSettings() {
  localStorage.setItem(TTS_STORAGE_KEY, JSON.stringify({
    enabled: Boolean(ttsToggle?.checked),
    autoPlay: ttsAutoToggle ? ttsAutoToggle.checked !== false : true,
    volume: parseFloat(ttsVolumeSlider?.value) || 0.8,
  }));
}

const saved = loadTtsSettings();
if (ttsToggle) ttsToggle.checked = Boolean(saved.enabled);
if (ttsAutoToggle) ttsAutoToggle.checked = saved.autoPlay !== false;
if (ttsVolumeSlider && saved.volume !== undefined) ttsVolumeSlider.value = saved.volume;

function getMimoApiKey() {
  return catalogApiKeys.mimo || "";
}

function isTtsEnabled() {
  return Boolean(ttsToggle?.checked);
}

function shouldAutoSpeak() {
  return isTtsEnabled() && (ttsAutoToggle ? ttsAutoToggle.checked !== false : true);
}

const speakerStyleMap = {};
let usedStyleIndices = [];

function getStyleForSpeaker(name) {
  if (speakerStyleMap[name]) return speakerStyleMap[name];
  if (usedStyleIndices.length >= VOICE_STYLES.length) {
    usedStyleIndices = [];
  }
  const available = VOICE_STYLES.map((_, index) => index)
    .filter((index) => !usedStyleIndices.includes(index));
  const pick = available[Math.floor(Math.random() * available.length)];
  usedStyleIndices.push(pick);
  speakerStyleMap[name] = VOICE_STYLES[pick];
  return speakerStyleMap[name];
}

const queue = [];
const audioCache = new Map();
let playing = false;
let paused = false;
let bgmLowered = false;
let cancelled = false;
let currentAudio = null;
let currentEntry = null;
let resumeWaiters = [];

function getSpeechCacheKey(speaker, text) {
  return `${speaker}\u0000${String(text || "").trim()}`;
}

function trimAudioCache() {
  while (audioCache.size > MAX_AUDIO_CACHE) {
    const oldestKey = audioCache.keys().next().value;
    if (!oldestKey) break;
    audioCache.delete(oldestKey);
  }
}

function getCachedAudioPromise(speaker, text) {
  const key = getSpeechCacheKey(speaker, text);
  if (audioCache.has(key)) {
    const cachedPromise = audioCache.get(key);
    audioCache.delete(key);
    audioCache.set(key, cachedPromise);
    return { key, promise: cachedPromise, cached: true };
  }
  const promise = fetchTtsAudioBlob(speaker, text).catch((error) => {
    audioCache.delete(key);
    throw error;
  });
  audioCache.set(key, promise);
  trimAudioCache();
  return { key, promise, cached: false };
}

export function ttsPrefetch(speaker, text) {
  const cleanedText = String(text || "").trim();
  if (!cleanedText || !isTtsEnabled()) return false;
  getCachedAudioPromise(speaker, cleanedText);
  return true;
}

function lowerBgm() {
  if (bgmLowered || !bgmAudio) return;
  bgmLowered = true;
  bgmAudio._savedVolume = bgmAudio.volume;
  bgmAudio.volume = Math.max(0, bgmAudio.volume * 0.25);
}

function restoreBgm() {
  if (!bgmLowered || !bgmAudio) return;
  bgmLowered = false;
  if (bgmAudio._savedVolume !== undefined) {
    bgmAudio.volume = bgmAudio._savedVolume;
    delete bgmAudio._savedVolume;
  }
}

function getIdleStatusText() {
  return isTtsEnabled() ? "语音待命" : "语音未启用";
}

function updateStatus(message = "", cls = "") {
  const finalMessage = message || getIdleStatusText();
  if (ttsStatusEl) {
    ttsStatusEl.textContent = finalMessage;
    ttsStatusEl.className = "tts-status" + (cls ? ` ${cls}` : "");
  }
  if (ttsQuickStatusEl) {
    ttsQuickStatusEl.textContent = finalMessage;
  }
}

function describeEntry(entry) {
  if (!entry) return "";
  const remaining = Math.max(0, queue.length);
  return `${entry.speaker} 语音${remaining ? `（剩余 ${remaining}）` : ""}`;
}

function updatePauseButton() {
  const hasWork = Boolean(currentEntry || currentAudio || queue.length);
  [ttsPauseBtn, ttsQuickPauseBtn].forEach((button) => {
    if (!button) return;
    button.disabled = !hasWork;
    button.textContent = paused ? "继续播放" : "暂停播放";
  });
  if (ttsQuickClearBtn) {
    ttsQuickClearBtn.disabled = !hasWork;
  }
}

function refreshStatus() {
  if (paused && (currentEntry || currentAudio || queue.length)) {
    updateStatus(`语音已暂停：${describeEntry(currentEntry) || "等待继续"}`, "paused");
    updatePauseButton();
    return;
  }
  if (playing && currentEntry) {
    if (currentEntry.phase === "loading") {
      updateStatus(`正在请求：${describeEntry(currentEntry)}`, "active");
    } else {
      updateStatus(`🔊 正在播放：${describeEntry(currentEntry)}`, "active");
    }
    updatePauseButton();
    return;
  }
  if (queue.length) {
    const next = queue[0];
    const prefix = next.cached ? "已排队" : "等待请求";
    updateStatus(`${prefix}：${describeEntry(next)}`, "active");
    updatePauseButton();
    return;
  }
  updateStatus("");
  updatePauseButton();
}

function resolveResumeWaiters() {
  const pending = resumeWaiters.slice();
  resumeWaiters = [];
  pending.forEach((resolve) => resolve());
}

function waitUntilResumed() {
  if (!paused) return Promise.resolve();
  return new Promise((resolve) => {
    resumeWaiters.push(resolve);
  });
}

async function fetchTtsAudioBlob(speaker, text) {
  const apiKey = getMimoApiKey();
  if (!apiKey || apiKey === "YOUR_MIMO_API_KEY") {
    throw new Error("请在 model_catalog.yaml 中填写 mimo API Key");
  }

  const style = getStyleForSpeaker(speaker);
  const styledText = `<style>${style}</style>${text}`;
  const body = {
    model: TTS_MODEL,
    messages: [
      {
        role: "user",
        content: `请用自然流畅的语气朗读以下内容。你是一个名叫"${speaker}"的角色。`
      },
      {
        role: "assistant",
        content: styledText,
      },
    ],
    audio: {
      format: "wav",
      voice: "mimo_default",
    },
  };

  const response = await fetch(TTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`API ${response.status}: ${errorText.slice(0, 200)}`);
  }

  const data = await response.json();
  const audioB64 = data?.choices?.[0]?.message?.audio?.data;
  if (!audioB64) {
    throw new Error("API 返回中无音频数据");
  }

  const raw = atob(audioB64);
  const bytes = new Uint8Array(raw.length);
  for (let index = 0; index < raw.length; index += 1) {
    bytes[index] = raw.charCodeAt(index);
  }
  return new Blob([bytes], { type: "audio/wav" });
}

function playAudioBlob(blob) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    currentAudio = audio;
    audio.volume = parseFloat(ttsVolumeSlider?.value) || 0.8;
    audio.onended = () => {
      currentAudio = null;
      URL.revokeObjectURL(url);
      resolve();
    };
    audio.onerror = (event) => {
      currentAudio = null;
      URL.revokeObjectURL(url);
      reject(event);
    };
    audio.play().catch((error) => {
      currentAudio = null;
      URL.revokeObjectURL(url);
      reject(error);
    });
  });
}

function dropOverflowQueue() {
  while (queue.length > MAX_QUEUE) {
    queue.shift();
  }
}

function enqueueSpeech(speaker, text, options = {}) {
  const { promise, cached } = getCachedAudioPromise(speaker, text);
  const entry = {
    speaker,
    text,
    cached,
    audioPromise: promise,
    phase: "loading",
  };
  if (options.priority) {
    queue.unshift(entry);
  } else {
    queue.push(entry);
  }
  dropOverflowQueue();
  if (options.manual) {
    updateStatus(
      cached ? `已加入播放队列：${speaker} 语音` : `正在请求：${speaker} 语音`,
      "active"
    );
  }
  refreshStatus();
  processQueue();
  return { queued: true, cached };
}

async function processQueue() {
  if (playing || !queue.length) return;
  playing = true;
  cancelled = false;

  while (queue.length > 0 && !cancelled) {
    const entry = queue.shift();
    currentEntry = entry;
    currentEntry.phase = "loading";
    refreshStatus();
    try {
      const blob = await entry.audioPromise;
      if (cancelled) {
        break;
      }
      if (paused) {
        refreshStatus();
        await waitUntilResumed();
        if (cancelled) {
          break;
        }
      }
      currentEntry.phase = "playing";
      refreshStatus();
      lowerBgm();
      await playAudioBlob(blob);
    } catch (error) {
      console.warn("[TTS] error:", error);
      updateStatus(`语音播报失败: ${error?.message || error}`, "error");
    } finally {
      currentEntry = null;
      refreshStatus();
    }
  }

  playing = false;
  currentAudio = null;
  currentEntry = null;
  restoreBgm();
  if (!cancelled) {
    refreshStatus();
  }
}

function setPaused(nextPaused) {
  if (paused === nextPaused) return paused;
  paused = nextPaused;
  if (paused) {
    if (currentAudio && !currentAudio.paused) {
      try { currentAudio.pause(); } catch {}
    }
    restoreBgm();
    refreshStatus();
    return paused;
  }

  resolveResumeWaiters();
  if (currentAudio && currentAudio.paused) {
    lowerBgm();
    currentAudio.play().catch((error) => {
      console.warn("[TTS] resume failed:", error);
      updateStatus(`继续播放失败: ${error?.message || error}`, "error");
    });
  } else if (!playing && queue.length) {
    processQueue();
  }
  refreshStatus();
  return paused;
}

export function ttsSpeak(speaker, text, options = {}) {
  const cleanedText = String(text || "").trim();
  if (!cleanedText) return { accepted: false, cached: false };
  if (!isTtsEnabled()) {
    if (options.manual) {
      updateStatus("请先开启 AI 语音功能。", "error");
    }
    return { accepted: false, cached: false };
  }
  if (!options.manual && !shouldAutoSpeak()) {
    return { accepted: false, cached: false };
  }
  cancelled = false;
  const queued = enqueueSpeech(speaker, cleanedText, {
    priority: Boolean(options.priority),
    manual: Boolean(options.manual)
  });
  return { accepted: true, cached: Boolean(queued.cached) };
}

export function ttsPlayManual(speaker, text) {
  return ttsSpeak(speaker, text, { manual: true, priority: true });
}

export function ttsTogglePause(forcePaused = null) {
  const nextPaused = typeof forcePaused === "boolean" ? forcePaused : !paused;
  return setPaused(nextPaused);
}

export function ttsClearQueue() {
  cancelled = true;
  resolveResumeWaiters();
  queue.length = 0;
  if (currentAudio) {
    try {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    } catch {}
    currentAudio = null;
  }
  currentEntry = null;
  playing = false;
  paused = false;
  restoreBgm();
  refreshStatus();
}

export function ttsShouldAutoSpeak() {
  return shouldAutoSpeak();
}

if (ttsToggle) {
  ttsToggle.addEventListener("change", () => {
    if (!ttsToggle.checked) {
      ttsClearQueue();
    }
    saveTtsSettings();
    refreshStatus();
  });
}

if (ttsAutoToggle) {
  ttsAutoToggle.addEventListener("change", () => {
    saveTtsSettings();
    refreshStatus();
  });
}

if (ttsVolumeSlider) {
  ttsVolumeSlider.addEventListener("input", () => {
    if (currentAudio) {
      currentAudio.volume = parseFloat(ttsVolumeSlider.value) || 0.8;
    }
    saveTtsSettings();
  });
}

[ttsPauseBtn, ttsQuickPauseBtn].forEach((button) => {
  if (!button) return;
  button.addEventListener("click", () => {
    ttsTogglePause();
  });
});

if (ttsQuickClearBtn) {
  ttsQuickClearBtn.addEventListener("click", () => {
    ttsClearQueue();
  });
}

refreshStatus();

window.ttsSpeak = ttsSpeak;
window.ttsPrefetch = ttsPrefetch;
window.ttsPlayManual = ttsPlayManual;
window.ttsClearQueue = ttsClearQueue;
window.ttsTogglePause = ttsTogglePause;
window.ttsShouldAutoSpeak = ttsShouldAutoSpeak;
