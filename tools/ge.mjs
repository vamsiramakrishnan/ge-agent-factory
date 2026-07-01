#!/usr/bin/env bun
/**
 * ge — unified CLI for the GE Agent Factory (human surface).
 *
 * Lifecycle: set up the machine → stand up the project → run agents.
 *
 *   ge                 status board: project/app, planes ✓/○, next command
 *   ge up              stand up the platform (infra + data + tool planes) → doctor
 *   ge doctor          one report: toolchain · factory · data plane · tool plane
 *   ge agents build    build agents (cloud gateway, or --local via the harness)
 *
 * Commands are grouped by noun (infra/images/data/mcp/agents). Thin renderer over
 * tools/lib/factory-core.mjs — every command supports --json (result → stdout,
 * progress → stderr); the MCP server drives the same core for model/harness callers.
 */

import { defineCommand, runMain } from "citty";
import { parseList } from "@ge/std/list";
import pc from "picocolors";
import { spawn } from "node:child_process";
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import * as core from "./lib/factory-core.mjs";
import { daemonPaths, getDaemonStatus, startDaemonServer } from "./lib/runtime-daemon.mjs";
import { buildMissionGraph } from "./lib/mission-plan.mjs";
import { buildJourneyPlan } from "./lib/journey-plan.mjs";
import { LEGACY_STATE_PATHS, STATE_PATHS, ensureStateLayout, displayStatePath } from "./lib/state-paths.mjs";

const elog = (m) => process.stderr.write(pc.dim(`  ${m}`) + "\n");
const blog = (m) => process.stderr.write(pc.bold(m) + "\n");
const out = (line = "") => process.stdout.write(line + "\n");

// Map CLI flags → loadConfig inputs.
const cfgFrom = (a) => core.loadConfig({
  project: a.project, projectNumber: a.projectNumber, agentIdentityOrgId: a.agentIdentityOrgId, region: a.region,
  bucket: a.bucket, gatewayUrl: a.gatewayUrl, geApp: a.geApp,
});

// Shared args every command accepts.
//
// Boolean-flag convention: most toggles here (e.g. `vertex`/`no-vertex`) are real
// citty booleans — pass `--flag` for true, `--no-flag` for false. A few flags
// elsewhere in this CLI tree (and in apps/factory/scripts/factory/registry.mjs)
// are typed as strings and compared against the literal "true"/"false" (e.g.
// `--force-agent true`) for backwards compatibility with existing scripts;
// both styles are supported and neither will be removed — check a given
// command's `--help` for which style it uses.
const common = {
  json: { type: "boolean", description: "Machine-readable JSON result on stdout" },
  project: { type: "string", description: "GCP project id", alias: ["gcp-project"] },
  region: { type: "string", description: "Region (default us-central1)" },
  agentIdentityOrgId: { type: "string", description: "Organization ID for Agent Identity principalSet trust domain" },
};

// Render: --json prints the structured result; otherwise call the human renderer.
function emit(args, result, human) {
  if (args.json) { out(JSON.stringify(result, null, 2)); return; }
  human(result);
}

const ICON = { pass: pc.green("✓"), warn: pc.yellow("▲"), fail: pc.red("✗") };
const GE_CLI_PATH = fileURLToPath(import.meta.url);

function readPidFile(pidPath) {
  if (!existsSync(pidPath)) return null;
  const pid = Number(readFileSync(pidPath, "utf8").trim());
  return Number.isFinite(pid) && pid > 0 ? pid : null;
}

function processAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function processLooksLikeDaemon(pid) {
  if (!pid) return false;
  if (!existsSync(`/proc/${pid}/cmdline`)) return true;
  try {
    const cmdline = readFileSync(`/proc/${pid}/cmdline`, "utf8").replaceAll("\0", " ");
    return cmdline.includes("tools/ge.mjs") && cmdline.includes("daemon") && cmdline.includes("start") && cmdline.includes("--foreground");
  } catch {
    return false;
  }
}

async function daemonStatusSnapshot(port) {
  const paths = daemonPaths();
  try {
    return await getDaemonStatus({ port });
  } catch (e) {
    const pid = readPidFile(paths.pidPath);
    const alive = processAlive(pid) && processLooksLikeDaemon(pid);
    let meta = {};
    try {
      meta = existsSync(paths.metaPath) ? JSON.parse(readFileSync(paths.metaPath, "utf8")) : {};
    } catch {}
    return {
      ok: false,
      status: alive ? "unreachable" : "stopped",
      pid: alive ? pid : null,
      port,
      host: meta.host || "127.0.0.1",
      startedAt: meta.startedAt || null,
      dataDir: paths.dir,
      logPath: paths.logPath,
      error: e.message || String(e),
      runs: [],
    };
  }
}

function daemonPort(args = {}) {
  return Number(args.port || process.env.GE_DAEMON_PORT || daemonPaths().defaultPort);
}

async function daemonRequest(port, path, { method = "GET", body, timeoutMs = 3000 } = {}) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(timeoutMs),
  });
  let payload = null;
  try { payload = await response.json(); } catch {}
  if (!response.ok) {
    const detail = payload?.error || `${response.status} ${response.statusText}`.trim();
    throw new Error(`daemon request failed: ${detail}`);
  }
  return payload;
}

function statusText(status) {
  if (status === "done" || status === "passed" || status === "repaired") return pc.green(status);
  if (status === "running" || status === "queued" || status === "doctor_running" || status === "repairing") return pc.cyan(status);
  if (status === "failed" || status === "blocked") return pc.red(status);
  return pc.yellow(status || "unknown");
}

function parseIds(ids) {
  return parseList(String(ids || ""));
}

function renderAutopilotSummary(task) {
  const run = task.output?.run || {};
  const summary = task.summary || {};
  const counts = task.output?.counts || summary.counts || run;
  out(pc.bold(`\nAutopilot ${task.id}`));
  out(`  status    ${statusText(run.status || task.status)}`);
  out(`  target    ${pc.cyan(run.targetStage || task.input?.targetStage || summary.input?.targetStage || "preview")}`);
  out(`  mode      ${pc.dim(run.options?.mode || "<unknown>")}`);
  out(`  repair    ${run.options?.repair === false ? pc.yellow("off") : pc.green("on")}  ${pc.dim(`${run.options?.attempts ?? task.input?.attempts ?? 3} attempt(s)`)}`);
  out(`  results   ${counts.passed || 0} passed · ${counts.repaired || 0} repaired · ${counts.blocked || 0} blocked · ${counts.total || 0} total`);
  if (task.output?.reason || summary.summary) out(`  reason    ${pc.dim(task.output?.reason || summary.summary)}`);
  if (task.error) out(`  error     ${pc.red(task.error)}`);
  if ((task.output?.items || []).length) {
    out(pc.bold("\n  Items"));
    for (const item of task.output.items) {
      const blocker = item.blockers?.[0]?.id || item.blockers?.[0]?.message || "";
      out(`  ${statusText(item.status).padEnd(16)} ${String(item.agentId || item.workspaceId).padEnd(28)} ${pc.dim(blocker)}`);
    }
  }
}

function renderResumePlan(plan) {
  if (!plan) return;
  const safeToRun = plan.safeToRun ?? plan.canResume;
  out(`  resume    ${safeToRun ? pc.green(plan.nextAction) : pc.dim(plan.nextAction || "none")}`);
  if (plan.reason) out(`  reason    ${pc.dim(plan.reason)}`);
  if (plan.commands?.length) {
    out(pc.bold("\n  Resume Plan"));
    for (const command of plan.commands) out(`  ${pc.dim("$")} ${command}`);
  }
}

function missionNodeDetail(node) {
  const summary = node.summary || {};
  const artifacts = node.artifactCheck?.counts || {};
  const parts = [];
  if (summary.kind === "mock.generate") {
    if (summary.sources !== null && summary.sources !== undefined) parts.push(`${summary.sources} sources`);
    if (summary.datastores?.length) parts.push(`${summary.datastores.length} datastores`);
    if (summary.scenarioGraph?.nodes !== null && summary.scenarioGraph?.nodes !== undefined) parts.push(`${summary.scenarioGraph.nodes} graph nodes`);
    if (summary.snowfakery?.objects !== null && summary.snowfakery?.objects !== undefined) parts.push(`${summary.snowfakery.objects} objects`);
    if (summary.simulatorSeeds?.length) parts.push(`${summary.simulatorSeeds.length} simulator seeds`);
  } else if (summary.kind === "snowfakery.generate") {
    if (summary.output?.rowCount !== null && summary.output?.rowCount !== undefined) parts.push(`${summary.output.rowCount} rows`);
    if (summary.output?.csvFiles !== null && summary.output?.csvFiles !== undefined) parts.push(`${summary.output.csvFiles} csv`);
    if (summary.objects !== null && summary.objects !== undefined) parts.push(`${summary.objects} objects`);
  } else if (summary.kind === "simulator.seed") {
    if (summary.simulators?.length) parts.push(`${summary.simulators.length} simulators`);
    const collections = (summary.simulators || []).reduce((sum, simulator) => sum + Object.keys(simulator.collections || {}).length, 0);
    if (collections) parts.push(`${collections} collections`);
  } else if (summary.kind === "simulator.validate") {
    if (summary.totals?.simulators !== undefined) parts.push(`${summary.totals.simulators} simulators`);
    if (summary.totals?.errors) parts.push(pc.red(`${summary.totals.errors} errors`));
    if (summary.totals?.warnings) parts.push(pc.yellow(`${summary.totals.warnings} warnings`));
    if (summary.totals?.tools) parts.push(`${summary.totals.tools} tools`);
  } else if (node.kind === "harness.run") {
    if (node.input?.agent) parts.push(`agent ${node.input.agent}`);
    if (node.input?.stage) parts.push(`stages ${node.input.stage}`);
    if (node.childTask?.runtime?.requestedCapabilities?.length) parts.push(`${node.childTask.runtime.requestedCapabilities.length} capabilities`);
  }
  if (artifacts.total) parts.push(`${artifacts.present || 0}/${artifacts.total} artifacts`);
  const blocker = node.blockers?.[0]?.message || node.resumePlan?.blockers?.[0]?.message || "";
  if (blocker) parts.push(pc.red(blocker));
  return parts.join(pc.dim(" | "));
}

