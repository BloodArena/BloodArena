/* ===== UI Helpers & Rendering ===== */
import { state, saveState, speechActive } from './state.js';
import { SCRIPT, PLAYER_DISTRIBUTION, MODEL_OPTIONS, MAX_NOMINATIONS_PER_DAY, SLAYER_DECLARATION_TEMPLATE, DEFAULT_MODEL, DEFAULT_DAY_DISCUSSION_MINUTES } from './constants.js';
import { getRoleById, getApparentRole, getPromptName, playerOptionHtml } from './utils.js';
import { getPhaseLabel, getDiscussionDurationSeconds } from './prompts.js';
import { getTokenUsageSummary } from './api.js';
import { stopVoiceRecognition } from './voice.js';

/* Dependency injection for cross-module calls (used for circular deps) */
let _deps = {};
export function setUiDeps(deps) { Object.assign(_deps, deps); }

/* ===== DOM Element References ===== */
export let modelSelect, tempInput, dayDiscussionMinutesInput, playerCountInput, humanNameInput, humanSeatInput, humanRoleSelect;
export let setupBtn, assignBtn, startBtn, randomModelBtn, pauseBtn, nightResolveBtn, aiTalkBtn, autoNightToggle, trajectoryToggle;
export let forceNominationBtn, voteBtn, endBtn, resetBtn, exportBtn, exportTrajBtn;
export let phaseStatus, statusMetaChips, nominationFlow, townLayoutEl, peekTownBtn, peekLogBtn, peekTownCloseBtn, peekLogCloseBtn;
export let discussionOverlayBackdrop, discussionLogDrawer, playerList, chatBox, chatFilterSelect, chatSearchInput;
export let chatAutoScrollBtn, chatJumpLatestBtn, chatResultHint, chatTabPublicContent, townRightEl, townRightScrollEl;
export let discussionActionsEl, privateChatBox, privateTargetSelect, privateInput, privateSendBtn, privateChatHint;
export let humanInput, mentionSelect, mentionBtn, slayerTemplateBtn, voiceBtn, voiceStatus, chatLockHint, slayerFormatHint;
export let sendBtn, passBtn, configSummaryBox, modelHealthBox, modelHealthRefreshBtn;
export let nominateBtn, skipNominationBtn, voteYesBtn, voteNoBtn;
export let humanRoleBox, humanPrivateBox, humanActionBox, logList, publicLogList, publicLogDrawerList;
export let replayPanel, replayRoles, replayActions, replayPrivate, replayChat;
export let taskSection, taskTitle, taskDesc, taskHint, storySummaryBtn, storySummaryBox;
export let modalOverlay, modalMessage, modalCloseBtn, nomineeSelect;
export let startOverlay, introOverlay, enterGameBtn, skipIntroBtn, introVideo, dawnOverlay, dawnText;
let playerModelListEl;

export function initDomRefs() {
  modelSelect = document.getElementById("modelSelect");
  tempInput = document.getElementById("tempInput");
  dayDiscussionMinutesInput = document.getElementById("dayDiscussionMinutes");
  playerCountInput = document.getElementById("playerCount");
  humanNameInput = document.getElementById("humanName");
  humanSeatInput = document.getElementById("humanSeat");
  humanRoleSelect = document.getElementById("humanRoleSelect");
  setupBtn = document.getElementById("setupBtn");
  assignBtn = document.getElementById("assignBtn");
  startBtn = document.getElementById("startBtn");
  randomModelBtn = document.getElementById("randomModelBtn");
  pauseBtn = document.getElementById("pauseBtn");
  nightResolveBtn = document.getElementById("nightResolveBtn");
  aiTalkBtn = document.getElementById("aiTalkBtn");
  autoNightToggle = document.getElementById("autoNightToggle");
  trajectoryToggle = document.getElementById("trajectoryToggle");
  forceNominationBtn = document.getElementById("forceNominationBtn");
  voteBtn = document.getElementById("voteBtn");
  endBtn = document.getElementById("endBtn");
  resetBtn = document.getElementById("resetBtn");
  exportBtn = document.getElementById("exportBtn");
  exportTrajBtn = document.getElementById("exportTrajBtn");
  phaseStatus = document.getElementById("phaseStatus");
  statusMetaChips = document.getElementById("statusMetaChips");
  nominationFlow = document.getElementById("nominationFlow");
  townLayoutEl = document.getElementById("townLayout");
  peekTownBtn = document.getElementById("peekTownBtn");
  peekLogBtn = document.getElementById("peekLogBtn");
  peekTownCloseBtn = document.getElementById("peekTownCloseBtn");
  peekLogCloseBtn = document.getElementById("peekLogCloseBtn");
  discussionOverlayBackdrop = document.getElementById("discussionOverlayBackdrop");
  discussionLogDrawer = document.getElementById("discussionLogDrawer");
  playerList = document.getElementById("playerList");
  chatBox = document.getElementById("chatBox");
  chatFilterSelect = document.getElementById("chatFilterSelect");
  chatSearchInput = document.getElementById("chatSearchInput");
  chatAutoScrollBtn = document.getElementById("chatAutoScrollBtn");
  chatJumpLatestBtn = document.getElementById("chatJumpLatestBtn");
  chatResultHint = document.getElementById("chatResultHint");
  chatTabPublicContent = document.getElementById("chatTabContentPublic");
  townRightEl = document.querySelector(".town-right");
  townRightScrollEl = document.querySelector(".town-right-scroll");
  discussionActionsEl = document.getElementById("discussionActions");
  privateChatBox = document.getElementById("privateChatBox");
  privateTargetSelect = document.getElementById("privateTargetSelect");
  privateInput = document.getElementById("privateInput");
  privateSendBtn = document.getElementById("privateSendBtn");
  privateChatHint = document.getElementById("privateChatHint");
  humanInput = document.getElementById("humanInput");
  mentionSelect = document.getElementById("mentionSelect");
  mentionBtn = document.getElementById("mentionBtn");
  slayerTemplateBtn = document.getElementById("slayerTemplateBtn");
  voiceBtn = document.getElementById("voiceBtn");
  voiceStatus = document.getElementById("voiceStatus");
  chatLockHint = document.getElementById("chatLockHint");
  slayerFormatHint = document.getElementById("slayerFormatHint");
  sendBtn = document.getElementById("sendBtn");
  passBtn = document.getElementById("passBtn");
  configSummaryBox = document.getElementById("configSummaryBox");
  modelHealthBox = document.getElementById("modelHealthBox");
  modelHealthRefreshBtn = document.getElementById("modelHealthRefreshBtn");
  nominateBtn = document.getElementById("nominateBtn");
  skipNominationBtn = document.getElementById("skipNominationBtn");
  voteYesBtn = document.getElementById("voteYesBtn");
  voteNoBtn = document.getElementById("voteNoBtn");
  humanRoleBox = document.getElementById("humanRoleBox");
  humanPrivateBox = document.getElementById("humanPrivateBox");
  humanActionBox = document.getElementById("humanActionBox");
  logList = document.getElementById("logList");
  publicLogList = document.getElementById("publicLogList");
  publicLogDrawerList = document.getElementById("publicLogDrawerList");
  replayPanel = document.getElementById("replayPanel");
  replayRoles = document.getElementById("replayRoles");
  replayActions = document.getElementById("replayActions");
  replayPrivate = document.getElementById("replayPrivate");
  replayChat = document.getElementById("replayChat");
  taskSection = document.getElementById("taskSection");
  taskTitle = document.getElementById("taskTitle");
  taskDesc = document.getElementById("taskDesc");
  taskHint = document.getElementById("taskHint");
  storySummaryBtn = document.getElementById("storySummaryBtn");
  storySummaryBox = document.getElementById("storySummaryBox");
  modalOverlay = document.getElementById("modalOverlay");
  modalMessage = document.getElementById("modalMessage");
  modalCloseBtn = document.getElementById("modalCloseBtn");
  nomineeSelect = document.getElementById("nomineeSelect");
  startOverlay = document.getElementById("startOverlay");
  introOverlay = document.getElementById("introOverlay");
  enterGameBtn = document.getElementById("enterGameBtn");
  skipIntroBtn = document.getElementById("skipIntroBtn");
  introVideo = document.getElementById("introVideo");
  dawnOverlay = document.getElementById("dawnOverlay");
  dawnText = document.getElementById("dawnText");
  playerModelListEl = document.getElementById("playerModelList");
}

