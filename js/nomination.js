/**
 * nomination.js — Nomination and voting logic extracted from singleplayer_demo.html
 *
 * Handles the full nomination lifecycle: entering nomination phase,
 * AI/human nominations, reason/defense speeches, parallel voting,
 * vote resolution, and day execution finalization.
 */

import { state, inactivityTimer, countdownTimer, voteTimer } from './state.js';
import { setInactivityTimer, setCountdownTimer, setVoteTimer } from './state.js';
import { MAX_NOMINATIONS_PER_DAY, PLAYER_JSON_SYSTEM_PROMPT } from './constants.js';
import { extractJson } from './utils.js';
import { callDeepSeek } from './api.js';
import {
  addChat,
  addLogEntry,
  addReplayEvent,
  addPublicLogEntry
} from './chat.js';
import {
  formatChatForPrompt,
  formatPrivateInfoForPrompt,
  buildPlayerPromptMessages
} from './prompts.js';
import { formatPlayerPrivateChats } from './chat.js';
import {
  renderAll,
  renderStatus,
  nomineeSelect,
  tempInput
} from './ui-helpers.js';
import { showModal, hideModal } from './overlays.js';
import { requestHumanStatement } from './discussion.js';
import { clearDayDiscussionTimer, checkWin, switchPhase } from './game-logic.js';
import {
  isDroisoned,
  canButlerVote,
  setPrivateInfo,
  recordRoleChange
} from './night-actions.js';

/* ─── timer helpers ──────────────────────────────────────────── */

export function clearNominationTimers() {
  if (inactivityTimer) {
    clearTimeout(inactivityTimer);
    setInactivityTimer(null);
  }
  if (countdownTimer) {
    clearInterval(countdownTimer);
    setCountdownTimer(null);
  }
  if (state) {
    state.nominationCountdown = 0;
  }
}


export function clearVoteTimer() {
  if (voteTimer) {
    clearInterval(voteTimer);
    setVoteTimer(null);
  }
  if (state) {
    state.voteCountdown = 0;
  }
}

export function startVoteCountdown(seconds) {
  clearVoteTimer();
  if (!state || !state.started || state.ended || state.paused) return;
  if (state.phase !== "day" || state.dayStage !== "nomination") return;
  if (state.nominationPhase !== "voting") return;
  if (state && Array.isArray(state.players)) {
    state.players.forEach((player) => {
      if (
        player &&
        !player.alive &&
        player.deadVoteUsed &&
        !state.nominationVotes[player.id]
      ) {
        recordVote(player, "no", "遗言票已用");
      }
    });
    const humanDead = state.players.find((p) => p.isHuman && !p.alive && p.deadVoteUsed);
    if (humanDead) {
      if (!state.nominationVotes[humanDead.id]) {
        recordVote(humanDead, "no", "遗言票已用");
      }
      state.humanVoted = true;
    }
  }
  state.voteCountdown = seconds;
  renderStatus();
  const human = state.players.find((p) => p.isHuman);
  if (human && !human.alive && !human.deadVoteUsed) {
    showModal("投票阶段开始，你有遗言票可投一次。倒计时结束将默认弃权。");
  } else {
    showModal("投票阶段开始，请在倒计时结束前完成投票。");
  }
  setVoteTimer(setInterval(() => {
    if (
      !state ||
      state.ended ||
      state.phase !== "day" ||
      state.dayStage !== "nomination" ||
      state.nominationPhase !== "voting"
    ) {
      clearVoteTimer();
      return;
    }
    state.voteCountdown -= 1;
    if (state.voteCountdown <= 0) {
      clearVoteTimer();
      const human = state.players.find((p) => p.isHuman && p.alive);
      const humanPlayer = state.players.find((p) => p.isHuman);
      if (humanPlayer && !state.humanVoted) {
        if (humanPlayer.alive) {
          recordVote(humanPlayer, "no", "超时默认反对");
        } else if (humanPlayer.deadVoteUsed) {
          recordVote(humanPlayer, "no", "遗言票已用");
        }
        state.humanVoted = true;
      }
      maybeFinalizeVotes();
      return;
    }
    renderStatus();
  }, 1000));
}

