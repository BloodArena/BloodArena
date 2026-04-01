/**
 * prompts.js — Prompt-building functions extracted from singleplayer_demo.html
 *
 * All functions are copied exactly from the original source and adapted to
 * ES-module imports.  They build, format, and manage the prompt context that
 * is sent to AI players during gameplay.
 */

import { state, saveState } from './state.js';
import {
  HUMAN_CHAT_GRACE_MS,
  USE_INCREMENTAL_CHAT_CONTEXT,
  USE_FULL_CHAT_HISTORY,
  CHAT_DELTA_MAX_LINES,
  CHAT_DELTA_RECENT_LINES,
  DAY_DISCUSSION_STORAGE,
  DEFAULT_DAY_DISCUSSION_MINUTES,
  ROLE_HINTS,
  ROLE_STRATEGY_TIPS,
  EVIL_GUIDELINES,
  GOOD_GUIDELINES,
  PLAYER_SYSTEM_PROMPT,
  SLAYER_DECLARATION_TEMPLATE
} from './constants.js';
import {
  sleep,
  getApparentRole,
  getPromptName,
  formatPromptChatLine,
  getPromptSpeakerName
} from './utils.js';

/* ===== DOM references (resolved lazily) ===== */

let _dayDiscussionMinutesInput = null;
function getDayDiscussionMinutesInput() {
  if (!_dayDiscussionMinutesInput) {
    _dayDiscussionMinutesInput = document.getElementById("dayDiscussionMinutes");
  }
  return _dayDiscussionMinutesInput;
}

/* ===== External callbacks (set via setPromptDeps) ===== */

let _startDayDiscussionTimer = () => {};
let _renderStatus = () => {};

export function setPromptDeps({ startDayDiscussionTimer, renderStatus }) {
  if (typeof startDayDiscussionTimer === "function") {
    _startDayDiscussionTimer = startDayDiscussionTimer;
  }
  if (typeof renderStatus === "function") {
    _renderStatus = renderStatus;
  }
}

/* ===== Extracted functions ===== */

export function getInfoRolePlayer(roleName) {
  return state.players.find(
    (p) => p.alive && (p.roleName === roleName || (p.drunk && p.apparentRoleName === roleName))
  );
}

export function getPhaseLabel() {
  if (!state) return "未开局";
  if (state.ended) return state.postGameChat ? "赛后聊天" : "已结束";
  if (!state.started) return "未开局";
  if (state.phase === "night") return `夜晚${state.nightCount}`;
  return `白天${state.dayCount}`;
}

export async function waitHumanChatGrace() {
  if (!state) return;
  const elapsed = Date.now() - (Number(state.lastHumanChatAt) || 0);
  const remain = HUMAN_CHAT_GRACE_MS - elapsed;
  if (remain > 0) {
    await sleep(remain);
  }
}

export function buildPublicSummary() {
  const alive = state.players.filter((p) => p.alive).map((p) => getPromptName(p)).join("、");
  const dead = state.players.filter((p) => !p.alive).map((p) => getPromptName(p)).join("、");
  const recentChat = formatChatForPrompt(12);
  const roster = buildPromptRoster();
  return `玩家座次：${roster}\n存活玩家：${alive}\n死亡玩家：${dead || "无"}\n最近聊天：\n${recentChat || "无"}`;
}

export function getAliveDeadSummary() {
  const alive = state.players.filter((p) => p.alive).map((p) => getPromptName(p)).join("、");
  const dead = state.players.filter((p) => !p.alive).map((p) => getPromptName(p)).join("、");
  return `存活玩家：${alive || "无"}\n死亡玩家：${dead || "无"}`;
}

export function getDiscussionDurationSeconds() {
  if (state && typeof state.discussionDurationSeconds === "number" && state.discussionDurationSeconds > 0) {
    return state.discussionDurationSeconds;
  }
  const dayDiscussionMinutesInput = getDayDiscussionMinutesInput();
  const inputVal = dayDiscussionMinutesInput ? Number(dayDiscussionMinutesInput.value) : NaN;
  if (Number.isFinite(inputVal) && inputVal > 0) {
    return Math.round(inputVal * 60);
  }
  const stored = Number(localStorage.getItem(DAY_DISCUSSION_STORAGE));
  if (Number.isFinite(stored) && stored > 0) {
    return Math.round(stored * 60);
  }
  return DEFAULT_DAY_DISCUSSION_MINUTES * 60;
}

