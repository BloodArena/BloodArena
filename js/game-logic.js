/**
 * game-logic.js — Core game flow functions extracted from singleplayer_demo.html
 * Extracted from singleplayer_demo.html
 *
 * Covers: player setup, role assignment, game start/end, win checking,
 * phase switching, timers, pause, and human-action readiness helpers.
 */

import { SCRIPT, PLAYER_DISTRIBUTION } from './constants.js';
import {
  state,
  setState,
  emptyPlayer,
  autoNightTimer,
  setAutoNightTimer,
  inactivityTimer,
  countdownTimer,
  voteTimer,
  dayDiscussionTimer,
  setDayDiscussionTimer
} from './state.js';
import { shuffle, getRoleById, getApparentRole } from './utils.js';
import { probeGameStartConnections } from './api.js';
import { renderAll, renderStatus, renderHumanAction } from './ui-helpers.js';
import { hideModal, showDawnNarration } from './overlays.js';
import { addChat, addLogEntry, addReplayEvent } from './chat.js';
import { setPrivateInfo, recordRoleChange, recordFirstNightRecognition } from './night-actions.js';
import { compressDaySessions } from './prompts.js';
import {
  enterNomination,
  scheduleNominationTimeout,
  clearNominationTimers,
  clearVoteTimer,
  startNominationVoting
} from './nomination.js';

/* ---- DOM references (bound at module level) ---- */

const playerCountInput = document.getElementById("playerCount");
const humanNameInput = document.getElementById("humanName");
const humanSeatInput = document.getElementById("humanSeat");
const humanRoleSelect = document.getElementById("humanRoleSelect");
const autoNightToggle = document.getElementById("autoNightToggle");
const pauseBtn = document.getElementById("pauseBtn");
const trajectoryToggle = document.getElementById("trajectoryToggle");
const modelSelect = document.getElementById("modelSelect");
const startBtn = document.getElementById("startBtn");

/* ---- Forward-declared module-level references ---- */

let resolveNight;       // set via setResolveNight()
let startDiscussion;    // set via setStartDiscussion()
let getModelStartupReadiness; // set via setGetModelStartupReadiness()
let getDiscussionDurationSeconds; // set via setGetDiscussionDurationSeconds()

export function setResolveNight(fn) { resolveNight = fn; }
export function setStartDiscussion(fn) { startDiscussion = fn; }
export function setGetModelStartupReadiness(fn) { getModelStartupReadiness = fn; }
export function setGetDiscussionDurationSeconds(fn) { getDiscussionDurationSeconds = fn; }

/* ================================================================
 *  setupPlayers
 * ================================================================ */