function renderMissionBrief(graph) {
  const nodes = graph.nodes || [];
  const rows = nodes.find((node) => node.id === "snowfakery.generate")?.summary?.output?.rowCount;
  const generatedObjects = nodes.find((node) => node.id === "mock.generate")?.summary?.snowfakery?.objects;
  const seeded = nodes.find((node) => node.id === "simulator.seed")?.summary?.simulators?.length;
  const validated = nodes.find((node) => node.id === "simulator.validate")?.summary?.totals;
  const blockers = nodes.flatMap((node) => (node.blockers || []).map((blocker) => ({ node: node.id, blocker })));
  if (rows === undefined && generatedObjects === undefined && seeded === undefined && !validated && !blockers.length) return;
  out(pc.bold("\n  Brief"));
  if (generatedObjects !== undefined) out(`  objects   ${generatedObjects}`);
  if (rows !== undefined) out(`  rows      ${rows}`);
  if (seeded !== undefined) out(`  seeded    ${seeded} simulator${seeded === 1 ? "" : "s"}`);
  if (validated) out(`  validate  ${validated.simulators || 0} simulators · ${validated.errors || 0} errors · ${validated.warnings || 0} warnings`);
  if (blockers.length) {
    out(`  blockers  ${blockers.length}`);
    for (const item of blockers.slice(0, 3)) out(`    ${pc.red(item.node)} ${pc.dim(item.blocker.message || item.blocker.id || "blocked")}`);
  }
}

function renderMissionGraph(graph) {
  out(pc.bold(`\nMission ${graph.id}`));
  out(`  status    ${statusText(graph.status)}`);
  out(`  target    ${pc.cyan(graph.input?.targetStage || "preview")}`);
  out(`  nodes     ${graph.counts?.done || 0} done · ${graph.counts?.blocked || 0} blocked · ${graph.counts?.pending || 0} pending · ${graph.counts?.total || 0} total`);
  if (graph.input?.executeFactory === false) out(pc.dim("  factory   represented, not auto-run"));
  renderMissionBrief(graph);
  out(pc.bold("\n  Graph"));
  for (const node of graph.nodes || []) {
    const deps = node.dependsOn?.length ? pc.dim(` ← ${node.dependsOn.join(",")}`) : "";
    const child = node.childTaskId ? pc.dim(` child=${node.childTaskId}`) : "";
    const detail = missionNodeDetail(node);
    out(`  ${statusText(node.status).padEnd(14)} ${String(node.id).padEnd(22)} ${pc.dim(node.kind || node.runtimeKind)}${deps}${child}`);
    if (detail) out(`  ${"".padEnd(14)} ${"".padEnd(22)} ${pc.dim(detail)}`);
  }
}

function renderJourneyPlan(journey) {
  out(pc.bold(`\nJourney ${journey.id}`));
  out(`  status    ${statusText(journey.status)}`);
  out(`  target    ${pc.cyan(journey.targetStage || "preview")}`);
  if (journey.input?.scenario) out(`  scenario  ${pc.cyan(journey.input.scenario)}`);
  if (journey.input?.systems?.length) out(`  systems   ${journey.input.systems.join(", ")}`);
  if (journey.input?.ids?.length) out(`  agents    ${journey.input.ids.join(", ")}`);
  if (journey.next) {
    out(pc.bold("\n  Next"));
    out(`  ${statusText(journey.next.status).padEnd(14)} ${String(journey.next.label).padEnd(18)} ${pc.dim(journey.next.owner || "runtime")}`);
    if (journey.next.blocker?.message) out(`  blocker   ${pc.red(journey.next.blocker.message)}`);
    if (journey.next.actionPlan?.label) out(`  action    ${journey.next.actionPlan.label}`);
    for (const command of journey.next.actionPlan?.commands || []) out(`  ${pc.dim("$")} ${command}`);
  }
  out(pc.bold("\n  Pipeline"));
  for (const stage of journey.stages || []) {
    const command = stage.actionPlan?.commands?.[0] ? pc.dim(` · ${stage.actionPlan.commands[0]}`) : "";
    const blocker = stage.blocker?.message ? pc.red(` · ${stage.blocker.message}`) : "";
    const task = stage.taskId ? pc.dim(` · ${stage.taskId}`) : "";
    out(`  ${statusText(stage.status).padEnd(14)} ${String(stage.label).padEnd(18)} ${pc.dim(stage.owner || "")}${task}${blocker}${command}`);
  }
}

// Render one checks[] section (shared by data/mcp/section doctors).
function renderChecks(checks, pad = 22) {
  for (const ch of checks) {
    out(`${ICON[ch.status]} ${ch.name.padEnd(pad)} ${pc.dim(ch.detail)}`);
    if (ch.status !== "pass" && ch.fix) out(`    ${pc.dim("fix:")} ${ch.fix}`);
  }
}

// ── leaf commands (defined once; reused by noun groups + aliases) ─────────────

const init = defineCommand({
  meta: { name: "init", description: "Discover config (terraform outputs → gcloud) → .ge.json" },
  args: { ...common },
  async run({ args }) {
    const res = await core.init(cfgFrom(args), { log: elog });
    emit(args, res, (cfg) => {
      out(pc.bold(`Wrote .ge.json — ${pc.cyan(cfg.project)}`));
      for (const [k, v] of Object.entries(cfg)) out(`  ${k.padEnd(16)} ${v ? pc.green(typeof v === "object" ? JSON.stringify(v) : v) : pc.yellow("<unset>")}`);
      if (!cfg.geAppId) out(pc.yellow("\n⚠ geAppId unset — set GEMINI_ENTERPRISE_APP_ID before provisioning."));
    });
  },
});

const imagesBuild = defineCommand({
  meta: { name: "build", description: "Build images: no arg = gateway+worker; 'builder' = shared toolchain image" },
  args: { ...common, target: { type: "positional", required: false } },
  run({ args }) {
    const res = core.build(cfgFrom(args), { target: args.target, log: elog });
    emit(args, res, (r) => out(pc.green("✓ built: " + Object.values(r).join(", "))));
  },
});

const imagesDeploy = defineCommand({
  meta: { name: "deploy", description: "Build gateway/worker images + bind via terraform (Terraform owns Cloud Run config)" },
  args: { ...common, target: { type: "positional", required: false, description: "gateway|worker|all (advisory; terraform apply reconciles the whole module)" } },
  run({ args }) {
    const res = core.deploy(cfgFrom(args), { target: args.target || "all", log: elog });
    emit(args, res, (r) => {
      out(pc.green(`✓ deployed: ${r.deployed.join(", ")}`));
      out(pc.dim(`  images: ${r.gatewayImage} · ${r.workerImage}  (CPU/memory/env/IAM are Terraform-owned)`));
    });
  },
});

// Effective mode: --remote/--local override the persisted cfg.mode.
const modeOf = (args, cfg) => (args.remote ? "remote" : args.local ? "local" : cfg.mode || "remote");
// Local "build boundary": the last pre-cloud harness stage. Local builds stop here.
const LOCAL_BUILD_BOUNDARY = "previewed";

const agentsBuild = defineCommand({
  meta: { name: "build", description: "Build agents. Uses the active mode (ge mode); --local/--remote override" },
  args: { ...common, canary: { type: "boolean" }, all: { type: "boolean" }, dept: { type: "string" }, ids: { type: "string" }, concurrency: { type: "string" }, force: { type: "boolean" }, "no-proxy": { type: "boolean" }, local: { type: "boolean", description: "Override: run on this machine via the harness" }, remote: { type: "boolean", description: "Override: submit to the cloud factory" }, limit: { type: "string" }, target: { type: "string", description: `Harness target (local; default ${LOCAL_BUILD_BOUNDARY})` }, vertex: { type: "boolean", description: "Use Vertex for local harness review/preview stages (default true)" }, "no-vertex": { type: "boolean", description: "Disable Vertex-backed harness stages (negates --vertex; same as --vertex=false)" }, location: { type: "string", description: "Vertex/GenAI location for local harness stages" }, model: { type: "string", description: "Model for harness review/refine + generated agents (local and remote)" }, "max-output-tokens": { type: "string", description: "Override generated-agent max_output_tokens (local and remote); default unset = model default" }, "no-refine": { type: "boolean", description: "Skip the cloud Antigravity refine stage (REFINE=0)" }, warm: { type: "boolean", description: "Pre-warm the shared uv cache before running (local)" } },
  async run({ args }) {
    const cfg = cfgFrom(args);
    const scope = args.canary ? "canary" : args.all ? "all" : undefined;
    if (modeOf(args, cfg) === "local") {
      const target = args.target || LOCAL_BUILD_BOUNDARY; // stop at the build boundary by default
      const vertex = args.vertex === false || args["no-vertex"] === true ? false : true;
      const res = await core.provisionLocal(cfg, { scope, ids: args.ids, dept: args.dept, limit: args.limit, target, vertex, location: args.location, model: args.model, maxOutputTokens: args["max-output-tokens"], warm: args.warm, force: args.force, log: elog });
      emit(args, res, (r) => {
        out(pc.green(`\n✓ local build → ${r.target} (build boundary). Workspaces in ${r.projectsDir}.`));
        if (r.selected) out(pc.dim(`  selected: ${r.selected}`));
        if (r.plan) out(pc.dim(`  plan: ${r.plan}`));
        if (r.run) out(pc.dim(`  run: ${r.run}`));
        if (r.events) out(pc.dim(`  events: ${r.events}`));
        out(pc.dim("  next: ge agents ship   (cloud: load_data→deploy→register→publish)   ·   ge agents sync --push   (push code)"));
      });
      return;
    }
    const refine = !args["no-refine"] && process.env.REFINE !== "0";
    const res = await core.provision(cfg, { scope, ids: args.ids, dept: args.dept, concurrency: args.concurrency || "2", force: args.force, noProxy: args["no-proxy"], refine, model: args.model, maxOutputTokens: args["max-output-tokens"], log: elog });
    emit(args, res, (r) => out(`\nSubmitted ${pc.green(r.submitted)}  failed ${r.failed ? pc.red(r.failed) : "0"}${r.note ? pc.dim("  " + r.note) : ""}`));
  },
});

const agentsStatus = defineCommand({
  meta: { name: "status", description: "Poll submitted runs (stage tally)" },
  args: { ...common, watch: { type: "boolean" }, "no-proxy": { type: "boolean" } },
  async run({ args }) {
    const render = (r) => {
      if (args.json) return;
      process.stdout.write("\x1bc");
      out(pc.bold(`Status — ${r.total} runs  ${new Date().toISOString()}`));
      out(`  ${pc.green("done")} ${r.tally.done}   ${pc.cyan("running")} ${r.tally.running}   ${pc.yellow("queued")} ${r.tally.queued}   ${pc.red("failed")} ${r.tally.failed}   unknown ${r.tally.unknown}`);
      out(pc.dim("  by stage: " + Object.entries(r.stages).map(([k, v]) => `${k}:${v}`).join("  ")));
    };
    if (args.watch && !args.json) {
      for (;;) { const r = await core.status(cfgFrom(args), { noProxy: args["no-proxy"] }); render(r); if (r.terminal) { out(pc.green("\nAll runs terminal.")); break; } await new Promise((s) => setTimeout(s, 15000)); }
      return;
    }
    const res = await core.status(cfgFrom(args), { noProxy: args["no-proxy"] });
    emit(args, res, render);
  },
});

