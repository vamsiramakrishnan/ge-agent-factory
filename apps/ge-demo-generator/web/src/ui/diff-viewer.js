/**
 * Diff viewer — renders inline diffs in the chat transcript and file preview.
 *
 * Supports two modes:
 * 1. Inline diff from tool card detail (edit operations with old/new strings)
 * 2. Side-by-side file diff (for version comparisons)
 */
import { escapeHtml } from "../lib/dom.js";

export function renderInlineDiff(oldText, newText) {
  const el = document.createElement("div");
  el.className = "diff-view";

  const oldLines = (oldText || "").split("\n");
  const newLines = (newText || "").split("\n");
  const hunks = computeHunks(oldLines, newLines);

  for (const hunk of hunks) {
    const hunkEl = document.createElement("div");
    hunkEl.className = "diff-hunk";

    if (hunk.header) {
      const headerEl = document.createElement("div");
      headerEl.className = "diff-hunk-header";
      headerEl.textContent = hunk.header;
      hunkEl.appendChild(headerEl);
    }

    for (const line of hunk.lines) {
      const lineEl = document.createElement("div");
      lineEl.className = `diff-line diff-${line.type}`;
      const gutter = document.createElement("span");
      gutter.className = "diff-gutter";
      gutter.textContent = line.type === "add" ? "+" : line.type === "del" ? "-" : " ";
      const content = document.createElement("span");
      content.className = "diff-content";
      content.textContent = line.text;
      lineEl.append(gutter, content);
      hunkEl.appendChild(lineEl);
    }

    el.appendChild(hunkEl);
  }

  if (hunks.length === 0) {
    el.innerHTML = `<div class="diff-empty">No changes</div>`;
  }

  return el;
}

export function renderEditDiff(detail) {
  if (!detail || typeof detail !== "object") return null;

  let oldStr = detail.old_string || detail.old_str || "";
  let newStr = detail.new_string || detail.new_str || "";

  if (!oldStr && !newStr && detail.input) {
    const input = typeof detail.input === "string" ? tryParse(detail.input) : detail.input;
    oldStr = input?.old_string || input?.old_str || "";
    newStr = input?.new_string || input?.new_str || "";
  }

  if (!oldStr && !newStr) return null;

  const el = document.createElement("div");
  el.className = "diff-edit-preview";

  if (oldStr) {
    const delBlock = document.createElement("div");
    delBlock.className = "diff-block diff-block-del";
    delBlock.innerHTML = `<span class="diff-block-label">Removed</span><pre>${escapeHtml(truncate(oldStr, 500))}</pre>`;
    el.appendChild(delBlock);
  }

  if (newStr) {
    const addBlock = document.createElement("div");
    addBlock.className = "diff-block diff-block-add";
    addBlock.innerHTML = `<span class="diff-block-label">Added</span><pre>${escapeHtml(truncate(newStr, 500))}</pre>`;
    el.appendChild(addBlock);
  }

  return el;
}

export function renderFileDiff(oldContent, newContent, fileName) {
  const container = document.createElement("div");
  container.className = "diff-file-view";

  const header = document.createElement("div");
  header.className = "diff-file-header";
  header.innerHTML = `<strong>${escapeHtml(fileName || "File diff")}</strong>`;
  container.appendChild(header);

  const oldLines = (oldContent || "").split("\n");
  const newLines = (newContent || "").split("\n");
  const hunks = computeHunks(oldLines, newLines);

  const stats = { added: 0, removed: 0 };
  for (const hunk of hunks) {
    for (const line of hunk.lines) {
      if (line.type === "add") stats.added++;
      if (line.type === "del") stats.removed++;
    }
  }

  const statsEl = document.createElement("div");
  statsEl.className = "diff-stats";
  statsEl.innerHTML = `<span class="diff-stat-add">+${stats.added}</span> <span class="diff-stat-del">-${stats.removed}</span>`;
  header.appendChild(statsEl);

  const diff = renderInlineDiff(oldContent, newContent);
  container.appendChild(diff);
  return container;
}

function computeHunks(oldLines, newLines) {
  const hunks = [];
  const maxLen = Math.max(oldLines.length, newLines.length);
  let currentHunk = null;
  let contextBefore = [];

  for (let i = 0; i < maxLen; i++) {
    const oldLine = i < oldLines.length ? oldLines[i] : undefined;
    const newLine = i < newLines.length ? newLines[i] : undefined;

    if (oldLine === newLine) {
      if (currentHunk) {
        currentHunk.lines.push({ type: "ctx", text: oldLine || "" });
        if (currentHunk.lines.filter((l) => l.type === "ctx").length > 3) {
          hunks.push(currentHunk);
          currentHunk = null;
          contextBefore = [];
        }
      } else {
        contextBefore.push({ type: "ctx", text: oldLine || "" });
        if (contextBefore.length > 3) contextBefore.shift();
      }
    } else {
      if (!currentHunk) {
        currentHunk = { header: `@@ line ${i + 1} @@`, lines: [...contextBefore] };
        contextBefore = [];
      }
      if (oldLine !== undefined && (newLine === undefined || oldLine !== newLine)) {
        currentHunk.lines.push({ type: "del", text: oldLine });
      }
      if (newLine !== undefined && (oldLine === undefined || oldLine !== newLine)) {
        currentHunk.lines.push({ type: "add", text: newLine });
      }
    }
  }

  if (currentHunk) hunks.push(currentHunk);
  return hunks;
}

function truncate(str, max) {
  if (str.length <= max) return str;
  return str.slice(0, max) + `\n... (${str.length - max} more chars)`;
}

function tryParse(str) {
  try { return JSON.parse(str); } catch { return null; }
}