export function setupPlayers() {
  const count = Math.max(5, Math.min(15, Number(playerCountInput.value)));
  const humanSeat = Math.max(1, Math.min(count, Number(humanSeatInput.value)));
  const players = Array.from({ length: count }, (_, index) => emptyPlayer(index));
  players[humanSeat - 1].name = humanNameInput.value || "你";
  players[humanSeat - 1].isHuman = true;
  setState({
    players,
    started: false,
    ended: false,
    paused: false,
    pausedAt: 0,
    postGameChat: false,
    postGameInProgress: false,
    firstNightRecognitionDone: false,
    lastHumanChatAt: 0,
    storySummary: "",
    storySummaryPending: false,
    phase: "night",
    dayStage: "discussion",
    dayCount: 0,
    nightCount: 0,
    discussionRound: 0,
    maxDiscussionRounds: 3,
    discussionOrder: [],
    discussionCursor: 0,
    discussionPassed: [],
    currentSpeakerId: "",
    lastExecutedId: "",
    currentNomineeId: "",
    currentNominatorId: "",
    nominationPhase: "",
    nominationStep: "",
    nominationOrder: [],
    nominationCursor: 0,
    nominationVoteOrder: [],
    nominationVoteCursor: 0,
    currentVoterId: "",
    nominationVotes: {},
    nominationUsedIds: [],
    nomineeUsedIds: [],
    nominationInProgress: false,
    scarletTriggered: false,
    discussionToken: 0,
    discussionMaxRemaining: getDiscussionDurationSeconds(),
    discussionDurationSeconds: getDiscussionDurationSeconds(),
    voteCountdown: 0,
    pendingAiVotes: 0,
    humanVoted: false,
    votingToken: 0,
    dayNominationCount: 0,
    dayHighestVotes: 0,
    dayHighestNomineeId: "",
    dayHighestTied: false,
    pendingNominationQueue: [],
    pendingAiNominations: 0,
    humanNominationDone: false,
    publicLog: [],
    claims: {},
    claimHistory: [],
    recordTrajectories: false,
    trajectoryLog: [],
    privateChat: [],
    evilChat: [],
    winner: null,
    winCondition: null,
    replayEvents: [],
    infoAudit: [],
    lastInfoRegistrationMap: {},
    redHerringId: "",
    humanActionTarget: "",
    humanActionTarget2: "",
    humanActionConfirmed: false,
    lastDiscussionAt: 0,
    nominationCountdown: 0,
    chatSeq: 0,
    chat: [],
    chatFilter: "all",
    chatSearch: "",
    chatAutoFollow: true,
    chatUnreadCount: 0,
    chatLastReadSeq: 0,
    discussionTownDrawerOpen: false,
    discussionLogDrawerOpen: false,
    log: [],
    showRoles: false,
    lastDawnNarration: ""
  });
  if (trajectoryToggle) {
    state.recordTrajectories = trajectoryToggle.checked;
  }
  addChat("系统", "玩家已生成。请随机发牌。", "system");
  if (state) {
    renderAll();
  }
}

/* ================================================================
 *  adjustOutsiders
 * ================================================================ */

export function adjustOutsiders(roles, lockedIds = new Set()) {
  const pattern = /\[\s*([+-]\d+)\s*外来者\s*\]/g;
  let modifier = 0;
  roles.forEach((role) => {
    const matches = role.ability.matchAll(pattern);
    for (const match of matches) {
      modifier += Number(match[1]);
    }
  });
  if (modifier === 0) return roles;
  const list = roles.slice();
  const outsiders = SCRIPT.roles.filter((r) => r.team === "outsider" && !list.includes(r));
  const townsfolk = SCRIPT.roles.filter((r) => r.team === "townsfolk" && !list.includes(r));
  if (modifier > 0) {
    let add = modifier;
    while (add > 0 && outsiders.length) {
      const townIndex = list.findIndex((r) => r.team === "townsfolk" && !lockedIds.has(r.id));
      if (townIndex === -1) break;
      list.splice(townIndex, 1, outsiders.pop());
      add -= 1;
    }
  } else {
    let reduce = Math.abs(modifier);
    while (reduce > 0 && townsfolk.length) {
      const outIndex = list.findIndex((r) => r.team === "outsider" && !lockedIds.has(r.id));
      if (outIndex === -1) break;
      list.splice(outIndex, 1, townsfolk.pop());
      reduce -= 1;
    }
  }
  return list;
}

/* ================================================================
 *  assignRedHerring
 * ================================================================ */

export function assignRedHerring() {
  const hasFortuneTeller = state.players.some((p) => p.roleName === "占卜师");
  if (!hasFortuneTeller) return "";
  const goodPlayers = state.players.filter(
    (p) => p.team === "townsfolk" && p.alive
  );
  if (!goodPlayers.length) return "";
  const choice = goodPlayers[Math.floor(Math.random() * goodPlayers.length)];
  return choice.id;
}

/* ================================================================
 *  assignDrunkAppearance
 * ================================================================ */