const agentsFleet = defineCommand({
  meta: { name: "fleet", description: "Show fleet pipeline health, bottlenecks, and repair owners" },
  args: { ...common, limit: { type: "string" } },
  async run({ args }) {
    const res = await core.fleetStatus(cfgFrom(args));
    emit(args, res, (r) => {
      const health = r.health || {};
      out(pc.bold(`\nFleet Health — ${r.total} agents`));
      out(`  ${pc.red("blocked")} ${health.blocked || 0}   ${pc.yellow("repairable")} ${health.repairable || 0}`);
      if (health.byStage) {
        out(pc.dim("\n  by stage"));
        for (const stage of health.stages || Object.keys(health.byStage)) {
          out(`  ${String(stage).padEnd(12)} ${health.byStage[stage] || 0}`);
        }
      }
      if (health.byOwner) {
        out(pc.dim("\n  by owner"));
        for (const [owner, count] of Object.entries(health.byOwner).sort((a, b) => b[1] - a[1])) {
          out(`  ${String(owner).padEnd(12)} ${count}`);
        }
      }
      const bottlenecks = (health.bottlenecks || []).slice(0, Number(args.limit || 8));
      if (bottlenecks.length) {
        out(pc.dim("\n  top bottlenecks"));
        for (const item of bottlenecks) {
          out(`  ${pc.yellow(String(item.count).padStart(3))} ${String(item.stage).padEnd(10)} ${pc.cyan(item.blockerId)} ${pc.dim(item.message)}`);
          if (item.actionPlan?.commands?.[0]) out(pc.dim(`      action: ${item.actionPlan.label} · ${item.actionPlan.commands[0]}`));
          if (item.agentIds?.length) out(pc.dim(`      ${item.agentIds.join(", ")}`));
        }
      }
      out(pc.dim("\n  next: ge runtime start autopilot --ids <comma-ids> --stage preview"));
    });
  },
});

const agentsLogs = defineCommand({
  meta: { name: "logs", description: "Pretty-print a stage's result + errors" },
  args: { ...common, runId: { type: "positional", required: true }, stage: { type: "string" }, item: { type: "string" } },
  run({ args }) {
    const res = core.logs(cfgFrom(args), { runId: args.runId, stage: args.stage || "validate", item: args.item });
    emit(args, res, (r) => {
      if (!r.found) { out(pc.yellow(`no result at ${r.uri}`)); r.available?.forEach((l) => out(pc.dim("  " + l))); return; }
      const x = r.result; if (!x) { out(r.raw || ""); return; }
      out(`\nstage ${pc.cyan(x.stage)}  status ${x.status === "failed" ? pc.red(x.status) : pc.green(x.status)}`);
      if (x.error) out(`error: ${pc.red(x.error)}`);
      for (const o of x.outputs || []) if (o.code !== 0 || (o.stderr || "").trim()) {
        out(pc.dim(`\n$ ${o.cmd} ${(o.args || []).join(" ")}  (exit ${o.code})`));
        if (o.stderr) out(o.stderr.slice(-3000));
        if (o.stdout && o.code !== 0) out(pc.dim(o.stdout.slice(-1500)));
      }
      if (x.logUrl) out(`\nCloud Build log: ${pc.cyan(x.logUrl)}`);
    });
  },
});

const agentsSync = defineCommand({
  meta: { name: "sync", description: "Generated agent code → generated-agents/ → git (cloud: GCS; --local: harness workspaces)" },
  args: { ...common, ids: { type: "string", description: "Comma-separated agent/workspace ids (default: all syncable workspaces)" }, push: { type: "boolean" }, force: { type: "boolean" }, "no-commit": { type: "boolean" }, local: { type: "boolean", description: "Override: sync locally-generated workspaces" }, "remote-mode": { type: "boolean", description: "Override: pull from GCS (cloud mode)" }, remote: { type: "string", description: "Push to a specific git remote/URL (the repo the agent code must sit in)" }, create: { type: "boolean", description: "Create the Cloud Source repo if it doesn't exist (local mode)" } },
  async run({ args }) {
    const cfg = cfgFrom(args);
    const mode = args["remote-mode"] ? "remote" : args.local ? "local" : cfg.mode || "remote";
    if (mode === "local") {
      const res = core.syncLocal(cfg, { ids: args.ids, remote: args.remote, commit: !args["no-commit"], push: args.push, create: args.create, log: elog });
      emit(args, res, (r) => out(`\nSynced ${pc.green(r.synced)} local workspace(s)${r.repo ? pc.dim(" → " + r.repo) : ""}${r.pushed ? pc.dim(" (pushed)") : ""}`));
      return;
    }
    const res = await core.sync(cfgFrom(args), { ids: args.ids, force: args.force, commit: !args["no-commit"], push: args.push, log: elog });
    emit(args, res, (r) => out(`\nSynced ${pc.green(r.synced)}  failed ${r.failed}${r.committed ? pc.dim("  (committed)") : ""}${r.pushed ? pc.dim(" (pushed)") : ""}`));
  },
});

const agentsShip = defineCommand({
  meta: { name: "ship", description: "Hand off locally-built agents to the cloud: upload + run deploy→register→publish remotely" },
  args: { ...common, ids: { type: "string", description: "Comma-separated local workspace ids (default: all built locally)" }, "start-stage": { type: "string", description: "Stage to start at remotely (default load_data)" }, "target-stage": { type: "string", description: "Stage to stop at (default publish_enterprise)" }, concurrency: { type: "string" }, "no-proxy": { type: "boolean" } },
  async run({ args }) {
    const res = await core.ship(cfgFrom(args), { ids: args.ids, startStage: args["start-stage"] || "load_data", targetStage: args["target-stage"] || "publish_enterprise", concurrency: args.concurrency || "2", noProxy: args["no-proxy"], log: elog });
    emit(args, res, (r) => out(`\nShipped ${pc.green(r.submitted)}  failed ${r.failed ? pc.red(r.failed) : "0"}  ${pc.dim(`(${r.startStage} → ${r.targetStage}, remote)`)}`));
  },
});

const infra = defineCommand({
  meta: { name: "infra", description: "Drive the terraform module (init|plan|apply|output|destroy)" },
  args: { ...common, sub: { type: "positional", required: true }, gatewayImage: { type: "string" }, workerImage: { type: "string" }, yes: { type: "boolean" } },
  run({ args }) {
    const res = core.infra(cfgFrom(args), { sub: args.sub, gatewayImage: args.gatewayImage, workerImage: args.workerImage, yes: args.yes, log: elog });
    emit(args, res, (r) => { if (r.outputs) out(JSON.stringify(r.outputs, null, 2)); else out(pc.green(`✓ terraform ${r.sub}`)); });
  },
});

const dataUp = defineCommand({
  meta: { name: "up", description: "Provision the shared data stores (terraform apply) → merge coords into .ge.json" },
  args: { ...common },
  async run({ args }) {
    const res = await core.dataUp(cfgFrom(args), { log: blog });
    emit(args, res, (r) => {
      out(pc.green("\n✓ data plane applied. Coordinates written to .ge.json:"));
      for (const [k, v] of Object.entries(r.data)) out(`  ${k.padEnd(18)} ${v ? pc.green(v) : pc.yellow("<unset>")}`);
    });
  },
});

const dataDoctorCmd = defineCommand({
  meta: { name: "doctor", description: "Check the shared data stores (bucket, AlloyDB DSN secret, Bigtable, BigQuery)" },
  args: { ...common },
  run({ args }) {
    const res = core.dataDoctor(cfgFrom(args));
    emit(args, res, (r) => { out(pc.bold(`\nData doctor — ${r.project} (${r.region})\n`)); renderChecks(r.checks); out(r.fails === 0 ? pc.green("\nAll hard checks passed.") : pc.red(`\n${r.fails} hard failure(s).`)); });
  },
});

const mcpDeployCmd = defineCommand({
  meta: { name: "deploy", description: "Deploy the per-department custom MCP services to Cloud Run (fleet-level)" },
  args: { ...common },
  run({ args }) {
    const res = core.mcpDeploy(cfgFrom(args), { log: blog });
    emit(args, res, (r) => { out(pc.green("\n✓ MCP services deployed:")); for (const [dept, url] of Object.entries(r.services)) out(`  ${dept.padEnd(12)} ${pc.green(url)}`); });
  },
});

const mcpDoctorCmd = defineCommand({
  meta: { name: "doctor", description: "Check the per-department MCP services + Agent Registry readiness" },
  args: { ...common },
  run({ args }) {
    const res = core.mcpDoctor(cfgFrom(args));
    emit(args, res, (r) => { out(pc.bold(`\nMCP doctor — ${r.project} (${r.region})\n`)); renderChecks(r.checks); out(r.fails === 0 ? pc.green("\nAll hard checks passed.") : pc.red(`\n${r.fails} hard failure(s).`)); });
  },
});

const cutover = defineCommand({
  meta: { name: "cutover", description: "Adopt a hand-managed project into Terraform (plan by default; --apply to run)" },
  args: { ...common, apply: { type: "boolean", description: "Execute the steps (default: print the plan)" } },
  async run({ args }) {
    const res = await core.cutover(cfgFrom(args), { apply: args.apply, log: (m) => process.stderr.write(pc.dim(`  ${m}`) + "\n") });
    emit(args, res, (r) => {
      if (r.mode === "plan") {
        out(pc.bold(`\nCutover (Terraform adopt) — ${r.project}`));
        out(pc.dim("  import blocks written:"));
        for (const im of r.imports) out(`  ${pc.dim("•")} ${im.to} ${pc.dim("← " + im.id)}`);
        out(pc.yellow("\n" + r.note));
      } else {
        out(pc.green(`\n✓ cutover applied (terraform) — ${r.health.fails} doctor failure(s).`));
      }
    });
  },
});

