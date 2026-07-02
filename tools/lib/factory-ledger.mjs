// factory-ledger — durable run ledger read/write. Verbatim extraction from
// factory-core.mjs (see AGENTS.md / REFACTOR-HANDOFF.md §9 methodology:
// verbatim move, dependency injection where needed, re-export from
// factory-core.mjs to preserve its public API contract).
//
// Durable run ledger (ADR 0001). Best-effort + cached: opens a local SQLite ledger
// when a driver is available (bun:sqlite / better-sqlite3), else returns null and
// callers fall back to the legacy files. Set GE_LEDGER=0 to disable. The cloud
// control plane points this at AlloyDB via pgAdapter (future phase).

import { existsSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { readJson } from "@ge/std/json-io";
import { openRunLedger } from "./run-ledger.mjs";
import { planWorkItem } from "./pipeline-state-machine.mjs";
import { STATE_PATHS } from "./state-paths.mjs";

const FACTORY_HARNESS_DIR = STATE_PATHS.factory.root;
const STATE_PATH = STATE_PATHS.envState;
const LEDGER_PATH = join(FACTORY_HARNESS_DIR, "ledger.sqlite");

let _ledgerPromise = null;
export async function runLedger() {
  if (process.env.GE_LEDGER === "0") return null;
  if (!_ledgerPromise) _ledgerPromise = openRunLedger(LEDGER_PATH).catch(() => null);
  return _ledgerPromise;
}
// Never let a ledger write break a build/ship: best-effort, swallow errors.
export async function ledgerWrite(fn) {
  try {
    const l = await runLedger();
    if (l) await fn(l);
  } catch (error) {
    // The ledger is a shadow store in phase 1, so a write failure is never fatal to
    // the build/ship — but silently dropping it means a run/submission can vanish
    // from the durable ledger with no trace, leaving the UI/CLI disagreeing about
    // run state. Surface the reason; the swallow (and fallback to file state) is unchanged.
    console.warn(`[factory-core] ledger write skipped — durable run/job record not persisted: ${error?.message || String(error)}`);
  }
}

// Read cutover (default ON; set GE_LEDGER_READS=0 to disable): fleetStatus and
// listFactoryRuns treat the ledger as authoritative and fall back to the legacy
// files for anything it doesn't cover. Safe to default on because both readers
// merge per-item — an empty/partial ledger never drops file-only state.
export function ledgerReadsEnabled() {
  return process.env.GE_LEDGER_READS !== "0";
}

// Read APIs over the ledger (used by `ge ledger …`; the console can adopt these to
// replace the file-based fleet/runs reads once validated against a live install).
export async function ledgerRuns({ limit = 25 } = {}) {
  const l = await runLedger();
  return l ? l.listRuns({ limit }) : [];
}
export async function ledgerRun(id) {
  const l = await runLedger();
  return l ? l.getRun(id) : null;
}
export async function ledgerFleet() {
  const l = await runLedger();
  if (!l) return [];
  return [...l.fleetByUseCase().entries()].map(([useCaseId, s]) => ({ useCaseId, ...s }));
}
// Next action per work item, from the ledger's latest state + the pipeline state
// machine (ADR 0001 phase 4). One authoritative "what happens next" for build /
// ship / retry / regenerate — replacing ad-hoc stageReached skipping.
export async function ledgerPlan({ targetStage = "previewed", mode = null } = {}) {
  const l = await runLedger();
  if (!l) return [];
  const effectiveMode = mode || "local";
  return [...l.fleetByUseCase().entries()].map(([useCaseId, s]) => ({
    useCaseId,
    workspaceId: s.workspaceId || null,
    ...planWorkItem({ stage: s.stage, status: s.status === "failed" ? "failed" : "done" }, { targetStage, mode: effectiveMode }),
  }));
}

// One-shot import of the legacy file stores (.ge-state.json + factory-run-*.json)
// into the ledger. Idempotent — safe to re-run.
export async function ledgerBackfillFromDisk() {
  const l = await runLedger();
  if (!l) return { runs: 0, items: 0, note: "ledger unavailable (no sqlite driver — run under bun)" };
  const stateJson = readJson(STATE_PATH, null);
  const factoryRuns = [];
  if (existsSync(FACTORY_HARNESS_DIR)) {
    for (const f of readdirSync(FACTORY_HARNESS_DIR).filter((name) => /^factory-run-.*\.json$/.test(name))) {
      const run = readJson(join(FACTORY_HARNESS_DIR, f), null);
      if (run) factoryRuns.push(run);
    }
  }
  return l.backfill({ stateJson, factoryRuns });
}