export function applyDiscussionMinutes(minutes, applyCurrent = true) {
  const safeMinutes = Math.max(1, Math.min(30, Math.round(minutes)));
  const seconds = safeMinutes * 60;
  localStorage.setItem(DAY_DISCUSSION_STORAGE, String(safeMinutes));
  const dayDiscussionMinutesInput = getDayDiscussionMinutesInput();
  if (dayDiscussionMinutesInput) {
    dayDiscussionMinutesInput.value = safeMinutes;
  }
  if (state) {
    const prevDuration = state.discussionDurationSeconds || seconds;
    state.discussionDurationSeconds = seconds;
    if (state.started && state.phase === "day" && state.dayStage === "discussion" && applyCurrent) {
      const ratio = prevDuration > 0 ? state.discussionMaxRemaining / prevDuration : 1;
      state.discussionMaxRemaining = Math.max(1, Math.round(seconds * Math.min(1, ratio)));
      _startDayDiscussionTimer(false);
    } else if (!state.started) {
      state.discussionMaxRemaining = seconds;
    }
  }
  _renderStatus();
  saveState();
}

export function getActualDistribution() {
  if (!state || !Array.isArray(state.players) || !state.players.length) return null;
  if (!state.players.every((p) => p.team)) return null;
  const counts = { townsfolk: 0, outsider: 0, minion: 0, demon: 0 };
  state.players.forEach((p) => {
    if (counts[p.team] !== undefined) counts[p.team] += 1;
  });
  return counts;
}

export function summarizeChatEntriesForPrompt(entries) {
  if (!entries.length) return "无";
  const speakerCounts = new Map();
  entries.forEach((entry) => {
    const speaker = getPromptSpeakerName(entry?.speaker || "系统");
    speakerCounts.set(speaker, (speakerCounts.get(speaker) || 0) + 1);
  });
  const topSpeakers = Array.from(speakerCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => `${name}(${count})`)
    .join("、");
  return `较早新增公共发言 ${entries.length} 条，主要发言者：${topSpeakers || "无"}`;
}

export function getSessionCursorKey(sessionKey) {
  const raw = String(sessionKey || "default").trim();
  return raw || "default";
}

export function formatPrivateInfoForPrompt(actor, sessionKey = "default", limit = 4) {
  if (!actor || !Array.isArray(actor.privateInfo) || !actor.privateInfo.length) return "无";
  const safeLimit = Math.max(1, Math.round(limit));
  if (!USE_INCREMENTAL_CHAT_CONTEXT) {
    return actor.privateInfo.join(" / ") || "无";
  }
  if (!actor.privateInfoCursorBySession || typeof actor.privateInfoCursorBySession !== "object") {
    actor.privateInfoCursorBySession = {};
  }
  const key = getSessionCursorKey(sessionKey);
  const cursorRaw = actor.privateInfoCursorBySession[key];
  const cursor = Number.isFinite(cursorRaw) ? cursorRaw : 0;
  const unseen = actor.privateInfo.slice(Math.max(0, cursor));
  if (!unseen.length) {
    return "无新增私密信息（沿用会话中已知私密信息）";
  }
  return unseen.slice(-safeLimit).join(" / ");
}

export function markActorPromptCursors(actor, sessionKey = "default") {
  if (!actor || !state || !USE_INCREMENTAL_CHAT_CONTEXT) return;
  const key = getSessionCursorKey(sessionKey);
  if (!actor.publicChatCursorBySession || typeof actor.publicChatCursorBySession !== "object") {
    actor.publicChatCursorBySession = {};
  }
  actor.publicChatCursorBySession[key] = Number(state.chatSeq) || 0;
  if (!actor.privateInfoCursorBySession || typeof actor.privateInfoCursorBySession !== "object") {
    actor.privateInfoCursorBySession = {};
  }
  const infoCount = Array.isArray(actor.privateInfo) ? actor.privateInfo.length : 0;
  actor.privateInfoCursorBySession[key] = infoCount;
}

export function buildPlayerStaticSystemContext(actor, options = {}) {
  if (!actor || !state) return "";
  const apparentRole = getApparentRole(actor);
  const roleName = apparentRole ? apparentRole.name : "未知";
  const roleAbility = apparentRole ? apparentRole.ability : "无";
  const roleHint = apparentRole ? (ROLE_HINTS[apparentRole.name] || "无") : "无";
  const guidelines = getTeamGuidelines(actor);
  const strategyTips = getStrategyTips(actor);
  const roster = buildPromptRoster();
  const includeStrategy = options.includeStrategy === true;
  const includeGuidelines = options.includeGuidelines !== false;
  const prefix = options.prefix || "玩家静态档案（会话内长期有效）";
  const teamLabel = { townsfolk: "镇民", outsider: "外来者", minion: "爪牙", demon: "恶魔" };
  const campLabel = (actor.team === "minion" || actor.team === "demon") ? "邪恶阵营" : "善良阵营";
  const lines = [
    prefix,
    `你是：${actor.name}`,
    `玩家座次：${roster}`,
    `你的身份（仅供内部）：${roleName}`,
    `你的角色类型：${teamLabel[actor.team] || "未知"}`,
    `你的阵营：${campLabel}`,
    `你的角色能力：${roleAbility}`,
    `规则提示：${roleHint}`
  ];
  if (includeStrategy) {
    lines.push(`策略建议：${strategyTips}`);
  }
  if (includeGuidelines) {
    lines.push(`阵营准则：${guidelines}`);
  }
  return lines.join("\n");
}