export function startNominationCountdown(seconds) {
  clearNominationTimers();
  if (!state || !state.started || state.ended || state.paused) return;
  if (state.phase !== "day" || state.dayStage !== "discussion") return;
  state.nominationCountdown = seconds;
  renderStatus();
  setCountdownTimer(setInterval(() => {
    if (!state || state.ended || state.phase !== "day" || state.dayStage !== "discussion") {
      clearNominationTimers();
      return;
    }
    state.nominationCountdown -= 1;
    if (state.nominationCountdown <= 0) {
      clearNominationTimers();
      enterNomination();
      return;
    }
    renderStatus();
  }, 1000));
}

export function scheduleNominationTimeout() {
  clearNominationTimers();
  if (!state || !state.started || state.ended || state.paused) return;
  if (state.phase !== "day" || state.dayStage !== "discussion") return;
  const now = Date.now();
  const last = state.lastDiscussionAt || now;
  const idleMs = Math.max(0, now - last);
  if (idleMs >= 10000) {
    startNominationCountdown(5);
    return;
  }
  setInactivityTimer(setTimeout(() => {
    startNominationCountdown(5);
  }, 10000 - idleMs));
}

/* ─── nomination entry ───────────────────────────────────────── */

export function enterNomination() {
  if (state && state.paused) return;
  clearNominationTimers();
  clearDayDiscussionTimer();
  clearVoteTimer();
  state.dayStage = "nomination";
  state.currentSpeakerId = "";
  state.currentNomineeId = "";
  state.currentNominatorId = "";
  state.currentVoterId = "";
  state.nominationPhase = "open";
  state.nominationStep = "";
  state.nominationOrder = [];
  state.nominationCursor = 0;
  state.nominationVoteOrder = [];
  state.nominationVoteCursor = 0;
  state.nominationVotes = {};
  state.dayNominationCount = 0;
  state.dayHighestVotes = 0;
  state.dayHighestNomineeId = "";
  state.dayHighestTied = false;
  state.pendingNominationQueue = [];
  state.pendingAiNominations = 0;
  state.humanNominationDone = false;
  state.nominationUsedIds = [];
  state.nomineeUsedIds = [];
  state.nominationInProgress = false;
  addChat("说书人", "讨论结束，进入提名阶段。", "storyteller");
  addChat("系统", `现在开始提名阶段（每人仅一次提名，每人最多被提名一次；每日最多${MAX_NOMINATIONS_PER_DAY}次提名）。`, "system");
  addLogEntry("进入提名阶段", "phase");
  addReplayEvent("进入提名阶段", "day_action");
  renderAll();
  startNominationRound();
}

export function getAliveOrder() {
  return state.players.filter((p) => p.alive).map((p) => p.id);
}

/* ─── nomination round ───────────────────────────────────────── */

export async function startNominationRound() {
  if (state && state.paused) return;
  state.nominationPhase = "open";
  state.currentSpeakerId = "";
  state.pendingNominationQueue = [];
  state.nominationInProgress = false;
  const human = state.players.find((p) => p.isHuman && p.alive);
  if (human) {
    state.currentSpeakerId = human.id;
    addChat("系统", "你可以随时提名或跳过。AI 将并行决定是否提名。", "system");
  }
  const aiPlayers = state.players.filter((p) => p.alive && !p.isHuman);
  state.pendingAiNominations = aiPlayers.length;
  renderStatus();
  if (!aiPlayers.length) {
    maybeStartNextNomination();
    return;
  }
  aiPlayers.forEach((player) => {
    aiNominate(player)
      .then((nomination) => {
        state.pendingAiNominations = Math.max(0, state.pendingAiNominations - 1);
        state.nominationUsedIds.push(player.id);
        if (state.paused) {
          return;
        }
        if (nomination && nomination.nomineeId && !state.nomineeUsedIds.includes(nomination.nomineeId)) {
          state.pendingNominationQueue.push({
            nominatorId: player.id,
            nomineeId: nomination.nomineeId,
            reason: nomination.reason || ""
          });
        }
        maybeStartNextNomination();
      })
      .catch(() => {
        state.pendingAiNominations = Math.max(0, state.pendingAiNominations - 1);
        state.nominationUsedIds.push(player.id);
        if (state.paused) {
          return;
        }
        maybeStartNextNomination();
      });
  });
  maybeStartNextNomination();
}

