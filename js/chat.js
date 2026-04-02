/**
 * chat.js — Chat, private-chat, log, and discussion-drawer functions
 * Extracted from singleplayer_demo.html
 */

import {
  state,
  chatPinLockTimer,
  chatLayoutObserver,
  chatRelockRaf,
  chatRelockTimer,
  setChatPinLockTimer,
  setChatLayoutObserver,
  setChatRelockRaf,
  setChatRelockTimer,
  saveState
} from './state.js';

import {
  CHAT_NEAR_BOTTOM_THRESHOLD,
  ROLE_NAME_LIST
} from './constants.js';
import { ttsSpeak, ttsPlayManual } from './tts.js';

import {
  chatBox,
  chatTabPublicContent,
  discussionActionsEl,
  discussionLogDrawer,
  townRightScrollEl,
  townRightEl,
  townLayoutEl,
  peekTownBtn,
  peekLogBtn,
  chatAutoScrollBtn,
  chatJumpLatestBtn,
  chatResultHint,
  chatSearchInput,
  privateChatBox,
  privateTargetSelect,
  privateInput,
  privateSendBtn,
  privateChatHint,
  logList,
  publicLogList,
  publicLogDrawerList
} from './ui-helpers.js';

/* ─── late-bound dependencies (set via setChatDeps) ──────── */

let _getPhaseLabel = () => "未开局";
let _renderLog = () => {};
let _renderPublicLog = () => {};
let _maybeHandleSlayerClaim = () => {};

export function setChatDeps({ getPhaseLabel, renderLog, renderPublicLog, maybeHandleSlayerClaim }) {
  if (typeof getPhaseLabel === "function") _getPhaseLabel = getPhaseLabel;
  if (typeof renderLog === "function") _renderLog = renderLog;
  if (typeof renderPublicLog === "function") _renderPublicLog = renderPublicLog;
  if (typeof maybeHandleSlayerClaim === "function") _maybeHandleSlayerClaim = maybeHandleSlayerClaim;
}

/* ─── chat tab / scroll helpers ──────────────────────────── */

export function isPublicChatTabActive() {
  return Boolean(chatTabPublicContent && chatTabPublicContent.classList.contains("active"));
}

export function isChatNearBottom(threshold = CHAT_NEAR_BOTTOM_THRESHOLD) {
  if (!chatBox) return true;
  const distance = chatBox.scrollHeight - chatBox.scrollTop - chatBox.clientHeight;
  return distance <= threshold;
}

export function scrollChatToLatest() {
  if (!chatBox) return;
  chatBox.style.scrollBehavior = "auto";
  chatBox.scrollTop = Math.max(0, chatBox.scrollHeight - chatBox.clientHeight);
}

export function lockChatToBottom(ms = 260) {
  if (!chatBox || !state) return;
  if (chatPinLockTimer) clearTimeout(chatPinLockTimer);
  const startAt = Date.now();
  const minDuration = Math.max(100, ms);
  const hardEndAt = Date.now() + Math.max(260, ms + 260);
  let stableFrames = 0;
  let lastHeight = -1;
  const tick = () => {
    if (!state || state.chatAutoFollow === false || !isPublicChatTabActive()) return;
    scrollChatToLatest();
    const currentHeight = chatBox.scrollHeight;
    if (currentHeight === lastHeight) {
      stableFrames += 1;
    } else {
      stableFrames = 0;
      lastHeight = currentHeight;
    }
    const now = Date.now();
    const shouldContinue =
      now < (startAt + minDuration) ||
      (stableFrames < 2 && now < hardEndAt);
    if (shouldContinue) {
      requestAnimationFrame(tick);
    }
  };
  tick();
  setChatPinLockTimer(setTimeout(() => {
    setChatPinLockTimer(null);
  }, Math.max(140, ms + 80)));
}