export function buildPlayerPromptMessages(actor, sessionKey, userContent, options = {}) {
  const systemPrompt = options.systemPrompt || PLAYER_SYSTEM_PROMPT;
  const staticContext = buildPlayerStaticSystemContext(actor, options);
  const messages = [{ role: "system", content: systemPrompt }];
  if (staticContext) {
    messages.push({ role: "system", content: staticContext });
  }
  messages.push({ role: "user", content: userContent });
  return messages;
}

export function formatChatForPrompt(limit = 12, actor = null, sessionKey = "default") {
  const effectiveLimit = USE_FULL_CHAT_HISTORY ? null : limit;
  const fullSlice = effectiveLimit ? state.chat.slice(-effectiveLimit) : state.chat.slice();
  if (!USE_INCREMENTAL_CHAT_CONTEXT || !actor) {
    if (!fullSlice.length) return "无";
    return fullSlice.map((entry) => formatPromptChatLine(entry)).join("\n");
  }
  if (!actor.publicChatCursorBySession || typeof actor.publicChatCursorBySession !== "object") {
    actor.publicChatCursorBySession = {};
  }
  const key = getSessionCursorKey(sessionKey);
  const cursorRaw = actor.publicChatCursorBySession[key];
  const cursor = Number.isFinite(cursorRaw) ? cursorRaw : 0;
  const unseen = state.chat.filter((entry) => (Number(entry.seq) || 0) > cursor);
  if (!unseen.length) {
    return "无新增公共发言（你已看过当前全部公开发言）";
  }
  if (CHAT_DELTA_MAX_LINES <= 0 || unseen.length <= CHAT_DELTA_MAX_LINES) {
    return unseen.map((entry) => formatPromptChatLine(entry)).join("\n");
  }
  const recentCount = Math.max(1, CHAT_DELTA_RECENT_LINES);
  const older = unseen.slice(0, Math.max(0, unseen.length - recentCount));
  const recent = unseen.slice(-recentCount);
  const olderSummary = summarizeChatEntriesForPrompt(older);
  return `${olderSummary}\n最近新增：\n${recent.map((entry) => formatPromptChatLine(entry)).join("\n")}`;
}

export function buildPromptRoster() {
  if (!state) return "";
  return state.players.map((p, idx) => `${idx + 1}号=${getPromptName(p)}`).join("，");
}

export function getTeamGuidelines(player) {
  if (!player) return "";
  if (player.team === "minion" || player.team === "demon") {
    return EVIL_GUIDELINES;
  }
  return GOOD_GUIDELINES;
}

export function getStrategyTips(player) {
  const roleName = player?.roleName || "";
  const strongInfo = ["共情者", "占卜师", "送葬者"];
  const firstNightInfo = ["洗衣妇", "图书管理员", "调查员", "厨师"];
  const tips = [];
  if (player?.team === "minion" || player?.team === "demon") {
    tips.push("优先伪装成可信的善良角色，避免与他人强势撞身份。");
    tips.push("可以谨慎使用不在场身份的思路来跳身份。");
    tips.push("必要时可以引导自己被处决来坐高身份，但要看局势。");
  } else {
    tips.push("好人不必全盘托出，注意避免被恶魔夜刀。");
    if (strongInfo.includes(roleName)) {
      tips.push("你是强信息角色，别在第一天过早自曝。");
    } else if (firstNightInfo.includes(roleName)) {
      tips.push("你是首夜信息角色，可以较早报身份与信息，但可保留不确定性。");
    }
    if (player?.team === "outsider") {
      tips.push("外来者是否自曝取决于局势与信息价值，权衡能否帮到团队再决定。");
    }
  }
  if (player && !player.alive) {
    tips.push("你已死亡：仍可发言，但不能提名；仅有一次遗言票。");
  }
  if (player?.privateInfo?.some((line) => line.includes("三个不在场身份"))) {
    tips.push("你知道不在场身份，只挑一个伪装，不要公开完整名单。");
  }
  if (roleName && ROLE_STRATEGY_TIPS[roleName]) {
    tips.push(ROLE_STRATEGY_TIPS[roleName]);
  }
  return tips.join(" ");
}
