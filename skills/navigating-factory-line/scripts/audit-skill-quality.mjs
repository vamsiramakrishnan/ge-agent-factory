#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative, sep } from "node:path";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  process.stdout.write("usage: audit-skill-quality.mjs\n\nAudits repository skill naming, descriptions, references, scripts, and resource layout. Outputs JSON.\n");
  process.exit(0);
}

const root = "skills";
const namePattern = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const standardDirs = new Set(["references", "scripts", "assets", "evals"]);
const firstOrSecondPersonPattern = /\b(I|me|my|mine|we|us|our|ours|you|your|yours)\b/i;

function parseFrontmatter(text) {
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const fields = {};
  for (const line of match[1].split("\n")) {
    const idx = line.indexOf(":");
    if (idx > 0) fields[line.slice(0, idx).trim()] = line.slice(idx + 1).trim();
  }
  return fields;
}

const dirs = readdirSync(root)
  .map((name) => join(root, name))
  .filter((path) => statSync(path).isDirectory() && existsSync(join(path, "SKILL.md")));

const results = [];
for (const dir of dirs) {
  const skillPath = join(dir, "SKILL.md");
  const text = readFileSync(skillPath, "utf8");
  const fm = parseFrontmatter(text);
  const name = dir.split("/").pop();
  const references = [...text.matchAll(/(?:^|\s)(references\/[A-Za-z0-9._-]+\.(?:md|json))/g)].map((m) => m[1]);
  const scripts = [...text.matchAll(/(?:^|\s)(scripts\/[A-Za-z0-9._-]+\.mjs)/g)].map((m) => m[1]);
  const issues = [];
  if (!fm) issues.push("missing frontmatter");
  if (fm?.name !== name) issues.push(`frontmatter name must match directory (${name})`);
  if (!namePattern.test(fm?.name || "")) issues.push("name must use lowercase letters, numbers, and hyphens");
  if ((fm?.name || "").length > 64) issues.push("name too long");
  if (!fm?.description) issues.push("description missing");
  if ((fm?.description || "").length > 1024) issues.push("description too long");
  if (firstOrSecondPersonPattern.test(fm?.description || "")) issues.push("description must be third person");
  if (!/\bUse when\b/.test(fm?.description || "")) issues.push("description should include a clear Use when trigger");
  if (text.split("\n").length > 500) issues.push("SKILL.md over 500 lines");
  for (const ref of references) if (!existsSync(join(dir, ref))) issues.push(`missing ${ref}`);
  for (const script of scripts) if (!existsSync(join(dir, script))) issues.push(`missing ${script}`);
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    if (!standardDirs.has(entry.name)) issues.push(`nonstandard directory ${entry.name}`);
  }
  for (const subdir of ["references", "scripts", "assets"]) {
    const subdirPath = join(dir, subdir);
    if (!existsSync(subdirPath)) continue;
    for (const entry of walkFiles(subdirPath)) {
      const rel = relative(subdirPath, entry);
      if (rel.includes(sep)) issues.push(`${subdir} must stay one level deep: ${rel}`);
      if (subdir === "references" && !/^[A-Za-z0-9._-]+\.(md|json)$/.test(basename(entry))) issues.push(`reference file should be .md or .json: ${rel}`);
      if (subdir === "scripts" && !/^[A-Za-z0-9._-]+\.mjs$/.test(basename(entry))) issues.push(`script file should be .mjs: ${rel}`);
    }
  }
  results.push({ skill: name, ok: issues.length === 0, issues });
}

const ok = results.every((item) => item.ok);
process.stdout.write(JSON.stringify({ ok, results }, null, 2) + "\n");
if (!ok) process.exit(1);

function walkFiles(path) {
  const files = [];
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(child));
    else files.push(child);
  }
  return files;
}
