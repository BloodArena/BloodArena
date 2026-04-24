/**
 * main.js — Entry point module extracted from singleplayer_demo.html
 *
 * Imports all modules, wires up every event listener, and runs the
 * initialization sequence.  This file should be loaded as
 * <script type="module" src="js/main.js"></script>.
 */

/* ---- state ---- */
import {
  state, setState, saveState, loadState, normalizeState, setNormalizeDeps
} from './state.js';

/* ---- constants ---- */
import {
  MODEL_STORAGE,
  AUTO_NIGHT_STORAGE,
  TRAJECTORY_STORAGE,
  MAX_NOMINATIONS_PER_DAY,
  STORAGE_KEY,
  SCRIPT,
  MODEL_OPTIONS,
  ROLE_STRATEGY_TIPS,
  getRoleStrategyTips
} from './constants.js';

/* ---- api ---- */
import { renderTokenUsageDisplay } from './api.js';

/* ---- model-catalog ---- */
import {
  autoLoadModelCatalog,
  loadModelCatalogFromText,
  renderModelHealthCheck,
  getModelStartupReadiness
} from './model-catalog.js';

/* ---- settings ---- */
import {
  restoreSettings,
  randomizeAiModels,
  initModelSelect,
  initRoleSelect,
  openSettingsDrawer,
  closeSettingsDrawer,
  updateHeaderPhase
} from './settings.js';

/* ---- export / replay ---- */
import {
  exportJson,
  exportTrajectories,
  generateStorySummary,
  renderReplay
} from './export.js';

/* ---- discussion ---- */
import {
  aiDiscussionRound,
  aiDiscussionNextRound,
  respondToMention,
  findMentions,
  runPostGameChatRound,
  startDiscussion
} from './discussion.js';

/* ---- ui-helpers (DOM refs + render functions) ---- */
import {
  initDomRefs,
  modelSelect, autoNightToggle, trajectoryToggle, dayDiscussionMinutesInput,
  humanNameInput, humanSeatInput, playerCountInput, modelHealthRefreshBtn,
  voiceBtn, setupBtn, assignBtn, startBtn, randomModelBtn,
  pauseBtn, nightResolveBtn, aiTalkBtn, forceNominationBtn, voteBtn,
  endBtn, resetBtn, exportBtn, exportTrajBtn, storySummaryBtn, modalCloseBtn,
  nominateBtn, skipNominationBtn, voteYesBtn, voteNoBtn, nomineeSelect,
  sendBtn, humanInput, mentionBtn, mentionSelect, slayerTemplateBtn,
  chatFilterSelect, chatSearchInput, chatAutoScrollBtn, chatJumpLatestBtn, chatBox,
  passBtn, privateSendBtn, privateTargetSelect, privateInput,
  enterGameBtn, skipIntroBtn, introVideo,
  peekTownBtn, peekLogBtn, peekTownCloseBtn, peekLogCloseBtn,
  discussionOverlayBackdrop, phaseStatus,
  humanRoleBox, humanPrivateBox, humanActionBox, playerList, logList,
  privateChatBox, publicLogList, publicLogDrawerList, chatResultHint, townLayoutEl,
  dawnOverlay, dawnText,
  renderAll, renderSeatCircle, renderConfigSummary, renderTaskCardStatus,
  renderStatus, renderPlayers, renderHumanInfo, renderHumanAction,
  renderLog, renderPublicLog, setupSeatCircleObserver, resetSeatCircleView,
  insertMention, insertTextAtCursor, buildSlayerDeclarationTemplate,
  setUiDeps
} from './ui-helpers.js';

/* ---- chat ---- */
import {
  addChat, addLogEntry, addReplayEvent, addPrivateChat,
  renderChat, renderPrivateChat, setupChatLayoutObserver,
  lockChatToBottom, markChatReadToLatest, syncUnreadChatCount,
  updateChatToolbarStatus, isChatNearBottom, isPublicChatTabActive,
  scheduleChatRelock, setDiscussionDrawer, closeDiscussionDrawers,
  isPrivateChatOpen, updatePrivateChatControls,
  setChatDeps, getTimelineIcon, applyDiscussionDrawers, canUseVoiceInput
} from './chat.js';

