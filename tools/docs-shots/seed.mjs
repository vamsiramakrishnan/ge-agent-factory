#!/usr/bin/env bun
// tools/docs-shots/seed.mjs — deterministic state seeder for the docs screenshot
// factory (see tools/docs-shots/capture.mjs and docs/DESIGN.md's "Screenshots"
// section).
//
// This script MUST be run with GE_STATE_ROOT (and GE_CONSOLE_JOB_STORE) already
// set in its environment — every tools/lib/* module that reads state resolves
// its paths from those env vars at *module load* time (top-level `const`), so
// setting process.env from inside this file after those modules are imported
// would be too late. capture.mjs spawns this script as a subprocess with both
// vars pre-set for that reason; do the same if you run this file directly:
//
//   GE_STATE_ROOT=/tmp/ge-docs-shots GE_CONSOLE_JOB_STORE=/tmp/ge-docs-shots/console/jobs bun tools/docs-shots/seed.mjs
//
// Everything below is either (a) real repo data (the generated use-case catalog,
// or checked-in generator golden-fixture output reused verbatim) or (b) plain
// JSON/text written in the exact schema the real generator/workspace code reads
// (mock_systems/pipeline.json, workspace.json via the real buildWorkspaceManifest/
// buildReadiness functions, etc.) — never a hand-drawn/mocked UI state. Every
// timestamp and id below is a fixed literal (no Date.now(), no randomUUID()) so
// two seed runs produce byte-identical downstream screenshots.

