/* ===== Night Actions & Resolution ===== */
import { state, saveState } from './state.js';
import { SCRIPT, PLAYER_SYSTEM_PROMPT, PLAYER_JSON_SYSTEM_PROMPT, STORYTELLER_LLM_ENABLED, STORYTELLER_REGISTER_LLM_ENABLED, SLAYER_DECLARATION_TEMPLATE } from './constants.js';
import { getRoleById, getApparentRole, shuffle, sleep, extractJson, getPromptName, playerOptionLabel } from './utils.js';
import { callDeepSeek } from './api.js';
import { addChat, addLogEntry, addReplayEvent, formatPlayerPrivateChats } from './chat.js';
import { renderAll, renderHumanInfo } from './ui-helpers.js';
import { checkWin, switchPhase, needsHumanNightAction, isHumanActionReady, clearAutoNightTimer } from './game-logic.js';
import { getPhaseLabel, getInfoRolePlayer, formatPrivateInfoForPrompt, formatChatForPrompt, buildPlayerPromptMessages, getAliveDeadSummary } from './prompts.js';

/* Dependency injection for cross-module calls (kept for future use) */
let _deps = {};
export function setNightDeps(deps) { Object.assign(_deps, deps); }

/* ---- Lazy DOM ref for tempInput ---- */
function getTempValue() {
  const el = document.getElementById("tempInput");
  return el ? Number(el.value) || 1.0 : 1.0;
}

/* ---- Helper functions (extracted from original single-file) ---- */

function normalizeTargetName(name) {
  if (!name) return "";
  return String(name).replace(/\(真人\)/g, "").replace(/（已死亡）/g, "").trim();
}

function resolveTargetByName(name, candidates, actor) {
  if (!name || !candidates.length) return null;
  const normalized = normalizeTargetName(name);
  if (normalized === "自己" || normalized === "我" || normalized === "我自己") {
    return actor && candidates.find((p) => p.id === actor.id) ? actor : null;
  }
  return candidates.find((p) => p.name === normalized) || null;
}

function storytellerTruthBias(player) {
  const goodAlive = state.players.filter((p) => p.alive && p.team !== "minion" && p.team !== "demon").length;
  const evilAlive = state.players.filter((p) => p.alive && (p.team === "minion" || p.team === "demon")).length;
  const advantage = evilAlive - goodAlive;
  let chance = 0.5;
  if (player.team === "townsfolk" || player.team === "outsider") {
    chance += advantage > 0 ? 0.2 : -0.2;
  } else {
    chance += advantage > 0 ? -0.2 : 0.2;
  }
  return Math.random() < Math.min(0.8, Math.max(0.2, chance));
}

function getAliveNeighbors(index) {
  const total = state.players.length;
  if (!total) return [];
  const aliveIndices = state.players.map((p, i) => (p.alive ? i : -1)).filter((i) => i !== -1);
  if (aliveIndices.length <= 2) return aliveIndices.map((i) => state.players[i]);
  const pos = aliveIndices.indexOf(index);
  if (pos === -1) return [];
  const left = aliveIndices[(pos - 1 + aliveIndices.length) % aliveIndices.length];
  const right = aliveIndices[(pos + 1) % aliveIndices.length];
  return [state.players[left], state.players[right]];
}

async function aiChooseSingleTarget(actor, candidates, actionLabel, extraNote = "") {
  if (!actor || !candidates.length) return null;
  const privateInfo = formatPrivateInfoForPrompt(actor, "json", 4);
  const privateChatHistory = formatPlayerPrivateChats(actor);
  const recentChat = formatChatForPrompt(12, actor, "json");
  const aliveDeadSummary = getAliveDeadSummary();
  const targetNames = candidates.map((p) => playerOptionLabel(p)).join("、");
  const userContent = `公开聊天（最近增量）：\n${recentChat}\n
        你的私聊记录：\n${privateChatHistory}\n
${aliveDeadSummary}
你的当前状态：${actor.alive ? "存活" : "死亡"}。
你的私密信息增量：${privateInfo}
现在是夜晚，你需要执行行动：${actionLabel}。
可选目标：${targetNames}。只能从列表中选择一个目标。${extraNote || ""}
请输出 JSON：{"target":"玩家名"}`;
  const prompt = buildPlayerPromptMessages(actor, "json", userContent, {
    systemPrompt: PLAYER_JSON_SYSTEM_PROMPT
  });
  try {
    const content = await callDeepSeek(prompt, getTempValue(), actor, "json");
    const json = extractJson(content);
    const target = json ? resolveTargetByName(json.target, candidates, actor) : null;
    return target || null;
  } catch (error) {
    return null;
  }
}

async function aiChooseTwoTargets(actor, candidates, actionLabel) {
  if (!actor || candidates.length < 2) return candidates;
  const privateInfo = formatPrivateInfoForPrompt(actor, "json", 4);
  const privateChatHistory = formatPlayerPrivateChats(actor);
  const recentChat = formatChatForPrompt(12, actor, "json");
  const aliveDeadSummary = getAliveDeadSummary();
  const targetNames = candidates.map((p) => playerOptionLabel(p)).join("、");
  const userContent = `公开聊天（最近增量）：\n${recentChat}\n
        你的私聊记录：\n${privateChatHistory}\n
${aliveDeadSummary}
你的当前状态：${actor.alive ? "存活" : "死亡"}。
你的私密信息增量：${privateInfo}
现在是夜晚，你需要执行行动：${actionLabel}。
可选目标：${targetNames}。只能从列表中选择两名不同目标。
请输出 JSON：{"target1":"玩家名","target2":"玩家名"}`;
  const prompt = buildPlayerPromptMessages(actor, "json", userContent, {
    systemPrompt: PLAYER_JSON_SYSTEM_PROMPT
  });
  try {
    const content = await callDeepSeek(prompt, getTempValue(), actor, "json");
    const json = extractJson(content);
    const t1 = json ? resolveTargetByName(json.target1, candidates, actor) : null;
    const t2 = json ? resolveTargetByName(json.target2, candidates, actor) : null;
    if (t1 && t2 && t1.id !== t2.id) {
      return [t1, t2];
    }
  } catch (error) {
    return candidates.slice(0, 2);
  }
  return candidates.slice(0, 2);
}

export function getDayRuleNote() {
  if (!state || !state.started) return "";
  const notes = [];
  if (state.phase === "day" && state.dayCount === 1) {
    notes.push("首夜没有恶魔击杀，白天1无人死亡是常规规则，不要将其当作线索。");
  }
  if (state.phase === "day" && state.dayStage === "discussion" && !state.ended) {
    notes.push(`猎手声明格式：${SLAYER_DECLARATION_TEMPLATE}；不符合格式不会触发开枪。`);
  }
  return notes.join(" ");
}

export function isDroisoned(player) {
  return player.drunk || player.poisoned;
}