export function assignDrunkAppearance() {
  const townsfolkRoles = SCRIPT.roles.filter((r) => r.team === "townsfolk");
  const inPlayRoleIds = new Set(state.players.map((p) => p.roleId));
  const notInPlayTownsfolk = townsfolkRoles.filter((r) => !inPlayRoleIds.has(r.id));
  state.players.forEach((player) => {
    const role = getRoleById(player.roleId);
    if (!role) return;
    if (role.name === "酒鬼") {
      player.drunk = true;
      const pool = notInPlayTownsfolk.length ? notInPlayTownsfolk : townsfolkRoles;
      const fake = pool[Math.floor(Math.random() * pool.length)];
      player.apparentRoleId = fake.id;
      player.apparentRoleName = fake.name;
    } else {
      player.apparentRoleId = role.id;
      player.apparentRoleName = role.name;
    }
  });
}

/* ================================================================
 *  assignRoles
 * ================================================================ */

export function assignRoles() {
  if (!state || !state.players || !state.players.length) {
    alert('请先点击"生成玩家"。');
    return;
  }
  const count = state.players.length;
  const dist = PLAYER_DISTRIBUTION[count];
  if (!dist) {
    alert("仅支持 5-15 人。");
    return;
  }
  const human = state.players.find((p) => p.isHuman);
  const selectedRoleId = humanRoleSelect.value || "random";
  let lockedRole = null;
  if (selectedRoleId !== "random") {
    lockedRole = getRoleById(selectedRoleId);
    if (!lockedRole) {
      alert("未找到该角色。");
      return;
    }
    if (dist[lockedRole.team] <= 0) {
      alert("当前人数配置不允许该阵营角色。");
      return;
    }
  }
  const counts = {
    townsfolk: dist.townsfolk,
    outsider: dist.outsider,
    minion: dist.minion,
    demon: dist.demon
  };
  if (lockedRole) {
    counts[lockedRole.team] -= 1;
    if (counts[lockedRole.team] < 0) {
      alert("该角色与当前人数配置不兼容。");
      return;
    }
  }
  const pool = {
    townsfolk: shuffle(SCRIPT.roles.filter((r) => r.team === "townsfolk" && r.id !== selectedRoleId)),
    outsider: shuffle(SCRIPT.roles.filter((r) => r.team === "outsider" && r.id !== selectedRoleId)),
    minion: shuffle(SCRIPT.roles.filter((r) => r.team === "minion" && r.id !== selectedRoleId)),
    demon: shuffle(SCRIPT.roles.filter((r) => r.team === "demon" && r.id !== selectedRoleId))
  };
  let picks = [];
  picks.push(...pool.townsfolk.slice(0, counts.townsfolk));
  picks.push(...pool.outsider.slice(0, counts.outsider));
  picks.push(...pool.minion.slice(0, counts.minion));
  picks.push(...pool.demon.slice(0, counts.demon));
  if (lockedRole) {
    picks.push(lockedRole);
  }
  const lockedIds = lockedRole ? new Set([lockedRole.id]) : new Set();
  picks = adjustOutsiders(picks, lockedIds);

  const shuffled = shuffle(picks);
  const assignRoleToSeat = (seatIndex, role) => {
    state.players[seatIndex].roleId = role.id;
    state.players[seatIndex].roleName = role.name;
    state.players[seatIndex].team = role.team;
    state.players[seatIndex].alive = true;
    state.players[seatIndex].privateInfo = [];
    state.players[seatIndex].memory = [];
    state.players[seatIndex].drunk = false;
    state.players[seatIndex].poisoned = false;
    state.players[seatIndex].poisonedUntilDay = 0;
    state.players[seatIndex].protected = false;
    state.players[seatIndex].virginUsed = false;
    state.players[seatIndex].slayerUsed = false;
    state.players[seatIndex].butlerMasterId = "";
    state.players[seatIndex].deadVoteUsed = false;
    state.players[seatIndex].roleHistory = [{
      roleName: role.name,
      phase: "初始",
      night: 0,
      day: 0,
      reason: "初始分配"
    }];
  };

  if (lockedRole && human) {
    const roleIndex = shuffled.findIndex((r) => r.id === lockedRole.id);
    if (roleIndex !== -1) {
      shuffled.splice(roleIndex, 1);
    }
    const seats = shuffle(state.players.map((_, i) => i).filter((i) => !state.players[i].isHuman));
    seats.forEach((seatIndex, roleIndex) => {
      const role = shuffled[roleIndex];
      if (role) assignRoleToSeat(seatIndex, role);
    });
    const humanIndex = state.players.findIndex((p) => p.isHuman);
    if (humanIndex !== -1) {
      assignRoleToSeat(humanIndex, lockedRole);
    }
  } else {
    const seats = shuffle(state.players.map((_, i) => i));
    seats.forEach((seatIndex, roleIndex) => {
      const role = shuffled[roleIndex];
      if (role) assignRoleToSeat(seatIndex, role);
    });
  }
  assignDrunkAppearance();
  state.redHerringId = assignRedHerring();
  addChat("系统", "随机发牌完成。", "system");
  renderAll();
}