/* ---- game-logic ---- */
import {
  setupPlayers, assignRoles, startGame, endGame, togglePause,
  clearDayDiscussionTimer, clearAutoNightTimer, scheduleAutoNight,
  startDayDiscussionTimer,
  checkWin, switchPhase,
  needsHumanNightAction, isHumanActionReady,
  setResolveNight, setStartDiscussion, setGetModelStartupReadiness, setGetDiscussionDurationSeconds,
  updatePauseButton
} from './game-logic.js';

/* ---- night-actions ---- */
import { resolveNight, maybeHandleSlayerClaim, useSlayerShot } from './night-actions.js';

/* ---- nomination ---- */
import {
  enterNomination, startNominationResolution, maybeStartNextNomination,
  recordVote, maybeFinalizeVotes, clearNominationTimers, clearVoteTimer,
  runVote, finalizeDayExecution
} from './nomination.js';

/* ---- overlays ---- */
import { showModal, hideModal, startIntroPlayback, finishIntroPlayback, initNotePicker, initScriptBoard } from './overlays.js';

/* ---- voice ---- */
import { initSpeechRecognition, toggleVoiceInput } from './voice.js';

/* ---- prompts ---- */
import { applyDiscussionMinutes, waitHumanChatGrace, getDiscussionDurationSeconds, getPhaseLabel, setPromptDeps } from './prompts.js';

/* ---- private-chat ---- */
import { respondToPrivate } from './private-chat.js';

/* ---- bgm ---- */
import './bgm.js';

/* ---- tts ---- */
import './tts.js';

/* ---- utils ---- */
import { sleep } from './utils.js';

/* ---- edition registry ---- */
import { registerEdition, setCurrentEdition, getCurrentEdition, listEditions } from './scripts/edition-registry.js';
import { TROUBLE_BREWING } from './scripts/trouble-brewing.js';
import { BAD_MOON_RISING } from './scripts/bad-moon-rising.js';
import { SECTS_AND_VIOLETS } from './scripts/sects-and-violets.js';

registerEdition("trouble_brewing", TROUBLE_BREWING);
registerEdition("bad_moon_rising", BAD_MOON_RISING);
registerEdition("sects_and_violets", SECTS_AND_VIOLETS);
setCurrentEdition("trouble_brewing");

/* ---- edition night resolvers ---- */
import './scripts/bmr-night.js';
import './scripts/sv-night.js';

/* ================================================================
 * Initialize DOM references
 * ================================================================ */
initDomRefs();

/* Wire up normalizeState dependency */
setNormalizeDeps({ syncUnreadChatCount });

/* Wire up ui-helpers dependency injections */
setUiDeps({
  renderChat, renderPrivateChat, renderReplay, updatePrivateChatControls, updateHeaderPhase,
  needsHumanNightAction, isHumanActionReady, scheduleAutoNight,
  getTimelineIcon, useSlayerShot,
  applyDiscussionDrawers, scheduleChatRelock, canUseVoiceInput, updatePauseButton
});

/* Wire up game-logic dependency injections */
setResolveNight(resolveNight);
setStartDiscussion(startDiscussion);
setGetModelStartupReadiness(getModelStartupReadiness);
setGetDiscussionDurationSeconds(getDiscussionDurationSeconds);

/* Wire up prompts dependency injections */
setPromptDeps({ startDayDiscussionTimer, renderStatus });

/* Wire up chat dependency injections */
setChatDeps({ getPhaseLabel, renderLog, renderPublicLog, maybeHandleSlayerClaim });

/* Expose globals needed by overlay subsystems */
window.renderSeatCircle = renderSeatCircle;
window.ROLE_STRATEGY_TIPS = ROLE_STRATEGY_TIPS;
window.canUseVoiceInput = canUseVoiceInput;

/* Initialize overlay subsystems */
initNotePicker();
initScriptBoard();

/* ================================================================
 * Model select change
 * ================================================================ */
modelSelect.addEventListener("change", () => {
  localStorage.setItem(MODEL_STORAGE, modelSelect.value);
});

/* ================================================================
 * Model catalog file input
 * ================================================================ */
const loadModelCatalogBtn = document.getElementById("loadModelCatalogBtn");
const modelCatalogFileInput = document.getElementById("modelCatalogFileInput");
if (loadModelCatalogBtn && modelCatalogFileInput) {
  loadModelCatalogBtn.addEventListener("click", () => modelCatalogFileInput.click());
  modelCatalogFileInput.addEventListener("change", () => {
    const file = modelCatalogFileInput.files && modelCatalogFileInput.files[0];
    if (!file) return;
    const fr = new FileReader();
    fr.onload = () => {
      const text = fr.result;
      if (loadModelCatalogFromText(text)) {
        if (typeof alert === "function") alert("已加载模型配置：" + file.name);
      }
      modelCatalogFileInput.value = "";
    };
    fr.readAsText(file, "UTF-8");
  });
}

