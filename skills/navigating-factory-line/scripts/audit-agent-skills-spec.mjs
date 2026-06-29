#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { basename, join, relative, sep } from "node:path";

const args = process.argv.slice(2);
if (args.includes("--help") || args.includes("-h")) {
  process.stdout.write([
    "usage: audit-agent-skills-spec.mjs [--root <dir>]... [--all] [--strict]",
    "",
    "Audits Agent Skills spec portability for repository skills.",
    "Default root is skills/. Use --all to include mirrored and legacy skill roots.",
    "--strict exits nonzero when warnings remain.",
    "",
  ].join("\n"));
  process.exit(0);
}

const strict = args.includes("--strict");
const all = args.includes("--all");
const rootArgs = valuesFor("--root");
const roots = rootArgs.length
  ? rootArgs
  : all
    ? ["skills", ".ge-harness/skills", "apps/factory/.gemini/skills", "apps/factory/.ge-harness/skills"]
    : ["skills"];

const allowedFrontmatterKeys = new Set(["name", "description", "license", "compatibility", "metadata", "allowed-tools"]);
const namePattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function valuesFor(flag) {
  const values = [];
  for (let index = 0; index < args.length; index += 1) {
    if (args[index] === flag && args[index + 1]) values.push(args[index + 1]);
  }
  return values;
}

function parseFrontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!match) return { fields: {}, keys: [], body: text };
  const fields = {};
  const keys = [];
  let currentKey = null;
  let blockKey = null;
  let blockMode = null;

  for (const line of match[1].split(/\r?\n/)) {
    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (keyMatch) {
      currentKey = keyMatch[1];
      keys.push(currentKey);
      blockKey = null;
      blockMode = null;
      const value = keyMatch[2].trim();
      if (value === "|" || value === ">") {
        fields[currentKey] = "";
        blockKey = currentKey;
        blockMode = value;
      } else if (value === "") {
        fields[currentKey] = [];
      } else if (value.startsWith("[") && value.endsWith("]")) {
        fields[currentKey] = value.slice(1, -1).split(",").map(cleanYamlValue).filter(Boolean);
      } else {
        fields[currentKey] = cleanYamlValue(value);
      }
      continue;
    }

    const listMatch = line.match(/^\s*-\s*(.*)$/);
    if (currentKey && Array.isArray(fields[currentKey]) && listMatch) {
      fields[currentKey].push(cleanYamlValue(listMatch[1]));
      continue;
    }

    if (blockKey && typeof fields[blockKey] === "string") {
      const value = line.replace(/^\s+/, "");
      const separator = blockMode === ">" ? " " : "\n";
      fields[blockKey] = `${fields[blockKey]}${fields[blockKey] ? separator : ""}${value}`.trim();
    }
  }

  return { fields, keys, body: text.slice(match[0].length) };
}

