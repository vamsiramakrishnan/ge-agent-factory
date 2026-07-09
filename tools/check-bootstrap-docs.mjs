#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const RAW_INSTALLER =
  "https://raw.githubusercontent.com/vamsiramakrishnan/ge-agent-factory/main/packages/create-ge-agent-factory/bin/create-ge-agent-factory.mjs";
const BROKEN_NPM_SNIPPET = "bunx create-ge-agent-factory";

const publicDocRoots = [
  "README.md",
  "AGENTS.md",
  "docs",
  join("apps", "docs", "src", "content", "docs"),
];

const requiredRawMentions = [
  "README.md",
  "docs/index.md",
  "docs/start/getting-started.md",
  join("apps", "docs", "src", "content", "docs", "index.mdx"),
];

const files = publicDocRoots.flatMap((entry) => {
  const path = join(REPO_ROOT, entry);
  if (!existsSync(path)) return [];
  if (statSync(path).isDirectory()) return walk(path).filter((file) => /\.(md|mdx)$/.test(file));
  return [path];
});

const findings = [];
for (const file of files) {
  const rel = file.slice(REPO_ROOT.length + 1);
  const text = readFileSync(file, "utf8");
  if (text.includes(BROKEN_NPM_SNIPPET)) {
    findings.push(`${rel}: do not document "${BROKEN_NPM_SNIPPET}" until the package is published; use the raw GitHub installer script`);
  }
}

for (const rel of requiredRawMentions) {
  const path = join(REPO_ROOT, rel);
  if (!existsSync(path)) {
    findings.push(`${rel}: expected bootstrap doc is missing`);
    continue;
  }
  if (!readFileSync(path, "utf8").includes(RAW_INSTALLER)) {
    findings.push(`${rel}: missing the supported GitHub-backed installer URL`);
  }
}

if (findings.length) {
  console.error("Bootstrap docs check failed:");
  for (const finding of findings) console.error(`  - ${finding}`);
  process.exit(1);
}

console.log("Bootstrap docs check passed: public docs use the GitHub-backed installer path.");

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walk(path));
    else out.push(path);
  }
  return out;
}
