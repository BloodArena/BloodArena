/**
 * private-chat.js — Private chat AI functions extracted from singleplayer_demo.html
 * Handles AI private chat responses, AI-to-AI private replies, and spontaneous AI private chat initiation.
 */

import { state } from './state.js';
import { PLAYER_JSON_SYSTEM_PROMPT } from './constants.js';
import { extractJson, normalizeTargetName, isEvilSelfReveal } from './utils.js';
import { callDeepSeek, commitSessionMessages } from './api.js';
import { addPrivateChat, formatPlayerPrivateChats, isPrivateChatOpen } from './chat.js';
import {
  buildPlayerPromptMessages,
  formatPrivateInfoForPrompt,
  formatChatForPrompt,
  getAliveDeadSummary
} from './prompts.js';

/* ===== DOM references (resolved lazily) ===== */

function getTempValue() {
  const tempInput = document.getElementById("tempInput");
  return tempInput ? Number(tempInput.value) || 1.0 : 1.0;
}

/* ===== Exported functions ===== */

export async function respondToPrivate(player, mentionText) {
  const privateInfo = formatPrivateInfoForPrompt(player, "chat", 4);
  const human = state.players.find((p) => p.isHuman);
  const privateChatHistory = formatPlayerPrivateChats(player);
  const recentChat = formatChatForPrompt(10, player, "chat");
  const aliveDeadSummary = getAliveDeadSummary();
  const buildPrompt = (extraInstruction = "") => buildPlayerPromptMessages(
    player,
    "chat",
    `公开聊天（最近增量）：\n${recentChat}\n
你的全部私聊记录：\n${privateChatHistory}\n
这是私聊，只有你和对方能看到。${human ? human.name : "对方"}对你说：${mentionText}
${aliveDeadSummary}
你的当前状态：${player.alive ? "存活" : "死亡"}。
你的私密信息增量：${privateInfo}
${extraInstruction ? `额外约束：${extraInstruction}\n` : ""}请用一小段话私聊回应（注意：这不是公开发言，只有对方能看到）。`
  );
  try {
    let usedPrompt = buildPrompt("");
    let content = await callDeepSeek(usedPrompt, getTempValue(), player, "chat", false);
    let text = content.trim() || "我没什么想说的。";
    if (isEvilSelfReveal(player, text)) {
      usedPrompt = buildPrompt("不要自曝为爪牙或恶魔，也不要承认自己是坏人。");
      content = await callDeepSeek(usedPrompt, getTempValue(), player, "chat", false);
      text = content.trim() || "我没什么想说的。";
    }
    if (isEvilSelfReveal(player, text)) text = "我没什么想说的。";
    commitSessionMessages(player, "chat", usedPrompt, text);
    player.memory.push(text);
    addPrivateChat(player.name, human ? human.name : "你", text);
  } catch (error) {
    addPrivateChat("系统", player.name, `${player.name} 未能私聊回应。`);
  }
}

export async function aiPrivateReply(sender, target, text) {
  if (!state || !sender || !target) return;
  const privateInfo = formatPrivateInfoForPrompt(target, "chat", 4);
  const privateChatHistory = formatPlayerPrivateChats(target);
  const recentChat = formatChatForPrompt(8, target, "chat");
  const aliveDeadSummary = getAliveDeadSummary();
  const buildPrompt = (extraInstruction = "") => buildPlayerPromptMessages(
    target,
    "chat",
    `公开聊天（最近增量）：\n${recentChat}\n
你的全部私聊记录：\n${privateChatHistory}\n
这是私聊，只有你和对方能看到。${sender.name}对你说：${text}
${aliveDeadSummary}
你的当前状态：${target.alive ? "存活" : "死亡"}。
你的私密信息增量：${privateInfo}
${extraInstruction ? `额外约束：${extraInstruction}\n` : ""}请用一小段话私聊回应（注意：这不是公开发言，只有对方能看到）。`
  );
  try {
    let usedPrompt = buildPrompt("");
    let content = await callDeepSeek(usedPrompt, getTempValue(), target, "chat", false);
    let reply = content.trim() || "我没什么想说的。";
    if (isEvilSelfReveal(target, reply)) {
      usedPrompt = buildPrompt("不要自曝为爪牙或恶魔，也不要承认自己是坏人。");
      content = await callDeepSeek(usedPrompt, getTempValue(), target, "chat", false);
      reply = content.trim() || "我没什么想说的。";
    }
    if (isEvilSelfReveal(target, reply)) reply = "我没什么想说的。";
    commitSessionMessages(target, "chat", usedPrompt, reply);
    target.memory.push(reply);
    addPrivateChat(target.name, sender.name, reply);
  } catch (error) {
    addPrivateChat("系统", target.name, `${target.name} 未能私聊回应。`);
  }
}

export async function maybeAiPrivateChat(player) {
  if (!state || !player) return;
  if (state.paused) return;
  if (!isPrivateChatOpen()) return;
  if (state.dayCount !== 1 || state.phase !== "day" || state.dayStage !== "discussion") return;
  const candidates = state.players.filter((p) => p.alive && p.id !== player.id);
  if (!candidates.length) return;
  const privateInfo = formatPrivateInfoForPrompt(player, "json", 4);
  const privateChatHistory = formatPlayerPrivateChats(player);
  const recentChat = formatChatForPrompt(8, player, "json");
  const aliveDeadSummary = getAliveDeadSummary();
  const targetNames = candidates.map((p) => p.name).join("、");
  const userContent = `公开聊天（最近增量）：\n${recentChat}\n
        你的私聊记录：\n${privateChatHistory}\n
现在是白天1，你可以选择是否发起一次私聊（仅在白天1可私聊）。
可私聊目标：${targetNames}。
如果你是邪恶阵营，可以考虑通过私聊与邪恶同伴交换身份或协调计划。
${aliveDeadSummary}
你的当前状态：${player.alive ? "存活" : "死亡"}。
你的私密信息增量：${privateInfo}
请输出 JSON：{"private":"yes|no","target":"玩家名","message":"一小段话"}`;
  const prompt = buildPlayerPromptMessages(player, "json", userContent, {
    systemPrompt: PLAYER_JSON_SYSTEM_PROMPT
  });
  try {
    const content = await callDeepSeek(prompt, getTempValue(), player, "json");
    const json = extractJson(content);
    if (!json || json.private !== "yes") return;
    const targetName = normalizeTargetName(json.target || "");
    const target = candidates.find((p) => p.name === targetName);
    if (!target) return;
    const text = (json.message || "").trim();
    if (!text) return;
    addPrivateChat(player.name, target.name, text);
    if (!target.isHuman) {
      await aiPrivateReply(player, target, text);
    }
  } catch (error) {
    return;
  }
}
