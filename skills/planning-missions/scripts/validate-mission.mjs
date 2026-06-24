#!/usr/bin/env node
import { readFileSync } from "node:fs";

const args = process.argv.slice(2);

if (args.includes("--help") || args.includes("-h")) {
  process.stdout.write("usage: validate-mission.mjs [mission.json]\n\nReads from stdin when no file is provided.\n");
  process.exit(0);
}

function readInput() {
  return args[0] ? readFileSync(args[0], "utf8") : readFileSync(0, "utf8");
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}

let mission;
try {
  mission = JSON.parse(readInput());
} catch (error) {
  fail(`invalid JSON: ${error.message}`);
}

const required = [
  ["kind", mission.kind],
  ["version", mission.version],
  ["mode", mission.mode],
  ["modeContract.autopilotCapability", mission.modeContract?.autopilotCapability],
  ["target.workspaceGate", mission.target?.workspaceGate],
  ["target.effectiveFactoryTarget", mission.target?.effectiveFactoryTarget],
  ["summary.selected", mission.summary?.selected],
  ["phases", mission.phases],
  ["roster", mission.roster],
];

const missing = required.filter(([, value]) => value === undefined || value === null || value === "").map(([name]) => name);
if (missing.length) fail(`missing required field(s): ${missing.join(", ")}`);
if (mission.kind !== "ge.factory_autopilot.mission") fail("kind must be ge.factory_autopilot.mission");
if (!["local", "remote"].includes(mission.mode)) fail("mode must be local or remote");
if (!Array.isArray(mission.phases)) fail("phases must be an array");
if (!Array.isArray(mission.roster)) fail("roster must be an array");

const capability = mission.modeContract.autopilotCapability;
if (mission.mode === "local" && capability !== "local_doctor_repair") fail("local mode requires local_doctor_repair capability");
if (mission.mode === "remote" && capability !== "remote_observe_only") fail("remote mode requires remote_observe_only capability");

process.stdout.write(JSON.stringify({
  ok: true,
  mode: mission.mode,
  target: mission.target.workspaceGate,
  selected: mission.summary.selected,
  factory: mission.summary.factory,
  autopilot: mission.summary.autopilot,
  remoteObserve: mission.summary.remoteObserve,
}, null, 2) + "\n");
