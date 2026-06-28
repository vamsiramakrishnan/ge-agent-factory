/**
 * Question Form system — inline interactive forms in the chat stream.
 *
 * The agent emits <question-form>...</question-form> blocks in its text.
 * The transcript renderer detects them and renders interactive UI.
 * User fills and submits → answers become a user message.
 *
 * Ported from pixelpitch's question-form architecture (pure logic layer).
 */
import { escapeHtml } from "../lib/dom.js";

// ── Parsing ──────────────────────────────────────────────────

const FORM_RE = /<question-form(?:\s[^>]*)?>[\s\S]*?<\/question-form>/gi;
const FORM_SPLIT_RE = /(<question-form(?:\s[^>]*)?>[\s\S]*?<\/question-form>)/gi;

export function splitOnQuestionForms(text) {
  if (!text || !FORM_RE.test(text)) return [{ type: "text", content: text }];
  FORM_RE.lastIndex = 0;
  const parts = text.split(FORM_SPLIT_RE).filter(Boolean);
  return parts.map((part) => {
    if (FORM_RE.test(part)) {
      FORM_RE.lastIndex = 0;
      const form = tryParseForm(part);
      return form ? { type: "form", form } : { type: "text", content: part };
    }
    return { type: "text", content: part };
  });
}

function tryParseForm(raw) {
  const bodyMatch = raw.match(/<question-form[^>]*>([\s\S]*)<\/question-form>/i);
  if (!bodyMatch) return null;
  let json = bodyMatch[1].trim();
  json = json.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try {
    const parsed = JSON.parse(json);
    const idMatch = raw.match(/id="([^"]+)"/);
    const titleMatch = raw.match(/title="([^"]+)"/);
    return {
      id: parsed.id || idMatch?.[1] || `form-${Date.now()}`,
      title: parsed.title || titleMatch?.[1] || "Questions",
      description: parsed.description || null,
      questions: parsed.questions || [],
      submitLabel: parsed.submitLabel || "Submit",
    };
  } catch {
    return null;
  }
}

// ── Answer formatting ────────────────────────────────────────

export function formatFormAnswers(form, answers) {
  const lines = [`[form answers — ${form.id}]`];
  for (const q of form.questions) {
    const val = answers[q.id];
    if (Array.isArray(val)) {
      lines.push(`- ${q.label}: ${val.length ? val.join(", ") : "(skipped)"}`);
    } else {
      lines.push(`- ${q.label}: ${val || "(skipped)"}`);
    }
  }
  return lines.join("\n");
}

