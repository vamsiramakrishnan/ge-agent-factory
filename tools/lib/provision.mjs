// Cloud + local agent-build submission — `ge agents build` (remote and --local),
// `ge handoff`, `ge agents sync --local`, and the first-proof/devex-check wrappers
// around the local path. Split out of factory-core.mjs as the "submit/build a
// fleet of agents" domain, distinct from the read-only fleet/run reporting that
// stays in factory-core.mjs and the pure readiness checks in tool-plane-checks.mjs.
//
// createProvisionOps takes its cross-cutting dependencies (run/gcloud/ensureGcloud,
// the gateway client, the ledger singleton, loadCatalog, config IO) as injected
// parameters — the same factory-function shape createDataPlane/createMcpPlane/
// createFactoryPlane already use in this directory — because those pieces are
// either owned by factory-core.mjs directly (config path, ledger) or by things
// factory-core.mjs itself composes (gateway client), and factory-core.mjs is the
// module that re-exports this file's functions, so this file must not import
// factory-core.mjs back (that would be the cycle).
import { existsSync, mkdirSync, readdirSync, rmSync, statSync } from "node:fs";
import { join } from "node:path";
import { parseList } from "@ge/std/list";
import { buildStageFanout } from "@ge/run-ledger/control-plane";
import { pool } from "./gcp.mjs";
import { parseConcurrency } from "./concurrency.mjs";
import { runDocsCheck } from "./docs-check.mjs";
import { createFactoryPlan, runFactoryPlan, removeWorkspace } from "./factory-local-ops.mjs";
import { STATE_PATHS, displayStatePath } from "./state-paths.mjs";
import { DxError } from "./errors/dx-error.mjs";
import {
  LOCAL_PROJECTS,
  LOCAL_PROJECT_STORE,
  localWorkspaceContractReports,
  resolveLocalWorkspaceId,
  summarizeLocalRunWorkspaces,
  workspaceStoreItems,
} from "./local-workspaces.mjs";
import { selectWorkspacesForRegen } from "./planes/tool-plane-checks.mjs";
import { admitForHandoff } from "./admission/admission-ops.mjs";
import { HANDOFF_TAR_EXCLUDES } from "./handoff-package.mjs";

const noop = () => {};
export const DEFAULT_REMOTE_SUBMIT_CONCURRENCY = 8;

export function defaultRemoteSubmitConcurrency(env = process.env) {
  return parseConcurrency(env.GE_REMOTE_SUBMIT_CONCURRENCY, { fallback: DEFAULT_REMOTE_SUBMIT_CONCURRENCY });
}

const REMOTE_STAGE_ALIASES = Object.freeze({
  previewed: "preview",
  deployed: "poll_runtime",
  registered: "register_tools",
  published: "publish_enterprise",
});

export function normalizeRemoteFactoryStage(stage, fallback = "publish_enterprise") {
  const value = String(stage || fallback);
  return REMOTE_STAGE_ALIASES[value] || value;
}

