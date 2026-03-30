/**
 * overlays.js — Modal, intro, dawn narration, note picker, and script board overlays
 * Extracted from singleplayer_demo.html
 */

// --- State imports ---
import {
  state,
  saveState,
  dawnTypingTimer, dawnHideTimer, dawnSafetyTimer
} from "./state.js";

// --- DOM refs ---
const modalOverlay = document.getElementById("modalOverlay");
const modalMessage = document.getElementById("modalMessage");
const introOverlay = document.getElementById("introOverlay");
const introVideo = document.getElementById("introVideo");
const startOverlay = document.getElementById("startOverlay");
const dawnOverlay = document.getElementById("dawnOverlay");
const dawnText = document.getElementById("dawnText");

/* ===== Modal ===== */

export function showModal(message) {
  if (!modalOverlay || !modalMessage) return;
  modalMessage.textContent = message;
  modalOverlay.classList.add("show");
}

export function hideModal() {
  if (!modalOverlay) return;
  modalOverlay.classList.remove("show");
}

/* ===== Intro Playback ===== */

export function finishIntroPlayback() {
  if (introOverlay) introOverlay.classList.remove("show");
  if (introVideo) {
    introVideo.pause();
    introVideo.currentTime = 0;
  }
  document.body.classList.remove("prestart");
}

export function startIntroPlayback() {
  if (startOverlay) startOverlay.classList.remove("show");
  if (introOverlay) introOverlay.classList.add("show");
  if (introVideo) {
    const playPromise = introVideo.play();
    if (playPromise && typeof playPromise.catch === "function") {
      playPromise.catch(() => {
        finishIntroPlayback();
      });
    }
  } else {
    finishIntroPlayback();
  }
}

/* ===== Dawn Narration ===== */

/*
 * NOTE: dawnTypingTimer, dawnHideTimer, dawnSafetyTimer are mutable state
 * variables exported from state.js. Since ES module bindings are read-only
 * from the importer side, we use local copies here and manage them directly.
 * The state.js copies are kept in sync where needed by the main wiring code.
 */
let _dawnTypingTimer = null;
let _dawnHideTimer = null;
let _dawnSafetyTimer = null;

export function showDawnNarration(text) {
  if (!dawnOverlay || !dawnText) return;
  if (_dawnTypingTimer) {
    clearInterval(_dawnTypingTimer);
    _dawnTypingTimer = null;
  }
  if (_dawnHideTimer) {
    clearTimeout(_dawnHideTimer);
    _dawnHideTimer = null;
  }
  if (_dawnSafetyTimer) {
    clearTimeout(_dawnSafetyTimer);
    _dawnSafetyTimer = null;
  }
  const raw = (text || "").trim() || "天亮了。";
  const formatted = raw.replace(/([。！？!?])\s*/g, "$1\n").trim();
  const full = formatted.slice(0, 240);
  let idx = 0;
  dawnText.textContent = "";
  dawnOverlay.classList.add("show");
  const speed = 45;
  _dawnTypingTimer = setInterval(() => {
    idx += 1;
    dawnText.textContent = full.slice(0, idx);
    if (idx >= full.length) {
      clearInterval(_dawnTypingTimer);
      _dawnTypingTimer = null;
      _dawnHideTimer = setTimeout(() => {
        dawnOverlay.classList.remove("show");
        if (_dawnSafetyTimer) {
          clearTimeout(_dawnSafetyTimer);
          _dawnSafetyTimer = null;
        }
        _dawnHideTimer = null;
      }, 1400);
    }
  }, speed);
  const maxDuration = Math.min(9000, Math.max(3500, full.length * speed + 1600));
  _dawnSafetyTimer = setTimeout(() => {
    dawnOverlay.classList.remove("show");
    if (_dawnTypingTimer) {
      clearInterval(_dawnTypingTimer);
      _dawnTypingTimer = null;
    }
    if (_dawnHideTimer) {
      clearTimeout(_dawnHideTimer);
      _dawnHideTimer = null;
    }
    _dawnSafetyTimer = null;
  }, maxDuration);
}

/* ===== NOTE PICKER SYSTEM ===== */

