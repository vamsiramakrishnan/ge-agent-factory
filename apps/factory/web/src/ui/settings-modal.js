export function createSettingsModal({ modal, closeButton }) {
  function open() {
    modal.hidden = false;
    closeButton.focus();
  }

  function close() {
    modal.hidden = true;
  }

  function bind(...triggers) {
    for (const trigger of triggers) trigger?.addEventListener("click", open);
    closeButton.addEventListener("click", close);
    modal.addEventListener("click", (event) => {
      if (event.target === modal) close();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && !modal.hidden) close();
    });
  }

  return { bind, close, open };
}
