/**
 * export.js — Export / replay functions extracted from singleplayer_demo.html
 *
 * Handles JSON export, trajectory export, story summary generation,
 * and the replay panel renderer.
 */

import { state, saveState } from './state.js';
import { SCRIPT } from './constants.js';
import { callDeepSeek, getTokenUsageSummary } from './api.js';
import { getApparentRole } from './utils.js';
import {
  renderAll,
  tempInput,
  replayPanel,
  replayRoles,
  replayActions,
  replayPrivate,
  replayChat,
  storySummaryBox,
  storySummaryBtn
} from './ui-helpers.js';

function getReplayRoleLabel(player) {
  if (!player) return "未知";
  const history = Array.isArray(player.roleHistory) ? player.roleHistory : [];
  let label = "";
  if (history.length > 1) {
    const parts = history.map((entry, idx) => {
      const roleLabel = entry.roleName || "未知";
      if (idx === 0) return `初始${roleLabel}`;
      const timeTag = entry.night
        ? `第${entry.night}晚`
        : entry.day
          ? `第${entry.day}天`
          : "未知时间";
      const reason = entry.reason ? `（${entry.reason}）` : "";
      return `${roleLabel}（${timeTag}${reason}）`;
    });
    label = parts.join(" → ");
  } else if (player.roleName === "酒鬼") {
    const apparent = getApparentRole(player);
    if (apparent && apparent.name) {
      label = `${apparent.name}（酒鬼）`;
    } else {
      label = player.roleName || "未知";
    }
  } else {
    label = player.roleName || "未知";
  }
  if (state && player.id === state.redHerringId) {
    label = `${label}（干扰项）`;
  }
  return label;
}

/* ===== exportJson ===== */