export function getStorytellerBalanceSummary() {
  const aliveGood = state.players.filter((p) => p.alive && p.team !== "minion" && p.team !== "demon").length;
  const aliveEvil = state.players.filter((p) => p.alive && (p.team === "minion" || p.team === "demon")).length;
  const deadGood = state.players.filter((p) => !p.alive && p.team !== "minion" && p.team !== "demon").length;
  const deadEvil = state.players.filter((p) => !p.alive && (p.team === "minion" || p.team === "demon")).length;
  const advantage = aliveEvil - aliveGood;
  const advantageText =
    advantage > 1 ? "邪恶明显优势" :
    advantage === 1 ? "邪恶小优势" :
    advantage === 0 ? "均势" :
    advantage === -1 ? "善良小优势" : "善良明显优势";
  return `存活善良 ${aliveGood} / 存活邪恶 ${aliveEvil}（${advantageText}）；死亡善良 ${deadGood} / 死亡邪恶 ${deadEvil}`;
}

export function getClaimsSummary(limit = 8) {
  if (!state || !state.claims) return "无";
  const claims = Object.values(state.claims);
  if (!claims.length) return "无";
  const sorted = claims.sort((a, b) => (a.time || "").localeCompare(b.time || ""));
  const slice = sorted.slice(-limit);
  return slice.map((entry) => `${entry.playerName}自称${entry.roleName}`).join("；");
}

export function getRelatedClaimsSummary(names) {
  if (!state || !state.claims || !Array.isArray(names) || !names.length) return "无";
  const entries = Object.values(state.claims).filter((entry) => names.includes(entry.playerName));
  if (!entries.length) return "无";
  return entries.map((entry) => `${entry.playerName}自称${entry.roleName}`).join("；");
}

export function getClaimRoleByPlayerName(playerName) {
  if (!state || !state.claims || !playerName) return "";
  const entry = Object.values(state.claims).find((item) => item.playerName === playerName);
  return entry && entry.roleName ? entry.roleName : "";
}

export function getBaronClaimSignal() {
  if (!state || !state.claims) return { level: "低", count: 0 };
  const count = Object.values(state.claims).filter((entry) => entry.roleName === "男爵").length;
  const level = count >= 2 ? "高" : count === 1 ? "中" : "低";
  return { level, count };
}

export function getRelatedPlayerTruthSummary(names) {
  if (!state || !Array.isArray(names) || !names.length) return "无";
  const parts = names.map((name) => {
    const player = state.players.find((p) => p.name === name);
    if (!player) return `${name}: 未找到`;
    const claim = getClaimRoleByPlayerName(name) || "无";
    return `${name}: 阵营=${player.team}, 真实角色=${player.roleName}, 公聊起跳=${claim}`;
  });
  return parts.length ? parts.join("；") : "无";
}

export async function storytellerChooseInfo(player, label, trueInfo, fallbackOptions, context = null) {
  const safeFallbacks = Array.isArray(fallbackOptions) ? fallbackOptions.filter(Boolean) : [];
  if (!safeFallbacks.length) {
    return { info: trueInfo, isTrue: true, source: "llm", reason: "无可用假信息" };
  }
  const balanceSummary = getStorytellerBalanceSummary();
  const aliveGood = state.players.filter((p) => p.alive && p.team !== "minion" && p.team !== "demon").length;
  const aliveEvil = state.players.filter((p) => p.alive && (p.team === "minion" || p.team === "demon")).length;
  const evilDisadvantaged = aliveEvil < aliveGood;
  const minionCount = state.players.filter((p) => p.team === "minion").length;
  const baronSignal = getBaronClaimSignal();
  const relatedNames = context && Array.isArray(context.relatedNames) ? context.relatedNames : [];
  const claimsSummary = getClaimsSummary(10);
  const relatedClaims = relatedNames.length ? getRelatedClaimsSummary(relatedNames) : "无";
  const relatedTruth = relatedNames.length ? getRelatedPlayerTruthSummary(relatedNames) : "无";
  const instruction = [
    "你是《血染钟楼》的说书人。你需要决定在玩家醉酒/中毒时，给出真实信息还是错误信息。",
    "目标：公平与体验优先，适度平衡局势。若邪恶方劣势，优先给假信息帮助邪恶；若善良方劣势，可优先给真信息。",
    "硬约束：你必须从候选中选择要展示的内容（真实信息或某一条假信息），不得自造候选外文本。",
    `规则提示：部分角色会被能力视为邪恶/爪牙/恶魔。像“陌客/间谍”这类登记形态由说书人动态决定。`,
    "错误信息策略（仅在候选集中可落地时使用，优先级低于硬约束）：",
    `1) 洗衣妇：优先“两个邪恶玩家 + 恶魔三张皮之一”。`,
    `2) 图书管理员：优先报“其中有酒鬼”，尽量覆盖一善一邪。`,
    `3) 调查员：优先“两名善良玩家 + 投毒者/红唇女郎”。`,
    "4) 厨师：假信息优先选择较小值。",
    "5) 共情者：真=2->假0；真=1->假0或2；真=0->假1。",
    "6) 占卜师：优先将真值取反（有恶魔<->没有恶魔）。",
    "7) 送葬者：若处决善良，按男爵在场舆论与爪牙数量倾向给{男爵/酒鬼/小恶魔/投毒者/红唇女郎}；若处决邪恶，优先给该玩家公聊起跳角色。",
    "8) 守鸦人：若查邪恶，优先给目标公聊起跳角色；若查善良，优先给小恶魔。",
    "若某策略结果不在候选中，请在候选里选最接近策略意图的一项。",
    "只输出 JSON，不要包含任何额外文本或标记。",
    "输出严格 JSON：{\"show\":\"...\",\"isTrue\":true|false,\"reason\":\"一小段话理由\"}"
  ].join("\n");
  const prompt = [
    { role: "system", content: instruction },
    {
      role: "user",
      content: `当前局势：${balanceSummary}\n邪恶是否劣势：${evilDisadvantaged ? "是" : "否"}（存活善良=${aliveGood}, 存活邪恶=${aliveEvil}）\n场上真实爪牙数量：${minionCount}\n男爵在场公聊舆论：${baronSignal.level}（起跳男爵人数=${baronSignal.count}）\n玩家：${player.name}（${player.team}）\n信息类型：${label}\n真实信息：${trueInfo}\n可用假信息：${safeFallbacks.join(" | ")}\n公开身份声明（最新）：${claimsSummary}\n本信息相关玩家声明：${relatedClaims}\n本信息相关玩家真相（说书人可见）：${relatedTruth}`
    }
  ];
  const attempts = [
    { responseFormat: { type: "json_object" }, extraSystem: "" },
    { responseFormat: null, extraSystem: "再次强调：只能输出 JSON 对象，不要任何额外文本。" }
  ];
  for (const attempt of attempts) {
    const messages = attempt.extraSystem
      ? [{ role: "system", content: attempt.extraSystem }, ...prompt]
      : prompt;
    try {
      const content = await callDeepSeek(messages, 0.2, null, "storyteller", false, {
        responseFormat: attempt.responseFormat
      });
      const json = extractJson(content);
      if (!json || !json.show) {
        continue;
      }
      const show = String(json.show).trim();
      if (show === trueInfo) {
        return { info: trueInfo, isTrue: true, source: "llm", reason: json.reason || "" };
      }
      if (safeFallbacks.includes(show)) {
        return { info: show, isTrue: false, source: "llm", reason: json.reason || "" };
      }
    } catch (error) {
      continue;
    }
  }
  return null;
}

