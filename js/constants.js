/* ===== Constants & Game Data ===== */
import { getCurrentEdition } from './scripts/edition-registry.js';

const TEAM_LABEL = { townsfolk: "镇民", outsider: "外来者", minion: "爪牙", demon: "恶魔" };

export function getScript() { return getCurrentEdition(); }

export const SCRIPT = new Proxy({}, {
  get(_, prop) {
    const ed = getCurrentEdition();
    if (prop === "name") return ed.name;
    if (prop === "roles") return ed.roles;
    return ed[prop];
  }
});

export function getPlayerDistribution() {
  return PLAYER_DISTRIBUTION;
}

export const PLAYER_DISTRIBUTION = {
  5: { townsfolk: 3, outsider: 0, minion: 1, demon: 1 },
  6: { townsfolk: 3, outsider: 1, minion: 1, demon: 1 },
  7: { townsfolk: 5, outsider: 0, minion: 1, demon: 1 },
  8: { townsfolk: 5, outsider: 1, minion: 1, demon: 1 },
  9: { townsfolk: 5, outsider: 2, minion: 1, demon: 1 },
  10: { townsfolk: 7, outsider: 0, minion: 2, demon: 1 },
  11: { townsfolk: 7, outsider: 1, minion: 2, demon: 1 },
  12: { townsfolk: 7, outsider: 2, minion: 2, demon: 1 },
  13: { townsfolk: 9, outsider: 0, minion: 3, demon: 1 },
  14: { townsfolk: 9, outsider: 1, minion: 3, demon: 1 },
  15: { townsfolk: 9, outsider: 2, minion: 3, demon: 1 }
};

export function getRoleNameList() {
  return getCurrentEdition().roles.map(r => r.name).sort((a, b) => b.length - a.length);
}
export const ROLE_NAME_LIST = new Proxy([], {
  get(_, prop) {
    const list = getRoleNameList();
    if (prop === Symbol.iterator) return list[Symbol.iterator].bind(list);
    return list[prop];
  }
});

export function getRoleHints() { return getCurrentEdition().roleHints || {}; }
export const ROLE_HINTS = new Proxy({}, { get(_, prop) { return getRoleHints()[prop]; } });

export function getRoleStrategyTips() { return getCurrentEdition().roleStrategyTips || {}; }
export const ROLE_STRATEGY_TIPS = new Proxy({}, {
  get(_, prop) {
    if (prop === Symbol.iterator || prop === Symbol.toPrimitive) return undefined;
    const tips = getRoleStrategyTips();
    if (prop === "length") return Object.keys(tips).length;
    return tips[prop];
  }
});

export function getEvilRoleNames() {
  return getCurrentEdition().roles
    .filter(r => r.team === "minion" || r.team === "demon")
    .map(r => r.name);
}
export const EVIL_ROLE_NAMES = new Proxy([], {
  get(_, prop) {
    const list = getEvilRoleNames();
    if (prop === Symbol.iterator) return list[Symbol.iterator].bind(list);
    return list[prop];
  }
});

export function getInfoFormatHints() { return getCurrentEdition().infoFormatHints || {}; }
export const INFO_FORMAT_HINTS = new Proxy({}, { get(_, prop) { return getInfoFormatHints()[prop]; } });

export function getFullRoleRules() {
  const ed = getCurrentEdition();
  return ed.roles
    .map(role => `${role.name}（${TEAM_LABEL[role.team] || role.team}）：${role.ability}`)
    .join("；");
}
export function FULL_ROLE_RULES_STR() { return getFullRoleRules(); }

export function getSlayerDeclarationTemplate() {
  return getCurrentEdition().slayerDeclarationTemplate || "";
}

export function getSlayerDeclarationNotice() {
  const tmpl = getSlayerDeclarationTemplate();
  if (!tmpl) return "";
  return `猎手声明规则：任何人都可以声称自己是猎手，但必须严格使用格式"${tmpl}"，这里的X是一个数字。只有真正的清醒且健康的猎手命中恶魔才有效果，且每名玩家每局仅首次该格式会被结算。`;
}