export function maybeStartNextNomination() {
  if (!state.started || state.phase !== "day" || state.dayStage !== "nomination") return;
  if (state.nominationPhase !== "open") return;
  if (state.paused) return;
  if (state.nominationInProgress) return;
  if (state.dayNominationCount >= MAX_NOMINATIONS_PER_DAY) {
    state.nominationPhase = "";
    state.nominationStep = "";
    state.currentSpeakerId = "";
    finalizeDayExecution();
    return;
  }
  while (state.pendingNominationQueue.length) {
    const next = state.pendingNominationQueue.shift();
    if (!next) continue;
    if (state.nomineeUsedIds.includes(next.nomineeId)) continue;
    state.nomineeUsedIds.push(next.nomineeId);
    state.currentSpeakerId = "";
    startNominationResolution(next.nominatorId, next.nomineeId, next.reason || "");
    return;
  }
  if (state.pendingAiNominations > 0) {
    return;
  }
  const human = state.players.find((p) => p.isHuman && p.alive);
  if (human && !state.humanNominationDone) {
    state.currentSpeakerId = human.id;
    renderStatus();
    return;
  }
  state.nominationPhase = "";
  state.nominationStep = "";
  state.currentSpeakerId = "";
  finalizeDayExecution();
}

/* ─── AI nomination ──────────────────────────────────────────── */

export async function aiNominate(player) {
  if (state && state.paused) return null;
  const nominableTargets = state.players
    .filter((p) => !state.nomineeUsedIds.includes(p.id) && p.id !== player.id)
    .map((p) => `${p.name}${p.alive ? "" : "（已死亡）"}`);
  const recentChat = formatChatForPrompt(12, player);
  const privateInfo = formatPrivateInfoForPrompt(player, "json", 4);
  const privateChatHistory = formatPlayerPrivateChats(player);
  const userContent = `公开聊天（最近增量）：\n${recentChat}\n
        你的私聊记录：\n${privateChatHistory}\n
当前提名阶段：你可以选择是否提名一名玩家（包括已死亡的玩家）。可提名玩家：${nominableTargets.join("、")}。
今日最多${MAX_NOMINATIONS_PER_DAY}次提名，若已达到上限则不要提名。
你的私密信息增量：${privateInfo}
请输出 JSON：{"nominate":"yes|no","target":"玩家名","reason":"一小段话"}。如果不提名，target为空字符串。`;
  const prompt = buildPlayerPromptMessages(player, "json", userContent, {
    systemPrompt: PLAYER_JSON_SYSTEM_PROMPT
  });
  try {
    const content = await callDeepSeek(prompt, Number(tempInput.value) || 1.0, player, "json");
    const json = extractJson(content);
    if (json && json.nominate === "yes") {
      const rawName = json.target || "";
      const targetName = rawName.replace(/\(真人\)/g, "").replace(/（已死亡）/g, "").trim();
      const target = state.players.find(
        (p) => !state.nomineeUsedIds.includes(p.id) && p.name === targetName
      );
      if (target) {
        return { nomineeId: target.id, reason: json.reason || "" };
      }
    }
  } catch (error) {
    return null;
  }
  return null;
}

/* ─── nomination resolution (reason + defense) ───────────────── */

