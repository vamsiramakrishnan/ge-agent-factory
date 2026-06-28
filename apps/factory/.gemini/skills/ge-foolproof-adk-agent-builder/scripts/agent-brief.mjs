#!/usr/bin/env node
import { existsSync, readFileSync } from "node:fs";

const REQUIRED = [
  "name",
  "department",
  "useCase",
  "persona",
  "trigger",
  "inputs",
  "outputs",
  "mockSystems",
  "tools",
  "evidence",
  "successMetric",
  "boundary",
  "validation",
  "behaviorContract",
];

function usage() {
  console.log("Usage: node .gemini/skills/ge-foolproof-adk-agent-builder/scripts/agent-brief.mjs check <brief.json>");
}

function readJson(path) {
  if (!existsSync(path)) throw new Error(`brief not found: ${path}`);
  return JSON.parse(readFileSync(path, "utf8"));
}

function missingFields(brief) {
  const missing = [];
  for (const key of REQUIRED) {
    const value = brief[key];
    if (value == null || value === "" || (Array.isArray(value) && value.length === 0)) {
      missing.push(key);
    }
  }
  if (!brief.useCase?.title) missing.push("useCase.title");
  if (!Array.isArray(brief.mockSystems) || brief.mockSystems.some((system) => !system.id || !system.type)) {
    missing.push("mockSystems[].id/type");
  }
  // The behavior contract is what turns the brief from a list of systems into a
  // build spec the factory can compile. Without these fields, the generated
  // agent collapses back into the generic list/query shell.
  const contract = brief.behaviorContract;
  if (contract && typeof contract === "object") {
    if (!contract.role || String(contract.role).trim().length < 8) missing.push("behaviorContract.role");
    if (!contract.primaryObjective || String(contract.primaryObjective).trim().length < 20) missing.push("behaviorContract.primaryObjective");
    if (!Array.isArray(contract.inScope) || contract.inScope.length === 0) missing.push("behaviorContract.inScope");
    if (!Array.isArray(contract.outOfScope) || contract.outOfScope.length === 0) missing.push("behaviorContract.outOfScope");
    if (!Array.isArray(contract.toolIntents) || contract.toolIntents.length < 2) missing.push("behaviorContract.toolIntents (need 2+)");
    if (Array.isArray(contract.toolIntents) && contract.toolIntents.every((intent) => intent && intent.kind === "query")) {
      missing.push("behaviorContract.toolIntents (need at least one non-query intent)");
    }
    if (!Array.isArray(contract.evidenceRequirements) || contract.evidenceRequirements.length === 0) missing.push("behaviorContract.evidenceRequirements");
    if (!Array.isArray(contract.escalationRules) || contract.escalationRules.length === 0) missing.push("behaviorContract.escalationRules");
    if (!Array.isArray(contract.refusalRules) || contract.refusalRules.length === 0) missing.push("behaviorContract.refusalRules");
    if (!Array.isArray(contract.goldenEvals) || contract.goldenEvals.length === 0) missing.push("behaviorContract.goldenEvals");
    if (Array.isArray(contract.goldenEvals)) {
      for (const ev of contract.goldenEvals) {
        if (!Array.isArray(ev.expectedToolCalls) || ev.expectedToolCalls.length === 0) {
          missing.push(`behaviorContract.goldenEvals[${ev.id || "?"}].expectedToolCalls`);
          break;
        }
      }
    }
  }
  return [...new Set(missing)];
}

const [, , command, file] = process.argv;
if (command !== "check" || !file) {
  usage();
  process.exit(command ? 1 : 0);
}

try {
  const brief = readJson(file);
  const missing = missingFields(brief);
  if (missing.length) {
    console.error(`Brief is incomplete. Missing: ${missing.join(", ")}`);
    process.exit(1);
  }
  console.log("Brief is implementation-ready.");
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