export function getRandomRoleNameByTeams(teams) {
  const pool = SCRIPT.roles.filter((r) => teams.includes(r.team));
  if (!pool.length) return "";
  return pool[Math.floor(Math.random() * pool.length)].name;
}

export function normalizeRegistrationMode(roleName, rawMode) {
  const value = String(rawMode || "").trim().toLowerCase();
  if (["normal", "default", "真实", "普通"].includes(value)) return "normal";
  if (["good", "善良", "好人"].includes(value)) return "good";
  if (["minion", "爪牙"].includes(value)) return "minion";
  if (["demon", "恶魔"].includes(value)) return "demon";
  if (roleName === "间谍") return "good";
  if (roleName === "陌客") return "demon";
  return "normal";
}

export function getRoleNameFromTeamsByHint(teams, hintedName = "") {
  const hint = String(hintedName || "").trim();
  if (hint) {
    const role = SCRIPT.roles.find((r) => r.name === hint);
    if (role && teams.includes(role.team)) return role.name;
  }
  return getRandomRoleNameByTeams(teams);
}

export function getBaseRegistrationProfile(player) {
  if (!player) return { evil: false, minion: false, demon: false, roleName: "" };
  return {
    evil: player.team === "minion" || player.team === "demon",
    minion: player.team === "minion",
    demon: player.team === "demon",
    roleName: player.roleName
  };
}

export function fallbackRegistrationProfile(player) {
  const base = getBaseRegistrationProfile(player);
  if (!player) return { ...base, source: "fallback", reason: "" };
  if (player.roleName === "间谍") {
    const maskAsGood = Math.random() < 0.7;
    if (maskAsGood) {
      return {
        evil: false,
        minion: false,
        demon: false,
        roleName: getRoleNameFromTeamsByHint(["townsfolk", "outsider"]),
        source: "fallback",
        reason: "fallback:spy_good"
      };
    }
    return {
      evil: true,
      minion: true,
      demon: false,
      roleName: player.roleName,
      source: "fallback",
      reason: "fallback:spy_normal"
    };
  }
  if (player.roleName === "陌客") {
    const roll = Math.random();
    if (roll < 0.2) {
      return {
        evil: false,
        minion: false,
        demon: false,
        roleName: player.roleName,
        source: "fallback",
        reason: "fallback:hermit_normal"
      };
    }
    if (roll < 0.6) {
      return {
        evil: true,
        minion: true,
        demon: false,
        roleName: getRoleNameFromTeamsByHint(["minion"]),
        source: "fallback",
        reason: "fallback:hermit_minion"
      };
    }
    return {
      evil: true,
      minion: false,
      demon: true,
      roleName: getRoleNameFromTeamsByHint(["demon"]),
      source: "fallback",
      reason: "fallback:hermit_demon"
    };
  }
  return { ...base, source: "rule", reason: "" };
}

export async function storytellerChooseRegistrationProfile(player) {
  if (!player) return null;
  const roleName = player.roleName;
  if (roleName !== "间谍" && roleName !== "陌客") return null;
  const options = roleName === "间谍" ? "normal|good" : "normal|minion|demon";
  const instruction = [
    "你是《血染钟楼》的说书人。",
    `你需要决定该玩家在本次夜晚信息判定中的“登记形态”。`,
    "你只能从给定选项里选一个 register_as，不要输出额外文本。",
    "若角色是间谍：normal=按真实邪恶/爪牙登记；good=按善良登记并显示镇民/外来者角色。",
    "若角色是陌客：normal=按真实善良登记；minion=按爪牙登记；demon=按恶魔登记。",
    "输出严格 JSON：{\"register_as\":\"...\",\"role_name\":\"可选\",\"reason\":\"一小段话\"}"
  ].join("\n");
  const prompt = [
    { role: "system", content: instruction },
    {
      role: "user",
      content: `当前局势：${getStorytellerBalanceSummary()}\n玩家：${player.name}\n真实角色：${player.roleName}\n真实阵营：${player.team}\n可选登记：${options}\n公开声明（最新）：${getClaimsSummary(8)}`
    }
  ];
  const attempts = [
    { responseFormat: { type: "json_object" }, extraSystem: "" },
    { responseFormat: null, extraSystem: "再次强调：只能输出 JSON 对象。" }
  ];
  for (const attempt of attempts) {
    const messages = attempt.extraSystem
      ? [{ role: "system", content: attempt.extraSystem }, ...prompt]
      : prompt;
    try {
      const content = await callDeepSeek(messages, 0.2, null, "storyteller", false, {
        responseFormat: attempt.responseFormat
      });
      const json = extractJson(content);
      if (!json) continue;
      const mode = normalizeRegistrationMode(roleName, json.register_as || json.mode);
      const hintedRole = String(json.role_name || "").trim();
      const reason = String(json.reason || "").trim();
      if (roleName === "间谍") {
        if (mode === "normal") {
          return {
            evil: true,
            minion: true,
            demon: false,
            roleName: player.roleName,
            source: "llm",
            reason
          };
        }
        return {
          evil: false,
          minion: false,
          demon: false,
          roleName: getRoleNameFromTeamsByHint(["townsfolk", "outsider"], hintedRole),
          source: "llm",
          reason
        };
      }
      if (mode === "normal") {
        return {
          evil: false,
          minion: false,
          demon: false,
          roleName: player.roleName,
          source: "llm",
          reason
        };
      }
      if (mode === "minion") {
        return {
          evil: true,
          minion: true,
          demon: false,
          roleName: getRoleNameFromTeamsByHint(["minion"], hintedRole),
          source: "llm",
          reason
        };
      }
      return {
        evil: true,
        minion: false,
        demon: true,
        roleName: getRoleNameFromTeamsByHint(["demon"], hintedRole),
        source: "llm",
        reason
      };
    } catch (error) {
      continue;
    }
  }
  return null;
}

