/**
 * engine.js — Pure Node.js game engine for Blood on the Clocktower benchmark.
 * Extracted from the frontend js/ modules with all DOM dependencies removed.
 */

const { callLLM, sleep } = require('./llm');
const config = require('./config');
const { mulberry32, seededShuffle } = require('./schedule');

/* ═══════════════════════════════════════════════════════════
 *  SECTION 1: CONSTANTS (from js/constants.js)
 * ═══════════════════════════════════════════════════════════ */

const SCRIPT = {
  name: "暗流涌动",
  roles: [
    {"id":"1_22","name":"洗衣妇","team":"townsfolk","ability":"在你的首个夜晚，你会得知两名玩家和一个镇民角色：这两名玩家之一是该角色。"},
    {"id":"1_21","name":"图书管理员","team":"townsfolk","ability":"在你的首个夜晚，你会得知两名玩家和一个外来者角色：这两名玩家之一是该角色（或者你会得知没有外来者在场）。"},
    {"id":"1_20","name":"调查员","team":"townsfolk","ability":"在你的首个夜晚，你会得知两名玩家和一个爪牙角色：这两名玩家之一是该角色（或者你会得知没有爪牙在场）。"},
    {"id":"1_19","name":"厨师","team":"townsfolk","ability":"在你的首个夜晚，你会得知场上邻座的邪恶玩家有多少对。"},
    {"id":"1_18","name":"共情者","team":"townsfolk","ability":"每个夜晚，你会得知与你邻近（即左右两边）的两名存活的玩家中邪恶玩家的数量。"},
    {"id":"1_17","name":"占卜师","team":"townsfolk","ability":"每个夜晚，你要选择两名玩家：你会得知他们之中是否有恶魔。会有一名善良玩家始终被你的能力当作恶魔(干扰项)。"},
    {"id":"1_16","name":"送葬者","team":"townsfolk","ability":"每个夜晚（不包含首夜），你会得知今天白天死于处决的玩家的角色。"},
    {"id":"1_15","name":"僧侣","team":"townsfolk","ability":"每个夜晚（不包含首夜），你要选择除你以外的一名玩家：当晚恶魔的负面能力对他无效。"},
    {"id":"1_14","name":"守鸦人","team":"townsfolk","ability":"如果你在夜晚死亡，你会被唤醒，然后你要选择一名玩家：你会得知他的角色。"},
    {"id":"1_13","name":"贞洁者","team":"townsfolk","ability":"当你首次被提名时，如果提名你的玩家是镇民，他立刻被处决。"},
    {"id":"1_12","name":"猎手","team":"townsfolk","ability":"每局游戏限一次，你可以在白天时公开选择一名玩家：如果他是恶魔，他死亡。"},
    {"id":"1_11","name":"士兵","team":"townsfolk","ability":"恶魔的负面能力对你无效。"},
    {"id":"1_10","name":"镇长","team":"townsfolk","ability":"如果只有三名玩家存活且白天没有人被处决，你的阵营获胜（镇长日）。如果你在夜晚即将死亡，可能会有一名其他玩家代替你死亡。"},
    {"id":"1_9","name":"管家","team":"outsider","ability":"每个夜晚，你要选择除你以外的一名玩家(主人)：明天白天，只有他投票时你才能投票。"},
    {"id":"1_8","name":"酒鬼","team":"outsider","ability":"你不知道你是酒鬼。你以为你是一个镇民角色，但其实你不是。"},
    {"id":"1_7","name":"陌客","team":"outsider","ability":"你可能会被当作邪恶阵营、爪牙角色或恶魔角色，即使你已死亡。"},
    {"id":"1_6","name":"圣徒","team":"outsider","ability":"如果你死于处决，你的阵营落败。"},
    {"id":"1_5","name":"投毒者","team":"minion","ability":"每个夜晚，你要选择一名玩家：他在当晚和明天白天中毒。"},
    {"id":"1_4","name":"间谍","team":"minion","ability":"每个夜晚，你能查看魔典。你可能会被当作善良阵营，镇民角色或外来者角色，即使你已死亡。"},
    {"id":"1_3","name":"红唇女郎","team":"minion","ability":"如果大于等于五名玩家存活时（旅行者不计算在内）恶魔死亡，你变成那个恶魔。"},
    {"id":"1_2","name":"男爵","team":"minion","ability":"会有额外的外来者在场。[+2 外来者]"},
    {"id":"1_1","name":"小恶魔","team":"demon","ability":"每个夜晚（不包含首夜），你要选择一名玩家：他死亡。如果你以这种方式自杀，一名爪牙会变成小恶魔。"}
  ]
};