/* ================================================================
 * Model health refresh
 * ================================================================ */
if (modelHealthRefreshBtn) {
  modelHealthRefreshBtn.addEventListener("click", async () => {
    modelHealthRefreshBtn.disabled = true;
    try {
      await autoLoadModelCatalog();
    } finally {
      modelHealthRefreshBtn.disabled = false;
    }
  });
}

/* ================================================================
 * Auto-night toggle
 * ================================================================ */
autoNightToggle.addEventListener("change", () => {
  localStorage.setItem(AUTO_NIGHT_STORAGE, autoNightToggle.checked ? "1" : "0");
  scheduleAutoNight();
});

/* ================================================================
 * Trajectory toggle
 * ================================================================ */
if (trajectoryToggle) {
  trajectoryToggle.addEventListener("change", () => {
    const enabled = trajectoryToggle.checked;
    localStorage.setItem(TRAJECTORY_STORAGE, enabled ? "1" : "0");
    if (state) {
      state.recordTrajectories = enabled;
      if (enabled && !Array.isArray(state.trajectoryLog)) {
        state.trajectoryLog = [];
      }
    }
  });
}

/* ================================================================
 * Voice input button
 * ================================================================ */
if (voiceBtn) {
  voiceBtn.addEventListener("click", toggleVoiceInput);
}

/* ================================================================
 * Player count input
 * ================================================================ */
if (playerCountInput) {
  playerCountInput.addEventListener("input", () => {
    if (!state || !state.started) {
      renderConfigSummary();
    }
  });
}

/* ================================================================
 * Day discussion minutes input
 * ================================================================ */
if (dayDiscussionMinutesInput) {
  dayDiscussionMinutesInput.addEventListener("change", () => {
    const minutes = Number(dayDiscussionMinutesInput.value);
    if (!Number.isFinite(minutes)) return;
    applyDiscussionMinutes(minutes, true);
  });
}

/* ================================================================
 * Auto-sync human name when seat changes (if name is still default)
 * ================================================================ */
humanSeatInput.addEventListener("input", () => {
  const name = humanNameInput.value.trim();
  if (/^玩家\d*$/.test(name)) {
    humanNameInput.value = `玩家${humanSeatInput.value}`;
  }
});

/* ================================================================
 * Core game action buttons
 * ================================================================ */
setupBtn.addEventListener("click", setupPlayers);
assignBtn.addEventListener("click", () => {
  assignRoles();
  if (state && state.players && state.players.some((p) => p.roleId)) {
    closeSettingsDrawer();
  }
});
startBtn.addEventListener("click", startGame);
randomModelBtn.addEventListener("click", randomizeAiModels);
pauseBtn.addEventListener("click", togglePause);
nightResolveBtn.addEventListener("click", resolveNight);
aiTalkBtn.addEventListener("click", () => {
  if (state && state.ended && state.postGameChat) {
    runPostGameChatRound();
    return;
  }
  aiDiscussionRound();
});
voteBtn.addEventListener("click", runVote);

if (storySummaryBtn) {
  storySummaryBtn.addEventListener("click", () => generateStorySummary({ force: true }));
}

modalCloseBtn.addEventListener("click", hideModal);

/* ================================================================
 * Nomination
 * ================================================================ */
nominateBtn.addEventListener("click", async () => {
  if (!state || !state.started || state.ended) return;
  if (state.phase !== "day" || state.dayStage !== "nomination") return;
  if (state.nominationPhase !== "open") return;
  if (state.dayNominationCount >= MAX_NOMINATIONS_PER_DAY) {
    addChat("系统", `今日提名已达上限（${MAX_NOMINATIONS_PER_DAY}次）。`, "system");
    finalizeDayExecution();
    return;
  }
  const human = state.players.find((p) => p.isHuman);
  if (!human) return;
  if (state.nominationUsedIds.includes(human.id)) {
    addChat("系统", "你本回合已经提名过了。", "system");
    return;
  }
  const nomineeId = nomineeSelect.value;
  if (!nomineeId) return;
  if (state.nomineeUsedIds.includes(nomineeId)) {
    addChat("系统", "该玩家本回合已被提名。", "system");
    return;
  }
  state.nominationUsedIds.push(human.id);
  state.nomineeUsedIds.push(nomineeId);
  state.humanNominationDone = true;
  state.currentSpeakerId = "";
  await startNominationResolution(human.id, nomineeId, "");
});

