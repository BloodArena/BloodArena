/**
 * bgm.js — BGM player
 * Extracted from singleplayer_demo.html
 */

// --- State imports ---
import { state } from "./state.js";

/* ===== BGM PLAYER ===== */

const audio = document.getElementById("bgmAudio");
const panel = document.getElementById("bgmPanel");
const toggleBtn = document.getElementById("bgmToggleBtn");
const closeBtn = document.getElementById("bgmPanelCloseBtn");
const playPauseBtn = document.getElementById("bgmPlayPauseBtn");
const trackLabel = document.getElementById("bgmTrackLabel");
const volumeSlider = document.getElementById("bgmVolumeSlider");
const tracks = document.querySelectorAll(".bgm-track");
const categoryEls = document.querySelectorAll(".bgm-category");

let currentTrack = null;
let isPlaying = false;
let lastAutoCategory = "";
let pendingAutoRetry = false;
let voicePausedBgm = false;

const tracksByCategory = {};
categoryEls.forEach((categoryEl) => {
  const key = String(categoryEl.dataset.bgmKey || "").trim();
  if (!key) return;
  tracksByCategory[key] = Array.from(categoryEl.querySelectorAll(".bgm-track"));
});

audio.volume = parseFloat(volumeSlider.value);

export function pauseBgmForVoice() {
  if (!audio || !audio.src) {
    voicePausedBgm = false;
    return;
  }
  if (!audio.paused && !audio.ended) {
    voicePausedBgm = true;
    audio.pause();
  } else {
    voicePausedBgm = false;
  }
}

export function resumeBgmAfterVoice() {
  if (!audio) return;
  if (!voicePausedBgm) return;
  voicePausedBgm = false;
  if (audio.src) {
    audio.play().catch(() => {
      scheduleAutoRetry();
    });
  }
}

function setActiveTrack(el) {
  tracks.forEach((t) => t.classList.remove("active", "paused"));
  if (el) {
    el.classList.add("active");
    const name = el.querySelector(".bgm-track-name").textContent;
    const meta = el.querySelector(".bgm-track-meta").textContent;
    trackLabel.textContent = name;
    trackLabel.classList.add("visible");
    playPauseBtn.classList.add("visible");
    volumeSlider.classList.add("visible");
  }
}

function trackSrcMatches(src) {
  const cur = String(audio.src || "");
  if (!cur) return false;
  return decodeURIComponent(cur).endsWith(src);
}

function scheduleAutoRetry() {
  if (pendingAutoRetry) return;
  pendingAutoRetry = true;
  const retry = () => {
    pendingAutoRetry = false;
    document.removeEventListener("pointerdown", retry, true);
    document.removeEventListener("keydown", retry, true);
    if (typeof window.syncAutoBgmForState === "function") {
      window.syncAutoBgmForState({ force: true });
    }
  };
  document.addEventListener("pointerdown", retry, true);
  document.addEventListener("keydown", retry, true);
}

function playTrack(el, options = {}) {
  if (!el) return;
  const { toggleIfSame = true, auto = false } = options;
  const src = el.dataset.src;
  if (!src) return;
  if (currentTrack === el && trackSrcMatches(src)) {
    if (!toggleIfSame) {
      if (!isPlaying) {
        audio.play().catch(() => {
          if (auto) scheduleAutoRetry();
        });
      }
      setActiveTrack(el);
      return;
    }
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play().catch(() => {
        if (auto) scheduleAutoRetry();
      });
    }
    return;
  }
  currentTrack = el;
  audio.src = src;
  setActiveTrack(el);
  audio.play().catch(() => {
    if (auto) scheduleAutoRetry();
  });
}

function getAliveCount() {
  if (!state || !Array.isArray(state.players)) return 0;
  return state.players.filter((p) => p && p.alive).length;
}

function getCategoryByState() {
  if (!state || !state.started) return "opening";
  if (state.ended) return "ending";
  if (state.phase === "night") return "night";
  if (getAliveCount() <= 4) return "finale";
  if (state.phase === "day" && state.dayStage === "nomination") return "reasoning";
  return "discussion";
}

function pickRandomTrack(pool) {
  if (!Array.isArray(pool) || !pool.length) return null;
  if (pool.length === 1) return pool[0];
  const candidates = currentTrack ? pool.filter((t) => t !== currentTrack) : pool.slice();
  const list = candidates.length ? candidates : pool;
  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

export function syncAutoBgmForState(options = {}) {
  const { force = false } = options;
  const category = getCategoryByState();
  if (!force && category === lastAutoCategory) return;
  const pool = tracksByCategory[category];
  if (!pool || !pool.length) return;
  const selected = pickRandomTrack(pool);
  if (!selected) return;
  lastAutoCategory = category;
  playTrack(selected, { toggleIfSame: false, auto: true });
}

function updatePlayPauseBtn() {
  playPauseBtn.textContent = isPlaying ? "⏸" : "▶";
  if (currentTrack) {
    if (isPlaying) {
      currentTrack.classList.remove("paused");
    } else {
      currentTrack.classList.add("paused");
    }
  }
}

audio.addEventListener("play", () => {
  isPlaying = true;
  updatePlayPauseBtn();
});
audio.addEventListener("pause", () => {
  isPlaying = false;
  updatePlayPauseBtn();
});

tracks.forEach((track) => {
  track.addEventListener("click", () => {
    playTrack(track, { toggleIfSame: true, auto: false });
  });
});

toggleBtn.addEventListener("click", () => {
  panel.classList.toggle("open");
});

closeBtn.addEventListener("click", () => {
  panel.classList.remove("open");
});

playPauseBtn.addEventListener("click", () => {
  if (!audio.src) return;
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play().catch(() => {});
  }
});

volumeSlider.addEventListener("input", () => {
  audio.volume = parseFloat(volumeSlider.value);
});

document.addEventListener("click", (e) => {
  if (
    panel.classList.contains("open") &&
    !panel.contains(e.target) &&
    !document.getElementById("bgmBar").contains(e.target)
  ) {
    panel.classList.remove("open");
  }
});

syncAutoBgmForState({ force: true });

/* Keep window assignments for backward compatibility */
window.syncAutoBgmForState = syncAutoBgmForState;
window.pauseBgmForVoice = pauseBgmForVoice;
window.resumeBgmAfterVoice = resumeBgmAfterVoice;
