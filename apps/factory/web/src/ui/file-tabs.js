import { escapeHtml, formatBytes, formatTime } from "../lib/dom.js";
import { fetchProjectFile } from "../lib/api.js";

const MAX_TABS = 8;

/**
 * Lightweight syntax highlighter for Python, JSON, YAML, TOML.
 * Returns HTML string with <span class="sh-*"> tokens.
 */
function highlightSyntax(code, ext) {
  const escaped = escapeHtml(code);
  if (ext === ".json") return highlightJson(escaped);
  if (ext === ".py") return highlightPython(escaped);
  if (ext === ".yaml" || ext === ".yml") return highlightYaml(escaped);
  if (ext === ".toml") return highlightToml(escaped);
  return escaped;
}

function highlightJson(src) {
  return src
    .replace(/(&quot;)((?:[^&]|&(?!quot;))*)(&quot;)\s*:/g, '<span class="sh-key">$1$2$3</span>:')
    .replace(/:\s*(&quot;)((?:[^&]|&(?!quot;))*)(&quot;)/g, ': <span class="sh-string">$1$2$3</span>')
    .replace(/:\s*(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\b/g, ': <span class="sh-number">$1</span>')
    .replace(/:\s*(true|false|null)\b/g, ': <span class="sh-keyword">$1</span>');
}

function highlightPython(src) {
  // Comments
  let result = src.replace(/(#.*)/g, '<span class="sh-comment">$1</span>');
  // Strings — triple-quoted first, then single/double
  result = result.replace(/(&#39;&#39;&#39;[\s\S]*?&#39;&#39;&#39;|&quot;&quot;&quot;[\s\S]*?&quot;&quot;&quot;)/g, '<span class="sh-string">$1</span>');
  result = result.replace(/(&quot;(?:[^&]|&(?!quot;))*&quot;|&#39;(?:[^&]|&(?!#39;))*&#39;)/g, (match) => {
    if (match.includes('class="sh-')) return match;
    return `<span class="sh-string">${match}</span>`;
  });
  // Keywords
  const kw = /\b(def|class|return|import|from|if|elif|else|for|while|try|except|finally|with|as|raise|yield|async|await|pass|break|continue|and|or|not|in|is|None|True|False|self|lambda)\b/g;
  result = result.replace(kw, (match) => `<span class="sh-keyword">${match}</span>`);
  // Decorators
  result = result.replace(/(@\w+)/g, '<span class="sh-decorator">$1</span>');
  // Numbers
  result = result.replace(/\b(\d+(?:\.\d+)?)\b/g, (match, num, offset, str) => {
    // Skip if inside an already-highlighted span
    const before = str.substring(Math.max(0, offset - 30), offset);
    if (before.includes('class="sh-')) return match;
    return `<span class="sh-number">${num}</span>`;
  });
  return result;
}

function highlightYaml(src) {
  return src
    .replace(/(#.*)/g, '<span class="sh-comment">$1</span>')
    .replace(/^(\s*[\w][\w.-]*)(:)/gm, '<span class="sh-key">$1</span>$2')
    .replace(/:\s*(&quot;(?:[^&]|&(?!quot;))*&quot;|&#39;(?:[^&]|&(?!#39;))*&#39;)/g, (m, str) => `: <span class="sh-string">${str}</span>`)
    .replace(/\b(true|false|null|yes|no)\b/gi, '<span class="sh-keyword">$1</span>')
    .replace(/:\s*(-?\d+(?:\.\d+)?)\b/g, ': <span class="sh-number">$1</span>');
}

function highlightToml(src) {
  return src
    .replace(/(#.*)/g, '<span class="sh-comment">$1</span>')
    .replace(/^(\[[\w.]+\])/gm, '<span class="sh-key">$1</span>')
    .replace(/^(\s*[\w-]+)\s*=/gm, '<span class="sh-key">$1</span> =')
    .replace(/=\s*(&quot;(?:[^&]|&(?!quot;))*&quot;|&#39;(?:[^&]|&(?!#39;))*&#39;)/g, (m, str) => `= <span class="sh-string">${str}</span>`)
    .replace(/\b(true|false)\b/g, '<span class="sh-keyword">$1</span>')
    .replace(/=\s*(-?\d+(?:\.\d+)?)\b/g, '= <span class="sh-number">$1</span>');
}

function extOf(path) {
  const dot = path.lastIndexOf(".");
  return dot >= 0 ? path.slice(dot).toLowerCase() : "";
}

function baseName(path) {
  const slash = path.lastIndexOf("/");
  return slash >= 0 ? path.slice(slash + 1) : path;
}

const SYNTAX_EXTS = new Set([".py", ".json", ".yaml", ".yml", ".toml"]);

function iconForExt(ext) {
  if (ext === ".py") return "py";
  if (ext === ".json") return "{}";
  if (ext === ".yaml" || ext === ".yml") return "ym";
  if (ext === ".toml") return "tl";
  if (ext === ".md") return "md";
  if (ext === ".txt") return "tx";
  return "f";
}

/**
 * Creates a file tab controller that manages open file tabs within the
 * workspace preview pane.
 *
 * @param {object} opts
 * @param {function} opts.getProjectId  - returns current project id
 * @param {object}   opts.elements      - elements ref (dynamic: dashboard rebuilds DOM)
 */
export function createFileTabs({ getProjectId, elements }) {
  // Dynamic element accessors — dashboard rebuilds these DOM nodes
  const getTabBar   = () => elements.fileTabBar;
  const getContent  = () => elements.filePreview;
  const getPill     = () => elements.filePreviewPill;
  /** @type {Map<string, { path: string, content: string, size: number, mtime: number, openedAt: number }>} */
  const tabs = new Map();
  let activeTab = null;

  function renderTabBar() {
    const tabBar = getTabBar(); if (!tabBar) return;
    tabBar.innerHTML = "";
    for (const [path, data] of tabs) {
      const ext = extOf(path);
      const tab = document.createElement("button");
      tab.type = "button";
      tab.className = `file-tab ${path === activeTab ? "active" : ""}`;
      tab.dataset.path = path;
      tab.innerHTML = `<span class="file-tab-icon">${iconForExt(ext)}</span><span class="file-tab-name">${escapeHtml(baseName(path))}</span><span class="file-tab-close" title="Close">&times;</span>`;
      tab.addEventListener("click", (e) => {
        if (e.target.closest(".file-tab-close")) {
          closeFile(path);
        } else {
          switchTab(path);
        }
      });
      tabBar.appendChild(tab);
    }
  }

  function renderContent(path) {
    const contentEl = getContent();
    const pillEl = getPill();
    const data = tabs.get(path);
    if (!data) {
      if (contentEl) contentEl.innerHTML = `<div class="file-tab-empty"><strong>No file open</strong><span>Click a file in the file list to preview it here.</span></div>`;
      if (pillEl) pillEl.textContent = "No file";
      return;
    }
    const ext = extOf(path);
    const hasSyntax = SYNTAX_EXTS.has(ext);
    const highlighted = hasSyntax
      ? highlightSyntax(data.content, ext)
      : escapeHtml(data.content);

    // Build line numbers
    const lineCount = data.content.split("\n").length;
    const lineNums = Array.from({ length: lineCount }, (_, i) => i + 1).join("\n");

    if (contentEl) contentEl.innerHTML = `
      <div class="file-preview-head">
        <strong>${escapeHtml(data.path)}</strong>
        <span>${formatBytes(data.size)} · ${formatTime(data.mtime)}</span>
      </div>
      <div class="file-preview-code">
        <div class="file-line-numbers" aria-hidden="true">${lineNums}</div>
        <pre class="file-code-block ${hasSyntax ? "sh" : ""}">${highlighted}</pre>
      </div>
    `;
    if (pillEl) pillEl.textContent = formatBytes(data.size);
  }

  function evictOldest() {
    if (tabs.size <= MAX_TABS) return;
    let oldestPath = null;
    let oldestTime = Infinity;
    for (const [path, data] of tabs) {
      if (path === activeTab) continue;
      if (data.openedAt < oldestTime) {
        oldestTime = data.openedAt;
        oldestPath = path;
      }
    }
    if (oldestPath) tabs.delete(oldestPath);
  }

  async function openFile(path) {
    const projectId = getProjectId();
    if (!projectId) return;

    // If already open, just switch
    if (tabs.has(path)) {
      switchTab(path);
      return;
    }

    // Scroll preview section into view (adaptive dashboard)
    const prevSection = document.querySelector('[data-dash-section="preview"]');
    if (prevSection) { prevSection.classList.remove("collapsed"); prevSection.scrollIntoView({ behavior: "smooth", block: "nearest" }); }

    // Show loading state
    activeTab = path;
    tabs.set(path, { path, content: "Loading...", size: 0, mtime: 0, openedAt: Date.now() });
    evictOldest();
    renderTabBar();
    { const p = getPill(); if (p) p.textContent = "loading"; }
    { const c = getContent(); if (c) c.innerHTML = `<div class="file-tab-loading"><strong>${escapeHtml(path)}</strong><span>Loading preview...</span></div>`; }

    try {
      const { file } = await fetchProjectFile(projectId, path);
      tabs.set(path, {
        path: file.path,
        content: file.content,
        size: file.size,
        mtime: file.mtime,
        openedAt: Date.now(),
      });
      renderTabBar();
      if (activeTab === path) renderContent(path);
    } catch (error) {
      tabs.set(path, {
        path,
        content: `Error: ${error.message || error}`,
        size: 0,
        mtime: 0,
        openedAt: Date.now(),
      });
      renderTabBar();
      if (activeTab === path) {
        { const p = getPill(); if (p) p.textContent = "error"; }
        { const c = getContent(); if (c) c.innerHTML = `<div class="file-tab-error"><strong>${escapeHtml(path)}</strong><span>${escapeHtml(error.message || error)}</span></div>`; }
      }
    }
  }

  function closeFile(path) {
    tabs.delete(path);
    if (activeTab === path) {
      // Switch to the last remaining tab, or show empty
      const remaining = [...tabs.keys()];
      activeTab = remaining.length > 0 ? remaining[remaining.length - 1] : null;
    }
    renderTabBar();
    if (activeTab) {
      renderContent(activeTab);
    } else {
      renderContent(null);
    }
  }

  function switchTab(path) {
    if (!tabs.has(path)) return;
    activeTab = path;
    renderTabBar();
    renderContent(path);
  }

  function reset() {
    tabs.clear();
    activeTab = null;
    renderTabBar();
    renderContent(null);
  }

  function getOpenPaths() {
    return [...tabs.keys()];
  }

  // Initial empty state
  renderContent(null);

  return { openFile, closeFile, switchTab, reset, getOpenPaths };
}
