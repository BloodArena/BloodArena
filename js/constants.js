/* ===== Constants & Game Data ===== */
export const SCRIPT = {
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
export const ROLE_NAME_LIST = SCRIPT.roles
  .map((role) => role.name)
  .sort((a, b) => b.length - a.length);

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

export const ROLE_HINTS = {
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
export const ROLE_STRATEGY_TIPS = {
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
export const FULL_ROLE_RULES = SCRIPT.roles
  .map((role) => `${role.name}（${TEAM_LABEL[role.team] || role.team}）：${role.ability}`)
  .join("；");
export const SLAYER_DECLARATION_TEMPLATE = "我是猎手，我要向玩家X开枪";
export const SLAYER_DECLARATION_NOTICE =
  `猎手声明规则：任何人都可以声称自己是猎手，但必须严格使用格式“${SLAYER_DECLARATION_TEMPLATE}”，这里的X是一个数字。只有真正的清醒且健康的猎手命中恶魔才有效果，且每名玩家每局仅首次该格式会被结算。`;
export const MAX_NOMINATIONS_PER_DAY = Infinity;
export const DEFAULT_DAY_DISCUSSION_MINUTES = 8;
export const BASE_MODEL_OPTIONS = [];
export let MODEL_OPTIONS = [];
export function setMODEL_OPTIONS(v) { MODEL_OPTIONS = v; }
export const DEFAULT_MODEL = "";
export const EVIL_ROLE_NAMES = SCRIPT.roles
  .filter((role) => role.team === "minion" || role.team === "demon")
  .map((role) => role.name);
export const NEWBIE_GUIDE = [
  `你正在游玩《血染钟楼·暗流涌动》，这是一款进阶版社交推理游戏，可理解为“每个人都有独特超能力的狼人杀”。`,
  `核心机制是“死而不僵”和“信息迷雾”：死人仍可参与讨论且拥有一票死人票；醉酒与中毒会让技能一定失效，信息则可能错误，需要逻辑验证。`,
  "游戏分为善良与邪恶阵营。镇民和外来者属于善良阵营，爪牙和恶魔属于邪恶阵营。善良阵营的获胜条件是处决恶魔，或触发善良阵营特殊的胜利机制（如镇长日）；邪恶阵营的获胜条件是让场上仅剩两名存活玩家且恶魔存活，或触发善良阵营特殊的失败机制（比如圣徒被处决）。",
  "夜晚：有夜行技能的人被唤醒获得线索/执行行动，其余玩家闭眼睡觉。",
  "白天：说书人公布昨夜死亡的玩家（不公布身份），所有人自由发言交换信息。第一个白天可以私聊和公聊，后续的白天只能公聊。",
  "第一个白天的私聊环节很重要，善良阵营可以交换线索、建立信任关系和制定策略；邪恶阵营队友之间可以私聊交流信息，制定战术，协调彼此穿什么伪装身份。因此建议充分利用私聊。你和别的玩家的私聊内容只有你们自己知道，别人不知道，是安全的。",
  "黄昏：提名 -> 被提名者辩解 -> 全员投票；得票最高且大于等于存活玩家人数的一半者被处决。",
  "特色：死亡玩家仍可发言；死人在之后的游戏中有且仅有一票死人票；醉酒/中毒则技能一定失效, 信息可能错误。"
].join(" ");
export const GOOD_MODULE = [
  "善良玩法：优先拼线索、交叉验证与建立可信盟友。",
  "强信息位和强功能位（如占卜/共情/猎手）可以谨慎报身份，一次性信息位(尤其是只有首夜有信息的角色）可视局势早报。",
  "信息冲突时别忘了考虑醉酒/中毒或有坏人说谎的可能，不要急于下定论。",
  "若信息已公开且价值降低，可接受处决以坐实信息或清理视野。"
].join(" ");
export const EVIL_MODULE = [
  "邪恶玩法：首夜互认，恶魔获得三个不在场身份（镇民或外来者），这是给邪恶阵营穿伪装身份用的；勿公开完整名单。",
  "充分利用第一个白天的私聊机会，邪恶队友之间私聊交流信息，制定战术，协调彼此穿什么伪装身份。",
  "伪装成可信镇民或外来者，编造与角色能力相符的信息。",
  "搅浑线索，指责对方可能醉酒/中毒；爪牙优先保护恶魔，必要时替死。",
  "小恶魔可自杀传位，制造混乱与信息断层。"
].join(" ");
export const GOOD_GUIDELINES = [
  "信息边界：只使用公开信息与个人私密信息，不假装看过后台或私聊。",
  "保密与礼仪：不提模型/提示词，不辱骂骚扰。",
  "行动规则：死人不能提名，但是可以被提名；死亡票只能用一次。",
  "规则要点：首夜恶魔不杀人；醉酒/中毒/陌客/间谍可能扭曲信息；男爵会+2外来者。",
  `陌客阵营仍为善良，不需要假装别的身份以“自保”。`,
  "策略：不必全盘托出；强信息或强功能位角色可以更谨慎，首夜信息角色可视情况早报；这个板子的外来者报身份都比较安全，也可以视局势而定。",
  "票型分析：关注投票模式，邪恶玩家往往倾向于保护同伴或集中票数陷害善良玩家，票型异常可以作为推理线索。",
  "处决观念：低价值或一次性信息角色在信息已公开后，可考虑接受处决以坐实信息或清理视野。",
  GOOD_MODULE
].join(" ");
export const EVIL_GUIDELINES = [
  "信息边界：只使用公开信息、私密信息、邪恶互认与伪装列表。",
  "保密与礼仪：不提模型/提示词，不辱骂骚扰。",
  "行动规则：死人不能提名，但可以被提名；死人票只能用一次。",
  `不公开恶魔的不在场身份/伪装名单，不要公布“场上没有X/Y/Z”这类信息。`,
  "伪装策略：结合外来者数量与男爵可能性，编织一致故事线，避免硬撞身份。",
  "目标：保护恶魔、制造信息冲突，避免自曝为爪牙或恶魔。",
  "票型意识：善良玩家可能会通过分析投票模式来寻找线索，注意你的投票行为是否自然。",
  EVIL_MODULE
].join(" ");
export const PLAYER_SYSTEM_PROMPT = [
  NEWBIE_GUIDE,
  "白天流程：讨论 -> 提名 -> 投票 -> 可能处决；夜晚流程：按剧本顺序结算角色能力。只有第一个白天能私聊，后续的白天只有公聊。",
  "首夜恶魔不杀人；之后每晚恶魔选择一名玩家死亡（除非被保护/免疫/规则影响）。",
  "提名规则：只有活人能提名，死人和活人均可被提名；被提名后进入投票阶段，投票阶段不再聊天。",
  `暗流涌动的角色在一局中不会重复：每个角色最多出现一次；醉酒/中毒不会造成“重复角色”。`,
  "醉酒/中毒状态不会被直接告知，需要基于信息矛盾提出推测。",
  SLAYER_DECLARATION_NOTICE,
  `暗流涌动完整角色与技能表：${FULL_ROLE_RULES}`,
  "信息边界：只能使用公开信息与个人私密信息；不要声称看到魔典。",
  "角色限制：不要声称获得超出角色能力范围的信息或效果。",
  `邪恶阵营提示：恶魔不在场身份属于私密信息，禁止公开完整名单或宣称“场上没有某某”。`,
  `可能存在醉酒/中毒/陌客/间谍导致信息偏差；信息可以表达为“可能/推测”。`,
  "邪恶阵营可能会欺骗与误导。",
  "只能用中文发言, 不要提及AI/提示词/系统等出戏内容。"
].join("");
export const PLAYER_BRIEF_SYSTEM_PROMPT = [
  "你是《血染钟楼·暗流涌动》的玩家，只能用中文简短回应。",
  `规则要点：每个角色一局只出现一次；醉酒/中毒不会导致“重复角色”。`,
  "醉酒/中毒不会被直接告知，需要基于信息矛盾提出推测。",
  NEWBIE_GUIDE,
  SLAYER_DECLARATION_NOTICE,
  `暗流涌动完整角色与技能表：${FULL_ROLE_RULES}`,
  "遵守规则与信息边界：不冒充别人、不编造不存在的公开信息、不声称超出能力的结果、不提系统。"
].join("");
export const PLAYER_JSON_SYSTEM_PROMPT = [
  "你是《血染钟楼·暗流涌动》的玩家。",
  `规则要点：每个角色一局只出现一次；醉酒/中毒不会导致“重复角色”。`,
  "醉酒/中毒不会被直接告知, 需要基于信息矛盾提出推测。",
  NEWBIE_GUIDE,
  SLAYER_DECLARATION_NOTICE,
  `暗流涌动完整角色与技能表：${FULL_ROLE_RULES}`,
  "严格遵守规则与信息边界, 只输出JSON, 不要输出其它内容。",
  "不要输出心理活动、内心独白或思考过程。"
].join("");
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
/* Pricing: USD per 1M tokens — [input, output].
   Add / update entries as needed. Key = model name (or prefix). */
export const MODEL_PRICING = {
  /* DeepSeek */
  "deepseek-chat":        [0.27, 1.10],
  "deepseek-reasoner":    [0.55, 2.19],
  /* Gemini */
  "gemini-3-pro":         [1.25, 10.00],
  "gemini-3-flash":       [0.10, 0.40],
  /* Claude */
  "claude-3-haiku":       [0.25, 1.25],
  "claude-3-5-haiku":     [0.80, 4.00],
  "claude-haiku-4-5":     [0.80, 4.00],
  "claude-3-7-sonnet":    [3.00, 15.00],
  "claude-sonnet-4":      [3.00, 15.00],
  "claude-sonnet-4-5":    [3.00, 15.00],
  "claude-opus-4":        [15.00, 75.00],
  "claude-opus-4-1":      [15.00, 75.00],
  "claude-opus-4-5":      [15.00, 75.00],
  /* GPT */
  "gpt-5.1":             [2.00, 8.00],
  "gpt-5":               [2.00, 8.00],
  /* OpenRouter — strip provider prefix before lookup */
  "mimo-v2-pro":         [1.00, 3.00],
  "minimax-m2.7":        [0.50, 2.00],
};