skipNominationBtn.addEventListener("click", async () => {
  if (!state || !state.started || state.ended) return;
  if (state.phase !== "day" || state.dayStage !== "nomination") return;
  if (state.nominationPhase !== "open") return;
  const human = state.players.find((p) => p.isHuman);
  if (!human) return;
  state.nominationUsedIds.push(human.id);
  addChat("系统", `${human.name} 跳过提名。`, "system");
  addReplayEvent(`${human.name} 跳过提名`, "day_action");
  state.humanNominationDone = true;
  state.currentSpeakerId = "";
  maybeStartNextNomination();
});

/* ================================================================
 * Voting (yes / no)
 * ================================================================ */
voteYesBtn.addEventListener("click", async () => {
  if (!state || !state.started || state.ended) return;
  if (state.phase !== "day" || state.dayStage !== "nomination") return;
  if (state.nominationPhase !== "voting") return;
  const human = state.players.find((p) => p.isHuman);
  if (!human || state.currentVoterId !== human.id) return;
  if (!human.alive && human.deadVoteUsed) {
    addChat("系统", "遗言票已使用，不能再投赞成。", "system");
    return;
  }
  clearVoteTimer();
  recordVote(human, "yes", "");
  state.humanVoted = true;
  renderAll();
  maybeFinalizeVotes();
});

voteNoBtn.addEventListener("click", async () => {
  if (!state || !state.started || state.ended) return;
  if (state.phase !== "day" || state.dayStage !== "nomination") return;
  if (state.nominationPhase !== "voting") return;
  const human = state.players.find((p) => p.isHuman);
  if (!human || state.currentVoterId !== human.id) return;
  clearVoteTimer();
  recordVote(human, "no", "");
  state.humanVoted = true;
  renderAll();
  maybeFinalizeVotes();
});

/* ================================================================
 * Keyboard shortcut handler (Y/N for voting)
 * ================================================================ */
window.addEventListener("keydown", (event) => {
  if (!state || !state.started || state.ended || state.paused) return;
  if (event.isComposing) return;
  const target = event.target;
  const editable = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
  if (editable) return;
  if (state.phase !== "day" || state.dayStage !== "nomination" || state.nominationPhase !== "voting") return;
  const key = String(event.key || "").toLowerCase();
  if (key === "y") {
    if (!voteYesBtn.disabled) {
      event.preventDefault();
      voteYesBtn.click();
    }
  } else if (key === "n") {
    if (!voteNoBtn.disabled) {
      event.preventDefault();
      voteNoBtn.click();
    }
  }
});

/* ================================================================
 * Force nomination & end / reset
 * ================================================================ */
forceNominationBtn.addEventListener("click", () => {
  if (!state || !state.started || state.ended) return;
  if (state.phase !== "day" || state.dayStage !== "discussion") return;
  enterNomination();
});

endBtn.addEventListener("click", endGame);

resetBtn.addEventListener("click", () => {
  if (!confirm("确认重置？")) return;
  localStorage.removeItem(STORAGE_KEY);
  setState(null);
  clearNominationTimers();
  clearVoteTimer();
  clearDayDiscussionTimer();
  clearAutoNightTimer();
  document.body.classList.remove("phase-night", "phase-day", "phase-dusk");
  chatBox.innerHTML = "";
  playerList.innerHTML = "";
  logList.innerHTML = "";
  if (privateChatBox) privateChatBox.innerHTML = "";
  if (publicLogList) publicLogList.innerHTML = "";
  if (publicLogDrawerList) publicLogDrawerList.innerHTML = "";
  if (chatSearchInput) chatSearchInput.value = "";
  if (chatResultHint) chatResultHint.textContent = "";
  if (chatJumpLatestBtn) chatJumpLatestBtn.classList.remove("visible");
  if (chatAutoScrollBtn) chatAutoScrollBtn.textContent = "跟随新消息：开";
  if (townLayoutEl) {
    townLayoutEl.classList.remove("discussion-focus", "show-town-left", "show-public-log", "overlay-open");
  }
  if (peekTownBtn) peekTownBtn.textContent = "广场";
  if (peekLogBtn) peekLogBtn.textContent = "记录";
  resetSeatCircleView();
  humanRoleBox.textContent = "尚未分配角色";
  humanPrivateBox.textContent = "暂无";
  humanActionBox.textContent = "无夜晚行动";
  phaseStatus.textContent = "未开局";
  renderConfigSummary();
  renderTokenUsageDisplay();
  renderTaskCardStatus();
  updateHeaderPhase();
  if (typeof window.syncAutoBgmForState === "function") {
    window.syncAutoBgmForState({ force: true });
  }
  if (typeof window.ttsClearQueue === "function") {
    window.ttsClearQueue();
  }
});

