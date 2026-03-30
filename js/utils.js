/**
 * utils.js — Utility functions extracted from singleplayer_demo.html
 */

import { SCRIPT, EVIL_ROLE_NAMES } from './constants.js';
import { state } from './state.js';

export function shuffle(list) {
  const array = list.slice();
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, Math.max(0, ms || 0)));
}

export function extractJson(text) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    return null;
  }
  try {
    return JSON.parse(text.slice(start, end + 1));
  } catch (error) {
    return null;
  }
}

export function getRoleById(roleId) {
  return SCRIPT.roles.find((role) => role.id === roleId);
}

export function getApparentRole(player) {
  if (player.apparentRoleId) {
    return getRoleById(player.apparentRoleId);
  }
  return getRoleById(player.roleId);
}

export function getPromptName(player) {
  if (!player) return "未知";
  const base = (player.name || "").trim() || "玩家";
  return base === "你" ? "玩家" : base;
}

export function playerOptionLabel(p) {
  return p.name + (p.alive ? "" : "（已死亡）");
}

export function playerOptionHtml(p) {
  return `<option value="${p.id}">${playerOptionLabel(p)}</option>`;
}

export function stripHtmlForPrompt(text) {
  return String(text || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function getPromptSpeakerName(speaker) {
  if (!state) return speaker;
  const player = state.players.find((p) => p.name === speaker);
  if (player) return getPromptName(player);
  return speaker;
}

export function formatPromptChatLine(entry) {
  const speaker = getPromptSpeakerName(entry?.speaker || "系统");
  const content = stripHtmlForPrompt(entry?.text || "") || "（空）";
  return `${speaker}: ${content}`;
}

export function isEvilSelfReveal(player, text) {
  if (!player || (player.team !== "minion" && player.team !== "demon")) return false;
  if (!text) return false;
  return EVIL_ROLE_NAMES.some((name) => {
    const pattern = new RegExp(`(我是|我就是|我才是|我其实是)\\s*${name}`);
    return pattern.test(text);
  });
}

export function normalizeTargetName(name) {
  if (!name) return "";
  return String(name).replace(/\(真人\)/g, "").replace(/（已死亡）/g, "").trim();
}

export function resolveTargetByName(name, candidates, actor) {
  if (!name || !candidates.length) return null;
  const normalized = normalizeTargetName(name);
  if (normalized === "自己" || normalized === "我" || normalized === "我自己") {
    return actor && candidates.find((p) => p.id === actor.id) ? actor : null;
  }
  return candidates.find((p) => p.name === normalized) || null;
}
