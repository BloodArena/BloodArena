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
  PLAYER_DISTRIBUTION,
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
  getPromptSpeakerName,
  stripHtmlForPrompt
} from './utils.js';
import { callDeepSeek, commitSessionMessages } from './api.js';

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
  return `目前的存活玩家：${alive || "无"}\n目前的死亡玩家：${dead || "无"}`;
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
  const count = state.players.length;
  const dist = PLAYER_DISTRIBUTION[count];
  const distLine = dist
    ? `本局配置：${count}人局（${dist.townsfolk}镇民 + ${dist.outsider}外来者 + ${dist.minion}爪牙 + ${dist.demon}恶魔）`
    : `本局配置：${count}人局`;
  const lines = [
    prefix,
    `你是：${actor.name}`,
    `玩家座次：${roster}`,
    distLine,
    "注意：若有男爵在场，会+2外来者、-2镇民。",
    `你的身份：${roleName}`,
    `你的角色类型：${teamLabel[apparentRole?.team || actor.team] || "未知"}`,
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
  const n = state.players.length;
  const list = state.players.map((p, idx) => `${idx + 1}号=${getPromptName(p)}`).join("，");
  return `${list}（座位围成一圈，比如1号的左右两边是${n}号和2号）`;
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

/* ================================================================
 *  Session compression — runs at end of each day for AI players
 * ================================================================ */

const TEAM_LABEL_COMPRESS = { townsfolk: "镇民", outsider: "外来者", minion: "爪牙", demon: "恶魔" };

export async function compressPlayerSessions(player) {
  if (!player || !state) return;
  if (player.isHuman) return; // skip human players

  const sessionKey = "chat";
  const session = player.messageSessions && player.messageSessions[sessionKey];
  if (!session) return;

  const systemMsgs = session.filter((msg) => msg.role === "system");

  const apparentRole = getApparentRole(player);
  const roleName = apparentRole ? apparentRole.name : "未知";
  const isEvil = player.team === "minion" || player.team === "demon";
  const aliveDeadSummary = getAliveDeadSummary();

  const dayLabel = `白天${state.dayCount}`;
  const prevNightLabel = `夜晚${state.nightCount}`;

  const todayChat = state.chat.filter((entry) => entry.phase === dayLabel || entry.phase === prevNightLabel);
  const chatSection = todayChat.length
    ? todayChat.map((entry) => `[${entry.phase}] ${entry.speaker}: ${stripHtmlForPrompt(entry.text || "")}`).join("\n")
    : "无";

  const privateInfoSection = Array.isArray(player.privateInfo) && player.privateInfo.length
    ? player.privateInfo.join("\n")
    : "无";

  const myPrivateChats = (state.privateChat || []).filter((c) => c.senderId === player.id || c.targetId === player.id);
  const privateChatSection = myPrivateChats.length
    ? myPrivateChats.map((c) => {
        const label = c.senderId === player.id ? ("你 -> " + c.target) : (c.sender + " -> 你");
        return `[私聊] ${label}: ${c.text}`;
      }).join("\n")
    : "无";

  const evilChatSection = (state.evilChat || []).length && isEvil
    ? state.evilChat.map((c) => `[邪恶密聊] ${c.sender}: ${c.text}`).join("\n")
    : "无";

  const historyText = `【公共聊天记录】\n${chatSection}\n\n【你的私密信息】\n${privateInfoSection}\n\n【私聊记录】\n${privateChatSection}\n\n【邪恶密聊记录】\n${evilChatSection}`;

  if (todayChat.length === 0 && myPrivateChats.length === 0) return;

  let summarySystemContent;
  if (isEvil) {
    const evilTeammates = state.players
      .filter((p) => p.id !== player.id && (p.team === "minion" || p.team === "demon"))
      .map((p) => `${p.name}（${TEAM_LABEL_COMPRESS[p.team] || p.team}）`)
      .join("、");
    summarySystemContent = [
      "你是《血染钟楼》的一名玩家，正在进行一场重要的对局。",
      `你是${player.name}，身份是${roleName}，属于邪恶阵营。`,
      `${aliveDeadSummary}`,
      `你的邪恶队友：${evilTeammates || "无"}`,
      "现在白天结束了，你需要写一份总结备忘录。这份总结必须完整、准确、具体。",
      "这份总结只有你能够看到，不会给别的玩家看。",
      "要求：",
      "- 区分【事实】（确实发生的事）和【推测】（你的分析判断）",
      "- 记录要具体，不要笼统概括",
      "- 站在邪恶阵营的视角思考——你的目标是保护恶魔存活、误导好人",
      "可以参考以下结构总结，可以视具体游戏记录而有所调整，也完全可以添加你想记录的别的内容：",
      "1.【身份声明登记】",
      "逐一列出每位玩家今天声称的身份、提供的具体信息内容。标注哪些是真的好人，哪些是你的队友在伪装。",
      "2.【我方伪装状态】",
      "- 我声称的身份是什么？编造了哪些假信息？",
      "- 队友声称的身份是什么？",
      "- 我方的伪装是否前后一致？有没有人质疑或追问？有没有露出破绽？",
      "- 后续需要补充哪些细节来圆谎？",
      "3.【死亡与处决记录】",
      "- 昨晚谁死了？（如果你是恶魔或知道击杀目标）",
      "- 今天都有哪些提名？谁提名的谁？票型和票数如何？",
      "- 今天有人被处决吗？是谁？",
      "- 这些结果对我方有利还是不利？",
      "4.【威胁评估】",
      "按威胁程度排序，列出对邪恶阵营最危险的存活好人：",
      "- 谁的能力最强？（例如占卜师、共情者、送葬者等能持续产出信息的角色，以及贞洁者、僧侣等技能强的角色等）",
      "- 谁的推理最准确、最接近真相？",
      "- 谁在群众中信任度最高、带节奏能力最强？",
      "5.【好人当前推理方向】",
      "- 好人目前怀疑谁是恶魔？怀疑谁是爪牙？",
      "- 这个方向对我方是否有利？",
      "- 有没有好人在内斗或互相怀疑？可以利用吗？",
      "6.【下一步行动计划】",
      "- 我和队友下一步怎么配合？",
      "- 该推动处决谁来转移视线或消灭威胁？",
      "- 如果你是恶魔，请思考今晚恶魔应该杀谁？（优先消灭哪个能力强/推理准/受信任的好人）",
      "- 发言策略：下一次讨论要怎么带节奏？",
      "只输出总结内容，不要输出其他任何内容。"
    ].join("\n");
  } else {
    summarySystemContent = [
      "你是《血染钟楼》的一名玩家，正在进行一场重要的对局。",
      `你是${player.name}，身份是${roleName}，属于善良阵营。`,
      `${aliveDeadSummary}`,
      "现在白天结束了，你需要写一份总结备忘录。这份总结必须完整、准确、具体。",
      "这份总结只有你能够看到，不会给别的玩家看。",
      "要求：",
      "- 区分【事实】（确实发生的事）和【推测】（你的分析判断），不要把推测当事实记录",
      "- 记录要具体，不要笼统概括（例如不要写‘有人声称是洗衣妇'，要写'张三声称是洗衣妇，表示看到李四和王五中有一个厨师'）",
      "可以参考以下结构总结，可以视具体游戏记录而有所调整，也完全可以添加你想记录的别的内容：",
      "1.【身份声明登记】",
      "逐一列出每位玩家今天声称的身份、提供的具体信息内容。未发言或未跳身份的也标注‘未表态’。",
      "2.【我的私密信息汇总】",
      "你自己获得的所有技能结果和私密信息，按时间顺序整理。",
      "3.【死亡与处决记录】",
      "- 昨晚谁死了？（夜杀）",
      "- 今天都有哪些提名？谁提名的谁？票型和票数如何？",
      "- 今天有人被处决吗？是谁？",
      "4.【矛盾与疑点分析】",
      "- 哪些玩家的信息互相矛盾？具体矛盾点是什么？",
      "- 谁的声明与已知事实不符？",
      "- 有没有身份被重复声称（撞车）的情况？",
      "5.【嫌疑评估】",
      "根据当前所有信息，列出你对每个存活玩家的信任度判断：",
      "- 哪些玩家大概率可信？为什么？",
      "- 哪些玩家值得怀疑？为什么？",
      "- 哪些玩家疑似恶魔或者爪牙？为什么？",
      "6.【明日行动计划】",
      "- 明天应该重点追问谁？追问什么？",
      "- 应该推动提名谁？",
      "- 自己下一步该怎么发言？（是否亮明身份、是否分享更多信息等）",
      "只输出总结内容，不要输出其他任何内容。"
    ].join("\n");
  }

  const summaryPrompt = [
    { role: "system", content: summarySystemContent },
    { role: "user", content: `请总结你（${player.name}）截至白天${state.dayCount}结束的游戏记录：\n\n${historyText}` }
  ];

  try {
    const content = await callDeepSeek(summaryPrompt, 0.3, player, "summary", false);
    const summaryText = (content || "").trim();
    if (!summaryText) return;

    const summaryMsg = { role: "system", content: `[白天${state.dayCount}结束时的游戏进程总结]\n${summaryText}` };

    session.length = 0;
    session.push(...systemMsgs);
    session.push(summaryMsg);
    markActorPromptCursors(player, sessionKey);

    // Clean up summary session
    if (player.messageSessions && player.messageSessions["summary"]) {
      player.messageSessions["summary"] = [];
    }
  } catch (_) {}
}

export async function compressDaySessions() {
  if (!state || !state.players) return;
  const aiPlayers = state.players.filter(p => !p.isHuman);
  await Promise.all(aiPlayers.map(p => compressPlayerSessions(p)));
}