/* ================================================================
 * Export buttons
 * ================================================================ */
exportBtn.addEventListener("click", exportJson);
if (exportTrajBtn) {
  exportTrajBtn.addEventListener("click", exportTrajectories);
}

/* ================================================================
 * Start overlay / intro video handlers
 * ================================================================ */
if (enterGameBtn) {
  enterGameBtn.addEventListener("click", startIntroPlayback);
}
if (skipIntroBtn) {
  skipIntroBtn.addEventListener("click", finishIntroPlayback);
}
if (introVideo) {
  introVideo.addEventListener("ended", finishIntroPlayback);
  introVideo.addEventListener("error", finishIntroPlayback);
}

/* ================================================================
 * Chat send button & human input (Enter key)
 * ================================================================ */
sendBtn.addEventListener("click", async () => {
  if (!state || !state.started) return;
  if (state.dayStage === "nomination" && !state.postGameChat) return;
  const text = humanInput.value.trim();
  if (!text) return;
  const human = state.players.find((p) => p.isHuman);
  addChat(human.name, text, "player");
  state.lastHumanChatAt = Date.now();
  human.memory.push(text);
  humanInput.value = "";
  addLogEntry(`玩家发言：${text}`, "chat", { player: human.name });
  const mentions = findMentions(text).filter((p) => (state.postGameChat ? true : p.alive));
  if (mentions.length) {
    await waitHumanChatGrace();
    for (let i = 0; i < mentions.length; i += 1) {
      if (!state || state.paused || state.ended) break;
      await respondToMention(mentions[i], text);
      if (i < mentions.length - 1) {
        await sleep(260); /* AI_REPLY_STAGGER_MS */
      }
    }
  }
  if (state.ended) {
    return;
  }
  if (state.phase === "day" && state.dayStage === "discussion") {
    if (!mentions.length) {
      await waitHumanChatGrace();
      await aiDiscussionNextRound();
    }
  }
});

if (humanInput) {
  humanInput.addEventListener("keydown", (event) => {
    if (event.isComposing) return;
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendBtn.click();
    }
  });
}

/* ================================================================
 * Mention button
 * ================================================================ */
mentionBtn.addEventListener("click", () => {
  if (!mentionSelect) return;
  const id = mentionSelect.value;
  if (!id) return;
  const player = state.players.find((p) => p.id === id);
  if (!player) return;
  insertMention(player.name);
  mentionSelect.value = "";
});

/* ================================================================
 * Slayer template button
 * ================================================================ */
if (slayerTemplateBtn) {
  slayerTemplateBtn.addEventListener("click", () => {
    if (!state || !state.started) return;
    insertTextAtCursor(`${buildSlayerDeclarationTemplate()} `);
  });
}

/* ================================================================
 * Chat filter select
 * ================================================================ */
if (chatFilterSelect) {
  chatFilterSelect.addEventListener("change", () => {
    if (!state) return;
    state.chatFilter = chatFilterSelect.value || "all";
    renderChat();
    saveState();
  });
}

/* ================================================================
 * Chat search input
 * ================================================================ */
let _chatSearchDebounceTimer = null;
if (chatSearchInput) {
  chatSearchInput.addEventListener("input", () => {
    if (!state) return;
    if (_chatSearchDebounceTimer) clearTimeout(_chatSearchDebounceTimer);
    _chatSearchDebounceTimer = setTimeout(() => {
      if (!state) return;
      state.chatSearch = chatSearchInput.value || "";
      renderChat();
      saveState();
    }, 120);
  });
}

/* ================================================================
 * Chat auto-scroll button
 * ================================================================ */