export function scheduleChatRelock(ms = 260) {
  if (!chatBox || !state || state.chatAutoFollow === false || !isPublicChatTabActive()) return;
  if (chatRelockRaf) cancelAnimationFrame(chatRelockRaf);
  if (chatRelockTimer) clearTimeout(chatRelockTimer);
  setChatRelockRaf(requestAnimationFrame(() => {
    setChatRelockRaf(null);
    lockChatToBottom(ms);
  }));
  setChatRelockTimer(setTimeout(() => {
    setChatRelockTimer(null);
    lockChatToBottom(Math.max(200, ms));
  }, 56));
}

export function setupChatLayoutObserver() {
  if (typeof ResizeObserver === "undefined") return;
  if (chatLayoutObserver) chatLayoutObserver.disconnect();
  const targets = [
    chatBox,
    chatTabPublicContent,
    discussionActionsEl,
    discussionLogDrawer,
    townRightScrollEl,
    townRightEl
  ].filter(Boolean);
  if (!targets.length) return;
  let queued = false;
  setChatLayoutObserver(new ResizeObserver(() => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      scheduleChatRelock(320);
    });
  }));
  targets.forEach((el) => chatLayoutObserver.observe(el));
}

/* ─── discussion focus mode / drawers ────────────────────── */

export function isDiscussionFocusMode() {
  return Boolean(
    state &&
    state.started &&
    !state.ended &&
    state.phase === "day" &&
    state.dayStage === "discussion"
  );
}

export function applyDiscussionDrawers() {
  if (!state || !townLayoutEl) return;
  const active = isDiscussionFocusMode();
  if (!active) {
    state.discussionTownDrawerOpen = false;
    state.discussionLogDrawerOpen = false;
  }
  const townOpen = active && state.discussionTownDrawerOpen === true;
  const logOpen = active && state.discussionLogDrawerOpen === true;
  townLayoutEl.classList.toggle("show-town-left", townOpen);
  townLayoutEl.classList.toggle("show-public-log", logOpen);
  townLayoutEl.classList.toggle("overlay-open", townOpen || logOpen);
  if (peekTownBtn) peekTownBtn.textContent = townOpen ? "收起广场" : "广场";
  if (peekLogBtn) peekLogBtn.textContent = logOpen ? "收起记录" : "记录";
}

export function setDiscussionDrawer(kind, forceOpen = null) {
  if (!state || !townLayoutEl || !isDiscussionFocusMode()) return;
  const townKey = "discussionTownDrawerOpen";
  const logKey = "discussionLogDrawerOpen";
  const openTown = kind === "town";
  const key = openTown ? townKey : logKey;
  const otherKey = openTown ? logKey : townKey;
  const next = typeof forceOpen === "boolean" ? forceOpen : !(state[key] === true);
  state[key] = next;
  if (next) {
    state[otherKey] = false;
  }
  applyDiscussionDrawers();
  scheduleChatRelock(340);
  saveState();
}

export function closeDiscussionDrawers() {
  if (!state || !townLayoutEl) return;
  state.discussionTownDrawerOpen = false;
  state.discussionLogDrawerOpen = false;
  applyDiscussionDrawers();
  scheduleChatRelock(260);
  saveState();
}

/* ─── chat sequence / unread tracking ────────────────────── */

export function getLatestChatSeq() {
  return Number(state?.chatSeq) || 0;
}

export function syncUnreadChatCount() {
  if (!state) return;
  const latestSeq = getLatestChatSeq();
  const lastRead = Number(state.chatLastReadSeq) || 0;
  state.chatUnreadCount = Math.max(0, latestSeq - lastRead);
}

export function markChatReadToLatest() {
  if (!state) return;
  state.chatLastReadSeq = getLatestChatSeq();
  state.chatUnreadCount = 0;
}