const mode = defineCommand({
  meta: { name: "mode", description: "Show or set the operating mode: local (build on this machine) | remote (cloud factory)" },
  args: { ...common, set: { type: "positional", required: false, description: "local | remote" } },
  run({ args }) {
    if (args.set) {
      const res = core.setMode(args.set);
      emit(args, res, (r) => out(pc.green(`✓ mode = ${pc.bold(r.mode)}`)));
      return;
    }
    const cfg = cfgFrom(args);
    const res = { mode: cfg.mode || "remote" };
    emit(args, res, (r) => {
      out(pc.bold(`\nmode: ${pc.cyan(r.mode)}`));
      out(r.mode === "local"
        ? pc.dim("  this machine runs generate → validate (build boundary); deploy/register/publish are cloud steps.")
        : pc.dim("  this machine submits + observes; the cloud factory builds, deploys, and publishes."));
      out(pc.dim("  set with: ge mode local | ge mode remote"));
    });
  },
});

const devexSmoke = defineCommand({
  meta: { name: "smoke", description: "One-command local DevEx proof: doctor → local mode → canary workspace manifest" },
  args: {
    ...common,
    id: { type: "string", description: "Use-case id to build (default: catalog canary)" },
    target: { type: "string", description: "Local harness target (default validated; use previewed for full build boundary)" },
    preview: { type: "boolean", description: "Shortcut for --target previewed (may require project/Vertex auth)" },
    vertex: { type: "boolean", description: "Use Vertex-backed harness stages when target reaches them" },
    "no-vertex": { type: "boolean", description: "Disable Vertex-backed harness stages" },
    warm: { type: "boolean", description: "Pre-warm the shared uv cache before running" },
    force: { type: "boolean", description: "Regenerate matching local workspace(s) from scratch" },
  },
  async run({ args }) {
    const vertex = args["no-vertex"] ? false : args.preview ? true : !!args.vertex;
    const res = await core.devexSmoke(cfgFrom(args), {
      id: args.id,
      target: args.target || "validated",
      preview: args.preview,
      vertex,
      warm: args.warm,
      force: args.force,
      log: elog,
    });
    emit(args, res, (r) => {
      out(pc.bold("\nDevEx Smoke"));
      if (!r.ok) {
        out(pc.red(`  blocked at ${r.stage || "unknown"}`));
        for (const check of r.doctor?.checks || []) {
          if (check.status === "pass") continue;
          out(`  ${ICON[check.status]} ${check.name.padEnd(30)} ${pc.dim(check.detail)}`);
          if (check.fix) out(`      ${pc.dim("fix:")} ${check.fix}`);
        }
        out(pc.dim(`\n  next: ${r.next || "make setup"}`));
        return;
      }
      out(pc.green(`  passed → ${r.target}`));
      if (r.workspace) {
        out(`  workspace ${pc.cyan(r.workspace.id)} ${pc.dim(r.workspace.path)}`);
        if (r.workspace.manifest) out(`  manifest  ${pc.dim(r.workspace.manifest)}`);
        if (r.workspace.evalConfig) out(`  eval      ${pc.dim(r.workspace.evalConfig)}`);
      }
      if (r.build?.run) out(`  run       ${pc.dim(r.build.run)}`);
      if (r.next?.length) {
        out(pc.bold("\n  Next"));
        for (const command of r.next.slice(0, 4)) out(`  ${pc.dim("$")} ${command}`);
      }
    });
    if (!res.ok) process.exitCode = 1;
  },
});

const devexCheck = defineCommand({
  meta: { name: "check", description: "Fast DevEx gate: local doctor, docs links, and workspace manifest contracts" },
  args: {
    ...common,
    id: { type: "string", description: "Workspace or use-case id to check (default: generated use-case workspaces)" },
    "all-workspaces": { type: "boolean", description: "Also check scratch/test workspaces without a use-case id" },
    "no-docs": { type: "boolean", description: "Skip local docs link checks" },
    "no-local": { type: "boolean", description: "Skip local toolchain doctor checks" },
    "no-strict-workspaces": { type: "boolean", description: "Warn instead of fail on missing generated workspace files" },
  },
  run({ args }) {
    const res = core.devexCheck(cfgFrom(args), {
      ids: args.id || "",
      allWorkspaces: args["all-workspaces"],
      strictWorkspaces: !args["no-strict-workspaces"],
      docs: !args["no-docs"],
      local: !args["no-local"],
    });
    emit(args, res, (r) => {
      out(pc.bold("\nDevEx Check"));
      out(r.ok ? pc.green("  passed") : pc.red("  failed"));

      if (r.doctor) {
        out(pc.bold("\n  Local Doctor"));
        const notable = r.doctor.checks.filter((check) => check.status !== "pass");
        if (!notable.length) out(pc.green("  ✓ all hard local checks passed"));
        for (const check of notable) {
          out(`  ${ICON[check.status]} ${check.name.padEnd(30)} ${pc.dim(check.detail)}`);
          if (check.fix) out(`      ${pc.dim("fix:")} ${check.fix}`);
        }
      }

      if (r.docs) {
        out(pc.bold("\n  Docs"));
        out(`  ${r.docs.ok ? ICON.pass : ICON.fail} ${r.docs.summary}`);
        for (const finding of (r.docs.findings || []).slice(0, 8)) out(`      ${finding.path} ${pc.dim(finding.link)}`);
        if ((r.docs.findings || []).length > 8) out(pc.dim(`      ...${r.docs.findings.length - 8} more`));
      }

      out(pc.bold("\n  Workspace Contracts"));
      out(`  checked ${r.workspaces.checked} · failed ${r.workspaces.failed} · warnings ${r.workspaces.warnings}`);
      for (const workspace of r.workspaces.items.filter((item) => !item.ok || item.warnings).slice(0, 8)) {
        out(`  ${workspace.ok ? ICON.warn : ICON.fail} ${workspace.id} ${pc.dim(workspace.path)}`);
        for (const check of workspace.checks.filter((item) => item.status !== "pass").slice(0, 5)) {
          out(`      ${ICON[check.status]} ${check.name.padEnd(24)} ${pc.dim(check.detail)}`);
          if (check.fix) out(`        ${pc.dim("fix:")} ${check.fix}`);
        }
      }

      if (r.next?.length) {
        out(pc.bold("\n  Next"));
        for (const command of r.next) out(`  ${pc.dim("$")} ${command}`);
      }
    });
    if (!res.ok) process.exitCode = 1;
  },
});

const devex = defineCommand({
  meta: { name: "devex", description: "Developer-experience checks and one-command local smoke paths" },
  subCommands: { check: devexCheck, smoke: devexSmoke },
});

// ── polish: status board · full up · unified doctor ───────────────────────────

const doctor = defineCommand({
  meta: { name: "doctor", description: "Unified health: toolchain · factory · data plane · tool plane (--local/--cloud/--data/--mcp to filter). Narrower scoped checks: `ge data doctor` (data plane only), `ge mcp doctor` (tool plane / MCP services only)." },
  args: { ...common, local: { type: "boolean", description: "Include the uv toolchain section" }, cloud: { type: "boolean", description: "Only the factory section" }, data: { type: "boolean", description: "Only the data plane section" }, mcp: { type: "boolean", description: "Only the tool plane section" }, command: { type: "string", description: "Check readiness for a mutating command (up|data.up|mcp.deploy|agents.build|agents.build.local|agents.ship|agents.sync)" } },
  run({ args }) {
    const cfg = cfgFrom(args);
    const anyFilter = args.local || args.cloud || args.data || args.mcp;
    // Default sections follow the active mode: local → toolchain-first; remote → factory-first.
    // Data + tool plane are shared infra, shown in both.
    const opts = anyFilter
      ? { local: !!args.local, cloud: !!args.cloud, data: !!args.data, mcp: !!args.mcp, command: args.command }
      : (cfg.mode === "local"
          ? { local: true, cloud: false, data: true, mcp: true, command: args.command }
          : { local: false, cloud: true, data: true, mcp: true, command: args.command });
    const res = core.doctorAll(cfg, opts);
    emit(args, res, (r) => {
      out(pc.bold(`\nDoctor — ${r.project || "(no project)"} (${r.region})`));
      for (const s of r.sections) {
        out(pc.bold(`\n  ${s.name}` + (s.fails ? pc.red(`  (${s.fails} fail)`) : pc.green("  ✓")) ));
        for (const ch of s.checks) {
          out(`  ${ICON[ch.status]} ${ch.name.padEnd(30)} ${pc.dim(ch.detail)}`);
          if (ch.status !== "pass" && ch.fix) out(`      ${pc.dim("fix:")} ${ch.fix}`);
        }
      }
      out(r.fails === 0 ? pc.green("\nAll hard checks passed.") : pc.red(`\n${r.fails} hard failure(s).`));
    });
  },
});

const up = defineCommand({
  meta: { name: "up", description: "Stand up the platform: infra + data + tool planes → unified doctor (--infra/--data/--mcp for one)" },
  args: { ...common, infra: { type: "boolean" }, data: { type: "boolean" }, mcp: { type: "boolean" } },
  async run({ args }) {
    const any = args.infra || args.data || args.mcp;
    const planes = any ? ["infra", "data", "mcp"].filter((p) => args[p]) : ["infra", "data", "mcp"];
    const res = await core.up(cfgFrom(args), { planes, log: blog });
    emit(args, res, (r) => {
      out(pc.green(`\n✓ up: ${r.planes.join(" + ")} — ${r.health.fails} doctor failure(s).`));
      out(pc.dim("Next: ge agents build --canary"));
    });
  },
});

const configExplain = defineCommand({
  meta: { name: "explain", description: "Show each config value and where it came from (flag · env · .ge.json · default)" },
  args: { ...common, projectNumber: { type: "string" }, gatewayUrl: { type: "string" }, geApp: { type: "string" }, mode: { type: "string" }, agentsRepo: { type: "string" }, bucket: { type: "string" } },
  run({ args }) {
    const res = core.explainLoadedConfig({
      project: args.project, projectNumber: args.projectNumber, agentIdentityOrgId: args.agentIdentityOrgId, region: args.region,
      bucket: args.bucket, gatewayUrl: args.gatewayUrl, geApp: args.geApp, mode: args.mode, agentsRepo: args.agentsRepo,
    });
    emit(args, res, (r) => {
      out(pc.bold("\nConfig (value ← source)"));
      for (const [name, field] of Object.entries(r)) {
        if (name === "_note") continue;
        const { value, source } = field;
        const v = value === undefined || value === "" ? pc.yellow("<unset>") : pc.cyan(String(value));
        out(`  ${name.padEnd(16)} ${v}  ${pc.dim("← " + source)}`);
      }
      if (r._note) out(pc.yellow(`\n  ⚠ ${r._note}`));
      out(pc.dim("\n  precedence: flag → env → .ge.json → default"));
    });
  },
});