/* ===== Rendering Functions ===== */
export function renderLog() {
  logList.innerHTML = "";
  logList.className = "timeline";
  state.log.forEach((entry) => {
    const item = document.createElement("div");
    item.className = `timeline-item${entry.type === "phase" ? " phase-entry" : ""}`;
    const { icon, cls } = _deps.getTimelineIcon(entry);
    item.innerHTML = `
      <span class="timeline-icon ${cls}">${icon}</span>
      <span class="timeline-text">[${entry.time}] ${entry.text}</span>
    `;
    logList.appendChild(item);
  });
}

export function renderPublicLog() {
  const lists = [publicLogList, publicLogDrawerList].filter(Boolean);
  if (!lists.length) return;
  const entries = state.publicLog || [];
  lists.forEach((listEl) => {
    listEl.innerHTML = "";
    listEl.className = "timeline";
    if (!entries.length) {
      const item = document.createElement("div");
      item.className = "timeline-item";
      item.innerHTML = `<span class="timeline-icon">\u25CB</span><span class="timeline-text">暂无记录。</span>`;
      listEl.appendChild(item);
      return;
    }
    entries.forEach((entry) => {
      const item = document.createElement("div");
      let iconCls = "";
      let icon = "\u25CB";
      if (entry.text.includes("处决")) { icon = "\u2694\uFE0F"; iconCls = "execution"; }
      else if (entry.text.includes("提名")) { icon = "\u261D\uFE0F"; }
      else if (entry.text.includes("投票")) { icon = "\uD83D\uDDF3\uFE0F"; }
      else if (entry.text.includes("夜晚")) { icon = "\uD83C\uDF19"; iconCls = "night"; }
      item.className = "timeline-item";
      item.innerHTML = `
        <span class="timeline-icon ${iconCls}">${icon}</span>
        <span class="timeline-text">[${entry.time}] ${entry.text}</span>
      `;
      listEl.appendChild(item);
    });
    listEl.scrollTop = listEl.scrollHeight;
  });
}

export function renderPlayers() {
  playerList.innerHTML = "";
  state.players.forEach((player) => {
    const card = document.createElement("div");
    let cls = "player-card";
    if (!player.alive) cls += " dead";
    if (player.isHuman) cls += " self-player";
    const isDayPhase = state.started && !state.ended && state.phase === "day";
    if (isDayPhase && state.dayStage === "discussion" && state.currentSpeakerId === player.id) cls += " speaking";
    if (isDayPhase && state.dayStage === "nomination" && state.currentNomineeId === player.id) cls += " nominated";
    card.className = cls;
    const left = document.createElement("div");
    left.innerHTML = `${player.name} ${player.isHuman ? '<span style="color:var(--brass)">· 你</span>' : ""}`;
    if (!player.isHuman) {
      const modelSelectEl = document.createElement("select");
      modelSelectEl.className = "player-model";
      const defaultOption = document.createElement("option");
      defaultOption.value = "default";
      defaultOption.textContent = "默认模型";
      modelSelectEl.appendChild(defaultOption);
      MODEL_OPTIONS.forEach((option) => {
        const opt = document.createElement("option");
        opt.value = option.value;
        opt.textContent = option.label;
        modelSelectEl.appendChild(opt);
      });
      modelSelectEl.value = player.modelChoice || "default";
      modelSelectEl.addEventListener("change", () => {
        player.modelChoice = modelSelectEl.value;
        saveState();
      });
      left.appendChild(modelSelectEl);
    }
    const status = document.createElement("div");
    status.className = player.alive ? "chip chip-alive" : "chip chip-dead";
    status.textContent = player.alive ? "存活" : "死亡";
    card.appendChild(left);
    card.appendChild(status);
    playerList.appendChild(card);
  });
  nomineeSelect.innerHTML = "";
  state.players.forEach((player) => {
    const option = document.createElement("option");
    option.value = player.id;
    option.textContent = player.name + (player.alive ? "" : "（已死亡）");
    nomineeSelect.appendChild(option);
  });

  if (mentionSelect) {
    mentionSelect.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "@ 选择玩家";
    mentionSelect.appendChild(placeholder);
    state.players
      .filter((p) => !p.isHuman)
      .forEach((player) => {
        const option = document.createElement("option");
        option.value = player.id;
        option.textContent = player.name;
        mentionSelect.appendChild(option);
      });
  }

  if (chatFilterSelect) {
    const current = state.chatFilter || "all";
    chatFilterSelect.innerHTML = "";
    const allOption = document.createElement("option");
    allOption.value = "all";
    allOption.textContent = "全部";
    chatFilterSelect.appendChild(allOption);
    state.players.forEach((player) => {
      const option = document.createElement("option");
      option.value = player.name;
      option.textContent = player.name;
      chatFilterSelect.appendChild(option);
    });
    const hasOption = Array.from(chatFilterSelect.options).some((opt) => opt.value === current);
    chatFilterSelect.value = hasOption ? current : "all";
    if (!hasOption) state.chatFilter = "all";
  }

  if (privateTargetSelect) {
    privateTargetSelect.innerHTML = "";
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "私聊目标";
    privateTargetSelect.appendChild(placeholder);
    state.players
      .filter((p) => !p.isHuman)
      .forEach((player) => {
        const option = document.createElement("option");
        option.value = player.id;
        option.textContent = player.name;
        privateTargetSelect.appendChild(option);
      });
  }
}

export function insertTextAtCursor(tag) {
  if (!humanInput || !tag) return;
  const start = humanInput.selectionStart || 0;
  const end = humanInput.selectionEnd || 0;
  const text = humanInput.value;
  humanInput.value = text.slice(0, start) + tag + text.slice(end);
  const cursor = start + tag.length;
  humanInput.setSelectionRange(cursor, cursor);
  humanInput.focus();
}

export function insertMention(name) {
  if (!name) return;
  insertTextAtCursor(`@${name} `);
}