export function updateChatToolbarStatus(filteredCount = null) {
  if (!state) return;
  if (chatAutoScrollBtn) {
    chatAutoScrollBtn.textContent = `跟随新消息：${state.chatAutoFollow === false ? "关" : "开"}`;
  }
  if (chatJumpLatestBtn) {
    const unread = Number(state.chatUnreadCount) || 0;
    const show = unread > 0;
    chatJumpLatestBtn.classList.toggle("visible", show);
    chatJumpLatestBtn.textContent = show ? `回到底部（${unread}）` : "回到底部";
  }
  if (chatResultHint) {
    const total = Array.isArray(state.chat) ? state.chat.length : 0;
    const shown = typeof filteredCount === "number" ? filteredCount : total;
    const filter = state.chatFilter || "all";
    const keyword = (state.chatSearch || "").trim();
    const segments = [];
    if (filter !== "all") segments.push(`玩家：${filter}`);
    if (keyword) segments.push(`关键词：${keyword}`);
    const queryText = segments.length ? `（${segments.join("，")}）` : "";
    chatResultHint.textContent = `显示 ${shown}/${total} 条${queryText}`;
  }
}

/* ─── log / replay entries ───────────────────────────────── */

export function addLogEntry(text, type = "note", data = {}) {
  const time = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
  state.log.unshift({
    time,
    phase: _getPhaseLabel(),
    type,
    text,
    data
  });
  _renderLog();
  saveState();
}

export function addPublicLogEntry(text) {
  if (!state) return;
  const time = new Date().toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" });
  if (!Array.isArray(state.publicLog)) state.publicLog = [];
  state.publicLog.push({
    time,
    phase: _getPhaseLabel(),
    text
  });
  _renderPublicLog();
  saveState();
}

export function addReplayEvent(text, type = "note") {
  if (!state) return;
  state.replayEvents.push({
    time: new Date().toISOString(),
    phase: _getPhaseLabel(),
    type,
    text
  });
  saveState();
}

/* ─── public chat ────────────────────────────────────────── */

export function addChat(speaker, text, type = "player") {
  if (
    state &&
    state.dayStage === "nomination" &&
    type === "player" &&
    !["reason", "defense"].includes(state.nominationPhase) &&
    !state.postGameChat
  ) {
    return;
  }
  const nextSeq = (Number(state.chatSeq) || 0) + 1;
  state.chatSeq = nextSeq;
  state.chat.push({
    time: new Date().toISOString(),
    phase: _getPhaseLabel(),
    speaker,
    type,
    text,
    seq: nextSeq
  });
  const shouldAutoFollow =
    state.chatAutoFollow !== false &&
    isPublicChatTabActive();
  if (shouldAutoFollow) {
    markChatReadToLatest();
  } else {
    syncUnreadChatCount();
  }
  renderChat({ forceScroll: shouldAutoFollow });
  if (type === "player") {
    _maybeHandleSlayerClaim(speaker, text);
    updateClaimsFromChat(speaker, text);
    const speakerPlayer = state.players.find((p) => p.name === speaker);
    if (speakerPlayer && !speakerPlayer.isHuman) {
      ttsSpeak(speaker, text);
    }
  }
  saveState();
}

function canPlayTtsForSpeaker(speaker) {
  if (!state || !speaker) return false;
  const speakerPlayer = state.players.find((p) => p.name === speaker);
  return Boolean(speakerPlayer && !speakerPlayer.isHuman);
}

function buildChatTextNode(text) {
  const body = document.createElement("div");
  body.className = "chat-item-body";
  body.textContent = text;
  return body;
}

function buildChatHeader(metaText, speaker = "", text = "") {
  const header = document.createElement("div");
  header.className = "chat-item-header";

  const meta = document.createElement("div");
  meta.className = "meta";
  meta.textContent = metaText;
  header.appendChild(meta);

  if (canPlayTtsForSpeaker(speaker)) {
    const playBtn = document.createElement("button");
    playBtn.type = "button";
    playBtn.className = "secondary chat-item-tts-btn";
    playBtn.textContent = "播放";
    playBtn.title = `播放 ${speaker} 的这条发言`;
    playBtn.addEventListener("click", (event) => {
      event.preventDefault();
      event.stopPropagation();
      ttsPlayManual(speaker, text);
    });
    header.appendChild(playBtn);
  }

  return header;
}

function appendRenderedChatItem(container, metaText, text, className, speaker = "") {
  const div = document.createElement("div");
  div.className = className;
  div.appendChild(buildChatHeader(metaText, speaker, text));
  div.appendChild(buildChatTextNode(text));
  container.appendChild(div);
}