export function parseSubmittedAnswers(form, userText) {
  if (!userText || !form) return null;
  const lines = userText.trim().split("\n");
  if (!lines[0]?.match(/^\[form answers/i)) return null;
  const answers = {};
  const labelMap = {};
  for (const q of form.questions) {
    labelMap[q.label.toLowerCase()] = q.id;
  }
  for (const line of lines.slice(1)) {
    const m = line.match(/^-\s*(.+?):\s*(.*)/);
    if (!m) continue;
    const qId = labelMap[m[1].toLowerCase().trim()];
    if (!qId) continue;
    const q = form.questions.find((qq) => qq.id === qId);
    const raw = m[2].trim();
    if (raw === "(skipped)") { answers[qId] = q?.type === "checkbox" ? [] : ""; continue; }
    if (q?.type === "checkbox") { answers[qId] = raw.split(",").map((s) => s.trim()); }
    else { answers[qId] = raw; }
  }
  return Object.keys(answers).length > 0 ? answers : null;
}

// ── State helpers ────────────────────────────────────────────

function buildInitialState(form, submitted) {
  const state = {};
  for (const q of form.questions) {
    if (submitted && submitted[q.id] !== undefined) {
      state[q.id] = submitted[q.id];
    } else if (q.defaultValue !== undefined) {
      state[q.id] = q.defaultValue;
    } else if (q.type === "checkbox") {
      state[q.id] = [];
    } else {
      state[q.id] = "";
    }
  }
  return state;
}

function missingRequired(form, answers) {
  for (const q of form.questions) {
    if (!q.required) continue;
    const val = answers[q.id];
    if (Array.isArray(val) ? val.length === 0 : !val) return q.label;
  }
  return null;
}

// ── Vanilla JS Renderer ─────────────────────────────────────

export function renderQuestionForm(form, { interactive = true, submittedAnswers = null, onSubmit = null } = {}) {
  const locked = !interactive || !onSubmit || submittedAnswers !== null;
  const answers = buildInitialState(form, submittedAnswers);

  const el = document.createElement("div");
  el.className = `question-form ${locked ? "question-form-locked" : ""}`;

  function update(id, value) {
    if (locked) return;
    answers[id] = value;
    render();
  }

  function toggleCheckbox(id, option, max) {
    if (locked) return;
    const arr = Array.isArray(answers[id]) ? [...answers[id]] : [];
    const idx = arr.indexOf(option);
    if (idx >= 0) arr.splice(idx, 1);
    else if (!max || arr.length < max) arr.push(option);
    else return;
    answers[id] = arr;
    render();
  }

  function handleSubmit() {
    if (locked || !onSubmit) return;
    const missing = missingRequired(form, answers);
    if (missing) return;
    onSubmit(formatFormAnswers(form, answers), answers);
  }

  function render() {
    el.innerHTML = "";

    // Head
    const head = document.createElement("div");
    head.className = "question-form-head";
    head.innerHTML = `
      <span class="qf-icon">?</span>
      <div class="qf-head-text">
        <strong>${escapeHtml(form.title)}</strong>
        ${form.description ? `<span>${escapeHtml(form.description)}</span>` : ""}
      </div>
      ${locked ? `<span class="pill qf-locked-pill">Answered</span>` : ""}
    `;
    el.appendChild(head);

    // Body
    const body = document.createElement("div");
    body.className = "question-form-body";

    for (const q of form.questions) {
      const field = document.createElement("div");
      field.className = "qf-field";

      const label = document.createElement("label");
      label.className = "qf-label";
      label.textContent = q.label + (q.required ? " *" : "");
      field.appendChild(label);

      if (q.help) {
        const help = document.createElement("span");
        help.className = "qf-help";
        help.textContent = q.help;
        field.appendChild(help);
      }

      const type = q.type || "text";

      if (type === "radio" && q.options) {
        const wrap = document.createElement("div");
        wrap.className = "qf-chips";
        for (const opt of q.options) {
          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = `qf-chip ${answers[q.id] === opt ? "qf-chip-on" : ""}`;
          chip.textContent = opt;
          chip.disabled = locked;
          chip.addEventListener("click", () => update(q.id, opt));
          wrap.appendChild(chip);
        }
        field.appendChild(wrap);
      } else if (type === "checkbox" && q.options) {
        const wrap = document.createElement("div");
        wrap.className = "qf-chips";
        const selected = Array.isArray(answers[q.id]) ? answers[q.id] : [];
        const atMax = q.maxSelections && selected.length >= q.maxSelections;
        for (const opt of q.options) {
          const isOn = selected.includes(opt);
          const chip = document.createElement("button");
          chip.type = "button";
          chip.className = `qf-chip ${isOn ? "qf-chip-on" : ""} ${atMax && !isOn ? "qf-chip-disabled" : ""}`;
          chip.textContent = opt;
          chip.disabled = locked || (atMax && !isOn);
          chip.addEventListener("click", () => toggleCheckbox(q.id, opt, q.maxSelections));
          wrap.appendChild(chip);
        }
        field.appendChild(wrap);
      } else if (type === "select" && q.options) {
        const select = document.createElement("select");
        select.className = "qf-select";
        select.disabled = locked;
        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = q.placeholder || "Select...";
        placeholder.disabled = true;
        placeholder.selected = !answers[q.id];
        select.appendChild(placeholder);
        for (const opt of q.options) {
          const option = document.createElement("option");
          option.value = opt;
          option.textContent = opt;
          option.selected = answers[q.id] === opt;
          select.appendChild(option);
        }
        select.addEventListener("change", () => update(q.id, select.value));
        field.appendChild(select);
      } else if (type === "textarea") {
        const ta = document.createElement("textarea");
        ta.className = "qf-textarea";
        ta.rows = 3;
        ta.placeholder = q.placeholder || "";
        ta.value = answers[q.id] || "";
        ta.disabled = locked;
        ta.addEventListener("input", () => update(q.id, ta.value));
        field.appendChild(ta);
      } else {
        const input = document.createElement("input");
        input.type = "text";
        input.className = "qf-input";
        input.placeholder = q.placeholder || "";
        input.value = answers[q.id] || "";
        input.disabled = locked;
        input.addEventListener("input", () => update(q.id, input.value));
        field.appendChild(input);
      }

      body.appendChild(field);
    }

    el.appendChild(body);

    // Footer
    if (!locked) {
      const foot = document.createElement("div");
      foot.className = "question-form-foot";
      const hint = document.createElement("span");
      hint.className = "qf-hint";
      hint.textContent = "Fill in the fields above";
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn primary";
      btn.textContent = form.submitLabel || "Submit";
      btn.disabled = !!missingRequired(form, answers);
      btn.addEventListener("click", handleSubmit);
      foot.append(hint, btn);
      el.appendChild(foot);
    }
  }

  render();
  return el;
}