/* ================================================================
 *  startGame
 * ================================================================ */

export async function startGame() {
  if (!state) return;
  if (!state.players.some((p) => p.roleId)) {
    alert("请先随机发牌。");
    return;
  }
  const modelReady = getModelStartupReadiness();
  if (!modelReady.ok) {
    alert(modelReady.message);
    return;
  }
  const originalStartLabel = startBtn ? startBtn.textContent : "";
  if (startBtn) {
    startBtn.disabled = true;
    startBtn.textContent = "检测模型...";
  }
  try {
    const probe = await probeGameStartConnections();
    if (!probe.ok) {
      alert(probe.message);
      return;
    }
  } finally {
    if (startBtn) {
      startBtn.disabled = false;
      startBtn.textContent = originalStartLabel || "开局";
    }
  }
  state.started = true;
  state.ended = false;
  state.paused = false;
  state.phase = "night";
  state.dayCount = 0;
  state.nightCount = 1;
  state.firstNightRecognitionDone = false;
  state.discussionRound = 0;
  state.dayStage = "discussion";
  state.discussionOrder = [];
  state.discussionCursor = 0;
  state.discussionPassed = [];
  state.currentSpeakerId = "";
  state.currentNomineeId = "";
  state.currentNominatorId = "";
  state.nominationPhase = "";
  state.nominationStep = "";
  state.nominationOrder = [];
  state.nominationCursor = 0;
  state.nominationVoteOrder = [];
  state.nominationVoteCursor = 0;
  state.currentVoterId = "";
  state.nominationVotes = {};
  state.nominationUsedIds = [];
  state.nomineeUsedIds = [];
  state.lastDiscussionAt = 0;
  state.nominationCountdown = 0;
  state.voteCountdown = 0;
  state.pendingAiVotes = 0;
  state.humanVoted = false;
  state.votingToken = (state.votingToken || 0) + 1;
  state.players.forEach((player) => {
    player.publicChatCursorBySession = {};
    player.privateInfoCursorBySession = {};
    player.messageSessions = {};
  });
  addChat("系统", "游戏开始。", "system");
  addLogEntry("开局", "system");
  if (!state.firstNightRecognitionDone) {
    recordFirstNightRecognition();
  }
  addChat("说书人", `夜幕降临（夜晚${state.nightCount}）。`, "storyteller");
  addChat("系统", "请等待说书人宣布天亮。", "system");
  renderAll();
  scheduleAutoNight();
}

/* ================================================================
 *  endGame
 * ================================================================ */

export function endGame() {
  if (!state) return;
  state.ended = true;
  state.paused = false;
  clearNominationTimers();
  clearVoteTimer();
  clearDayDiscussionTimer();
  addLogEntry("游戏结束", "system");
  enablePostGameChat();
}

/* ================================================================
 *  enablePostGameChat
 * ================================================================ */

export function enablePostGameChat() {
  if (!state || !state.ended) return;
  if (state.postGameChat) {
    renderAll();
    return;
  }
  state.postGameChat = true;
  state.postGameInProgress = false;
  addChat("系统", `游戏已结束，进入赛后聊天。你可以继续发言或点击"AI轮转"。`, "system");
  renderAll();
}

/* ================================================================
 *  checkWin
 * ================================================================ */

