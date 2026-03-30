/**
 * tts.js — TTS engine (mimo-v2-tts)
 * Extracted from singleplayer_demo.html
 */

// --- State imports ---
import { catalogApiKeys } from "./state.js";

/* ===== TTS ENGINE (mimo-v2-tts) ===== */

const TTS_ENDPOINT = "https://api.xiaomimimo.com/v1/chat/completions";
const TTS_MODEL = "mimo-v2-tts";
const MAX_QUEUE = 6; /* drop oldest when queue exceeds this */

/* voice style pool — each AI player gets a random unique style */
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
const ttsVolumeSlider = document.getElementById("ttsVolumeSlider");
const ttsStatusEl = document.getElementById("ttsStatus");

/* persistent settings */
const TTS_STORAGE_KEY = "tts_settings";
function loadTtsSettings() {
  try {
    return JSON.parse(localStorage.getItem(TTS_STORAGE_KEY)) || {};
  } catch { return {}; }
}
function saveTtsSettings() {
  localStorage.setItem(TTS_STORAGE_KEY, JSON.stringify({
    enabled: ttsToggle.checked,
    volume: parseFloat(ttsVolumeSlider.value),
  }));
}

const saved = loadTtsSettings();
if (saved.enabled) ttsToggle.checked = true;
if (saved.volume !== undefined) ttsVolumeSlider.value = saved.volume;

ttsToggle.addEventListener("change", saveTtsSettings);
ttsVolumeSlider.addEventListener("input", saveTtsSettings);

function getMimoApiKey() {
  return catalogApiKeys.mimo || "";
}

/* map speaker name → style */
const speakerStyleMap = {};
let usedStyleIndices = [];

function getStyleForSpeaker(name) {
  if (speakerStyleMap[name]) return speakerStyleMap[name];
  if (usedStyleIndices.length >= VOICE_STYLES.length) {
    usedStyleIndices = [];
  }
  const available = VOICE_STYLES.map((_, i) => i)
    .filter((i) => !usedStyleIndices.includes(i));
  const pick = available[Math.floor(Math.random() * available.length)];
  usedStyleIndices.push(pick);
  speakerStyleMap[name] = VOICE_STYLES[pick];
  return speakerStyleMap[name];
}

/* ---- pre-fetch pipeline ---- */
/*  Each queue entry: { speaker, text, audioPromise }
 *  audioPromise starts the API call immediately on enqueue,
 *  so the next audio is already being fetched while current one plays. */
const queue = [];
let playing = false;
let bgmLowered = false;
let cancelled = false;
let currentAudio = null;
const bgmAudio = document.getElementById("bgmAudio");

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

function updateStatus(msg, cls) {
  if (!ttsStatusEl) return;
  ttsStatusEl.textContent = msg;
  ttsStatusEl.className = "tts-status" + (cls ? " " + cls : "");
}

/* fetch audio from API, returns blob URL (or throws) */
async function fetchTtsAudio(speaker, text) {
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

  const resp = await fetch(TTS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify(body),
  });

  if (!resp.ok) {
    const errText = await resp.text().catch(() => "");
    throw new Error(`API ${resp.status}: ${errText.slice(0, 200)}`);
  }

  const data = await resp.json();
  const audioB64 = data?.choices?.[0]?.message?.audio?.data;
  if (!audioB64) {
    throw new Error("API 返回中无音频数据");
  }

  const raw = atob(audioB64);
  const bytes = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) bytes[i] = raw.charCodeAt(i);
  const blob = new Blob([bytes], { type: "audio/wav" });
  return URL.createObjectURL(blob);
}

/* play a blob URL, returns promise */
function playBlobUrl(url) {
  return new Promise((resolve, reject) => {
    const audio = new Audio(url);
    currentAudio = audio;
    audio.volume = parseFloat(ttsVolumeSlider.value) || 0.8;
    audio.onended = () => { currentAudio = null; URL.revokeObjectURL(url); resolve(); };
    audio.onerror = (e) => { currentAudio = null; URL.revokeObjectURL(url); reject(e); };
    audio.play().catch(reject);
  });
}

async function processQueue() {
  if (playing || queue.length === 0) return;
  playing = true;
  cancelled = false;
  lowerBgm();

  while (queue.length > 0 && !cancelled) {
    const entry = queue.shift();
    updateStatus(`🔊 ${entry.speaker} 语音播报中…（剩余 ${queue.length}）`, "active");
    try {
      const blobUrl = await entry.audioPromise;
      if (cancelled) { URL.revokeObjectURL(blobUrl); break; }
      await playBlobUrl(blobUrl);
    } catch (e) {
      console.warn("[TTS] error:", e);
      updateStatus(`语音播报失败: ${e.message || e}`, "error");
    }
  }

  playing = false;
  currentAudio = null;
  restoreBgm();
  if (!cancelled) updateStatus("");
}

/* public interface */
export function ttsSpeak(speaker, text) {
  if (!ttsToggle.checked) return;
  if (!text) return;

  /* start API call immediately (pre-fetch) */
  const audioPromise = fetchTtsAudio(speaker, text);
  queue.push({ speaker, text, audioPromise });

  /* drop oldest entries if queue too long to prevent unbounded lag */
  while (queue.length > MAX_QUEUE) {
    const dropped = queue.shift();
    dropped.audioPromise.then((url) => URL.revokeObjectURL(url)).catch(() => {});
  }

  processQueue();
}

/* allow clearing queue (e.g. on game reset) */
export function ttsClearQueue() {
  cancelled = true;
  /* clean up pending fetches */
  while (queue.length > 0) {
    const dropped = queue.shift();
    dropped.audioPromise.then((url) => URL.revokeObjectURL(url)).catch(() => {});
  }
  if (currentAudio) {
    try { currentAudio.pause(); } catch {}
    currentAudio = null;
  }
  playing = false;
  restoreBgm();
  updateStatus("");
}

/* Keep window assignments for backward compatibility */
window.ttsSpeak = ttsSpeak;
window.ttsClearQueue = ttsClearQueue;
