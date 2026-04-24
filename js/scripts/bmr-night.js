import { state } from '../state.js';
import { SCRIPT, STORYTELLER_LLM_ENABLED, getPlayerJsonSystemPrompt, getFullRoleRules } from '../constants.js';
import { getCurrentEdition } from './edition-registry.js';
import { getRoleById, getApparentRole, shuffle, sleep, extractJson, getPromptName, playerOptionLabel } from '../utils.js';
import { callDeepSeek } from '../api.js';
import { addChat, addLogEntry, addReplayEvent } from '../chat.js';
import { renderAll, renderHumanInfo } from '../ui-helpers.js';
import { checkWin, switchPhase, needsHumanNightAction, isHumanActionReady, clearAutoNightTimer } from '../game-logic.js';
import { getPhaseLabel, getInfoRolePlayer, formatPrivateInfoForPrompt, formatChatForPrompt, buildPlayerPromptMessages, getAliveDeadSummary } from '../prompts.js';
import { formatPlayerPrivateChats } from '../chat.js';
import {
  isDroisoned, getSeatingSummary, getGrimoireSummary, getStorytellerBalanceSummary,
  getClaimsSummary, getDemonSummaries, setPrivateInfo, applyPoison,
  recordFirstNightRecognition, recordInfoAudit, recordInfoDistortion, recordRoleChange,
  chooseRandomTarget, resolveInfoResult, getAliveNeighbors, registerEditionNightResolver,
  makeRolePair, maybeAlterNumber
} from '../night-actions.js';

function getTempValue() {
  const el = document.getElementById("tempInput");
  return el ? Number(el.value) || 1.0 : 1.0;
}

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
    systemPrompt: getPlayerJsonSystemPrompt()
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
    systemPrompt: getPlayerJsonSystemPrompt()
  });
  try {
    const content = await callDeepSeek(prompt, getTempValue(), actor, "json");
    const json = extractJson(content);
    const t1 = json ? resolveTargetByName(json.target1, candidates, actor) : null;
    const t2 = json ? resolveTargetByName(json.target2, candidates, actor) : null;
    if (t1 && t2 && t1.id !== t2.id) return [t1, t2];
  } catch (error) {}
  return candidates.slice(0, 2);
}

function getTeaLadyProtection() {
  const teaLady = state.players.find(p => p.alive && (p.roleName === "茶艺师" || (p.drunk && p.apparentRoleName === "茶艺师")));
  if (!teaLady || isDroisoned(teaLady)) return new Set();
  const idx = state.players.indexOf(teaLady);
  const neighbors = getAliveNeighbors(idx);
  if (neighbors.length === 2 && neighbors.every(n => n.team === "townsfolk" || n.team === "outsider")) {
    return new Set(neighbors.map(n => n.id));
  }
  return new Set();
}

function canDieAtNight(player, bypassProtection = false) {
  if (bypassProtection) return true;
  if (player.protected) return false;
  if (player.innkeeperProtectedIds && player.innkeeperProtectedIds.includes && false) return false;
  const teaProtected = getTeaLadyProtection();
  if (teaProtected.has(player.id)) return false;
  const sailor = state.players.find(p => p.alive && p.roleName === "水手" && !isDroisoned(p));
  if (sailor && sailor.id === player.id) return false;
  if (player.roleName === "弄臣" && !player.foolUsed && !isDroisoned(player)) {
    player.foolUsed = true;
    addReplayEvent(`弄臣保护触发：${player.name}`, "night_action");
    return false;
  }
  return true;
}