export function getPreferredSlayerSeat() {
  if (!state || !Array.isArray(state.players) || !state.players.length) return 1;
  if (mentionSelect && mentionSelect.value) {
    const mentioned = state.players.find((p) => p.id === mentionSelect.value);
    if (mentioned) {
      const seat = state.players.indexOf(mentioned) + 1;
      if (seat > 0) return seat;
    }
  }
  const human = state.players.find((p) => p.isHuman);
  const candidate = state.players.find((p) => p.alive && (!human || p.id !== human.id));
  if (!candidate) return 1;
  return state.players.indexOf(candidate) + 1;
}

export function buildSlayerDeclarationTemplate(seat = null) {
  const seatNum = Number.isFinite(seat) ? seat : getPreferredSlayerSeat();
  return `我是猎手，我要向玩家${seatNum}开枪`;
}

export function renderHumanInfo() {
  const human = state.players.find((p) => p.isHuman);
  if (!human || !human.roleId) {
    humanRoleBox.textContent = "尚未分配角色";
    return;
  }
  const role = getApparentRole(human);
  if (!role) {
    humanRoleBox.textContent = "角色数据异常";
    humanPrivateBox.textContent = "暂无";
    return;
  }
  humanRoleBox.innerHTML = `
    <strong>${role.name}</strong> · ${role.team}<br />
    ${role.ability}
  `;
  humanPrivateBox.innerHTML = human.privateInfo.length
    ? human.privateInfo.map((line) => `<div>• ${line}</div>`).join("")
    : "暂无";
  renderHumanAction();
}

export function renderHumanAction() {
  if (!state || !state.started) {
    humanActionBox.textContent = "未开局";
    return;
  }
  const human = state.players.find((p) => p.isHuman);
  if (!human) {
    humanActionBox.textContent = "无玩家";
    return;
  }
  const role = getApparentRole(human);
  if (!role) {
    humanActionBox.textContent = "无夜晚行动";
    return;
  }
  const nightActionRoles = new Set(["小恶魔", "投毒者", "僧侣", "管家", "占卜师"]);
  if (nightActionRoles.has(role.name)) {
    if (state.phase !== "night") {
      humanActionBox.textContent = "夜晚到来后可执行行动。";
      return;
    }
    if (!human.alive) {
      humanActionBox.textContent = "你已死亡，无法行动。";
      return;
    }
  }
  if (role.name === "小恶魔") {
    if (state.nightCount <= 1) {
      humanActionBox.textContent = "首夜恶魔不执行杀人行动。";
      return;
    }
    const allTargets = state.players.slice();
    const targetOptions = allTargets
      .map((p) => playerOptionHtml(p))
      .join("");
    humanActionBox.innerHTML = `
      <div class="hint">请选择恶魔击杀目标：</div>
      <select id="humanTargetSelect">${targetOptions}</select>
      <button class="secondary" id="humanTargetConfirmBtn" style="margin-top:8px">
        ${state.humanActionConfirmed ? "已确认" : "确认击杀"}
      </button>
    `;
    const select = humanActionBox.querySelector("#humanTargetSelect");
    const confirmBtn = humanActionBox.querySelector("#humanTargetConfirmBtn");
    select.value = state.humanActionTarget || select.options[0]?.value || "";
    select.disabled = state.humanActionConfirmed;
    confirmBtn.disabled = state.humanActionConfirmed;
    select.addEventListener("change", () => {
      state.humanActionTarget = select.value;
      state.humanActionConfirmed = false;
      saveState();
    });
    confirmBtn.addEventListener("click", () => {
      state.humanActionTarget = select.value;
      state.humanActionConfirmed = true;
      saveState();
      _deps.scheduleAutoNight();
      renderHumanAction();
    });
    return;
  }
  if (role.name === "猎手") {
    if (!human.alive) {
      humanActionBox.textContent = "你已死亡，无法发动猎手技能。";
      return;
    }
    if (state.phase !== "day" || state.dayStage !== "discussion") {
      humanActionBox.textContent = human.slayerUsed ? "猎手技能已使用。" : "白天讨论阶段可发动猎手射击。";
      return;
    }
    if (human.slayerUsed) {
      humanActionBox.textContent = "猎手技能已使用。";
      return;
    }
    const targets = state.players.filter((p) => p.alive && p.id !== human.id);
    const options = targets.map((p) => playerOptionHtml(p)).join("");
    humanActionBox.innerHTML = `
      <div class="hint">真实猎手请在此选择目标并点击“开枪”。其他玩家只能用聊天格式宣称开枪。</div>
      <div class="hint" style="margin-top:6px">猎手射击目标：</div>
      <select id="slayerTargetSelect">${options}</select>
      <button class="secondary" id="slayerShootBtn" style="margin-top:8px">开枪</button>
    `;
    const select = humanActionBox.querySelector("#slayerTargetSelect");
    const button = humanActionBox.querySelector("#slayerShootBtn");
    button.addEventListener("click", () => {
      const target = state.players.find((p) => p.id === select.value);
      if (!target) return;
      _deps.useSlayerShot(human, target);
    });
    return;
  }
  const allowSelf = role.name === "小恶魔";
  const baseTargets = role.name === "小恶魔" || role.name === "投毒者"
    ? state.players.slice()
    : state.players.filter((p) => p.alive);
  const filteredTargets = baseTargets.filter((p) => allowSelf || p.id !== human.id);
  const targetOptions = filteredTargets
    .map((p) => playerOptionHtml(p))
    .join("");
  if (role.name === "僧侣" && state.nightCount === 1) {
    humanActionBox.textContent = "首夜僧侣不执行守护。";
    return;
  }
  if (role.name === "僧侣" || role.name === "投毒者" || role.name === "管家") {
    const actionLabel = role.name === "僧侣" ? "守护" : role.name === "投毒者" ? "投毒" : "侍从";
    humanActionBox.innerHTML = `
      <div class="hint">请选择目标：</div>
      <select id="humanTargetSelect">${targetOptions}</select>
      <button class="secondary" id="humanTargetConfirmBtn" style="margin-top:8px">
        ${state.humanActionConfirmed ? "已确认" : `确认${actionLabel}`}
      </button>
    `;
    const select = humanActionBox.querySelector("#humanTargetSelect");
    const confirmBtn = humanActionBox.querySelector("#humanTargetConfirmBtn");
    select.value = state.humanActionTarget || select.options[0]?.value || "";
    select.disabled = state.humanActionConfirmed;
    confirmBtn.disabled = state.humanActionConfirmed;
    select.addEventListener("change", () => {
      state.humanActionTarget = select.value;
      state.humanActionConfirmed = false;
      saveState();
      _deps.scheduleAutoNight();
    });
    confirmBtn.addEventListener("click", () => {
      state.humanActionTarget = select.value;
      state.humanActionConfirmed = true;
      saveState();
      _deps.scheduleAutoNight();
      renderHumanAction();
    });
    return;
  }
  if (role.name === "占卜师") {
    const ftTargets = state.players.filter((p) => p.alive);
    const ftOptions = ftTargets
      .map((p) => playerOptionHtml(p))
      .join("");
    humanActionBox.innerHTML = `
      <div class="hint">请选择两名目标：</div>
      <select id="humanTargetSelect">${ftOptions}</select>
      <select id="humanTargetSelect2" style="margin-top:8px">${ftOptions}</select>
      <button class="secondary" id="humanTargetConfirmBtn" style="margin-top:8px">
        ${state.humanActionConfirmed ? "已确认" : "确认占卜"}
      </button>
    `;
    const select1 = humanActionBox.querySelector("#humanTargetSelect");
    const select2 = humanActionBox.querySelector("#humanTargetSelect2");
    const confirmBtn = humanActionBox.querySelector("#humanTargetConfirmBtn");
    const pickAlternate = (current) => {
      const options = Array.from(select2.options).map((o) => o.value);
      const alt = options.find((value) => value !== current);
      return alt || current;
    };
    select1.value = state.humanActionTarget || select1.options[0]?.value || "";
    select2.value = state.humanActionTarget2 || select2.options[1]?.value || pickAlternate(select1.value);
    if (select1.value === select2.value) {
      select2.value = pickAlternate(select1.value);
    }
    select1.disabled = state.humanActionConfirmed;
    select2.disabled = state.humanActionConfirmed;
    confirmBtn.disabled = state.humanActionConfirmed;
    select1.addEventListener("change", () => {
      state.humanActionTarget = select1.value;
      if (select1.value === select2.value) {
        select2.value = pickAlternate(select1.value);
        state.humanActionTarget2 = select2.value;
      }
      state.humanActionConfirmed = false;
      saveState();
      _deps.scheduleAutoNight();
    });
    select2.addEventListener("change", () => {
      state.humanActionTarget2 = select2.value;
      if (select1.value === select2.value) {
        select1.value = pickAlternate(select2.value);
        state.humanActionTarget = select1.value;
      }
      state.humanActionConfirmed = false;
      saveState();
      _deps.scheduleAutoNight();
    });
    confirmBtn.addEventListener("click", () => {
      state.humanActionTarget = select1.value;
      state.humanActionTarget2 = select2.value;
      if (select1.value === select2.value) {
        select2.value = pickAlternate(select1.value);
        state.humanActionTarget2 = select2.value;
      }
      state.humanActionConfirmed = true;
      saveState();
      _deps.scheduleAutoNight();
      renderHumanAction();
    });
    return;
  }
  humanActionBox.textContent = "无夜晚行动";
}