import { existsSync, mkdirSync, readFileSync, writeFileSync, cpSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { writeJson as writeJsonAtomic } from "@ge/std/json-io";

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(HERE, "..", "..");

if (!process.env.GE_STATE_ROOT) {
  throw new Error("seed.mjs requires GE_STATE_ROOT to be set before it starts (see file header) — run it via `bun run docs:shots`, not directly.");
}

// ── 0. Make sure the (gitignored, generated) use-case catalog exists ─────────
// loadCatalog() throws if this file is missing; `bun run catalog` regenerates it
// offline from apps/presentation's slide components — no network/cloud needed.
const CATALOG_PATH = join(REPO_ROOT, "apps/factory/generated/use-cases.generated.json");
if (!existsSync(CATALOG_PATH)) {
  console.log("[seed] use-case catalog missing — running `bun run catalog` (offline, no cloud) …");
  execFileSync("bun", ["apps/factory/scripts/sync-use-cases-from-slides.mjs"], { cwd: REPO_ROOT, stdio: "inherit" });
}
const CATALOG = JSON.parse(readFileSync(CATALOG_PATH, "utf8"));
function catalogEntry(id) {
  const entry = CATALOG.find((u) => u.id === id);
  if (!entry) throw new Error(`seed.mjs: catalog entry "${id}" not found — has the catalog shape changed?`);
  return entry;
}

// ── fixed narrative clock (no Date.now() anywhere in this file) ──────────────
const T = {
  passedStart: "2026-01-15T09:00:00.000Z",
  passedEnd: "2026-01-15T09:04:12.000Z",
  runningStart: "2026-01-15T09:10:00.000Z",
  runningUpdate: "2026-01-15T09:12:30.000Z",
  failedStart: "2026-01-15T08:50:00.000Z",
  failedEnd: "2026-01-15T08:53:47.000Z",
  repairCreated: "2026-01-15T08:55:00.000Z",
  repairEnded: "2026-01-15T08:58:21.000Z",
};

// The three demo use cases — real ids from the real (generated) catalog.
const PASSED_ID = "asc-606-contract-analyzer"; // published workspace, full green readiness
const RUNNING_ID = "account-reconciliation-agent"; // job in flight, no workspace yet
const FAILED_ID = "bank-reconciliation-agent"; // failed build + a repair run

catalogEntry(PASSED_ID);
catalogEntry(RUNNING_ID);
catalogEntry(FAILED_ID);

// ── 1. Local workspace for the "passed/published" agent ──────────────────────
// Dynamic imports: these modules read GE_STATE_ROOT/GE_CONSOLE_JOB_STORE from
// process.env at import time via top-level `const`s in tools/lib/state-paths.mjs,
// so they must load only after this process's env is already correct (it is —
// capture.mjs passes it via the child_process `env` option before this file's
// first line runs).
const { STATE_PATHS } = await import("../lib/state-paths.mjs");
const { createWorkspace } = await import(join(REPO_ROOT, "apps/factory/src/projects.js"));

mkdirSync(STATE_PATHS.root, { recursive: true });

const workspace = await createWorkspace({
  storePath: STATE_PATHS.factory.workspacesJson,
  projectsRoot: STATE_PATHS.factory.workspaces,
  name: "ASC 606 Contract Analyzer",
  useCaseId: PASSED_ID,
  departmentId: "finance",
});
const wsDir = join(STATE_PATHS.factory.workspaces, workspace.id);

function writeJson(relPath, value) {
  writeJsonAtomic(join(wsDir, relPath), value);
}
function writeText(relPath, value) {
  const full = join(wsDir, relPath);
  mkdirSync(dirname(full), { recursive: true });
  writeFileSync(full, value, "utf8");
}
function copyFixture(src, relPath) {
  const full = join(wsDir, relPath);
  mkdirSync(dirname(full), { recursive: true });
  cpSync(src, full);
}

const GOLDEN = join(REPO_ROOT, "apps/factory/tests/fixtures/tools-golden");
const FIXTURE = join(REPO_ROOT, "apps/factory/tests/fixtures/data-gen-unit");
const cat = catalogEntry(PASSED_ID);

// mock_systems/usecase-spec.json — the real catalog entry for this use case
// (apps/factory/generated/use-cases.generated.json), not invented content.
writeJson("mock_systems/usecase-spec.json", cat);

// mock_systems/schema.json — column shape lifted from the real checked-in
// data-gen-unit test fixture for THIS SAME use case (tables/*.json below).
writeJson("mock_systems/schema.json", {
  domain: "finance",
  tables: [
    { name: "sales_orders", sourceSystem: "SAP S/4HANA SD", rowCount: 400, anomalies: [] },
    { name: "contracts", sourceSystem: "Contract Repository", rowCount: 180, anomalies: [] },
  ],
  anomalies: [],
});

// fixtures/manifest.json (+ its table/document payloads) — reused verbatim from
// the real, checked-in generator fixture for asc-606-contract-analyzer.
copyFixture(join(FIXTURE, "manifest.json"), "fixtures/manifest.json");
copyFixture(join(FIXTURE, "tables/sales_orders.json"), "fixtures/tables/sales_orders.json");
copyFixture(join(FIXTURE, "tables/contracts.json"), "fixtures/tables/contracts.json");
copyFixture(join(FIXTURE, "expected/document.md"), "fixtures/documents/asc-606-contract-analyzer-controls-playbook.md");

// app/agent.py, app/tools.py, pyproject.toml — real ADK generator output,
// reused verbatim from the checked-in tools-golden fixture for this same use case.
copyFixture(join(GOLDEN, "agent.py.golden"), "app/agent.py");
copyFixture(join(GOLDEN, "tools.py.golden"), "app/tools.py");
copyFixture(join(GOLDEN, "pyproject.toml.golden"), "pyproject.toml");
copyFixture(join(GOLDEN, "eval_config.json.golden"), "tests/eval/eval_config.json");
copyFixture(join(GOLDEN, "evalset.json.golden"), "tests/eval/evalsets/ge_behavior_contract.evalset.json");
copyFixture(join(GOLDEN, "golden.json.golden"), "evals/golden.json");

writeText("tests/test_smoke.py", `"""Smoke test for the generated ${cat.title} agent (docs-shots seed fixture)."""
from app.agent import root_agent


def test_agent_importable():
    assert root_agent is not None


def test_agent_has_tools():
    assert len(root_agent.tools) > 0
`);

// mock_systems/pipeline.json — real STEPS shape from apps/factory/scripts/factory/core/pipeline.mjs,
// every step marked done so buildReadiness() computes a fully "published" workspace.
const STEPS = ["init", "schema", "generate", "tools", "test", "harnessReview", "harnessRefine", "sourceIntegration", "serve", "deploy", "register", "publish"];
const steps = {};
for (const step of STEPS) {
  steps[step] = { status: "done", completedAt: T.passedEnd };
}
steps.serve = { status: "done", completedAt: T.passedEnd, port: 8765 };
steps.deploy = { status: "done", completedAt: T.passedEnd, target: "cloud_run", runtimeId: "demo-runtime-asc606", serviceUrl: "https://asc-606-contract-analyzer-demo.example.run.app" };
steps.publish = { status: "done", completedAt: T.passedEnd, appId: "demo-ge-app" };
writeJson("mock_systems/pipeline.json", {
  name: workspace.id,
  domain: "finance",
  createdAt: T.passedStart,
  steps,
  currentStep: "publish",
});

// Artifacts that push every buildReadiness() category to "ready"/"passing".
writeJson("artifacts/validation-report.json", { ok: true, testExitCode: 0, generatedAt: T.passedEnd });
writeJson("artifacts/spec-code-trace.json", { ok: true, coverage: { requiredIntentCoverage: 1 }, blockers: [] });
writeJson("artifacts/preview-report.json", { ok: true, generatedAt: T.passedEnd, port: 8765 });
writeJson("mock_data/plan/data-plan.json", { datastores: [{ kind: "bigquery", dataset: "asc_606_contract_analyzer" }, { kind: "alloydb", database: "asc_606_contract_analyzer" }] });
writeJson("artifacts/deploy-plan.json", { target: "cloud_run", region: "us-central1", generatedAt: T.passedEnd });
writeJson("artifacts/publish-plan.json", { appId: "demo-ge-app", generatedAt: T.passedEnd });
writeJson("deployment_metadata.json", { target: "cloud_run", agent_runtime_id: "demo-runtime-asc606" });
writeJson("gemini_enterprise_registration.json", { appId: "demo-ge-app" });

// Recompute workspace.json for real from the files above (buildWorkspaceManifest /
// buildReadiness are the exact functions the console reads through workspaceDoctor /
// AgentDetail — nothing here is hand-authored UI state).
const { ensureWorkspaceManifest } = await import(join(REPO_ROOT, "apps/factory/src/projects.js"));
await ensureWorkspaceManifest(STATE_PATHS.factory.workspaces, {
  id: workspace.id,
  name: "ASC 606 Contract Analyzer",
  kind: "workspace",
  useCaseId: PASSED_ID,
  departmentId: "finance",
  createdAt: T.passedStart,
  updatedAt: T.passedEnd,
});

// ── 2. Fleet state: mark the failed use case as failed (legacy state.json) ───
// fleetStatus() falls back to this file when the ledger has no entry for a
// use case (docs-shots never touches the ledger, so this is always the path
// taken here) — see tools/lib/fleet-ops.mjs.
writeJsonAtomic(STATE_PATHS.envState, {
  completed: {
    [PASSED_ID]: { runId: workspace.id, workspaceId: workspace.id, at: T.passedEnd },
  },
  failed: {
    [FAILED_ID]: { error: "tools generation failed: missing OpenAPI operation for reverseTransaction on Treasury Management System", at: T.failedEnd },
  },
});

console.log(`[seed] workspace ready: ${workspace.id} (${wsDir})`);

// ── 3. Console job-store rows (jobs.sqlite) — bypasses job-store.mjs's own
// createJobRecord/finishJobRecord (they stamp new Date().toISOString() — not
// deterministic); this writes the exact same schema directly with fixed times.
const { Database } = await import("bun:sqlite");
mkdirSync(process.env.GE_CONSOLE_JOB_STORE, { recursive: true });
const dbPath = join(process.env.GE_CONSOLE_JOB_STORE, "jobs.sqlite");
const db = new Database(dbPath);
db.exec("PRAGMA journal_mode = WAL");
db.exec(`
  CREATE TABLE IF NOT EXISTS jobs (
    id TEXT PRIMARY KEY,
    argv_json TEXT NOT NULL,
    command_json TEXT,
    status TEXT NOT NULL,
    code INTEGER,
    started_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    ended_at TEXT,
    last_line TEXT,
    checks_json TEXT
  );
  CREATE TABLE IF NOT EXISTS job_events (
    seq INTEGER PRIMARY KEY AUTOINCREMENT,
    job_id TEXT NOT NULL,
    event_json TEXT NOT NULL,
    type TEXT,
    level TEXT,
    stage TEXT,
    line TEXT,
    ts TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY(job_id) REFERENCES jobs(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_jobs_updated ON jobs(updated_at DESC);
  CREATE INDEX IF NOT EXISTS idx_job_events_job_seq ON job_events(job_id, seq);

  CREATE TABLE IF NOT EXISTS autopilot_runs (
    id TEXT PRIMARY KEY,
    target_stage TEXT NOT NULL,
    status TEXT NOT NULL,
    options_json TEXT,
    total INTEGER NOT NULL DEFAULT 0,
    passed INTEGER NOT NULL DEFAULT 0,
    repaired INTEGER NOT NULL DEFAULT 0,
    blocked INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    ended_at TEXT
  );
  CREATE TABLE IF NOT EXISTS autopilot_items (
    run_id TEXT NOT NULL,
    agent_id TEXT NOT NULL,
    workspace_id TEXT NOT NULL,
    target_stage TEXT NOT NULL,
    status TEXT NOT NULL,
    attempts INTEGER NOT NULL DEFAULT 0,
    blocker_json TEXT,
    doctor_json TEXT,
    repair_json TEXT,
    updated_at TEXT NOT NULL,
    PRIMARY KEY(run_id, agent_id),
    FOREIGN KEY(run_id) REFERENCES autopilot_runs(id) ON DELETE CASCADE
  );
  CREATE TABLE IF NOT EXISTS autopilot_events (
    seq INTEGER PRIMARY KEY AUTOINCREMENT,
    run_id TEXT NOT NULL,
    event_json TEXT NOT NULL,
    type TEXT,
    agent_id TEXT,
    line TEXT,
    created_at INTEGER NOT NULL,
    FOREIGN KEY(run_id) REFERENCES autopilot_runs(id) ON DELETE CASCADE
  );
  CREATE INDEX IF NOT EXISTS idx_autopilot_runs_updated ON autopilot_runs(updated_at DESC);
  CREATE INDEX IF NOT EXISTS idx_autopilot_items_run_status ON autopilot_items(run_id, status);
  CREATE INDEX IF NOT EXISTS idx_autopilot_events_run_seq ON autopilot_events(run_id, seq);
`);

const insertJob = db.prepare(`
  INSERT INTO jobs (id, argv_json, command_json, status, code, started_at, updated_at, ended_at, last_line, checks_json)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

insertJob.run(
  "demo-run-001",
  JSON.stringify(["agents", "build", "--ids", PASSED_ID, "--local"]),
  JSON.stringify({ id: "agents.build.local", cli: "ge agents build --local" }),
  "passed",
  0,
  T.passedStart,
  T.passedEnd,
  T.passedEnd,
  "validated: 7/7 checks passed",
  JSON.stringify([
    { id: "schema", status: "pass", detail: "2 tables, 0 anomalies" },
    { id: "fixtures", status: "pass", detail: "580 rows across 2 tables, 1 document" },
    { id: "agent", status: "pass", detail: "app.agent:root_agent" },
    { id: "tests", status: "pass", detail: "tests/test_smoke.py" },
  ]),
);

insertJob.run(
  "demo-run-002",
  JSON.stringify(["agents", "build", "--ids", RUNNING_ID, "--local"]),
  JSON.stringify({ id: "agents.build.local", cli: "ge agents build --local" }),
  "running",
  null,
  T.runningStart,
  T.runningUpdate,
  null,
  "generate: drafting app/agent.py",
  null,
);

insertJob.run(
  "demo-run-003",
  JSON.stringify(["agents", "build", "--ids", FAILED_ID, "--local"]),
  JSON.stringify({ id: "agents.build.local", cli: "ge agents build --local" }),
  "failed",
  1,
  T.failedStart,
  T.failedEnd,
  T.failedEnd,
  "Error: tools generation failed: missing OpenAPI operation for reverseTransaction on Treasury Management System",
  JSON.stringify([
    { id: "schema", status: "pass", detail: "3 tables, 0 anomalies" },
    { id: "tools", status: "fail", detail: "missing OpenAPI operation for reverseTransaction" },
  ]),
);

const insertEvent = db.prepare(`
  INSERT INTO job_events (job_id, event_json, type, level, stage, line, ts, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);
insertEvent.run(
  "demo-run-002",
  JSON.stringify({ type: "log", level: "info", stage: "generate", line: "generate: drafting app/agent.py", ts: T.runningUpdate }),
  "log", "info", "generate", "generate: drafting app/agent.py", T.runningUpdate, Date.parse(T.runningUpdate),
);
insertEvent.run(
  "demo-run-003",
  JSON.stringify({ type: "log", level: "error", stage: "tools", line: "Error: tools generation failed: missing OpenAPI operation for reverseTransaction on Treasury Management System", ts: T.failedEnd }),
  "log", "error", "tools", "Error: tools generation failed: missing OpenAPI operation for reverseTransaction on Treasury Management System", T.failedEnd, Date.parse(T.failedEnd),
);

// ── 4. One repair run for the failed agent (Repair Queue) ────────────────────
const insertAutopilotRun = db.prepare(`
  INSERT INTO autopilot_runs (id, target_stage, status, options_json, total, passed, repaired, blocked, created_at, updated_at, ended_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
insertAutopilotRun.run(
  "demo-repair-001",
  "preview",
  "blocked",
  JSON.stringify({ repair: true, attempts: 3 }),
  1, 0, 0, 1,
  T.repairCreated,
  T.repairEnded,
  T.repairEnded,
);
const insertAutopilotItem = db.prepare(`
  INSERT INTO autopilot_items (run_id, agent_id, workspace_id, target_stage, status, attempts, blocker_json, doctor_json, repair_json, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);
insertAutopilotItem.run(
  "demo-repair-001",
  FAILED_ID,
  FAILED_ID,
  "preview",
  "blocked",
  1,
  JSON.stringify([{ id: "tools", message: "missing OpenAPI operation for reverseTransaction on Treasury Management System" }]),
  null,
  null,
  T.repairEnded,
);

db.close();
console.log(`[seed] jobs.sqlite seeded: ${dbPath}`);
console.log("[seed] done.");