export function checkWin() {
  const alive = state.players.filter((p) => p.alive);
  let demonAlive = alive.some((p) => p.team === "demon");
  if (!demonAlive) {
    const scarlet = alive.find((p) => p.roleName === "红唇女郎");
    if (scarlet && alive.length >= 5) {
      const demonRole = SCRIPT.roles.find((r) => r.team === "demon");
      scarlet.team = "demon";
      scarlet.roleId = demonRole.id;
      scarlet.roleName = demonRole.name;
      scarlet.apparentRoleId = demonRole.id;
      scarlet.apparentRoleName = demonRole.name;
      setPrivateInfo(scarlet, "你已继任为恶魔。");
      recordRoleChange(scarlet, demonRole.name, "红唇女郎继任");
      if (!state.scarletTriggered) {
        const deadDemon = state.players.find((p) => p.team === "demon" && !p.alive);
        if (deadDemon) {
          addChat("说书人", `${deadDemon.name} 死亡，但游戏并未结束。`, "storyteller");
        } else {
          addChat("说书人", "恶魔死亡，但游戏并未结束。", "storyteller");
        }
        state.scarletTriggered = true;
      }
      demonAlive = true;
    }
  }
  if (!demonAlive) {
    addChat("系统", "善良阵营获胜（恶魔死亡）。", "system");
    state.ended = true;
    state.winner = "good";
    state.winCondition = "demon_killed";
  } else if (alive.length <= 2) {
    addChat("系统", "邪恶阵营获胜（存活仅剩两人）。", "system");
    state.ended = true;
    state.winner = "evil";
    state.winCondition = "two_alive";
  }
  if (state.ended) {
    enablePostGameChat();
    return;
  }
  renderAll();
}

/* ================================================================
 *  switchPhase
 * ================================================================ */

export function switchPhase() {
  if (!state.started || state.ended) return;
  clearAutoNightTimer();
  clearNominationTimers();
  clearVoteTimer();
  hideModal();
  if (state.phase === "night") {
    state.phase = "day";
    state.dayCount += 1;
    addLogEntry(`进入白天${state.dayCount}`, "phase");
    addChat("说书人", `天亮了（白天${state.dayCount}）。`, "storyteller");
    addReplayEvent(`进入白天${state.dayCount}`, "day_phase");
    if (state.lastDawnNarration) {
      showDawnNarration(state.lastDawnNarration);
      state.lastDawnNarration = "";
    } else {
      showDawnNarration("天亮了。");
    }
    startDiscussion(true);
  } else {
    state.phase = "night";
    state.nightCount += 1;
    state.humanActionTarget = "";
    state.humanActionTarget2 = "";
    state.humanActionConfirmed = false;
    state.dayStage = "discussion";
    addLogEntry(`进入夜晚${state.nightCount}`, "phase");
    addChat("说书人", `夜幕降临（夜晚${state.nightCount}）。`, "storyteller");
    addChat("系统", "请等待说书人宣布天亮。", "system");
  }
  renderAll();
  if (state.phase === "night") {
    compressDaySessions().then(() => {
      scheduleAutoNight();
    });
  }
}

/* ================================================================
 *  scheduleAutoNight
 * ================================================================ */

export function scheduleAutoNight() {
  clearAutoNightTimer();
  if (!state || !state.started || state.ended || state.paused) return;
  if (state.phase !== "night") return;
  if (!autoNightToggle.checked) return;
  if (needsHumanNightAction() && !isHumanActionReady()) return;
  setAutoNightTimer(setTimeout(() => {
    setAutoNightTimer(null);
    resolveNight();
  }, 600));
}

/* ================================================================
 *  clearAutoNightTimer
 * ================================================================ */

export function clearAutoNightTimer() {
  if (autoNightTimer) {
    clearTimeout(autoNightTimer);
    setAutoNightTimer(null);
  }
}

/* ================================================================
 *  clearDayDiscussionTimer
 * ================================================================ */