export function renderPhaseProgress(container) {
  if (!container || !state) { container.innerHTML = ""; return; }
  if (!state.started) { container.innerHTML = ""; return; }
  const steps = [];
  for (let n = 1; n <= state.nightCount; n++) {
    steps.push({ label: `夜${n}`, type: "night", idx: n });
    if (n <= state.dayCount) {
      steps.push({ label: `日${n}`, type: "day", idx: n });
    }
  }
  if (state.phase === "day" && state.dayCount > state.nightCount) {
    steps.push({ label: `日${state.dayCount}`, type: "day", idx: state.dayCount });
  }
  let html = "";
  steps.forEach((step, i) => {
    const isCurrent = (step.type === "night" && state.phase === "night" && step.idx === state.nightCount) ||
      (step.type === "day" && state.phase === "day" && step.idx === state.dayCount);
    const isPast = !isCurrent && (
      (step.type === "night" && (step.idx < state.nightCount || (step.idx === state.nightCount && state.phase === "day"))) ||
      (step.type === "day" && step.idx < state.dayCount)
    );
    const dotCls = isCurrent ? "active" : isPast ? "completed" : "";
    if (i > 0) {
      html += `<span class="phase-step-line${isPast || isCurrent ? " completed" : ""}"></span>`;
    }
    html += `<span class="phase-step"><span class="phase-step-dot ${dotCls}"></span><span class="phase-step-label">${step.label}</span></span>`;
  });
  container.innerHTML = html;
}

export function renderStatusMeta(items) {
  if (!statusMetaChips) return;
  statusMetaChips.innerHTML = "";
  if (!Array.isArray(items) || !items.length) return;
  items.forEach((text) => {
    const chip = document.createElement("span");
    chip.className = "status-pill";
    chip.textContent = text;
    statusMetaChips.appendChild(chip);
  });
}

export function renderNominationFlow() {
  if (!nominationFlow || !state) return;
  const visible =
    state.started &&
    !state.ended &&
    state.phase === "day" &&
    state.dayStage === "nomination";
  nominationFlow.innerHTML = "";
  nominationFlow.style.display = visible ? "flex" : "none";
  if (!visible) return;

  const order = ["open", "reason", "defense", "voting"];
  const labels = ["提名", "理由", "辩解", "投票"];
  const phase = order.includes(state.nominationPhase) ? state.nominationPhase : "open";
  const activeIndex = order.indexOf(phase);
  labels.forEach((label, index) => {
    const step = document.createElement("span");
    let cls = "nomination-step";
    if (index < activeIndex) cls += " done";
    if (index === activeIndex) cls += " active";
    step.className = cls;
    step.textContent = label;
    nominationFlow.appendChild(step);
    if (index < labels.length - 1) {
      const line = document.createElement("span");
      line.className = "nomination-flow-line";
      nominationFlow.appendChild(line);
    }
  });
}