/* ─── private chat ───────────────────────────────────────── */

export function addPrivateChat(sender, target, text) {
  if (!state) return;
  const senderPlayer = state.players.find((p) => p.name === sender);
  const targetPlayer = state.players.find((p) => p.name === target);
  state.privateChat.push({
    time: new Date().toISOString(),
    phase: _getPhaseLabel(),
    sender,
    target,
    senderId: senderPlayer ? senderPlayer.id : "",
    targetId: targetPlayer ? targetPlayer.id : "",
    text
  });
  renderPrivateChat();
  saveState();
}

/* ─── role claim extraction ──────────────────────────────── */

export function extractRoleClaim(text) {
  if (!text) return "";
  const content = String(text);
  for (const roleName of ROLE_NAME_LIST) {
    const denyPattern = new RegExp(`不是\\s*${roleName}`);
    if (denyPattern.test(content)) continue;
    const claimPattern = new RegExp(
      `(我是|我就是|我自称|我跳|我报|我声称自己是|我宣称自己是|我称自己是)\\s*${roleName}`
    );
    if (claimPattern.test(content)) {
      return roleName;
    }
  }
  return "";
}

export function updateClaimsFromChat(speaker, text) {
  if (!state || !speaker || !text) return;
  const player = state.players.find((p) => p.name === speaker);
  if (!player) return;
  const roleName = extractRoleClaim(text);
  if (!roleName) return;
  if (!state.claims || typeof state.claims !== "object") {
    state.claims = {};
  }
  if (!Array.isArray(state.claimHistory)) {
    state.claimHistory = [];
  }
  const entry = {
    playerId: player.id,
    playerName: player.name,
    roleName,
    time: new Date().toISOString(),
    phase: _getPhaseLabel(),
    night: state.nightCount,
    day: state.dayCount,
    text: String(text).slice(0, 200)
  };
  state.claims[player.id] = entry;
  state.claimHistory.push(entry);
}

/* ─── render chat ────────────────────────────────────────── */

export function renderChat(options = {}) {
  const forceScroll = Boolean(options.forceScroll);
  chatBox.innerHTML = "";
  if (chatSearchInput && chatSearchInput.value !== (state.chatSearch || "")) {
    chatSearchInput.value = state.chatSearch || "";
  }
  const human = state.players.find((p) => p.isHuman);
  const filter = state.chatFilter || "all";
  const searchRaw = typeof state.chatSearch === "string" ? state.chatSearch : "";
  const search = searchRaw.trim().toLowerCase();
  const items = Array.isArray(state.chat) ? state.chat.slice() : [];
  const filtered = items.filter((item) => {
    if (filter !== "all" && item.speaker !== filter) return false;
    if (!search) return true;
    const haystack = `${item.phase} ${item.speaker} ${item.text}`.toLowerCase();
    return haystack.includes(search);
  });
  if (!filtered.length) {
    const label = search
      ? `没有匹配"${searchRaw.trim()}"的发言。`
      : (filter === "all" ? "暂无发言。" : `暂无 ${filter} 的发言。`);
    appendRenderedChatItem(chatBox, "提示", label, "chat-item system");
    updateChatToolbarStatus(0);
    return;
  }
  filtered.forEach((item) => {
    const isSelf = human && item.speaker === human.name && item.type === "player";
    const className = `chat-item ${item.type}${isSelf ? " self-msg" : ""}${search ? " search-hit" : ""}`;
    appendRenderedChatItem(chatBox, `${item.phase} · ${item.speaker}`, item.text, className, item.speaker);
  });
  const shouldStickBottom =
    forceScroll ||
    (
      state.chatAutoFollow !== false &&
      isPublicChatTabActive()
    );
  if (shouldStickBottom) {
    lockChatToBottom(320);
    markChatReadToLatest();
  } else {
    syncUnreadChatCount();
  }
  updateChatToolbarStatus(filtered.length);
}