if (chatAutoScrollBtn) {
  chatAutoScrollBtn.addEventListener("click", () => {
    if (!state) return;
    state.chatAutoFollow = !(state.chatAutoFollow !== false);
    if (state.chatAutoFollow !== false) {
      lockChatToBottom(320);
      markChatReadToLatest();
      renderChat({ forceScroll: true });
    } else {
      syncUnreadChatCount();
      updateChatToolbarStatus();
    }
    saveState();
  });
}

/* ================================================================
 * Chat jump-to-latest button
 * ================================================================ */
if (chatJumpLatestBtn) {
  chatJumpLatestBtn.addEventListener("click", () => {
    if (!state) return;
    state.chatAutoFollow = true;
    lockChatToBottom(360);
    markChatReadToLatest();
    renderChat({ forceScroll: true });
    saveState();
  });
}

/* ================================================================
 * ChatBox scroll handler
 * ================================================================ */
if (chatBox) {
  chatBox.addEventListener("scroll", () => {
    if (!state || !isPublicChatTabActive()) return;
    if (isChatNearBottom()) {
      markChatReadToLatest();
    } else {
      syncUnreadChatCount();
    }
    updateChatToolbarStatus();
  });
}

/* ================================================================
 * Window resize — relock chat + re-render seat circle
 * ================================================================ */
window.addEventListener("resize", () => {
  if (!state || state.chatAutoFollow === false || !isPublicChatTabActive()) return;
  scheduleChatRelock(300);
});

/* ================================================================
 * Discussion drawer peek buttons
 * ================================================================ */
if (peekTownBtn) {
  peekTownBtn.addEventListener("click", () => {
    setDiscussionDrawer("town");
  });
}

if (peekLogBtn) {
  peekLogBtn.addEventListener("click", () => {
    setDiscussionDrawer("log");
  });
}

if (peekTownCloseBtn) {
  peekTownCloseBtn.addEventListener("click", () => {
    setDiscussionDrawer("town", false);
  });
}

if (peekLogCloseBtn) {
  peekLogCloseBtn.addEventListener("click", () => {
    setDiscussionDrawer("log", false);
  });
}

if (discussionOverlayBackdrop) {
  discussionOverlayBackdrop.addEventListener("click", () => {
    closeDiscussionDrawers();
  });
}

/* ================================================================
 * Pass (skip discussion) button
 * ================================================================ */
passBtn.addEventListener("click", async () => {
  if (!state || !state.started || state.phase !== "day" || state.dayStage !== "discussion") return;
  const human = state.players.find((p) => p.isHuman);
  addLogEntry("玩家跳过讨论", "chat", { player: human.name });
  enterNomination();
});

/* ================================================================
 * Private chat send
 * ================================================================ */
privateSendBtn.addEventListener("click", async () => {
  if (!state || !state.started || state.ended) return;
  if (!isPrivateChatOpen()) return;
  const targetId = privateTargetSelect.value;
  if (!targetId) return;
  const target = state.players.find((p) => p.id === targetId);
  if (!target) return;
  const text = privateInput.value.trim();
  if (!text) return;
  const human = state.players.find((p) => p.isHuman);
  addPrivateChat(human.name, target.name, text);
  privateInput.value = "";
  await respondToPrivate(target, text);
});

/* ================================================================
 * Player Model List Toggle
 * ================================================================ */
const toggleModelListBtn = document.getElementById("toggleModelListBtn");
const playerModelListEl = document.getElementById("playerModelList");
let modelListVisible = false;

function renderPlayerModelList() {
  if (!playerModelListEl || !state || !state.players.length) return;
  playerModelListEl.innerHTML = "";
  state.players.forEach((player) => {
    const row = document.createElement("div");
    row.className = "player-model-row";
    const nameSpan = document.createElement("span");
    nameSpan.className = player.isHuman ? "pm-name pm-human" : "pm-name";
    nameSpan.textContent = player.name + (player.isHuman ? " (你)" : "");
    row.appendChild(nameSpan);

    if (player.isHuman) {
      const hint = document.createElement("span");
      hint.style.cssText = "color:var(--muted);font-size:12px;";
      hint.textContent = "人类玩家";
      row.appendChild(hint);
    } else {
      const sel = document.createElement("select");
      const defaultOpt = document.createElement("option");
      defaultOpt.value = "default";
      defaultOpt.textContent = "默认模型";
      sel.appendChild(defaultOpt);
      MODEL_OPTIONS.forEach((opt) => {
        const o = document.createElement("option");
        o.value = opt.value;
        o.textContent = opt.label;
        sel.appendChild(o);
      });
      sel.value = player.modelChoice || "default";
      sel.addEventListener("change", () => {
        player.modelChoice = sel.value;
        saveState();
      });
      row.appendChild(sel);
    }
    playerModelListEl.appendChild(row);
  });
}