export function renderTaskCardStatus() {
  if (!taskSection || !taskTitle || !taskDesc || !taskHint || !state) return;
  const human = state.players.find((p) => p.isHuman);
  let title = "等待开局";
  let desc = "请先生成玩家并随机发牌。";
  let hint = "建议顺序：生成玩家 -> 随机发牌 -> 开局。";

  if (!state.started) {
    taskSection.style.display = "";
    taskTitle.textContent = title;
    taskDesc.textContent = desc;
    taskHint.textContent = hint;
    return;
  }

  if (state.ended) {
    title = state.postGameChat ? "赛后聊天" : "游戏结束";
    desc = state.postGameChat
      ? `可继续发言或点击“AI轮转”进行赛后交流。`
      : "你可以导出复盘与轨迹，或重置开始下一局。";
    hint = "建议：先导出复盘，再重置。";
    taskTitle.textContent = title;
    taskDesc.textContent = desc;
    taskHint.textContent = hint;
    return;
  }

  if (state.phase === "night") {
    if (_deps.needsHumanNightAction() && !_deps.isHumanActionReady()) {
      title = "请完成你的夜晚行动";
      desc = `在“你的夜晚行动”面板中选择目标并确认，然后等待结算。`;
      hint = "未确认前不会自动进入天亮。";
    } else {
      title = "等待夜晚结算";
      desc = autoNightToggle.checked
        ? "系统将自动结算夜晚流程。"
        : `点击“夜晚结算”推进到天亮。`;
      hint = "夜晚信息会在天亮后公布。";
    }
    taskTitle.textContent = title;
    taskDesc.textContent = desc;
    taskHint.textContent = hint;
    return;
  }

  if (state.evilChatPhase) {
    const isHumanEvil = human && (human.team === "minion" || human.team === "demon");
    if (isHumanEvil) {
      title = "邪恶阵营密聊中";
      desc = "你正在与邪恶同伴密聊，协商策略。";
      hint = "密聊结束后将进入公开讨论。";
    } else {
      title = "邪恶阵营密聊中";
      desc = "邪恶阵营正在密聊中，请耐心等待。";
      hint = "此阶段你无法发言，密聊结束后将进入公开讨论。";
    }
    taskTitle.textContent = title;
    taskDesc.textContent = desc;
    taskHint.textContent = hint;
    return;
  }

  if (state.dayStage === "discussion") {
    const speaker = state.players.find((p) => p.id === state.currentSpeakerId);
    if (speaker && human && speaker.id === human.id) {
      title = "轮到你发言";
      desc = "在输入框中发言，或点击「跳过讨论」进入提名阶段。";
      hint = "快捷操作：回车发送。";
    } else if (speaker) {
      title = `等待 ${speaker.name} 发言`;
      desc = "你可以观察公开聊天，并准备提名阶段的策略。";
      hint = "若讨论超时，将自动进入提名。";
    } else {
      title = "自由讨论中";
      desc = "关注公开聊天中的身份声明与矛盾点。";
      hint = "信息位先保留，提名前集中梳理。";
    }
    taskTitle.textContent = title;
    taskDesc.textContent = desc;
    taskHint.textContent = hint;
    return;
  }

  if (state.dayStage === "nomination") {
    const nominee = state.players.find((p) => p.id === state.currentNomineeId);
    const humanCanNominate = human &&
      human.alive &&
      state.nominationPhase === "open" &&
      !state.humanNominationDone &&
      !state.nominationUsedIds.includes(human.id);
    const humanCanVote = human &&
      state.nominationPhase === "voting" &&
      state.currentVoterId === human.id &&
      !state.humanVoted &&
      (human.alive || !human.deadVoteUsed);

    if (state.nominationPhase === "open") {
      title = humanCanNominate ? "你可以提名" : "提名轮转中";
      desc = humanCanNominate
        ? "选择一名存活玩家并提交提名，或跳过。"
        : "等待其他玩家完成提名。";
      hint = `今日提名：${state.dayNominationCount}`;
    } else if (state.nominationPhase === "reason") {
      title = "提名理由阶段";
      desc = nominee ? `围绕“${nominee.name}”的提名理由陈述中。` : "提名理由陈述中。";
      hint = "公开发言阶段，注意信息一致性。";
    } else if (state.nominationPhase === "defense") {
      title = "被提名人辩解";
      desc = nominee ? `${nominee.name} 正在进行辩解。` : "被提名人辩解中。";
      hint = "辩解结束后将进入投票。";
    } else if (state.nominationPhase === "voting") {
      title = humanCanVote ? "轮到你投票" : "投票进行中";
      desc = nominee ? `请对“${nominee.name}”作出赞成或反对。` : "请完成本轮投票。";
      hint = humanCanVote
        ? "快捷键：Y=赞成，N=反对。"
        : `等待其他玩家投票（剩余AI：${state.pendingAiVotes || 0}）。`;
    } else {
      title = "提名阶段";
      desc = "正在处理提名流程。";
      hint = "请等待流程推进。";
    }
  }

  taskTitle.textContent = title;
  taskDesc.textContent = desc;
  taskHint.textContent = hint;
}

