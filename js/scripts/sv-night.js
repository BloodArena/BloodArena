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
  recordInfoAudit, recordInfoDistortion, recordRoleChange,
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
    return json ? resolveTargetByName(json.target, candidates, actor) : null;
  } catch (error) { return null; }
}

function getNoDashiiPoisonTargets(demon) {
  if (!demon || demon.roleName !== "诺-达鲺") return [];
  const idx = state.players.indexOf(demon);
  const total = state.players.length;
  const result = [];
  // Find nearest townsfolk clockwise
  for (let d = 1; d < total; d++) {
    const p = state.players[(idx + d) % total];
    if (p.team === "townsfolk" && p.id !== demon.id) { result.push(p); break; }
  }
  // Find nearest townsfolk counterclockwise
  for (let d = 1; d < total; d++) {
    const p = state.players[(idx - d + total) % total];
    if (p.team === "townsfolk" && p.id !== demon.id) { result.push(p); break; }
  }
  return result;
}

function getClockmakerDistance() {
  const demons = state.players.filter(p => p.team === "demon");
  const minions = state.players.filter(p => p.team === "minion");
  if (!demons.length || !minions.length) return 0;
  const total = state.players.length;
  let minDist = total;
  for (const d of demons) {
    const di = state.players.indexOf(d);
    for (const m of minions) {
      const mi = state.players.indexOf(m);
      const dist = Math.min(Math.abs(di - mi), total - Math.abs(di - mi));
      if (dist < minDist) minDist = dist;
    }
  }
  return minDist;
}

async function storytellerDecideSV(context, question) {
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
    `只输出 JSON。`
  ];
  const prompt = [
    { role: "system", content: instructionParts.join("\n") },
    { role: "user", content: `当前局势：${getStorytellerBalanceSummary()}\n${question}` }
  ];
  try {
    const content = await callDeepSeek(prompt, 0.2, null, "storyteller", false);
    return extractJson(content);
  } catch (_) { return null; }
}