export function clearDayDiscussionTimer() {
  if (dayDiscussionTimer) {
    clearInterval(dayDiscussionTimer);
    setDayDiscussionTimer(null);
  }
}

/* ================================================================
 *  startDayDiscussionTimer
 * ================================================================ */

export function startDayDiscussionTimer(reset = false) {
  clearDayDiscussionTimer();
  if (!state || !state.started || state.ended || state.paused) return;
  if (state.phase !== "day" || state.dayStage !== "discussion") return;
  if (
    reset ||
    typeof state.discussionMaxRemaining !== "number" ||
    !Number.isFinite(state.discussionMaxRemaining) ||
    state.discussionMaxRemaining <= 0
  ) {
    const duration = getDiscussionDurationSeconds();
    state.discussionDurationSeconds = duration;
    state.discussionMaxRemaining = duration;
  }
  renderStatus();
  setDayDiscussionTimer(setInterval(() => {
    if (!state || state.ended || state.phase !== "day" || state.dayStage !== "discussion") {
      clearDayDiscussionTimer();
      return;
    }
    if (state.paused) {
      clearDayDiscussionTimer();
      return;
    }
    state.discussionMaxRemaining -= 1;
    if (state.discussionMaxRemaining <= 0) {
      clearDayDiscussionTimer();
      addChat("系统", "讨论时间结束，进入提名阶段。", "system");
      enterNomination();
      return;
    }
    renderStatus();
  }, 1000));
}

/* ================================================================
 *  needsHumanNightAction
 * ================================================================ */

export function needsHumanNightAction() {
  if (!state || !state.started) return false;
  const human = state.players.find((p) => p.isHuman && p.alive);
  if (!human) return false;
  const role = getApparentRole(human);
  if (!role) return false;
  if (role.name === "僧侣" && state.nightCount === 1) return false;
  if (role.name === "小恶魔" && state.nightCount === 1) return false;
  if (["僧侣", "投毒者", "小恶魔", "管家"].includes(role.name)) return true;
  if (role.name === "占卜师") return true;
  return false;
}

/* ================================================================
 *  isHumanActionReady
 * ================================================================ */

export function isHumanActionReady() {
  if (!state || !state.started) return true;
  const human = state.players.find((p) => p.isHuman && p.alive);
  if (!human) return true;
  const role = getApparentRole(human);
  if (!role) return true;
  if (role.name === "僧侣" && state.nightCount === 1) return true;
  if (role.name === "小恶魔" && state.nightCount === 1) return true;
  if (role.name === "小恶魔") {
    return Boolean(state.humanActionTarget && state.humanActionConfirmed);
  }
  if (["僧侣", "投毒者", "小恶魔", "管家"].includes(role.name)) {
    return Boolean(state.humanActionTarget && state.humanActionConfirmed);
  }
  if (role.name === "占卜师") {
    return Boolean(state.humanActionTarget && state.humanActionTarget2 && state.humanActionConfirmed);
  }
  return true;
}

/* ================================================================
 *  togglePause
 * ================================================================ */

export function togglePause() {
  if (!state || !state.started || state.ended) return;
  state.paused = !state.paused;
  if (state.paused) {
    state.pausedAt = Date.now();
    clearAutoNightTimer();
    clearNominationTimers();
    clearVoteTimer();
    clearDayDiscussionTimer();
    addChat("系统", "游戏已暂停。", "system");
  } else {
    if (state.phase === "day" && state.dayStage === "discussion") {
      state.lastDiscussionAt = Date.now();
    }
    state.pausedAt = 0;
    addChat("系统", "游戏继续。", "system");
    scheduleAutoNight();
    scheduleNominationTimeout();
    startDayDiscussionTimer(false);
  }
  updatePauseButton();
  if (state) {
    renderAll();
  }
}

/* ================================================================
 *  updatePauseButton
 * ================================================================ */

export function updatePauseButton() {
  if (!pauseBtn) return;
  pauseBtn.textContent = state && state.paused ? "继续" : "暂停";
  pauseBtn.disabled = !state || !state.started || state.ended;
}