// Mirrors factory-core's parseIdList (accepts a CSV string or an array, always
// returns a trimmed, empty-free list) — kept local so this module has no
// dependency back on factory-core.mjs.
function parseIdList(ids) {
  return String(Array.isArray(ids) ? ids.join(",") : ids || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
}

function toAgent(u) {
  return {
    id: u.id, name: u.title, title: u.title, useCaseId: u.id, workspaceId: `ws-${u.id}`,
    domain: u.department, goal: u.subtitle || `${u.title} — ${u.department} specialist agent`,
    systems: u.systems || [], targetStage: "publish_enterprise", rows: "48",
  };
}

function remoteTarget(cfg, domain = "") {
  return {
    projectId: cfg.project,
    runtimeRegion: cfg.region,
    artifactBucket: cfg.bucket,
    dataBucket: cfg.dataBucket,
    projectNumber: cfg.projectNumber,
    geminiEnterpriseAppId: cfg.geAppId,
    serviceAccount: cfg.serviceAccount,
    mcpServiceUrl: (cfg.mcpServices && cfg.mcpServices[domain]) || "",
    agentIdentityPrincipalSet: cfg.agentIdentityPrincipalSet || "",
  };
}

function copyWorkspaces(run, ids, baseDir, log) {
  let n = 0;
  for (const id of ids) {
    const dest = join(baseDir, id);
    rmSync(dest, { recursive: true, force: true }); mkdirSync(dest, { recursive: true });
    const r = run("rsync", [
      "-a",
      ...HANDOFF_TAR_EXCLUDES.flatMap((dir) => ["--exclude", dir]),
      `${join(LOCAL_PROJECTS, id)}/`,
      `${dest}/`,
    ], { capture: true, allowFail: true });
    if (!r.ok) {
      // No rsync: cp then prune the heavy/generated dirs so they don't get committed.
      run("cp", ["-a", `${join(LOCAL_PROJECTS, id)}/.`, dest], { capture: true, allowFail: true });
      for (const junk of [".venv", "node_modules", ".pytest_cache", ".google-agents-cli", "runs", "versions", ".ge-harness"]) rmSync(join(dest, junk), { recursive: true, force: true });
      // prune nested __pycache__ / *.pyc that cp -a carries through
      run("bash", ["-c", `find ${JSON.stringify(dest)} \\( -name __pycache__ -o -name .adk \\) -type d -prune -exec rm -rf {} + 2>/dev/null; find ${JSON.stringify(dest)} -name '*.pyc' -delete 2>/dev/null; true`], { capture: true, allowFail: true });
    }
    n++; log(`✓ ${id}`);
  }
  return n;
}

export function createProvisionOps({
  run,
  gcloud,
  ensureGcloud,
  ensureBin,
  withGateway,
  postJson,
  loadCatalog,
  runLedger,
  ledgerWrite,
  readJson,
  writeJson,
  localPreflight,
  ensureLocalUv,
  repoRoot,
  configPath,
  factoryHarnessDir,
  factoryDataRoot,
  genDir,
} = {}) {
  if (!run || !gcloud || !ensureGcloud || !ensureBin || !withGateway || !postJson || !loadCatalog || !runLedger || !ledgerWrite || !readJson || !writeJson || !localPreflight || !ensureLocalUv || !repoRoot || !configPath || !factoryHarnessDir || !factoryDataRoot || !genDir) {
    throw new Error("createProvisionOps requires run/gcloud/ensureGcloud/ensureBin/withGateway/postJson/loadCatalog/runLedger/ledgerWrite/readJson/writeJson/localPreflight/ensureLocalUv/repoRoot/configPath/factoryHarnessDir/factoryDataRoot/genDir");
  }
  const STATE_PATH = STATE_PATHS.envState;

  async function provision(cfg, { scope, ids, dept, concurrency = defaultRemoteSubmitConcurrency(), noProxy = false, force = false, refine = true, model = null, maxOutputTokens = null, evalJudgeSamples = null, log = noop } = {}) {
    ensureGcloud();
    if (!cfg.project) throw new Error("No project. Run `ge init`.");
    if (!cfg.geAppId) throw new Error("geAppId unset. Add it to .ge.json or set GEMINI_ENTERPRISE_APP_ID.");
    let agents = (await loadCatalog()).map(toAgent);
    if (scope === "canary") agents = agents.slice(0, 1);
    else if (ids) { const set = new Set(String(ids).split(",").map((s) => s.trim())); agents = agents.filter((a) => set.has(a.id)); }
    else if (dept) { const set = new Set(String(dept).split(",").map((s) => s.trim())); agents = agents.filter((a) => set.has(a.domain)); }
    else if (scope !== "all") throw new Error("Specify a scope: canary | all | dept:<d> | ids:<a,b>");

    const state = readJson(STATE_PATH, { completed: {}, failed: {} });
    const pending = agents.filter((a) => force || !state.completed[a.id]);
    if (!pending.length) return { submitted: 0, failed: 0, total: agents.length, results: [], note: "nothing to submit (use force to resubmit)" };

    const conc = parseConcurrency(concurrency);
    const remoteLedgerRunId = `remote-build-${new Date().toISOString().replace(/[:.]/g, "-")}`;
    const submissionFanout = buildStageFanout({
      runId: remoteLedgerRunId,
      stage: "submit",
      attempt: 1,
      targetStage: "publish_enterprise",
      workItems: pending.map((agent) => ({ id: agent.id, workspaceId: agent.workspaceId })),
    });
    const fanoutByAgent = new Map(submissionFanout.tasks.map((task) => [task.itemId, task]));
    const results = [];
    await withGateway(cfg, async (url, ctx = {}) => {
      await pool(pending, conc, async (a) => {
        const fanoutTask = fanoutByAgent.get(a.id);
        const payload = {
          title: a.title, useCaseId: a.useCaseId, workspace: a.workspaceId, targetStage: a.targetStage,
          rows: String(a.rows), systems: a.systems, generationSpec: { domain: a.domain, description: a.goal },
          // Antigravity review+refine runs in the cloud factory by default; REFINE=0 opts out.
          refine,
          // Top-level like `refine`; the bridge (submitFactoryRun) folds these into the
          // worker payload.options and the from-usecase generation so remote builds pin
          // the same model (default gemini-3.5-flash) + output-token budget as local.
          // cfg.agentModel carries the centralized flag→env→.ge.json→default resolution.
          ...(model || cfg.agentModel ? { model: model || cfg.agentModel } : {}),
          // The eval-judge model, forwarded the same way so a .ge.json judgeModel
          // reaches the remote generator's eval_config.yaml (parity with local).
          ...(cfg.judgeModel ? { judgeModel: cfg.judgeModel } : {}),
          ...(evalJudgeSamples || cfg.evalJudgeSamples ? { evalJudgeSamples: evalJudgeSamples || cfg.evalJudgeSamples } : {}),
          // The harness review/refine model — provisionLocal pins it from
          // cfg.refinementModel, so forward it remotely too or the cloud harness
          // silently runs review/refine on agentModel instead.
          ...(cfg.refinementModel ? { refinementModel: cfg.refinementModel } : {}),
          // The build harness itself. provisionLocal pins it from
          // cfg.harnessAgent → runOptions["harness-provider"]; forward
          // it remotely too (bridge reads request.harnessProvider → worker
          // payload.options.harnessProvider) or the cloud build silently runs on
          // the antigravity-sdk default regardless of .ge.json harnessAgent.
          ...(cfg.harnessAgent ? { harnessProvider: cfg.harnessAgent } : {}),
          ...(maxOutputTokens != null && String(maxOutputTokens).trim() !== ""
            ? { maxOutputTokens: Number(maxOutputTokens) }
            : {}),
          // Per-dept custom MCP service URL + agent-identity principalSet trigger
          // register_tools MCP registration + iap.egressor grant in the worker.
          target: remoteTarget(cfg, a.domain),
        };
        const res = await postJson(url, "/api/factory/usecase", payload, ctx.headers).catch((e) => ({ ok: false, text: e.message }));
        if (res.ok && res.json?.ok) {
          state.completed[a.id] = { runId: res.json.runId, workspaceId: res.json.workspaceId, at: new Date().toISOString() };
          delete state.failed[a.id];
          results.push({ id: a.id, ok: true, runId: res.json.runId, fanoutKey: fanoutTask?.key, taskId: fanoutTask?.taskId });
          log(`✓ ${a.id} → ${res.json.runId}`);
        } else {
          const error = res.json?.message || `HTTP ${res.status}: ${(res.text || "").slice(0, 120)}`;
          state.failed[a.id] = { error };
          results.push({ id: a.id, ok: false, error, fanoutKey: fanoutTask?.key, taskId: fanoutTask?.taskId });
          log(`✗ ${a.id} ${error}`);
        }
        writeJson(STATE_PATH, state);
      });
    }, { noProxy, log });
    // Shadow the remote submission into the durable ledger.
    const agentById = new Map(pending.map((a) => [a.id, a]));
    await ledgerWrite((l) => l.recordRemoteSubmission({
      runId: remoteLedgerRunId,
      mode: "remote",
      kind: "build",
      targetStage: "published",
      items: results.map((r) => ({
        id: r.id,
        useCaseId: r.id,
        title: agentById.get(r.id)?.title || null,
        department: agentById.get(r.id)?.domain || null,
        workspaceId: state.completed?.[r.id]?.workspaceId || null,
        error: r.ok ? null : r.error,
        at: state.completed?.[r.id]?.at,
      })),
    }));
    return { submitted: results.filter((r) => r.ok).length, failed: results.filter((r) => !r.ok).length, total: pending.length, fanout: submissionFanout, results };
  }

  async function resumeRemote(cfg, { ids, targetStage = "publish_enterprise", concurrency = defaultRemoteSubmitConcurrency(), noProxy = false, force = false, log = noop } = {}) {
    ensureGcloud();
    if (!cfg.project) throw new Error("No project. Run `ge init`.");
    if (!cfg.geAppId) throw new Error("geAppId unset. Add it to .ge.json or set GEMINI_ENTERPRISE_APP_ID.");
    const state = readJson(STATE_PATH, { completed: {}, failed: {} });
    state.completed ||= {};
    state.failed ||= {};
    const requested = new Set(parseIdList(ids));
    const entries = Object.entries(state.completed).filter(([id, entry]) => (
      !requested.size || requested.has(id) || requested.has(entry?.workspaceId)
    ));
    if (!entries.length) {
      throw new DxError("no tracked remote runs match this resume request.", {
        where: "state: .ge-state.json (completed remote submissions)",
        why: "an exact cloud resume needs the prior gateway run id and workspace id",
        fix: "ge agents status",
      });
    }

    const catalogById = new Map((await loadCatalog()).map((item) => [item.id, item]));
    const effectiveTargetStage = normalizeRemoteFactoryStage(targetStage);
    const results = [];
    await withGateway(cfg, async (url, ctx = {}) => {
      await pool(entries, parseConcurrency(concurrency), async ([id, entry]) => {
        const domain = catalogById.get(id)?.department || "";
        const payload = {
          targetStage: effectiveTargetStage,
          force,
          ...(cfg.agentModel ? { model: cfg.agentModel } : {}),
          ...(cfg.judgeModel ? { judgeModel: cfg.judgeModel } : {}),
          ...(cfg.evalJudgeSamples ? { evalJudgeSamples: cfg.evalJudgeSamples } : {}),
          ...(cfg.refinementModel ? { refinementModel: cfg.refinementModel } : {}),
          ...(cfg.harnessAgent ? { harnessProvider: cfg.harnessAgent } : {}),
          target: remoteTarget(cfg, domain),
        };
        const path = `/api/factory/runs/${encodeURIComponent(entry.runId)}/resume`;
        const response = await postJson(url, path, payload, ctx.headers).catch((error) => ({ ok: false, text: error.message }));
        if (response.ok && response.json?.ok) {
          state.completed[id] = {
            runId: response.json.runId,
            workspaceId: response.json.workspaceId || entry.workspaceId,
            at: new Date().toISOString(),
            resumeOf: entry.runId,
          };
          delete state.failed[id];
          results.push({ id, ok: true, runId: response.json.runId, resumeOf: entry.runId });
          log(`✓ ${id} → ${response.json.runId} (resumed ${entry.runId})`);
        } else {
          const error = response.json?.error || response.json?.message || `HTTP ${response.status}: ${(response.text || "").slice(0, 160)}`;
          state.failed[id] = { error, runId: entry.runId };
          results.push({ id, ok: false, resumeOf: entry.runId, error });
          log(`✗ ${id} ${error}`);
        }
      });
    }, { noProxy, log });
    writeJson(STATE_PATH, state);

    const ledgerRunId = `remote-resume-${new Date().toISOString().replace(/[:.]/g, "-")}`;
    await ledgerWrite((ledger) => ledger.recordRemoteSubmission({
      runId: ledgerRunId,
      mode: "remote",
      kind: "resume",
      targetStage: effectiveTargetStage,
      items: results.map((result) => ({
        id: result.id,
        useCaseId: result.id,
        workspaceId: state.completed[result.id]?.workspaceId || null,
        error: result.ok ? null : result.error,
        at: state.completed[result.id]?.at,
      })),
    }));
    return {
      submitted: results.filter((result) => result.ok).length,
      failed: results.filter((result) => !result.ok).length,
      total: entries.length,
      targetStage: effectiveTargetStage,
      results,
    };
  }

  // Local mode: run the whole pipeline on this machine via the Antigravity SDK
  // harness (ge-harness factory plan + run --vertex) instead of the cloud gateway.
  // Generated workspaces land in .ge/factory/projects/.
  async function provisionLocal(cfg, { scope, ids, dept, limit, target = "published", vertex = true, location = null, model = null, maxOutputTokens = null, evalJudgeSamples = null, warm = false, force = false, log = noop } = {}) {
    ensureBin("node");
    if (vertex && !cfg.project) throw new Error("local --vertex needs a project (set GOOGLE_CLOUD_PROJECT or run `ge init`).");
    // One runId shared by the live ledger stream and the final ingest (idempotent).
    const ledgerRunId = `local-${new Date().toISOString().replace(/[:.]/g, "-")}`;
    const liveLedger = await runLedger();
    // Regenerate (--force): wipe the selected workspaces + registry entries so the
    // rebuild replaces them instead of leaving stale/duplicate workspaces. The wipe
    // is also recorded as a 'reset' transition (ADR 0001 phase 4) so the run's event
    // stream shows regenerate intent, not just a fresh build.
    if (force) {
      const items = workspaceStoreItems(readJson(LOCAL_PROJECT_STORE, { workspaces: [] }));
      const targets = selectWorkspacesForRegen(items, { ids, dept, scope });
      let wiped = 0;
      for (const ws of targets) {
        const present = existsSync(join(LOCAL_PROJECTS, ws.id));
        // Always remove the registry entry (clears drift); record reset only under the
        // catalog useCaseId so it converges with the rebuild's work-item row.
        await removeWorkspace({ storePath: LOCAL_PROJECT_STORE, projectsRoot: LOCAL_PROJECTS, projectId: ws.id });
        if (ws.useCaseId) { try { liveLedger?.recordReset({ runId: ledgerRunId, workItemId: ws.useCaseId }); } catch { /* best-effort */ } }
        if (present) { wiped += 1; log(`regenerate: wiped workspace ${ws.id}`); }
      }
      if (wiped) log(`regenerate: cleared ${wiped} workspace(s) — rebuilding from scratch`);
      else log("regenerate: no existing local workspaces matched the selection (nothing to wipe)");
    }
    // Shared uv cache + hardlink for all agent .venvs in this run.
    const cacheDir = ensureLocalUv({ warm, log });
    log(`uv: shared cache ${cacheDir} (hardlink)`);
    const planOptions = { target };
    if (ids) planOptions.usecases = ids;
    else if (scope === "canary") planOptions.limit = "1";
    else if (dept) planOptions.department = dept;
    else if (limit) planOptions.limit = String(limit);
    else {
      planOptions.department = "all";
      planOptions.limit = "all";
    }
    if (cfg.project) planOptions.project = cfg.project;
    planOptions.factoryDir = factoryHarnessDir;
    log("planning (local harness)…");
    process.env.GE_HARNESS_DATA_ROOT = factoryDataRoot;
    // Propagate model / token overrides to the spawned `factory generate` so locally
    // generated agents honor them (parity with the remote worker's commandEnv).
    // Precedence is flag → env → .ge.json → default: cfg.agentModel already
    // resolves the env/file/default tail, so a --model flag wins and a .ge.json
    // agentModel is honored when no flag/env override is present.
    const agentModel = model || cfg.agentModel;
    if (agentModel) process.env.GE_AGENT_MODEL = agentModel;
    // The LLM-judge model rendered into each generated eval_config.yaml. The
    // generator reads GE_JUDGE_MODEL directly (apps/factory/scripts/factory.mjs),
    // so a .ge.json judgeModel only reaches it if exported here — parity with
    // GE_AGENT_MODEL above.
    if (cfg.judgeModel) process.env.GE_JUDGE_MODEL = cfg.judgeModel;
    const judgeSamples = evalJudgeSamples || cfg.evalJudgeSamples;
    if (judgeSamples) process.env.GE_EVAL_JUDGE_SAMPLES = String(judgeSamples);
    if (maxOutputTokens != null && String(maxOutputTokens).trim() !== "") {
      process.env.GE_AGENT_MAX_OUTPUT_TOKENS = String(maxOutputTokens);
    }
    const planResult = await createFactoryPlan({ repoRoot: genDir, dataRoot: factoryDataRoot, options: planOptions });
    log(`planned ${planResult.plan.totals.workItems} item(s) across ${planResult.plan.totals.departments} department(s)`);

    const runOptions = { target, continue: "true", stream: "true" };
    runOptions.factoryDir = factoryHarnessDir;
    runOptions.projectsDir = LOCAL_PROJECTS;
    if (vertex) {
      runOptions.vertex = "true";
      runOptions.project = cfg.project;
      runOptions.location = location || cfg.geLocation || "global";
    }
    // The harness review/refine model pin (factory.js reads options.model).
    // Falls back to the centralized refinementModel so the pin follows
    // .ge.json/GE_REFINEMENT_MODEL instead of a hardcoded default downstream.
    const harnessModel = model || cfg.refinementModel;
    if (harnessModel) runOptions.model = harnessModel;
    // Default harness adapter for the review/refine stages (factory.js reads
    // options["harness-provider"]); resolved here so .ge.json/GE_HARNESS_AGENT
    // selects the configured adapter without a per-invocation flag.
    if (cfg.harnessAgent) runOptions["harness-provider"] = cfg.harnessAgent;
    // Stream this run into the ledger live (ledgerRunId shared with the final ingest,
    // so events arrive as stages complete rather than only at the end). Best-effort.
    if (liveLedger) {
      runOptions.onEvent = (event) => {
        try { liveLedger.applyFactoryEvent(ledgerRunId, event, { mode: "local" }); } catch { /* never break the run */ }
      };
    }
    log(`running pipeline → ${target} (local harness${vertex ? ", Vertex" : ""})…`);
    const runResult = await runFactoryPlan({
      repoRoot: genDir,
      dataRoot: factoryDataRoot,
      planPath: planResult.planPath,
      options: runOptions,
    });
    // Final ingest reconciles the canonical run record (same id → idempotent with the
    // live stream; also the fallback when live emission was unavailable).
    await ledgerWrite((l) => l.ingestFactoryRun(runResult.run, { mode: "local", id: ledgerRunId }));
    if (!runResult.run.ok) {
      const failed = runResult.run.results.find((item) => item.error);
      throw new Error(`local harness build failed${failed ? ` for ${failed.useCaseId}: ${failed.error}` : ""}`);
    }
    const workspaces = summarizeLocalRunWorkspaces(runResult.run);
    return {
      mode: "local",
      target,
      selected: planResult.plan.totals.workItems,
      plan: planResult.planPath,
      run: runResult.runPath,
      markdown: runResult.mdPath,
      projectsDir: displayStatePath(LOCAL_PROJECTS),
      events: displayStatePath(join(factoryHarnessDir, "factory-events.jsonl")),
      workspaces,
      primaryWorkspace: workspaces[0] || null,
    };
  }

  // `ge mode local|remote`: set the operating mode (persisted in .ge.json).
  function setMode(mode) {
    if (!["local", "remote"].includes(mode)) {
      throw new DxError(`mode must be 'local' or 'remote' (got '${mode}')`, {
        where: "config: mode (.ge.json)",
        why: "the operating mode decides whether builds run on this machine or in the cloud factory — only those two exist",
        fix: "ge mode local",
      });
    }
    const existing = readJson(configPath, {});
    writeJson(configPath, { ...existing, mode });
    return { mode };
  }

  async function firstProof(cfg, {
    id = null,
    target = "validated",
    preview = false,
    vertex = false,
    warm = false,
    force = false,
    log = noop,
  } = {}) {
    const startedAt = new Date().toISOString();
    const doctor = localPreflight();
    if (doctor.fails > 0) {
      return {
        kind: "ge.prove.fresh",
        ok: false,
        blocked: true,
        stage: "doctor",
        startedAt,
        finishedAt: new Date().toISOString(),
        doctor,
        fixes: doctor.checks.filter((check) => check.status === "fail").map((check) => check.fix).filter(Boolean),
        next: "mise run setup",
      };
    }

    setMode("local");
    const buildTarget = preview ? "previewed" : target || "validated";
    const build = await provisionLocal({ ...cfg, mode: "local" }, {
      scope: id ? undefined : "canary",
      ids: id || undefined,
      target: buildTarget,
      vertex,
      warm,
      force,
      log,
    });
    const workspace = build.primaryWorkspace || null;
    const contract = workspace?.contract || null;
    if (!workspace || !contract?.ok) {
      return {
        kind: "ge.prove.fresh",
        ok: false,
        blocked: true,
        stage: "workspace_contract",
        startedAt,
        finishedAt: new Date().toISOString(),
        mode: "local",
        target: buildTarget,
        doctor,
        build,
        workspace,
        contract,
        next: workspace ? `ge devex check --id ${workspace.id}` : "ge devex check",
      };
    }
    return {
      kind: "ge.prove.fresh",
      ok: true,
      blocked: false,
      startedAt,
      finishedAt: new Date().toISOString(),
      mode: "local",
      target: buildTarget,
      doctor,
      build,
      workspace,
      contract,
      next: [
        workspace?.commands?.doctor || (workspace ? `ge-harness workspace doctor ${workspace.id} --stage preview` : null),
        workspace?.commands?.eval || null,
        workspace?.commands?.sync || null,
        workspace?.commands?.ship || null,
      ].filter(Boolean),
    };
  }

  function devexCheck(_cfg = {}, {
    ids = "",
    allWorkspaces = false,
    strictWorkspaces = true,
    docs = true,
    local = true,
  } = {}) {
    const startedAt = new Date().toISOString();
    const doctor = local ? localPreflight() : null;
    const docsResult = docs ? runDocsCheck({ root: repoRoot }) : null;
    const workspaceItems = localWorkspaceContractReports({
      ids,
      allWorkspaces,
      strictFiles: strictWorkspaces,
    });
    const workspaceFails = workspaceItems.filter((item) => !item.ok).length;
    const workspaceWarnings = workspaceItems.reduce((sum, item) => sum + (item.warnings || 0), 0);
    const ok = (!doctor || doctor.fails === 0) && (!docsResult || docsResult.ok) && workspaceFails === 0;
    return {
      kind: "ge.devex.check",
      ok,
      blocked: !ok,
      startedAt,
      finishedAt: new Date().toISOString(),
      doctor,
      docs: docsResult,
      workspaces: {
        checked: workspaceItems.length,
        failed: workspaceFails,
        warnings: workspaceWarnings,
        strict: strictWorkspaces,
        all: allWorkspaces,
        items: workspaceItems,
      },
      next: ok
        ? ["ge prove --target validated --force", "mise run console"]
        : [
          doctor?.fails ? "mise run setup" : null,
          docsResult && !docsResult.ok ? "node tools/docs-check.mjs" : null,
          workspaceFails ? "ge prove --target validated --force" : null,
        ].filter(Boolean),
    };
  }

  // Sync locally-generated agent workspaces to git. Default target is a DEDICATED
  // repo (cfg.agentsRepo or --remote): clone it, drop the workspaces in, push from
  // there — so the monorepo isn't pushed. With no repo configured, falls back to
  // generated-agents/ in this repo.
  function syncLocal(cfg, { ids = "", remote, push = false, commit = true, create = false, log = noop } = {}) {
    if (!existsSync(LOCAL_PROJECTS)) throw new Error(`no local workspaces at ${LOCAL_PROJECTS} — run \`ge provision --local\` first.`);
    const dirs = readdirSync(LOCAL_PROJECTS).filter((d) => { try { return statSync(join(LOCAL_PROJECTS, d)).isDirectory(); } catch { return false; } });
    const requested = parseIdList(ids);
    let syncIds = dirs;
    if (requested.length) {
      const resolved = new Set(requested.map((id) => {
        try { return resolveLocalWorkspaceId(id); } catch { return id; }
      }));
      for (const id of requested) resolved.add(id);
      syncIds = dirs.filter((dir) => resolved.has(dir));
      if (!syncIds.length) throw new Error(`no matching local workspaces for: ${requested.join(", ")}`);
    }
    const target = remote || cfg.agentsRepo || "";

    if (target) {
      // --create: ensure the Cloud Source repo exists before cloning/pushing.
      if (create) {
        const cs = target.match(/source\.developers\.google\.com(?::\d+)?\/p\/([^/]+)\/r\/([^/]+)/);
        if (cs) {
          log(`ensuring Cloud Source repo ${cs[2]} in ${cs[1]}`);
          const r = run("gcloud", ["source", "repos", "create", cs[2], "--project", cs[1]], { capture: true, allowFail: true });
          if (!r.ok && !/already exists/i.test(r.err)) log(`⚠ repo create failed (${(r.err.split("\n")[0] || "").slice(0, 100)}) — continuing; clone will fail if it truly doesn't exist`);
        } else log("--create only supports Cloud Source URLs; skipping repo creation");
      }
      const work = join(repoRoot, ".agents-repo");
      if (existsSync(join(work, ".git"))) {
        run("git", ["-C", work, "remote", "set-url", "origin", target], { capture: true, allowFail: true });
        run("git", ["-C", work, "pull", "--ff-only"], { capture: false, allowFail: true });
      } else {
        rmSync(work, { recursive: true, force: true });
        const cl = run("git", ["clone", target, work], { capture: true, allowFail: true });
        if (!cl.ok) throw new Error(`Could not clone the agents repo:\n  ${target}\nCreate it first (gcloud source repos create / your git host) on an authenticated machine, or pass an existing --remote. (${(cl.err.split("\n").find((l) => /fatal|error/i.test(l)) || cl.err.split("\n")[0] || "").trim()})`);
      }
      const n = copyWorkspaces(run, syncIds, work, log);
      let pushed = false;
      if (n && commit) {
        run("git", ["-C", work, "add", "-A"], { capture: false, allowFail: true });
        run("git", ["-C", work, "commit", "-m", `sync ${n} generated agent workspace(s)`], { capture: false, allowFail: true });
        if (push) { run("git", ["-C", work, "push", "origin", "HEAD"], { capture: false }); pushed = true; }
      }
      return { mode: "local", repo: target, ids: syncIds, synced: n, pushed };
    }

    const outDir = join(repoRoot, "generated-agents");
    mkdirSync(outDir, { recursive: true });
    const n = copyWorkspaces(run, syncIds, outDir, log);
    let pushed = false;
    if (n && commit) {
      run("git", ["add", "generated-agents"], { capture: false, allowFail: true });
      run("git", ["commit", "-m", `chore(agents): sync ${n} locally-generated workspace(s)`], { capture: false, allowFail: true });
      if (push) { run("git", ["push"], { capture: false }); pushed = true; }
    }
    return { mode: "local", repo: displayStatePath(outDir), ids: syncIds, synced: n, pushed };
  }

  // `ge handoff` (local → remote release): upload each locally-built workspace to
  // GCS and submit a deploy-only run to the cloud factory that starts past the build
  // boundary (default load_data → deploy_runtime → register_tools → publish_enterprise),
  // consuming the prebuilt workspace instead of regenerating. Pairs with `ge agents
  // build --local` (build + validate on this machine).
  async function handoff(cfg, { ids, startStage = "load_data", targetStage = "publish_enterprise", concurrency = defaultRemoteSubmitConcurrency(), noProxy = false, force = false, log = noop } = {}) {
    ensureGcloud();
    if (!cfg.project) throw new Error("No project. Run `ge init`.");
    if (!cfg.bucket) throw new Error("No artifact bucket in config.");
    if (!cfg.geAppId) throw new Error("geAppId unset. Add it to .ge.json or set GEMINI_ENTERPRISE_APP_ID.");
    if (!existsSync(LOCAL_PROJECTS)) {
      throw new DxError(`no local workspaces at ${LOCAL_PROJECTS} — run \`ge prove\` first.`, {
        where: `workspaces: ${LOCAL_PROJECTS}`,
        why: "handoff releases locally-built agents, and nothing has been built on this machine yet",
        fix: "ge prove",
      });
    }
    let dirs = readdirSync(LOCAL_PROJECTS).filter((d) => { try { return statSync(join(LOCAL_PROJECTS, d)).isDirectory(); } catch { return false; } });
    if (ids) {
      const requested = parseList(String(ids));
      const resolved = new Set(requested.map((id) => {
        try { return resolveLocalWorkspaceId(id); } catch { return id; }
      }));
      dirs = dirs.filter((d) => resolved.has(d));
    }
    if (!dirs.length) {
      throw new DxError("no matching local workspaces to hand off.", {
        where: "workspaces: local workspace registry",
        why: "the ids requested do not match any locally-built workspace",
        fix: "ge agents resume",
      });
    }

    // The admission gate (ADR: contractual checks as an admission controller).
    // Every workspace gets a recorded decision before anything is uploaded;
    // whether a denial refuses the release is the policy's call
    // (.ge.json promotion.gates.admission.required — audit mode by default),
    // and --force / GE_ADMISSION_BREAK_GLASS is the recorded break-glass.
    const breakGlass = Boolean(force) || process.env.GE_ADMISSION_BREAK_GLASS === "1";
    const denied = [];
    const admitted = dirs.filter((id) => {
      const { admit, decision } = admitForHandoff(id, { force: breakGlass, log });
      if (!admit) denied.push({ id, ok: false, error: `admission denied: ${decision.blockers.map((b) => `${b.code || "?"} ${b.what}`).join("; ")}` });
      return admit;
    });
    if (!admitted.length && denied.length) {
      throw new DxError("admission gate denied every workspace in this handoff.", {
        where: "gate: promotion.gates.admission",
        why: denied[0].error,
        fix: denied.length === 1 ? `ge passport admit ${denied[0].id}` : "ge passport admit <id>",
      });
    }
    dirs = admitted;

    const conc = parseConcurrency(concurrency);
    const results = [...denied];
    await withGateway(cfg, async (url, ctx = {}) => {
      await pool(dirs, conc, async (id) => {
        try {
          const wsDir = join(LOCAL_PROJECTS, id);
          const manifest = readJson(join(wsDir, "fixtures", "manifest.json"), {});
          const pipeline = readJson(join(wsDir, "mock_systems", "pipeline.json"), {});
          const useCaseId = manifest.useCaseId || pipeline.useCaseId || id;
          const title = pipeline.name || manifest.title || id;
          const domain = pipeline.domain || manifest.department || "hr";

          // tar (pruning heavy/generated dirs) → upload to the prebuilt staging path.
          const tmp = join("/tmp", `ge-handoff-${id}.tar.gz`);
          const tar = run("tar", ["-czf", tmp, ...HANDOFF_TAR_EXCLUDES.map((dir) => `--exclude=${dir}`), "-C", wsDir, "."], { allowFail: true });
          if (!tar.ok) throw new Error(`tar failed: ${tar.err?.split("\n")[0] || "?"}`);
          const prebuiltArchive = `gs://${cfg.bucket}/prebuilt/${id}/workspace.tar.gz`;
          const cp = gcloud(["storage", "cp", tmp, prebuiltArchive], { allowFail: true });
          if (!cp.ok) throw new Error(`upload failed: ${cp.err?.split("\n")[0] || "?"}`);

          const payload = {
            title, useCaseId, workspace: id, targetStage, startStage, prebuiltArchive,
            generationSpec: { domain },
            target: remoteTarget(cfg, domain),
          };
          const res = await postJson(url, "/api/factory/usecase", payload, ctx.headers).catch((e) => ({ ok: false, text: e.message }));
          if (res.ok && res.json?.ok) { results.push({ id, ok: true, runId: res.json.runId }); log(`✓ ${id} → ${res.json.runId} (from ${startStage})`); }
          else { const error = res.json?.message || `HTTP ${res.status}: ${(res.text || "").slice(0, 120)}`; results.push({ id, ok: false, error }); log(`✗ ${id} ${error}`); }
        } catch (e) { results.push({ id, ok: false, error: e.message }); log(`✗ ${id} ${e.message}`); }
      });
    }, { noProxy, log });
    // Shadow the handoff into the durable ledger.
    await ledgerWrite((l) => l.recordRemoteSubmission({
      runId: `handoff-${new Date().toISOString().replace(/[:.]/g, "-")}`,
      mode: "remote",
      kind: "handoff",
      targetStage,
      items: results.map((r) => ({ id: r.id, useCaseId: r.id, workspaceId: r.id, error: r.ok ? null : r.error })),
    }));
    return { submitted: results.filter((r) => r.ok).length, failed: results.filter((r) => !r.ok).length, total: admitted.length + denied.length, startStage, targetStage, results };
  }

  return { provision, resumeRemote, provisionLocal, setMode, firstProof, devexCheck, syncLocal, handoff };
}
