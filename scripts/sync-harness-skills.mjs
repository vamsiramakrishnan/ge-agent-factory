#!/usr/bin/env node
import { spawnSync } from "node:child_process";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { FACTORY_SKILL_BINDINGS, loadSkillRegistry } from "../apps/factory/src/skill-registry.js";

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(SCRIPT_DIR, "..");
const HARNESS_SKILLS_DIR = join(REPO_ROOT, ".ge", "skills");
const MANIFEST_PATH = join(HARNESS_SKILLS_DIR, "manifest.json");
const ENV_PATH = join(HARNESS_SKILLS_DIR, "env.sh");
const CHECK_MODE = process.argv.includes("--check");

const REQUIRED_SKILLS = FACTORY_SKILL_BINDINGS.map((binding) => binding.skill);

function runNodeScript(relativePath) {
  const result = spawnSync(process.execPath, [join(REPO_ROOT, relativePath)], {
    cwd: REPO_ROOT,
    encoding: "utf8",
  });
  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join("\n").trim();
    throw new Error(`${relativePath} failed${output ? `:\n${output}` : ""}`);
  }
  return result.stdout.trim();
}

function buildManifest(registry) {
  const repositorySkills = registry.skills
    .filter((skill) => skill.origin === "repository")
    .sort((a, b) => a.id.localeCompare(b.id));
  const requiredPresent = new Set(repositorySkills.map((skill) => skill.id));
  const missing = REQUIRED_SKILLS.filter((skill) => !requiredPresent.has(skill));
  if (missing.length) {
    throw new Error(`Missing required repository skills: ${missing.join(", ")}`);
  }
  const manifestSkills = registry.skills
    .filter((skill) => skill.origin === "repository" || skill.origin === "agents-cli")
    .sort((a, b) => a.id.localeCompare(b.id));
  const present = new Set(manifestSkills.map((skill) => skill.id));

  return {
    schemaVersion: 1,
    generatedAt: new Date().toISOString(),
    repoRoot: REPO_ROOT,
    skillsRoot: "skills",
    manifestPath: ".ge/skills/manifest.json",
    skills: manifestSkills.map((skill) => ({
      id: skill.id,
      name: skill.name,
      description: skill.description,
      path: skill.repoRelativePath || skill.relativePath,
      absolutePath: skill.path,
      origin: skill.origin,
      rootLabel: skill.rootLabel,
      triggers: skill.triggers || [],
      composes: skill.composes || [],
    })),
    bindings: registry.bindings
      .filter((binding) => present.has(binding.skill))
      .map((binding) => ({
        capability: binding.capability,
        stages: binding.stages || [],
        skill: binding.skill,
        skillPath: binding.skillPath,
      })),
  };
}

function stableManifest(manifest) {
  return JSON.stringify({ ...manifest, generatedAt: "<generated>" }, null, 2);
}

async function readExistingManifest() {
  try {
    return JSON.parse(await readFile(MANIFEST_PATH, "utf8"));
  } catch {
    return null;
  }
}

async function main() {
  runNodeScript("skills/navigating-factory-line/scripts/audit-skill-quality.mjs");
  runNodeScript("skills/navigating-factory-line/scripts/audit-skill-coverage.mjs");

  const registry = await loadSkillRegistry(REPO_ROOT);
  const manifest = buildManifest(registry);

  if (CHECK_MODE) {
    const existing = await readExistingManifest();
    if (!existing) throw new Error(`${relative(REPO_ROOT, MANIFEST_PATH)} is missing; run make skills-sync`);
    if (stableManifest(existing) !== stableManifest(manifest)) {
      throw new Error(`${relative(REPO_ROOT, MANIFEST_PATH)} is stale; run make skills-sync`);
    }
    console.log(`Harness skills manifest is current: ${relative(REPO_ROOT, MANIFEST_PATH)}`);
    return;
  }

  await mkdir(HARNESS_SKILLS_DIR, { recursive: true });
  await writeFile(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);
  await writeFile(
    ENV_PATH,
    [
      "# Source this file when a harness needs explicit access to repository skills.",
      `export GE_HARNESS_SKILLS_ROOT="${join(REPO_ROOT, "skills")}"`,
      `export GE_HARNESS_SKILLS_MANIFEST="${MANIFEST_PATH}"`,
      "",
    ].join("\n"),
  );

  console.log(`Synced ${manifest.skills.length} harness skills -> ${relative(REPO_ROOT, MANIFEST_PATH)}`);
}

main().catch((error) => {
  console.error(error.message || error);
  process.exit(1);
});
