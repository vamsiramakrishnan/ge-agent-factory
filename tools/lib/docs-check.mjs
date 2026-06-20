import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";

const DOC_EXTENSIONS = new Set([".md", ".markdown"]);
const IGNORED_DIRS = new Set([
  ".git",
  ".ge",
  ".harness",
  ".bundle",
  ".jekyll-cache",
  "node_modules",
  "vendor",
  "_site",
  "dist",
  "build",
  ".next",
  ".vite",
]);

function walkMarkdownFiles(root, relDir = "") {
  const dir = join(root, relDir);
  if (!existsSync(dir)) return [];
  const files = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (IGNORED_DIRS.has(entry.name)) continue;
    const relPath = relDir ? `${relDir}/${entry.name}` : entry.name;
    if (entry.isDirectory()) files.push(...walkMarkdownFiles(root, relPath));
    else if (entry.isFile() && DOC_EXTENSIONS.has(extname(entry.name))) files.push(relPath);
  }
  return files;
}

function stripFencedCode(content) {
  return content
    .replace(/```[\s\S]*?```/g, "")
    .replace(/`[^`\n]+`/g, "");
}

function localMarkdownLinks(content) {
  const links = [];
  const cleaned = stripFencedCode(content);
  const inline = /!?\[[^\]]*]\(([^)\s]+)(?:\s+"[^"]*")?\)/g;
  let match;
  while ((match = inline.exec(cleaned))) links.push(match[1]);
  return links
    .map((link) => link.trim().replace(/^<|>$/g, ""))
    .filter((link) => link && isLocalLink(link));
}

function isLocalLink(link) {
  if (link.startsWith("#")) return false;
  if (/^[a-z][a-z0-9+.-]*:/i.test(link)) return false;
  return true;
}

function splitLink(link) {
  const hashIndex = link.indexOf("#");
  const queryIndex = link.indexOf("?");
  const cut = [hashIndex, queryIndex].filter((idx) => idx >= 0).sort((a, b) => a - b)[0];
  return cut === undefined ? link : link.slice(0, cut);
}

function candidatePaths(root, sourceRelPath, link) {
  const clean = decodeURIComponent(splitLink(link));
  if (!clean) return [];
  const sourceDir = dirname(join(root, sourceRelPath));
  const base = clean.startsWith("/")
    ? join(root, clean.replace(/^\/+/, ""))
    : resolve(sourceDir, clean);
  const candidates = [base];
  if (!extname(base)) {
    candidates.push(`${base}.md`, join(base, "index.md"));
  }
  if (base.endsWith(".html")) {
    candidates.push(base.replace(/\.html$/, ".md"));
    candidates.push(join(base.replace(/\.html$/, ""), "index.md"));
  }
  return Array.from(new Set(candidates.map((item) => normalize(item))));
}

function linkExists(root, sourceRelPath, link) {
  for (const candidate of candidatePaths(root, sourceRelPath, link)) {
    if (!candidate.startsWith(root)) continue;
    if (!existsSync(candidate)) continue;
    const stat = statSync(candidate);
    if (stat.isFile()) return true;
    if (stat.isDirectory()) return true;
  }
  return false;
}

export function runDocsCheck({ root = process.cwd(), include = ["README.md", "docs"] } = {}) {
  const repoRoot = resolve(root);
  const files = [];
  for (const relPath of include) {
    const fullPath = join(repoRoot, relPath);
    if (!existsSync(fullPath)) continue;
    const stat = statSync(fullPath);
    if (stat.isDirectory()) files.push(...walkMarkdownFiles(repoRoot, relPath));
    else if (stat.isFile() && DOC_EXTENSIONS.has(extname(relPath))) files.push(relPath);
  }
  const findings = [];
  for (const relPath of Array.from(new Set(files)).sort()) {
    const content = readFileSync(join(repoRoot, relPath), "utf8");
    for (const link of localMarkdownLinks(content)) {
      if (!linkExists(repoRoot, relPath, link)) findings.push({ path: relPath, link });
    }
  }
  return {
    kind: "ge.docs_check",
    ok: findings.length === 0,
    checked: files.length,
    findings,
    summary: findings.length
      ? `${findings.length} broken local documentation link${findings.length === 1 ? "" : "s"}`
      : `${files.length} markdown file${files.length === 1 ? "" : "s"} checked`,
  };
}

export function formatDocsCheck(result) {
  if (result.ok) return `Docs check passed: ${result.summary}.`;
  const lines = [`Docs check failed: ${result.summary}.`, ""];
  for (const finding of result.findings) lines.push(`- ${finding.path}: ${finding.link}`);
  return lines.join("\n");
}