const PLAYER_DISTRIBUTION = {
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

const ROLE_NAME_LIST = SCRIPT.roles.map(r => r.name).sort((a, b) => b.length - a.length);

const ROLE_HINTS = {
  "洗衣妇": "首夜得知两名玩家与一个镇民角色：其中一人是该角色。",
  "图书管理员": "首夜得知两名玩家与一个外来者角色，其中一人是该外来者；或得知没有外来者。",
  "调查员": "首夜得知两名玩家与一个爪牙角色：其中一人是该爪牙。",
  "厨师": "首夜得知相邻邪恶玩家的对数（可能受陌客/间谍影响）。",
  "共情者": "每晚得知相邻（即左右两边）存活玩家中的邪恶人数（0/1/2）。",
  "占卜师": "占卜师：每晚选两人得知是否有恶魔；有一名好人会被视为恶魔（干扰项）。",
  "送葬者": "每个夜晚（不包含首夜）若白天有人被处决，得知其角色。",
  "僧侣": "每个夜晚（不包含首夜）选择一名其他玩家，使其当晚不会被恶魔刀死。",
  "守鸦人": "若夜晚死亡，被唤醒查一名玩家的角色。",
  "贞洁者": "首次被提名且提名者为镇民时，提名者被处决。",
  "猎手": "每局限一次，白天公开选择一名玩家；若其为恶魔则其死亡。",
  "士兵": "不会死于恶魔的刀。",
  "镇长": "仅剩3人且白天无人处决时善良获胜（镇长日）；夜晚可能替死。",
  "管家": "每晚选主人；次日若不与主人同票则无法投票。",
  "酒鬼": "以为自己是某个镇民，但实际不是；技能一定失效，信息可能错误。",
  "陌客": "可能被当作爪牙/恶魔；阵营可能被视为邪恶（即使你已死亡）。",
  "圣徒": "若被处决，善良阵营立刻失败。",
  "投毒者": "每晚选择一名玩家中毒，今晚与明天白天其技能一定失效，信息可能错误。",
  "间谍": "每晚可查看魔典；可能被视为善良阵营的镇民或外来者（即使死亡）。",
  "红唇女郎": "若存活玩家人数>=5且小恶魔死亡，你成为小恶魔。",
  "男爵": "游戏中多出2名外来者（替掉2个镇民）。",
  "小恶魔": "每晚（不包含首夜）选择一名玩家，他死亡；若自杀则一名爪牙成为小恶魔。"
};

const ROLE_STRATEGY_TIPS = {
  "洗衣妇": "建立确认链，避免首日直接点名，可先软报或私聊核实；信息已公开或自身价值不高时可考虑接受处决。",
  "图书管理员": "关注外来者数量与男爵可能；可用来定位酒鬼；信息已公开或自身价值不高时可考虑接受处决。",
  "调查员": "优先处理命中对中的高危爪牙（投毒者/红唇女郎）；信息已公开或自身价值不高时可考虑接受处决。",
  "厨师": "数字0/1/2用于座位拓扑推理；注意陌客/间谍带来的偏差；信息已公开或自身价值不高时可考虑接受处决。",
  "共情者": "可逐步处决邻座扩展探测范围，且易成为投毒目标。",
  "占卜师": "注意干扰项，结合交叉查验与排除法锁定恶魔。",
  "送葬者": "用于验证别人跳的身份与酒鬼，尽量保持存活。",
  "贞洁者": "找白板镇民提名自证，但代价高需择机。",
  "猎手": "保留威慑力；空枪也能排除目标（若清醒）。",
  "僧侣": "优先保护强信息位；平安夜不一定等于守对。",
  "士兵": "可诱导恶魔空刀；也常被恶魔假跳。",
  "守鸦人": "需要晚上死亡才能触发，可伪装高威胁善良身份骗刀。",
  "镇长": "可推进到三人且无处决获胜；替死可能暴露身份。",
  "圣徒": "尽早声明避免被误处决，可用送葬者/猎手验证假圣徒。",
  "陌客": "污染信息，可考虑尽早被处决以减少对信息的干扰。",
  "酒鬼": "信息冲突时考虑自己是酒鬼，结合外来者数量判断。",
  "管家": "选择可信主人保持票权，可视局势而定。",
  "投毒者": "重点毒强信息位；可毒贞洁者/猎手/送葬者来干扰。",
  "间谍": "利用魔典协助恶魔跳身份，必要时借贞洁者自证。",
  "红唇女郎": "保持低调，恶魔死后接刀为小恶魔；存活人数>=5时恶魔可更大胆。",
  "男爵": "扰乱外来者数量，可自爆吸引火力或伪装外来者。",
  "小恶魔": "优先击杀强信息位。必要时可以自杀传刀给爪牙。"
};

const TEAM_LABEL = { townsfolk: "镇民", outsider: "外来者", minion: "爪牙", demon: "恶魔" };
const FULL_ROLE_RULES = SCRIPT.roles.map(r => `${r.name}（${TEAM_LABEL[r.team] || r.team}）：${r.ability}`).join("；");
const SLAYER_DECLARATION_TEMPLATE = "我是猎手，我要向玩家X开枪";
const SLAYER_DECLARATION_NOTICE = `猎手声明规则：任何人都可以声称自己是猎手，但必须严格使用格式"${SLAYER_DECLARATION_TEMPLATE}"，这里的X是一个数字。只有真正的清醒且健康的猎手命中恶魔才有效果，且每名玩家每局仅首次该格式会被结算。`;
const USE_FULL_CHAT_HISTORY = true;
const USE_INCREMENTAL_CHAT_CONTEXT = true;
const CHAT_DELTA_MAX_LINES = 0;
const CHAT_DELTA_RECENT_LINES = 10;
const USE_PERSISTENT_MESSAGES = true;

const EVIL_ROLE_NAMES = SCRIPT.roles.filter(r => r.team === "minion" || r.team === "demon").map(r => r.name);

const NEWBIE_GUIDE = [
  `你正在游玩《血染钟楼·暗流涌动》，这是一款进阶版社交推理游戏，可理解为"每个人都有独特超能力的狼人杀"。`,
  `核心机制是"死而不僵"和"信息迷雾"：死人仍可参与讨论且拥有一票死人票；醉酒与中毒会让技能一定失效，信息则可能错误，需要逻辑验证。`,
  "游戏分为善良与邪恶阵营。镇民和外来者属于善良阵营，爪牙和恶魔属于邪恶阵营。善良阵营的获胜条件是处决恶魔，或触发善良阵营特殊的胜利机制（如镇长日）；邪恶阵营的获胜条件是让场上仅剩两名存活玩家且恶魔存活，或触发善良阵营特殊的失败机制（比如圣徒被处决）。",
  "夜晚：有夜行技能的人被唤醒获得线索/执行行动，其余玩家闭眼睡觉。",
  "白天：说书人公布昨夜死亡的玩家（不公布身份），所有人自由发言交换信息。第一个白天可以私聊和公聊，后续的白天只能公聊。",
  "第一个白天的私聊环节很重要，善良阵营可以交换线索、建立信任关系和制定策略；邪恶阵营队友之间可以私聊交流信息，制定战术，协调彼此穿什么伪装身份。因此建议充分利用私聊。你和别的玩家的私聊内容只有你们自己知道，别人不知道，是安全的。",
  "黄昏：提名 -> 被提名者辩解 -> 全员投票；得票最高且大于等于存活玩家人数的一半者被处决。",
  "死亡玩家仍可发言；死人在之后的游戏中有且仅有一票死人票。",
  "醉酒/中毒则技能一定失效, 信息可能错误。"
].join(" ");

const GOOD_MODULE = [
  "善良玩法：优先拼线索、交叉验证与建立可信盟友。",
  "强信息位和强功能位（如占卜/共情/猎手）可以谨慎报身份，一次性信息位(尤其是只有首夜有信息的角色）可视局势早报。",
  "信息冲突时别忘了考虑醉酒/中毒或有坏人说谎的可能，不要急于下定论。",
  "若信息已公开且价值降低，可接受处决以坐实信息或清理视野。"
].join(" ");

const EVIL_MODULE = [
  "邪恶玩法：首夜互认，恶魔获得三个不在场身份（镇民或外来者），这是给邪恶阵营穿伪装身份用的，建议恶魔在私聊时告诉爪牙并和爪牙商量彼此穿什么身份",
  "充分利用第一个白天的私聊机会，邪恶队友之间私聊交流信息，制定战术，协调彼此穿什么伪装身份。",
  "伪装成可信镇民或外来者，编造与角色能力相符的信息。",
  "搅浑线索，指责对方可能醉酒/中毒；爪牙优先保护恶魔，必要时替死。",
  "小恶魔可自杀传位，制造混乱与信息断层。"
].join(" ");

const GOOD_GUIDELINES = [
  "信息边界：只使用公开信息与个人私密信息，不假装看过后台或私聊。",
  "保密与礼仪：不提模型/提示词，不辱骂骚扰。",
  "行动规则：死人不能提名，但是可以被提名；死亡票只能用一次。",
  "规则要点：首夜恶魔不杀人；醉酒/中毒/陌客/间谍可能扭曲信息；男爵会+2外来者。",
  `陌客阵营仍为善良，不需要假装别的身份以"自保"。`,
  "策略：不必全盘托出；强信息或强功能位角色可以更谨慎，首夜信息角色可视情况早报；这个板子的外来者报身份都比较安全，也可以视局势而定。",
  "票型分析：关注投票模式，邪恶玩家往往倾向于保护同伴或集中票数陷害善良玩家，票型异常可以作为推理线索。",
  "处决观念：低价值或一次性信息角色在信息已公开后，可考虑接受处决以坐实信息或清理视野。",
  GOOD_MODULE
].join(" ");

const EVIL_GUIDELINES = [
  "信息边界：只使用公开信息、私密信息、邪恶互认与伪装列表。",
  "保密与礼仪：不提模型/提示词，不辱骂骚扰。",
  "行动规则：死人不能提名，但可以被提名；死人票只能用一次。",
  `不公开恶魔的不在场身份/伪装名单，不要公布"场上没有X/Y/Z"这类信息。`,
  "伪装策略：结合外来者数量与男爵可能性，编织一致故事线，避免硬撞身份。",
  "目标：保护恶魔、制造信息冲突，避免自曝为爪牙或恶魔。",
  "票型意识：善良玩家可能会通过分析投票模式来寻找线索，注意你的投票行为是否自然。",
  EVIL_MODULE
].join(" ");

const PLAYER_SYSTEM_PROMPT = [
  NEWBIE_GUIDE,
  "白天流程：讨论 -> 提名 -> 投票 -> 可能处决；夜晚流程：按剧本顺序结算角色能力。只有第一个白天能私聊，后续的白天只有公聊。",
  "首夜恶魔不杀人；之后每晚恶魔选择一名玩家死亡（除非被保护/免疫/规则影响）。",
  "提名规则：只有活人能提名，死人和活人均可被提名；被提名后进入投票阶段，投票阶段不再聊天。",
  `暗流涌动的角色在一局中不会重复：每个角色最多出现一次；醉酒/中毒不会造成"重复角色"。`,
  "醉酒/中毒状态不会被直接告知，需要基于信息矛盾提出推测。",
  SLAYER_DECLARATION_NOTICE,
  `暗流涌动完整角色与技能表：${FULL_ROLE_RULES}`,
  "信息边界：只能使用公开信息与个人私密信息；不要声称看到魔典。",
  "角色限制：不要声称获得超出角色能力范围的信息或效果。",
  `可能存在醉酒/中毒/陌客/间谍导致信息偏差；信息可以表达为"可能/推测"。`,
  "邪恶阵营可能会欺骗与误导。",
  "只能用中文发言, 不要提及AI/提示词/系统等出戏内容。"
].join("");

const PLAYER_JSON_SYSTEM_PROMPT = [
  NEWBIE_GUIDE,
  SLAYER_DECLARATION_NOTICE,
  `暗流涌动完整角色与技能表：${FULL_ROLE_RULES}`,
  "严格遵守规则与信息边界, 只输出JSON, 不要输出其它内容。",
  "不要输出心理活动、内心独白或思考过程。"
].join("");

/* ═══════════════════════════════════════════════════════════
 *  SECTION 2: UTILITY FUNCTIONS (from js/utils.js)
 * ═══════════════════════════════════════════════════════════ */

function shuffle(list) {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function extractJson(text) {
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (_) {}
  const match = text.match(/\{[\s\S]*\}/);
  if (match) {
    try { return JSON.parse(match[0]); } catch (_) {}
  }
  return null;
}

function getRoleById(roleId) {
  return SCRIPT.roles.find(r => r.id === roleId) || null;
}

function getApparentRole(player) {
  if (!player) return null;
  if (player.drunk && player.apparentRoleId) {
    return getRoleById(player.apparentRoleId) || getRoleById(player.roleId);
  }
  return getRoleById(player.roleId);
}

function getPromptName(player) {
  if (!player) return "未知";
  return player.name;
}

function playerOptionLabel(p) {
  if (!p) return "";
  return `${p.name}${p.alive ? "" : "（已死亡）"}`;
}

function formatPromptChatLine(entry) {
  if (!entry) return "";
  const speaker = entry.speaker || "未知";
  const text = stripHtmlForPrompt(entry.text || "");
  return `${speaker}: ${text}`;
}

function stripHtmlForPrompt(text) {
  if (!text) return "";
  return String(text).replace(/<[^>]*>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').trim();
}

function isEvilSelfReveal(player, text) {
  if (!player || !text) return false;
  if (player.team !== "minion" && player.team !== "demon") return false;
  const content = String(text);
  return EVIL_ROLE_NAMES.some(roleName => {
    const pattern = new RegExp(`(我是|我就是|我才是|我其实是)\\s*${roleName}`);
    return pattern.test(content);
  });
}

function normalizeTargetName(name) {
  if (!name) return "";
  return String(name).replace(/\(真人\)/g, "").replace(/（已死亡）/g, "").replace(/\s+/g, "").trim();
}

function resolveTargetByName(name, candidates, actor) {
  const normalized = normalizeTargetName(name);
  if (!normalized || !candidates) return null;
  return candidates.find(p => p.name === normalized && (!actor || p.id !== actor.id)) ||
         candidates.find(p => p.name === normalized) || null;
}

/* ═══════════════════════════════════════════════════════════
 *  SECTION 3: STATE & PROMPT BUILDING (from js/state.js, js/prompts.js)
 * ═══════════════════════════════════════════════════════════ */

function emptyPlayer(index) {
  return {
    id: `p${index + 1}`,
    name: `玩家${index + 1}`,
    roleId: "", roleName: "", apparentRoleId: "", apparentRoleName: "",
    team: "", alive: true, isHuman: false,
    drunk: false, poisoned: false, poisonedUntilDay: 0, protected: false,
    virginUsed: false, slayerUsed: false, slayerClaimed: false,
    demonCooldownNight: 0, butlerMasterId: "",
    deadVoteUsed: false, modelChoice: "default",
    lastPrivateDay: 0, publicChatCursorBySession: {},
    privateInfoCursorBySession: {}, messageSessions: {},
    roleHistory: [], memory: [], privateInfo: [],
    model: ""  // benchmark: the OpenRouter model ID for this player
  };
}

function createGameState() {
  return {
    players: [], started: false, ended: false, paused: false,
    phase: "night", dayStage: "discussion",
    dayCount: 0, nightCount: 0,
    discussionOrder: [], discussionCursor: 0, discussionPassed: [],
    currentSpeakerId: "", lastExecutedId: "",
    currentNomineeId: "", currentNominatorId: "",
    nominationPhase: "", nominationStep: "",
    nominationVotes: {}, nominationUsedIds: [], nomineeUsedIds: [],
    nominationInProgress: false, scarletTriggered: false,
    dayNominationCount: 0, dayHighestVotes: 0,
    dayHighestNomineeId: "", dayHighestTied: false,
    pendingNominationQueue: [], pendingAiNominations: 0,
    humanNominationDone: false,
    firstNightRecognitionDone: false,
    redHerringId: "",
    chatSeq: 0, chat: [], privateChat: [],
    log: [], publicLog: [], replayEvents: [],
    infoAudit: [], lastInfoRegistrationMap: {},
    claims: {}, claimHistory: [],
    tokenUsage: {}, trajectoryLog: [],
    postGameChat: false, lastDawnNarration: "",
    winner: null, winCondition: null,
    progress: {
      mode: config.progressMode || "concise",
      gameId: "",
      llmCalls: 0
    }
  };
}

function getProgressRank(mode) {
  return { concise: 1, balanced: 2, detailed: 3 }[mode] || 1;
}

function isProgressEnabled(state, level = "concise") {
  const current = state?.progress?.mode || config.progressMode || "concise";
  return getProgressRank(current) >= getProgressRank(level);
}

function getProgressPrefix(state) {
  const gameId = state?.progress?.gameId || "game";
  return `    [${gameId}]`;
}

function progressLog(state, level, message) {
  if (!isProgressEnabled(state, level)) return;
  console.log(`${getProgressPrefix(state)} ${message}`);
}

function getUsageSnapshot(state) {
  const entries = Object.values(state.tokenUsage || {});
  return entries.reduce((acc, item) => {
    acc.calls += item.calls || 0;
    acc.tokens += item.totalTokens || 0;
    acc.cost += item.cost || 0;
    return acc;
  }, { calls: 0, tokens: 0, cost: 0 });
}

// --- Logging helpers (pure memory, no DOM) ---

function addChat(state, speaker, text, type = "player") {
  if (state.dayStage === "nomination" && type === "player" &&
      !["reason", "defense"].includes(state.nominationPhase) && !state.postGameChat) {
    return;
  }
  const nextSeq = (state.chatSeq || 0) + 1;
  state.chatSeq = nextSeq;
  state.chat.push({
    time: new Date().toISOString(),
    phase: getPhaseLabel(state),
    speaker, type, text, seq: nextSeq
  });
  // Slayer claim detection hook
  if (type === "player") {
    maybeHandleSlayerClaim(state, speaker, text);
  }
}

function addLogEntry(state, text, type = "note") {
  state.log.push({ time: new Date().toISOString(), phase: getPhaseLabel(state), type, text });
}

function addReplayEvent(state, text, type = "note") {
  state.replayEvents.push({ time: new Date().toISOString(), phase: getPhaseLabel(state), type, text });
}

function addPublicLogEntry(state, text) {
  if (!Array.isArray(state.publicLog)) state.publicLog = [];
  state.publicLog.push({ time: new Date().toISOString(), phase: getPhaseLabel(state), text });
}

function addPrivateChat(state, sender, target, text) {
  const senderPlayer = state.players.find(p => p.name === sender);
  const targetPlayer = state.players.find(p => p.name === target);
  state.privateChat.push({
    time: new Date().toISOString(), phase: getPhaseLabel(state),
    sender, target,
    senderId: senderPlayer ? senderPlayer.id : "",
    targetId: targetPlayer ? targetPlayer.id : "",
    text
  });
}

function setPrivateInfo(state, player, info) {
  if (!player || !info) return;
  if (!Array.isArray(player.privateInfo)) player.privateInfo = [];
  player.privateInfo.push(info);
}

function recordRoleChange(player, newRoleName, reason) {
  if (!player) return;
  if (!Array.isArray(player.roleHistory)) player.roleHistory = [];
  player.roleHistory.push({ roleName: newRoleName, reason });
}

// --- Prompt helpers ---

function getAliveDeadSummary(state) {
  const alive = state.players.filter(p => p.alive).map(p => getPromptName(p)).join("、");
  const dead = state.players.filter(p => !p.alive).map(p => getPromptName(p)).join("、");
  return `目前的存活玩家：${alive || "无"}\n目前的死亡玩家：${dead || "无"}`;
}

function getPhaseLabel(state) {
  if (!state) return "未开局";
  if (state.ended) return "已结束";
  if (!state.started) return "未开局";
  if (state.phase === "night") return `夜晚${state.nightCount}`;
  return `白天${state.dayCount}`;
}

function buildPromptRoster(state) {
  const n = state.players.length;
  const list = state.players.map((p, idx) => `${idx + 1}号=${getPromptName(p)}`).join("，");
  return `${list}（座位围成一圈，比如1号的左右两边是${n}号和2号）`;
}

function getTeamGuidelines(player) {
  if (!player) return "";
  if (player.team === "minion" || player.team === "demon") return EVIL_GUIDELINES;
  return GOOD_GUIDELINES;
}

function getStrategyTips(player) {
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
    if (strongInfo.includes(roleName)) tips.push("你是强信息角色，别在第一天过早自曝。");
    else if (firstNightInfo.includes(roleName)) tips.push("你是首夜信息角色，可以较早报身份与信息，但可保留不确定性。");
    if (player?.team === "outsider") tips.push("外来者是否自曝取决于局势与信息价值，权衡能否帮到团队再决定。");
  }
  if (player && !player.alive) tips.push("你已死亡：仍可发言，但不能提名；仅有一次遗言票。");
  if (player?.privateInfo?.some(line => line.includes("三个不在场身份"))) tips.push("你知道不在场身份，挑一个伪装。");
  if (roleName && ROLE_STRATEGY_TIPS[roleName]) tips.push(ROLE_STRATEGY_TIPS[roleName]);
  return tips.join(" ");
}

function summarizeChatEntriesForPrompt(entries) {
  if (!entries.length) return "无";
  const speakerCounts = new Map();
  entries.forEach(entry => {
    const speaker = entry?.speaker || "系统";
    speakerCounts.set(speaker, (speakerCounts.get(speaker) || 0) + 1);
  });
  const topSpeakers = Array.from(speakerCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name, count]) => `${name}(${count})`)
    .join("、");
  return `较早新增公共发言 ${entries.length} 条，主要发言者：${topSpeakers || "无"}`;
}

function getSessionCursorKey(sessionKey) {
  const raw = String(sessionKey || "default").trim();
  return raw || "default";
}

function getMessageSession(actor, sessionKey) {
  if (!actor) return null;
  if (!actor.messageSessions || typeof actor.messageSessions !== "object") {
    actor.messageSessions = {};
  }
  const key = sessionKey || "default";
  if (!Array.isArray(actor.messageSessions[key])) {
    actor.messageSessions[key] = [];
  }
  return actor.messageSessions[key];
}

function dedupeSystemMessages(session, messages) {
  if (!session || !session.length) return messages.slice();
  return messages.filter((msg) => {
    if (msg.role !== "system") return true;
    return !session.some((m) => m.role === "system" && m.content === msg.content);
  });
}

function buildSessionMessages(actor, sessionKey, messages) {
  if (!USE_PERSISTENT_MESSAGES || !actor) {
    return { finalMessages: messages, session: null, newMessages: messages };
  }
  const session = getMessageSession(actor, sessionKey);
  const newMessages = dedupeSystemMessages(session, messages);
  return {
    finalMessages: session.concat(newMessages),
    session,
    newMessages
  };
}

