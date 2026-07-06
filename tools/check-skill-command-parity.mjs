#!/usr/bin/env node
// Skills ↔ registry command-surface parity gate.
//
// The harness is an entry point on equal footing with the CLI and console:
// what an operator can do through `ge`/the console (the command registry),
// a skill-driven assistant must be able to reach through a skill. This check
// makes that a contract instead of an aspiration — every GE_COMMANDS id must
// be routed by at least one skill in skills/skill-routing.json, or carry an
// explicit exemption below with a reason.
//
// Three failure modes, all structural:
//   - unrouted   -> a registry command no skill routes and no exemption covers
//                   (new commands must ship with a skill route or an exemption)
//   - stale      -> an exempted command that IS now routed (trim the exemption)
//   - phantom    -> a routed command that is not a registry id (typo/renamed id;
//                   also caught by the skill-matrix gate — kept here so this
//                   check stands alone)
//
// Companion of tools/check-no-app-imports.mjs & friends in the source:hygiene
// chain: fast, deterministic, no network.

import { readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");

// Deliberately-unrouted commands. Every entry needs a reason a reviewer can
// re-judge; "we forgot" is not a reason. Trim an entry the moment a skill
// routes the command.
const EXEMPT = {
  "console.deploy": "console packaging deploy — deliberately CLI/console-only (widening deploys to assistants is a separate deliberate act, same stance as the MCP surface)",
  "console.doctor": "console packaging doctor — read-only companion of console.deploy, same stance",
};

const { GE_COMMANDS } = await import(join(REPO_ROOT, "packages", "capability-registry", "src", "registry.mjs"));
const routing = JSON.parse(readFileSync(join(REPO_ROOT, "skills", "skill-routing.json"), "utf8"));

const routed = new Set(Object.values(routing.skills || {}).flatMap((skill) => skill.commands || []));
const registryIds = new Set(Object.keys(GE_COMMANDS));

const unrouted = [...registryIds].filter((id) => !routed.has(id) && !(id in EXEMPT)).sort();
const stale = Object.keys(EXEMPT).filter((id) => routed.has(id)).sort();
const unknownExempt = Object.keys(EXEMPT).filter((id) => !registryIds.has(id)).sort();
const phantom = [...routed].filter((id) => !registryIds.has(id)).sort();

const problems = [];
if (unrouted.length) {
  problems.push(
    `✗ ${unrouted.length} registry command(s) reachable from the CLI/console but NOT from any skill ` +
      `(route them in skills/skill-routing.json, or exempt them with a reason in tools/check-skill-command-parity.mjs):`,
    ...unrouted.map((id) => `  - ${id}`),
  );
}
if (stale.length) {
  problems.push(
    `✗ ${stale.length} exemption(s) are stale — the command is now skill-routed; trim from EXEMPT:`,
    ...stale.map((id) => `  - ${id}`),
  );
}
if (unknownExempt.length) {
  problems.push(
    `✗ ${unknownExempt.length} exemption(s) name a command that is not a registry id:`,
    ...unknownExempt.map((id) => `  - ${id}`),
  );
}
if (phantom.length) {
  problems.push(
    `✗ ${phantom.length} skill-routed command(s) are not registry ids:`,
    ...phantom.map((id) => `  - ${id}`),
  );
}

if (problems.length) {
  console.error(problems.join("\n"));
  process.exit(1);
}

console.log(
  `Skill-command parity check passed: ${registryIds.size} registry commands — ` +
    `${[...registryIds].filter((id) => routed.has(id)).length} skill-routed, ${Object.keys(EXEMPT).length} exempted with reasons.`,
);