export function renderStatus() {
  const label = getPhaseLabel();
  let extra = "";
  if (state.started && state.ended && state.postGameChat) {
    extra = "赛后聊天";
  } else if (state.started && state.phase === "day") {
    extra = state.evilChatPhase ? "邪恶阵营密聊中" : (state.dayStage === "discussion" ? "讨论中" : "提名阶段");
    if (state.dayStage === "discussion" && state.discussionMaxRemaining > 0) {
      const mins = Math.floor(state.discussionMaxRemaining / 60);
      const secs = state.discussionMaxRemaining % 60;
      extra += ` · 剩余${mins}分${String(secs).padStart(2, "0")}秒`;
    }
    if (state.dayStage === "nomination" && state.currentNomineeId) {
      const nominee = state.players.find((p) => p.id === state.currentNomineeId);
      if (nominee) {
        extra += ` · 已提名${nominee.name}`;
      }
    }
  if (state.dayStage === "nomination") {
    if (state.nominationPhase === "open" && state.currentSpeakerId) {
      const speaker = state.players.find((p) => p.id === state.currentSpeakerId);
      if (speaker) {
        extra += ` · 轮到${speaker.isHuman ? "你" : speaker.name}提名`;
      }
    }
    if (state.nominationPhase === "reason") {
      extra += " · 提名理由";
    }
    if (state.nominationPhase === "defense") {
      extra += " · 被提名人辩解";
    }
    if (state.nominationPhase === "voting") {
      extra += " · 投票中";
      const voter = state.players.find((p) => p.id === state.currentVoterId);
        if (voter && voter.isHuman && !state.humanVoted) {
          extra += " · 等待你投票";
        }
        if (state.voteCountdown > 0) {
          extra += ` · 倒计时${state.voteCountdown}s`;
        }
      }
    }
  } else if (state.started && state.phase === "night") {
    if (_deps.needsHumanNightAction() && !_deps.isHumanActionReady()) {
      extra = "等待你选择夜晚目标";
    } else if (autoNightToggle.checked) {
      extra = "自动结算中 · 请等待说书人宣布天亮";
    } else {
      extra = "请等待说书人宣布天亮";
    }
  }
  if (state.started && state.paused) {
    extra = extra ? `${extra} · 已暂停` : "已暂停";
  }
  if (typeof window.syncAutoBgmForState === "function") {
    window.syncAutoBgmForState();
  }
  const phaseStatusText = document.getElementById("phaseStatusText");
  if (phaseStatusText) {
    phaseStatusText.textContent = extra ? `${label} · ${extra}` : label;
  } else {
    phaseStatus.textContent = extra ? `${label} · ${extra}` : label;
  }

  /* Day/Dusk/Night body class */
  document.body.classList.remove("phase-night", "phase-day", "phase-dusk");
  if (state.started && !state.ended) {
    if (state.phase === "night") {
      document.body.classList.add("phase-night");
    } else if (state.phase === "day" && state.dayStage === "nomination") {
      document.body.classList.add("phase-dusk");
    } else {
      document.body.classList.add("phase-day");
    }
  }

  /* Countdown ring */
  const countdownRing = document.getElementById("countdownRing");
  const countdownRingFg = document.getElementById("countdownRingFg");
  const countdownRingText = document.getElementById("countdownRingText");
  if (countdownRing && countdownRingFg && countdownRingText) {
    const hasCountdown = state.phase === "day" && state.dayStage === "discussion" && state.discussionMaxRemaining > 0;
    countdownRing.style.display = hasCountdown ? "inline-flex" : "none";
    if (hasCountdown) {
      const duration = getDiscussionDurationSeconds();
      const ratio = duration > 0 ? state.discussionMaxRemaining / duration : 0;
      const circumference = 81.68;
      countdownRingFg.style.strokeDashoffset = circumference * (1 - ratio);
      const mins = Math.floor(state.discussionMaxRemaining / 60);
      const secs = state.discussionMaxRemaining % 60;
      countdownRingText.textContent = `${mins}:${String(secs).padStart(2, "0")}`;
    }
  }

  /* Phase progress bar */
  const progressEl = document.getElementById("phaseProgress");
  if (progressEl) {
    renderPhaseProgress(progressEl);
  }
  renderNominationFlow();

  /* Phase-aware action group visibility */
  const nightOverlay = document.getElementById("nightOverlay");
  const discussionBtnGroup = document.getElementById("discussionBtnGroup");
  const nominationBtnGroup = document.getElementById("nominationBtnGroup");
  const voteBtnGroup = document.getElementById("voteBtnGroup");
  const voteCountdownDisplay = document.getElementById("voteCountdownDisplay");

  const isNight = state.started && !state.ended && state.phase === "night";
  const isDiscussion = state.started && !state.ended && state.phase === "day" && state.dayStage === "discussion";
  const isPostGameChat = state.started && state.ended && state.postGameChat;
  const isNomination = state.started && !state.ended && state.phase === "day" && state.dayStage === "nomination" && state.nominationPhase === "open";
  const isVoting = state.started && !state.ended && state.phase === "day" && state.dayStage === "nomination" && state.nominationPhase === "voting";
  const discussionFocus = isDiscussion;

  if (townLayoutEl) {
    const wasFocus = townLayoutEl.classList.contains("discussion-focus");
    townLayoutEl.classList.toggle("discussion-focus", discussionFocus);
    if (typeof _deps.applyDiscussionDrawers === "function") _deps.applyDiscussionDrawers();
    if (wasFocus !== discussionFocus) {
      if (typeof _deps.scheduleChatRelock === "function") _deps.scheduleChatRelock(420);
    }
  }

  if (nightOverlay) nightOverlay.className = isNight ? "night-overlay visible" : "night-overlay";
  const showDiscussionActions = isDiscussion || isPostGameChat;
  if (discussionActionsEl) {
    const wasVisible = discussionActionsEl.style.display !== "none";
    discussionActionsEl.style.display = showDiscussionActions ? "" : "none";
    if (showDiscussionActions !== wasVisible) {
      if (typeof _deps.scheduleChatRelock === "function") _deps.scheduleChatRelock(360);
    }
  }
  if (discussionBtnGroup) discussionBtnGroup.className = showDiscussionActions ? "action-group visible" : "action-group";
  if (nominationBtnGroup) nominationBtnGroup.className = isNomination ? "action-group visible" : "action-group";
  if (voteBtnGroup) voteBtnGroup.className = isVoting ? "vote-actions visible" : "vote-actions";
  if (voteCountdownDisplay) {
    voteCountdownDisplay.textContent = state.voteCountdown > 0 ? `${state.voteCountdown}s` : "";
  }

  nightResolveBtn.disabled = !state.started || state.ended || state.phase !== "night";
  const canAiTalk =
    state.started &&
    !state.paused &&
    ((state.phase === "day" && state.dayStage === "discussion" && !state.ended) || isPostGameChat);
  aiTalkBtn.disabled = !canAiTalk || state.postGameInProgress;
  voteBtn.disabled =
    !state.started ||
    state.ended ||
    state.phase !== "day" ||
    state.dayStage !== "nomination" ||
    !state.currentNomineeId ||
    state.nominationPhase !== "voting";
  forceNominationBtn.disabled = !state.started || state.ended || state.phase !== "day" || state.dayStage !== "discussion" || state.evilChatPhase;
  const human = state.players.find((p) => p.isHuman);
  const humanEligibleToNominate =
    human &&
    human.alive &&
    !state.humanNominationDone &&
    !state.nominationUsedIds.includes(human.id);
  const humanTurnToNominate =
    state.phase === "day" &&
    state.dayStage === "nomination" &&
    state.nominationPhase === "open" &&
    humanEligibleToNominate;
  nominateBtn.disabled = !state.started || state.ended || !humanTurnToNominate;
  skipNominationBtn.disabled = !state.started || state.ended || !humanTurnToNominate;
  const humanEligibleToVoteYes = human && (human.alive || (!human.alive && !human.deadVoteUsed));
  const humanTurnToVote =
    state.phase === "day" &&
    state.dayStage === "nomination" &&
    state.nominationPhase === "voting" &&
    human &&
    state.currentVoterId === human.id;
  voteYesBtn.disabled =
    !state.started || state.ended || !humanTurnToVote || state.humanVoted || !humanEligibleToVoteYes;
  voteNoBtn.disabled = !state.started || state.ended || !humanTurnToVote || state.humanVoted;
  endBtn.disabled = !state.started || state.ended;
  passBtn.disabled = !state.started || state.ended || state.phase !== "day" || state.dayStage !== "discussion" || state.evilChatPhase;
  const allowPostGameChat = state.started && state.ended && state.postGameChat;
  const nominationBlocksChat = state.dayStage === "nomination" && !allowPostGameChat;
  const humanIsGood = human && human.team !== "minion" && human.team !== "demon";
  const evilChatBlocksChat = state.evilChatPhase && humanIsGood;
  const chatBlocked = nominationBlocksChat || evilChatBlocksChat;
  if (chatLockHint) {
    chatLockHint.style.display = chatBlocked ? "" : "none";
    if (evilChatBlocksChat) {
      chatLockHint.textContent = "邪恶阵营密聊中，善良玩家无法发言，请等待密聊结束。";
    } else if (nominationBlocksChat) {
      chatLockHint.textContent = "提名/投票阶段已锁定聊天输入，请先完成流程。";
    } else {
      chatLockHint.textContent = "";
    }
  }
  if (slayerFormatHint) {
    const showSlayerHint = isDiscussion && !state.paused;
    slayerFormatHint.style.display = showSlayerHint ? "" : "none";
    slayerFormatHint.textContent = showSlayerHint
      ? `猎手声明格式：${SLAYER_DECLARATION_TEMPLATE}（不符合格式不触发；每名玩家每局仅首次此格式会结算）`
      : "";
  }
  if (slayerTemplateBtn) {
    slayerTemplateBtn.style.display = isDiscussion ? "" : "none";
    slayerTemplateBtn.disabled = !isDiscussion || state.paused;
  }
  sendBtn.disabled = !state.started || (!allowPostGameChat && state.ended) || chatBlocked;
  humanInput.disabled = !state.started || (!allowPostGameChat && state.ended) || chatBlocked;
  if (humanInput) {
    humanInput.placeholder = isDiscussion
      ? `你可以在这里发言...（猎手格式：${SLAYER_DECLARATION_TEMPLATE}）`
      : "你可以在这里发言...";
  }
  const _canVoice = typeof _deps.canUseVoiceInput === "function" ? _deps.canUseVoiceInput() : false;
  if (voiceBtn) voiceBtn.disabled = !_canVoice;
  if (!_canVoice && speechActive) {
    stopVoiceRecognition("");
  }
  if (state.paused) {
    nightResolveBtn.disabled = true;
    aiTalkBtn.disabled = true;
    voteBtn.disabled = true;
    forceNominationBtn.disabled = true;
    sendBtn.disabled = true;
    passBtn.disabled = true;
    nominateBtn.disabled = true;
    skipNominationBtn.disabled = true;
    voteYesBtn.disabled = true;
    voteNoBtn.disabled = true;
    if (voiceBtn) voiceBtn.disabled = true;
    if (speechActive) {
      stopVoiceRecognition("游戏已暂停。");
    }
    if (privateTargetSelect) privateTargetSelect.disabled = true;
    if (privateInput) privateInput.disabled = true;
    if (privateSendBtn) privateSendBtn.disabled = true;
    if (humanInput) humanInput.disabled = true;
  }
  const aliveCount = state.players.filter((p) => p.alive).length;
  const chips = [];
  if (state.started) {
    chips.push(`存活 ${aliveCount}/${state.players.length}`);
    if (state.phase === "day") {
      chips.push(`提名 ${state.dayNominationCount || 0}`);
    }
    if (state.evilChatPhase) {
      chips.push("邪恶阵营密聊中");
    }
    if (state.phase === "day" && state.dayStage === "discussion" && state.currentSpeakerId) {
      const speaker = state.players.find((p) => p.id === state.currentSpeakerId);
      if (speaker) chips.push(`当前发言 ${speaker.isHuman ? "你" : speaker.name}`);
    }
    if (state.phase === "day" && state.dayStage === "nomination" && state.currentNomineeId) {
      const nominee = state.players.find((p) => p.id === state.currentNomineeId);
      if (nominee) chips.push(`被提名 ${nominee.name}`);
    }
    if (state.phase === "day" && state.dayStage === "nomination" && state.nominationPhase === "voting") {
      chips.push(`AI待投 ${state.pendingAiVotes || 0}`);
    }
    if (state.paused) {
      chips.push("已暂停");
    }
  }
  renderStatusMeta(chips);
  renderTaskCardStatus();
  if (typeof _deps.updatePauseButton === "function") _deps.updatePauseButton();
}