export async function startNominationResolution(nominatorId, nomineeId, reasonText = "") {
  if (state.nominationInProgress) return;
  state.nominationInProgress = true;
  const nominator = state.players.find((p) => p.id === nominatorId);
  const nominee = state.players.find((p) => p.id === nomineeId);
  if (!nominator || !nominee) {
    state.nominationInProgress = false;
    return;
  }
  if (state.dayNominationCount >= MAX_NOMINATIONS_PER_DAY) {
    state.nominationInProgress = false;
    addChat("系统", `今日提名已达上限（${MAX_NOMINATIONS_PER_DAY}次），直接进入结算。`, "system");
    finalizeDayExecution();
    return;
  }
  state.dayNominationCount += 1;
  addPublicLogEntry(`提名：${nominator.name} -> ${nominee.name}`);
  if (nominee.roleName === "贞洁者" && !nominee.virginUsed && nominator.team === "townsfolk" && !isDroisoned(nominee)) {
    nominee.virginUsed = true;
    nominator.alive = false;
    state.lastExecutedId = nominator.id;
    addChat("说书人", `${nominator.name} 提名 ${nominee.name}，触发贞洁者。${nominator.name} 被处决。`, "storyteller");
    addLogEntry(`贞洁者触发处决：${nominator.name}`, "day");
    addReplayEvent(`贞洁者触发：${nominator.name} 被处决`, "day_action");
    addPublicLogEntry(`贞洁者触发：${nominator.name} 被处决`);
    if (nominator.roleName === "圣徒") {
      addChat("系统", "圣徒被处决，邪恶阵营获胜。", "system");
      state.ended = true;
    }
    state.nominationInProgress = false;
    renderAll();
    checkWin();
    if (!state.ended) {
      switchPhase();
    }
    return;
  }
  state.nominationPhase = "reason";
  state.nominationStep = "reason";
  state.currentNominatorId = nominatorId;
  state.currentNomineeId = nomineeId;
  state.currentSpeakerId = nominatorId;
  state.currentVoterId = "";
  state.nominationVotes = {};
  nomineeSelect.value = nomineeId;
  addChat("说书人", `${nominator.name} 提名 ${nominee.name}。`, "storyteller");
  addLogEntry(`提名：${nominee.name}`, "day", { nominator: nominator.name });
  addReplayEvent(`提名：${nominator.name} -> ${nominee.name}`, "day_action");
  renderAll();
  if (reasonText && reasonText.trim()) {
    addChat(nominator.name, reasonText.trim(), "player");
    await handleNominationReasonDone();
    return;
  }
  if (!nominator.isHuman) {
    const reason = await aiNominationReason(nominator, nominee);
    addChat(nominator.name, reason, "player");
    await handleNominationReasonDone();
    return;
  }
  const humanReason = await requestHumanStatement("请陈述提名理由", "我没什么想说的。");
  addChat(nominator.name, humanReason, "player");
  await handleNominationReasonDone();
}

export async function handleNominationReasonDone() {
  state.nominationPhase = "defense";
  state.nominationStep = "defense";
  state.currentSpeakerId = state.currentNomineeId;
  renderStatus();
  const nominee = state.players.find((p) => p.id === state.currentNomineeId);
  if (!nominee) return;
  if (!nominee.isHuman) {
    const defense = await aiNominationDefense(nominee);
    addChat(nominee.name, defense, "player");
    await handleNominationDefenseDone();
    return;
  }
  const humanDefense = await requestHumanStatement("你被提名了，请简短辩解", "我没什么想说的。");
  addChat(nominee.name, humanDefense, "player");
  await handleNominationDefenseDone();
}

export async function handleNominationDefenseDone() {
  startNominationVoting();
}

/* ─── AI reason / defense ────────────────────────────────────── */

export async function aiNominationReason(nominator, nominee) {
  const recentChat = formatChatForPrompt(12, nominator);
  const privateInfo = formatPrivateInfoForPrompt(nominator, "chat", 4);
  const privateChatHistory = formatPlayerPrivateChats(nominator);
  const userContent = `公开聊天（最近增量）：\n${recentChat}\n
        你的私聊记录：\n${privateChatHistory}\n
你提名了${nominee.name}。
你的私密信息增量：${privateInfo}
这是一小段公开发言，不要说心理活动或私密信息，不要在括号里写心里话。\n请用一小段话说明理由。`;
  const prompt = buildPlayerPromptMessages(nominator, "chat", userContent);
  try {
    const content = await callDeepSeek(prompt, Number(tempInput.value) || 1.0, nominator, "chat");
    return content.trim() || "我没什么想说的。";
  } catch (error) {
    return "我没什么想说的。";
  }
}

export async function aiNominationDefense(nominee) {
  const recentChat = formatChatForPrompt(12, nominee);
  const privateInfo = formatPrivateInfoForPrompt(nominee, "chat", 4);
  const privateChatHistory = formatPlayerPrivateChats(nominee);
  const userContent = `公开聊天（最近增量）：\n${recentChat}\n
        你的私聊记录：\n${privateChatHistory}\n
你被提名了。
你的私密信息增量：${privateInfo}
这是公开辩解，不要说心理活动或私密信息，不要在括号里写心里话。\n请用一小段话辩解。`;
  const prompt = buildPlayerPromptMessages(nominee, "chat", userContent);
  try {
    const content = await callDeepSeek(prompt, Number(tempInput.value) || 1.0, nominee, "chat");
    return content.trim() || "我没什么想说的。";
  } catch (error) {
    return "我没什么想说的。";
  }
}

