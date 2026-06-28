import { escapeHtml } from "../lib/dom.js";
import { splitOnQuestionForms, renderQuestionForm, formatFormAnswers } from "./question-form.js";
import { renderEditDiff } from "./diff-viewer.js";

let msgCounter = 0;
function nextId() { return `msg-${Date.now()}-${++msgCounter}`; }

function toolFamily(name) {
  const n = String(name || "").toLowerCase();
  if (n.includes("edit") || n === "str_replace_edit") return "edit";
  if (n.includes("write") || n === "create_file") return "write";
  if (n.includes("read") || n === "read_file") return "read";
  if (n.includes("bash")) return "bash";
  if (n.includes("glob") || n === "list_files") return "glob";
  if (n.includes("grep")) return "grep";
  if (n.includes("fetch") || n === "web_fetch") return "fetch";
  if (n.includes("search") || n === "web_search") return "search";
  if (n.includes("todo")) return "todo";
  return "generic";
}

const FAMILY_ICON = { edit: "✎", write: "+", read: "↗", bash: "$", glob: "⊞", grep: "⌕", fetch: "↓", search: "⌕", todo: "☐" };
const FAMILY_CLS = { edit: "op-icon-edit", write: "op-icon-write", read: "op-icon-read", bash: "op-icon-bash" };
const FAMILY_VERB = { edit: "Editing", write: "Writing", read: "Reading", bash: "Running", glob: "Globbing", grep: "Searching", fetch: "Fetching", search: "Searching", todo: "Updating" };

function extractTarget(raw) {
  if (!raw || typeof raw !== "object") {
    const s = String(raw || "");
    return s.length > 44 ? "…" + s.slice(-42) : s;
  }
  for (const k of ["file_path", "path", "pattern", "url", "query", "command", "name"]) {
    if (raw[k]) {
      const v = String(raw[k]);
      return v.length > 44 ? "…" + v.slice(-42) : v;
    }
  }
  return "";
}

