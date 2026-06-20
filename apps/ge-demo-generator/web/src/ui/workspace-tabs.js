const VALID_TABS = ["builder", "run", "workspace", "method"];
const TAB_SELECTOR = ".workspace-tab-btn[data-workspace-tab]";

function normalizeTab(tab) {
  if (tab === "files") return "workspace";
  return VALID_TABS.includes(tab) ? tab : "builder";
}

export function createWorkspaceTabs({ initial = "builder" } = {}) {
  let current = normalizeTab(initial);

  function set(tab) {
    current = normalizeTab(tab);
    document.body.dataset.workspaceTab = current;
    document.querySelectorAll(TAB_SELECTOR).forEach((button) => {
      button.classList.toggle("active", button.dataset.workspaceTab === current);
      button.setAttribute("aria-selected", button.dataset.workspaceTab === current ? "true" : "false");
    });
  }

  function bind() {
    document.querySelectorAll(TAB_SELECTOR).forEach((button) => {
      button.addEventListener("click", (event) => {
        event.preventDefault();
        event.stopPropagation();
        set(button.dataset.workspaceTab);
      });
    });
  }

  set(current);
  return { bind, set, get current() { return current; } };
}