export async function resolveNightSV() {
  if (!state.started || state.phase !== "night") return;
  if (state.paused) return;
  if (needsHumanNightAction() && !isHumanActionReady()) {
    addChat("系统", "请先确认你的夜晚行动。", "system");
    return;
  }
  clearAutoNightTimer();
  try {
    if (state.nightCount === 1 && !state.firstNightRecognitionDone) {
      recordFirstNightRecognitionSV();
    }
    applyPoison();
    state.players.forEach((p) => { p.protected = false; });

    const human = state.players.find((p) => p.isHuman);
    const demon = state.players.find((p) => p.team === "demon" && p.alive);
    const demonRole = demon ? demon.roleName : "";
    const isVortox = demonRole === "涡流";

    let killedThisNight = [];

    // Apply No Dashii persistent poison
    if (demonRole === "诺-达鲺" && demon && !isDroisoned(demon)) {
      state.players.forEach(p => { if (p.noDashiiPoisonedIds) p.poisoned = false; });
      const poisonTargets = getNoDashiiPoisonTargets(demon);
      poisonTargets.forEach(p => {
        p.poisoned = true;
        p.poisonedUntilDay = 999;
      });
      demon.noDashiiPoisonedIds = poisonTargets.map(p => p.id);
    }

    // === 1. Snake Charmer ===
    const snakeCharmer = state.players.find(p => (p.roleName === "舞蛇人") && p.alive);
    if (snakeCharmer) {
      let target = null;
      if (human && human.roleName === "舞蛇人" && state.humanActionTarget) {
        target = state.players.find(p => p.id === state.humanActionTarget);
      } else {
        const candidates = state.players.filter(p => p.alive && p.id !== snakeCharmer.id);
        target = await aiChooseSingleTarget(snakeCharmer, candidates, "选择一名玩家：若选中恶魔则交换角色和阵营");
      }
      if (target && !isDroisoned(snakeCharmer) && target.team === "demon") {
        // Swap roles and alignments
        const oldDemonRole = target.roleName;
        const oldDemonRoleId = target.roleId;
        target.roleName = "舞蛇人";
        target.roleId = snakeCharmer.roleId;
        target.team = "townsfolk";
        target.apparentRoleName = "舞蛇人";
        target.apparentRoleId = snakeCharmer.roleId;
        target.poisoned = true;
        target.poisonedUntilDay = 999;

        snakeCharmer.roleName = oldDemonRole;
        snakeCharmer.roleId = oldDemonRoleId;
        snakeCharmer.team = "demon";
        snakeCharmer.apparentRoleName = oldDemonRole;
        snakeCharmer.apparentRoleId = oldDemonRoleId;

        recordRoleChange(target, "舞蛇人", "舞蛇人交换");
        recordRoleChange(snakeCharmer, oldDemonRole, "舞蛇人交换");
        setPrivateInfo(snakeCharmer, `你变成了${oldDemonRole}（邪恶阵营）`);
        setPrivateInfo(target, `你变成了舞蛇人（善良阵营），但你中毒了`);
        addReplayEvent(`舞蛇人交换：${snakeCharmer.name}变成${oldDemonRole}，${target.name}变成舞蛇人`, "night_action");
      }
    }

    // === 2. Witch ===
    const witch = state.players.find(p => p.roleName === "女巫" && p.alive);
    if (witch) {
      const aliveCount = state.players.filter(p => p.alive).length;
      if (aliveCount > 3) {
        let target = null;
        if (human && human.roleName === "女巫" && state.humanActionTarget) {
          target = state.players.find(p => p.id === state.humanActionTarget);
        } else {
          const candidates = state.players.filter(p => p.alive);
          target = await aiChooseSingleTarget(witch, candidates, "选择一名玩家诅咒：若他明天提名则死亡");
          if (!target) target = chooseRandomTarget(witch, true);
        }
        if (target && !isDroisoned(witch)) {
          state.witchCurseTargetId = target.id;
          target.cursedByWitch = true;
          addReplayEvent(`女巫诅咒：${target.name}`, "night_action");
        }
      }
    }

    // === 3. Cerenovus (洗脑师) ===
    const cerenovus = state.players.find(p => p.roleName === "洗脑师" && p.alive);
    if (cerenovus) {
      const candidates = state.players.filter(p => p.alive);
      const goodRoles = getCurrentEdition().roles.filter(r => r.team === "townsfolk" || r.team === "outsider").map(r => r.name);
      // AI chooses target and role
      const prompt = buildPlayerPromptMessages(cerenovus, "json",
        `你是洗脑师。选择一名玩家和一个善良角色，该玩家必须疯狂证明自己是该角色。\n可选玩家：${candidates.map(p=>p.name).join("、")}\n可选角色：${goodRoles.join("、")}\n请输出 JSON：{"target":"玩家名","role":"角色名"}`,
        { systemPrompt: getPlayerJsonSystemPrompt() });
      try {
        const content = await callDeepSeek(prompt, getTempValue(), cerenovus, "json");
        const json = extractJson(content);
        if (json && json.target && json.role && !isDroisoned(cerenovus)) {
          const target = resolveTargetByName(json.target, candidates, cerenovus);
          if (target) {
            target.madAboutRole = json.role;
            setPrivateInfo(target, `洗脑师要求你疯狂证明自己是${json.role}。若你在白天不这么做，你可能被处决。`);
            addReplayEvent(`洗脑师：${target.name}必须疯狂证明是${json.role}`, "night_action");
          }
        }
      } catch (_) {}
    }

    // === 4. Pit-Hag (麻脸巫婆, not first night) ===
    const pitHag = state.players.find(p => p.roleName === "麻脸巫婆" && p.alive);
    if (pitHag && state.nightCount > 1) {
      const allRoles = getCurrentEdition().roles.map(r => r.name);
      const inPlayRoles = new Set(state.players.map(p => p.roleName));
      const availableRoles = allRoles.filter(r => !inPlayRoles.has(r));
      if (availableRoles.length) {
        const candidates = state.players.filter(p => p.alive);
        const prompt = buildPlayerPromptMessages(pitHag, "json",
          `你是麻脸巫婆。选择一名玩家和一个不在场的角色，该玩家将变成该角色。\n可选玩家：${candidates.map(p=>p.name).join("、")}\n不在场角色：${availableRoles.join("、")}\n请输出 JSON：{"target":"玩家名","role":"角色名"}`,
          { systemPrompt: getPlayerJsonSystemPrompt() });
        try {
          const content = await callDeepSeek(prompt, getTempValue(), pitHag, "json");
          const json = extractJson(content);
          if (json && json.target && json.role && !isDroisoned(pitHag)) {
            const target = resolveTargetByName(json.target, candidates, pitHag);
            const newRole = getCurrentEdition().roles.find(r => r.name === json.role);
            if (target && newRole && !inPlayRoles.has(json.role)) {
              const oldRole = target.roleName;
              target.roleId = newRole.id;
              target.roleName = newRole.name;
              target.apparentRoleId = newRole.id;
              target.apparentRoleName = newRole.name;
              // Alignment doesn't change
              recordRoleChange(target, newRole.name, "麻脸巫婆");
              setPrivateInfo(target, `你的角色变成了${newRole.name}`);
              addReplayEvent(`麻脸巫婆：${target.name}从${oldRole}变成${newRole.name}`, "night_action");

              if (newRole.team === "demon") {
                addReplayEvent(`麻脸巫婆创造了新恶魔！当晚死亡由说书人决定。`, "night_action");
              }
            }
          }
        } catch (_) {}
      }
    }

    // === 5. Demon kills (not first night) ===
    // Re-find demon in case Snake Charmer swapped
    const currentDemon = state.players.find((p) => p.team === "demon" && p.alive);
    const currentDemonRole = currentDemon ? currentDemon.roleName : "";

    if (currentDemon && state.nightCount > 1) {
      let target = null;
      if (human && human.team === "demon" && state.humanActionTarget) {
        target = state.players.find(p => p.id === state.humanActionTarget);
      } else {
        const candidates = state.players.filter(p => p.alive && p.id !== currentDemon.id);
        target = await aiChooseSingleTarget(currentDemon, candidates, `选择一名玩家死亡（${currentDemonRole}击杀）`);
        if (!target) target = chooseRandomTarget(currentDemon, false);
      }

      if (target && target.alive) {
        // Fang Gu outsider swap
        if (currentDemonRole === "方古" && target.team === "outsider" && !currentDemon.fangGuSwapped) {
          currentDemon.fangGuSwapped = true;
          // Old Fang Gu dies, outsider becomes new Fang Gu
          currentDemon.alive = false;
          currentDemon.appearsAlive = false;
          killedThisNight.push(currentDemon);

          const fangGuRole = getCurrentEdition().roles.find(r => r.name === "方古");
          target.team = "demon";
          target.roleId = fangGuRole.id;
          target.roleName = fangGuRole.name;
          target.apparentRoleId = fangGuRole.id;
          target.apparentRoleName = fangGuRole.name;
          target.fangGuSwapped = true;
          recordRoleChange(target, "方古", "方古外来者转化");
          setPrivateInfo(target, `你变成了方古（邪恶阵营）`);
          addReplayEvent(`方古外来者转化：${currentDemon.name}死亡，${target.name}变成方古`, "night_action");
        } else {
          // Normal kill
          // Vigormortis minion kill special
          if (currentDemonRole === "亡骨魔" && target.team === "minion") {
            target.alive = false;
            target.appearsAlive = false;
            killedThisNight.push(target);
            // Minion keeps ability
            if (!currentDemon.vigormortisDeadMinions) currentDemon.vigormortisDeadMinions = [];
            currentDemon.vigormortisDeadMinions.push(target.id);
            // Poison a neighboring townsfolk
            const tIdx = state.players.indexOf(target);
            const neighbors = getAliveNeighbors(tIdx);
            const townsfolkNeighbor = neighbors.find(n => n.team === "townsfolk");
            if (townsfolkNeighbor) {
              townsfolkNeighbor.poisoned = true;
              townsfolkNeighbor.poisonedUntilDay = 999;
              addReplayEvent(`亡骨魔杀死爪牙${target.name}，${townsfolkNeighbor.name}中毒`, "night_action");
            }
          } else {
            // Sage trigger check
            const sage = target.roleName === "贤者" && !isDroisoned(target);

            target.alive = false;
            target.appearsAlive = false;
            killedThisNight.push(target);
            addReplayEvent(`恶魔击杀：${target.name}`, "night_action");

            if (sage) {
              const otherPlayer = state.players.filter(p => p.id !== currentDemon.id && p.id !== target.id && p.alive);
              const decoy = otherPlayer.length ? otherPlayer[Math.floor(Math.random() * otherPlayer.length)] : null;
              if (decoy) {
                const pair = shuffle([currentDemon, decoy]);
                setPrivateInfo(target, `贤者信息：杀你的恶魔是 ${pair[0].name} 或 ${pair[1].name} 之一`);
                addReplayEvent(`贤者触发：${target.name}得知${pair.map(p=>p.name).join("或")}`, "night_action");
              }
            }
          }

          // Sweetheart death trigger
          if (target.roleName === "心上人" && !isDroisoned(target)) {
            const json = await storytellerDecideSV(
              `心上人（${target.name}）死亡了。需要选择一名玩家永久醉酒。`,
              `输出 JSON：{"target":"玩家名","reason":"理由"}`
            );
            if (json && json.target) {
              const drunkTarget = state.players.find(p => p.name === normalizeTargetName(json.target) && p.alive);
              if (drunkTarget) {
                drunkTarget.drunk = true;
                addReplayEvent(`心上人死亡，${drunkTarget.name}永久醉酒`, "night_action");
              }
            }
          }

          // Barber death trigger (if died during day, handled separately)
        }
      }
    }

    // === 6. Info roles ===

    // Dreamer (筑梦师)
    const dreamer = state.players.find(p => (p.roleName === "筑梦师" || (p.drunk && p.apparentRoleName === "筑梦师")) && p.alive);
    if (dreamer) {
      let target = null;
      if (human && (human.roleName === "筑梦师" || (human.drunk && human.apparentRoleName === "筑梦师")) && state.humanActionTarget) {
        target = state.players.find(p => p.id === state.humanActionTarget);
      } else {
        const candidates = state.players.filter(p => p.alive && p.id !== dreamer.id);
        target = await aiChooseSingleTarget(dreamer, candidates, "选择一名玩家：得知一个善良角色和一个邪恶角色（其中一个是他的真实角色）");
      }
      if (target) {
        const ed = getCurrentEdition();
        const goodRoles = ed.roles.filter(r => r.team === "townsfolk" || r.team === "outsider");
        const evilRoles = ed.roles.filter(r => r.team === "minion" || r.team === "demon");
        let shownGood, shownEvil;

        if (!isDroisoned(dreamer) && !isVortox) {
          if (target.team === "townsfolk" || target.team === "outsider") {
            shownGood = target.roleName;
            shownEvil = evilRoles[Math.floor(Math.random() * evilRoles.length)].name;
          } else {
            shownGood = goodRoles[Math.floor(Math.random() * goodRoles.length)].name;
            shownEvil = target.roleName;
          }
        } else {
          // Give wrong info
          shownGood = goodRoles.filter(r => r.name !== target.roleName)[Math.floor(Math.random() * (goodRoles.length - 1))]?.name || goodRoles[0].name;
          shownEvil = evilRoles.filter(r => r.name !== target.roleName)[Math.floor(Math.random() * (evilRoles.length - 1))]?.name || evilRoles[0].name;
        }
        setPrivateInfo(dreamer, `筑梦师信息：${target.name} 是 ${shownGood} 或 ${shownEvil}`);
        addReplayEvent(`筑梦师：${dreamer.name} -> ${target.name}`, "night_action");
      }
    }

    // Clockmaker (钟表匠, first night only)
    const clockmaker = state.players.find(p => (p.roleName === "钟表匠" || (p.drunk && p.apparentRoleName === "钟表匠")) && p.alive);
    if (clockmaker && state.nightCount === 1) {
      const trueDist = getClockmakerDistance();
      const trueInfo = `${trueDist}`;
      const result = await resolveInfoResult(clockmaker, "钟表匠信息", trueInfo, ["1", "2", "3", "4", "5"]);
      let shownInfo = result.info;
      if (isVortox && !isDroisoned(clockmaker)) {
        shownInfo = `${maybeAlterNumber(trueDist, Math.floor(state.players.length / 2))}`;
      }
      setPrivateInfo(clockmaker, `钟表匠信息：恶魔与最近爪牙距离为 ${shownInfo}`);
      recordInfoAudit(clockmaker, "钟表匠信息", trueInfo, shownInfo, shownInfo === trueInfo, isDroisoned(clockmaker), "rule", "");
    }

    // Flower Girl (卖花女孩, not first night)
    const flowerGirl = state.players.find(p => (p.roleName === "卖花女孩" || (p.drunk && p.apparentRoleName === "卖花女孩")) && p.alive);
    if (flowerGirl && state.nightCount > 1) {
      const trueAnswer = state.demonVotedToday ? "是" : "否";
      let shownAnswer = trueAnswer;
      if (isDroisoned(flowerGirl) || isVortox) {
        shownAnswer = trueAnswer === "是" ? "否" : "是";
      }
      setPrivateInfo(flowerGirl, `卖花女孩信息：恶魔今天${shownAnswer === "是" ? "投过票" : "没有投票"}`);
      recordInfoAudit(flowerGirl, "卖花女孩信息", trueAnswer, shownAnswer, shownAnswer === trueAnswer, isDroisoned(flowerGirl), "rule", "");
    }

    // Town Crier (城镇公告员, not first night)
    const townCrier = state.players.find(p => (p.roleName === "城镇公告员" || (p.drunk && p.apparentRoleName === "城镇公告员")) && p.alive);
    if (townCrier && state.nightCount > 1) {
      const trueAnswer = state.minionNominatedToday ? "是" : "否";
      let shownAnswer = trueAnswer;
      if (isDroisoned(townCrier) || isVortox) {
        shownAnswer = trueAnswer === "是" ? "否" : "是";
      }
      setPrivateInfo(townCrier, `城镇公告员信息：今天${shownAnswer === "是" ? "有" : "没有"}爪牙发起提名`);
      recordInfoAudit(townCrier, "城镇公告员信息", trueAnswer, shownAnswer, shownAnswer === trueAnswer, isDroisoned(townCrier), "rule", "");
    }

    // Oracle (神谕者, not first night)
    const oracle = state.players.find(p => (p.roleName === "神谕者" || (p.drunk && p.apparentRoleName === "神谕者")) && p.alive);
    if (oracle && state.nightCount > 1) {
      const deadEvil = state.players.filter(p => !p.alive && (p.team === "minion" || p.team === "demon")).length;
      const trueInfo = `${deadEvil}`;
      let shownInfo = trueInfo;
      if (isDroisoned(oracle) || isVortox) {
        shownInfo = `${maybeAlterNumber(deadEvil, state.players.filter(p => !p.alive).length)}`;
      }
      setPrivateInfo(oracle, `神谕者信息：死亡玩家中有 ${shownInfo} 名邪恶`);
      recordInfoAudit(oracle, "神谕者信息", trueInfo, shownInfo, shownInfo === trueInfo, isDroisoned(oracle), "rule", "");
    }

    // Mathematician (数学家)
    const mathematician = state.players.find(p => (p.roleName === "数学家" || (p.drunk && p.apparentRoleName === "数学家")) && p.alive);
    if (mathematician) {
      const malfunctionCount = state.players.filter(p => p.alive && p.id !== mathematician.id && (p.poisoned || p.drunk)).length;
      const trueInfo = `${malfunctionCount}`;
      let shownInfo = trueInfo;
      if (isDroisoned(mathematician) || isVortox) {
        shownInfo = `${maybeAlterNumber(malfunctionCount, state.players.length)}`;
      }
      setPrivateInfo(mathematician, `数学家信息：有 ${shownInfo} 名玩家的能力因他人而未正常生效`);
      recordInfoAudit(mathematician, "数学家信息", trueInfo, shownInfo, shownInfo === trueInfo, isDroisoned(mathematician), "rule", "");
    }

    // Seamstress (女裁缝, one-time)
    const seamstress = state.players.find(p => (p.roleName === "女裁缝" || (p.drunk && p.apparentRoleName === "女裁缝")) && p.alive && !p.seamstressUsed);
    if (seamstress) {
      // AI decides whether to use
      // For now, skip (human can use via UI)
    }

    // === Dawn narration ===
    const killedNames = killedThisNight.map(p => p.name);
    const storytellerPrompt = [
      { role: "system", content: "你是血染钟楼的说书人。请输出 JSON。narration 2-3句戏剧化；publicAnnouncement 简短公开信息。" },
      { role: "user", content: `当前剧本：${getCurrentEdition().name}。\n夜晚${state.nightCount}刚结束。\n今晚死亡：${killedNames.join("、") || "无人"}。\n请输出 JSON：{\"narration\":\"夜晚叙述\",\"publicAnnouncement\":\"白天公开信息\"}` }
    ];
    let narration = "";
    let publicAnnouncement = "";
    try {
      const content = await callDeepSeek(storytellerPrompt, getTempValue());
      const json = extractJson(content);
      if (json) { narration = json.narration || ""; publicAnnouncement = json.publicAnnouncement || ""; }
      else { narration = content; }
    } catch (error) {
      narration = `夜晚结束。${killedNames.length ? killedNames.join("、") + " 死亡。" : ""}`;
      publicAnnouncement = narration;
    }
    state.lastDawnNarration = narration || publicAnnouncement || "";
    if (narration) addChat("说书人", narration, "storyteller");
    if (publicAnnouncement) addChat("说书人", publicAnnouncement, "storyteller");
    addLogEntry(`夜晚死亡：${killedNames.join("、") || "无人"}`, "night");

    // Reset daily counters
    state.demonVotedToday = false;
    state.minionNominatedToday = false;
    state.executedToday = false;

    // Clear witch curse
    state.players.forEach(p => { p.cursedByWitch = false; });

    renderAll();
    checkWin();
    if (!state.ended) { switchPhase(); }
  } catch (error) {
    console.error("[Night SV] resolveNight failed:", error);
    addChat("系统", `夜晚结算异常：${error?.message || error}。`, "system");
    renderAll();
    if (state && state.started && !state.ended && state.phase === "night") { switchPhase(); }
  }
}