function timeNow() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function createTranscript({ transcriptEl }) {
  let curMsg = null;
  let curFlow = null;
  let curProse = null;
  let curProseData = null;
  let lastToolEl = null;
  let lastToolFamily = null;
  let curThinkingEl = null;
  let curThinkingBody = null;
  const messages = [];
  let messageCb = null;
  let suppressNotify = false;

  /* ── Message grouping state ──────────────────────────────── */
  let prevRole = null;
  let staggerIndex = 0;

  /* ── Jump-to-bottom button ───────────────────────────────── */
  let jumpBtn = null;
  let scrollEl = null;

  function ensureJumpBtn() {
    scrollEl = transcriptEl.closest(".chat-scroll");
    if (!scrollEl || jumpBtn) return;
    jumpBtn = document.createElement("button");
    jumpBtn.type = "button";
    jumpBtn.className = "jump-bottom";
    jumpBtn.textContent = "Latest";
    jumpBtn.addEventListener("click", () => {
      if (scrollEl) scrollEl.scrollTop = scrollEl.scrollHeight;
    });
    scrollEl.style.position = "relative";
    scrollEl.appendChild(jumpBtn);
    scrollEl.addEventListener("scroll", checkJumpVisibility, { passive: true });
  }

  function checkJumpVisibility() {
    if (!scrollEl || !jumpBtn) return;
    const gap = scrollEl.scrollHeight - scrollEl.scrollTop - scrollEl.clientHeight;
    const isStreaming = !!curMsg;
    if (gap > 200 && isStreaming) {
      jumpBtn.classList.add("visible");
    } else {
      jumpBtn.classList.remove("visible");
    }
  }

  function clear() {
    transcriptEl.innerHTML = "";
    curMsg = curFlow = curProse = curProseData = lastToolEl = null;
    lastToolFamily = null;
    curThinkingEl = curThinkingBody = null;
    prevRole = null;
    staggerIndex = 0;
    messages.length = 0;
    if (jumpBtn) jumpBtn.classList.remove("visible");
  }

  function ensureNoEmpty() {
    const empty = transcriptEl.querySelector(".empty-chat");
    if (empty) empty.remove();
  }

  function notify(msg) { if (!suppressNotify && messageCb) messageCb(msg); }

  function scroll() {
    const el = transcriptEl.closest(".chat-scroll");
    if (!el) return;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 120) {
      el.scrollTop = el.scrollHeight;
    }
  }

  /* ── Grouping helpers ────────────────────────────────────── */
  function applyGrouping(el, role) {
    if (prevRole === role) {
      // Mark previous sibling as group-start if it has no group class yet
      const prev = el.previousElementSibling;
      if (prev && prev.classList.contains("msg")) {
        if (!prev.classList.contains("group-start") && !prev.classList.contains("group-cont")) {
          prev.classList.add("group-start");
        } else if (prev.classList.contains("group-end")) {
          prev.classList.remove("group-end");
          prev.classList.add("group-cont");
        }
      }
      el.classList.add("group-end");
    }
    prevRole = role;
  }

  function applyStagger(el) {
    el.style.setProperty("--msg-delay", `${staggerIndex * 40}ms`);
    staggerIndex++;
    // Reset stagger index after a short window so delays don't stack forever
    clearTimeout(applyStagger._timer);
    applyStagger._timer = setTimeout(() => { staggerIndex = 0; }, 300);
  }

  function endAssistant() {
    if (!curMsg) return;
    curMsg.classList.remove("streaming");
    if (curProse) {
      curProse.classList.remove("streaming-cursor");
      const text = curProse.textContent || "";
      const segments = splitOnQuestionForms(text);
      if (segments.some((s) => s.type === "form")) {
        curProse.remove();
        for (const seg of segments) {
          if (seg.type === "text" && seg.content.trim()) {
            const p = document.createElement("div");
            p.className = "prose-block";
            p.textContent = seg.content;
            curFlow.appendChild(p);
          } else if (seg.type === "form") {
            const formEl = renderQuestionForm(seg.form, {
              interactive: true,
              onSubmit: (text) => {
                formEl.classList.add("question-form-locked");
                const input = document.getElementById("message");
                if (input) {
                  input.value = text;
                  const form = document.getElementById("chatForm");
                  if (form) form.requestSubmit();
                }
              },
            });
            curFlow.appendChild(formEl);
          }
        }
      }
    }
    if (curProseData && curProseData.content) notify(curProseData);
    finalizeThinking();
    curMsg = curFlow = curProse = curProseData = lastToolEl = null;
    lastToolFamily = null;
    if (jumpBtn) jumpBtn.classList.remove("visible");
  }

  function beginAssistant() {
    if (curMsg) return;
    ensureNoEmpty();
    ensureJumpBtn();
    curMsg = document.createElement("div");
    curMsg.className = "msg assistant streaming";
    curMsg.innerHTML = `<div class="role"><span>Agent</span><span class="msg-time">${timeNow()}</span></div><div class="assistant-flow"></div>`;
    curFlow = curMsg.querySelector(".assistant-flow");
    curProse = null;
    curProseData = null;
    lastToolEl = null;
    lastToolFamily = null;
    applyGrouping(curMsg, "assistant");
    applyStagger(curMsg);
    transcriptEl.appendChild(curMsg);
  }

  /* ── Thinking blocks ─────────────────────────────────────── */
  function finalizeThinking() {
    if (curThinkingEl) {
      curThinkingEl.classList.remove("streaming");
    }
    curThinkingEl = null;
    curThinkingBody = null;
  }

  function addThinking(text) {
    if (!text) return;
    beginAssistant();
    // Finalize any active prose block when thinking starts
    if (curProse) {
      curProse.classList.remove("streaming-cursor");
      if (curProseData && curProseData.content) notify(curProseData);
      curProse = null;
      curProseData = null;
    }
    if (!curThinkingEl) {
      const block = document.createElement("div");
      block.className = "thinking-block streaming";
      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "thinking-toggle";
      toggle.innerHTML = `<span class="thinking-icon">✦</span><span class="thinking-label">Thinking</span><span class="thinking-chev">▸</span>`;
      toggle.addEventListener("click", () => {
        block.classList.toggle("open");
      });
      curThinkingBody = document.createElement("div");
      curThinkingBody.className = "thinking-body";
      block.append(toggle, curThinkingBody);
      curFlow.appendChild(block);
      curThinkingEl = block;
      lastToolEl = null;
      lastToolFamily = null;
    }
    curThinkingBody.textContent += text;
    scroll();
  }

  /* ── Per-tool metadata ──────────────────────────────────── */
  function renderToolMeta(family, detail) {
    if (!detail || typeof detail !== "object") return null;
    const frag = document.createDocumentFragment();

    if (family === "edit") {
      if (detail.file_path) {
        const fp = document.createElement("span");
        fp.className = "op-file-meta";
        fp.textContent = detail.file_path;
        frag.appendChild(fp);
      }
      const edits = detail.replace_all ? "replace all" : "";
      if (detail.old_string && detail.new_string) {
        const badge = document.createElement("span");
        badge.className = "op-edit-count";
        badge.textContent = edits || "1 edit";
        frag.appendChild(badge);
        const diffEl = renderEditDiff(detail);
        if (diffEl) frag.appendChild(diffEl);
      }
    } else if (family === "write") {
      if (detail.file_path) {
        const fp = document.createElement("span");
        fp.className = "op-file-meta";
        fp.textContent = detail.file_path;
        frag.appendChild(fp);
      }
      if (detail.content) {
        const lines = String(detail.content).split("\n").length;
        const badge = document.createElement("span");
        badge.className = "op-line-count";
        badge.textContent = `${lines} line${lines !== 1 ? "s" : ""}`;
        frag.appendChild(badge);
      }
    } else if (family === "read") {
      if (detail.file_path) {
        const fp = document.createElement("span");
        fp.className = "op-file-meta";
        fp.textContent = detail.file_path;
        frag.appendChild(fp);
      }
      if (detail.offset != null || detail.limit != null) {
        const range = document.createElement("span");
        range.className = "op-line-range";
        const parts = [];
        if (detail.offset != null) parts.push(`offset ${detail.offset}`);
        if (detail.limit != null) parts.push(`limit ${detail.limit}`);
        range.textContent = parts.join(", ");
        frag.appendChild(range);
      }
    } else if (family === "bash") {
      if (detail.command) {
        const cmd = document.createElement("code");
        cmd.className = "op-command";
        const cmdText = String(detail.command);
        cmd.textContent = cmdText.length > 120 ? cmdText.slice(0, 117) + "..." : cmdText;
        frag.appendChild(cmd);
      }
      if (detail.exit_code != null || detail.exitCode != null) {
        const code = detail.exit_code ?? detail.exitCode;
        const badge = document.createElement("span");
        badge.className = `op-exit-code ${Number(code) === 0 ? "op-exit-ok" : "op-exit-fail"}`;
        badge.textContent = `exit ${code}`;
        frag.appendChild(badge);
      }
    } else if (family === "grep" || family === "search") {
      if (detail.pattern || detail.query) {
        const q = document.createElement("code");
        q.className = "op-command";
        q.textContent = detail.pattern || detail.query;
        frag.appendChild(q);
      }
      if (detail.result_count != null || detail.resultCount != null) {
        const count = detail.result_count ?? detail.resultCount;
        const badge = document.createElement("span");
        badge.className = "op-result-count";
        badge.textContent = `${count} result${Number(count) !== 1 ? "s" : ""}`;
        frag.appendChild(badge);
      }
    }

    return frag.childNodes.length > 0 ? frag : null;
  }

  function renderOpCard(name, family, summary, detail) {
    const icon = FAMILY_ICON[family] || "◇";
    const iconCls = FAMILY_CLS[family] || "";
    const target = summary || extractTarget(detail);
    const card = document.createElement("div");
    card.className = "op-card";
    const head = document.createElement("div");
    head.className = "op-card-head";
    head.innerHTML = `<span class="op-icon ${iconCls}">${icon}</span><span class="op-title">${escapeHtml(name)}</span>${target ? `<span class="op-path">${escapeHtml(target)}</span>` : ""}<span class="op-status op-status-ok">done</span>`;
    card.appendChild(head);

    // Per-tool metadata row
    const detailObj = typeof detail === "object" && detail !== null ? detail : null;
    const metaFrag = renderToolMeta(family, detailObj);
    if (metaFrag) {
      const metaRow = document.createElement("div");
      metaRow.className = "op-meta";
      metaRow.appendChild(metaFrag);
      card.appendChild(metaRow);
    }

    if (detail) {
      const body = document.createElement("div");
      body.className = "op-card-body";
      body.textContent = typeof detail === "string" ? detail : JSON.stringify(detail, null, 2);
      body.hidden = true;
      card.appendChild(body);
      head.style.cursor = "pointer";
      head.addEventListener("click", () => {
        body.hidden = !body.hidden;
        card.classList.toggle("open", !body.hidden);
      });
    }
    return card;
  }

  function wrapActionCard(family, cards) {
    const icon = FAMILY_ICON[family] || "◇";
    const iconCls = FAMILY_CLS[family] || "";
    const verb = FAMILY_VERB[family] || "Using";
    const targets = cards.map((c) => c.querySelector(".op-path")?.textContent).filter(Boolean);
    const ac = document.createElement("div");
    ac.className = "action-card";
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "action-card-toggle";
    toggle.innerHTML = `<span class="ico ${iconCls}">${icon}</span><span class="summary"><strong>${escapeHtml(verb)}</strong> ×${cards.length}</span><span class="action-card-targets">${targets.slice(0, 3).map((t) => `<span class="op-path">${escapeHtml(t)}</span>`).join("")}</span><span class="action-card-status-count ok">${cards.length}</span><span class="chev">▸</span>`;
    const body = document.createElement("div");
    body.className = "action-card-body";
    for (const c of cards) body.appendChild(c);
    toggle.addEventListener("click", () => {
      ac.classList.toggle("open");
    });
    ac.append(toggle, body);
    return ac;
  }

  function updateActionCardHeader(ac, family) {
    const cards = ac.querySelectorAll(".action-card-body > .op-card");
    const count = cards.length;
    const verb = FAMILY_VERB[family] || "Using";
    const targets = [...cards].map((c) => c.querySelector(".op-path")?.textContent).filter(Boolean);
    const summaryEl = ac.querySelector(".summary");
    if (summaryEl) summaryEl.innerHTML = `<strong>${escapeHtml(verb)}</strong> ×${count}`;
    const targetsEl = ac.querySelector(".action-card-targets");
    if (targetsEl) targetsEl.innerHTML = targets.slice(0, 3).map((t) => `<span class="op-path">${escapeHtml(t)}</span>`).join("");
    const countEl = ac.querySelector(".action-card-status-count");
    if (countEl) countEl.textContent = String(count);
  }

  function addUserMessage(text) {
    ensureNoEmpty();
    endAssistant();
    ensureJumpBtn();
    const div = document.createElement("div");
    div.className = "msg user";
    div.innerHTML = `<div class="role"><span>You</span><span class="msg-time">${timeNow()}</span></div><div class="user-text">${escapeHtml(text)}</div>`;
    applyGrouping(div, "user");
    applyStagger(div);
    transcriptEl.appendChild(div);
    scroll();
    const data = { id: nextId(), role: "user", content: text, createdAt: Date.now() };
    messages.push(data);
    notify(data);
  }

  function addErrorMessage(text) {
    ensureNoEmpty();
    const div = document.createElement("div");
    div.className = "msg error";
    div.innerHTML = `<div class="role"><span>Error</span></div><div class="error-text">${escapeHtml(text)}</div>`;
    applyGrouping(div, "error");
    applyStagger(div);
    transcriptEl.appendChild(div);
    scroll();
    const data = { id: nextId(), role: "error", content: text, createdAt: Date.now() };
    messages.push(data);
    notify(data);
  }

  function appendAgent(text) {
    if (!text) return;
    beginAssistant();
    finalizeThinking();
    if (!curProse) {
      curProse = document.createElement("div");
      curProse.className = "prose-block streaming-cursor";
      curFlow.appendChild(curProse);
      curProseData = { id: nextId(), role: "agent", content: "", createdAt: Date.now() };
      messages.push(curProseData);
      lastToolEl = null;
      lastToolFamily = null;
    }
    curProse.textContent += text;
    if (curProseData) curProseData.content += text;
    scroll();
  }

  function addToolCard(name, summary, detail) {
    beginAssistant();
    finalizeThinking();
    if (curProse) {
      curProse.classList.remove("streaming-cursor");
      if (curProseData && curProseData.content) notify(curProseData);
      curProse = null;
      curProseData = null;
    }
    const family = toolFamily(name);
    const opCard = renderOpCard(name, family, summary, detail);

    if (lastToolFamily === family && lastToolEl) {
      if (lastToolEl.classList.contains("action-card")) {
        lastToolEl.querySelector(".action-card-body").appendChild(opCard);
        updateActionCardHeader(lastToolEl, family);
      } else if (lastToolEl.parentNode === curFlow) {
        const anchor = document.createComment("tool-card-group");
        curFlow.replaceChild(anchor, lastToolEl);
        const ac = wrapActionCard(family, [lastToolEl, opCard]);
        curFlow.replaceChild(ac, anchor);
        lastToolEl = ac;
      } else {
        curFlow.appendChild(opCard);
        lastToolEl = opCard;
      }
    } else {
      curFlow.appendChild(opCard);
      lastToolEl = opCard;
      lastToolFamily = family;
    }
    scroll();
    const data = { id: nextId(), role: "tool", content: summary || "", toolName: name, toolDetail: typeof detail === "string" ? detail : JSON.stringify(detail), createdAt: Date.now() };
    messages.push(data);
    notify(data);
  }

  function addMessage(role, text) {
    if (role === "user") return addUserMessage(text);
    if (role === "error") return addErrorMessage(text);
    if (role === "agent") { appendAgent(text); return curProse; }
    if (role === "tool") { addToolCard("Tool", text, ""); return null; }
    return null;
  }

  function resetActive() { endAssistant(); }

  function showEmpty(title = "Start building", sub = "Choose an example or write your own prompt.", promptExamples = []) {
    clear();
    const orbitHtml = `<div class="empty-orbit"><div class="empty-orbit-ring"></div><div class="empty-orbit-ring"></div><div class="empty-orbit-center"></div><div class="empty-orbit-card"></div><div class="empty-orbit-card"></div><div class="empty-orbit-card"></div><div class="empty-orbit-card"></div></div>`;
    const exHtml = promptExamples.map((ex) =>
      `<button class="chat-example" type="button" data-prompt="${escapeHtml(ex)}"><span class="chat-example-text">${escapeHtml(ex.length > 90 ? ex.slice(0, 87) + "…" : ex)}</span><span class="chat-example-arrow">→</span></button>`
    ).join("");
    transcriptEl.innerHTML = `<div class="empty-chat"><div class="empty-chat-inner">${orbitHtml}<strong>${escapeHtml(title)}</strong><p>${escapeHtml(sub)}</p>${exHtml ? `<div class="chat-examples">${exHtml}</div>` : ""}</div></div>`;
    transcriptEl.querySelectorAll(".chat-example").forEach((btn) => {
      btn.addEventListener("click", () => {
        const input = document.getElementById("message");
        if (input) { input.value = btn.dataset.prompt; input.focus(); }
      });
    });
  }

  function loadMessages(saved) {
    clear();
    if (!saved || saved.length === 0) { showEmpty(); return; }
    suppressNotify = true;
    try {
      for (const msg of saved) {
        if (msg.role === "user") addUserMessage(msg.content || "");
        else if (msg.role === "error") addErrorMessage(msg.content || "");
        else if (msg.role === "tool" && msg.toolName) addToolCard(msg.toolName, msg.content || "", msg.toolDetail || "");
        else if (msg.role === "agent") { appendAgent(msg.content || ""); endAssistant(); }
      }
    } finally {
      suppressNotify = false;
    }
    messages.length = 0;
    for (const msg of saved) messages.push(msg);
  }

  function getMessages() { return [...messages]; }
  function onMessage(cb) { messageCb = cb; }

  return { clear, addMessage, appendAgent, addThinking, addToolCard, resetActive, showEmpty, loadMessages, getMessages, onMessage };
}