export async function buildInfoRegistrationMap() {
  const map = {};
  if (!state || !Array.isArray(state.players)) return map;
  for (const player of state.players) {
    if (!player || !player.id) continue;
    if (player.roleName !== "间谍" && player.roleName !== "陌客") {
      map[player.id] = { ...getBaseRegistrationProfile(player), source: "rule", reason: "" };
      continue;
    }
    let profile = null;
    if (STORYTELLER_REGISTER_LLM_ENABLED) {
      profile = await storytellerChooseRegistrationProfile(player);
    }
    if (!profile) {
      profile = fallbackRegistrationProfile(player);
    }
    map[player.id] = profile;
  }
  state.lastInfoRegistrationMap = map;
  return map;
}

export function getRegistrationOverride(player, registrationMap) {
  if (!player || !registrationMap || typeof registrationMap !== "object") return null;
  const item = registrationMap[player.id];
  if (!item || typeof item !== "object") return null;
  return item;
}

export function registersAsEvil(player, registrationMap = null) {
  const override = getRegistrationOverride(player, registrationMap);
  if (override && typeof override.evil === "boolean") return override.evil;
  if (!player) return false;
  if (player.roleName === "间谍") {
    return Math.random() < 0.3;
  }
  if (player.roleName === "陌客") {
    return Math.random() < 0.8;
  }
  return player.team === "minion" || player.team === "demon";
}

export function registersAsMinion(player, registrationMap = null) {
  const override = getRegistrationOverride(player, registrationMap);
  if (override && typeof override.minion === "boolean") return override.minion;
  if (!player) return false;
  if (player.roleName === "间谍") {
    return Math.random() < 0.3;
  }
  if (player.roleName === "陌客") {
    return Math.random() < 0.4;
  }
  return player.team === "minion";
}

export function registersAsDemon(player, registrationMap = null) {
  const override = getRegistrationOverride(player, registrationMap);
  if (override && typeof override.demon === "boolean") return override.demon;
  if (!player) return false;
  if (player.roleName === "陌客") {
    return Math.random() < 0.4;
  }
  return player.team === "demon";
}

export function formatSpyGrimoireEntry(player) {
  if (!player) return "";
  let label = `${player.name}:${player.roleName}`;
  if (player.drunk && player.apparentRoleName && player.apparentRoleName !== player.roleName) {
    label += `（自认为:${player.apparentRoleName}）`;
  }
  return label;
}

export function registerRoleForInfo(player, registrationMap = null) {
  const override = getRegistrationOverride(player, registrationMap);
  if (override && typeof override.roleName === "string" && override.roleName) {
    return override.roleName;
  }
  if (!player) return "";
  if (player.roleName === "陌客" && Math.random() > 0.5) {
    return getRandomRoleNameByTeams(["minion", "demon"]);
  }
  if (player.roleName === "间谍" && Math.random() > 0.5) {
    return getRandomRoleNameByTeams(["townsfolk", "outsider"]);
  }
  return player.roleName;
}

export function getMinionRoleNameForInfo(player, registrationMap = null) {
  const override = getRegistrationOverride(player, registrationMap);
  if (override && override.minion && typeof override.roleName === "string" && override.roleName) {
    return override.roleName;
  }
  if (!player) return "";
  if (player.team === "minion") {
    return player.roleName;
  }
  return getRandomRoleNameByTeams(["minion"]);
}

export function maybeAlterNumber(value, maxValue) {
  if (maxValue <= 0) return value;
  let candidate = value;
  while (candidate === value) {
    candidate = Math.floor(Math.random() * (maxValue + 1));
  }
  return candidate;
}

export function setPrivateInfo(player, text) {
  const tag = state?.phase === "night"
    ? `第${state.nightCount}晚`
    : state?.phase === "day"
      ? `第${state.dayCount}天`
      : "";
  const line = tag ? `${tag}：${text}` : text;
  player.privateInfo.push(line);
  player.memory.push(line);
  if (player.isHuman) {
    renderHumanInfo();
  }
}

export function applyPoison() {
  state.players.forEach((player) => {
    if (player.poisoned && player.poisonedUntilDay <= state.dayCount) {
      player.poisoned = false;
    }
  });
}

