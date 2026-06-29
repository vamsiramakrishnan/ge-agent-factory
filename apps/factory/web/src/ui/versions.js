import { escapeHtml } from "../lib/dom.js";
import { fetchVersions, promoteVersionApi } from "../lib/api.js";

export function createVersionTimeline(state, elements) {
  // Read from elements dynamically (dashboard rebuilds these DOM nodes)

  function formatTime(ts) {
    if (!ts) return "unknown";
    const d = new Date(ts);
    return d.toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  }

  function diffSummary(prev, current) {
    if (!prev) return `${current.fileCount} files created`;
    const added = current.fileSnapshot.filter((f) => !prev.fileSnapshot.some((p) => p.path === f.path)).length;
    const removed = prev.fileSnapshot.filter((f) => !current.fileSnapshot.some((c) => c.path === f.path)).length;
    const changed = current.fileSnapshot.filter((f) => {
      const p = prev.fileSnapshot.find((pf) => pf.path === f.path);
      return p && p.size !== f.size;
    }).length;
    const parts = [];
    if (added) parts.push(`+${added} added`);
    if (removed) parts.push(`-${removed} removed`);
    if (changed) parts.push(`${changed} changed`);
    return parts.join(", ") || "no changes";
  }

  async function render() {
    const versionTimeline = elements.versionTimeline;
    const versionCountPill = elements.versionCountPill;
    const currentVersionPill = elements.currentVersionPill;
    if (!state.selectedProject || !versionTimeline) return;
    try {
      const { versions, currentVersion } = await fetchVersions(state.selectedProject);
      state.versions = versions;
      state.currentVersion = currentVersion;
      versionCountPill.textContent = String(versions.length);
      currentVersionPill.textContent = currentVersion ? `v${currentVersion}` : "none";
      versionTimeline.innerHTML = "";

      if (versions.length === 0) {
        versionTimeline.innerHTML = `<div class="version-empty">No versions yet. Run a brief to create the first version.</div>`;
        return;
      }

      for (let i = versions.length - 1; i >= 0; i--) {
        const v = versions[i];
        const prev = i > 0 ? versions[i - 1] : null;
        const isCurrent = v.version === currentVersion;
        const entry = document.createElement("div");
        entry.className = `version-entry ${isCurrent ? "current" : ""}`;
        entry.innerHTML = `
          <div class="version-entry-header">
            <strong>v${v.version}${isCurrent ? " · current" : ""}</strong>
            <span class="version-time">${escapeHtml(formatTime(v.createdAt))}</span>
          </div>
          <div class="version-entry-body">
            <span class="version-files">${v.fileCount} files</span>
            <span class="version-diff">${escapeHtml(diffSummary(prev, v))}</span>
          </div>
        `;
        if (!isCurrent) {
          const promoteBtn = document.createElement("button");
          promoteBtn.type = "button";
          promoteBtn.className = "btn btn-sm version-promote";
          promoteBtn.textContent = "Promote";
          promoteBtn.addEventListener("click", async () => {
            try {
              await promoteVersionApi(state.selectedProject, v.version);
              await render();
            } catch (e) {
              console.error("promote failed", e);
            }
          });
          entry.querySelector(".version-entry-header").appendChild(promoteBtn);
        }
        versionTimeline.appendChild(entry);
      }
    } catch {
      versionTimeline.innerHTML = `<div class="version-empty">Could not load versions.</div>`;
    }
  }

  return { render };
}
