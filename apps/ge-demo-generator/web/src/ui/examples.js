export function createExampleChips({ examplesEl, sideExamplesEl, message }, prompts) {
  function make(text, compact = false) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = compact ? "example-card" : "example-chip";
    btn.textContent = text;
    btn.addEventListener("click", () => {
      message.value = text;
      message.focus();
    });
    return btn;
  }

  function render() {
    examplesEl.innerHTML = "";
    sideExamplesEl.innerHTML = "";
    prompts.forEach((text) => examplesEl.appendChild(make(text)));
    prompts.slice(0, 3).forEach((text) => sideExamplesEl.appendChild(make(text, true)));
  }

  return { render };
}
