/**
 * discussion.js — Discussion-phase functions extracted from singleplayer_demo.html
 * Handles AI/human discussion rounds, mentions, speech, and discussion state management.
 */

import { state } from './state.js';
import { SLAYER_DECLARATION_TEMPLATE } from './constants.js';
import { isEvilSelfReveal } from './utils.js';
import {
  formatPrivateInfoForPrompt,
  formatChatForPrompt,
  buildPlayerPromptMessages,
  getDiscussionDurationSeconds,
  getAliveDeadSummary
} from './prompts.js';
import { callDeepSeek, commitSessionMessages } from './api.js';
import { addChat, addLogEntry, formatPlayerPrivateChats } from './chat.js';
import { renderAll, renderStatus, buildSlayerDeclarationTemplate } from './ui-helpers.js';
import { getDayRuleNote } from './night-actions.js';
import { scheduleNominationTimeout, enterNomination } from './nomination.js';
import { startDayDiscussionTimer } from './game-logic.js';
import { maybeAiPrivateChat } from './private-chat.js';
import { updateVoiceUi, captureSpeechForStatement } from './voice.js';

/* ===== DOM references (resolved lazily) ===== */

function getTempValue() {
  const tempInput = document.getElementById("tempInput");
  return tempInput ? Number(tempInput.value) || 0.7 : 0.7;
}

/* ===== Exported functions ===== */

export function bumpDiscussionActivity() {
  if (!state || !state.started || state.ended || state.paused) return;
  if (state.phase !== "day" || state.dayStage !== "discussion") return;
  state.lastDiscussionAt = Date.now();
  state.nominationCountdown = 0;
  scheduleNominationTimeout();
}

export async function aiDiscussionNextRound() {
  await advanceDiscussion();
}

export async function aiDiscussionRound() {
  await advanceDiscussion();
}

export async function runPostGameChatRound() {
  if (!state || !state.ended || !state.postGameChat) return;
  if (state.postGameInProgress) return;
  state.postGameInProgress = true;
  renderAll();
  const aiPlayers = state.players.filter((p) => !p.isHuman);
  for (const player of aiPlayers) {
    if (!state || !state.postGameChat || state.paused) break;
    const privateInfo = formatPrivateInfoForPrompt(player, "chat", 4);
    const privateChatHistory = formatPlayerPrivateChats(player);
    const recentChat = formatChatForPrompt(12, player, "chat");
    const aliveDeadSummary = getAliveDeadSummary();
    const userContent = `游戏已结束，进入赛后聊天。你可以简单回顾这一局或表达感受。\n公开聊天（最近增量）：\n${recentChat}\n
          你的私聊记录：\n${privateChatHistory}\n
${aliveDeadSummary}
你的当前状态：${player.alive ? "存活" : "死亡"}。
你的私密信息增量：${privateInfo}
这是公开聊天，所有玩家都能看到你的发言。请用一小段话发言。`;
    const buildPrompt = buildPlayerPromptMessages(player, "chat", userContent);
    try {
      const content = await callDeepSeek(buildPrompt, getTempValue(), player, "chat");
      const text = content.trim() || "我没什么想说的。";
      player.memory.push(text);
      addChat(player.name, text, "player");
    } catch (error) {
      addChat("系统", `${player.name} 发言失败。`, "system");
    }
  }
  state.postGameInProgress = false;
  renderAll();
}

export function findMentions(text) {
  const mentions = [];
  state.players.forEach((player) => {
    if (player.isHuman) return;
    if (text.includes(`@${player.name}`)) {
      mentions.push(player);
    }
  });
  return mentions;
}