/* ─── voting ─────────────────────────────────────────────────── */

export function buildNominationVoteOrder(nomineeId) {
  const alive = getAliveOrder();
  const index = alive.indexOf(nomineeId);
  if (index === -1) return alive;
  return alive.slice(index).concat(alive.slice(0, index));
}

export function startNominationVoting() {
  if (state && state.paused) return;
  clearVoteTimer();
  const nominee = state.players.find((p) => p.id === state.currentNomineeId);
  state.nominationPhase = "voting";
  state.nominationStep = "voting";
  state.currentSpeakerId = "";
  state.nominationVoteOrder = buildNominationVoteOrder(state.currentNomineeId);
  state.nominationVoteCursor = 0;
  state.currentVoterId = "";
  state.nominationVotes = {};
  state.voteCountdown = 0;
  state.pendingAiVotes = 0;
  state.humanVoted = false;
  state.votingToken = (state.votingToken || 0) + 1;
  if (nominee) {
    addChat("说书人", `投票开始，请所有存活玩家表态。`, "storyteller");
  }
  renderAll();
  beginParallelVoting();
}

export function beginParallelVoting() {
  if (!state.started || state.phase !== "day" || state.dayStage !== "nomination") return;
  if (state.nominationPhase !== "voting") return;
  if (state.paused) return;
  const token = state.votingToken || 0;
  if (state && Array.isArray(state.players)) {
    state.players.forEach((player) => {
      if (
        player &&
        !player.alive &&
        player.deadVoteUsed &&
        !state.nominationVotes[player.id]
      ) {
        recordVote(player, "no", "遗言票已用");
      }
    });
  }
  const human = state.players.find((p) => p.isHuman);
  if (human) {
    if (!human.alive && human.deadVoteUsed) {
      state.currentVoterId = "";
      state.humanVoted = true;
    } else {
      state.currentVoterId = human.id;
      startVoteCountdown(60);
    }
  } else {
    state.currentVoterId = "";
    state.humanVoted = true;
  }
  const aiVoters = state.players.filter(
    (p) => !p.isHuman && !( !p.alive && p.deadVoteUsed)
  );
  state.pendingAiVotes = aiVoters.length;
  if (!aiVoters.length) {
    state.pendingAiVotes = 0;
    maybeFinalizeVotes();
    return;
  }
  Promise.all(
    aiVoters.map(async (voter) => {
      if (!state || state.nominationPhase !== "voting" || state.votingToken !== token || state.paused) return;
      const result = await Promise.race([
        aiVoteSingle(voter),
        new Promise((resolve) => {
          setTimeout(() => resolve({ vote: "no", reason: "超时弃票" }), 60000);
        })
      ]);
      if (!state || state.nominationPhase !== "voting" || state.votingToken !== token || state.paused) return;
      recordVote(voter, result.vote, result.reason);
      state.pendingAiVotes = Math.max(0, state.pendingAiVotes - 1);
      maybeFinalizeVotes();
    })
  ).catch(() => {});
}

export function maybeFinalizeVotes() {
  if (!state || state.phase !== "day" || state.dayStage !== "nomination") return;
  if (state.nominationPhase !== "voting") return;
  if (state.pendingAiVotes > 0) return;
  const human = state.players.find((p) => p.isHuman);
  if (human && !state.humanVoted) return;
  resolveNominationVotes();
}

