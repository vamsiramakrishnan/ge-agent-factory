import { escapeHtml } from "../lib/dom.js";

export function createTimeline({ timelineEl, eventCountPill }) {
  let count = 0;

  function addStep(label, detail = "", kind = "") {
    count += 1;
    eventCountPill.textContent = String(count);
    const item = document.createElement("div");
    item.className = `step ${kind}`.trim();
    item.innerHTML = `<div><b>${escapeHtml(label)}</b>${detail ? `<code>${escapeHtml(detail)}</code>` : ""}</div>`;
    timelineEl.prepend(item);
  }

  function reset() {
    count = 0;
    eventCountPill.textContent = "0";
    timelineEl.innerHTML = "";
  }

  function getCount() {
    return count;
  }

  return { addStep, reset, getCount };
}