async function storytellerDecideBMR(context, question) {
  const ed = getCurrentEdition();
  const instructionParts = [
    `你是《血染钟楼·${ed.name}》的说书人。`,
    "## 策略原则",
    "除非邪恶阵营已经优势巨大，否则你应该优先帮助邪恶阵营。",
    "",
    "## 座位与玩家（玩家坐成一圈）",
    getSeatingSummary(),
    "",
    "## 魔典（说书人可见的完整信息）",
    getGrimoireSummary(),
    "",
    "## 完整角色能力表",
    getFullRoleRules(),
    "",
    context || "",
    "",
    `只输出 JSON，不要包含任何额外文本。`
  ];
  const demonSummaries = getDemonSummaries();
  if (demonSummaries) {
    instructionParts.push("", "## 恶魔的每日总结", demonSummaries);
  }
  const prompt = [
    { role: "system", content: instructionParts.join("\n") },
    { role: "user", content: [
      `当前局势：${getStorytellerBalanceSummary()}`,
      question
    ].join("\n") }
  ];
  try {
    const content = await callDeepSeek(prompt, 0.2, null, "storyteller", false);
    return extractJson(content);
  } catch (_) { return null; }
}


export async function resolveNightBMR() {
  if (!state.started || state.phase !== "night") return;
  if (state.paused) return;
  if (needsHumanNightAction() && !isHumanActionReady()) {
    addChat("系统", "请先确认你的夜晚行动。", "system");
    return;
  }
  clearAutoNightTimer();
  try {
    if (state.nightCount === 1 && !state.firstNightRecognitionDone) {
      recordFirstNightRecognitionBMR();
    }
    applyPoison();
    state.players.forEach((p) => { p.protected = false; });
    state.innkeeperProtectedIds = [];

    const human = state.players.find((p) => p.isHuman);
    const demon = state.players.find((p) => p.team === "demon" && p.alive);
    const demonRole = demon ? demon.roleName : "";

    const sailor = state.players.find(p => p.roleName === "水手" && p.alive);
    const innkeeper = state.players.find(p => p.roleName === "旅店老板" && p.alive);
    const courtier = state.players.find(p => p.roleName === "侍臣" && p.alive && !p.courtierUsed);
    const gambler = state.players.find(p => p.roleName === "赌徒" && p.alive);
    const devilsAdvocate = state.players.find(p => p.roleName === "魔鬼代言人" && p.alive);
    const exorcist = state.players.find(p => p.roleName === "驱魔人" && p.alive);
    const assassin = state.players.find(p => p.roleName === "刺客" && p.alive && !p.assassinUsed);
    const godfather = state.players.find(p => p.roleName === "教父" && p.alive);
    const professor = state.players.find(p => p.roleName === "教授" && p.alive && !p.professorUsed);
    const chambermaid = state.players.find(p => (p.roleName === "侍女" || (p.drunk && p.apparentRoleName === "侍女")) && p.alive);
    const grandmother = state.players.find(p => p.roleName === "祖母" && p.alive);

    let killedThisNight = [];
    let wokenRoles = new Set();
    let exorcised = false;

    // === 1. Sailor: choose player, one becomes drunk ===
    if (sailor) {
      wokenRoles.add("水手");
      let target = null;
      if (human && human.roleName === "水手" && state.humanActionTarget) {
        target = state.players.find(p => p.id === state.humanActionTarget);
      } else {
        const candidates = state.players.filter(p => p.alive);
        target = await aiChooseSingleTarget(sailor, candidates, "选择一名玩家：你或他醉酒");
        if (!target) target = chooseRandomTarget(sailor, true);
      }
      if (target && !isDroisoned(sailor)) {
        const drunkSailor = (target.team === "minion" || target.team === "demon") ? true : Math.random() < 0.3;
        if (drunkSailor) {
          sailor.drunk = true;
          sailor.sailorDrunkTargetId = "";
          addReplayEvent(`水手醉酒：${sailor.name}`, "night_action");
        } else {
          target.drunk = true;
          sailor.sailorDrunkTargetId = target.id;
          addReplayEvent(`水手选择 ${sailor.name} -> ${target.name} 醉酒`, "night_action");
        }
      }
    }

    // === 2. Innkeeper (not first night) ===
    if (innkeeper && state.nightCount > 1) {
      wokenRoles.add("旅店老板");
      let targets = [];
      if (human && human.roleName === "旅店老板" && state.humanActionTarget && state.humanActionTarget2) {
        const t1 = state.players.find(p => p.id === state.humanActionTarget);
        const t2 = state.players.find(p => p.id === state.humanActionTarget2);
        targets = [t1, t2].filter(Boolean);
      } else {
        const candidates = state.players.filter(p => p.alive);
        targets = await aiChooseTwoTargets(innkeeper, candidates, "选择两名玩家保护（其中一人醉酒）");
      }
      if (targets.length === 2 && !isDroisoned(innkeeper)) {
        targets.forEach(t => { t.protected = true; });
        state.innkeeperProtectedIds = targets.map(t => t.id);
        const drunkTarget = targets.find(t => t.team === "townsfolk" || t.team === "outsider") || targets[0];
        drunkTarget.drunk = true;
        addReplayEvent(`旅店老板保护 ${targets.map(t=>t.name).join("、")}，${drunkTarget.name}醉酒`, "night_action");
      }
    }

    // === 3. Courtier (if choosing to use) ===
    if (courtier && !courtier.courtierUsed) {
      wokenRoles.add("侍臣");
      // AI courtier decides whether to use ability
      // For simplicity, skip auto-use on first night, AI decides on other nights
    }

    // === 4. Gambler (not first night) ===
    if (gambler && state.nightCount > 1) {
      wokenRoles.add("赌徒");
      if (!isDroisoned(gambler)) {
        // AI gambler guesses a player's role
        const candidates = state.players.slice();
        const prompt = buildPlayerPromptMessages(gambler, "json",
          `你是赌徒。选择一名玩家并猜测其角色。猜错会死亡！猜自己是赌徒是安全的。\n请输出 JSON：{"target":"玩家名","guess":"角色名"}`,
          { systemPrompt: getPlayerJsonSystemPrompt() });
        try {
          const content = await callDeepSeek(prompt, getTempValue(), gambler, "json");
          const json = extractJson(content);
          if (json && json.target && json.guess) {
            const target = state.players.find(p => p.name === normalizeTargetName(json.target));
            if (target) {
              const correct = target.roleName === json.guess;
              addReplayEvent(`赌徒猜测：${gambler.name} -> ${target.name} 是 ${json.guess}（${correct ? "正确" : "错误"}）`, "night_action");
              if (!correct) {
                gambler.alive = false;
                gambler.appearsAlive = false;
                killedThisNight.push(gambler);
                addReplayEvent(`赌徒猜错死亡：${gambler.name}`, "night_action");
              }
            }
          }
        } catch (_) {}
      }
    }

    // === 5. Devil's Advocate ===
    if (devilsAdvocate) {
      wokenRoles.add("魔鬼代言人");
      const candidates = state.players.filter(p => p.alive && p.id !== devilsAdvocate.exorcistLastTargetId);
      let target = null;
      if (human && human.roleName === "魔鬼代言人" && state.humanActionTarget) {
        target = state.players.find(p => p.id === state.humanActionTarget);
      } else {
        target = await aiChooseSingleTarget(devilsAdvocate, candidates, "选择一名玩家：明天他被处决不会死");
        if (!target) target = chooseRandomTarget(devilsAdvocate, false);
      }
      if (target && !isDroisoned(devilsAdvocate)) {
        devilsAdvocate.devilsAdvocateTargetId = target.id;
        addReplayEvent(`魔鬼代言人保护 ${target.name}`, "night_action");
      }
      devilsAdvocate.exorcistLastTargetId = target ? target.id : "";
    }

    // === 6. Exorcist (not first night) ===
    if (exorcist && state.nightCount > 1) {
      wokenRoles.add("驱魔人");
      const candidates = state.players.filter(p => p.alive && p.id !== exorcist.exorcistLastTargetId);
      let target = null;
      if (human && human.roleName === "驱魔人" && state.humanActionTarget) {
        target = state.players.find(p => p.id === state.humanActionTarget);
      } else {
        target = await aiChooseSingleTarget(exorcist, candidates, "选择一名玩家（不能重复上夜）：若选中恶魔则恶魔不行动");
        if (!target) target = chooseRandomTarget(exorcist, false);
      }
      if (target && !isDroisoned(exorcist)) {
        exorcist.exorcistLastTargetId = target.id;
        if (target.team === "demon") {
          exorcised = true;
          setPrivateInfo(target, `驱魔人对你生效，你今晚无法行动。驱魔人是${exorcist.name}。`);
          addReplayEvent(`驱魔人命中恶魔：${exorcist.name} -> ${target.name}`, "night_action");
        }
      } else {
        if (exorcist) exorcist.exorcistLastTargetId = target ? target.id : "";
      }
    }

    // === 7-10. Demon kills (if not exorcised) ===
    let demonTargets = [];
    if (demon && state.nightCount > 1 && !exorcised) {
      if (demonRole === "僵怖") {
        // Zombuul: only kills if no one died today
        if (!state.deathsToday || state.deathsToday === 0) {
          wokenRoles.add("僵怖");
          let target = await aiChooseSingleTarget(demon, state.players.filter(p => p.alive || (p.id === demon.id)), "选择一名玩家死亡（僵怖击杀，仅当白天无人死亡时）");
          if (!target) target = chooseRandomTarget(demon, false);
          if (target) demonTargets = [target];
        }
      } else if (demonRole === "普卡") {
        wokenRoles.add("普卡");
        // Kill previous victim
        if (state.pukkaVictimId) {
          const prevVictim = state.players.find(p => p.id === state.pukkaVictimId && p.alive);
          if (prevVictim && canDieAtNight(prevVictim)) {
            prevVictim.alive = false;
            prevVictim.appearsAlive = false;
            killedThisNight.push(prevVictim);
            addReplayEvent(`普卡延迟击杀：${prevVictim.name}`, "night_action");
          }
          // Clear poison from previous victim
          const oldVictim = state.players.find(p => p.id === state.pukkaVictimId);
          if (oldVictim) { oldVictim.poisoned = false; }
        }
        // Poison new target
        let target = await aiChooseSingleTarget(demon, state.players.filter(p => p.alive && p.id !== demon.id), "选择一名玩家中毒（普卡）");
        if (!target) target = chooseRandomTarget(demon, false);
        if (target && !isDroisoned(demon)) {
          target.poisoned = true;
          target.poisonedUntilDay = 999;
          state.pukkaVictimId = target.id;
          addReplayEvent(`普卡中毒：${target.name}`, "night_action");
        }
      } else if (demonRole === "沙巴洛斯") {
        wokenRoles.add("沙巴洛斯");
        // May regurgitate one previously killed target
        if (demon.shabalothLastTargets && demon.shabalothLastTargets.length) {
          const deadTargets = demon.shabalothLastTargets
            .map(id => state.players.find(p => p.id === id && !p.alive))
            .filter(Boolean);
          if (deadTargets.length && Math.random() < 0.3) {
            const revived = deadTargets[Math.floor(Math.random() * deadTargets.length)];
            revived.alive = true;
            revived.appearsAlive = true;
            addReplayEvent(`沙巴洛斯复活：${revived.name}`, "night_action");
            addChat("说书人", `${revived.name} 在夜晚复活了。`, "storyteller");
          }
        }
        // Kill 2 targets
        const candidates = state.players.filter(p => p.alive && p.id !== demon.id);
        const targets = await aiChooseTwoTargets(demon, candidates, "选择两名玩家死亡（沙巴洛斯）");
        demonTargets = targets;
        demon.shabalothLastTargets = targets.map(t => t.id);
      } else if (demonRole === "珀") {
        wokenRoles.add("珀");
        if (!demon.poLastAttacked) {
          // Triple kill
          const candidates = state.players.filter(p => p.alive && p.id !== demon.id);
          const prompt = buildPlayerPromptMessages(demon, "json",
            `你是珀。你上次没有攻击，本次必须选择三名玩家死亡。\n可选目标：${candidates.map(p=>playerOptionLabel(p)).join("、")}\n请输出 JSON：{"target1":"玩家名","target2":"玩家名","target3":"玩家名"}`,
            { systemPrompt: getPlayerJsonSystemPrompt() });
          try {
            const content = await callDeepSeek(prompt, getTempValue(), demon, "json");
            const json = extractJson(content);
            if (json) {
              const t1 = resolveTargetByName(json.target1, candidates, demon);
              const t2 = resolveTargetByName(json.target2, candidates, demon);
              const t3 = resolveTargetByName(json.target3, candidates, demon);
              demonTargets = [t1, t2, t3].filter(Boolean);
            }
          } catch (_) {
            demonTargets = shuffle(candidates).slice(0, 3);
          }
          demon.poLastAttacked = true;
        } else {
          // Choose 1 or skip
          const prompt = buildPlayerPromptMessages(demon, "json",
            `你是珀。你可以选择一名玩家死亡，或者选择不攻击（下次可以三连杀）。\n请输出 JSON：{"target":"玩家名"} 或 {"target":"不攻击"}`,
            { systemPrompt: getPlayerJsonSystemPrompt() });
          try {
            const content = await callDeepSeek(prompt, getTempValue(), demon, "json");
            const json = extractJson(content);
            if (json && json.target && json.target !== "不攻击") {
              const target = resolveTargetByName(json.target, state.players.filter(p => p.alive), demon);
              if (target) demonTargets = [target];
              demon.poLastAttacked = true;
            } else {
              demon.poLastAttacked = false;
              addReplayEvent(`珀选择不攻击（下次三连杀）`, "night_action");
            }
          } catch (_) {
            const target = chooseRandomTarget(demon, false);
            if (target) demonTargets = [target];
            demon.poLastAttacked = true;
          }
        }
      }
    }

    // Pukka first night: poison only (no kill)
    if (demon && state.nightCount === 1 && demonRole === "普卡") {
      wokenRoles.add("普卡");
      let target = await aiChooseSingleTarget(demon, state.players.filter(p => p.alive && p.id !== demon.id), "选择一名玩家中毒（普卡首夜）");
      if (!target) target = chooseRandomTarget(demon, false);
      if (target && !isDroisoned(demon)) {
        target.poisoned = true;
        target.poisonedUntilDay = 999;
        state.pukkaVictimId = target.id;
        addReplayEvent(`普卡首夜中毒：${target.name}`, "night_action");
      }
    }

    // Resolve demon kills
    for (const target of demonTargets) {
      if (!target || !target.alive) continue;
      // Check Zombuul first-death
      if (target.roleName === "僵怖" && !target.zombuulFirstDeath && !isDroisoned(target)) {
        target.zombuulFirstDeath = true;
        target.appearsAlive = false;
        addReplayEvent(`僵怖首次"死亡"（实际存活）：${target.name}`, "night_action");
        killedThisNight.push({ ...target, fakeDeathZombuul: true, name: target.name });
        continue;
      }
      if (canDieAtNight(target)) {
        // Check grandmother link
        if (grandmother && grandmother.alive && grandmother.grandchildId === target.id && !isDroisoned(grandmother)) {
          grandmother.alive = false;
          grandmother.appearsAlive = false;
          killedThisNight.push(grandmother);
          addReplayEvent(`祖母因孙子被恶魔杀死而死亡：${grandmother.name}`, "night_action");
        }
        target.alive = false;
        target.appearsAlive = false;
        killedThisNight.push(target);
        addReplayEvent(`恶魔击杀：${target.name}`, "night_action");
      } else {
        addReplayEvent(`恶魔击杀失败（被保护）：${target.name}`, "night_action");
      }
    }

    // === 11. Assassin (one-time kill, bypasses protection) ===
    if (assassin && state.nightCount > 1 && !assassin.assassinUsed) {
      wokenRoles.add("刺客");
      let target = null;
      if (human && human.roleName === "刺客" && state.humanActionTarget) {
        target = state.players.find(p => p.id === state.humanActionTarget);
        assassin.assassinUsed = true;
      } else {
        // AI decides whether to use
        const candidates = state.players.filter(p => p.alive);
        const prompt = buildPlayerPromptMessages(assassin, "json",
          `你是刺客（一次性能力，无视一切保护）。你要使用吗？\n请输出 JSON：{"use":true,"target":"玩家名"} 或 {"use":false}`,
          { systemPrompt: getPlayerJsonSystemPrompt() });
        try {
          const content = await callDeepSeek(prompt, getTempValue(), assassin, "json");
          const json = extractJson(content);
          if (json && json.use) {
            target = resolveTargetByName(json.target, candidates, assassin);
            if (target) assassin.assassinUsed = true;
          }
        } catch (_) {}
      }
      if (target && target.alive && !isDroisoned(assassin)) {
        target.alive = false;
        target.appearsAlive = false;
        killedThisNight.push(target);
        addReplayEvent(`刺客击杀（无视保护）：${target.name}`, "night_action");
      }
    }

    // === 12. Godfather (kills if outsider died today) ===
    if (godfather && state.nightCount > 1 && state.outsiderDiedToday && !isDroisoned(godfather)) {
      wokenRoles.add("教父");
      let target = null;
      if (human && human.roleName === "教父" && state.humanActionTarget) {
        target = state.players.find(p => p.id === state.humanActionTarget);
      } else {
        const candidates = state.players.filter(p => p.alive);
        target = await aiChooseSingleTarget(godfather, candidates, "选择一名玩家死亡（教父击杀，因白天有外来者死亡）");
        if (!target) target = chooseRandomTarget(godfather, false);
      }
      if (target && target.alive && canDieAtNight(target)) {
        target.alive = false;
        target.appearsAlive = false;
        killedThisNight.push(target);
        addReplayEvent(`教父击杀：${target.name}`, "night_action");
      }
    }

    // === 13. Professor (one-time resurrect) ===
    if (professor && state.nightCount > 1 && !professor.professorUsed) {
      wokenRoles.add("教授");
      // AI decides whether to use
      const deadPlayers = state.players.filter(p => !p.alive);
      if (deadPlayers.length) {
        const prompt = buildPlayerPromptMessages(professor, "json",
          `你是教授（一次性能力），可以选择一名死亡玩家复活（仅镇民有效）。\n死亡玩家：${deadPlayers.map(p=>p.name).join("、")}\n请输出 JSON：{"use":true,"target":"玩家名"} 或 {"use":false}`,
          { systemPrompt: getPlayerJsonSystemPrompt() });
        try {
          const content = await callDeepSeek(prompt, getTempValue(), professor, "json");
          const json = extractJson(content);
          if (json && json.use) {
            const target = resolveTargetByName(json.target, deadPlayers, professor);
            if (target) {
              professor.professorUsed = true;
              if (target.team === "townsfolk" && !isDroisoned(professor)) {
                target.alive = true;
                target.appearsAlive = true;
                addReplayEvent(`教授复活：${target.name}`, "night_action");
                addChat("说书人", `一名玩家在夜晚复活了。`, "storyteller");
              } else {
                addReplayEvent(`教授复活失败（非镇民或醉/毒）：${target.name}`, "night_action");
              }
            }
          }
        } catch (_) {}
      }
    }

    // === 14. Gossip check (造谣者) ===
    const gossip = state.players.find(p => p.roleName === "造谣者" && p.alive);
    if (gossip && gossip.gossipStatement && gossip.gossipStatementDay === state.dayCount && !isDroisoned(gossip)) {
      const statement = gossip.gossipStatement;
      const json = await storytellerDecideBMR(
        `造谣者今天的声明是："${statement}"\n请判断这个声明是否正确，如果正确请选择一名玩家死亡。`,
        `输出 JSON：{"isTrue":true或false,"target":"如果为真，选择一名死亡的玩家名","reason":"理由"}`
      );
      if (json && json.isTrue) {
        const target = state.players.find(p => p.name === normalizeTargetName(json.target) && p.alive);
        if (target && canDieAtNight(target)) {
          target.alive = false;
          target.appearsAlive = false;
          killedThisNight.push(target);
          addReplayEvent(`造谣者声明为真，${target.name}死亡`, "night_action");
        }
      }
      gossip.gossipStatement = "";
    }

    // === 15. Tinker (修补匠) - may die ===
    const tinker = state.players.find(p => p.roleName === "修补匠" && p.alive);
    if (tinker && state.nightCount > 1) {
      const json = await storytellerDecideBMR(
        `修补匠（${tinker.name}）随时可能死亡。是否让修补匠今晚死亡？`,
        `输出 JSON：{"kill":true或false,"reason":"理由"}`
      );
      if (json && json.kill && canDieAtNight(tinker)) {
        tinker.alive = false;
        tinker.appearsAlive = false;
        killedThisNight.push(tinker);
        addReplayEvent(`修补匠被说书人杀死：${tinker.name}`, "night_action");
      }
    }

    // === 16. Grandmother info (first night) ===
    if (grandmother && state.nightCount === 1 && !isDroisoned(grandmother)) {
      wokenRoles.add("祖母");
      const goodPlayers = state.players.filter(p => p.team === "townsfolk" && p.id !== grandmother.id);
      if (goodPlayers.length) {
        const grandchild = goodPlayers[Math.floor(Math.random() * goodPlayers.length)];
        grandmother.grandchildId = grandchild.id;
        setPrivateInfo(grandmother, `祖母信息：你的孙子是 ${grandchild.name}（${grandchild.roleName}）`);
        addReplayEvent(`祖母的孙子：${grandchild.name}`, "night_action");
      }
    }

    // === 17. Godfather info (first night) ===
    if (godfather && state.nightCount === 1) {
      wokenRoles.add("教父");
      const outsiders = state.players.filter(p => p.team === "outsider");
      const outsiderNames = outsiders.map(p => p.roleName);
      if (!isDroisoned(godfather)) {
        setPrivateInfo(godfather, `教父信息：在场外来者角色：${outsiderNames.join("、") || "无"}`);
      } else {
        const allOutsiders = getCurrentEdition().roles.filter(r => r.team === "outsider").map(r => r.name);
        const fakeCount = Math.max(1, Math.floor(Math.random() * 3));
        const fake = shuffle(allOutsiders).slice(0, fakeCount);
        setPrivateInfo(godfather, `教父信息：在场外来者角色：${fake.join("、") || "无"}`);
      }
    }

    // === 18. Chambermaid info ===
    if (chambermaid) {
      const candidates = state.players.filter(p => p.alive && p.id !== chambermaid.id);
      let targets = [];
      if (human && (human.roleName === "侍女" || (human.drunk && human.apparentRoleName === "侍女")) && state.humanActionTarget && state.humanActionTarget2) {
        const t1 = state.players.find(p => p.id === state.humanActionTarget);
        const t2 = state.players.find(p => p.id === state.humanActionTarget2);
        targets = [t1, t2].filter(Boolean);
      } else {
        targets = await aiChooseTwoTargets(chambermaid, candidates, "选择两名玩家，得知其中几人今晚因自身能力被唤醒");
      }
      if (targets.length === 2) {
        const count = targets.filter(t => wokenRoles.has(t.roleName)).length;
        const trueInfo = `${count}`;
        const result = await resolveInfoResult(chambermaid, "侍女信息", trueInfo, ["0", "1", "2"]);
        setPrivateInfo(chambermaid, `侍女信息：${targets.map(t=>t.name).join(" 和 ")} 中有 ${result.info} 人今晚因自身能力被唤醒`);
        recordInfoAudit(chambermaid, "侍女信息", trueInfo, result.info, result.isTrue, result.droisoned, result.source, result.reason);
      }
    }

    // === Dawn narration ===
    const killedNames = killedThisNight.filter(p => !p.fakeDeathZombuul).map(p => p.name);
    const zombuulFakeDeath = killedThisNight.filter(p => p.fakeDeathZombuul).map(p => p.name);
    const allDeathNames = [...killedNames, ...zombuulFakeDeath];

    const storytellerPrompt = [
      { role: "system", content: "你是血染钟楼的说书人。请输出 JSON。narration 2-3句戏剧化暗黑风格；publicAnnouncement 简短公开信息。" },
      { role: "user", content: `当前剧本：${getCurrentEdition().name}。\n夜晚${state.nightCount}刚结束。\n今晚死亡：${allDeathNames.join("、") || "无人"}。\n请输出 JSON：{\"narration\":\"夜晚叙述\",\"publicAnnouncement\":\"白天公开信息\"}` }
    ];
    let narration = "";
    let publicAnnouncement = "";
    try {
      const content = await callDeepSeek(storytellerPrompt, getTempValue());
      const json = extractJson(content);
      if (json) { narration = json.narration || ""; publicAnnouncement = json.publicAnnouncement || ""; }
      else { narration = content; }
    } catch (error) {
      narration = `夜晚结束。${allDeathNames.length ? allDeathNames.join("、") + " 死亡。" : ""}`;
      publicAnnouncement = narration;
    }
    state.lastDawnNarration = narration || publicAnnouncement || "";
    if (narration) addChat("说书人", narration, "storyteller");
    if (publicAnnouncement) addChat("说书人", publicAnnouncement, "storyteller");
    addLogEntry(`夜晚死亡：${allDeathNames.join("、") || "无人"}`, "night");
    addReplayEvent(`夜晚死亡：${allDeathNames.join("、") || "无人"}`, "night_action");

    // Reset daily counters
    state.deathsToday = 0;
    state.outsiderDiedToday = false;

    renderAll();
    checkWin();
    if (!state.ended) { switchPhase(); }
  } catch (error) {
    console.error("[Night BMR] resolveNight failed:", error);
    addChat("系统", `夜晚结算异常：${error?.message || error}。`, "system");
    renderAll();
    if (state && state.started && !state.ended && state.phase === "night") { switchPhase(); }
  }
}

