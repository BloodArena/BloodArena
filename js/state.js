/**
 * state.js — Game state management (variables, persistence, normalization)
 * Extracted from singleplayer_demo.html
 */

import {
  STORAGE_KEY,
  MODEL_STORAGE,
  AUTO_NIGHT_STORAGE,
  TRAJECTORY_STORAGE,
  DAY_DISCUSSION_STORAGE,
  DEFAULT_DAY_DISCUSSION_MINUTES
} from './constants.js';

/* ===== Mutable state variables ===== */

export let state = null;
export let autoNightTimer = null;
export let inactivityTimer = null;
export let countdownTimer = null;
export let voteTimer = null;
export let dayDiscussionTimer = null;
export let dawnTypingTimer = null;
export let dawnHideTimer = null;
export let dawnSafetyTimer = null;
export let loadedModelCatalog = null;
export let customProviderMap = {};
export let catalogApiKeys = {};
export let modelCatalogLoadStatus = { ok: false, message: "尚未加载 model_catalog.yaml" };
export let modelCatalogHealth = [];
export let modelHealthWarned = false;
export let chatSearchDebounceTimer = null;
export let chatPinLockTimer = null;
export let chatLayoutObserver = null;
export let chatRelockRaf = null;
export let chatRelockTimer = null;
export let speechRecognition = null;
export let speechActive = false;
export let speechSupported = false;
export let speechInterim = "";

/* ===== Setters for mutable state (ES module bindings are read-only from importers) ===== */

export function setSpeechRecognition(v) { speechRecognition = v; }
export function setSpeechActive(v) { speechActive = v; }
export function setSpeechSupported(v) { speechSupported = v; }
export function setSpeechInterim(v) { speechInterim = v; }
export function setLoadedModelCatalog(v) { loadedModelCatalog = v; }
export function setCustomProviderMap(v) { customProviderMap = v; }
export function setCatalogApiKeys(v) { catalogApiKeys = v; }
export function setModelCatalogLoadStatus(v) { modelCatalogLoadStatus = v; }
export function setModelCatalogHealth(v) { modelCatalogHealth = v; }
export function setModelHealthWarned(v) { modelHealthWarned = v; }
export function setAutoNightTimer(v) { autoNightTimer = v; }
export function setDayDiscussionTimer(v) { dayDiscussionTimer = v; }
export function setState(v) { state = v; }
export function setChatPinLockTimer(v) { chatPinLockTimer = v; }
export function setChatLayoutObserver(v) { chatLayoutObserver = v; }
export function setChatRelockRaf(v) { chatRelockRaf = v; }
export function setChatRelockTimer(v) { chatRelockTimer = v; }
export function setChatSearchDebounceTimer(v) { chatSearchDebounceTimer = v; }
export function setDawnTypingTimer(v) { dawnTypingTimer = v; }
export function setDawnHideTimer(v) { dawnHideTimer = v; }
export function setDawnSafetyTimer(v) { dawnSafetyTimer = v; }

/* ===== Helper: empty player template ===== */

export function emptyPlayer(index) {
  return {
    id: `p${index + 1}`,
    name: `玩家${index + 1}`,
    roleId: "",
    roleName: "",
    apparentRoleId: "",
    apparentRoleName: "",
    team: "",
    alive: true,
    isHuman: false,
    drunk: false,
    poisoned: false,
    poisonedUntilDay: 0,
    protected: false,
    virginUsed: false,
    slayerUsed: false,
    slayerClaimed: false,
    demonCooldownNight: 0,
    butlerMasterId: "",
    deadVoteUsed: false,
    modelChoice: "default",
    lastPrivateDay: 0,
    publicChatCursorBySession: {},
    privateInfoCursorBySession: {},
    messageSessions: {},
    roleHistory: [],
    memory: [],
    privateInfo: []
  };
}

/* ===== Save state to localStorage ===== */

export function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

/* ===== Load state from localStorage ===== */

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed;
  } catch (error) {
    return null;
  }
}

/* ===== Normalize / migrate state after load ===== */

/**
 * normalizeState depends on syncUnreadChatCount which lives outside this
 * module.  Call setNormalizeDeps({ syncUnreadChatCount }) once at boot so
 * normalizeState can invoke it.
 */
let _syncUnreadChatCount = () => {};

