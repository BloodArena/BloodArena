/**
 * voice.js — Speech recognition / voice input functions
 * Extracted from singleplayer_demo.html
 */

// --- State imports ---
import {
  speechRecognition, setSpeechRecognition,
  speechActive, setSpeechActive,
  speechSupported, setSpeechSupported,
  speechInterim, setSpeechInterim
} from "./state.js";
import { showModal as _showModal } from "./overlays.js";

// --- DOM element imports ---
// These DOM refs are grabbed at module load time.
// If ui-helpers.js is created later, switch to importing from there.
const voiceStatus = document.getElementById("voiceStatus");
const voiceBtn = document.getElementById("voiceBtn");
const humanInput = document.getElementById("humanInput");

/* ===== BGM bridge helpers ===== */

export function pauseBgmForVoiceInput() {
  if (typeof window.pauseBgmForVoice === "function") {
    window.pauseBgmForVoice();
  }
}

export function resumeBgmAfterVoiceInput() {
  if (typeof window.resumeBgmAfterVoice === "function") {
    window.resumeBgmAfterVoice();
  }
}

/* ===== Voice UI ===== */

export function updateVoiceUi(message = "", isError = false) {
  if (voiceStatus) {
    voiceStatus.textContent = message || "";
    voiceStatus.classList.toggle("error", Boolean(isError));
  }
  if (voiceBtn) {
    voiceBtn.classList.toggle("active", speechActive);
    voiceBtn.textContent = speechActive ? "停止语音" : "语音输入";
  }
}

export function stopVoiceRecognition(message = "") {
  if (speechRecognition && speechActive) {
    try {
      speechRecognition.stop();
    } catch (error) {
      // ignore
    }
  }
  setSpeechActive(false);
  resumeBgmAfterVoiceInput();
  updateVoiceUi(message, false);
}

export function initSpeechRecognition() {
  if (speechRecognition) return;
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    setSpeechSupported(false);
    if (voiceBtn) {
      voiceBtn.disabled = true;
      voiceBtn.textContent = "语音不可用";
    }
    updateVoiceUi("浏览器不支持语音识别。", true);
    return;
  }
  setSpeechSupported(true);
  const rec = new SpeechRecognition();
  setSpeechRecognition(rec);
  rec.lang = "zh-CN";
  rec.interimResults = true;
  rec.continuous = false;
  rec.onstart = () => {
    setSpeechActive(true);
    setSpeechInterim("");
    pauseBgmForVoiceInput();
    updateVoiceUi("正在听你说话…");
  };
  rec.onresult = (event) => {
    let finalText = "";
    let interimText = "";
    for (let i = event.resultIndex; i < event.results.length; i += 1) {
      const res = event.results[i];
      if (res.isFinal) {
        finalText += res[0]?.transcript || "";
      } else {
        interimText += res[0]?.transcript || "";
      }
    }
    setSpeechInterim(interimText.trim());
    if (speechInterim) {
      updateVoiceUi(`识别中：${speechInterim}`);
    }
    const trimmed = finalText.trim();
    if (trimmed && humanInput) {
      humanInput.value = humanInput.value
        ? `${humanInput.value} ${trimmed}`
        : trimmed;
      updateVoiceUi("已转写到输入框。");
    }
  };
  rec.onerror = (event) => {
    setSpeechActive(false);
    resumeBgmAfterVoiceInput();
    updateVoiceUi(`语音识别失败：${event.error || "未知错误"}`, true);
  };
  rec.onend = () => {
    setSpeechActive(false);
    resumeBgmAfterVoiceInput();
    if (!voiceStatus?.classList.contains("error")) {
      updateVoiceUi("");
    } else {
      updateVoiceUi(voiceStatus.textContent, true);
    }
  };
}

export function toggleVoiceInput() {
  if (!canUseVoiceInput()) {
    showModal("当前阶段暂不支持语音输入。");
    return;
  }
  initSpeechRecognition();
  if (!speechSupported || !speechRecognition) return;
  if (speechActive) {
    stopVoiceRecognition("已停止语音输入。");
    return;
  }
  updateVoiceUi("启动语音识别…");
  try {
    speechRecognition.start();
  } catch (error) {
    updateVoiceUi("语音识别启动失败。", true);
  }
}

export async function captureSpeechForStatement(title = "") {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return "";
  return await new Promise((resolve) => {
    let done = false;
    let finalText = "";
    const recognition = new SpeechRecognition();
    recognition.lang = "zh-CN";
    recognition.interimResults = true;
    recognition.continuous = false;
    const finish = (text = "") => {
      if (done) return;
      done = true;
      try {
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.onend = null;
        recognition.abort();
      } catch (error) {
        // ignore
      }
      resumeBgmAfterVoiceInput();
      resolve(String(text || "").trim());
    };
    recognition.onstart = () => {
      pauseBgmForVoiceInput();
      updateVoiceUi(title ? `${title}（语音识别中）` : "语音识别中…");
    };
    recognition.onresult = (event) => {
      let interimText = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const res = event.results[i];
        if (res.isFinal) {
          finalText += res[0]?.transcript || "";
        } else {
          interimText += res[0]?.transcript || "";
        }
      }
      const interim = interimText.trim();
      if (interim) {
        updateVoiceUi(`识别中：${interim}`);
      }
    };
    recognition.onerror = () => {
      finish(finalText);
    };
    recognition.onend = () => {
      finish(finalText);
    };
    try {
      recognition.start();
    } catch (error) {
      resumeBgmAfterVoiceInput();
      resolve("");
    }
  });
}

/*
 * NOTE: toggleVoiceInput() references canUseVoiceInput() and showModal()
 * which live in the main HTML script scope. They are expected to be available
 * as globals (window.canUseVoiceInput / window.showModal) or passed in at
 * wiring time. For now we reference them from the window scope.
 */
function canUseVoiceInput() {
  return typeof window.canUseVoiceInput === "function"
    ? window.canUseVoiceInput()
    : true;
}

function showModal(msg) {
  _showModal(msg);
}
