/**
 * settings.js — Settings-related functions extracted from singleplayer_demo.html
 *
 * Handles restoring persisted settings, randomizing AI models,
 * populating the model/role select dropdowns, and the settings drawer + header phase.
 */

import { state } from './state.js';
import {
  MODEL_STORAGE,
  AUTO_NIGHT_STORAGE,
  TRAJECTORY_STORAGE,
  DAY_DISCUSSION_STORAGE,
  DEFAULT_DAY_DISCUSSION_MINUTES,
  DEFAULT_MODEL,
  SCRIPT,
  MODEL_OPTIONS
} from './constants.js';
import {
  modelSelect,
  humanRoleSelect,
  autoNightToggle,
  trajectoryToggle,
  dayDiscussionMinutesInput,
  renderAll
} from './ui-helpers.js';
import { addChat } from './chat.js';
import { getProviderHealth } from './model-catalog.js';

/* ===== restoreSettings ===== */

export function restoreSettings() {
  modelSelect.value = localStorage.getItem(MODEL_STORAGE) || DEFAULT_MODEL;
  autoNightToggle.checked = localStorage.getItem(AUTO_NIGHT_STORAGE) !== "0";
  if (trajectoryToggle) {
    trajectoryToggle.checked = localStorage.getItem(TRAJECTORY_STORAGE) === "1";
  }
  const storedMinutes = Number(localStorage.getItem(DAY_DISCUSSION_STORAGE));
  const minutes = Number.isFinite(storedMinutes) && storedMinutes > 0
    ? storedMinutes
    : DEFAULT_DAY_DISCUSSION_MINUTES;
  if (dayDiscussionMinutesInput) {
    dayDiscussionMinutesInput.value = minutes;
  }
  if (state && !state.started) {
    state.discussionDurationSeconds = minutes * 60;
    state.discussionMaxRemaining = minutes * 60;
  }
  if (state) {
    state.recordTrajectories = trajectoryToggle ? trajectoryToggle.checked : false;
  }
}

/* ===== randomizeAiModels ===== */

export function randomizeAiModels() {
  if (!state || !Array.isArray(state.players) || !state.players.length) {
    alert("请先生成玩家。");
    return;
  }
  const pool = MODEL_OPTIONS
    .filter((option) => {
      const [providerId] = String(option.value || "").split(":");
      if (!providerId) return false;
      const health = getProviderHealth(providerId);
      return Boolean(health && health.status !== "error");
    })
    .map((option) => option.value);
  if (!pool.length) {
    alert("当前没有通过健康检查的可用模型，无法随机分配。");
    return;
  }
  state.players.forEach((player) => {
    if (player.isHuman) return;
    player.modelChoice = pool[Math.floor(Math.random() * pool.length)];
  });
  addChat("系统", `已从 ${pool.length} 个健康模型中随机分配 AI 模型。`, "system");
  renderAll();
}

/* ===== initModelSelect ===== */

export function initModelSelect() {
  if (!modelSelect) return;
  modelSelect.innerHTML = "";
  MODEL_OPTIONS.forEach((option) => {
    const opt = document.createElement("option");
    opt.value = option.value;
    opt.textContent = option.label;
    modelSelect.appendChild(opt);
  });
  const saved = localStorage.getItem(MODEL_STORAGE) || DEFAULT_MODEL;
  const hasSaved = MODEL_OPTIONS.some((opt) => opt.value === saved);
  if (hasSaved) {
    modelSelect.value = saved;
  } else if (MODEL_OPTIONS.length) {
    modelSelect.value = MODEL_OPTIONS[0].value;
    localStorage.setItem(MODEL_STORAGE, MODEL_OPTIONS[0].value);
  }
}

/* ===== initRoleSelect ===== */

export function initRoleSelect() {
  if (!humanRoleSelect) return;
  humanRoleSelect.innerHTML = "";
  const randomOption = document.createElement("option");
  randomOption.value = "random";
  randomOption.textContent = "随机";
  humanRoleSelect.appendChild(randomOption);
  SCRIPT.roles.forEach((role) => {
    if (role.name === "酒鬼") return;
    const option = document.createElement("option");
    option.value = role.id;
    option.textContent = `${role.name} (${role.team})`;
    humanRoleSelect.appendChild(option);
  });
}

/* ===== openSettingsDrawer / closeSettingsDrawer ===== */

export function openSettingsDrawer() {
  const settingsDrawer = document.getElementById("settingsDrawer");
  const drawerOverlay = document.getElementById("drawerOverlay");
  settingsDrawer.classList.add("open");
  drawerOverlay.classList.add("open");
}

export function closeSettingsDrawer() {
  const settingsDrawer = document.getElementById("settingsDrawer");
  const drawerOverlay = document.getElementById("drawerOverlay");
  settingsDrawer.classList.remove("open");
  drawerOverlay.classList.remove("open");
}

/* ===== updateHeaderPhase ===== */

export function updateHeaderPhase() {
  const dot = document.getElementById("headerPhaseDot");
  const text = document.getElementById("headerPhaseText");
  if (!dot || !text) return;
  if (!state || !state.started) {
    dot.className = "phase-dot";
    text.textContent = "未开局";
    return;
  }
  if (state.ended) {
    dot.className = "phase-dot ended";
    text.textContent = "已结束";
    return;
  }
  if (state.phase === "night") {
    dot.className = "phase-dot night";
    text.textContent = `夜晚 ${state.nightCount}`;
  } else if (state.phase === "day" && state.dayStage === "nomination") {
    dot.className = "phase-dot dusk";
    text.textContent = `白天 ${state.dayCount} · 提名 (黄昏)`;
  } else {
    dot.className = "phase-dot day";
    text.textContent = `白天 ${state.dayCount} · 讨论`;
  }
}