if (toggleModelListBtn) {
  toggleModelListBtn.addEventListener("click", () => {
    modelListVisible = !modelListVisible;
    if (playerModelListEl) {
      playerModelListEl.style.display = modelListVisible ? "grid" : "none";
    }
    if (modelListVisible) {
      renderPlayerModelList();
    }
    toggleModelListBtn.textContent = modelListVisible ? "\u2715 收起模型配置" : "\u2699 配置玩家模型";
  });
}

/* ================================================================
 * Chat Tabs
 * ================================================================ */
document.querySelectorAll(".chat-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".chat-tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".chat-tab-content").forEach((c) => c.classList.remove("active"));
    tab.classList.add("active");
    const target = document.getElementById(tab.dataset.target);
    if (target) target.classList.add("active");
    if (tab.dataset.target === "chatTabContentPublic") {
      if (state) {
        if (state.chatAutoFollow !== false) {
          lockChatToBottom(280);
          markChatReadToLatest();
        } else {
          syncUnreadChatCount();
        }
        renderChat({ forceScroll: state.chatAutoFollow !== false });
      }
    } else if (state) {
      updateChatToolbarStatus();
    }
  });
});

/* ================================================================
 * Settings Drawer
 * ================================================================ */
const settingsGearBtn = document.getElementById("settingsGearBtn");
const drawerCloseBtn = document.getElementById("drawerCloseBtn");
const drawerOverlay = document.getElementById("drawerOverlay");

settingsGearBtn.addEventListener("click", openSettingsDrawer);
drawerCloseBtn.addEventListener("click", closeSettingsDrawer);
drawerOverlay.addEventListener("click", closeSettingsDrawer);

/* ================================================================
 * Settings tabs
 * ================================================================ */
document.querySelectorAll(".settings-tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".settings-tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".settings-tab-content").forEach((c) => c.classList.remove("active"));
    tab.classList.add("active");
    const target = document.getElementById(tab.dataset.tab);
    if (target) target.classList.add("active");
  });
});

/* ================================================================
 * Initialization sequence
 * ================================================================ */
const saved = loadState();
if (saved) {
  setState(saved);
  normalizeState();
  renderAll();
}
initModelSelect();

/* ---- edition selector ---- */
const editionSelect = document.getElementById("editionSelect");
if (editionSelect) {
  const editions = listEditions();
  editionSelect.innerHTML = "";
  editions.forEach(({ id, name }) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = name;
    editionSelect.appendChild(opt);
  });
  if (state && state.editionId) {
    try { setCurrentEdition(state.editionId); editionSelect.value = state.editionId; } catch (_) {}
  }
  editionSelect.addEventListener("change", () => {
    if (state && state.started) {
      editionSelect.value = state.editionId || "trouble_brewing";
      return;
    }
    setCurrentEdition(editionSelect.value);
    if (state) state.editionId = editionSelect.value;
    initRoleSelect();
    const titleEl = document.querySelector("title");
    if (titleEl) titleEl.textContent = `血染钟楼 单人模式 - ${getCurrentEdition().name}`;
    const subtitleEl = document.querySelector(".config-header p");
    if (subtitleEl) subtitleEl.textContent = `脚本：${getCurrentEdition().name}（AI 说书人 + AI 玩家）`;
    const boardImg = document.getElementById("scriptBoardImg");
    if (boardImg && getCurrentEdition().boardImage) {
      boardImg.src = getCurrentEdition().boardImage;
      boardImg.alt = `${getCurrentEdition().name}板子`;
    }
    const boardBtn = document.getElementById("scriptBoardBtn");
    if (boardBtn) boardBtn.title = `查看${getCurrentEdition().name}板子`;
  });
}

initRoleSelect();
restoreSettings();
renderModelHealthCheck();
autoLoadModelCatalog();
initSpeechRecognition();
setupSeatCircleObserver();
setupChatLayoutObserver();
window.addEventListener("resize", () => renderSeatCircle());
renderConfigSummary();
renderTokenUsageDisplay();
if (state && state.started && state.phase === "night") {
  scheduleAutoNight();
}
updateHeaderPhase();