export async function respondToMention(player, mentionText) {
  const privateInfo = formatPrivateInfoForPrompt(player, "chat", 4);
  const privateChatHistory = formatPlayerPrivateChats(player);
  const recentChat = formatChatForPrompt(12, player, "chat");
  const dayRuleNote = getDayRuleNote();
  const aliveDeadSummary = getAliveDeadSummary();
  const buildPrompt = (extraInstruction = "") => buildPlayerPromptMessages(
    player,
    "chat",
    `公开聊天（最近增量）：\n${recentChat}\n
          你的私聊记录：\n${privateChatHistory}\n
你被@提问了。提问内容：${mentionText}
${aliveDeadSummary}
你的当前状态：${player.alive ? "存活" : "死亡"}。
时间规则：${dayRuleNote || "无"}
${state.phase === "day" && state.dayStage === "discussion" && !state.ended
  ? `猎手声明规则：若要触发开枪，整句必须严格为"${SLAYER_DECLARATION_TEMPLATE}"。\n`
  : ""}你的私密信息增量：${privateInfo}
你自己最近说过：${player.memory.slice(-4).join(" / ") || "无"}。
${extraInstruction ? `额外约束：${extraInstruction}\n` : ""}这是公开聊天，所有玩家都能看到你的发言。请给出一小段回应。`
  );
  try {
    let usedPrompt = buildPrompt("");
    let content = await callDeepSeek(usedPrompt, Number(document.getElementById("tempInput")?.value) || 1.0, player, "chat", false);
    let text = content.trim() || "我没什么想说的。";
    if (isEvilSelfReveal(player, text)) {
      usedPrompt = buildPrompt("不要自曝为爪牙或恶魔，也不要承认自己是坏人。");
      content = await callDeepSeek(usedPrompt, Number(document.getElementById("tempInput")?.value) || 1.0, player, "chat", false);
      text = content.trim() || "我没什么想说的。";
    }
    if (isEvilSelfReveal(player, text)) text = "我没什么想说的。";
    commitSessionMessages(player, "chat", usedPrompt, text);
    player.memory.push(text);
    addChat(player.name, text, "player");
  } catch (error) {
    addChat("系统", `${player.name} 未能回应。`, "system");
  }
}

export async function aiSpeak(player) {
  if (state && state.paused) return;
  const token = state.discussionToken || 0;
  const privateInfo = formatPrivateInfoForPrompt(player, "chat", 4);
  const privateChatHistory = formatPlayerPrivateChats(player);
  const recentSelf = player.memory.slice(-5).join(" / ") || "无";
  const recentChat = formatChatForPrompt(12, player, "chat");
  const dayRuleNote = getDayRuleNote();
  const aliveDeadSummary = getAliveDeadSummary();
  const buildPrompt = (extraInstruction = "") => buildPlayerPromptMessages(
    player,
    "chat",
    `公开聊天（最近增量）：\n${recentChat}\n
          你的私聊记录：\n${privateChatHistory}\n
${aliveDeadSummary}
你的当前状态：${player.alive ? "存活" : "死亡"}。
时间规则：${dayRuleNote || "无"}
猎手声明规则：若要触发开枪，整句必须严格为"${SLAYER_DECLARATION_TEMPLATE}"。
你的私密信息增量：${privateInfo}
你自己之前说过：${recentSelf}\n
${extraInstruction ? `额外约束：${extraInstruction}\n` : ""}这是公开聊天，所有玩家都能看到你的发言。只基于以上信息发言。请输出一小段话发言。`
  );
  try {
    let usedPrompt = buildPrompt("");
    let content = await callDeepSeek(usedPrompt, getTempValue(), player, "chat", false);
    if (
      !state ||
      !state.started ||
      state.phase !== "day" ||
      state.dayStage !== "discussion" ||
      state.discussionToken !== token ||
      state.paused
    ) {
      return;
    }
    let text = content.trim();
    if (isEvilSelfReveal(player, text)) {
      usedPrompt = buildPrompt("不要自曝为爪牙或恶魔，也不要承认自己是坏人。优先伪装为可信的善良角色。");
      content = await callDeepSeek(usedPrompt, getTempValue(), player, "chat", false);
      text = content.trim();
    }
    if (isEvilSelfReveal(player, text)) {
      text = "我没什么想说的。";
    }
    if (
      !state ||
      !state.started ||
      state.phase !== "day" ||
      state.dayStage !== "discussion" ||
      state.discussionToken !== token ||
      state.paused
    ) {
      return;
    }
    if (!text) text = "我没什么想说的。";
    commitSessionMessages(player, "chat", usedPrompt, text);
    player.memory.push(text);
    addChat(player.name, text, "player");
    maybeAiPrivateChat(player);
  } catch (error) {
    addChat("系统", `${player.name} 发言失败。`, "system");
  }
}