export function renderPrivateChat() {
  if (!privateChatBox) return;
  privateChatBox.innerHTML = "";
  const items = state.privateChat || [];
  const human = state.players.find((p) => p.isHuman);
  const visibleItems = human
    ? items.filter((item) => item.senderId === human.id || item.targetId === human.id)
    : items;
  if (!visibleItems.length) {
    const hasOtherChats = items.length > 0;
    const hint = hasOtherChats ? "暂无与你相关的私聊。" : "首个白天可进行私聊。";
    appendRenderedChatItem(privateChatBox, "暂无私聊", hint, "chat-item system");
    return;
  }
  visibleItems.slice(-80).forEach((item) => {
    appendRenderedChatItem(
      privateChatBox,
      `${item.phase} · ${item.sender} -> ${item.target}`,
      item.text,
      "chat-item",
      item.sender
    );
  });
  privateChatBox.scrollTop = privateChatBox.scrollHeight;
}

export function isPrivateChatOpen() {
  if (!state || !state.started || state.ended) return false;
  if (state.phase !== "day") return false;
  if (state.dayCount !== 1) return false;
  if (state.dayStage === "nomination") return false;
  return true;
}

export function canUseVoiceInput() {
  if (!state || !state.started || state.paused) return false;
  if (state.ended) {
    return Boolean(state.postGameChat);
  }
  if (state.phase !== "day") return false;
  return state.dayStage === "discussion";
}

export function updatePrivateChatControls() {
  if (!privateTargetSelect || !privateInput || !privateSendBtn || !privateChatHint) return;
  const open = isPrivateChatOpen();
  privateTargetSelect.disabled = !open;
  privateInput.disabled = !open;
  privateSendBtn.disabled = !open;
  privateChatHint.textContent = open ? "仅白天1可使用私聊。" : "私聊仅在白天1开放。";
}

/* ─── prompt formatting helpers ──────────────────────────── */

export function formatPrivateChatForPrompt(targetId, limit = 6) {
  if (!state) return "无";
  const human = state.players.find((p) => p.isHuman);
  if (!human) return "无";
  return formatPrivateChatBetween(human.id, targetId, limit);
}

export function formatPrivateChatBetween(idA, idB, limit = 6) {
  if (!state) return "无";
  const slice = (state.privateChat || [])
    .filter((item) => {
      return (
        (item.senderId === idA && item.targetId === idB) ||
        (item.senderId === idB && item.targetId === idA)
      );
    })
    .slice(-limit);
  if (!slice.length) return "无";
  return slice.map((c) => `${c.sender} -> ${c.target}: ${c.text}`).join("\n");
}

export function formatPlayerPrivateChats(actor) {
  if (!state || !actor) return "无";
  var all = (state.privateChat || []).filter(
    function(item) { return item.senderId === actor.id || item.targetId === actor.id; }
  );
  if (!all.length) return "无";
  return all.map(function(c) {
    var label = c.senderId === actor.id ? ("你 -> " + c.target) : (c.sender + " -> 你");
    return "[私聊] " + label + ": " + c.text;
  }).join("\n");
}

/* ─── timeline icon ──────────────────────────────────────── */

export function getTimelineIcon(entry) {
  if (entry.type === "phase") {
    if (entry.text.includes("夜晚")) return { icon: "\uD83C\uDF19", cls: "night" };
    if (entry.text.includes("白天")) return { icon: "\u2600\uFE0F", cls: "day" };
    return { icon: "\u25C6", cls: "" };
  }
  if (entry.type === "night") return { icon: "\uD83C\uDF19", cls: "night" };
  if (entry.text.includes("死亡") || entry.text.includes("击杀")) return { icon: "\uD83D\uDC80", cls: "death" };
  if (entry.text.includes("处决")) return { icon: "\u2694\uFE0F", cls: "execution" };
  if (entry.text.includes("提名")) return { icon: "\u261D\uFE0F", cls: "" };
  if (entry.text.includes("投票")) return { icon: "\uD83D\uDDF3\uFE0F", cls: "" };
  return { icon: "\u25CB", cls: "" };
}