export function finalizeDayExecution() {
  if (!state || !state.started) return;
  const aliveCount = state.players.filter((p) => p.alive).length;
  const executionThreshold = Math.ceil(aliveCount / 2);
  if (state.dayNominationCount === 0) {
    state.lastExecutedId = "";
    addChat("说书人", "无人提名，进入夜晚。", "storyteller");
    addLogEntry("无人提名", "day");
    addReplayEvent("无人提名，进入夜晚", "day_action");
    addPublicLogEntry("无人提名，进入夜晚");
  } else if (
    state.dayHighestNomineeId &&
    !state.dayHighestTied &&
    state.dayHighestVotes >= executionThreshold
  ) {
    const nominee = state.players.find((p) => p.id === state.dayHighestNomineeId);
    if (nominee && nominee.alive) {
      nominee.alive = false;
      state.lastExecutedId = nominee.id;
      addChat("说书人", `${nominee.name} 被处决。`, "storyteller");
      addLogEntry(`处决：${nominee.name}`, "day");
      addReplayEvent(`处决：${nominee.name}`, "day_action");
      addPublicLogEntry(`处决：${nominee.name}`);
      if (nominee.roleName === "圣徒") {
        addChat("系统", "圣徒被处决，邪恶阵营获胜。", "system");
        state.ended = true;
      }
    }
  } else {
    state.lastExecutedId = "";
    const reason = state.dayHighestTied
      ? "最高票平票"
      : `最高票不足半数（需${executionThreshold}票）`;
    addChat("说书人", `提名结束，${reason}，无人被处决。`, "storyteller");
    addLogEntry(`提名结束无人被处决（${reason}）`, "day");
    addReplayEvent(`提名结束无人被处决（${reason}）`, "day_action");
    addPublicLogEntry(`提名结束无人被处决（${reason}）`);
  }
  renderAll();
  checkWin();
  if (state.ended) return;
  const alive = state.players.filter((p) => p.alive);
  const mayorAlive = alive.some((p) => p.roleName === "镇长");
  if (mayorAlive && alive.length === 3 && !state.lastExecutedId) {
    addChat("系统", "镇长触发胜利条件，善良阵营获胜。", "system");
    state.ended = true;
    renderAll();
    return;
  }
  switchPhase();
}

/* ─── vote recording & sanitization ──────────────────────────── */

export function recordVote(voter, vote, reason) {
  const value = vote === "yes" ? "yes" : "no";
  const safeReason = sanitizePublicReason(reason);
  state.nominationVotes[voter.id] = { vote: value, reason: safeReason };
  if (!voter.alive && value === "yes") {
    voter.deadVoteUsed = true;
  }
  const displaySuffix = reason && typeof reason === "string" && reason.includes("超时")
    ? `（${reason.trim()}）`
    : "";
  addChat("系统", `${voter.name} 投票：${value === "yes" ? "赞成" : "反对"}${displaySuffix}`, "system");
  addPublicLogEntry(`${voter.name} 投票：${value === "yes" ? "赞成" : "反对"}${displaySuffix}`);
}

export function sanitizePublicReason(reason) {
  if (!reason || typeof reason !== "string") return "";
  let text = reason.trim();
  if (!text) return "";
  text = text.replace(/（[^）]*）/g, "").replace(/\([^)]*\)/g, "").replace(/【[^】]*】/g, "");
  const banned = ["内心", "心里", "心理活动", "思考过程", "作为恶魔", "我是恶魔", "我是爪牙", "我是坏人", "我是邪恶"];
  if (banned.some((key) => text.includes(key))) return "";
  return text.slice(0, 40);
}

/* ─── AI voting ──────────────────────────────────────────────── */

export async function aiVoteSingle(voter) {
  const nominee = state.players.find((p) => p.id === state.currentNomineeId);
  const recentChat = formatChatForPrompt(12, voter);
  const privateInfo = formatPrivateInfoForPrompt(voter, "json", 4);
  const privateChatHistory = formatPlayerPrivateChats(voter);
  if (!voter.alive && voter.deadVoteUsed) {
    return { vote: "no", reason: "遗言票已用" };
  }
  const deadVoteNote = !voter.alive
    ? "你已死亡，但仍有一次遗言票：只有投赞成才会生效，投反对不消耗。"
    : "";
  const userContent = `公开聊天（最近增量）：\n${recentChat}\n
        你的私聊记录：\n${privateChatHistory}\n
你的当前状态：${voter.alive ? "存活" : "死亡"}。
${deadVoteNote}
你的私密信息增量：${privateInfo}
你需要对提名${nominee ? nominee.name : "某玩家"}投票。若你已知邪恶队友，请谨慎投他们，除非有明确牺牲/转移视线的理由。
reason 是公开可说的一小段话，可留空；不要泄露私密信息，不要输出心理活动/内心独白，不要在括号里写心里话。
请输出 JSON：{"vote":"yes|no","reason":"一小段话或空字符串"}`;
  const prompt = buildPlayerPromptMessages(voter, "json", userContent, {
    systemPrompt: PLAYER_JSON_SYSTEM_PROMPT
  });
  try {
    const content = await callDeepSeek(prompt, Number(tempInput.value) || 1.0, voter, "json");
    const json = extractJson(content);
    if (!json) return { vote: "no", reason: "" };
    const vote = json.vote === "yes" ? "yes" : "no";
    return { vote, reason: json.reason || "" };
  } catch (error) {
    return { vote: "no", reason: "" };
  }
}