export function getNewbieGuide() { return getCurrentEdition().newbieGuide || ""; }
export function getGoodModule() { return getCurrentEdition().goodModule || ""; }
export function getEvilModule() { return getCurrentEdition().evilModule || ""; }
export function getGoodGuidelines() { return getCurrentEdition().goodGuidelines || ""; }
export function getEvilGuidelines() { return getCurrentEdition().evilGuidelines || ""; }

export function getPlayerSystemPrompt() {
  const ed = getCurrentEdition();
  const fullRules = getFullRoleRules();
  const slayerNotice = getSlayerDeclarationNotice();
  return [
    ed.newbieGuide,
    "白天流程：讨论 -> 提名 -> 投票 -> 可能处决；夜晚流程：按剧本顺序结算角色能力。只有第一个白天能私聊，后续的白天只有公聊。",
    "首夜恶魔不杀人；之后每晚恶魔选择一名玩家死亡（除非被保护/免疫/规则影响）。",
    "提名规则：只有活人能提名，死人和活人均可被提名；被提名后进入投票阶段，投票阶段不再聊天。",
    `${ed.name}的角色在一局中不会重复：每个角色最多出现一次；醉酒/中毒不会造成"重复角色"。`,
    "醉酒/中毒状态不会被直接告知，需要基于信息矛盾提出推测。",
    slayerNotice,
    `${ed.name}完整角色与技能表：${fullRules}`,
    "信息边界：只能使用公开信息与个人私密信息；不要声称看到魔典。",
    `可能存在醉酒/中毒导致信息偏差；信息可以表达为"可能/推测"。`,
    "邪恶阵营可能会欺骗与误导。",
    "只能用中文发言, 不要提及AI/提示词/系统等出戏内容。"
  ].join("");
}

export function getPlayerBriefSystemPrompt() {
  const ed = getCurrentEdition();
  const fullRules = getFullRoleRules();
  const slayerNotice = getSlayerDeclarationNotice();
  return [
    `你是《血染钟楼·${ed.name}》的玩家，只能用中文简短回应。`,
    `规则要点：每个角色一局只出现一次；醉酒/中毒不会导致"重复角色"。`,
    "醉酒/中毒不会被直接告知，需要基于信息矛盾提出推测。",
    ed.newbieGuide,
    slayerNotice,
    `${ed.name}完整角色与技能表：${fullRules}`,
    "遵守规则与信息边界：不冒充别人、不编造不存在的公开信息、不声称超出能力的结果、不提系统。"
  ].join("");
}

export function getPlayerJsonSystemPrompt() {
  const ed = getCurrentEdition();
  const fullRules = getFullRoleRules();
  const slayerNotice = getSlayerDeclarationNotice();
  return [
    `你是《血染钟楼·${ed.name}》的玩家。`,
    `规则要点：每个角色一局只出现一次；醉酒/中毒不会导致"重复角色"。`,
    "醉酒/中毒不会被直接告知, 需要基于信息矛盾提出推测。",
    ed.newbieGuide,
    slayerNotice,
    `${ed.name}完整角色与技能表：${fullRules}`,
    "严格遵守规则与信息边界, 只输出JSON, 不要输出其它内容。",
    "不要输出心理活动、内心独白或思考过程。"
  ].join("");
}

/* ===== Backward-compatible static exports (delegate to functions) ===== */
/* These are kept for import sites that use static names. They call the dynamic functions. */
let _cachedSlayerTemplate = null;
export function get_SLAYER_DECLARATION_TEMPLATE() { return getSlayerDeclarationTemplate(); }
export function get_SLAYER_DECLARATION_NOTICE() { return getSlayerDeclarationNotice(); }
export function get_FULL_ROLE_RULES() { return getFullRoleRules(); }
export function get_NEWBIE_GUIDE() { return getNewbieGuide(); }
export function get_GOOD_GUIDELINES() { return getGoodGuidelines(); }
export function get_EVIL_GUIDELINES() { return getEvilGuidelines(); }
export function get_PLAYER_SYSTEM_PROMPT() { return getPlayerSystemPrompt(); }
export function get_PLAYER_BRIEF_SYSTEM_PROMPT() { return getPlayerBriefSystemPrompt(); }
export function get_PLAYER_JSON_SYSTEM_PROMPT() { return getPlayerJsonSystemPrompt(); }