function recordFirstNightRecognitionBMR() {
  const totalPlayers = state.players.length;
  const demons = state.players.filter((p) => p.team === "demon");
  const minions = state.players.filter((p) => p.team === "minion");
  const lunatic = state.players.find(p => p.roleName === "疯子");

  const blockedRoleNames = new Set();
  state.players.forEach((player) => {
    if (player.roleName) blockedRoleNames.add(player.roleName);
    if (player.apparentRoleName) blockedRoleNames.add(player.apparentRoleName);
  });
  const bluffPool = getCurrentEdition().roles.filter(
    (r) => (r.team === "townsfolk" || r.team === "outsider") && !blockedRoleNames.has(r.name)
  );
  const bluffs = shuffle(bluffPool).slice(0, 3).map((r) => r.name);

  demons.forEach((demon) => {
    setPrivateInfo(demon, `三个不在场身份：${bluffs.join(" / ") || "无"}`);
  });

  if (totalPlayers >= 7) {
    demons.forEach((demon) => {
      setPrivateInfo(demon, `你看到爪牙：${minions.map((m) => m.name).join("、") || "无"}`);
      if (lunatic) {
        setPrivateInfo(demon, `疯子是：${lunatic.name}（他以为自己是恶魔）`);
      }
    });
    minions.forEach((minion) => {
      setPrivateInfo(minion, `你看到恶魔：${demons.map((d) => d.name).join("、") || "无"}`);
      const others = minions.filter((m) => m.id !== minion.id).map((m) => m.name);
      setPrivateInfo(minion, `你看到爪牙：${others.join("、") || "无"}`);
    });
  }

  // Lunatic gets fake demon info
  if (lunatic) {
    const fakeMinionCount = minions.length;
    const fakeMinionNames = shuffle(state.players.filter(p => p.id !== lunatic.id)).slice(0, fakeMinionCount).map(p => p.name);
    setPrivateInfo(lunatic, `你是恶魔。你看到爪牙：${fakeMinionNames.join("、") || "无"}`);
    setPrivateInfo(lunatic, `三个不在场身份：${bluffs.join(" / ") || "无"}`);
  }

  state.firstNightRecognitionDone = true;
}

registerEditionNightResolver("bad_moon_rising", resolveNightBMR);