export function exportJson() {
  const payload = {
    script: SCRIPT.name,
    players: state.players.map((p) => ({
      name: p.name,
      roleId: p.roleId,
      roleName: p.roleName,
      displayRoleName: getReplayRoleLabel(p),
      team: p.team,
      privateInfo: p.privateInfo,
      memory: p.memory
    })),
    redHerring: state.players.find((p) => p.id === state.redHerringId)?.name || "",
    publicLog: state.publicLog || [],
    claims: state.claims || {},
    claimHistory: state.claimHistory || [],
    privateChat: state.privateChat || [],
    evilChat: state.evilChat || [],
    replayEvents: state.replayEvents || [],
    infoAudit: state.infoAudit || [],
    trajectoryCount: Array.isArray(state.trajectoryLog) ? state.trajectoryLog.length : 0,
    storytellerSummary: state.storySummary || "",
    log: state.log,
    chat: state.chat,
    tokenUsage: state.tokenUsage || {},
    tokenSummary: getTokenUsageSummary(),
    meta: {
      started: state.started,
      ended: state.ended,
      dayCount: state.dayCount,
      nightCount: state.nightCount,
      discussionRound: state.discussionRound
    }
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "botc_singleplayer_replay.json";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}

/* ===== exportTrajectories ===== */

export function exportTrajectories() {
  if (!state || !Array.isArray(state.trajectoryLog) || !state.trajectoryLog.length) {
    alert(`暂无轨迹记录。请先开启"记录 LLM 轨迹"。`);
    return;
  }
  const sanitize = (value) => String(value || "unknown").replace(/[\\/:*?"<>|\s]+/g, "_");
  const groups = new Map();
  state.trajectoryLog.forEach((entry) => {
    const key = entry.actorId || entry.actor || "unknown";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(entry);
  });
  groups.forEach((entries) => {
    const sorted = entries.slice().sort((a, b) => String(a.time).localeCompare(String(b.time)));
    const actorName = sorted[0]?.actor || "unknown";
    const providers = new Set(sorted.map((e) => e.provider).filter(Boolean));
    const models = new Set(sorted.map((e) => e.model).filter(Boolean));
    const providerLabel = providers.size === 1 ? Array.from(providers)[0] : "mixed";
    const modelLabel = models.size === 1 ? Array.from(models)[0] : "mixed";
    const filename = `botc_trajectory_${sanitize(actorName)}_${sanitize(providerLabel)}_${sanitize(modelLabel)}.jsonl`;
    const lines = [];
    sorted.forEach((entry) => {
      const messages = Array.isArray(entry.messages) ? entry.messages : [];
      messages.forEach((msg) => {
        if (!msg || !msg.role) return;
        lines.push(JSON.stringify({ role: msg.role, content: String(msg.content || "") }));
      });
      if (entry.response) {
        const assistantPayload = { role: "assistant", content: String(entry.response) };
        if (entry.reasoning_content) {
          assistantPayload.reasoning_content = String(entry.reasoning_content);
        }
        lines.push(JSON.stringify(assistantPayload));
      }
    });
    const blob = new Blob([lines.join("\n")], { type: "application/jsonl" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(link.href);
  });
}

/* ===== generateStorySummary ===== */

export async function generateStorySummary(options = {}) {
  const { silent = false, force = false } = options;
  if (!state || !state.ended) {
    if (!silent) alert("请在游戏结束后生成复盘。");
    return;
  }
  if (state.storySummaryPending) return;
  if (state.storySummary && !force) return;
  state.storySummaryPending = true;
  if (storySummaryBox) {
    storySummaryBox.textContent = "正在生成复盘...";
  }
  const payload = {
    script: SCRIPT.name,
    players: state.players.map((p) => ({
      name: p.name,
      roleName: p.roleName,
      team: p.team,
      privateInfo: p.privateInfo
    })),
    redHerring: state.players.find((p) => p.id === state.redHerringId)?.name || "",
    publicLog: state.publicLog || [],
    privateChat: state.privateChat || [],
    evilChat: state.evilChat || [],
    replayEvents: state.replayEvents || [],
    chat: state.chat || [],
    meta: {
      dayCount: state.dayCount,
      nightCount: state.nightCount
    }
  };
  const prompt = [
    {
      role: "system",
      content: "你是《血染钟楼》的说书人，请基于复盘数据生成一份中文整体复盘。"
    },
    {
      role: "user",
      content: `请输出一份包含以下内容的复盘：\n1) 关键转折与处决链路\n2) 主要信息源与误导来源（尤其是中毒/醉酒导致的错误信息）\n3) 善恶双方关键决策与成败点\n4) 可改进的策略建议\n\n复盘数据（JSON）：\n${JSON.stringify(payload, null, 2)}`
    }
  ];
  try {
    const content = await callDeepSeek(prompt, Number(tempInput.value) || 0.7, null, "summary", false);
    state.storySummary = (content || "").trim() || "生成失败。";
  } catch (error) {
    state.storySummary = "生成失败。";
  } finally {
    state.storySummaryPending = false;
  }
  renderReplay();
  saveState();
}

/* ===== renderReplay ===== */

export function renderReplay() {
  if (!state || !state.ended) {
    if (replayPanel) replayPanel.style.display = "none";
    return;
  }
  replayPanel.style.display = "";
  replayRoles.innerHTML = "";
  state.players.forEach((player) => {
    const li = document.createElement("li");
    li.textContent = `${player.name}：${getReplayRoleLabel(player)}`;
    replayRoles.appendChild(li);
  });
  replayActions.innerHTML = "";
  const actions = state.replayEvents || [];
  if (!actions.length) {
    const li = document.createElement("li");
    li.textContent = "暂无夜晚行为记录。";
    replayActions.appendChild(li);
  } else {
    actions.forEach((entry) => {
      const li = document.createElement("li");
      li.textContent = `${entry.phase} · ${entry.text}`;
      replayActions.appendChild(li);
    });
  }
  if (replayPrivate) {
    replayPrivate.innerHTML = "";
    const privates = state.privateChat || [];
    if (!privates.length) {
      const li = document.createElement("li");
      li.textContent = "暂无私聊记录。";
      replayPrivate.appendChild(li);
    } else {
      privates.forEach((item) => {
        const li = document.createElement("li");
        li.textContent = `${item.phase} · ${item.sender} -> ${item.target}: ${item.text}`;
        replayPrivate.appendChild(li);
      });
    }
  }
  replayChat.innerHTML = "";
  state.chat.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = `${item.phase} · ${item.speaker}: ${item.text}`;
    replayChat.appendChild(li);
  });
  if (storySummaryBox) {
    storySummaryBox.textContent = state.storySummary ? state.storySummary : "暂无";
  }
  if (storySummaryBtn) {
    storySummaryBtn.disabled = !state.ended || state.storySummaryPending;
  }
  if (state.ended && !state.storySummary && !state.storySummaryPending) {
    generateStorySummary({ silent: true });
  }
}