/* ===== Non-edition constants (unchanged) ===== */
export const MAX_NOMINATIONS_PER_DAY = Infinity;
export const DEFAULT_DAY_DISCUSSION_MINUTES = 8;
export const BASE_MODEL_OPTIONS = [];
export let MODEL_OPTIONS = [];
export function setMODEL_OPTIONS(v) { MODEL_OPTIONS = v; }
export const DEFAULT_MODEL = "";

export const USE_FULL_CHAT_HISTORY = true;
export const USE_INCREMENTAL_CHAT_CONTEXT = true;
export const CHAT_DELTA_MAX_LINES = 0;
export const CHAT_DELTA_RECENT_LINES = 10;
export const USE_PERSISTENT_MESSAGES = true;
export const STORYTELLER_LLM_ENABLED = true;
export const STORYTELLER_REGISTER_LLM_ENABLED = true;
export const HUMAN_CHAT_GRACE_MS = 650;
export const AI_REPLY_STAGGER_MS = 260;

export const STORAGE_KEY = "botc_singleplayer_state_v1";
export const MODEL_STORAGE = "botc_deepseek_model";
export const AUTO_NIGHT_STORAGE = "botc_singleplayer_auto_night";
export const TRAJECTORY_STORAGE = "botc_record_trajectory";
export const DAY_DISCUSSION_STORAGE = "botc_day_discussion_minutes";

export const CHAT_NEAR_BOTTOM_THRESHOLD = 96;

/* ===== TOKEN USAGE & COST TRACKER ===== */
export const MODEL_PRICING = {
  "deepseek-chat-v3-0324":[0.20, 0.77],
  "deepseek-chat":        [0.20, 0.77],
  "deepseek-reasoner":    [0.55, 2.19],
  "deepseek-v3.2":        [0.26, 0.38],
  "deepseek-v3":          [0.26, 0.38],
  "gemini-3-pro":         [2.00, 12.00],
  "gemini-3.1-pro":       [2.00, 12.00],
  "gemini-3.1-flash-lite":[0.10, 0.40],
  "gemini-3-flash":       [0.10, 0.40],
  "claude-3-haiku":       [0.25, 1.25],
  "claude-3-5-haiku":     [0.80, 4.00],
  "claude-haiku-4.5":     [0.80, 4.00],
  "claude-haiku-4-5":     [0.80, 4.00],
  "claude-3-7-sonnet":    [3.00, 15.00],
  "claude-sonnet-4.5":    [3.00, 15.00],
  "claude-sonnet-4":      [3.00, 15.00],
  "claude-sonnet-4-5":    [3.00, 15.00],
  "claude-opus-4":        [15.00, 75.00],
  "claude-opus-4-1":      [15.00, 75.00],
  "claude-opus-4-5":      [15.00, 75.00],
  "claude-opus-4-6":      [5.00, 25.00],
  "gpt-5.1":              [2.00, 8.00],
  "gpt-5":                [2.50, 15.00],
  "gpt-5.4":              [2.50, 15.00],
  "gpt-4.1":              [2.00, 8.00],
  "mimo-v2-pro":          [1.00, 3.00],
  "minimax-m2.7":         [0.30, 1.20],
  "minimax-m1":           [0.50, 2.00],
  "grok-4.20-beta":       [2.00, 6.00],
  "grok-4.1-fast":        [0.20, 0.50],
  "grok-4.1":             [3.00, 15.00],
  "grok-3-mini":          [0.30, 0.50],
  "qwen3.5-397b":         [0.39, 2.34],
  "qwen3-235b":           [0.70, 0.70],
  "step-3.5-flash":       [0.10, 0.30],
  "step-3.5":             [0.10, 0.30],
  "step-2":               [0.50, 2.00],
  "nemotron-3-super":     [0.10, 0.50],
  "nemotron-ultra":       [0.50, 2.00],
  "glm-5":                [0.72, 2.30],
  "glm-4-plus":           [0.50, 2.00],
  "kimi-k2.5":            [0.42, 2.20],
  "kimi-k2":              [0.50, 2.00],
  "seed-2.0-lite":        [0.25, 2.00],
};