export function renderConfigSummary() {
  if (!configSummaryBox) return;
  const count = state && state.players ? state.players.length : Number(playerCountInput.value) || 0;
  const dist = PLAYER_DISTRIBUTION[count] || null;
  if (!count || !dist) {
    configSummaryBox.innerHTML = `<span class="chip">暂无配置</span>`;
    return;
  }
  const label = "标准配置";
  const chips = [
    `<span class="chip">${label}</span>`,
    `<span class="chip">人数 ${count}</span>`,
    `<span class="chip">镇民 ${dist.townsfolk}</span>`,
    `<span class="chip">外来者 ${dist.outsider}</span>`,
    `<span class="chip">爪牙 ${dist.minion}</span>`,
    `<span class="chip">恶魔 ${dist.demon}</span>`
  ];
  configSummaryBox.innerHTML = chips.join("");
}

export function renderTokenUsageDisplay() {
  const section = document.getElementById("tokenUsageSection");
  const container = document.getElementById("tokenUsageDisplay");
  if (!section || !container) return;
  const summary = getTokenUsageSummary();
  if (summary.totalTokens === 0) {
    section.style.display = "none";
    return;
  }
  section.style.display = "";
  const modelKeys = Object.keys(summary.models);
  const fmtNum = (n) => n >= 1e6 ? (n / 1e6).toFixed(2) + "M" : n >= 1e3 ? (n / 1e3).toFixed(1) + "K" : String(n);
  const fmtCost = (c) => c < 0.01 ? "<$0.01" : "$" + c.toFixed(2);
  let rows = modelKeys.map((m) => {
    const u = summary.models[m];
    const costStr = u.hasPricing ? fmtCost(u.cost) : "—";
    return `<tr><td title="${m}">${m.length > 28 ? m.slice(0, 26) + "…" : m}</td><td>${u.calls}</td><td>${fmtNum(u.promptTokens)}</td><td>${fmtNum(u.completionTokens)}</td><td>${fmtNum(u.totalTokens)}</td><td>${costStr}</td></tr>`;
  }).join("");
  const hasAnyPricing = modelKeys.some((m) => summary.models[m].hasPricing);
  container.innerHTML =
    `<table class="token-usage-table"><tr><th>模型</th><th>调用</th><th>输入</th><th>输出</th><th>总计</th><th>费用</th></tr>${rows}</table>` +
    `<div class="token-usage-total"><span>总 Token: <b>${fmtNum(summary.totalTokens)}</b></span>` +
    (hasAnyPricing ? `<span>预估总花费: <span class="cost">${fmtCost(summary.totalCost)}</span></span>` : `<span style="color:var(--muted)">部分模型无定价数据</span>`) +
    `</div>`;
}