export function setNormalizeDeps({ syncUnreadChatCount }) {
  if (typeof syncUnreadChatCount === "function") {
    _syncUnreadChatCount = syncUnreadChatCount;
  }
}

export function normalizeState() {
  if (!state) return;
  if (typeof state.paused !== "boolean") state.paused = false;
  if (typeof state.pausedAt !== "number") state.pausedAt = 0;
  if (typeof state.postGameChat !== "boolean") state.postGameChat = false;
  if (typeof state.postGameInProgress !== "boolean") state.postGameInProgress = false;
  if (typeof state.firstNightRecognitionDone !== "boolean") state.firstNightRecognitionDone = false;
  if (typeof state.lastHumanChatAt !== "number" || !Number.isFinite(state.lastHumanChatAt)) {
    state.lastHumanChatAt = 0;
  }
  if (typeof state.lastDiscussionAt !== "number") state.lastDiscussionAt = 0;
  if (typeof state.nominationCountdown !== "number") state.nominationCountdown = 0;
  if (
    typeof state.discussionMaxRemaining !== "number" ||
    !Number.isFinite(state.discussionMaxRemaining) ||
    state.discussionMaxRemaining <= 0
  ) {
    const duration = state.discussionDurationSeconds || DEFAULT_DAY_DISCUSSION_MINUTES * 60;
    state.discussionMaxRemaining = duration;
  }
  if (typeof state.discussionDurationSeconds !== "number") {
    state.discussionDurationSeconds = DEFAULT_DAY_DISCUSSION_MINUTES * 60;
  }
  if (typeof state.currentNomineeId !== "string") state.currentNomineeId = "";
  if (typeof state.currentNominatorId !== "string") state.currentNominatorId = "";
  if (typeof state.nominationPhase !== "string") state.nominationPhase = "";
  if (typeof state.nominationStep !== "string") state.nominationStep = "";
  if (!Array.isArray(state.nominationOrder)) state.nominationOrder = [];
  if (typeof state.nominationCursor !== "number") state.nominationCursor = 0;
  if (!Array.isArray(state.nominationVoteOrder)) state.nominationVoteOrder = [];
  if (typeof state.nominationVoteCursor !== "number") state.nominationVoteCursor = 0;
  if (typeof state.currentVoterId !== "string") state.currentVoterId = "";
  if (!state.nominationVotes || typeof state.nominationVotes !== "object") state.nominationVotes = {};
  if (!Array.isArray(state.nominationUsedIds)) state.nominationUsedIds = [];
  if (!Array.isArray(state.nomineeUsedIds)) state.nomineeUsedIds = [];
  if (typeof state.scarletTriggered !== "boolean") state.scarletTriggered = false;
  if (typeof state.discussionToken !== "number") state.discussionToken = 0;
  if (typeof state.voteCountdown !== "number") state.voteCountdown = 0;
  if (typeof state.pendingAiVotes !== "number") state.pendingAiVotes = 0;
  if (typeof state.humanVoted !== "boolean") state.humanVoted = false;
  if (typeof state.votingToken !== "number") state.votingToken = 0;
  if (typeof state.dayNominationCount !== "number") state.dayNominationCount = 0;
  if (typeof state.dayHighestVotes !== "number") state.dayHighestVotes = 0;
  if (typeof state.dayHighestNomineeId !== "string") state.dayHighestNomineeId = "";
  if (typeof state.dayHighestTied !== "boolean") state.dayHighestTied = false;
  if (!Array.isArray(state.pendingNominationQueue)) state.pendingNominationQueue = [];
  if (typeof state.pendingAiNominations !== "number") state.pendingAiNominations = 0;
  if (typeof state.humanNominationDone !== "boolean") state.humanNominationDone = false;
  if (typeof state.nominationInProgress !== "boolean") state.nominationInProgress = false;
  if (!Array.isArray(state.publicLog)) state.publicLog = [];
  if (!state.claims || typeof state.claims !== "object") state.claims = {};
  if (!Array.isArray(state.claimHistory)) state.claimHistory = [];
  if (typeof state.recordTrajectories !== "boolean") state.recordTrajectories = false;
  if (!Array.isArray(state.trajectoryLog)) state.trajectoryLog = [];
  if (!Array.isArray(state.privateChat)) state.privateChat = [];
  if (!Array.isArray(state.evilChat)) state.evilChat = [];
  if (state.winner === undefined) state.winner = null;
  if (state.winCondition === undefined) state.winCondition = null;
  if (!Array.isArray(state.replayEvents)) state.replayEvents = [];
  if (!Array.isArray(state.infoAudit)) state.infoAudit = [];
  if (!state.lastInfoRegistrationMap || typeof state.lastInfoRegistrationMap !== "object") {
    state.lastInfoRegistrationMap = {};
  }
  if (typeof state.humanActionConfirmed !== "boolean") state.humanActionConfirmed = false;
  if (typeof state.storySummary !== "string") state.storySummary = "";
  if (typeof state.storySummaryPending !== "boolean") state.storySummaryPending = false;
  if (typeof state.chatFilter !== "string") state.chatFilter = "all";
  if (typeof state.chatSearch !== "string") state.chatSearch = "";
  if (typeof state.chatAutoFollow !== "boolean") state.chatAutoFollow = true;
  if (typeof state.chatUnreadCount !== "number" || !Number.isFinite(state.chatUnreadCount) || state.chatUnreadCount < 0) {
    state.chatUnreadCount = 0;
  }
  if (typeof state.chatLastReadSeq !== "number" || !Number.isFinite(state.chatLastReadSeq) || state.chatLastReadSeq < 0) {
    state.chatLastReadSeq = 0;
  }
  if (typeof state.discussionTownDrawerOpen !== "boolean") state.discussionTownDrawerOpen = false;
  if (typeof state.discussionLogDrawerOpen !== "boolean") state.discussionLogDrawerOpen = false;
  if (typeof state.lastDawnNarration !== "string") state.lastDawnNarration = "";
  if (!Array.isArray(state.chat)) state.chat = [];
  let maxChatSeq = 0;
  state.chat = state.chat.map((entry, index) => {
    const current = entry && typeof entry === "object" ? entry : {};
    let seq = Number(current.seq);
    if (!Number.isFinite(seq) || seq <= 0) {
      seq = index + 1;
    }
    if (seq > maxChatSeq) maxChatSeq = seq;
    return {
      ...current,
      seq
    };
  });
  if (typeof state.chatSeq !== "number" || !Number.isFinite(state.chatSeq) || state.chatSeq < maxChatSeq) {
    state.chatSeq = maxChatSeq;
  }
  if (state.chatLastReadSeq === 0 && state.chatSeq > 0) {
    state.chatLastReadSeq = state.chatSeq;
  } else if (state.chatLastReadSeq > state.chatSeq) {
    state.chatLastReadSeq = state.chatSeq;
  }
  _syncUnreadChatCount();
  if (state.players) {
    state.players.forEach((player) => {
      if (typeof player.deadVoteUsed !== "boolean") player.deadVoteUsed = false;
      if (typeof player.modelChoice !== "string") player.modelChoice = "default";
      if (typeof player.lastPrivateDay !== "number") player.lastPrivateDay = 0;
      if (!player.publicChatCursorBySession || typeof player.publicChatCursorBySession !== "object") {
        player.publicChatCursorBySession = {};
      }
      if (!player.privateInfoCursorBySession || typeof player.privateInfoCursorBySession !== "object") {
        player.privateInfoCursorBySession = {};
      }
      if (typeof player.demonCooldownNight !== "number") player.demonCooldownNight = 0;
      if (!player.messageSessions || typeof player.messageSessions !== "object") player.messageSessions = {};
      if (typeof player.slayerClaimed !== "boolean") player.slayerClaimed = false;
      if (typeof player.noteRole !== "string") player.noteRole = "";
      if (!Array.isArray(player.noteTags)) player.noteTags = [];
      if (player.roleId && !player.apparentRoleId) {
        player.apparentRoleId = player.roleId;
        player.apparentRoleName = player.roleName || "";
      }
      if (!Array.isArray(player.roleHistory)) {
        player.roleHistory = player.roleName
          ? [{
            roleName: player.roleName,
            phase: "初始",
            night: 0,
            day: 0,
            reason: "初始分配"
          }]
          : [];
      }
    });
  }
}

/* ===== Timer variable setters (needed by other modules) ===== */

export function setInactivityTimer(val) {
  inactivityTimer = val;
}

export function setCountdownTimer(val) {
  countdownTimer = val;
}

export function setVoteTimer(val) {
  voteTimer = val;
}