export function chooseRandomTarget(source, allowSelf = false, includeDead = false) {
  const candidates = state.players.filter(
    (p) => (includeDead || p.alive) && (allowSelf || p.id !== source.id)
  );
  if (!candidates.length) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function chooseTwoTargets(source) {
  const candidates = state.players.filter((p) => p.alive && p.id !== source.id);
  if (candidates.length < 2) return candidates;
  const shuffled = shuffle(candidates);
  return [shuffled[0], shuffled[1]];
}

export function recordRoleChange(player, newRoleName, reason = "") {
  if (!player || !newRoleName) return;
  if (!Array.isArray(player.roleHistory)) {
    player.roleHistory = [];
  }
  player.roleHistory.push({
    roleName: newRoleName,
    phase: getPhaseLabel(),
    night: state?.nightCount || 0,
    day: state?.dayCount || 0,
    reason: reason || ""
  });
}

export function makeRolePair(rolePlayer, excludeId = "") {
  if (!rolePlayer) return [];
  const others = state.players.filter(
    (p) => p.id !== rolePlayer.id && p.id !== excludeId
  );
  const fallback = state.players.filter((p) => p.id !== rolePlayer.id);
  const pool = others.length ? others : fallback;
  const other = pool.length ? pool[Math.floor(Math.random() * pool.length)] : rolePlayer;
  return shuffle([rolePlayer, other]).slice(0, 2);
}

export function resolveSlayerShot(shooter, target, isReal) {
  if (!shooter || !target || !shooter.alive) return;
  const registrationMap = state && state.lastInfoRegistrationMap ? state.lastInfoRegistrationMap : null;
  const canKill = Boolean(isReal && registersAsDemon(target, registrationMap) && !isDroisoned(shooter));
  addChat("说书人", `${shooter.name} 表示要开枪，目标是 ${target.name}。`, "storyteller");
  addLogEntry(`猎手射击：${shooter.name} -> ${target.name}`, "day");
  addReplayEvent(`猎手射击：${shooter.name} -> ${target.name}`, "day_action");
  if (canKill) {
    target.alive = false;
    addChat("说书人", `${target.name} 死亡。`, "storyteller");
    addLogEntry(`猎手击杀恶魔：${target.name}`, "day");
    addReplayEvent(`猎手击杀恶魔：${target.name}`, "day_action");
  } else {
    addChat("说书人", `${target.name} 并未死亡。`, "storyteller");
  }
  renderAll();
  checkWin();
}

export function useSlayerShot(shooter, target) {
  if (!shooter || !target || !shooter.alive) return;
  if (shooter.slayerUsed) return;
  shooter.slayerUsed = true;
  shooter.slayerClaimed = true;
  resolveSlayerShot(shooter, target, true);
}

export function parseSlayerDeclaration(text, shooter) {
  const raw = String(text || "").trim();
  if (!raw || !state || !Array.isArray(state.players)) {
    return { detected: false, valid: false, target: null, error: "empty" };
  }
  const compact = raw.replace(/\s+/g, "");
  if (compact.includes("要向玩家X开枪") || compact.includes("要向玩家x开枪")) {
    return { detected: false, valid: false, target: null, error: "template_echo" };
  }
  const detected = compact.includes("猎手") && compact.includes("我要向") && compact.includes("开枪");
  if (!detected) {
    return { detected: false, valid: false, target: null, error: "none" };
  }
  const match = compact.match(/我是猎手[，,]?我要向(玩家([0-9]{1,2})|自己|我自己)开枪/);
  if (!match) {
    return { detected: true, valid: false, target: null, error: "format" };
  }
  let target = null;
  if (match[2]) {
    const seat = Number(match[2]);
    if (!Number.isFinite(seat) || seat < 1 || seat > state.players.length) {
      return { detected: true, valid: false, target: null, error: "target" };
    }
    const player = state.players[seat - 1];
    if (!player || !player.alive) {
      return { detected: true, valid: false, target: null, error: "target" };
    }
    target = player;
  } else {
    if (!shooter || !shooter.alive) {
      return { detected: true, valid: false, target: null, error: "target" };
    }
    target = shooter;
  }
  return { detected: true, valid: true, target, error: "" };
}

export function maybeHandleSlayerClaim(speaker, text) {
  if (!state || !state.started || state.ended) return;
  if (state.phase !== "day" || state.dayStage !== "discussion") return;
  const shooter = state.players.find((p) => p.name === speaker);
  if (!shooter || !shooter.alive) return;
  const declaration = parseSlayerDeclaration(text, shooter);
  if (!declaration.detected) return;
  if (!declaration.valid) {
    if (declaration.error === "format") {
      addChat("说书人", `猎手声明格式不正确，本次不视为开枪。正确格式：${SLAYER_DECLARATION_TEMPLATE}`, "storyteller");
    } else {
      addChat("说书人", "猎手声明目标无效（目标不存在或已死亡），本次不视为开枪。", "storyteller");
    }
    return;
  }
  const target = declaration.target;
  if (shooter.slayerClaimed) return;
  shooter.slayerClaimed = true;
  const isReal = shooter.roleName === "猎手" && !shooter.slayerUsed;
  if (isReal) {
    shooter.slayerUsed = true;
  }
  resolveSlayerShot(shooter, target, isReal);
}

export function canButlerVote(voter) {
  if (!voter || voter.roleName !== "管家") return true;
  if (!voter.alive) return true;
  if (isDroisoned(voter)) return true;
  if (!voter.butlerMasterId) return false;
  const master = state.players.find((p) => p.id === voter.butlerMasterId);
  if (!master || !master.alive) return false;
  return Boolean(state.nominationVotes[master.id]);
}

export function resolveInfoForPlayer(player, trueInfo, fallbackOptions) {
  if (!isDroisoned(player)) return trueInfo;
  const tellTruth = storytellerTruthBias(player);
  if (tellTruth) return trueInfo;
  if (Array.isArray(fallbackOptions) && fallbackOptions.length) {
    const option = fallbackOptions[Math.floor(Math.random() * fallbackOptions.length)];
    return option;
  }
  return trueInfo;
}

export async function resolveInfoResult(player, label, trueInfo, fallbackOptions, context = null) {
  if (!isDroisoned(player)) {
    return { info: trueInfo, isTrue: true, droisoned: false, source: "none", reason: "" };
  }
  const safeFallbacks = Array.isArray(fallbackOptions) ? fallbackOptions.filter(Boolean) : [];
  if (STORYTELLER_LLM_ENABLED) {
    const decision = await storytellerChooseInfo(player, label, trueInfo, safeFallbacks, context);
    if (decision) {
      return {
        info: decision.info,
        isTrue: decision.isTrue,
        droisoned: true,
        source: decision.source || "llm",
        reason: decision.reason || ""
      };
    }
  }
  const tellTruth = storytellerTruthBias(player);
  if (tellTruth) {
    return { info: trueInfo, isTrue: true, droisoned: true, source: "heuristic", reason: "概率判定给真信息" };
  }
  let info = trueInfo;
  if (safeFallbacks.length) {
    info = safeFallbacks[Math.floor(Math.random() * safeFallbacks.length)];
  }
  return { info, isTrue: info === trueInfo, droisoned: true, source: "heuristic", reason: "概率判定给假信息" };
}

export function recordInfoAudit(player, label, trueInfo, shownInfo, isTrue, droisoned, source = "", reason = "") {
  if (!state || !player) return;
  if (!Array.isArray(state.infoAudit)) state.infoAudit = [];
  state.infoAudit.push({
    time: new Date().toISOString(),
    phase: getPhaseLabel(),
    night: state.nightCount,
    day: state.dayCount,
    player: player.name,
    label,
    trueInfo,
    shownInfo,
    isTrue: Boolean(isTrue),
    droisoned: Boolean(droisoned),
    decisionSource: source || "",
    decisionReason: reason || ""
  });
}

export function recordInfoDistortion(player, label, trueInfo, shownInfo) {
  if (!player) return;
  if (isDroisoned(player) && shownInfo !== trueInfo) {
    addReplayEvent(`信息失真：${player.name} ${label} | 真实：${trueInfo} | 告知：${shownInfo}`, "info_error");
  }
}

export function recordFirstNightRecognition() {
  const totalPlayers = state.players.length;
  const demons = state.players.filter((p) => p.team === "demon");
  const minions = state.players.filter((p) => p.team === "minion");
  const blockedRoleNames = new Set();
  state.players.forEach((player) => {
    if (player.roleName) blockedRoleNames.add(player.roleName);
    if (player.apparentRoleName) blockedRoleNames.add(player.apparentRoleName);
  });
  const bluffPool = SCRIPT.roles.filter(
    (r) =>
      (r.team === "townsfolk" || r.team === "outsider") &&
      !blockedRoleNames.has(r.name) &&
      r.name !== "酒鬼"
  );
  const bluffs = shuffle(bluffPool).slice(0, 3).map((r) => r.name);
  demons.forEach((demon) => {
    setPrivateInfo(demon, `三个不在场身份：${bluffs.join(" / ") || "无"}`);
  });
  if (totalPlayers >= 7) {
    demons.forEach((demon) => {
      setPrivateInfo(demon, `你看到爪牙：${minions.map((m) => m.name).join("、") || "无"}`);
    });
    minions.forEach((minion) => {
      setPrivateInfo(minion, `你看到恶魔：${demons.map((d) => d.name).join("、") || "无"}`);
      const others = minions.filter((m) => m.id !== minion.id).map((m) => m.name);
      setPrivateInfo(minion, `你看到爪牙：${others.join("、") || "无"}`);
    });
  }
  state.firstNightRecognitionDone = true;
}

export async function resolveNight() {
  if (!state.started || state.phase !== "night") return;
  if (state.paused) return;
  if (needsHumanNightAction() && !isHumanActionReady()) {
    addChat("系统", "请先确认你的夜晚行动。", "system");
    return;
  }
  clearAutoNightTimer();
  try {
    if (state.nightCount === 1 && !state.firstNightRecognitionDone) {
      recordFirstNightRecognition();
    }
    applyPoison();
    state.players.forEach((p) => {
      p.protected = false;
    });

    const human = state.players.find((p) => p.isHuman);
    const demon = state.players.find((p) => p.team === "demon" && p.alive);
    const poisoner = state.players.find((p) => p.roleName === "投毒者" && p.alive);
    const monk = state.players.find((p) => p.roleName === "僧侣" && p.alive);
    const butler = state.players.find((p) => p.roleName === "管家" && p.alive);
    const fortuneTeller = getInfoRolePlayer("占卜师");
    const empath = getInfoRolePlayer("共情者");
    const chef = getInfoRolePlayer("厨师");
    const washerwoman = getInfoRolePlayer("洗衣妇");
    const librarian = getInfoRolePlayer("图书管理员");
    const investigator = getInfoRolePlayer("调查员");
    const undertaker = getInfoRolePlayer("送葬者");
    const ravenkeeper = getInfoRolePlayer("守鸦人");
    const spy = getInfoRolePlayer("间谍");
    const infoRegistrationMap = await buildInfoRegistrationMap();

    if (poisoner) {
    let target = null;
    if (human && human.roleName === "投毒者" && state.humanActionTarget) {
      target = state.players.find((p) => p.id === state.humanActionTarget);
    } else {
      const candidates = state.players.slice();
      target = await aiChooseSingleTarget(poisoner, candidates, "投毒一名玩家（今晚与明天白天中毒）");
      if (!target) target = chooseRandomTarget(poisoner, true, true);
    }
    if (target) {
      target.poisoned = true;
      target.poisonedUntilDay = state.dayCount + 1;
      addReplayEvent(`投毒者选择 ${poisoner.name} -> ${target.name}`, "night_action");
    }
  }

    if (monk && state.nightCount > 1) {
    let target = null;
    if (human && human.roleName === "僧侣" && state.humanActionTarget) {
      target = state.players.find((p) => p.id === state.humanActionTarget);
    } else {
      const candidates = state.players.filter((p) => p.alive && p.id !== monk.id);
      target = await aiChooseSingleTarget(monk, candidates, "守护一名玩家（免受恶魔能力）");
      if (!target) target = chooseRandomTarget(monk, false);
    }
    if (target) {
      const monkDisabled = isDroisoned(monk);
      if (!monkDisabled) {
        target.protected = true;
        addReplayEvent(`僧侣保护 ${monk.name} -> ${target.name}`, "night_action");
      } else {
        addReplayEvent(`僧侣保护失效（中毒/醉酒）：${monk.name} -> ${target.name}`, "night_action");
      }
    }
  }

    let demonTarget = null;
    if (demon && state.nightCount > 1) {
    if (demon.demonCooldownNight === state.nightCount) {
      addReplayEvent(`新恶魔当夜无法出刀：${demon.name}`, "night_action");
    } else {
      if (human && human.roleName === "小恶魔" && state.humanActionTarget) {
        demonTarget = state.players.find((p) => p.id === state.humanActionTarget);
      } else {
        const candidates = state.players.slice();
        const minions = state.players.filter((p) => p.alive && p.team === "minion");
        const extraNote = minions.length
          ? "你可以选择自己以自杀传位，但一般谨慎使用。"
          : "请不要选择自己自杀（场上无存活爪牙会导致直接失败）。";
        demonTarget = await aiChooseSingleTarget(demon, candidates, "选择一名玩家死亡（恶魔击杀）", extraNote);
        if (!demonTarget) demonTarget = chooseRandomTarget(demon, true, true);
      }
      if (demonTarget) {
        addReplayEvent(`恶魔选择 ${demon.name} -> ${demonTarget.name}`, "night_action");
      }
    }
  }

    if (chef && state.nightCount === 1) {
    let pairs = 0;
    for (let i = 0; i < state.players.length; i += 1) {
      const next = (i + 1) % state.players.length;
      if (registersAsEvil(state.players[i], infoRegistrationMap) && registersAsEvil(state.players[next], infoRegistrationMap)) {
        pairs += 1;
      }
    }
    const truth = `${pairs} 对相邻邪恶玩家`;
    const result = await resolveInfoResult(chef, "厨师信息", truth, [
      "0 对相邻邪恶玩家",
      "1 对相邻邪恶玩家",
      "2 对相邻邪恶玩家"
    ]);
    setPrivateInfo(chef, `厨师信息：${result.info}`);
    recordInfoAudit(chef, "厨师信息", truth, result.info, result.isTrue, result.droisoned, result.source, result.reason);
    recordInfoDistortion(chef, "厨师信息", truth, result.info);
  }

    if (washerwoman && state.nightCount === 1) {
    const townsfolkInPlay = state.players.filter((p) => p.team === "townsfolk");
    const townsfolkCandidates = townsfolkInPlay.filter((p) => p.id !== washerwoman.id);
    const chosen =
      townsfolkCandidates[Math.floor(Math.random() * townsfolkCandidates.length)];
    const rolePlayer = chosen || townsfolkCandidates[0] || townsfolkInPlay[0];
    const pair = makeRolePair(rolePlayer, washerwoman.id);
    const truth = pair.length === 2
      ? `${pair[0].name} 或 ${pair[1].name} 是 ${chosen.roleName}`
      : `${rolePlayer.name} 是 ${chosen.roleName}`;
    const relatedNames = pair.map((p) => p.name);
    const fakeRole = SCRIPT.roles.find((r) => r.team === "townsfolk" && !townsfolkInPlay.some((p) => p.roleId === r.id));
    const fakePlayers = shuffle(state.players.filter((p) => p.id !== washerwoman.id)).slice(0, 2);
    const fake = fakeRole ? `${fakePlayers[0].name} 或 ${fakePlayers[1].name} 是 ${fakeRole.name}` : truth;
    const result = await resolveInfoResult(washerwoman, "洗衣妇信息", truth, [fake], { relatedNames });
    setPrivateInfo(washerwoman, `洗衣妇信息：${result.info}`);
    recordInfoAudit(washerwoman, "洗衣妇信息", truth, result.info, result.isTrue, result.droisoned, result.source, result.reason);
    recordInfoDistortion(washerwoman, "洗衣妇信息", truth, result.info);
  }

    if (librarian && state.nightCount === 1) {
    const outsidersInPlay = state.players.filter((p) => p.team === "outsider");
    const outsiderRoles = SCRIPT.roles.filter((r) => r.team === "outsider");
    let chosenOutsider = null;
    let truth = "没有外来者在场";
    let relatedNames = [];
    if (outsidersInPlay.length) {
      chosenOutsider = outsidersInPlay[Math.floor(Math.random() * outsidersInPlay.length)];
      const rolePlayer = chosenOutsider || outsidersInPlay[0];
      const pair = makeRolePair(rolePlayer, librarian.id);
      truth = pair.length === 2
        ? `${pair[0].name} 或 ${pair[1].name} 是 ${chosenOutsider.roleName}`
        : `${rolePlayer.name} 是 ${chosenOutsider.roleName}`;
      relatedNames = pair.map((p) => p.name);
    }
    let fake = "";
    if (outsiderRoles.length) {
      let fakeRolePool = outsiderRoles;
      if (chosenOutsider && outsiderRoles.length > 1) {
        fakeRolePool = outsiderRoles.filter((r) => r.name !== chosenOutsider.roleName);
      }
      const fakeRole = fakeRolePool[Math.floor(Math.random() * fakeRolePool.length)];
      const baseCandidates = state.players.filter((p) => p.id !== librarian.id);
      let fakeCandidates = baseCandidates.filter((p) => p.roleId !== fakeRole.id);
      if (fakeCandidates.length < 2) {
        fakeCandidates = baseCandidates;
      }
      const fakePair = shuffle(fakeCandidates).slice(0, 2);
      if (fakePair.length === 2) {
        fake = `${fakePair[0].name} 或 ${fakePair[1].name} 是 ${fakeRole.name}`;
      }
    }
    const fallbacks = fake ? [fake] : [];
    const result = await resolveInfoResult(librarian, "图书管理员信息", truth, fallbacks, { relatedNames });
    setPrivateInfo(librarian, `图书管理员信息：${result.info}`);
    recordInfoAudit(librarian, "图书管理员信息", truth, result.info, result.isTrue, result.droisoned, result.source, result.reason);
    recordInfoDistortion(librarian, "图书管理员信息", truth, result.info);
  }

    if (investigator && state.nightCount === 1) {
    const minionsInPlay = state.players.filter((p) => registersAsMinion(p, infoRegistrationMap));
    const minionRoles = SCRIPT.roles.filter((r) => r.team === "minion").map((r) => r.name);
    let truth = "没有爪牙在场";
    let relatedNames = [];
    if (minionsInPlay.length) {
      const chosen = minionsInPlay[Math.floor(Math.random() * minionsInPlay.length)];
      const pair = makeRolePair(chosen, investigator.id);
      const roleName = getMinionRoleNameForInfo(chosen, infoRegistrationMap);
      truth = `${pair[0].name} 或 ${pair[1].name} 是 ${roleName}`;
      relatedNames = pair.map((p) => p.name);
    }
    let fake = "没有爪牙在场";
    if (minionsInPlay.length) {
      const fakeRolePool = minionRoles.filter((name) => name !== truth.split(" 是 ").pop());
      const fakeRole = fakeRolePool.length
        ? fakeRolePool[Math.floor(Math.random() * fakeRolePool.length)]
        : (minionRoles[0] || "爪牙");
      const fakePlayers = shuffle(state.players.filter((p) => p.id !== investigator.id)).slice(0, 2);
      if (fakePlayers.length === 2) {
        fake = `${fakePlayers[0].name} 或 ${fakePlayers[1].name} 是 ${fakeRole}`;
      } else {
        fake = truth;
      }
    } else if (minionRoles.length) {
      const fakePlayers = shuffle(state.players.filter((p) => p.id !== investigator.id)).slice(0, 2);
      if (fakePlayers.length === 2) {
        fake = `${fakePlayers[0].name} 或 ${fakePlayers[1].name} 是 ${minionRoles[0]}`;
      }
    }
    const result = await resolveInfoResult(investigator, "调查员信息", truth, [fake], { relatedNames });
    setPrivateInfo(investigator, `调查员信息：${result.info}`);
    recordInfoAudit(investigator, "调查员信息", truth, result.info, result.isTrue, result.droisoned, result.source, result.reason);
    recordInfoDistortion(investigator, "调查员信息", truth, result.info);
  }

    let killed = null;
    if (state.nightCount > 1 && demonTarget && demonTarget.alive) {
    const targetRole = getRoleById(demonTarget.roleId);
    if (targetRole && targetRole.name === "镇长" && !isDroisoned(demonTarget) && Math.random() > 0.5) {
      const alternatives = state.players.filter(
        (p) => p.alive && p.id !== demonTarget.id && p.team !== "minion" && p.team !== "demon"
      );
      if (alternatives.length) {
        addReplayEvent(`镇长替死触发，目标从 ${demonTarget.name} 转移`, "night_action");
        demonTarget = alternatives[Math.floor(Math.random() * alternatives.length)];
      }
    }
    if (demon && demonTarget.id === demon.id) {
      const minions = state.players.filter((p) => p.alive && p.team === "minion");
      if (minions.length) {
        const successor = minions[Math.floor(Math.random() * minions.length)];
        const demonRole = SCRIPT.roles.find((r) => r.team === "demon");
        successor.team = "demon";
        successor.roleId = demonRole.id;
        successor.roleName = demonRole.name;
        successor.apparentRoleId = demonRole.id;
        successor.apparentRoleName = demonRole.name;
        successor.demonCooldownNight = state.nightCount;
        recordRoleChange(successor, demonRole.name, "恶魔传位");
        addReplayEvent(`恶魔传位：${successor.name} 当夜不出刀`, "night_action");
      }
      demonTarget.alive = false;
      killed = demonTarget;
    } else {
      const soldierImmune = targetRole && targetRole.name === "士兵" && !isDroisoned(demonTarget);
      const protectedKill = demonTarget.protected || soldierImmune;
      if (!protectedKill) {
        demonTarget.alive = false;
        killed = demonTarget;
      } else {
        addReplayEvent(`恶魔击杀失败（被保护/士兵）目标：${demonTarget.name}`, "night_action");
      }
    }
  }

    if (ravenkeeper && killed && ravenkeeper.id === killed.id) {
    let target = null;
    if (human && human.roleName === "守鸦人") {
      target = chooseRandomTarget(ravenkeeper, true);
    } else {
      const candidates = state.players.filter((p) => p.alive);
      target = await aiChooseSingleTarget(ravenkeeper, candidates, "守鸦人选择一名玩家得知其角色");
      if (!target) target = chooseRandomTarget(ravenkeeper, true);
    }
    if (target) {
      const registeredRole = registerRoleForInfo(target, infoRegistrationMap);
      const result = await resolveInfoResult(
        ravenkeeper,
        "守鸦人信息",
        registeredRole,
        SCRIPT.roles.map((r) => r.name),
        { relatedNames: [target.name] }
      );
      setPrivateInfo(ravenkeeper, `守鸦人信息：${target.name} 是 ${result.info}`);
      recordInfoAudit(ravenkeeper, "守鸦人信息", registeredRole, result.info, result.isTrue, result.droisoned, result.source, result.reason);
      recordInfoDistortion(ravenkeeper, "守鸦人信息", registeredRole, result.info);
    }
  }

    if (empath && empath.alive) {
    const neighbors = getAliveNeighbors(state.players.indexOf(empath));
    const evilCount = neighbors.filter((p) => registersAsEvil(p, infoRegistrationMap)).length;
    const truth = `${evilCount}`;
    const result = await resolveInfoResult(empath, "共情者信息", truth, ["0", "1", "2"]);
    setPrivateInfo(empath, `共情者信息：相邻邪恶人数 ${result.info}`);
    recordInfoAudit(empath, "共情者信息", truth, result.info, result.isTrue, result.droisoned, result.source, result.reason);
    recordInfoDistortion(empath, "共情者信息", truth, result.info);
  }

    if (fortuneTeller && fortuneTeller.alive) {
    let targets = [];
    const humanApparent = human ? getApparentRole(human) : null;
    if (human && humanApparent && humanApparent.name === "占卜师" && state.humanActionTarget2) {
      const t1 = state.players.find((p) => p.id === state.humanActionTarget);
      const t2 = state.players.find((p) => p.id === state.humanActionTarget2);
      targets = [t1, t2].filter(Boolean);
    } else {
      const candidates = state.players.filter((p) => p.alive && p.id !== fortuneTeller.id);
      targets = await aiChooseTwoTargets(fortuneTeller, candidates, "占卜两名玩家（判断是否有恶魔）");
      if (targets.length < 2) targets = chooseTwoTargets(fortuneTeller);
    }
    const demonHit = targets.some(
      (t) => t && (t.team === "demon" || t.id === state.redHerringId || registersAsDemon(t, infoRegistrationMap))
    );
    const truth = demonHit ? "有恶魔" : "没有恶魔";
    const result = await resolveInfoResult(
      fortuneTeller,
      "占卜师信息",
      truth,
      [demonHit ? "没有恶魔" : "有恶魔"],
      { relatedNames: targets.map((t) => t.name) }
    );
    setPrivateInfo(
      fortuneTeller,
      `占卜师信息：${targets.map((t) => t.name).join(" 与 ")} -> ${result.info}`
    );
    recordInfoAudit(fortuneTeller, "占卜师信息", truth, result.info, result.isTrue, result.droisoned, result.source, result.reason);
    recordInfoDistortion(fortuneTeller, "占卜师信息", truth, result.info);
  }

    if (butler && butler.alive) {
    let target = null;
    if (human && human.roleName === "管家" && state.humanActionTarget) {
      target = state.players.find((p) => p.id === state.humanActionTarget);
    } else {
      const candidates = state.players.filter((p) => p.alive && p.id !== butler.id);
      target = await aiChooseSingleTarget(butler, candidates, "选择一名主人（次日你只能随他投票）");
      if (!target) target = chooseRandomTarget(butler, false);
    }
    if (target) {
      butler.butlerMasterId = target.id;
      setPrivateInfo(butler, `你今晚的侍从对象：${target.name}`);
      addReplayEvent(`管家选择 ${butler.name} -> ${target.name}`, "night_action");
    } else {
      butler.butlerMasterId = "";
    }
  }

    if (undertaker && undertaker.alive && state.lastExecutedId) {
    const executed = state.players.find((p) => p.id === state.lastExecutedId);
    if (executed) {
      const registeredRole = registerRoleForInfo(executed, infoRegistrationMap);
      const result = await resolveInfoResult(
        undertaker,
        "送葬者信息",
        registeredRole,
        SCRIPT.roles.map((r) => r.name),
        { relatedNames: [executed.name] }
      );
      setPrivateInfo(undertaker, `送葬者信息：${executed.name} 是 ${result.info}`);
      recordInfoAudit(undertaker, "送葬者信息", registeredRole, result.info, result.isTrue, result.droisoned, result.source, result.reason);
      recordInfoDistortion(undertaker, "送葬者信息", registeredRole, result.info);
    }
  }

    if (spy && spy.alive) {
    const grimoire = state.players.map((p) => formatSpyGrimoireEntry(p)).join("、");
    setPrivateInfo(spy, `魔典：${grimoire}`);
    const auditEntries = (state.infoAudit || []).filter((entry) => entry.night === state.nightCount);
    if (auditEntries.length) {
      const auditText = auditEntries
        .map((entry) => {
          const status = entry.isTrue ? "正确" : "错误";
          const tag = entry.droisoned ? "（醉酒/中毒）" : "";
          return `${entry.player} ${entry.label} = ${entry.shownInfo}（真实：${entry.trueInfo}，${status}）${tag}`;
        })
        .join("；");
      setPrivateInfo(spy, `信息审计：${auditText}`);
    } else {
      setPrivateInfo(spy, "信息审计：无");
    }
  }

    const storytellerPrompt = [
    {
      role: "system",
      content: "你是血染钟楼的说书人。请输出 JSON，不要输出其它内容。narration 要求 2-3 句、戏剧化、暗黑风格，不泄露任何身份或私密信息；publicAnnouncement 要求一小段简短公开信息。"
    },
    {
      role: "user",
      content: `当前剧本：暗流涌动。
夜晚${state.nightCount}刚结束。
今晚死亡：${killed ? killed.name : "无人"}。
请输出 JSON：
{\"narration\":\"夜晚叙述\",\"publicAnnouncement\":\"白天公开信息\"}`
    }
  ];
    let narration = "";
    let publicAnnouncement = "";
    try {
      const content = await callDeepSeek(storytellerPrompt, getTempValue());
      const json = extractJson(content);
      if (json) {
        narration = json.narration || "";
        publicAnnouncement = json.publicAnnouncement || "";
      } else {
        narration = content;
      }
    } catch (error) {
      narration = `夜晚结束。${killed ? killed.name + " 死亡。" : ""}`;
      publicAnnouncement = narration;
    }
    state.lastDawnNarration = narration || publicAnnouncement || "";
    if (narration) addChat("说书人", narration, "storyteller");
    if (publicAnnouncement) addChat("说书人", publicAnnouncement, "storyteller");
    addLogEntry(`夜晚死亡：${killed ? killed.name : "无人"}`, "night");
    addReplayEvent(`夜晚死亡：${killed ? killed.name : "无人"}`, "night_action");
    renderAll();
    checkWin();
    if (!state.ended) {
      switchPhase();
    }
  } catch (error) {
    console.error("[Night] resolveNight failed:", error);
    addChat("系统", `夜晚结算异常：${error?.message || error}。已尝试继续流程。`, "system");
    addLogEntry(`夜晚结算异常：${error?.message || error}`, "system");
    renderAll();
    if (state && state.started && !state.ended && state.phase === "night") {
      switchPhase();
    }
  }
}