export function renderSeatCircle() {
  const wrapper = document.getElementById("seatCircle");
  const centerEl = document.getElementById("seatCircleCenter");
  const phaseIcon = document.getElementById("seatPhaseIcon");
  const phaseText = document.getElementById("seatPhaseText");
  if (!wrapper || !state || !state.players.length) return;

  // Update center phase
  if (phaseIcon && phaseText) {
    if (!state.started) {
      phaseIcon.textContent = "\u2694\uFE0F";
      phaseText.textContent = "未开局";
    } else if (state.ended) {
      phaseIcon.textContent = "\uD83D\uDC80";
      phaseText.textContent = "已结束";
    } else if (state.phase === "night") {
      phaseIcon.textContent = "\uD83C\uDF19";
      phaseText.textContent = `夜晚 ${state.nightCount}`;
    } else if (state.phase === "day" && state.dayStage === "nomination") {
      phaseIcon.textContent = "\uD83C\uDF05";
      phaseText.textContent = `白天 ${state.dayCount} · 提名 (黄昏)`;
    } else {
      phaseIcon.textContent = "\u2600\uFE0F";
      phaseText.textContent = `白天 ${state.dayCount} · 讨论`;
    }
  }

  // Remove old nodes and pointer SVG (but keep center)
  wrapper.querySelectorAll(".seat-node, .nomination-pointer-svg").forEach((n) => n.remove());

  const count = state.players.length;
  const wrapperRect = wrapper.getBoundingClientRect();
  const size = Math.min(wrapperRect.width, wrapperRect.height) || 400;
  const radius = (size / 2) - 42;
  const cx = size / 2;
  const cy = size / 2;

  const isDay = state.started && !state.ended && state.phase === "day";
  const isNominationPhase = isDay && state.dayStage === "nomination";
  const nominatorId = isNominationPhase ? state.currentNominatorId : "";
  const nomineeId = isNominationPhase ? state.currentNomineeId : "";

  state.players.forEach((player, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);

    const node = document.createElement("div");
    let cls = "seat-node";
    cls += player.alive ? " alive" : " dead";
    if (player.isHuman) cls += " self";
    const isSpeaking = isDay && state.dayStage === "discussion" && state.currentSpeakerId === player.id;
    const isNominated = isNominationPhase && nomineeId === player.id;
    const isNominator = isNominationPhase && nominatorId === player.id;
    if (isSpeaking) cls += " speaking-node";
    if (isNominated) cls += " nominated-node";
    if (isNominator) cls += " nominator-node";
    node.className = cls;
    node.style.left = `${x}px`;
    node.style.top = `${y}px`;

    let statusIcon = "";
    if (!player.alive) statusIcon = "\uD83D\uDC80";
    else if (isSpeaking) statusIcon = "\uD83D\uDDE3\uFE0F";

    const noteRole = player.noteRole || "";
    const noteTags = Array.isArray(player.noteTags) ? player.noteTags : [];

    /* plus button offset: toward center */
    const toCenterAngle = angle + Math.PI; /* opposite of outward angle */
    const plusDist = 34; /* distance from node center */
    const plusOffX = plusDist * Math.cos(toCenterAngle);
    const plusOffY = plusDist * Math.sin(toCenterAngle);

    /* tags offset: further toward center */
    const tagsDist = 54;
    const tagsOffX = tagsDist * Math.cos(toCenterAngle);
    const tagsOffY = tagsDist * Math.sin(toCenterAngle);

    const tagsHtml = noteTags.map((t, ti) =>
      `<span class="seat-tag" data-player-id="${player.id}" data-tag-idx="${ti}">${t}</span>`
    ).join("");

    node.innerHTML = `
      <span class="seat-num">${i + 1}</span>
      <span class="seat-note-role">${noteRole}</span>
      <span class="seat-label">${player.name}${player.isHuman ? " (你)" : ""}</span>
      ${statusIcon ? `<span class="seat-status-icon">${statusIcon}</span>` : ""}
      <span class="seat-tooltip">${player.name} · ${player.alive ? "存活" : "死亡"}${noteRole ? " · 标注: " + noteRole : ""}</span>
      <span class="seat-plus-btn" data-player-id="${player.id}" style="left:${28 + plusOffX}px;top:${28 + plusOffY}px;transform:translate(-50%,-50%)">+</span>
      ${tagsHtml ? `<span class="seat-tags" style="left:${28 + tagsOffX}px;top:${28 + tagsOffY}px;transform:translate(-50%,-50%)">${tagsHtml}</span>` : ""}
    `;
    /* click circle → role picker */
    node.addEventListener("click", (e) => {
      if (e.target.closest(".seat-plus-btn") || e.target.closest(".seat-tag")) return;
      window.openNoteRolePicker(player.id, node.getBoundingClientRect());
    });
    wrapper.appendChild(node);
  });

  /* ---- Nomination pointer arrows ---- */
  if (nominatorId && nomineeId) {
    const nominatorIdx = state.players.findIndex((p) => p.id === nominatorId);
    const nomineeIdx = state.players.findIndex((p) => p.id === nomineeId);
    if (nominatorIdx >= 0 && nomineeIdx >= 0) {
      const ntrAngle = (2 * Math.PI * nominatorIdx) / count - Math.PI / 2;
      const neeAngle = (2 * Math.PI * nomineeIdx) / count - Math.PI / 2;
      const shortLen = radius * 0.58;
      const longLen = radius * 0.88;
      /* tip geometry (triangle arrow head) */
      const tipSize = 10;
      function arrowPath(angle, len, color, inward) {
        const ex = cx + len * Math.cos(angle);
        const ey = cy + len * Math.sin(angle);
        var tipAngle = inward ? angle + Math.PI : angle;
        var tipDx = tipSize * Math.cos(tipAngle);
        var tipDy = tipSize * Math.sin(tipAngle);
        var perpX = tipSize * 0.5 * Math.cos(tipAngle + Math.PI / 2);
        var perpY = tipSize * 0.5 * Math.sin(tipAngle + Math.PI / 2);
        var tx = inward ? cx : ex;
        var ty = inward ? cy : ey;
        var t1x = tx + tipDx, t1y = ty + tipDy;
        var t2x = tx - perpX, t2y = ty - perpY;
        var t3x = tx + perpX, t3y = ty + perpY;
        return `<line x1="${cx}" y1="${cy}" x2="${ex}" y2="${ey}" stroke="${color}" stroke-width="3" stroke-linecap="round"/>` +
               `<polygon points="${t1x},${t1y} ${t2x},${t2y} ${t3x},${t3y}" fill="${color}"/>`;
      }
      const uid = Date.now();
      const svgHtml = `<svg class="nomination-pointer-svg" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="glow-g-${uid}" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="b"/><feFlood flood-color="#daa520" flood-opacity="0.6"/>
            <feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
          <filter id="glow-r-${uid}" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4.5" result="b"/><feFlood flood-color="#dc3545" flood-opacity="0.6"/>
            <feComposite in2="b" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <g filter="url(#glow-g-${uid})">${arrowPath(ntrAngle, shortLen, "#daa520", true)}</g>
        <g filter="url(#glow-r-${uid})">${arrowPath(neeAngle, longLen, "#dc3545", false)}</g>
      </svg>`;
      const container = document.createElement("div");
      container.innerHTML = svgHtml;
      const svg = container.firstElementChild;
      wrapper.appendChild(svg);
    }
  }
}

let seatCircleObserver = null;

export function setupSeatCircleObserver() {
  const wrapper = document.getElementById("seatCircle");
  if (!wrapper || typeof ResizeObserver === "undefined") return;
  if (seatCircleObserver) seatCircleObserver.disconnect();
  seatCircleObserver = new ResizeObserver(() => {
    if (state && state.players && state.players.length) {
      renderSeatCircle();
    }
  });
  seatCircleObserver.observe(wrapper);
}

export function resetSeatCircleView() {
  const wrapper = document.getElementById("seatCircle");
  const phaseIcon = document.getElementById("seatPhaseIcon");
  const phaseText = document.getElementById("seatPhaseText");
  const nightOverlay = document.getElementById("nightOverlay");
  if (wrapper) {
    wrapper.querySelectorAll(".seat-node").forEach((n) => n.remove());
  }
  if (phaseIcon) phaseIcon.textContent = "\u2694\uFE0F";
  if (phaseText) phaseText.textContent = "未开局";
  if (nightOverlay) nightOverlay.className = "night-overlay";
}

export function renderAll() {
  if (!state || !state.players) {
    renderConfigSummary();
    renderTokenUsageDisplay();
    if (typeof _deps.updateHeaderPhase === "function") _deps.updateHeaderPhase();
    return;
  }
  renderPlayers();
  renderSeatCircle();
  renderHumanInfo();
  renderHumanAction();
  if (typeof _deps.renderChat === "function") _deps.renderChat();
  if (typeof _deps.renderPrivateChat === "function") _deps.renderPrivateChat();
  renderLog();
  renderPublicLog();
  if (typeof _deps.renderReplay === "function") _deps.renderReplay();
  renderConfigSummary();
  renderTokenUsageDisplay();
  renderStatus();
  renderTaskCardStatus();
  if (typeof _deps.updatePrivateChatControls === "function") _deps.updatePrivateChatControls();
  if (typeof _deps.updateHeaderPhase === "function") _deps.updateHeaderPhase();
  saveState();
}


export function renderPlayerModelList() {
  if (!playerModelListEl || !state || !state.players.length) return;
  playerModelListEl.innerHTML = "";
  state.players.forEach((player) => {
    const row = document.createElement("div");
    row.className = "player-model-row";
    const nameSpan = document.createElement("span");
    nameSpan.className = player.isHuman ? "pm-name pm-human" : "pm-name";
    nameSpan.textContent = player.name + (player.isHuman ? " (你)" : "");
    row.appendChild(nameSpan);

    if (player.isHuman) {
      const hint = document.createElement("span");
      hint.style.cssText = "color:var(--muted);font-size:12px;";
      hint.textContent = "人类玩家";
      row.appendChild(hint);
    } else {
      const sel = document.createElement("select");
      const defaultOpt = document.createElement("option");
      defaultOpt.value = "default";
      defaultOpt.textContent = "默认模型";
      sel.appendChild(defaultOpt);
      MODEL_OPTIONS.forEach((opt) => {
        const o = document.createElement("option");
        o.value = opt.value;
        o.textContent = opt.label;
        sel.appendChild(o);
      });
      sel.value = player.modelChoice || "default";
      sel.addEventListener("change", () => {
        player.modelChoice = sel.value;
        saveState();
      });
      row.appendChild(sel);
    }
    playerModelListEl.appendChild(row);
  });
}