export function initNotePicker() {
  const rolePicker = document.getElementById("noteRolePicker");
  const tagPicker = document.getElementById("noteTagPicker");
  let activePlayerId = null;

  const ROLE_NAMES = Object.keys(window.ROLE_STRATEGY_TIPS || {});
  const TAG_OPTIONS = [
    "善良", "邪恶", "图管外来者", "猎手失去能力", "僧侣守护",
    "是酒鬼", "被恶魔杀死", "干扰项", "中毒", "管家的主人",
    "洗衣妇镇民", "外来者", "自定义笔记"
  ];

  function positionPicker(picker, anchorRect) {
    const pw = 260, ph = 320;
    let left = anchorRect.left + anchorRect.width / 2 - pw / 2;
    let top = anchorRect.bottom + 6;
    if (left < 8) left = 8;
    if (left + pw > window.innerWidth - 8) left = window.innerWidth - pw - 8;
    if (top + ph > window.innerHeight - 8) top = anchorRect.top - ph - 6;
    picker.style.left = left + "px";
    picker.style.top = top + "px";
  }

  function closeAll() {
    rolePicker.classList.remove("open");
    tagPicker.classList.remove("open");
    activePlayerId = null;
  }

  function getPlayer(id) {
    return state && state.players ? state.players.find((p) => p.id === id) : null;
  }

  /* ---- Role picker ---- */
  window.openNoteRolePicker = function (playerId, anchorRect) {
    closeAll();
    activePlayerId = playerId;
    rolePicker.innerHTML = "";
    /* clear option */
    const clearBtn = document.createElement("span");
    clearBtn.className = "note-picker-item clear-item";
    clearBtn.textContent = "空白";
    clearBtn.addEventListener("click", () => {
      const p = getPlayer(activePlayerId);
      if (p) { p.noteRole = ""; saveState(); renderSeatCircle(); }
      closeAll();
    });
    rolePicker.appendChild(clearBtn);
    /* role options */
    ROLE_NAMES.forEach((name) => {
      const btn = document.createElement("span");
      btn.className = "note-picker-item";
      btn.textContent = name;
      btn.addEventListener("click", () => {
        const p = getPlayer(activePlayerId);
        if (p) { p.noteRole = name; saveState(); renderSeatCircle(); }
        closeAll();
      });
      rolePicker.appendChild(btn);
    });
    positionPicker(rolePicker, anchorRect);
    rolePicker.classList.add("open");
  };

  /* ---- Tag picker ---- */
  window.openNoteTagPicker = function (playerId, anchorRect) {
    closeAll();
    activePlayerId = playerId;
    tagPicker.innerHTML = "";
    TAG_OPTIONS.forEach((tag) => {
      const btn = document.createElement("span");
      btn.className = "note-picker-item";
      btn.textContent = tag;
      btn.addEventListener("click", () => {
        const p = getPlayer(activePlayerId);
        if (!p) { closeAll(); return; }
        if (!Array.isArray(p.noteTags)) p.noteTags = [];
        if (tag === "自定义笔记") {
          closeAll();
          const custom = prompt("输入自定义笔记：");
          if (custom && custom.trim()) {
            p.noteTags.push(custom.trim());
            saveState();
            renderSeatCircle();
          }
          return;
        }
        if (!p.noteTags.includes(tag)) {
          p.noteTags.push(tag);
          saveState();
          renderSeatCircle();
        }
        closeAll();
      });
      tagPicker.appendChild(btn);
    });
    positionPicker(tagPicker, anchorRect);
    tagPicker.classList.add("open");
  };

  /* click outside to close */
  document.addEventListener("click", (e) => {
    if (!rolePicker.contains(e.target) && !tagPicker.contains(e.target) &&
        !e.target.closest(".seat-node") && !e.target.closest(".seat-plus-btn")) {
      closeAll();
    }
  });

  /* delegate: plus button click */
  document.addEventListener("click", (e) => {
    const plusBtn = e.target.closest(".seat-plus-btn");
    if (plusBtn) {
      e.stopPropagation();
      window.openNoteTagPicker(plusBtn.dataset.playerId, plusBtn.getBoundingClientRect());
    }
    /* delegate: tag click to remove */
    const tagEl = e.target.closest(".seat-tag");
    if (tagEl) {
      e.stopPropagation();
      const p = getPlayer(tagEl.dataset.playerId);
      if (p && Array.isArray(p.noteTags)) {
        const idx = Number(tagEl.dataset.tagIdx);
        if (idx >= 0 && idx < p.noteTags.length) {
          p.noteTags.splice(idx, 1);
          saveState();
          renderSeatCircle();
        }
      }
    }
  });

  /* escape to close */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll();
  });
}

/* ===== SCRIPT BOARD VIEWER ===== */

export function initScriptBoard() {
  const overlay = document.getElementById("scriptBoardOverlay");
  const openBtn = document.getElementById("scriptBoardBtn");
  const closeBtn = document.getElementById("scriptBoardCloseBtn");
  if (overlay && openBtn) {
    openBtn.addEventListener("click", () => overlay.classList.add("open"));
    closeBtn.addEventListener("click", (e) => { e.stopPropagation(); overlay.classList.remove("open"); });
    overlay.addEventListener("click", (e) => { if (e.target === overlay) overlay.classList.remove("open"); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape" && overlay.classList.contains("open")) overlay.classList.remove("open"); });
  }
}

/*
 * NOTE: renderSeatCircle() is expected to be available as a global
 * (window.renderSeatCircle) set by the main script. The note picker
 * calls it after modifying player data.
 */
function renderSeatCircle() {
  if (typeof window.renderSeatCircle === "function") {
    window.renderSeatCircle();
  }
}