export async function advanceDiscussion() {
  if (!state.started || state.phase !== "day" || state.dayStage !== "discussion") return;
  if (state.paused) return;
  const total = state.discussionOrder.length;
  if (!total) {
    enterNomination();
    return;
  }
  while (true) {
    if (state.discussionCursor >= total) {
      state.discussionCursor = 0;
    }
    const nextId = state.discussionOrder[state.discussionCursor];
    state.discussionCursor += 1;
    const player = state.players.find((p) => p.id === nextId);
    if (!player) {
      continue;
    }
    state.currentSpeakerId = nextId;
    renderStatus();
    if (player.isHuman) {
      return;
    }
    await aiSpeak(player);
    if (state.paused) {
      return;
    }
  }
}

export async function startDiscussion(auto = true) {
  if (state && state.paused) return;
  resetDiscussion();
  const duration = getDiscussionDurationSeconds();
  state.discussionDurationSeconds = duration;
  state.discussionMaxRemaining = duration;
  state.lastDiscussionAt = Date.now();
  startDayDiscussionTimer(true);
  addChat("说书人", "白天讨论开始。", "storyteller");
  addLogEntry("进入讨论阶段", "phase");
  renderAll();
  if (auto) {
    await advanceDiscussion();
  }
}

export function resetDiscussion() {
  state.dayStage = "discussion";
  state.discussionOrder = state.players.map((p) => p.id);
  const firstAiIndex = state.discussionOrder.findIndex((id) => {
    const player = state.players.find((p) => p.id === id);
    return player && !player.isHuman;
  });
  state.discussionCursor = firstAiIndex === -1 ? 0 : firstAiIndex;
  state.discussionPassed = [];
  state.currentSpeakerId = "";
  state.discussionToken = (state.discussionToken || 0) + 1;
  state.lastDiscussionAt = Date.now();
  state.nominationCountdown = 0;
  const duration = getDiscussionDurationSeconds();
  state.discussionDurationSeconds = duration;
  state.discussionMaxRemaining = duration;
}

export function markPassed(playerId) {
  if (!state.discussionPassed.includes(playerId)) {
    state.discussionPassed.push(playerId);
  }
}

export function allPassed() {
  return state.discussionOrder.length > 0 && state.discussionPassed.length >= state.discussionOrder.length;
}

export async function requestHumanStatement(title, fallback = "我没什么想说的。") {
  const promptText = title ? `${title}\n（可留空跳过）` : "请输入：";
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const supportsVoice = Boolean(SpeechRecognition);
  if (supportsVoice) {
    const wantVoice = window.confirm(`${promptText}\n\n点"确定"使用语音输入，点"取消"手动输入。`);
    if (wantVoice) {
      const spoken = await captureSpeechForStatement(title);
      updateVoiceUi("");
      if (spoken) {
        const reviewed = window.prompt(`${promptText}\n（已识别，可直接确认或修改）`, spoken);
        if (reviewed === null) return spoken || fallback;
        const reviewedTrimmed = reviewed.trim();
        return reviewedTrimmed || fallback;
      }
    }
  }
  updateVoiceUi("");
  const input = window.prompt(promptText, "");
  if (input === null) return fallback;
  const trimmed = input.trim();
  return trimmed || fallback;
}