function markActorPromptCursors(state, actor, sessionKey = "default") {
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

function commitSessionMessages(state, actor, sessionKey, messages, assistantContent) {
  if (!actor) return;
  if (USE_PERSISTENT_MESSAGES) {
    const session = getMessageSession(actor, sessionKey);
    const newMessages = dedupeSystemMessages(session, messages);
    if (newMessages.length) session.push(...newMessages);
    session.push({ role: "assistant", content: assistantContent });
  }
  markActorPromptCursors(state, actor, sessionKey);
}

function buildPlayerStaticSystemContext(state, actor, options = {}) {
  if (!actor) return "";
  const apparentRole = getApparentRole(actor);
  const roleName = apparentRole ? apparentRole.name : "未知";
  const roleAbility = apparentRole ? apparentRole.ability : "无";
  const roleHint = apparentRole ? (ROLE_HINTS[apparentRole.name] || "无") : "无";
  const guidelines = getTeamGuidelines(actor);
  const strategyTips = getStrategyTips(actor);
  const roster = buildPromptRoster(state);
  const campLabel = (actor.team === "minion" || actor.team === "demon") ? "邪恶阵营" : "善良阵营";
  const count = state.players.length;
  const dist = PLAYER_DISTRIBUTION[count];
  const distLine = dist
    ? `本局配置：${count}人局（${dist.townsfolk}镇民 + ${dist.outsider}外来者 + ${dist.minion}爪牙 + ${dist.demon}恶魔）`
    : `本局配置：${count}人局`;
  const lines = [
    options.prefix || "玩家静态档案（会话内长期有效）",
    `你是：${actor.name}`,
    `玩家座次：${roster}`,
    distLine,
    "注意：若有男爵在场，会+2外来者、-2镇民。",
    `你的身份：${roleName}`,
    `你的角色类型：${TEAM_LABEL[apparentRole?.team || actor.team] || "未知"}`,
    `你的阵营：${campLabel}`,
    `你的角色能力：${roleAbility}`,
    `规则提示：${roleHint}`
  ];
  if (options.includeStrategy) lines.push(`策略建议：${strategyTips}`);
  if (options.includeGuidelines !== false) lines.push(`阵营准则：${guidelines}`);
  return lines.join("\n");
}

function buildPlayerPromptMessages(state, actor, sessionKey, userContent, options = {}) {
  const systemPrompt = options.systemPrompt || PLAYER_SYSTEM_PROMPT;
  const staticContext = buildPlayerStaticSystemContext(state, actor, options);
  const messages = [{ role: "system", content: systemPrompt }];
  if (staticContext) messages.push({ role: "system", content: staticContext });
  messages.push({ role: "user", content: userContent });
  return messages;
}

function formatChatForPrompt(state, limit = 12, actor = null, sessionKey = "default") {
  const effectiveLimit = USE_FULL_CHAT_HISTORY ? null : limit;
  const fullSlice = effectiveLimit ? state.chat.slice(-effectiveLimit) : state.chat.slice();
  if (!USE_INCREMENTAL_CHAT_CONTEXT || !actor) {
    if (!fullSlice.length) return "无";
    return fullSlice.map(entry => formatPromptChatLine(entry)).join("\n");
  }
  if (!actor.publicChatCursorBySession || typeof actor.publicChatCursorBySession !== "object") {
    actor.publicChatCursorBySession = {};
  }
  const key = getSessionCursorKey(sessionKey);
  const cursorRaw = actor.publicChatCursorBySession[key];
  const cursor = Number.isFinite(cursorRaw) ? cursorRaw : 0;
  const unseen = state.chat.filter(entry => (Number(entry.seq) || 0) > cursor);
  if (!unseen.length) {
    return "无新增公共发言（你已看过当前全部公开发言）";
  }
  if (CHAT_DELTA_MAX_LINES <= 0 || unseen.length <= CHAT_DELTA_MAX_LINES) {
    return unseen.map(entry => formatPromptChatLine(entry)).join("\n");
  }
  const recentCount = Math.max(1, CHAT_DELTA_RECENT_LINES);
  const older = unseen.slice(0, Math.max(0, unseen.length - recentCount));
  const recent = unseen.slice(-recentCount);
  const olderSummary = summarizeChatEntriesForPrompt(older);
  return `${olderSummary}\n最近新增：\n${recent.map(entry => formatPromptChatLine(entry)).join("\n")}`;
}

function formatPrivateInfoForPrompt(actor, sessionKey = "default", limit = 4) {
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

function formatPlayerPrivateChats(state, actor) {
  if (!actor) return "无";
  const all = (state.privateChat || []).filter(item => item.senderId === actor.id || item.targetId === actor.id);
  if (!all.length) return "无";
  return all.map(c => {
    const label = c.senderId === actor.id ? ("你 -> " + c.target) : (c.sender + " -> 你");
    return "[私聊] " + label + ": " + c.text;
  }).join("\n");
}

function isPrivateChatOpen(state) {
  if (!state.started || state.ended) return false;
  if (state.phase !== "day") return false;
  if (state.dayCount !== 1) return false;
  if (state.dayStage === "nomination") return false;
  return true;
}

// --- Token tracking ---

function recordTokenUsage(state, model, usage) {
  if (!usage) return;
  const key = model || "unknown";
  if (!state.tokenUsage[key]) {
    state.tokenUsage[key] = { promptTokens: 0, completionTokens: 0, totalTokens: 0, calls: 0, cost: 0 };
  }
  const u = state.tokenUsage[key];
  u.promptTokens += usage.promptTokens || 0;
  u.completionTokens += usage.completionTokens || 0;
  u.totalTokens += usage.totalTokens || 0;
  u.calls += 1;
  u.cost += usage.cost || 0;
}

function recordTrajectoryEntry(state, actor, sessionKey, model, messages, responseText, reasoningText = "") {
  state.trajectoryLog.push({
    time: new Date().toISOString(),
    phase: getPhaseLabel(state),
    day: state.dayCount, night: state.nightCount,
    actor: actor ? actor.name : "说书人",
    actorId: actor ? actor.id : "storyteller",
    sessionKey: sessionKey || "default",
    model: model || "",
    messages: JSON.parse(JSON.stringify(messages || [])),
    response: responseText || "",
    reasoning_content: reasoningText || ""
  });
}

/* ═══════════════════════════════════════════════════════════
 *  SECTION 4: LLM WRAPPER + GAME INIT (from js/api.js, js/game-logic.js)
 * ═══════════════════════════════════════════════════════════ */

/**
 * Unified LLM call for benchmark. Wraps callLLM with token tracking.
 * @param {object} state - Game state
 * @param {Array} messages - Chat messages
 * @param {number} temperature - Temperature
 * @param {object|null} actor - Player object (null for storyteller)
 * @param {string} sessionKey - Session key for trajectory
 * @returns {string} LLM response content
 */
async function callPlayerLLM(state, messages, temperature, actor, sessionKey = "default") {
  const model = actor ? actor.model : config.storytellerModel;
  const apiModel = actor
    ? (actor.apiModel || actor.model)
    : (config.storytellerApiModel || config.storytellerModel);
  const sessionPayload = buildSessionMessages(actor, sessionKey, messages);
  const actorName = actor ? actor.name : "说书人";
  const phaseLabel = getPhaseLabel(state);
  const nextCallNumber = (state.progress?.llmCalls || 0) + 1;
  const startedAt = Date.now();
  let heartbeat = null;

  if (state.progress) {
    state.progress.llmCalls = nextCallNumber;
  }

  if (isProgressEnabled(state, "detailed")) {
    progressLog(state, "detailed", `LLM #${nextCallNumber} start | ${phaseLabel} | ${actorName} | session=${sessionKey} | api=${apiModel}`);
  }
  if (isProgressEnabled(state, "balanced")) {
    heartbeat = setInterval(() => {
      const elapsed = Math.round((Date.now() - startedAt) / 1000);
      progressLog(state, "balanced", `LLM #${nextCallNumber} waiting ${elapsed}s | ${phaseLabel} | ${actorName} | api=${apiModel}`);
    }, 10000);
  }
  try {
    const result = await callLLM(sessionPayload.finalMessages, apiModel, temperature);
    recordTokenUsage(state, model, result.usage);
    if (actor) {
      commitSessionMessages(state, actor, sessionKey, messages, result.content);
    }
    recordTrajectoryEntry(state, actor, sessionKey, model, sessionPayload.newMessages, result.content, result.reasoning);
    const last = state.trajectoryLog[state.trajectoryLog.length - 1];
    if (last) last.apiModel = apiModel;
    if (heartbeat) clearInterval(heartbeat);

    const elapsedMs = Date.now() - startedAt;
    const usage = getUsageSnapshot(state);
    progressLog(
      state,
      "balanced",
      `LLM #${nextCallNumber} done in ${(elapsedMs / 1000).toFixed(1)}s | ${actorName} | api=${apiModel} | total calls=${usage.calls} tokens=${usage.tokens} cost=$${usage.cost.toFixed(3)}`
    );
    if (isProgressEnabled(state, "detailed")) {
      const preview = (result.content || "").replace(/\s+/g, " ").trim().slice(0, 80);
      progressLog(state, "detailed", `LLM #${nextCallNumber} preview | ${preview || "(empty response)"}`);
    }
    return result.content;
  } catch (error) {
    if (heartbeat) clearInterval(heartbeat);
    console.error(`  [LLM Error] ${actor ? actor.name : "storyteller"}: ${error.message}`);
    recordTrajectoryEntry(state, actor, sessionKey, model, sessionPayload.newMessages, `ERROR: ${error.message}`, "");
    const last = state.trajectoryLog[state.trajectoryLog.length - 1];
    if (last) last.apiModel = apiModel;
    progressLog(state, "balanced", `LLM #${nextCallNumber} failed in ${((Date.now() - startedAt) / 1000).toFixed(1)}s | ${actorName} | api=${apiModel} | ${error.message}`);
    throw error;
  }
}

// --- Game initialization ---

function setupPlayers(state, assignments) {
  const count = assignments.length;
  state.players = Array.from({ length: count }, (_, i) => {
    const p = emptyPlayer(i);
    p.model = assignments[i].modelId;
    p.apiModel = (config.modelRuntimeOverrides && config.modelRuntimeOverrides[p.model]) || p.model;
    return p;
  });
  state.started = false;
  state.ended = false;
  state.phase = "night";
  state.dayCount = 0;
  state.nightCount = 0;
}

function assignRoles(state, gameSeed, assignments) {
  const count = state.players.length;
  const dist = PLAYER_DISTRIBUTION[count];
  if (!dist) throw new Error(`Unsupported player count: ${count}`);

  const rng = mulberry32(gameSeed);
  const counts = { townsfolk: dist.townsfolk, outsider: dist.outsider, minion: dist.minion, demon: dist.demon };

  // Build role pool
  const pool = {
    townsfolk: seededShuffle(SCRIPT.roles.filter(r => r.team === "townsfolk"), rng),
    outsider: seededShuffle(SCRIPT.roles.filter(r => r.team === "outsider"), rng),
    minion: seededShuffle(SCRIPT.roles.filter(r => r.team === "minion"), rng),
    demon: seededShuffle(SCRIPT.roles.filter(r => r.team === "demon"), rng)
  };

  let picks = [];
  picks.push(...pool.townsfolk.slice(0, counts.townsfolk));
  picks.push(...pool.outsider.slice(0, counts.outsider));
  picks.push(...pool.minion.slice(0, counts.minion));
  picks.push(...pool.demon.slice(0, counts.demon));

  picks = adjustOutsiders(picks);

  // Assign roles to seats based on faction from schedule
  const demonRoles = picks.filter(r => r.team === "demon");
  const minionRoles = picks.filter(r => r.team === "minion");
  const goodRoles = seededShuffle(picks.filter(r => r.team === "townsfolk" || r.team === "outsider"), rng);

  let minionIdx = 0, goodIdx = 0;
  for (let i = 0; i < count; i++) {
    const faction = assignments[i].faction;
    let role;
    if (faction === "demon") {
      role = demonRoles[0];
    } else if (faction === "minion") {
      role = minionRoles[minionIdx++];
    } else {
      role = goodRoles[goodIdx++];
    }
    const p = state.players[i];
    p.roleId = role.id;
    p.roleName = role.name;
    p.team = role.team;
    p.alive = true;
    p.privateInfo = [];
    p.memory = [];
    p.roleHistory = [{ roleName: role.name, phase: "初始", reason: "初始分配" }];
  }

  assignDrunkAppearance(state, rng);
  state.redHerringId = assignRedHerring(state, rng);
  addChat(state, "系统", "角色分配完成。", "system");
}

function assignRolesFromBoard(state, assignments) {
  for (let i = 0; i < state.players.length; i++) {
    const a = assignments[i];
    const role = SCRIPT.roles.find(r => r.name === a.roleName);
    if (!role) throw new Error(`Unknown role "${a.roleName}" at seat ${i + 1}`);
    const p = state.players[i];
    p.roleId = role.id;
    p.roleName = role.name;
    p.team = role.team;
    p.alive = true;
    p.privateInfo = [];
    p.memory = [];
    p.roleHistory = [{ roleName: role.name, phase: "初始", reason: "初始分配" }];

    if (role.name === "酒鬼" && a.apparentRoleName) {
      p.drunk = true;
      const fakeRole = SCRIPT.roles.find(r => r.name === a.apparentRoleName);
      if (!fakeRole) throw new Error(`Unknown apparent role "${a.apparentRoleName}" for 酒鬼 at seat ${i + 1}`);
      p.apparentRoleId = fakeRole.id;
      p.apparentRoleName = fakeRole.name;
    } else {
      p.apparentRoleId = role.id;
      p.apparentRoleName = role.name;
    }
  }
  addChat(state, "系统", "角色分配完成。", "system");
}

function adjustOutsiders(roles, lockedIds = new Set()) {
  const pattern = /\[\s*([+-]\d+)\s*外来者\s*\]/g;
  let modifier = 0;
  roles.forEach(role => {
    const matches = role.ability.matchAll(pattern);
    for (const match of matches) modifier += Number(match[1]);
  });
  if (modifier === 0) return roles;
  const list = roles.slice();
  const outsiders = SCRIPT.roles.filter(r => r.team === "outsider" && !list.includes(r));
  const townsfolk = SCRIPT.roles.filter(r => r.team === "townsfolk" && !list.includes(r));
  if (modifier > 0) {
    let add = modifier;
    while (add > 0 && outsiders.length) {
      const idx = list.findIndex(r => r.team === "townsfolk" && !lockedIds.has(r.id));
      if (idx === -1) break;
      list.splice(idx, 1, outsiders.pop());
      add--;
    }
  } else {
    let reduce = Math.abs(modifier);
    while (reduce > 0 && townsfolk.length) {
      const idx = list.findIndex(r => r.team === "outsider" && !lockedIds.has(r.id));
      if (idx === -1) break;
      list.splice(idx, 1, townsfolk.pop());
      reduce--;
    }
  }
  return list;
}

function assignDrunkAppearance(state, rng) {
  const townsfolkRoles = SCRIPT.roles.filter(r => r.team === "townsfolk");
  const inPlayIds = new Set(state.players.map(p => p.roleId));
  const notInPlay = townsfolkRoles.filter(r => !inPlayIds.has(r.id));
  state.players.forEach(player => {
    const role = getRoleById(player.roleId);
    if (!role) return;
    if (role.name === "酒鬼") {
      player.drunk = true;
      const pool = notInPlay.length ? notInPlay : townsfolkRoles;
      const fake = pool[Math.floor(rng() * pool.length)];
      player.apparentRoleId = fake.id;
      player.apparentRoleName = fake.name;
    } else {
      player.apparentRoleId = role.id;
      player.apparentRoleName = role.name;
    }
  });
}

function assignRedHerring(state, rng) {
  const hasFortuneTeller = state.players.some(p => p.roleName === "占卜师");
  if (!hasFortuneTeller) return "";
  const good = state.players.filter(p => p.team === "townsfolk" && p.alive);
  if (!good.length) return "";
  return good[Math.floor(rng() * good.length)].id;
}

// --- Win checking & phase switching ---

function checkWin(state) {
  const alive = state.players.filter(p => p.alive);
  let demonAlive = alive.some(p => p.team === "demon");
  if (!demonAlive) {
    const scarlet = alive.find(p => p.roleName === "红唇女郎");
    if (scarlet && alive.length >= 5) {
      const demonRole = SCRIPT.roles.find(r => r.team === "demon");
      scarlet.team = "demon";
      scarlet.roleId = demonRole.id;
      scarlet.roleName = demonRole.name;
      scarlet.apparentRoleId = demonRole.id;
      scarlet.apparentRoleName = demonRole.name;
      setPrivateInfo(state, scarlet, "你已继任为恶魔。");
      recordRoleChange(scarlet, demonRole.name, "红唇女郎继任");
      if (!state.scarletTriggered) {
        addChat(state, "说书人", "恶魔死亡，但游戏并未结束。", "storyteller");
        state.scarletTriggered = true;
      }
      demonAlive = true;
    }
  }
  if (!demonAlive) {
    addChat(state, "系统", "善良阵营获胜（恶魔死亡）。", "system");
    state.ended = true;
    state.winner = "good";
    state.winCondition = "demon_killed";
  } else if (alive.length <= 2) {
    addChat(state, "系统", "邪恶阵营获胜（存活仅剩两人）。", "system");
    state.ended = true;
    state.winner = "evil";
    state.winCondition = "two_alive";
  }
}

function switchPhase(state) {
  if (!state.started || state.ended) return;
  if (state.phase === "night") {
    state.phase = "day";
    state.dayCount += 1;
    addLogEntry(state, `进入白天${state.dayCount}`, "phase");
    addChat(state, "说书人", `天亮了（白天${state.dayCount}）。`, "storyteller");
    addReplayEvent(state, `进入白天${state.dayCount}`, "day_phase");
  } else {
    state.phase = "night";
    state.nightCount += 1;
    state.dayStage = "discussion";
    addLogEntry(state, `进入夜晚${state.nightCount}`, "phase");
    addChat(state, "说书人", `夜幕降临（夜晚${state.nightCount}）。`, "storyteller");
  }
}

function isDroisoned(player) {
  if (!player) return false;
  return Boolean(player.drunk || player.poisoned);
}

/* ═══════════════════════════════════════════════════════════
 *  SECTION 5: NIGHT RESOLUTION (from js/night-actions.js)
 * ═══════════════════════════════════════════════════════════ */

function applyPoison(state) {
  state.players.forEach(p => {
    if (p.poisoned && p.poisonedUntilDay <= state.dayCount) p.poisoned = false;
  });
}

function chooseRandomTarget(state, source, allowSelf = false, includeDead = false) {
  const candidates = state.players.filter(p => (includeDead || p.alive) && (allowSelf || p.id !== source.id));
  if (!candidates.length) return null;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

function getAliveNeighbors(state, seatIndex) {
  const n = state.players.length;
  const neighbors = [];
  for (let step = 1; step < n; step++) {
    const leftIdx = ((seatIndex - step) % n + n) % n;
    if (state.players[leftIdx].alive) { neighbors.push(state.players[leftIdx]); break; }
  }
  for (let step = 1; step < n; step++) {
    const rightIdx = (seatIndex + step) % n;
    if (state.players[rightIdx].alive) { neighbors.push(state.players[rightIdx]); break; }
  }
  return neighbors;
}

function registersAsEvil(player, registrationMap) {
  const override = registrationMap?.[player?.id];
  if (override && typeof override.evil === "boolean") return override.evil;
  if (!player) return false;
  if (player.roleName === "间谍") return Math.random() < 0.3;
  if (player.roleName === "陌客") return Math.random() < 0.8;
  return player.team === "minion" || player.team === "demon";
}

function registersAsMinion(player, registrationMap) {
  const override = registrationMap?.[player?.id];
  if (override && typeof override.minion === "boolean") return override.minion;
  if (!player) return false;
  if (player.roleName === "间谍") return Math.random() < 0.3;
  if (player.roleName === "陌客") return Math.random() < 0.4;
  return player.team === "minion";
}

function registersAsDemon(player, registrationMap) {
  const override = registrationMap?.[player?.id];
  if (override && typeof override.demon === "boolean") return override.demon;
  if (!player) return false;
  if (player.roleName === "陌客") return Math.random() < 0.4;
  return player.team === "demon";
}

function formatSpyGrimoireEntry(player) {
  if (!player) return "";
  let label = `${player.name}:${player.roleName}`;
  if (player.drunk && player.apparentRoleName && player.apparentRoleName !== player.roleName) {
    label += `（自认为:${player.apparentRoleName}）`;
  }
  return label;
}

function registerRoleForInfo(player, registrationMap) {
  const override = registrationMap?.[player?.id];
  if (override && typeof override.roleName === "string" && override.roleName) return override.roleName;
  if (!player) return "";
  const minionNames = SCRIPT.roles.filter(r => r.team === "minion").map(r => r.name);
  const demonNames = SCRIPT.roles.filter(r => r.team === "demon").map(r => r.name);
  const goodNames = SCRIPT.roles.filter(r => r.team === "townsfolk" || r.team === "outsider").map(r => r.name);
  if (player.roleName === "陌客" && Math.random() > 0.5) {
    const pool = [...minionNames, ...demonNames];
    return pool[Math.floor(Math.random() * pool.length)] || player.roleName;
  }
  if (player.roleName === "间谍" && Math.random() > 0.5) {
    return goodNames[Math.floor(Math.random() * goodNames.length)] || player.roleName;
  }
  return player.roleName;
}

function getMinionRoleNameForInfo(player, registrationMap) {
  const override = registrationMap?.[player?.id];
  if (override && override.minion && typeof override.roleName === "string" && override.roleName) return override.roleName;
  if (!player) return "";
  if (player.team === "minion") return player.roleName;
  const minionNames = SCRIPT.roles.filter(r => r.team === "minion").map(r => r.name);
  return minionNames[Math.floor(Math.random() * minionNames.length)] || "爪牙";
}

function makeRolePair(state, rolePlayer, excludeId = "") {
  if (!rolePlayer) return [];
  const others = state.players.filter(p => p.id !== rolePlayer.id && p.id !== excludeId);
  const pool = others.length ? others : state.players.filter(p => p.id !== rolePlayer.id);
  const other = pool.length ? pool[Math.floor(Math.random() * pool.length)] : rolePlayer;
  return shuffle([rolePlayer, other]).slice(0, 2);
}

function storytellerTruthBias() {
  // Simplified: 50% chance of truth when droisoned
  return Math.random() < 0.5;
}

// --- Storyteller helpers ---

function getStorytellerBalanceSummary(state) {
  const aliveGood = state.players.filter(p => p.alive && p.team !== "minion" && p.team !== "demon").length;
  const aliveEvil = state.players.filter(p => p.alive && (p.team === "minion" || p.team === "demon")).length;
  const deadGood = state.players.filter(p => !p.alive && p.team !== "minion" && p.team !== "demon").length;
  const deadEvil = state.players.filter(p => !p.alive && (p.team === "minion" || p.team === "demon")).length;
  const advantage = aliveEvil - aliveGood;
  const advantageText = advantage > 1 ? "邪恶明显优势" : advantage === 1 ? "邪恶小优势" : advantage === 0 ? "均势" : advantage === -1 ? "善良小优势" : "善良明显优势";
  return `存活善良 ${aliveGood} / 存活邪恶 ${aliveEvil}（${advantageText}）；死亡善良 ${deadGood} / 死亡邪恶 ${deadEvil}`;
}

function getClaimsSummary(state, limit = 8) {
  if (!state.claims) return "无";
  const claims = Object.values(state.claims);
  if (!claims.length) return "无";
  return claims.sort((a, b) => (a.time || "").localeCompare(b.time || "")).slice(-limit)
    .map(e => `${e.playerName}自称${e.roleName}`).join("；");
}

function getRelatedClaimsSummary(state, names) {
  if (!state.claims || !names.length) return "无";
  const entries = Object.values(state.claims).filter(e => names.includes(e.playerName));
  return entries.length ? entries.map(e => `${e.playerName}自称${e.roleName}`).join("；") : "无";
}

function getClaimRoleByPlayerName(state, playerName) {
  if (!state.claims || !playerName) return "";
  const entry = Object.values(state.claims).find(e => e.playerName === playerName);
  return entry?.roleName || "";
}

function getBaronClaimSignal(state) {
  if (!state.claims) return { level: "低", count: 0 };
  const count = Object.values(state.claims).filter(e => e.roleName === "男爵").length;
  return { level: count >= 2 ? "高" : count === 1 ? "中" : "低", count };
}

function getRelatedPlayerTruthSummary(state, names) {
  if (!names.length) return "无";
  const parts = names.map(name => {
    const player = state.players.find(p => p.name === name);
    if (!player) return `${name}: 未找到`;
    const claim = getClaimRoleByPlayerName(state, name) || "无";
    return `${name}: 阵营=${player.team}, 真实角色=${player.roleName}, 公聊起跳=${claim}`;
  });
  return parts.length ? parts.join("；") : "无";
}

function getRandomRoleNameByTeams(teams) {
  const pool = SCRIPT.roles.filter(r => teams.includes(r.team));
  if (!pool.length) return "";
  return pool[Math.floor(Math.random() * pool.length)].name;
}

function getRoleNameFromTeamsByHint(teams, hintedName = "") {
  const hint = String(hintedName || "").trim();
  if (hint) {
    const role = SCRIPT.roles.find(r => r.name === hint);
    if (role && teams.includes(role.team)) return role.name;
  }
  return getRandomRoleNameByTeams(teams);
}

function normalizeRegistrationMode(roleName, rawMode) {
  const value = String(rawMode || "").trim().toLowerCase();
  if (["normal", "default", "真实", "普通"].includes(value)) return "normal";
  if (["good", "善良", "好人"].includes(value)) return "good";
  if (["minion", "爪牙"].includes(value)) return "minion";
  if (["demon", "恶魔"].includes(value)) return "demon";
  if (roleName === "间谍") return "good";
  if (roleName === "陌客") return "demon";
  return "normal";
}

function fallbackRegistrationProfile(player) {
  const base = { evil: player.team === "minion" || player.team === "demon", minion: player.team === "minion", demon: player.team === "demon", roleName: player.roleName };
  if (!player) return { ...base, source: "fallback", reason: "" };
  if (player.roleName === "间谍") {
    if (Math.random() < 0.7) return { evil: false, minion: false, demon: false, roleName: getRoleNameFromTeamsByHint(["townsfolk", "outsider"]), source: "fallback", reason: "fallback:spy_good" };
    return { evil: true, minion: true, demon: false, roleName: player.roleName, source: "fallback", reason: "fallback:spy_normal" };
  }
  if (player.roleName === "陌客") {
    const roll = Math.random();
    if (roll < 0.2) return { evil: false, minion: false, demon: false, roleName: player.roleName, source: "fallback", reason: "fallback:hermit_normal" };
    if (roll < 0.6) return { evil: true, minion: true, demon: false, roleName: getRoleNameFromTeamsByHint(["minion"]), source: "fallback", reason: "fallback:hermit_minion" };
    return { evil: true, minion: false, demon: true, roleName: getRoleNameFromTeamsByHint(["demon"]), source: "fallback", reason: "fallback:hermit_demon" };
  }
  return { ...base, source: "rule", reason: "" };
}

// --- Storyteller LLM: registration profile for spy/hermit ---

async function storytellerChooseRegistrationProfile(state, player) {
  if (!player) return null;
  const roleName = player.roleName;
  if (roleName !== "间谍" && roleName !== "陌客") return null;
  const options = roleName === "间谍" ? "normal|good" : "normal|minion|demon";
  const instruction = [
    "你是《血染钟楼》的说书人。",
    `你需要决定该玩家在本次夜晚信息判定中的"登记形态"。`,
    "你只能从给定选项里选一个 register_as，不要输出额外文本。",
    "若角色是间谍：normal=按真实邪恶/爪牙登记；good=按善良登记并显示镇民/外来者角色。",
    "若角色是陌客：normal=按真实善良登记；minion=按爪牙登记；demon=按恶魔登记。",
    "输出严格 JSON：{\"register_as\":\"...\",\"role_name\":\"可选\",\"reason\":\"一小段话\"}"
  ].join("\n");
  const prompt = [
    { role: "system", content: instruction },
    { role: "user", content: `当前局势：${getStorytellerBalanceSummary(state)}\n玩家：${player.name}\n真实角色：${player.roleName}\n真实阵营：${player.team}\n可选登记：${options}\n公开声明（最新）：${getClaimsSummary(state, 8)}` }
  ];
  try {
    const content = await callPlayerLLM(state, prompt, 0.2, null, "storyteller");
    const json = extractJson(content);
    if (!json) return null;
    const mode = normalizeRegistrationMode(roleName, json.register_as || json.mode);
    const hintedRole = String(json.role_name || "").trim();
    const reason = String(json.reason || "").trim();
    if (roleName === "间谍") {
      if (mode === "normal") return { evil: true, minion: true, demon: false, roleName: player.roleName, source: "llm", reason };
      return { evil: false, minion: false, demon: false, roleName: getRoleNameFromTeamsByHint(["townsfolk", "outsider"], hintedRole), source: "llm", reason };
    }
    if (mode === "normal") return { evil: false, minion: false, demon: false, roleName: player.roleName, source: "llm", reason };
    if (mode === "minion") return { evil: true, minion: true, demon: false, roleName: getRoleNameFromTeamsByHint(["minion"], hintedRole), source: "llm", reason };
    return { evil: true, minion: false, demon: true, roleName: getRoleNameFromTeamsByHint(["demon"], hintedRole), source: "llm", reason };
  } catch (_) { return null; }
}

async function buildInfoRegistrationMap(state) {
  const map = {};
  for (const player of state.players) {
    if (!player || !player.id) continue;
    if (player.roleName !== "间谍" && player.roleName !== "陌客") {
      map[player.id] = {
        evil: player.team === "minion" || player.team === "demon",
        minion: player.team === "minion",
        demon: player.team === "demon",
        roleName: player.roleName,
        source: "rule", reason: ""
      };
      continue;
    }
    let profile = await storytellerChooseRegistrationProfile(state, player);
    if (!profile) profile = fallbackRegistrationProfile(player);
    map[player.id] = profile;
  }
  state.lastInfoRegistrationMap = map;
  return map;
}

// --- Storyteller LLM: info truth/false for droisoned players ---

async function storytellerChooseInfo(state, player, label, trueInfo, fallbackOptions, context) {
  const safeFallbacks = Array.isArray(fallbackOptions) ? fallbackOptions.filter(Boolean) : [];
  if (!safeFallbacks.length) return { info: trueInfo, isTrue: true, source: "llm", reason: "无可用假信息" };
  const balanceSummary = getStorytellerBalanceSummary(state);
  const aliveGood = state.players.filter(p => p.alive && p.team !== "minion" && p.team !== "demon").length;
  const aliveEvil = state.players.filter(p => p.alive && (p.team === "minion" || p.team === "demon")).length;
  const evilDisadvantaged = aliveEvil < aliveGood;
  const minionCount = state.players.filter(p => p.team === "minion").length;
  const baronSignal = getBaronClaimSignal(state);
  const relatedNames = context && Array.isArray(context.relatedNames) ? context.relatedNames : [];
  const claimsSummary = getClaimsSummary(state, 10);
  const relatedClaims = relatedNames.length ? getRelatedClaimsSummary(state, relatedNames) : "无";
  const relatedTruth = relatedNames.length ? getRelatedPlayerTruthSummary(state, relatedNames) : "无";
  const instruction = [
    "你是《血染钟楼》的说书人。你需要决定在玩家醉酒/中毒时，给出真实信息还是错误信息。",
    "目标：公平与体验优先，适度平衡局势。若邪恶方劣势，优先给假信息帮助邪恶；若善良方劣势，可优先给真信息。",
    "硬约束：你必须从候选中选择要展示的内容（真实信息或某一条假信息），不得自造候选外文本。",
    "只输出 JSON，不要包含任何额外文本或标记。",
    "输出严格 JSON：{\"show\":\"...\",\"isTrue\":true|false,\"reason\":\"一小段话理由\"}"
  ].join("\n");
  const prompt = [
    { role: "system", content: instruction },
    { role: "user", content: `当前局势：${balanceSummary}\n邪恶是否劣势：${evilDisadvantaged ? "是" : "否"}（存活善良=${aliveGood}, 存活邪恶=${aliveEvil}）\n场上真实爪牙数量：${minionCount}\n男爵在场公聊舆论：${baronSignal.level}（起跳男爵人数=${baronSignal.count}）\n玩家：${player.name}（${player.team}）\n信息类型：${label}\n真实信息：${trueInfo}\n可用假信息：${safeFallbacks.join(" | ")}\n公开身份声明（最新）：${claimsSummary}\n本信息相关玩家声明：${relatedClaims}\n本信息相关玩家真相（说书人可见）：${relatedTruth}` }
  ];
  try {
    const content = await callPlayerLLM(state, prompt, 0.2, null, "storyteller");
    const json = extractJson(content);
    if (json && json.show) {
      const show = String(json.show).trim();
      if (show === trueInfo) return { info: trueInfo, isTrue: true, source: "llm", reason: json.reason || "" };
      if (safeFallbacks.includes(show)) return { info: show, isTrue: false, source: "llm", reason: json.reason || "" };
    }
  } catch (_) {}
  return null;
}

async function resolveInfoResult(state, player, label, trueInfo, fallbackOptions, context) {
  if (!isDroisoned(player)) {
    return { info: trueInfo, isTrue: true, droisoned: false, source: "none", reason: "" };
  }
  // Try storyteller LLM first
  const decision = await storytellerChooseInfo(state, player, label, trueInfo, fallbackOptions, context);
  if (decision) {
    return { info: decision.info, isTrue: decision.isTrue, droisoned: true, source: decision.source || "llm", reason: decision.reason || "" };
  }
  // Fallback: 50% truth heuristic
  const tellTruth = Math.random() < 0.5;
  if (tellTruth) {
    return { info: trueInfo, isTrue: true, droisoned: true, source: "heuristic", reason: "概率判定给真信息" };
  }
  const safeFallbacks = Array.isArray(fallbackOptions) ? fallbackOptions.filter(Boolean) : [];
  let info = trueInfo;
  if (safeFallbacks.length) info = safeFallbacks[Math.floor(Math.random() * safeFallbacks.length)];
  return { info, isTrue: info === trueInfo, droisoned: true, source: "heuristic", reason: "概率判定给假信息" };
}

function recordInfoAudit(state, player, label, trueInfo, shownInfo, isTrue, droisoned, source = "", reason = "") {
  if (!Array.isArray(state.infoAudit)) state.infoAudit = [];
  state.infoAudit.push({
    time: new Date().toISOString(), phase: getPhaseLabel(state),
    night: state.nightCount, day: state.dayCount,
    player: player.name, label, trueInfo, shownInfo,
    isTrue: Boolean(isTrue), droisoned: Boolean(droisoned),
    decisionSource: source, decisionReason: reason
  });
}

function getInfoRolePlayer(state, roleName) {
  return state.players.find(p => p.alive && (p.roleName === roleName || (p.drunk && p.apparentRoleName === roleName)));
}

function recordFirstNightRecognition(state) {
  const demons = state.players.filter(p => p.team === "demon");
  const minions = state.players.filter(p => p.team === "minion");
  const blockedNames = new Set();
  state.players.forEach(p => {
    if (p.roleName) blockedNames.add(p.roleName);
    if (p.apparentRoleName) blockedNames.add(p.apparentRoleName);
  });
  let bluffs;
  if (state.presetBluffs && state.presetBluffs.length) {
    bluffs = state.presetBluffs;
  } else {
    const bluffPool = SCRIPT.roles.filter(r => (r.team === "townsfolk" || r.team === "outsider") && !blockedNames.has(r.name) && r.name !== "酒鬼");
    bluffs = shuffle(bluffPool).slice(0, 3).map(r => r.name);
  }
  demons.forEach(demon => setPrivateInfo(state, demon, `三个不在场身份：${bluffs.join(" / ") || "无"}`));
  if (state.players.length >= 7) {
    demons.forEach(demon => setPrivateInfo(state, demon, `你看到爪牙：${minions.map(m => m.name).join("、") || "无"}`));
    minions.forEach(minion => {
      setPrivateInfo(state, minion, `你看到恶魔：${demons.map(d => d.name).join("、") || "无"}`);
      const others = minions.filter(m => m.id !== minion.id).map(m => m.name);
      setPrivateInfo(state, minion, `你看到爪牙：${others.join("、") || "无"}`);
    });
  }
  state.firstNightRecognitionDone = true;
}

async function aiChooseSingleTarget(state, actor, candidates, actionLabel, extraNote = "") {
  if (!actor || !candidates.length) return null;
  const privateInfo = formatPrivateInfoForPrompt(actor, "json", 4);
  const privateChatHistory = formatPlayerPrivateChats(state, actor);
  const recentChat = formatChatForPrompt(state, 12, actor, "json");
  const aliveDeadSummary = getAliveDeadSummary(state);
  const targetNames = candidates.map(p => playerOptionLabel(p)).join("、");
  const userContent = `公开聊天（最近增量）：\n${recentChat}\n
你的私聊记录：\n${privateChatHistory}\n
${aliveDeadSummary}
你的当前状态：${actor.alive ? "存活" : "死亡"}。
你的私密信息增量：${privateInfo}
现在是夜晚，你需要执行行动：${actionLabel}。
可选目标：${targetNames}。只能从列表中选择一个目标。${extraNote || ""}
请输出 JSON：{"target":"玩家名"}`;
  const prompt = buildPlayerPromptMessages(state, actor, "json", userContent, { systemPrompt: PLAYER_JSON_SYSTEM_PROMPT });
  try {
    const content = await callPlayerLLM(state, prompt, config.temperature, actor, "json");
    const json = extractJson(content);
    return json ? resolveTargetByName(json.target, candidates, actor) : null;
  } catch (_) { return null; }
}

async function aiChooseTwoTargets(state, actor, candidates, actionLabel) {
  if (!actor || candidates.length < 2) return candidates;
  const privateInfo = formatPrivateInfoForPrompt(actor, "json", 4);
  const privateChatHistory = formatPlayerPrivateChats(state, actor);
  const recentChat = formatChatForPrompt(state, 12, actor, "json");
  const aliveDeadSummary = getAliveDeadSummary(state);
  const targetNames = candidates.map(p => playerOptionLabel(p)).join("、");
  const userContent = `公开聊天（最近增量）：\n${recentChat}\n
你的私聊记录：\n${privateChatHistory}\n
${aliveDeadSummary}
你的当前状态：${actor.alive ? "存活" : "死亡"}。
你的私密信息增量：${privateInfo}
现在是夜晚，你需要执行行动：${actionLabel}。
可选目标：${targetNames}。只能从列表中选择两名不同目标。
请输出 JSON：{"target1":"玩家名","target2":"玩家名"}`;
  const prompt = buildPlayerPromptMessages(state, actor, "json", userContent, { systemPrompt: PLAYER_JSON_SYSTEM_PROMPT });
  try {
    const content = await callPlayerLLM(state, prompt, config.temperature, actor, "json");
    const json = extractJson(content);
    const t1 = json ? resolveTargetByName(json.target1, candidates, actor) : null;
    const t2 = json ? resolveTargetByName(json.target2, candidates, actor) : null;
    if (t1 && t2 && t1.id !== t2.id) return [t1, t2];
  } catch (_) {}
  return shuffle(candidates).slice(0, 2);
}

async function resolveNight(state) {
  if (!state.started || state.phase !== "night") return;
  progressLog(state, "concise", `Night ${state.nightCount} start`);
  if (state.nightCount === 1 && !state.firstNightRecognitionDone) {
    recordFirstNightRecognition(state);
  }
  applyPoison(state);
  state.players.forEach(p => { p.protected = false; });

  const demon = state.players.find(p => p.team === "demon" && p.alive);
  const poisoner = state.players.find(p => p.roleName === "投毒者" && p.alive);
  const monk = state.players.find(p => p.roleName === "僧侣" && p.alive);
  const butler = state.players.find(p => p.roleName === "管家" && p.alive);
  const fortuneTeller = getInfoRolePlayer(state, "占卜师");
  const empath = getInfoRolePlayer(state, "共情者");
  const chef = getInfoRolePlayer(state, "厨师");
  const washerwoman = getInfoRolePlayer(state, "洗衣妇");
  const librarian = getInfoRolePlayer(state, "图书管理员");
  const investigator = getInfoRolePlayer(state, "调查员");
  const undertaker = getInfoRolePlayer(state, "送葬者");
  const ravenkeeper = getInfoRolePlayer(state, "守鸦人");
  const spy = getInfoRolePlayer(state, "间谍");
  const infoMap = await buildInfoRegistrationMap(state);

  // 1. Poisoner
  if (poisoner) {
    progressLog(state, "detailed", `Night ${state.nightCount} action | ${poisoner.name} uses poison`);
    const candidates = state.players.slice();
    const target = await aiChooseSingleTarget(state, poisoner, candidates, "投毒一名玩家（今晚与明天白天中毒）")
      || chooseRandomTarget(state, poisoner, true, true);
    if (target) {
      target.poisoned = true;
      target.poisonedUntilDay = state.dayCount + 1;
      addReplayEvent(state, `投毒者选择 ${poisoner.name} -> ${target.name}`, "night_action");
    }
  }

  // 2. Monk (not first night)
  if (monk && state.nightCount > 1) {
    progressLog(state, "detailed", `Night ${state.nightCount} action | ${monk.name} chooses protection`);
    const candidates = state.players.filter(p => p.alive && p.id !== monk.id);
    const target = await aiChooseSingleTarget(state, monk, candidates, "守护一名玩家（免受恶魔能力）")
      || chooseRandomTarget(state, monk, false);
    if (target) {
      if (!isDroisoned(monk)) {
        target.protected = true;
        addReplayEvent(state, `僧侣保护 ${monk.name} -> ${target.name}`, "night_action");
      } else {
        addReplayEvent(state, `僧侣保护失效（中毒/醉酒）：${monk.name} -> ${target.name}`, "night_action");
      }
    }
  }

  // 3. Demon kill (not first night)
  let demonTarget = null;
  if (demon && state.nightCount > 1) {
    if (demon.demonCooldownNight === state.nightCount) {
      addReplayEvent(state, `新恶魔当夜无法出刀：${demon.name}`, "night_action");
    } else {
      progressLog(state, "detailed", `Night ${state.nightCount} action | ${demon.name} chooses kill`);
      const candidates = state.players.slice();
      const minions = state.players.filter(p => p.alive && p.team === "minion");
      const extraNote = minions.length
        ? "你可以选择自己以自杀传位，但一般谨慎使用。"
        : "请不要选择自己自杀（场上无存活爪牙会导致直接失败）。";
      demonTarget = await aiChooseSingleTarget(state, demon, candidates, "选择一名玩家死亡（恶魔击杀）", extraNote)
        || chooseRandomTarget(state, demon, true, true);
      if (demonTarget) addReplayEvent(state, `恶魔选择 ${demon.name} -> ${demonTarget.name}`, "night_action");
    }
  }

  // 4. First-night info roles
  if (chef && state.nightCount === 1) {
    let pairs = 0;
    for (let i = 0; i < state.players.length; i++) {
      const next = (i + 1) % state.players.length;
      if (registersAsEvil(state.players[i], infoMap) && registersAsEvil(state.players[next], infoMap)) pairs++;
    }
    const truth = `${pairs} 对相邻邪恶玩家`;
    const result = await resolveInfoResult(state, chef, "厨师信息", truth, ["0 对相邻邪恶玩家", "1 对相邻邪恶玩家", "2 对相邻邪恶玩家"]);
    setPrivateInfo(state, chef, `厨师信息：${result.info}`);
    recordInfoAudit(state, chef, "厨师信息", truth, result.info, result.isTrue, result.droisoned, result.source, result.reason);
  }

  if (washerwoman && state.nightCount === 1) {
    const townsfolkInPlay = state.players.filter(p => p.team === "townsfolk");
    const candidates = townsfolkInPlay.filter(p => p.id !== washerwoman.id);
    const chosen = candidates[Math.floor(Math.random() * candidates.length)] || townsfolkInPlay[0];
    const pair = makeRolePair(state, chosen, washerwoman.id);
    const truth = pair.length === 2 ? `${pair[0].name} 或 ${pair[1].name} 是 ${chosen.roleName}` : `${chosen.name} 是 ${chosen.roleName}`;
    const relatedNames = pair.map(p => p.name);
    const fakeRole = SCRIPT.roles.find(r => r.team === "townsfolk" && !townsfolkInPlay.some(p => p.roleId === r.id));
    const fakePlayers = shuffle(state.players.filter(p => p.id !== washerwoman.id)).slice(0, 2);
    const fake = fakeRole && fakePlayers.length >= 2 ? `${fakePlayers[0].name} 或 ${fakePlayers[1].name} 是 ${fakeRole.name}` : truth;
    const result = await resolveInfoResult(state, washerwoman, "洗衣妇信息", truth, [fake], { relatedNames });
    setPrivateInfo(state, washerwoman, `洗衣妇信息：${result.info}`);
    recordInfoAudit(state, washerwoman, "洗衣妇信息", truth, result.info, result.isTrue, result.droisoned, result.source, result.reason);
  }

  if (librarian && state.nightCount === 1) {
    const outsidersInPlay = state.players.filter(p => p.team === "outsider");
    const outsiderRoles = SCRIPT.roles.filter(r => r.team === "outsider");
    let truth = "没有外来者在场";
    let chosenOutsider = null;
    let relatedNames = [];
    if (outsidersInPlay.length) {
      chosenOutsider = outsidersInPlay[Math.floor(Math.random() * outsidersInPlay.length)];
      const pair = makeRolePair(state, chosenOutsider, librarian.id);
      truth = pair.length === 2 ? `${pair[0].name} 或 ${pair[1].name} 是 ${chosenOutsider.roleName}` : `${chosenOutsider.name} 是 ${chosenOutsider.roleName}`;
      relatedNames = pair.map(p => p.name);
    }
    let fake = "";
    if (outsiderRoles.length) {
      let fakeRolePool = outsiderRoles;
      if (chosenOutsider && outsiderRoles.length > 1) {
        fakeRolePool = outsiderRoles.filter(r => r.name !== chosenOutsider.roleName);
      }
      const fakeRole = fakeRolePool[Math.floor(Math.random() * fakeRolePool.length)];
      const baseCandidates = state.players.filter(p => p.id !== librarian.id);
      let fakeCandidates = baseCandidates.filter(p => p.roleId !== fakeRole.id);
      if (fakeCandidates.length < 2) {
        fakeCandidates = baseCandidates;
      }
      const fakePair = shuffle(fakeCandidates).slice(0, 2);
      if (fakePair.length === 2) {
        fake = `${fakePair[0].name} 或 ${fakePair[1].name} 是 ${fakeRole.name}`;
      }
    }
    const fallbacks = fake ? [fake] : [];
    const result = await resolveInfoResult(state, librarian, "图书管理员信息", truth, fallbacks, { relatedNames });
    setPrivateInfo(state, librarian, `图书管理员信息：${result.info}`);
    recordInfoAudit(state, librarian, "图书管理员信息", truth, result.info, result.isTrue, result.droisoned, result.source, result.reason);
  }

  if (investigator && state.nightCount === 1) {
    const minionsInPlay = state.players.filter(p => registersAsMinion(p, infoMap));
    const minionRoles = SCRIPT.roles.filter(r => r.team === "minion").map(r => r.name);
    let truth = "没有爪牙在场";
    let relatedNames = [];
    if (minionsInPlay.length) {
      const chosen = minionsInPlay[Math.floor(Math.random() * minionsInPlay.length)];
      const pair = makeRolePair(state, chosen, investigator.id);
      const roleName = getMinionRoleNameForInfo(chosen, infoMap);
      truth = `${pair[0].name} 或 ${pair[1].name} 是 ${roleName}`;
      relatedNames = pair.map(p => p.name);
    }
    let fake = "没有爪牙在场";
    if (minionsInPlay.length) {
      const fakeRolePool = minionRoles.filter(name => name !== truth.split(" 是 ").pop());
      const fakeRole = fakeRolePool.length
        ? fakeRolePool[Math.floor(Math.random() * fakeRolePool.length)]
        : (minionRoles[0] || "爪牙");
      const fakePlayers = shuffle(state.players.filter(p => p.id !== investigator.id)).slice(0, 2);
      if (fakePlayers.length === 2) {
        fake = `${fakePlayers[0].name} 或 ${fakePlayers[1].name} 是 ${fakeRole}`;
      } else {
        fake = truth;
      }
    } else if (minionRoles.length) {
      const fakePlayers = shuffle(state.players.filter(p => p.id !== investigator.id)).slice(0, 2);
      if (fakePlayers.length === 2) {
        fake = `${fakePlayers[0].name} 或 ${fakePlayers[1].name} 是 ${minionRoles[0]}`;
      }
    }
    const result = await resolveInfoResult(state, investigator, "调查员信息", truth, [fake], { relatedNames });
    setPrivateInfo(state, investigator, `调查员信息：${result.info}`);
    recordInfoAudit(state, investigator, "调查员信息", truth, result.info, result.isTrue, result.droisoned, result.source, result.reason);
  }

  // 5. Death resolution
  let killed = null;
  if (state.nightCount > 1 && demonTarget && demonTarget.alive) {
    const targetRole = getRoleById(demonTarget.roleId);
    // Mayor redirect
    if (targetRole && targetRole.name === "镇长" && !isDroisoned(demonTarget) && Math.random() > 0.5) {
      const alts = state.players.filter(p => p.alive && p.id !== demonTarget.id && p.team !== "minion" && p.team !== "demon");
      if (alts.length) {
        addReplayEvent(state, `镇长替死触发，目标从 ${demonTarget.name} 转移`, "night_action");
        demonTarget = alts[Math.floor(Math.random() * alts.length)];
      }
    }
    // Demon self-kill → succession
    if (demon && demonTarget.id === demon.id) {
      const minions = state.players.filter(p => p.alive && p.team === "minion");
      if (minions.length) {
        const successor = minions[Math.floor(Math.random() * minions.length)];
        const demonRole = SCRIPT.roles.find(r => r.team === "demon");
        successor.team = "demon";
        successor.roleId = demonRole.id;
        successor.roleName = demonRole.name;
        successor.apparentRoleId = demonRole.id;
        successor.apparentRoleName = demonRole.name;
        successor.demonCooldownNight = state.nightCount;
        recordRoleChange(successor, demonRole.name, "恶魔传位");
        addReplayEvent(state, `恶魔传位：${successor.name} 当夜不出刀`, "night_action");
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
        addReplayEvent(state, `恶魔击杀失败（被保护/士兵）目标：${demonTarget.name}`, "night_action");
      }
    }
  }

  // 6. Ravenkeeper (if killed this night)
  if (ravenkeeper && killed && ravenkeeper.id === killed.id) {
    progressLog(state, "detailed", `Night ${state.nightCount} action | ${ravenkeeper.name} triggers ravenkeeper`);
    const candidates = state.players.filter(p => p.alive);
    const target = await aiChooseSingleTarget(state, ravenkeeper, candidates, "守鸦人选择一名玩家得知其角色")
      || chooseRandomTarget(state, ravenkeeper, true);
    if (target) {
      const registeredRole = registerRoleForInfo(target, infoMap);
      const result = await resolveInfoResult(
        state,
        ravenkeeper,
        "守鸦人信息",
        registeredRole,
        SCRIPT.roles.map(r => r.name),
        { relatedNames: [target.name] }
      );
      setPrivateInfo(state, ravenkeeper, `守鸦人信息：${target.name} 是 ${result.info}`);
      recordInfoAudit(state, ravenkeeper, "守鸦人信息", registeredRole, result.info, result.isTrue, result.droisoned, result.source, result.reason);
    }
  }

  // 7. Empath
  if (empath && empath.alive) {
    const neighbors = getAliveNeighbors(state, state.players.indexOf(empath));
    const evilCount = neighbors.filter(p => registersAsEvil(p, infoMap)).length;
    const truth = `${evilCount}`;
    const result = await resolveInfoResult(state, empath, "共情者信息", truth, ["0", "1", "2"]);
    setPrivateInfo(state, empath, `共情者信息：相邻邪恶人数 ${result.info}`);
    recordInfoAudit(state, empath, "共情者信息", truth, result.info, result.isTrue, result.droisoned, result.source, result.reason);
  }

  // 8. Fortune Teller
  if (fortuneTeller && fortuneTeller.alive) {
    const candidates = state.players.filter(p => p.alive && p.id !== fortuneTeller.id);
    let targets = await aiChooseTwoTargets(state, fortuneTeller, candidates, "占卜两名玩家（判断是否有恶魔）");
    if (targets.length < 2) targets = shuffle(candidates).slice(0, 2);
    const demonHit = targets.some(t => t && (t.team === "demon" || t.id === state.redHerringId || registersAsDemon(t, infoMap)));
    const truth = demonHit ? "有恶魔" : "没有恶魔";
    const result = await resolveInfoResult(
      state,
      fortuneTeller,
      "占卜师信息",
      truth,
      [demonHit ? "没有恶魔" : "有恶魔"],
      { relatedNames: targets.map(t => t.name) }
    );
    setPrivateInfo(state, fortuneTeller, `占卜师信息：${targets.map(t => t.name).join(" 与 ")} -> ${result.info}`);
    recordInfoAudit(state, fortuneTeller, "占卜师信息", truth, result.info, result.isTrue, result.droisoned, result.source, result.reason);
  }

  // 9. Butler
  if (butler && butler.alive) {
    progressLog(state, "detailed", `Night ${state.nightCount} action | ${butler.name} chooses master`);
    const candidates = state.players.filter(p => p.alive && p.id !== butler.id);
    const target = await aiChooseSingleTarget(state, butler, candidates, "选择一名主人（次日你只能随他投票）")
      || chooseRandomTarget(state, butler, false);
    if (target) {
      butler.butlerMasterId = target.id;
      setPrivateInfo(state, butler, `你今晚的侍从对象：${target.name}`);
      addReplayEvent(state, `管家选择 ${butler.name} -> ${target.name}`, "night_action");
    }
  }

  // 10. Undertaker
  if (undertaker && undertaker.alive && state.lastExecutedId) {
    const executed = state.players.find(p => p.id === state.lastExecutedId);
    if (executed) {
      const registeredRole = registerRoleForInfo(executed, infoMap);
      const result = await resolveInfoResult(
        state,
        undertaker,
        "送葬者信息",
        registeredRole,
        SCRIPT.roles.map(r => r.name),
        { relatedNames: [executed.name] }
      );
      setPrivateInfo(state, undertaker, `送葬者信息：${executed.name} 是 ${result.info}`);
      recordInfoAudit(state, undertaker, "送葬者信息", registeredRole, result.info, result.isTrue, result.droisoned, result.source, result.reason);
    }
  }

  // 11. Spy
  if (spy && spy.alive) {
    const grimoire = state.players.map(p => formatSpyGrimoireEntry(p)).join("、");
    setPrivateInfo(state, spy, `魔典：${grimoire}`);
    const auditEntries = (state.infoAudit || []).filter(e => e.night === state.nightCount);
    if (auditEntries.length) {
      const auditText = auditEntries.map(e => {
        const status = e.isTrue ? "正确" : "错误";
        const tag = e.droisoned ? "（醉酒/中毒）" : "";
        return `${e.player} ${e.label} = ${e.shownInfo}（真实：${e.trueInfo}，${status}）${tag}`;
      }).join("；");
      setPrivateInfo(state, spy, `信息审计：${auditText}`);
    }
  }

  // 12. Dawn narration (use template to save tokens)
  const narration = killed ? `夜晚结束。${killed.name} 死亡。` : "夜晚结束，无人死亡。";
  addChat(state, "说书人", narration, "storyteller");
  addLogEntry(state, `夜晚死亡：${killed ? killed.name : "无人"}`, "night");
  addReplayEvent(state, `夜晚死亡：${killed ? killed.name : "无人"}`, "night_action");
  progressLog(state, "concise", `Night ${state.nightCount} end | dead=${killed ? killed.name : "none"}`);

  checkWin(state);
  if (!state.ended) switchPhase(state);
}

/* ═══════════════════════════════════════════════════════════
 *  SECTION 6: SLAYER + DISCUSSION + PRIVATE CHAT
 * ═══════════════════════════════════════════════════════════ */

function parseSlayerDeclaration(state, text, shooter) {
  const raw = String(text || "").trim();
  if (!raw) return { detected: false, valid: false, target: null, error: "empty" };
  const compact = raw.replace(/\s+/g, "");
  if (compact.includes("要向玩家X开枪") || compact.includes("要向玩家x开枪")) {
    return { detected: false, valid: false, target: null, error: "template_echo" };
  }
  const detected = compact.includes("猎手") && compact.includes("我要向") && compact.includes("开枪");
  if (!detected) return { detected: false, valid: false, target: null, error: "none" };
  const match = compact.match(/我是猎手[，,]?我要向(玩家([0-9]{1,2})|自己|我自己)开枪/);
  if (!match) return { detected: true, valid: false, target: null, error: "format" };
  let target = null;
  if (match[2]) {
    const seat = Number(match[2]);
    if (!Number.isFinite(seat) || seat < 1 || seat > state.players.length) return { detected: true, valid: false, target: null, error: "target" };
    const player = state.players[seat - 1];
    if (!player || !player.alive) return { detected: true, valid: false, target: null, error: "target" };
    target = player;
  } else {
    if (!shooter || !shooter.alive) return { detected: true, valid: false, target: null, error: "target" };
    target = shooter;
  }
  return { detected: true, valid: true, target, error: "" };
}

function resolveSlayerShot(state, shooter, target, isReal) {
  if (!shooter || !target || !shooter.alive) return;
  const regMap = state.lastInfoRegistrationMap || null;
  const canKill = Boolean(isReal && registersAsDemon(target, regMap) && !isDroisoned(shooter));
  addChat(state, "说书人", `${shooter.name} 表示要开枪，目标是 ${target.name}。`, "storyteller");
  addReplayEvent(state, `猎手射击：${shooter.name} -> ${target.name}`, "day_action");
  if (canKill) {
    target.alive = false;
    addChat(state, "说书人", `${target.name} 死亡。`, "storyteller");
    addReplayEvent(state, `猎手击杀恶魔：${target.name}`, "day_action");
  } else {
    addChat(state, "说书人", `${target.name} 并未死亡。`, "storyteller");
  }
  checkWin(state);
}

function maybeHandleSlayerClaim(state, speaker, text) {
  if (!state.started || state.ended) return;
  if (state.phase !== "day" || state.dayStage !== "discussion") return;
  const shooter = state.players.find(p => p.name === speaker);
  if (!shooter || !shooter.alive) return;
  const decl = parseSlayerDeclaration(state, text, shooter);
  if (!decl.detected) return;
  if (!decl.valid) {
    if (decl.error === "format") addChat(state, "说书人", `猎手声明格式不正确，本次不视为开枪。正确格式：${SLAYER_DECLARATION_TEMPLATE}`, "storyteller");
    else addChat(state, "说书人", "猎手声明目标无效（目标不存在或已死亡），本次不视为开枪。", "storyteller");
    return;
  }
  if (shooter.slayerClaimed) return;
  shooter.slayerClaimed = true;
  const isReal = shooter.roleName === "猎手" && !shooter.slayerUsed;
  if (isReal) shooter.slayerUsed = true;
  resolveSlayerShot(state, shooter, decl.target, isReal);
}

function getDayRuleNote(state) {
  if (state.dayCount === 1) return "首日无死亡播报。第一个白天可以私聊和公聊。";
  return "";
}

async function aiSpeak(state, player) {
  if (state.ended) return;
  progressLog(state, "detailed", `Discussion | Day ${state.dayCount} | ${player.name} speaking`);
  const privateInfo = formatPrivateInfoForPrompt(player, "chat", 4);
  const privateChatHistory = formatPlayerPrivateChats(state, player);
  const recentSelf = player.memory.slice(-5).join(" / ") || "无";
  const recentChat = formatChatForPrompt(state, 12, player, "chat");
  const dayRuleNote = getDayRuleNote(state);
  const aliveDeadSummary = getAliveDeadSummary(state);
  const buildPrompt = (extra = "") => buildPlayerPromptMessages(state, player, "chat",
    `公开聊天（最近增量）：\n${recentChat}\n
你的私聊记录：\n${privateChatHistory}\n
${aliveDeadSummary}
你的当前状态：${player.alive ? "存活" : "死亡"}。
时间规则：${dayRuleNote || "无"}
猎手声明规则：若要触发开枪，整句必须严格为"${SLAYER_DECLARATION_TEMPLATE}"。
你的私密信息增量：${privateInfo}
你自己之前说过：${recentSelf}\n
${extra ? `额外约束：${extra}\n` : ""}这是公开聊天，所有玩家都能看到你的发言。只基于以上信息进行**公聊**发言。请输出一小段话进行公聊发言。`);
  try {
    let usedPrompt = buildPrompt("");
    let content = await callPlayerLLM(state, usedPrompt, config.temperature, player, "chat");
    let text = content.trim() || "我没什么想说的。";
    if (isEvilSelfReveal(player, text)) {
      usedPrompt = buildPrompt("不要自曝为爪牙或恶魔，也不要承认自己是坏人。优先伪装为可信的善良角色。");
      content = await callPlayerLLM(state, usedPrompt, config.temperature, player, "chat");
      text = content.trim() || "我没什么想说的。";
    }
    if (isEvilSelfReveal(player, text)) text = "我没什么想说的。";
    player.memory.push(text);
    addChat(state, player.name, text, "player");
  } catch (_) {
    addChat(state, "系统", `${player.name} 发言失败。`, "system");
  }
}

async function maybeAiPrivateChat(state, player) {
  if (!isPrivateChatOpen(state)) return;
  progressLog(state, "detailed", `Private chat check | Day ${state.dayCount} | ${player.name}`);
  const candidates = state.players.filter(p => p.alive && p.id !== player.id);
  if (!candidates.length) return;
  const privateInfo = formatPrivateInfoForPrompt(player, "json", 4);
  const privateChatHistory = formatPlayerPrivateChats(state, player);
  const recentChat = formatChatForPrompt(state, 8, player, "json");
  const aliveDeadSummary = getAliveDeadSummary(state);
  const targetNames = candidates.map(p => p.name).join("、");
  const userContent = `公开聊天（最近增量）：\n${recentChat}\n
你的私聊记录：\n${privateChatHistory}\n
现在是白天1，你可以选择是否发起一次私聊（仅在白天1可私聊）。
可私聊目标：${targetNames}。
如果你是邪恶阵营，可以考虑通过私聊与邪恶同伴交换身份或协调计划。
${aliveDeadSummary}
你的当前状态：${player.alive ? "存活" : "死亡"}。
你的私密信息增量：${privateInfo}
请输出 JSON：{"private":"yes|no","target":"玩家名","message":"一小段话"}`;
  const prompt = buildPlayerPromptMessages(state, player, "json", userContent, { systemPrompt: PLAYER_JSON_SYSTEM_PROMPT });
  try {
    const content = await callPlayerLLM(state, prompt, config.temperature, player, "json");
    const json = extractJson(content);
    if (!json || json.private !== "yes") return;
    const targetName = normalizeTargetName(json.target || "");
    const target = candidates.find(p => p.name === targetName);
    if (!target) return;
    const text = (json.message || "").trim();
    if (!text) return;
    addPrivateChat(state, player.name, target.name, text);
    progressLog(state, "detailed", `Private chat | ${player.name} -> ${target.name}`);
    // AI-to-AI reply
    await aiPrivateReply(state, player, target, text);
  } catch (_) {}
}

async function aiPrivateReply(state, sender, target, text) {
  const privateInfo = formatPrivateInfoForPrompt(target, "chat", 4);
  const privateChatHistory = formatPlayerPrivateChats(state, target);
  const recentChat = formatChatForPrompt(state, 8, target, "chat");
  const aliveDeadSummary = getAliveDeadSummary(state);
  const buildPrompt = (extra = "") => buildPlayerPromptMessages(state, target, "chat",
    `公开聊天（最近增量）：\n${recentChat}\n
你的全部私聊记录：\n${privateChatHistory}\n
这是私聊，只有你和对方能看到。${sender.name}对你说：${text}
${aliveDeadSummary}
你的当前状态：${target.alive ? "存活" : "死亡"}。
你的私密信息增量：${privateInfo}
${extra ? `额外约束：${extra}\n` : ""}请用一小段话私聊回应（注意：这不是公开发言，只有对方能看到）。`);
  try {
    let usedPrompt = buildPrompt("");
    let content = await callPlayerLLM(state, usedPrompt, config.temperature, target, "chat");
    let reply = content.trim() || "我没什么想说的。";
    if (isEvilSelfReveal(target, reply)) {
      usedPrompt = buildPrompt("不要自曝为爪牙或恶魔，也不要承认自己是坏人。");
      content = await callPlayerLLM(state, usedPrompt, config.temperature, target, "chat");
      reply = content.trim() || "我没什么想说的。";
    }
    if (isEvilSelfReveal(target, reply)) reply = "我没什么想说的。";
    target.memory.push(reply);
    addPrivateChat(state, target.name, sender.name, reply);
    progressLog(state, "detailed", `Private reply | ${target.name} -> ${sender.name}`);
  } catch (_) {}
}

/* ═══════════════════════════════════════════════════════════
 *  SECTION 7: NOMINATION + VOTING (from js/nomination.js)
 * ═══════════════════════════════════════════════════════════ */

async function aiNominate(state, player) {
  const nominableTargets = state.players
    .filter(p => !state.nomineeUsedIds.includes(p.id))
    .map(p => playerOptionLabel(p));
  const recentChat = formatChatForPrompt(state, 12, player, "json");
  const privateInfo = formatPrivateInfoForPrompt(player, "json", 4);
  const privateChatHistory = formatPlayerPrivateChats(state, player);
  const aliveDeadSummary = getAliveDeadSummary(state);
  const userContent = `公开聊天（最近增量）：\n${recentChat}\n
你的私聊记录：\n${privateChatHistory}\n
${aliveDeadSummary}
当前提名阶段：你可以选择是否提名一名玩家（包括已死亡的玩家）。可提名玩家：${nominableTargets.join("、")}。
每人仅一次提名机会，每人最多被提名一次。
你的私密信息增量：${privateInfo}
请输出 JSON：{"nominate":"yes|no","target":"玩家名","reason":"一小段话"}。如果不提名，target为空字符串。`;
  const prompt = buildPlayerPromptMessages(state, player, "json", userContent, { systemPrompt: PLAYER_JSON_SYSTEM_PROMPT });
  try {
    const content = await callPlayerLLM(state, prompt, config.temperature, player, "json");
    const json = extractJson(content);
    if (json && json.nominate === "yes") {
      const targetName = normalizeTargetName(json.target || "");
      const target = state.players.find(p => !state.nomineeUsedIds.includes(p.id) && p.name === targetName);
      if (target) return { nomineeId: target.id, reason: json.reason || "" };
    }
  } catch (_) {}
  return null;
}

async function aiNominationReason(state, nominator, nominee) {
  const recentChat = formatChatForPrompt(state, 12, nominator, "chat");
  const privateInfo = formatPrivateInfoForPrompt(nominator, "chat", 4);
  const privateChatHistory = formatPlayerPrivateChats(state, nominator);
  const aliveDeadSummary = getAliveDeadSummary(state);
  const userContent = `公开聊天（最近增量）：\n${recentChat}\n
你的私聊记录：\n${privateChatHistory}\n
${aliveDeadSummary}
你提名了${nominee.name}。
你的私密信息增量：${privateInfo}
这是一小段公开发言，不要说心理活动或私密信息，不要在括号里写心里话。\n请用一小段话说明理由。`;
  const prompt = buildPlayerPromptMessages(state, nominator, "chat", userContent);
  try {
    const content = await callPlayerLLM(state, prompt, config.temperature, nominator, "chat");
    return content.trim() || "我没什么想说的。";
  } catch (_) { return "我没什么想说的。"; }
}

async function aiNominationDefense(state, nominee) {
  const recentChat = formatChatForPrompt(state, 12, nominee, "chat");
  const privateInfo = formatPrivateInfoForPrompt(nominee, "chat", 4);
  const privateChatHistory = formatPlayerPrivateChats(state, nominee);
  const aliveDeadSummary = getAliveDeadSummary(state);
  const userContent = `公开聊天（最近增量）：\n${recentChat}\n
你的私聊记录：\n${privateChatHistory}\n
${aliveDeadSummary}
你被提名了。
你的私密信息增量：${privateInfo}
这是公开辩解，不要说心理活动或私密信息，不要在括号里写心里话。\n请用一小段话辩解。`;
  const prompt = buildPlayerPromptMessages(state, nominee, "chat", userContent);
  try {
    const content = await callPlayerLLM(state, prompt, config.temperature, nominee, "chat");
    return content.trim() || "我没什么想说的。";
  } catch (_) { return "我没什么想说的。"; }
}

async function aiVoteSingle(state, voter, nominee) {
  if (!voter.alive && voter.deadVoteUsed) return { vote: "no", reason: "遗言票已用" };
  const recentChat = formatChatForPrompt(state, 12, voter, "json");
  const privateInfo = formatPrivateInfoForPrompt(voter, "json", 4);
  const privateChatHistory = formatPlayerPrivateChats(state, voter);
  const aliveDeadSummary = getAliveDeadSummary(state);
  const deadVoteNote = !voter.alive ? "你已死亡，但仍有一次遗言票：只有投赞成才会生效，投反对不消耗。" : "";
  const userContent = `公开聊天（最近增量）：\n${recentChat}\n
你的私聊记录：\n${privateChatHistory}\n
${aliveDeadSummary}
你的当前状态：${voter.alive ? "存活" : "死亡"}。
${deadVoteNote}
你的私密信息增量：${privateInfo}
你需要对提名${nominee ? nominee.name : "某玩家"}投票。若你已知邪恶队友，请谨慎投他们，除非有明确牺牲/转移视线的理由。
reason 是公开可说的一小段话，可留空；不要泄露私密信息，不要输出心理活动/内心独白，不要在括号里写心里话。
请输出 JSON：{"vote":"yes|no","reason":"一小段话或空字符串"}`;
  const prompt = buildPlayerPromptMessages(state, voter, "json", userContent, { systemPrompt: PLAYER_JSON_SYSTEM_PROMPT });
  try {
    const content = await callPlayerLLM(state, prompt, config.temperature, voter, "json");
    const json = extractJson(content);
    if (!json) return { vote: "no", reason: "" };
    return { vote: json.vote === "yes" ? "yes" : "no", reason: json.reason || "" };
  } catch (_) { return { vote: "no", reason: "" }; }
}

function sanitizePublicReason(reason) {
  if (!reason || typeof reason !== "string") return "";
  let text = reason.trim();
  text = text.replace(/（[^）]*）/g, "").replace(/\([^)]*\)/g, "").replace(/【[^】]*】/g, "");
  const banned = ["内心", "心里", "心理活动", "思考过程", "作为恶魔", "我是恶魔", "我是爪牙", "我是坏人", "我是邪恶"];
  if (banned.some(key => text.includes(key))) return "";
  return text.slice(0, 40);
}

function canButlerVote(state, voter) {
  if (!voter || voter.roleName !== "管家") return true;
  if (!voter.alive) return true;
  if (isDroisoned(voter)) return true;
  if (!voter.butlerMasterId) return false;
  const master = state.players.find(p => p.id === voter.butlerMasterId);
  if (!master || !master.alive) return false;
  return Boolean(state.nominationVotes[master.id]);
}

async function runNomination(state) {
  if (state.ended) return;
  state.dayStage = "nomination";
  progressLog(state, "concise", `Day ${state.dayCount} nomination start`);
  state.nominationUsedIds = [];
  state.nomineeUsedIds = [];
  state.dayNominationCount = 0;
  state.dayHighestVotes = 0;
  state.dayHighestNomineeId = "";
  state.dayHighestTied = false;
  addChat(state, "说书人", "讨论结束，进入提名阶段。", "storyteller");
  addChat(state, "系统", "现在开始提名阶段（每人仅一次提名，每人最多被提名一次）。", "system");
  addLogEntry(state, "进入提名阶段", "phase");
  addReplayEvent(state, "进入提名阶段", "day_action");

  const alivePlayers = state.players.filter(p => p.alive);
  const maxNominations = Math.max(0, Number(config.maxNominationsPerDay) || 0);
  const nominations = [];
  const nominationSettledResults = await Promise.allSettled(
    alivePlayers.map(async (player) => {
      progressLog(state, "detailed", `Nomination intent | ${player.name}`);
      const result = await aiNominate(state, player);
      return { playerId: player.id, result };
    })
  );

  for (let index = 0; index < alivePlayers.length; index++) {
    if (state.ended) break;
    if (maxNominations > 0 && nominations.length >= maxNominations) break;

    const player = alivePlayers[index];
    if (!player) continue;
    state.nominationUsedIds.push(player.id);

    const settled = nominationSettledResults[index];
    if (!settled || settled.status !== "fulfilled") continue;

    const proposal = settled.value?.result;
    if (!proposal || !proposal.nomineeId) continue;
    if (state.nomineeUsedIds.includes(proposal.nomineeId)) continue;

    nominations.push({
      nominatorId: player.id,
      nomineeId: proposal.nomineeId,
      reason: proposal.reason
    });
    state.nomineeUsedIds.push(proposal.nomineeId);
  }

  for (const nom of nominations) {
    if (state.ended) break;
    if (maxNominations > 0 && state.dayNominationCount >= maxNominations) break;
    const nominator = state.players.find(p => p.id === nom.nominatorId);
    const nominee = state.players.find(p => p.id === nom.nomineeId);
    if (!nominator || !nominee) continue;
    state.dayNominationCount++;
    state.currentNomineeId = nominee.id;
    progressLog(state, "balanced", `Nomination | ${nominator.name} -> ${nominee.name}`);

    // Virgin check
    if (nominee.roleName === "贞洁者" && !nominee.virginUsed && nominator.team === "townsfolk" && !isDroisoned(nominee)) {
      nominee.virginUsed = true;
      nominator.alive = false;
      state.lastExecutedId = nominator.id;
      addChat(state, "说书人", `${nominator.name} 提名 ${nominee.name}，触发贞洁者。${nominator.name} 被处决。`, "storyteller");
      addReplayEvent(state, `贞洁者触发：${nominator.name} 被处决`, "day_action");
      if (nominator.roleName === "圣徒") {
        state.ended = true; state.winner = "evil"; state.winCondition = "saint_executed";
      }
      checkWin(state);
      if (!state.ended) {
        await compressDaySessions(state);
        switchPhase(state);
      }
      return;
    }

    addChat(state, "说书人", `${nominator.name} 提名 ${nominee.name}。`, "storyteller");
    addReplayEvent(state, `提名：${nominator.name} -> ${nominee.name}`, "day_action");
    addPublicLogEntry(state, `提名：${nominator.name} -> ${nominee.name}`);

    // Reason & Defense
    state.nominationPhase = "reason";
    const reason = nom.reason?.trim() || await aiNominationReason(state, nominator, nominee);
    addChat(state, nominator.name, reason, "player");
    state.nominationPhase = "defense";
    const defense = await aiNominationDefense(state, nominee);
    addChat(state, nominee.name, defense, "player");

    // Voting
    state.nominationPhase = "voting";
    state.nominationVotes = {};
    state.players.forEach(p => {
      if (!p.alive && p.deadVoteUsed) state.nominationVotes[p.id] = { vote: "no", reason: "遗言票已用" };
    });
    const voters = state.players.filter(p => !state.nominationVotes[p.id]);
    for (const voter of voters) {
      progressLog(state, "detailed", `Vote intent | ${voter.name} on ${nominee.name}`);
      const voteResult = await aiVoteSingle(state, voter, nominee);
      state.nominationVotes[voter.id] = { vote: voteResult.vote, reason: sanitizePublicReason(voteResult.reason) };
      if (!voter.alive && voteResult.vote === "yes") voter.deadVoteUsed = true;
      addChat(state, "系统", `${voter.name} 投票：${voteResult.vote === "yes" ? "赞成" : "反对"}`, "system");
    }

    // Tally
    const aliveCount = state.players.filter(p => p.alive).length;
    let yesVotes = 0;
    state.players.forEach(p => {
      let vote = state.nominationVotes[p.id]?.vote || "no";
      if (p.roleName === "管家" && !canButlerVote(state, p)) vote = "no";
      if (vote === "yes") yesVotes++;
    });
    progressLog(state, "balanced", `Vote result | ${nominee.name} yes=${yesVotes}/${aliveCount}`);
    addReplayEvent(state, `投票结果：赞成${yesVotes}/${aliveCount}`, "day_action");

    if (yesVotes > state.dayHighestVotes) {
      state.dayHighestVotes = yesVotes;
      state.dayHighestNomineeId = nominee.id;
      state.dayHighestTied = false;
    } else if (yesVotes === state.dayHighestVotes && yesVotes > 0) {
      state.dayHighestTied = true;
      state.dayHighestNomineeId = "";
    }
    state.nominationPhase = "open";
  }

  await finalizeDayExecution(state);
}

async function compressOneSession(state, player, sessionKey) {
  const session = getMessageSession(player, sessionKey);
  if (!session || session.length === 0) return;

  const systemMsgs = [];
  const historyMsgs = [];
  for (const msg of session) {
    if (msg.role === "system") systemMsgs.push(msg);
    else historyMsgs.push(msg);
  }
  if (historyMsgs.length === 0) return;

  const apparentRole = getApparentRole(player);
  const roleName = apparentRole ? apparentRole.name : "未知";
  const campLabel = (player.team === "minion" || player.team === "demon") ? "邪恶阵营" : "善良阵营";
  const aliveDeadSummary = getAliveDeadSummary(state);

  const historyText = historyMsgs.map(m => `[${m.role}] ${m.content}`).join("\n---\n");
  const summaryPrompt = [
    { role: "system", content: [
      "你是《血染钟楼》的一名玩家，正在进行一场重要的对局。",
      `你是${player.name}，身份是${roleName}，属于${campLabel}。`,
      `${aliveDeadSummary}`,
      "现在白天结束了，你需要回顾并总结这一天（包括之前夜晚的信息和白天的讨论、提名、投票）的所有关键信息。",
      "这份总结将是你后续做出所有决策的唯一依据，因此必须完整、准确、不遗漏任何对推理和判断有价值的信息。",
      "请重点记录：",
      "1. 每个玩家声称的身份和提供的信息（谁跳了什么身份，谁提供了什么线索）",
      "2. 你自己获得的私密信息和技能结果",
      "3. 投票和处决结果（谁提名了谁，票数如何，谁被处决了）",
      "4. 死亡信息（夜晚谁死了，白天谁被处决了）",
      "5. 你的推理和怀疑（谁可能是邪恶的，谁的信息可能矛盾）",
      "6. 重要的对话和争论要点",
      "只输出总结内容，不要输出其他任何内容。"
    ].join("\n") },
    { role: "user", content: `请总结你（${player.name}）截至白天${state.dayCount}结束的游戏记录：\n\n${historyText}` }
  ];

  try {
    const content = await callPlayerLLM(state, summaryPrompt, 0.3, player, "summary");
    const summaryText = (content || "").trim();
    if (!summaryText) return;

    // Replace session: keep system msgs + add summary
    session.length = 0;
    session.push(...systemMsgs);
    session.push({ role: "system", content: `[白天${state.dayCount}结束时的游戏进程总结]\n${summaryText}` });

    // Clean up summary session to avoid accumulation
    if (player.messageSessions && player.messageSessions["summary"]) {
      player.messageSessions["summary"] = [];
    }

    markActorPromptCursors(state, player, sessionKey);
    progressLog(state, "detailed", `Session compressed | ${player.name} | session=${sessionKey}`);
  } catch (e) {
    progressLog(state, "detailed", `Session compress failed | ${player.name} | session=${sessionKey} | ${e.message || e}`);
  }
}

async function compressDaySessions(state) {
  progressLog(state, "balanced", `Day ${state.dayCount} session compression start`);
  for (const player of state.players) {
    if (!player.alive) continue;
    for (const sessionKey of ["chat", "json"]) {
      await compressOneSession(state, player, sessionKey);
    }
  }
  progressLog(state, "balanced", `Day ${state.dayCount} session compression done`);
}

async function finalizeDayExecution(state) {
  const aliveCount = state.players.filter(p => p.alive).length;
  const threshold = Math.ceil(aliveCount / 2);
  if (state.dayNominationCount === 0) {
    state.lastExecutedId = "";
    addChat(state, "说书人", "无人提名，进入夜晚。", "storyteller");
    addReplayEvent(state, "无人提名，进入夜晚", "day_action");
    progressLog(state, "concise", `Day ${state.dayCount} end | no nomination`);
  } else if (state.dayHighestNomineeId && !state.dayHighestTied && state.dayHighestVotes >= threshold) {
    const nominee = state.players.find(p => p.id === state.dayHighestNomineeId);
    if (nominee && nominee.alive) {
      nominee.alive = false;
      state.lastExecutedId = nominee.id;
      addChat(state, "说书人", `${nominee.name} 被处决。`, "storyteller");
      addReplayEvent(state, `处决：${nominee.name}`, "day_action");
      progressLog(state, "concise", `Day ${state.dayCount} execution | ${nominee.name}`);
      if (nominee.roleName === "圣徒") {
        state.ended = true; state.winner = "evil"; state.winCondition = "saint_executed";
      }
    }
  } else {
    state.lastExecutedId = "";
    const reason = state.dayHighestTied ? "最高票平票" : `最高票不足半数（需${threshold}票）`;
    addChat(state, "说书人", `提名结束，${reason}，无人被处决。`, "storyteller");
    addReplayEvent(state, `提名结束无人被处决（${reason}）`, "day_action");
    progressLog(state, "concise", `Day ${state.dayCount} end | no execution (${reason})`);
  }
  checkWin(state);
  if (state.ended) return;
  const alive = state.players.filter(p => p.alive);
  if (alive.some(p => p.roleName === "镇长") && alive.length === 3 && !state.lastExecutedId) {
    state.ended = true; state.winner = "good"; state.winCondition = "mayor_win";
    return;
  }
  await compressDaySessions(state);
  switchPhase(state);
}

/* ═══════════════════════════════════════════════════════════
 *  SECTION 8: MAIN GAME LOOP
 * ═══════════════════════════════════════════════════════════ */

async function runDiscussion(state) {
  state.dayStage = "discussion";
  addChat(state, "说书人", "白天讨论开始。", "storyteller");
  addLogEntry(state, "进入讨论阶段", "phase");
  const rounds = config.discussionRounds || 3;
  progressLog(state, "concise", `Day ${state.dayCount} discussion start | rounds=${rounds}`);
  for (let round = 0; round < rounds; round++) {
    progressLog(state, "balanced", `Day ${state.dayCount} discussion round ${round + 1}/${rounds}`);
    for (const player of state.players) {
      if (state.ended) return;
      if (!player.alive) continue;
      await aiSpeak(state, player);
      // Private chat only on day 1
      if (state.dayCount === 1) {
        await maybeAiPrivateChat(state, player);
      }
    }
  }
}

async function runOneGame(gameConfig) {
  const startTime = Date.now();
  const state = createGameState();
  state.progress.gameId = gameConfig.gameId;

  // 1. Setup players and assign roles
  setupPlayers(state, gameConfig.assignments);
  if (gameConfig.assignments[0] && gameConfig.assignments[0].roleName) {
    // Preset board mode
    assignRolesFromBoard(state, gameConfig.assignments);
    if (gameConfig.redHerringSeat > 0) {
      state.redHerringId = state.players[gameConfig.redHerringSeat - 1].id;
    }
    if (gameConfig.bluffs && gameConfig.bluffs.length) {
      state.presetBluffs = gameConfig.bluffs;
    }
  } else {
    assignRoles(state, gameConfig.seed, gameConfig.assignments);
  }
  state.started = true;
  state.phase = "night";
  state.nightCount = 1;

  console.log(`    Players: ${state.players.map(p => `${p.name}(${p.roleName})`).join(", ")}`);
  progressLog(state, "concise", `Game start | seed=${gameConfig.seed}`);

  // 2. First night
  await resolveNight(state);

  // 3. Main game loop
  let daysSoFar = 0;
  while (!state.ended && daysSoFar < config.maxDays) {
    // Day (switchPhase already happened inside resolveNight)
    if (state.phase !== "day") break;
    daysSoFar++;
    await runDiscussion(state);
    if (state.ended) break;
    await runNomination(state);
    if (state.ended) break;
    // Night (switchPhase already happened inside finalizeDayExecution)
    if (state.phase !== "night") break;
    await resolveNight(state);
  }

  // Force end if max days exceeded
  if (!state.ended) {
    state.ended = true;
    state.winner = "draw";
    state.winCondition = "max_days_exceeded";
    addChat(state, "系统", `游戏超过${config.maxDays}天，强制结束（平局）。`, "system");
    progressLog(state, "concise", `Game forced end | max_days_exceeded`);
  }

  const durationMs = Date.now() - startTime;
  progressLog(
    state,
    "concise",
    `Game end | winner=${state.winner} condition=${state.winCondition} days=${state.dayCount} cost=$${Object.values(state.tokenUsage).reduce((sum, u) => sum + (u.cost || 0), 0).toFixed(3)} duration=${Math.round(durationMs / 1000)}s`
  );

  // Build result
  return {
    gameId: gameConfig.gameId,
    groupIndex: gameConfig.groupIndex,
    seed: gameConfig.seed,
    timestamp: new Date().toISOString(),
    playerCount: state.players.length,
    players: state.players.map((p, i) => ({
      seat: i + 1,
      model: p.model,
      apiModel: p.apiModel || p.model,
      name: p.name,
      role: p.roleName,
      apparentRole: p.apparentRoleName,
      team: p.team,
      alive: p.alive,
      roleHistory: p.roleHistory
    })),
    winner: state.winner,
    winCondition: state.winCondition,
    totalDays: state.dayCount,
    totalNights: state.nightCount,
    tokenUsage: state.tokenUsage,
    totalCost: Object.values(state.tokenUsage).reduce((sum, u) => sum + (u.cost || 0), 0),
    durationMs,
    chatLog: state.chat,
    privateChat: state.privateChat,
    replayEvents: state.replayEvents,
    trajectoryLog: state.trajectoryLog
  };
}

module.exports = { runOneGame };