function recordFirstNightRecognitionSV() {
  const totalPlayers = state.players.length;
  const demons = state.players.filter((p) => p.team === "demon");
  const minions = state.players.filter((p) => p.team === "minion");
  const evilTwin = minions.find(p => p.roleName === "镜像双子");

  const blockedRoleNames = new Set();
  state.players.forEach((player) => {
    if (player.roleName) blockedRoleNames.add(player.roleName);
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
    });
    minions.forEach((minion) => {
      setPrivateInfo(minion, `你看到恶魔：${demons.map((d) => d.name).join("、") || "无"}`);
      const others = minions.filter((m) => m.id !== minion.id).map((m) => m.name);
      setPrivateInfo(minion, `你看到爪牙：${others.join("、") || "无"}`);
    });
  }

  // Evil Twin pairing
  if (evilTwin) {
    const goodCandidates = state.players.filter(p => (p.team === "townsfolk" || p.team === "outsider") && p.id !== evilTwin.id);
    if (goodCandidates.length) {
      const goodTwin = goodCandidates[Math.floor(Math.random() * goodCandidates.length)];
      evilTwin.evilTwinPairId = goodTwin.id;
      goodTwin.evilTwinPairId = evilTwin.id;
      setPrivateInfo(evilTwin, `你的善良双子是 ${goodTwin.name}（${goodTwin.roleName}）`);
      setPrivateInfo(goodTwin, `你的邪恶双子是 ${evilTwin.name}（镜像双子）。如果你被处决，邪恶阵营获胜！`);
      addReplayEvent(`镜像双子配对：${evilTwin.name}（邪恶）↔ ${goodTwin.name}（善良）`, "night_action");
    }
  }

  state.firstNightRecognitionDone = true;
}

registerEditionNightResolver("sects_and_violets", resolveNightSV);
