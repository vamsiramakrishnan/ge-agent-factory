import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative, resolve, sep } from "node:path";
import { globSync } from "tinyglobby";

const EXTERNAL_SCHEMES = /^(?:https?:|mailto:|tel:|javascript:|data:|blob:)/i;

function decodeHtml(value) {
  return String(value)
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(Number.parseInt(n, 16)))
    .replace(/&quot;/g, '"')
    .replace(/&apos;|&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeBase(base) {
  const clean = `/${String(base || "").replace(/^\/+|\/+$/g, "")}`;
  return clean === "/" ? "" : clean;
}

function lineLocator(text) {
  const starts = [0];
  for (let i = 0; i < text.length; i += 1) if (text.charCodeAt(i) === 10) starts.push(i + 1);
  return (offset) => {
    let low = 0;
    let high = starts.length;
    while (low + 1 < high) {
      const mid = (low + high) >> 1;
      if (starts[mid] <= offset) low = mid;
      else high = mid;
    }
    return low + 1;
  };
}

// Extract only real tag attributes. Script/style contents are removed first
// so strings such as `href="…"` in client JavaScript are not mistaken for
// rendered links.
function tagAttributes(html) {
  const withoutCode = html.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, (match) => match.replace(/[^\n]/g, " "));
  const lineAt = lineLocator(withoutCode);
  const attributes = [];
  const tagRe = /<[^!][^>]*>/g;
  let tag;
  while ((tag = tagRe.exec(withoutCode))) {
    const attrRe = /\b(href|src)\s*=\s*(["'])([\s\S]*?)\2/gi;
    let attr;
    while ((attr = attrRe.exec(tag[0]))) {
      attributes.push({
        attribute: attr[1].toLowerCase(),
        value: decodeHtml(attr[3]),
        line: lineAt(tag.index + attr.index),
      });
    }
  }
  return attributes;
}

function pageIds(html) {
  const ids = new Map();
  const lineAt = lineLocator(html);
  const tagRe = /<[^!][^>]*>/g;
  let tag;
  while ((tag = tagRe.exec(html))) {
    const attr = /\bid\s*=\s*(["'])([\s\S]*?)\1/i.exec(tag[0]);
    if (!attr) continue;
    const id = decodeHtml(attr[2]);
    const lines = ids.get(id) ?? [];
    lines.push(lineAt(tag.index + attr.index));
    ids.set(id, lines);
  }
  return ids;
}

function routeForHtml(relPath, base) {
  const slash = relPath.split(sep).join("/");
  if (slash === "index.html") return `${base}/` || "/";
  if (slash.endsWith("/index.html")) return `${base}/${slash.slice(0, -"index.html".length)}`;
  return `${base}/${slash}`;
}

function targetFile(dist, pathname, base) {
  if (base && pathname !== base && !pathname.startsWith(`${base}/`)) return { outsideBase: true };
  const rel = safeDecode(pathname.slice(base.length)).replace(/^\/+/, "");
  const raw = resolve(dist, rel || ".");
  const root = resolve(dist);
  if (raw !== root && !raw.startsWith(`${root}${sep}`)) return {};
  const candidates = [raw];
  if (!extname(raw)) candidates.push(`${raw}.html`);
  candidates.push(join(raw, "index.html"));
  for (const candidate of candidates) {
    if (existsSync(candidate) && statSync(candidate).isFile()) return { file: candidate };
  }
  return {};
}

function localReference(value) {
  const trimmed = String(value).trim();
  if (!trimmed || trimmed.startsWith("//") || EXTERNAL_SCHEMES.test(trimmed)) return null;
  return trimmed;
}

export function auditDist({ dist, base = "/ge-agent-factory" }) {
  const root = resolve(dist);
  if (!existsSync(root) || !statSync(root).isDirectory()) {
    throw new Error(`docs output directory does not exist: ${root} (run the site build first)`);
  }
  const normalizedBase = normalizeBase(base);
  const htmlFiles = globSync("**/*.html", { cwd: root }).sort();
  const pages = new Map();
  for (const relPath of htmlFiles) {
    const file = join(root, relPath);
    const html = readFileSync(file, "utf8");
    pages.set(file, { relPath, html, ids: pageIds(html), attributes: tagAttributes(html) });
  }

  const issues = [];
  let references = 0;
  for (const [file, page] of pages) {
    for (const [id, lines] of page.ids) {
      if (lines.length > 1) issues.push({ kind: "duplicate-id", path: page.relPath, id, lines });
    }

    const route = routeForHtml(page.relPath, normalizedBase);
    for (const ref of page.attributes) {
      const value = localReference(ref.value);
      if (!value) continue;
      references += 1;
      let url;
      try {
        url = new URL(value, `https://docs.invalid${route}`);
      } catch {
        issues.push({ kind: "invalid-url", path: page.relPath, line: ref.line, attribute: ref.attribute, value });
        continue;
      }
      if (url.origin !== "https://docs.invalid") continue;
      const target = targetFile(root, url.pathname, normalizedBase);
      if (target.outsideBase) {
        issues.push({ kind: "outside-base", path: page.relPath, line: ref.line, attribute: ref.attribute, value });
        continue;
      }
      if (!target.file) {
        issues.push({ kind: "missing-target", path: page.relPath, line: ref.line, attribute: ref.attribute, value });
        continue;
      }
      const fragment = safeDecode(url.hash.slice(1));
      if (!fragment || extname(target.file).toLowerCase() !== ".html") continue;
      const targetPage = pages.get(target.file);
      if (!targetPage?.ids.has(fragment)) {
        issues.push({
          kind: "missing-fragment",
          path: page.relPath,
          line: ref.line,
          attribute: ref.attribute,
          value,
          target: relative(root, target.file).split(sep).join("/"),
          fragment,
        });
      }
    }
  }

  return {
    kind: "ge.docs_site_audit",
    ok: issues.length === 0,
    dist: root,
    base: normalizedBase || "/",
    pages: htmlFiles.length,
    references,
    issues,
  };
}

export function formatDistAudit(result, { limit = 100 } = {}) {
  if (result.ok) {
    return `Docs-site audit passed: ${result.pages} HTML pages and ${result.references} local href/src references checked; fragments resolve and IDs are unique.`;
  }
  const lines = [`Docs-site audit failed: ${result.issues.length} issue${result.issues.length === 1 ? "" : "s"} across ${result.pages} HTML pages.`];
  for (const issue of result.issues.slice(0, limit)) {
    const where = `${issue.path}${issue.line ? `:${issue.line}` : ""}`;
    if (issue.kind === "duplicate-id") lines.push(`- ${where}: duplicate id "${issue.id}" on lines ${issue.lines.join(", ")}`);
    else if (issue.kind === "missing-fragment") lines.push(`- ${where}: ${issue.attribute}="${issue.value}" points to missing #${issue.fragment} in ${issue.target}`);
    else if (issue.kind === "outside-base") lines.push(`- ${where}: ${issue.attribute}="${issue.value}" escapes the configured site base`);
    else lines.push(`- ${where}: ${issue.kind} ${issue.attribute}="${issue.value}"`);
  }
  if (result.issues.length > limit) lines.push(`- … ${result.issues.length - limit} more (run with --json for the complete result)`);
  return lines.join("\n");
}