// ── noun groups ───────────────────────────────────────────────────────────────
const config = defineCommand({ meta: { name: "config", description: "Operator config: explain (precedence/sources)" }, subCommands: { explain: configExplain } });
const images = defineCommand({ meta: { name: "images", description: "Gateway/worker images: build · deploy" }, subCommands: { build: imagesBuild, deploy: imagesDeploy } });
const data = defineCommand({ meta: { name: "data", description: "Data plane (GCS/BigQuery/AlloyDB/Bigtable/Firestore): up · doctor" }, subCommands: { up: dataUp, doctor: dataDoctorCmd } });
const mcp = defineCommand({ meta: { name: "mcp", description: "Tool plane (per-department custom MCP services): deploy · doctor" }, subCommands: { deploy: mcpDeployCmd, doctor: mcpDoctorCmd } });
const agents = defineCommand({ meta: { name: "agents", description: "Agent lifecycle: build · ship · status · fleet · logs · sync" }, subCommands: { build: agentsBuild, ship: agentsShip, status: agentsStatus, fleet: agentsFleet, logs: agentsLogs, sync: agentsSync } });

const autopilotRun = defineCommand({
  meta: { name: "run", description: "Start daemon-native Autopilot convergence" },
  args: {
    ...common,
    ids: { type: "string", description: "Comma-separated agent/workspace ids (default: current Autopilot queue)" },
    "target-stage": { type: "string", description: "Gate to converge to (default preview)" },
    "no-repair": { type: "boolean", description: "Observe blockers without running repair" },
    attempts: { type: "string", description: "Repair attempts per item (default 3)" },
    "run-preview": { type: "boolean", description: "Run preview after repair when supported" },
    port: { type: "string", description: "Daemon port (default 17654)" },
  },
  async run({ args }) {
    const port = daemonPort(args);
    const daemon = await daemonStatusSnapshot(port);
    if (!daemon.ok) throw new Error(`ge daemon is ${daemon.status || "stopped"}; run: ge daemon start`);
    const targetStage = args["target-stage"] || "preview";
    const attempts = Number(args.attempts || 3);
    const task = await daemonRequest(port, "/api/tasks", {
      method: "POST",
      timeoutMs: 10000,
      body: {
        kind: "autopilot.run",
        ids: parseIds(args.ids),
        targetStage,
        repair: !args["no-repair"],
        attempts: Number.isFinite(attempts) && attempts > 0 ? attempts : 3,
        runPreview: !!args["run-preview"],
        query: {
          project: args.project,
          region: args.region,
          agentIdentityOrgId: args.agentIdentityOrgId,
        },
      },
    });
    emit(args, task, (t) => {
      renderAutopilotSummary(t);
      out(pc.dim(`\n  watch: ge autopilot status ${t.id}`));
      out(pc.dim(`  events: ge autopilot events ${t.id}`));
    });
  },
});