/* ─── vote resolution ────────────────────────────────────────── */

export function resolveNominationVotes() {
  const aliveCount = state.players.filter((p) => p.alive).length;
  const alivePlayers = state.players.filter((p) => p.alive);
  alivePlayers.forEach((player) => {
    if (!state.nominationVotes[player.id]) {
      recordVote(player, "no", "未投默认反对");
    }
  });
  let yesVotes = 0;
  const votingPlayers = state.players.filter(
    (p) => p.alive || (!p.alive && p.deadVoteUsed)
  );
  votingPlayers.forEach((player) => {
    let vote = state.nominationVotes[player.id]?.vote || "no";
    if (player.roleName === "管家" && !canButlerVote(player)) {
      vote = "no";
    }
    if (vote === "yes") yesVotes += 1;
  });
  const nominee = state.players.find((p) => p.id === state.currentNomineeId);
  addReplayEvent(`投票结果：赞成${yesVotes}/${aliveCount}`, "day_action");
  addPublicLogEntry(`投票结果：赞成${yesVotes}/${aliveCount}`);
  // Inject vote result bar into chat
  const pct = aliveCount > 0 ? Math.round((yesVotes / aliveCount) * 100) : 0;
  const voteBarHtml = `<div class="vote-result-bar"><span>${nominee ? nominee.name : "?"}</span><div class="vote-bar-track"><div class="vote-bar-fill" style="width:${pct}%"></div></div><span class="vote-bar-label">${yesVotes}/${aliveCount} (${pct}%)</span></div>`;
  addChat("系统", voteBarHtml, "system");
  state.currentVoterId = "";
  state.nominationInProgress = false;
  state.nominationPhase = "open";
  state.nominationStep = "";
  state.voteCountdown = 0;
  state.humanVoted = false;
  state.pendingAiVotes = 0;
  clearVoteTimer();
  hideModal();
  if (nominee) {
    if (yesVotes > state.dayHighestVotes) {
      state.dayHighestVotes = yesVotes;
      state.dayHighestNomineeId = nominee.id;
      state.dayHighestTied = false;
      addPublicLogEntry(`当前最高票：${nominee.name}（${yesVotes}票）`);
    } else if (yesVotes === state.dayHighestVotes && yesVotes > 0) {
      state.dayHighestTied = true;
      state.dayHighestNomineeId = "";
      addPublicLogEntry(`出现平票（${yesVotes}票），暂无法确定处决者`);
    } else if (state.dayHighestNomineeId) {
      const current = state.players.find((p) => p.id === state.dayHighestNomineeId);
      if (current) {
        addPublicLogEntry(`最高票仍为：${current.name}（${state.dayHighestVotes}票）`);
      }
    }
  }
  state.currentNomineeId = "";
  state.currentNominatorId = "";
  if (state.dayNominationCount >= MAX_NOMINATIONS_PER_DAY) {
    state.nominationPhase = "";
    state.nominationStep = "";
    state.currentSpeakerId = "";
    renderAll();
    finalizeDayExecution();
    return;
  }
  renderAll();
  maybeStartNextNomination();
}

/* ─── runVote (UI entry point) ───────────────────────────────── */

export async function runVote() {
  if (!state.started || state.phase !== "day" || state.dayStage !== "nomination") return;
  if (!state.currentNomineeId) {
    alert("请先完成提名。");
    return;
  }
  if (state.nominationPhase !== "voting") {
    startNominationVoting();
  }
}