function cleanYamlValue(value) {
  return String(value || "").trim().replace(/^["']|["']$/g, "");
}

function walkSkillDirs(root) {
  if (!existsSync(root)) return [];
  return readdirSync(root)
    .map((name) => join(root, name))
    .filter((path) => statSync(path).isDirectory() && existsSync(join(path, "SKILL.md")));
}

function walkFiles(path) {
  if (!existsSync(path)) return [];
  const files = [];
  for (const entry of readdirSync(path, { withFileTypes: true })) {
    const child = join(path, entry.name);
    if (entry.isDirectory()) files.push(...walkFiles(child));
    else files.push(child);
  }
  return files;
}

function add(issues, severity, id, message, detail = {}) {
  issues.push({ severity, id, message, ...detail });
}

function auditSkill(dir) {
  const path = join(dir, "SKILL.md");
  const text = readFileSync(path, "utf8");
  const { fields, keys, body } = parseFrontmatter(text);
  const issues = [];
  const name = fields.name || "";
  const description = fields.description || "";
  const lines = text.split(/\r?\n/).length;
  const bodyLines = body.split(/\r?\n/).length;

  if (!keys.length) add(issues, "error", "frontmatter:missing", "SKILL.md must start with YAML frontmatter");
  if (!name) add(issues, "error", "name:missing", "frontmatter name is required");
  if (name && !namePattern.test(name)) add(issues, "error", "name:invalid", "name must use lowercase letters, numbers, and single hyphens", { name });
  if (name && name.length > 64) add(issues, "error", "name:too-long", "name must be at most 64 characters", { length: name.length });
  if (name && name !== basename(dir)) add(issues, "error", "name:directory-mismatch", "name must match parent directory", { name, directory: basename(dir) });
  if (!description) add(issues, "error", "description:missing", "description is required");
  if (description.length > 1024) add(issues, "error", "description:too-long", "description must be at most 1024 characters", { length: description.length });
  if (lines > 500) add(issues, "error", "body:too-long", "SKILL.md should stay under 500 lines", { lines });

  for (const key of keys) {
    if (!allowedFrontmatterKeys.has(key)) {
      add(issues, "warning", "frontmatter:nonportable-key", "frontmatter key is not part of the Agent Skills spec", { key });
    }
  }

  if (description && !/\bUse when\b/i.test(description)) {
    add(issues, "warning", "description:weak-trigger", "description should include explicit 'Use when' trigger language");
  }

  if (!existsSync(join(dir, "evals", "evals.json"))) {
    add(issues, "warning", "evals:missing", "skill has no evals/evals.json quality suite");
  }

  for (const subdir of ["references", "scripts", "assets"]) {
    const subdirPath = join(dir, subdir);
    if (!existsSync(subdirPath)) continue;
    for (const file of walkFiles(subdirPath)) {
      const rel = relative(subdirPath, file);
      if (rel.includes(sep)) add(issues, "warning", `${subdir}:nested`, `${subdir}/ should stay one level deep`, { file: rel });
      if (subdir === "scripts") {
        const scriptText = readFileSync(file, "utf8");
        if (!/--help|usage:/i.test(scriptText)) {
          add(issues, "warning", "script:missing-help", "script should document --help or usage for agentic use", { file: relative(dir, file) });
        }
      }
    }
  }

  return {
    skill: basename(dir),
    path,
    lines,
    bodyLines,
    issueCount: issues.length,
    errors: issues.filter((issue) => issue.severity === "error").length,
    warnings: issues.filter((issue) => issue.severity === "warning").length,
    issues,
  };
}

function auditRouting() {
  const path = "skills/skill-routing.json";
  const issues = [];
  if (!existsSync(path)) return { path, issues };

  let config;
  try {
    config = JSON.parse(readFileSync(path, "utf8"));
  } catch (error) {
    add(issues, "error", "routing:invalid-json", "skills/skill-routing.json must be valid JSON", { detail: error.message });
    return { path, issues };
  }

  if (config.schemaVersion !== 1) {
    add(issues, "error", "routing:schema-version", "skills/skill-routing.json schemaVersion must be 1", { schemaVersion: config.schemaVersion });
  }

  const skillDirs = new Set(walkSkillDirs("skills").map((dir) => basename(dir)));
  const routes = config.skills || {};
  for (const [skill, route] of Object.entries(routes)) {
    if (!skillDirs.has(skill)) add(issues, "error", "routing:unknown-skill", "routing entry does not match a skill directory", { skill });
    for (const key of ["triggers", "composes"]) {
      if (Object.hasOwn(route, key) && !Array.isArray(route[key])) {
        add(issues, "error", `routing:${key}:type`, `routing ${key} must be an array`, { skill });
      }
    }
    for (const target of Array.isArray(route.composes) ? route.composes : []) {
      if (!skillDirs.has(target)) {
        add(issues, "error", "routing:unknown-compose-target", "composes target does not match a skill directory", { skill, target });
      }
    }
  }
  return { path, issues };
}

const results = roots.flatMap((root) => walkSkillDirs(root).map(auditSkill));
const routing = roots.includes("skills") ? auditRouting() : { issues: [] };
const routingErrors = routing.issues.filter((issue) => issue.severity === "error").length;
const routingWarnings = routing.issues.filter((issue) => issue.severity === "warning").length;
const summary = {
  roots,
  skills: results.length,
  errors: results.reduce((sum, result) => sum + result.errors, 0) + routingErrors,
  warnings: results.reduce((sum, result) => sum + result.warnings, 0) + routingWarnings,
  missingEvals: results.filter((result) => result.issues.some((issue) => issue.id === "evals:missing")).length,
  nonportableFrontmatter: results.filter((result) => result.issues.some((issue) => issue.id === "frontmatter:nonportable-key")).length,
  weakDescriptions: results.filter((result) => result.issues.some((issue) => issue.id === "description:weak-trigger")).length,
  scriptHelpGaps: results.reduce((sum, result) => sum + result.issues.filter((issue) => issue.id === "script:missing-help").length, 0),
  routingIssues: routing.issues.length,
};

const ok = summary.errors === 0;
const strictOk = ok && summary.warnings === 0;
process.stdout.write(JSON.stringify({ ok, strictOk, summary, routing, results }, null, 2) + "\n");
if (!ok || (strict && !strictOk)) process.exit(1);
