#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  process.stdout.write("usage: audit-skill-coverage.mjs\n\nAudits required repository skills and stage mappings. Outputs JSON.\n");
  process.exit(0);
}

const root = "skills";
const requiredSkills = [
  "navigating-factory-line",
  "interviewing-specs",
  "planning-missions",
  "running-factory",
  "building-simulators",
  "checking-workspaces",
  "running-release",
  "operating-console",
  "recording-evidence",
];

const stages = [
  "user_interview",
  "spec_generation",
  "mission",
  "plan",
  "generate_workspace",
  "generate_data",
  "package_data",
  "harness_refine",
  "validate",
  "preview",
  "promote",
  "plan_deploy",
  "load_data",
  "deploy_runtime",
  "poll_runtime",
  "register_tools",
  "publish_enterprise",
  "verify_live",
];

const mapPath = join(root, "navigating-factory-line", "references", "stage-skill-map.md");
const map = existsSync(mapPath) ? readFileSync(mapPath, "utf8") : "";
const results = {
  skills: requiredSkills.map((name) => ({ name, exists: existsSync(join(root, name, "SKILL.md")) })),
  stages: stages.map((name) => ({ name, mapped: map.includes(`| ${name} `) })),
};
const ok = results.skills.every((item) => item.exists) && results.stages.every((item) => item.mapped);
process.stdout.write(JSON.stringify({ ok, ...results }, null, 2) + "\n");
if (!ok) process.exit(1);
