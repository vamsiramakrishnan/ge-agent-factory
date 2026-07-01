import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { globSync } from "tinyglobby";
import { parse as parseYaml } from "yaml";

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
  const base = relDir ? join(root, relDir) : root;
  if (!existsSync(base)) return [];
  const patterns = [...DOC_EXTENSIONS].map((ext) => `**/*${ext}`);
  const ignore = [...IGNORED_DIRS].map((dir) => `**/${dir}/**`);
  return globSync(patterns, { cwd: base, ignore, dot: true })
    .map((rel) => (relDir ? `${relDir}/${rel}` : rel));
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

function imageSources(content) {
  const images = [];
  const cleaned = stripFencedCode(content);
  const lines = cleaned.split("\n");
  const imgTag = /<img\b[^>]*\bsrc\s*=\s*(?:"([^"]*)"|'([^']*)')[^>]*>/gi;
  lines.forEach((line, index) => {
    let match;
    imgTag.lastIndex = 0;
    while ((match = imgTag.exec(line))) {
      const src = match[1] ?? match[2] ?? "";
      if (src) images.push({ src, line: index + 1 });
    }
  });
  return images;
}

function isLocalImageSrc(src) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(src)) return false;
  if (src.startsWith("//")) return false;
  if (src.startsWith("#")) return false;
  return true;
}

function imageExists(root, sourceRelPath, src) {
  const clean = decodeURIComponent(splitLink(src.trim()));
  if (!clean) return false;
  const sourceDir = dirname(join(root, sourceRelPath));
  const target = clean.startsWith("/")
    ? join(root, clean.replace(/^\/+/, ""))
    : resolve(sourceDir, clean);
  const normalized = normalize(target);
  if (!normalized.startsWith(root)) return false;
  return existsSync(normalized) && statSync(normalized).isFile();
}

function findImageIssues(root, relPath, content) {
  const issues = [];
  for (const { src, line } of imageSources(content)) {
    if (!isLocalImageSrc(src)) continue;
    if (!imageExists(root, relPath, src)) issues.push({ path: relPath, line, src });
  }
  return issues;
}

function findBlockquoteIssues(relPath, content) {
  const issues = [];
  const lines = content.split("\n");
  let inFence = false;
  let fenceMarker = "";
  let prevWasFenceClose = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const fenceMatch = /^\s*(```+|~~~+)/.exec(line);
    if (fenceMatch) {
      const wasInFence = inFence;
      if (!inFence) {
        inFence = true;
        fenceMarker = fenceMatch[1][0];
      } else if (fenceMatch[1][0] === fenceMarker) {
        inFence = false;
      }
      prevWasFenceClose = wasInFence && !inFence;
      continue;
    }
    if (inFence) continue;
    if (!/^>/.test(line)) {
      prevWasFenceClose = false;
      continue;
    }
    if (i === 0) continue;
    // A blockquote may legitimately start right after a block boundary other
    // than a blank line — e.g. a closing code fence needs no blank line
    // before the next block starts.
    if (prevWasFenceClose) continue;
    const prev = lines[i - 1];
    if (prev.trim() === "") continue;
    if (/^>/.test(prev)) continue;
    issues.push({ path: relPath, line: i + 1 });
  }
  return issues;
}

function loadCalloutTypes(root) {
  const configPath = join(root, "docs", "_config.yml");
  if (!existsSync(configPath)) return [];
  try {
    const parsed = parseYaml(readFileSync(configPath, "utf8"));
    const callouts = parsed && typeof parsed === "object" ? parsed.callouts : null;
    if (!callouts || typeof callouts !== "object") return [];
    return Object.keys(callouts);
  } catch {
    return [];
  }
}

function findCalloutWarnings(relPath, content, calloutTypes) {
  const warnings = [];
  if (calloutTypes.length === 0) return warnings;
  const markerRe = new RegExp(`^\\{:\\s*\\.(${calloutTypes.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})\\s*\\}\\s*$`);
  const lines = content.split("\n");
  let inFence = false;
  let fenceMarker = "";
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const fenceMatch = /^\s*(```+|~~~+)/.exec(line);
    if (fenceMatch) {
      if (!inFence) {
        inFence = true;
        fenceMarker = fenceMatch[1][0];
      } else if (fenceMatch[1][0] === fenceMarker) {
        inFence = false;
      }
      i++;
      continue;
    }
    if (inFence || !/^>/.test(line)) {
      i++;
      continue;
    }
    const startLine = i + 1;
    while (i < lines.length && /^>/.test(lines[i])) i++;
    const next = lines[i];
    if (next === undefined || !markerRe.test(next.trim())) {
      warnings.push({ path: relPath, line: startLine });
    }
  }
  return warnings;
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
  const uniqueFiles = Array.from(new Set(files)).sort();
  const docsFiles = uniqueFiles.filter((relPath) => relPath === "docs" || relPath.startsWith("docs/"));

  const findings = [];
  const imageIssues = [];
  const blockquoteIssues = [];
  const calloutWarnings = [];
  const calloutTypes = loadCalloutTypes(repoRoot);

  for (const relPath of uniqueFiles) {
    const content = readFileSync(join(repoRoot, relPath), "utf8");
    for (const link of localMarkdownLinks(content)) {
      if (!linkExists(repoRoot, relPath, link)) findings.push({ path: relPath, link });
    }
  }

  for (const relPath of docsFiles) {
    const content = readFileSync(join(repoRoot, relPath), "utf8");
    imageIssues.push(...findImageIssues(repoRoot, relPath, content));
    blockquoteIssues.push(...findBlockquoteIssues(relPath, content));
    calloutWarnings.push(...findCalloutWarnings(relPath, content, calloutTypes));
  }

  const hardFailureCount = findings.length + imageIssues.length + blockquoteIssues.length;
  return {
    kind: "ge.docs_check",
    ok: hardFailureCount === 0,
    checked: uniqueFiles.length,
    findings,
    imageIssues,
    blockquoteIssues,
    calloutWarnings,
    summary: hardFailureCount
      ? `${hardFailureCount} documentation issue${hardFailureCount === 1 ? "" : "s"} (${findings.length} broken link${findings.length === 1 ? "" : "s"}, ${imageIssues.length} broken image${imageIssues.length === 1 ? "" : "s"}, ${blockquoteIssues.length} accidental blockquote${blockquoteIssues.length === 1 ? "" : "s"})`
      : `${uniqueFiles.length} markdown file${uniqueFiles.length === 1 ? "" : "s"} checked`,
  };
}

export function formatDocsCheck(result) {
  const lines = [];
  if (result.ok) {
    lines.push(`Docs check passed: ${result.summary}.`);
  } else {
    lines.push(`Docs check failed: ${result.summary}.`, "");
    for (const finding of result.findings) lines.push(`- ${finding.path}: ${finding.link}`);
    for (const issue of result.imageIssues) {
      lines.push(`- ${issue.path}:${issue.line}: broken image src "${issue.src}"`);
    }
    for (const issue of result.blockquoteIssues) {
      lines.push(`- ${issue.path}:${issue.line}: line starts with "> " immediately after non-blockquote text (likely an accidental line-wrap, not an intentional blockquote)`);
    }
  }
  if (result.calloutWarnings?.length) {
    lines.push("", `Advisory (non-blocking): ${result.calloutWarnings.length} blockquote${result.calloutWarnings.length === 1 ? "" : "s"} without a recognized callout marker ({: .type }):`);
    for (const warning of result.calloutWarnings) lines.push(`- ${warning.path}:${warning.line}`);
  }
  return lines.join("\n");
}
