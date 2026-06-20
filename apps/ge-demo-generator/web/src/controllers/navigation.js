/**
 * Navigation controller — screen routing.
 *
 * The workspace pane rail has been replaced by the adaptive dashboard,
 * so setWorkspacePane is now a lightweight no-op kept for backward compat.
 *
 * Factory receives (state, el, deps) and returns { setScreen, setWorkspacePane }.
 */
export function createNavigation(state, el, { versionTl, agentOverview, dashboard }) {
  function setScreen(name) {
    // Legacy compat: "chat" and "files" both resolve to workspace
    if (name === "chat" || name === "files") name = "workspace";
    state.viewMode = name === "home" ? "entry" : "project";
    document.body.dataset.screen = name;
    document.querySelectorAll("[data-nav]").forEach((link) => {
      link.classList.toggle("active", link.dataset.nav === name);
    });
    // When switching to workspace, render the dashboard
    if (name === "workspace" && dashboard) {
      dashboard.render();
    }
  }

  /**
   * Legacy compat — the rail no longer exists, but callers in projects.js
   * still call this to "navigate" to a section. We scroll to the relevant
   * dashboard section instead.
   */
  function setWorkspacePane(name) {
    // Ensure dashboard sections are visible by re-rendering
    if (dashboard) dashboard.render();
    // Scroll the target section into view inside the dashboard
    const sectionEl = document.querySelector(`[data-dash-section="${name}"]`);
    if (sectionEl) {
      sectionEl.classList.remove("collapsed");
      sectionEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  return { setScreen, setWorkspacePane };
}