const autopilotStatus = defineCommand({
  meta: { name: "status", description: "Show one Autopilot run, or list recent daemon-native Autopilot runs" },
  args: {
    id: { type: "positional", required: false },
    json: { type: "boolean", description: "Machine-readable JSON result on stdout" },
    port: { type: "string", description: "Daemon port (default 17654)" },
    limit: { type: "string", description: "Recent Autopilot run count when no id is provided" },
  },
  async run({ args }) {
    const port = daemonPort(args);
    const daemon = await daemonStatusSnapshot(port);
    if (!daemon.ok) throw new Error(`ge daemon is ${daemon.status || "stopped"}; run: ge daemon start`);
    if (args.id) {
      const task = await daemonRequest(port, `/api/tasks/${encodeURIComponent(args.id)}`, { timeoutMs: 3000 });
      emit(args, task, renderAutopilotSummary);
      return;
    }
    const body = await daemonRequest(port, `/api/tasks?limit=${encodeURIComponent(args.limit || "50")}`, { timeoutMs: 3000 });
    const tasks = (body.tasks || []).filter((task) => task.kind === "autopilot.run");
    emit(args, { tasks, daemon: { ok: daemon.ok, port, pid: daemon.pid || null } }, (r) => {
      out(pc.bold("\nAutopilot Runs"));
      out(`  daemon    ${pc.green("healthy")}  ${pc.dim(`http://127.0.0.1:${port}`)}`);
      if (!r.tasks.length) {
        out(pc.dim("  no recent Autopilot runs"));
        return;
      }
      for (const task of r.tasks.slice(0, Math.max(1, Math.min(Number(args.limit) || 20, 200)))) {
        const run = task.output?.run || {};
        const counts = task.output?.counts || task.counts || run;
        out(`  ${statusText(run.status || task.status).padEnd(14)} ${String(task.id).padEnd(30)} ${pc.dim(run.targetStage || task.input?.targetStage || "preview")} ${counts.passed || 0}/${counts.repaired || 0}/${counts.blocked || 0}/${counts.total || 0}`);
      }
    });
  },
});

const autopilotEvents = defineCommand({
  meta: { name: "events", description: "Show daemon-native Autopilot task events" },
  args: {
    id: { type: "positional", required: true },
    json: { type: "boolean", description: "Machine-readable JSON result on stdout" },
    port: { type: "string", description: "Daemon port (default 17654)" },
  },
  async run({ args }) {
    const port = daemonPort(args);
    const daemon = await daemonStatusSnapshot(port);
    if (!daemon.ok) throw new Error(`ge daemon is ${daemon.status || "stopped"}; run: ge daemon start`);
    const body = await daemonRequest(port, `/api/tasks/${encodeURIComponent(args.id)}/events?format=json`, { timeoutMs: 5000 });
    emit(args, body, (r) => {
      out(pc.bold(`\nAutopilot Events ${args.id}`));
      if (!r.events?.length) {
        out(pc.dim("  no events"));
        return;
      }
      for (const wrapped of r.events) {
        const ev = wrapped.event || wrapped;
        const level = ev.level === "error" ? pc.red(ev.type) : ev.level === "warn" ? pc.yellow(ev.type) : pc.cyan(ev.type);
        const agent = ev.agentId ? pc.dim(`${ev.agentId} `) : "";
        out(`  ${String(wrapped.seq || "").padStart(4)} ${level.padEnd(24)} ${agent}${ev.line || ""}`);
      }
    });
  },
});

const autopilot = defineCommand({
  meta: { name: "autopilot", description: "Daemon-native Autopilot: run · status · events" },
  subCommands: { run: autopilotRun, status: autopilotStatus, events: autopilotEvents },
});

const missionPlanCmd = defineCommand({
  meta: { name: "plan", description: "Build a mission graph DAG without running it" },
  args: {
    ...common,
    ids: { type: "string", description: "Comma-separated agent/workspace ids" },
    scenario: { type: "string", description: "Scenario/use-case id for data and simulator graph nodes" },
    workspace: { type: "string", description: "Scenario workspace path (default .ge/missions/<scenario>)" },
    systems: { type: "string", description: "Comma-separated simulator system ids to validate" },
    "target-stage": { type: "string", description: "Target convergence stage (default preview)" },
    attempts: { type: "string" },
    "run-preview": { type: "boolean" },
    "with-factory": { type: "boolean", description: "Include factory build as an auto-run node" },
    "no-antigravity": { type: "boolean", description: "Do not include the Antigravity spec/data review node" },
    "harness-agent": { type: "string", description: "Harness agent for mission review node (default antigravity-sdk)" },
    model: { type: "string", description: "Model for the Antigravity mission review node" },
    location: { type: "string", description: "Location for the Antigravity mission review node" },
  },
  run({ args }) {
    const cfg = cfgFrom(args);
    const graph = buildMissionGraph({
      mode: cfg.mode || "local",
      ids: parseIds(args.ids),
      scenario: args.scenario,
      workspace: args.workspace,
      systems: parseIds(args.systems),
      targetStage: args["target-stage"] || "preview",
      attempts: Number(args.attempts || 3),
      runPreview: !!args["run-preview"],
      query: {
        project: args.project,
        region: args.region,
        location: args.location,
        model: args.model,
        agentIdentityOrgId: args.agentIdentityOrgId,
      },
      executeFactory: !!args["with-factory"],
      useAntigravity: !args["no-antigravity"],
      harnessAgent: args["harness-agent"] || "antigravity-sdk",
      harnessModel: args.model || "gemini-3.5-flash",
      harnessLocation: args.location || "global",
    });
    emit(args, graph, renderMissionGraph);
  },
});

const missionRunCmd = defineCommand({
  meta: { name: "run", description: "Run a mission graph as daemon child runtime tasks" },
  args: {
    ...common,
    ids: { type: "string", description: "Comma-separated agent/workspace ids" },
    scenario: { type: "string", description: "Scenario/use-case id for data and simulator graph nodes" },
    workspace: { type: "string", description: "Scenario workspace path (default .ge/missions/<scenario>)" },
    systems: { type: "string", description: "Comma-separated simulator system ids to validate" },
    "target-stage": { type: "string", description: "Target convergence stage (default preview)" },
    attempts: { type: "string" },
    "run-preview": { type: "boolean" },
    "with-factory": { type: "boolean", description: "Actually schedule the factory build node" },
    "no-antigravity": { type: "boolean", description: "Do not include the Antigravity spec/data review node" },
    "harness-agent": { type: "string", description: "Harness agent for mission review node (default antigravity-sdk)" },
    model: { type: "string", description: "Model for the Antigravity mission review node" },
    location: { type: "string", description: "Location for the Antigravity mission review node" },
    port: { type: "string", description: "Daemon port (default 17654)" },
  },
  async run({ args }) {
    const port = daemonPort(args);
    const daemon = await daemonStatusSnapshot(port);
    if (!daemon.ok) throw new Error(`ge daemon is ${daemon.status || "stopped"}; run: ge daemon start`);
    const attempts = Number(args.attempts || 3);
    const task = await daemonRequest(port, "/api/tasks", {
      method: "POST",
      timeoutMs: 10000,
      body: {
        kind: "mission.run",
        ids: parseIds(args.ids),
        scenario: args.scenario,
        workspace: args.workspace,
        systems: parseIds(args.systems),
        targetStage: args["target-stage"] || "preview",
        attempts: Number.isFinite(attempts) && attempts > 0 ? attempts : 3,
        runPreview: !!args["run-preview"],
        executeFactory: !!args["with-factory"],
        useAntigravity: !args["no-antigravity"],
        harnessAgent: args["harness-agent"] || "antigravity-sdk",
        harnessModel: args.model || "gemini-3.5-flash",
        harnessLocation: args.location || "global",
        query: {
          project: args.project,
          region: args.region,
          location: args.location,
          model: args.model,
          agentIdentityOrgId: args.agentIdentityOrgId,
        },
      },
    });
    emit(args, task, (t) => {
      renderMissionGraph(t.output?.graph || {});
      out(pc.dim(`\n  status: ge mission status ${t.id}`));
      out(pc.dim(`  events: ge runtime events ${t.id} --follow`));
    });
  },
});

const missionStatusCmd = defineCommand({
  meta: { name: "status", description: "Show one mission graph, or list recent mission runs" },
  args: { id: { type: "positional", required: false }, json: { type: "boolean" }, port: { type: "string" }, limit: { type: "string" } },
  async run({ args }) {
    const port = daemonPort(args);
    const daemon = await daemonStatusSnapshot(port);
    if (!daemon.ok) throw new Error(`ge daemon is ${daemon.status || "stopped"}; run: ge daemon start`);
    if (args.id) {
      const task = await daemonRequest(port, `/api/tasks/${encodeURIComponent(args.id)}`, { timeoutMs: 3000 });
      emit(args, task, (t) => {
        renderMissionGraph(t.output?.graph || {});
        renderResumePlan(t.summary?.resumePlan);
      });
      return;
    }
    const body = await daemonRequest(port, `/api/tasks?limit=${encodeURIComponent(args.limit || "50")}`, { timeoutMs: 3000 });
    const tasks = (body.tasks || []).filter((task) => task.kind === "mission.run");
    emit(args, { tasks }, (r) => {
      out(pc.bold("\nMission Runs"));
      if (!r.tasks.length) {
        out(pc.dim("  no recent mission runs"));
        return;
      }
      for (const task of r.tasks.slice(0, Math.max(1, Math.min(Number(args.limit) || 20, 200)))) {
        const counts = task.counts || {};
        out(`  ${statusText(task.status).padEnd(14)} ${String(task.id).padEnd(30)} ${counts.done || 0}/${counts.blocked || 0}/${counts.pending || 0}/${counts.total || 0}`);
      }
    });
  },
});

const missionResumeCmd = defineCommand({
  meta: { name: "resume", description: "Resume a mission run via its runtime resume plan" },
  args: { id: { type: "positional", required: true }, json: { type: "boolean" }, port: { type: "string" } },
  async run({ args }) {
    const port = daemonPort(args);
    const daemon = await daemonStatusSnapshot(port);
    if (!daemon.ok) throw new Error(`ge daemon is ${daemon.status || "stopped"}; run: ge daemon start`);
    const task = await daemonRequest(port, `/api/tasks/${encodeURIComponent(args.id)}/resume`, { method: "POST", timeoutMs: 5000 });
    emit(args, task, (t) => {
      out(pc.bold(`\nMission Resume ${t.id}`));
      out(`  status    ${statusText(t.status)}`);
      renderResumePlan(t.summary?.resumePlan);
      out(pc.dim(`\n  events: ge runtime events ${t.id} --follow`));
    });
  },
});

const mission = defineCommand({
  meta: { name: "mission", description: "Mission graph: plan · run · status · resume" },
  subCommands: { plan: missionPlanCmd, run: missionRunCmd, status: missionStatusCmd, resume: missionResumeCmd },
});

const journeyArgs = {
  ...common,
  ids: { type: "string", description: "Comma-separated agent/workspace ids" },
  scenario: { type: "string", description: "Scenario/use-case id" },
  usecase: { type: "string", description: "Use case id from interview/spec registry" },
  systems: { type: "string", description: "Comma-separated source-system simulator ids" },
  "target-stage": { type: "string", description: "Target stage (default preview)" },
  port: { type: "string", description: "Daemon port (default 17654)" },
};

async function journeyTasks(args) {
  const port = daemonPort(args);
  const daemon = await daemonStatusSnapshot(port);
  if (!daemon.ok) return [];
  try {
    const body = await daemonRequest(port, "/api/tasks?limit=50&full=true", { timeoutMs: 3000 });
    return body.tasks || [];
  } catch {
    return [];
  }
}

async function buildCliJourney(args, { includeTasks = false } = {}) {
  const cfg = cfgFrom(args);
  const tasks = includeTasks ? await journeyTasks(args) : [];
  return core.journeyPlan(cfg, {
    scenario: args.scenario || null,
    usecaseId: args.usecase || null,
    systems: parseIds(args.systems),
    ids: parseIds(args.ids),
    targetStage: args["target-stage"] || "preview",
    tasks,
  });
}

const journeyPlanCmd = defineCommand({
  meta: { name: "plan", description: "Show the user-facing pipeline plan" },
  args: journeyArgs,
  async run({ args }) {
    const journey = await buildCliJourney(args, { includeTasks: false });
    emit(args, journey, renderJourneyPlan);
  },
});

const journeyStatusCmd = defineCommand({
  meta: { name: "status", description: "Show the journey with recent runtime state" },
  args: journeyArgs,
  async run({ args }) {
    const cfg = cfgFrom(args);
    const tasks = await journeyTasks(args);
    const [status, fleet] = await Promise.all([Promise.resolve(core.statusBoard(cfg)), core.fleetStatus(cfg)]);
    const latestMission = tasks.find((task) => task.kind === "mission.run" && task.output?.graph);
    const journey = buildJourneyPlan({
      scenario: args.scenario || latestMission?.input?.scenario || null,
      usecaseId: args.usecase || null,
      systems: parseIds(args.systems || latestMission?.input?.systems?.join?.(",") || ""),
      ids: parseIds(args.ids || latestMission?.input?.ids?.join?.(",") || ""),
      targetStage: args["target-stage"] || latestMission?.input?.targetStage || "preview",
      mode: cfg.mode || "local",
      status,
      fleet,
      tasks,
      graph: latestMission?.output?.graph || null,
      includePlannedMission: !latestMission,
    });
    emit(args, journey, renderJourneyPlan);
  },
});

const journeyRunCmd = defineCommand({
  meta: { name: "run", description: "Start the journey by running the durable mission graph" },
  args: {
    ...journeyArgs,
    attempts: { type: "string" },
    "run-preview": { type: "boolean" },
    "with-factory": { type: "boolean", description: "Actually schedule the factory build node" },
    "no-antigravity": { type: "boolean", description: "Do not include the Antigravity review node" },
    model: { type: "string", description: "Model for the Antigravity review node" },
    location: { type: "string", description: "Location for the Antigravity review node" },
  },
  async run({ args }) {
    const port = daemonPort(args);
    const daemon = await daemonStatusSnapshot(port);
    if (!daemon.ok) throw new Error(`ge daemon is ${daemon.status || "stopped"}; run: ge daemon start`);
    const attempts = Number(args.attempts || 3);
    const task = await daemonRequest(port, "/api/tasks", {
      method: "POST",
      timeoutMs: 10000,
      body: {
        kind: "mission.run",
        ids: parseIds(args.ids),
        scenario: args.scenario || args.usecase,
        systems: parseIds(args.systems),
        targetStage: args["target-stage"] || "preview",
        attempts: Number.isFinite(attempts) && attempts > 0 ? attempts : 3,
        runPreview: !!args["run-preview"],
        executeFactory: !!args["with-factory"],
        useAntigravity: !args["no-antigravity"],
        harnessAgent: "antigravity-sdk",
        harnessModel: args.model || "gemini-3.5-flash",
        harnessLocation: args.location || "global",
        query: {
          project: args.project,
          region: args.region,
          location: args.location || "global",
          model: args.model || "gemini-3.5-flash",
          agentIdentityOrgId: args.agentIdentityOrgId,
        },
      },
    });
    emit(args, task, (t) => {
      out(pc.green(`✓ started journey mission ${t.id}`));
      if (t.output?.graph) renderMissionGraph(t.output.graph);
      out(pc.dim(`\n  status: ge journey status --scenario ${args.scenario || args.usecase || "<scenario>"}`));
      out(pc.dim(`  events: ge runtime events ${t.id} --follow`));
    });
  },
});

const journey = defineCommand({
  meta: { name: "journey", description: "User journey: interview → spec → data → simulator → build → eval → preview → deploy" },
  subCommands: { plan: journeyPlanCmd, status: journeyStatusCmd, run: journeyRunCmd },
});

const daemonStart = defineCommand({
  meta: { name: "start", description: "Start the local GE runtime daemon" },
  args: { foreground: { type: "boolean" }, port: { type: "string" }, host: { type: "string" } },
  async run({ args }) {
    const port = Number(args.port || process.env.GE_DAEMON_PORT || daemonPaths().defaultPort);
    const host = args.host || process.env.GE_DAEMON_HOST || "127.0.0.1";
    const paths = daemonPaths();
    if (args.foreground) {
      startDaemonServer({ host, port, foreground: true });
      return;
    }
    const existing = await daemonStatusSnapshot(port);
    if (existing.ok) {
      out(pc.green(`✓ ge daemon already running pid=${existing.pid} http://127.0.0.1:${port}`));
      return;
    }
    if (existing.status === "unreachable") {
      const pid = readPidFile(paths.pidPath);
      if (pid && processAlive(pid) && processLooksLikeDaemon(pid)) {
        try { process.kill(pid, "SIGTERM"); } catch {}
      }
      rmSync(paths.pidPath, { force: true });
      out(pc.yellow(`▲ cleared unreachable ge daemon pid=${existing.pid}`));
    }
    mkdirSync(paths.dir, { recursive: true });
    const logFd = openSync(paths.logPath, "a");
    const child = spawn(process.execPath, [GE_CLI_PATH, "daemon", "start", "--foreground", "--port", String(port), "--host", host], {
      cwd: core.REPO_ROOT,
      detached: true,
      stdio: ["ignore", logFd, logFd],
      env: { ...process.env, GE_DAEMON_PORT: String(port), GE_DAEMON_HOST: host, GE_DAEMON_BACKGROUND: "1" },
    });
    closeSync(logFd);
    child.unref();
    const deadline = Date.now() + 5000;
    while (Date.now() < deadline) {
      try {
        const current = await getDaemonStatus({ port });
        out(pc.green(`✓ ge daemon started pid=${current.pid} http://127.0.0.1:${port}`));
        return;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
    const fallback = await daemonStatusSnapshot(port);
    if (fallback.status === "unreachable") {
      out(pc.yellow(`▲ ge daemon process started pid=${fallback.pid}, but health is not reachable yet`));
      out(pc.dim(`  log: ${paths.logPath}`));
      out(pc.dim("  next: ge daemon status"));
      return;
    }
    out(pc.yellow("▲ ge daemon did not become healthy within 5s"));
    out(pc.dim(`  log: ${paths.logPath}`));
    out(pc.dim("  fallback: console and ge doctor will run without the daemon"));
  },
});

const daemonStatus = defineCommand({
  meta: { name: "status", description: "Show local GE runtime daemon status" },
  args: { json: { type: "boolean" }, port: { type: "string" } },
  async run({ args }) {
    const port = Number(args.port || process.env.GE_DAEMON_PORT || daemonPaths().defaultPort);
    const status = await daemonStatusSnapshot(port);
    emit(args, status, (s) => {
      out(pc.bold("\nGE Runtime Daemon"));
      out(`  status    ${s.ok ? pc.green("healthy") : s.status === "unreachable" ? pc.yellow("unreachable") : pc.dim("stopped")}`);
      out(`  pid       ${s.pid ? pc.cyan(String(s.pid)) : pc.dim("<none>")}`);
      out(`  url       ${pc.cyan(`http://127.0.0.1:${s.port}`)}`);
      out(`  data      ${pc.dim(s.dataDir)}`);
      if (s.logPath) out(`  log       ${pc.dim(s.logPath)}`);
      if (s.error && !s.ok) out(`  detail    ${pc.dim(s.error)}`);
      out(`  runs      ${s.runs?.length || 0}`);
    });
  },
});

const daemonTasks = defineCommand({
  meta: { name: "tasks", description: "List recent local GE runtime daemon tasks" },
  args: { json: { type: "boolean" }, port: { type: "string" }, limit: { type: "string" } },
  async run({ args }) {
    const port = Number(args.port || process.env.GE_DAEMON_PORT || daemonPaths().defaultPort);
    const status = await daemonStatusSnapshot(port);
    const tasks = status.runs || [];
    emit(args, { tasks, daemon: { ok: status.ok, status: status.status || "healthy", port, pid: status.pid || null } }, (r) => {
      out(pc.bold("\nGE Runtime Tasks"));
      out(`  daemon    ${r.daemon.ok ? pc.green("healthy") : pc.yellow(r.daemon.status)}  ${pc.dim(`http://127.0.0.1:${port}`)}`);
      if (!tasks.length) {
        out(pc.dim("  no recent tasks"));
        return;
      }
      for (const task of tasks.slice(0, Math.max(1, Math.min(Number(args.limit) || 20, 200)))) {
        const statusText = task.status === "done" ? pc.green(task.status) : task.status === "running" ? pc.cyan(task.status) : pc.yellow(task.status);
        out(`  ${statusText.padEnd(14)} ${String(task.kind || "task").padEnd(12)} ${task.id} ${pc.dim(task.updatedAt || task.createdAt || "")}`);
      }
    });
  },
});

const daemonTask = defineCommand({
  meta: { name: "task", description: "Show one local GE runtime daemon task" },
  args: { id: { type: "positional", required: true }, json: { type: "boolean" }, port: { type: "string" } },
  async run({ args }) {
    const port = Number(args.port || process.env.GE_DAEMON_PORT || daemonPaths().defaultPort);
    const response = await fetch(`http://127.0.0.1:${port}/api/tasks/${encodeURIComponent(args.id)}`, {
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) throw new Error(`daemon task lookup failed: ${response.status}`);
    const task = await response.json();
    emit(args, task, (t) => {
      out(pc.bold(`\nGE Runtime Task ${t.id}`));
      out(`  kind      ${pc.cyan(t.kind || "task")}`);
      out(`  status    ${t.status === "done" ? pc.green(t.status) : t.status === "running" ? pc.cyan(t.status) : pc.yellow(t.status)}`);
      out(`  created   ${pc.dim(t.createdAt || "")}`);
      out(`  updated   ${pc.dim(t.updatedAt || "")}`);
      if (t.output?.run) {
        const r = t.output.run;
        out(`  autopilot ${r.passed || 0} passed · ${r.repaired || 0} repaired · ${r.blocked || 0} blocked · ${r.total || 0} total`);
      }
      renderResumePlan(t.summary?.resumePlan);
      if (t.error) out(`  error     ${pc.red(t.error)}`);
    });
  },
});

const runtimeResume = defineCommand({
  meta: { name: "resume", description: "Resume a runtime task using its deterministic resumePlan" },
  args: { id: { type: "positional", required: true }, json: { type: "boolean" }, port: { type: "string" } },
  async run({ args }) {
    const port = daemonPort(args);
    const daemon = await daemonStatusSnapshot(port);
    if (!daemon.ok) throw new Error(`ge daemon is ${daemon.status || "stopped"}; run: ge daemon start`);
    const task = await daemonRequest(port, `/api/tasks/${encodeURIComponent(args.id)}/resume`, { method: "POST", timeoutMs: 5000 });
    emit(args, task, (t) => {
      out(pc.bold(`\nRuntime Resume ${t.id}`));
      out(`  kind      ${pc.cyan(t.kind || "task")}`);
      out(`  status    ${statusText(t.status)}`);
      renderResumePlan(t.summary?.resumePlan);
      out(pc.dim(`\n  events: ge runtime events ${t.id} --follow`));
    });
  },
});

const daemonEvents = defineCommand({
  meta: { name: "events", description: "Show or follow one local GE runtime task event stream" },
  args: { id: { type: "positional", required: true }, json: { type: "boolean" }, port: { type: "string" }, follow: { type: "boolean" } },
  async run({ args }) {
    const port = Number(args.port || process.env.GE_DAEMON_PORT || daemonPaths().defaultPort);
    if (args.follow) {
      const response = await fetch(`http://127.0.0.1:${port}/api/tasks/${encodeURIComponent(args.id)}/events`);
      if (!response.ok || !response.body) throw new Error(`daemon task events failed: ${response.status}`);
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      for (;;) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf("\n\n")) >= 0) {
          const frame = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          const line = frame.split(/\r?\n/).find((part) => part.startsWith("data: "));
          if (!line) continue;
          const event = JSON.parse(line.slice(6));
          out(args.json ? JSON.stringify(event) : `${pc.dim(event.ts || "")} ${event.level === "error" ? pc.red(event.type) : pc.cyan(event.type)} ${event.line || ""}`);
        }
      }
      return;
    }
    const response = await fetch(`http://127.0.0.1:${port}/api/tasks/${encodeURIComponent(args.id)}/events?format=json`, {
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) throw new Error(`daemon task events failed: ${response.status}`);
    const body = await response.json();
    emit(args, body, (b) => {
      out(pc.bold(`\nGE Runtime Events ${args.id}`));
      for (const { seq, event } of b.events || []) {
        const type = event.level === "error" ? pc.red(event.type) : event.level === "warn" ? pc.yellow(event.type) : pc.cyan(event.type);
        out(`  ${String(seq).padStart(3)} ${type.padEnd(24)} ${event.line || ""}`);
      }
    });
  },
});

const runtimeStartAutopilot = defineCommand({
  meta: { name: "autopilot", description: "Start an Autopilot runtime task" },
  args: { ids: { type: "string" }, stage: { type: "string" }, repair: { type: "boolean" }, attempts: { type: "string" }, runPreview: { type: "boolean" }, json: { type: "boolean" }, port: { type: "string" } },
  async run({ args }) {
    const port = Number(args.port || process.env.GE_DAEMON_PORT || daemonPaths().defaultPort);
    const body = {
      kind: "autopilot.run",
      ids: args.ids ? parseList(args.ids) : [],
      targetStage: args.stage || "preview",
      repair: args.repair !== false,
      attempts: Number(args.attempts || 3),
      runPreview: args.runPreview === true,
      query: {},
    };
    const response = await fetch(`http://127.0.0.1:${port}/api/tasks`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`daemon autopilot start failed: ${response.status}`);
    const task = await response.json();
    emit(args, task, (t) => {
      out(pc.green(`✓ started autopilot task ${t.id}`));
      out(pc.dim(`  next: ge runtime events ${t.id} --follow`));
    });
  },
});

const runtimeStartJob = defineCommand({
  meta: { name: "job", description: "Start a GE command runtime task; pass command args after --" },
  args: { json: { type: "boolean" }, port: { type: "string" } },
  async run({ args }) {
    const separator = process.argv.indexOf("--");
    const argv = separator >= 0 ? process.argv.slice(separator + 1) : [];
    if (!argv.length) throw new Error("usage: ge runtime start job -- ge <args>");
    const geArgv = argv[0] === "ge" ? argv.slice(1) : argv;
    const port = Number(args.port || process.env.GE_DAEMON_PORT || daemonPaths().defaultPort);
    const response = await fetch(`http://127.0.0.1:${port}/api/tasks`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind: "ge.command", argv: geArgv }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`daemon job start failed: ${response.status}`);
    const task = await response.json();
    emit(args, task, (t) => {
      out(pc.green(`✓ started job task ${t.id}`));
      out(pc.dim(`  next: ge runtime events ${t.id} --follow`));
    });
  },
});

const runtimeStart = defineCommand({
  meta: { name: "start", description: "Start runtime tasks: autopilot · job" },
  subCommands: { autopilot: runtimeStartAutopilot, job: runtimeStartJob },
});

const daemonStop = defineCommand({
  meta: { name: "stop", description: "Stop the local GE runtime daemon" },
  args: {},
  run() {
    const { pidPath } = daemonPaths();
    const pid = readPidFile(pidPath);
    if (!pid) {
      out(pc.yellow("ge daemon is not running"));
      return;
    }
    if (!processAlive(pid) || !processLooksLikeDaemon(pid)) {
      rmSync(pidPath, { force: true });
      out(pc.yellow(`cleared stale ge daemon pid=${pid}`));
      return;
    }
    try {
      process.kill(pid, "SIGTERM");
      rmSync(pidPath, { force: true });
      out(pc.green(`✓ stopped ge daemon pid=${pid}`));
    } catch (e) {
      rmSync(pidPath, { force: true });
      throw new Error(`failed to stop daemon pid=${pid}: ${e.message}`);
    }
  },
});

const daemon = defineCommand({
  meta: { name: "daemon", description: "Local GE runtime daemon: start · status · tasks · task · stop" },
  subCommands: { start: daemonStart, status: daemonStatus, tasks: daemonTasks, task: daemonTask, events: daemonEvents, stop: daemonStop },
});

const runtime = defineCommand({
  meta: { name: "runtime", description: "Unified runtime activity: status · tasks · task · events · resume · start" },
  subCommands: { status: daemonStatus, tasks: daemonTasks, task: daemonTask, events: daemonEvents, resume: runtimeResume, start: runtimeStart },
});

const stateReset = defineCommand({
  meta: { name: "reset", description: "Clear local GE runtime/factory/mission/interview state" },
  args: {
    yes: { type: "boolean", description: "Confirm destructive local state reset" },
    json: { type: "boolean", description: "Machine-readable JSON result on stdout" },
  },
  run({ args }) {
    if (!args.yes) throw new Error("state reset is destructive; rerun with `ge state reset --yes`");
    const paths = daemonPaths();
    const pid = readPidFile(paths.pidPath);
    const stopped = Boolean(pid && processAlive(pid) && processLooksLikeDaemon(pid));
    if (stopped) {
      try { process.kill(pid, "SIGTERM"); } catch {}
    }
    const targets = [
      STATE_PATHS.root,
      LEGACY_STATE_PATHS.runtime.root,
      LEGACY_STATE_PATHS.missions.root,
      LEGACY_STATE_PATHS.interviews.root,
      LEGACY_STATE_PATHS.skills.root,
      LEGACY_STATE_PATHS.console.jobs,
      LEGACY_STATE_PATHS.factory.root,
      LEGACY_STATE_PATHS.factory.projects,
      LEGACY_STATE_PATHS.factory.projectsJson,
      LEGACY_STATE_PATHS.cache.uv,
    ].filter(Boolean);
    const removed = [];
    for (const target of targets) {
      if (!existsSync(target)) continue;
      rmSync(target, { recursive: true, force: true });
      removed.push(displayStatePath(target));
    }
    ensureStateLayout();
    const result = {
      ok: true,
      canonicalRoot: displayStatePath(STATE_PATHS.root),
      stoppedDaemon: stopped ? pid : null,
      removed,
      recreated: [
        displayStatePath(STATE_PATHS.runtime.runs),
        displayStatePath(STATE_PATHS.missions.root),
        displayStatePath(STATE_PATHS.interviews.root),
        displayStatePath(STATE_PATHS.factory.workspaces),
        displayStatePath(STATE_PATHS.cache.uv),
      ],
    };
    emit(args, result, (r) => {
      out(pc.green(`✓ reset local GE state under ${r.canonicalRoot}`));
      if (r.stoppedDaemon) out(pc.dim(`  stopped daemon pid=${r.stoppedDaemon}`));
      if (r.removed.length) out(pc.dim(`  removed ${r.removed.length} state path(s)`));
      out(pc.dim("  next: make setup && ge daemon start"));
    });
  },
});

const statePaths = defineCommand({
  meta: { name: "paths", description: "Show the canonical local GE state layout" },
  args: {
    json: { type: "boolean", description: "Machine-readable JSON result on stdout" },
  },
  run({ args }) {
    const paths = {
      root: { path: displayStatePath(STATE_PATHS.root), means: "one local state root for this repository" },
      runtime: { path: displayStatePath(STATE_PATHS.runtime.root), means: "durable task runs, events, resume plans, daemon metadata" },
      missions: { path: displayStatePath(STATE_PATHS.missions.root), means: "scenario data plans, generated rows, simulator seed overlays, validation artifacts" },
      interviews: { path: displayStatePath(STATE_PATHS.interviews.root), means: "generated interview specs before/after registry review" },
      factory: { path: displayStatePath(STATE_PATHS.factory.root), means: "factory plans, build run metadata, generated workspaces" },
      workspaces: { path: displayStatePath(STATE_PATHS.factory.workspaces), means: "generated agent code workspaces" },
      skills: { path: displayStatePath(STATE_PATHS.skills.root), means: "synced harness skill manifest and skill cache" },
      console: { path: displayStatePath(STATE_PATHS.console.root), means: "console job database and UI-local execution records" },
      cache: { path: displayStatePath(STATE_PATHS.cache.root), means: "tool caches such as uv/Snowfakery" },
    };
    emit(args, { kind: "ge.state.paths", paths }, (result) => {
      out(pc.bold("\nGE Local State"));
      for (const [name, entry] of Object.entries(result.paths)) {
        out(`  ${pc.cyan(name.padEnd(10))} ${entry.path.padEnd(28)} ${pc.dim(entry.means)}`);
      }
      out(pc.dim("\n  reset: ge state reset --yes"));
    });
  },
});

const state = defineCommand({
  meta: { name: "state", description: "Local GE state: paths · reset" },
  subCommands: { paths: statePaths, reset: stateReset },
});

// ── ledger: durable run ledger (ADR 0001) ─────────────────────────────────────
const ledgerBackfill = defineCommand({
  meta: { name: "backfill", description: "Import legacy run state (.ge-state.json + factory-run-*.json) into the durable ledger" },
  args: { ...common },
  async run({ args }) {
    const res = await core.ledgerBackfillFromDisk();
    emit(args, res, (r) => {
      if (r.note) { out(pc.yellow(`▲ ${r.note}`)); return; }
      out(pc.green(`✓ ledger backfill: ${r.runs} run(s), ${r.items} work item(s) imported`));
    });
  },
});
const ledgerRunsCmd = defineCommand({
  meta: { name: "runs", description: "List runs recorded in the durable ledger (local + remote, one source of truth)" },
  args: { ...common, limit: { type: "string" } },
  async run({ args }) {
    const res = await core.ledgerRuns({ limit: Number(args.limit || 25) });
    emit(args, res, (runs) => {
      if (!runs.length) { out(pc.dim("no runs in the ledger yet — run a build, or `ge ledger backfill`")); return; }
      for (const run of runs) {
        out(`${pc.cyan(run.id)}  ${String(run.mode).padEnd(6)} ${String(run.status).padEnd(8)} ${run.selected} item(s)${run.failed ? pc.red(` · ${run.failed} failed`) : ""}  ${pc.dim(run.updatedAt || "")}`);
      }
    });
  },
});
const ledgerFleetCmd = defineCommand({
  meta: { name: "fleet", description: "Latest work-item state per use case, from the ledger" },
  args: { ...common, limit: { type: "string" } },
  async run({ args }) {
    const res = await core.ledgerFleet();
    emit(args, res, (rows) => {
      if (!rows.length) { out(pc.dim("ledger fleet is empty — run a build, or `ge ledger backfill`")); return; }
      for (const r of rows.slice(0, Number(args.limit || 50))) {
        out(`${String(r.status).padEnd(10)} ${pc.cyan(String(r.useCaseId).padEnd(28))} ${pc.dim(r.workspaceId || "")} ${r.stage || ""}`);
      }
    });
  },
});
const ledgerPlanCmd = defineCommand({
  meta: { name: "plan", description: "Next action per work item from the ledger + pipeline state machine" },
  args: { ...common, target: { type: "string", description: "Target stage (default previewed)" }, mode: { type: "string", description: "local|remote (default local)" } },
  async run({ args }) {
    const res = await core.ledgerPlan({ targetStage: args.target || "previewed", mode: args.mode || null });
    emit(args, res, (rows) => {
      if (!rows.length) { out(pc.dim("nothing in the ledger to plan — run a build, or `ge ledger backfill`")); return; }
      for (const r of rows) {
        const tag = r.action === "none" ? pc.green("none") : r.action === "retry" ? pc.red(r.action) : pc.cyan(r.action);
        out(`${tag.padEnd(22)} ${pc.dim(String(r.useCaseId).padEnd(28))} ${r.currentStage} → ${r.nextStage || "—"}  ${pc.dim(r.reason)}`);
      }
    });
  },
});
const ledger = defineCommand({
  meta: { name: "ledger", description: "Durable run ledger (ADR 0001): backfill · runs · fleet · plan" },
  subCommands: { backfill: ledgerBackfill, runs: ledgerRunsCmd, fleet: ledgerFleetCmd, plan: ledgerPlanCmd },
});

// ── apply: declarative reconcile (ADR 0001 phase 5) ───────────────────────────
const apply = defineCommand({
  meta: { name: "apply", description: "Reconcile actual → desired platform + fleet from a manifest (ge.manifest.json). Plans by default; --yes executes." },
  args: { ...common, yes: { type: "boolean", description: "Execute the plan in dependency order (default: plan only)" }, manifest: { type: "string", description: "Path to a manifest JSON (default ge.manifest.json)" } },
  async run({ args }) {
    const cfg = cfgFrom(args);
    const manifest = args.manifest ? core.readJson(args.manifest, {}) : null;
    if (args.yes) {
      const res = await core.applyApply(cfg, { manifest, log: elog });
      emit(args, res, (r) => out(pc.green(`\n✓ applied ${r.applied} step(s)`)));
      return;
    }
    const res = await core.applyPlan(cfg, { manifest });
    emit(args, res, (r) => {
      out(pc.dim(`manifest: ${r.source}`));
      if (r.inSync) { out(pc.green("✓ in sync — nothing to reconcile")); return; }
      out(pc.bold(`\nReconcile plan — ${r.steps.length} step(s)`));
      for (const s of r.steps) out(`  ${pc.cyan(String(s.id).padEnd(16))} ${s.command}\n      ${pc.dim(s.reason)}`);
      out(pc.dim("\n  run `ge apply --yes` to execute in order"));
    });
  },
});

// ── root: bare `ge` → status board + next step ────────────────────────────────
// citty invokes the root `run` even when a subcommand matches, so only render the
// board when the first positional is NOT one of our subcommands.
const SUBCOMMANDS = new Set(["up", "doctor", "init", "cutover", "mode", "devex", "config", "infra", "images", "data", "mcp", "agents", "autopilot", "mission", "journey", "daemon", "runtime", "state", "ledger", "apply"]);
const root = defineCommand({
  meta: { name: "ge", description: "GE Agent Factory — set up · stand up · run agents. Bare `ge` shows status + next step." },
  args: { ...common },
  run({ args }) {
    const firstPositional = process.argv.slice(2).find((a) => !a.startsWith("-"));
    if (firstPositional && SUBCOMMANDS.has(firstPositional)) return; // a subcommand handles it
    const res = core.statusBoard(cfgFrom(args));
    emit(args, res, (r) => {
      out(pc.bold("\nGE Agent Factory"));
      out(`  mode      ${pc.cyan(r.mode)}  ${pc.dim(r.clientDoes)}`);
      out(`  project   ${r.project ? pc.cyan(r.project) : pc.yellow("<unset — run ge init>")}`);
      out(`  app       ${r.app ? pc.dim(r.app) : pc.yellow("<unset>")}`);
      out("");
      for (const p of r.planes) out(`  ${p.up ? pc.green("✓") : pc.yellow("○")} ${p.name.padEnd(12)} ${pc.dim(p.detail)}`);
      out(`\n  next: ${pc.bold(pc.cyan(r.next))}`);
      out(pc.dim("  (ge --help for all commands · ge mode to switch local/remote)"));
    });
  },
  subCommands: {
    // lifecycle
    up, doctor, init, cutover, mode, devex, config,
    // noun groups
    infra, images, data, mcp, agents, autopilot, mission, journey, daemon, runtime, state, ledger,
    // declarative reconcile
    apply,
  },
});

runMain(root).catch((e) => { process.stderr.write(pc.red(`✗ ${e?.message || e}`) + "\n"); process.exit(1); });
