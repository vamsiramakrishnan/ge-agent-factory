// tools/ge/shared.mjs — helpers shared by every command-group module under
// tools/ge/*. Moved verbatim out of tools/ge.mjs (structural split only; no
// behavior change). See tools/ge.mjs for the composition root that wires
// these command groups into the citty command tree.
import pc from "picocolors";
import { defineCommand } from "citty";
import { parseList } from "@ge/std/list";
import { existsSync, readFileSync } from "node:fs";
import * as core from "../lib/factory-core.mjs";
import { daemonPaths, getDaemonStatus, displayTaskKind } from "../lib/runtime-daemon.mjs";

export { displayTaskKind };
// Stable-error-code registry — a dependency-free data leaf that lives beside
// FactoryCommandError (whose fail(msg, code) mints the codes). This is a
// CLI-boundary file, not tools/lib/*, so the tools/lib → apps/factory layering
// rule (tools/check-no-app-imports.mjs) does not apply; importing the leaf
// here is the sanctioned alternative to hand-mirroring the code table.
import { docsUrlFor, resolveErrorCode } from "../../apps/factory/scripts/factory/core/error-codes.mjs";
import { GE_COMMANDS } from "../lib/ge-command-registry.mjs";

export { core, pc };

export const elog = (m) => process.stderr.write(pc.dim(`  ${m}`) + "\n");
export const blog = (m) => process.stderr.write(pc.bold(m) + "\n");
export const out = (line = "") => process.stdout.write(line + "\n");

// Map CLI flags → loadConfig inputs.
export const cfgFrom = (a) => core.loadConfig({
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
export const common = {
  json: { type: "boolean", description: "Machine-readable JSON result on stdout" },
  project: { type: "string", description: "GCP project id", alias: ["gcp-project"] },
  region: { type: "string", description: "Region (default us-central1)" },
  agentIdentityOrgId: { type: "string", description: "Organization ID for Agent Identity principalSet trust domain" },
};

// Render: --json prints the structured result; otherwise call the human renderer.
export function emit(args, result, human) {
  if (args.json) { out(JSON.stringify(result, null, 2)); return; }
  human(result);
}

export const ICON = { pass: pc.green("✓"), warn: pc.yellow("▲"), fail: pc.red("✗") };

// ── Deprecated aliases ──────────────────────────────────────────────────────
// The orchestration surface collapsed (journey/mission → pipeline,
// autopilot → fleet repair, runtime observability → runs). Old verbs keep
// working forever as aliases: identical args and behavior, plus one dim
// stderr pointer at the canonical spelling — no breakage, no mystery.
export function deprecatedAlias({ name, hint, command, run }) {
  return defineCommand({
    meta: { name, description: `(deprecated → ${hint}) ${command.meta.description}` },
    args: command.args,
    run: async (ctx) => {
      process.stderr.write(pc.dim(`▲ deprecated spelling — canonical: ${hint}`) + "\n");
      return (run || command.run)(ctx);
    },
  });
}

// ── Duration feedback ───────────────────────────────────────────────────────
// Long operations should say up front how long they usually take, and say at
// the end how long they actually took — both to stderr, so stdout (the JSON
// contract) is untouched.
export function formatDuration(ms) {
  const seconds = Math.round(ms / 1000);
  if (seconds < 90) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  return `${minutes}m ${seconds % 60}s`;
}

// Set-expectations line before a long command starts, sourced from the same
// registry (tools/lib/ge-command-registry.mjs) the console and MCP server read,
// so the estimate can't drift per surface. Silent for unknown/"varies" entries.
export function announceExpectedDuration(commandId) {
  const expected = GE_COMMANDS[commandId]?.expectedDuration;
  if (expected && expected !== "varies") elog(`usually takes ${expected}`);
}

// ── Error boundary ──────────────────────────────────────────────────────
// citty's own runMain() catches whatever escapes a command's run() and logs
// the raw Error object (full stack trace, via `console.error(error, "\n")`)
// before process.exit(1)ing — see runCommand()/runMain() in citty's
// dist/index.mjs. There is no per-command hook into that path, so the only
// way to get a clean one-line "✗ <message>" is to make sure the error never
// escapes run() in the first place. Wrap every subcommand's run with this so
// a thrown/rejected error renders once, here, instead of reaching citty's
// crash handler. Mirrors the render-boundary shape of dispatch() in
// apps/factory/scripts/factory/registry.mjs: prints "✗ <message>" and sets
// process.exitCode (NOT process.exit()), so stdout/stderr already written
// this run fully flush before the process exits.
// When the error carries a registered GE#### code (factory's fail(msg, code)),
// the line becomes "✗ GE#### <message>" plus a docs-site deep link on the next
// line. An error WITHOUT a registered code renders byte-identically to before
// (no code, no link) — see resolveErrorCode(), which also rejects Node system
// codes like "ENOENT" so only real registry entries change the output.
// Elapsed-time note for anything that ran long enough to feel long. Skipped
// for --json callers (their stdout contract stays byte-identical; the note
// goes to stderr regardless, but subprocess callers shouldn't pay the noise).
const ELAPSED_NOTE_THRESHOLD_MS = 5000;
function noteElapsed(ctx, startedAt, verb) {
  const ms = Date.now() - startedAt;
  if (ms < ELAPSED_NOTE_THRESHOLD_MS || ctx?.args?.json) return;
  process.stderr.write(pc.dim(`  ${verb} ${formatDuration(ms)}`) + "\n");
}

export function guarded(run) {
  return async (ctx) => {
    const startedAt = Date.now();
    try {
      const result = await run(ctx);
      noteElapsed(ctx, startedAt, "done in");
      return result;
    } catch (e) {
      noteElapsed(ctx, startedAt, "failed after");
      const code = resolveErrorCode(e);
      if (code) {
        process.stderr.write(pc.red(`✗ ${code} ${e?.message || e}`) + "\n");
        process.stderr.write(pc.dim(`→ ${docsUrlFor(code)}`) + "\n");
      } else {
        process.stderr.write(pc.red(`✗ ${e?.message || e}`) + "\n");
      }
      // Errors can carry a machine-attached recovery hint (err.hint) — render it
      // as the same "next:" affordance every successful command already prints.
      if (e?.hint) process.stderr.write(pc.dim(`  next: ${e.hint}`) + "\n");
      process.exitCode = 1;
    }
  };
}

export function readPidFile(pidPath) {
  if (!existsSync(pidPath)) return null;
  const pid = Number(readFileSync(pidPath, "utf8").trim());
  return Number.isFinite(pid) && pid > 0 ? pid : null;
}

export function processAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

export function processLooksLikeDaemon(pid) {
  if (!pid) return false;
  if (!existsSync(`/proc/${pid}/cmdline`)) return true;
  try {
    const cmdline = readFileSync(`/proc/${pid}/cmdline`, "utf8").replaceAll("\0", " ");
    return cmdline.includes("tools/ge.mjs") && cmdline.includes("daemon") && cmdline.includes("start") && cmdline.includes("--foreground");
  } catch {
    return false;
  }
}

export async function daemonStatusSnapshot(port) {
  const paths = daemonPaths();
  try {
    return await getDaemonStatus({ port });
  } catch (e) {
    const pid = readPidFile(paths.pidPath);
    const alive = processAlive(pid) && processLooksLikeDaemon(pid);
    let meta = {};
    try {
      meta = existsSync(paths.metaPath) ? JSON.parse(readFileSync(paths.metaPath, "utf8")) : {};
    } catch (error) {
      // existsSync guards absence, so this only fires on an unreadable/corrupt
      // meta file — status still degrades to defaults, but say why.
      console.warn(`ge daemon: metadata file ${paths.metaPath} is unreadable — ${error?.message || String(error)}`);
    }
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

export function daemonPort(args = {}) {
  return Number(args.port || process.env.GE_DAEMON_PORT || daemonPaths().defaultPort);
}

export async function daemonRequest(port, path, { method = "GET", body, timeoutMs = 3000 } = {}) {
  const response = await fetch(`http://127.0.0.1:${port}${path}`, {
    method,
    headers: body ? { "content-type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(timeoutMs),
  });
  let payload = null;
  try { payload = await response.json(); } catch { /* best-effort: non-JSON body falls through to the status-text error below */ }
  if (!response.ok) {
    const detail = payload?.error || `${response.status} ${response.statusText}`.trim();
    throw new Error(`daemon request failed: ${detail}`);
  }
  return payload;
}

// Follow one daemon task's live SSE event stream, printing each event as a
// human line (or NDJSON with json=true). Returns when the stream ends. Shared
// by `ge runs events --follow` and the `--follow` flags on pipeline/fleet-repair/
// autopilot run, so "start it" and "watch it" can be one command.
export async function followTaskEvents(port, id, { json = false } = {}) {
  // The daemon's SSE frames carry `id:` (the event seq) and support
  // Last-Event-ID resume (protocol v3) — so a dropped connection reconnects
  // and continues from the last event seen instead of losing the tail or
  // replaying from zero. A clean server close (run reached a terminal state)
  // ends the follow; only mid-stream network errors trigger reconnects.
  let lastEventId = 0;
  let retries = 0;
  for (;;) {
    let response;
    try {
      response = await fetch(`http://127.0.0.1:${port}/api/tasks/${encodeURIComponent(id)}/events`, {
        headers: lastEventId ? { "Last-Event-ID": String(lastEventId) } : undefined,
      });
    } catch (error) {
      if (++retries > 5) throw new Error(`daemon task events failed after ${retries} attempts: ${error.message}`);
      elog(`stream dropped — reconnecting from event ${lastEventId} (${retries}/5)`);
      await new Promise((resolve) => setTimeout(resolve, 500 * retries));
      continue;
    }
    if (!response.ok || !response.body) throw new Error(`daemon task events failed: ${response.status}`);
    retries = 0;
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";
    try {
      for (;;) {
        const { value, done } = await reader.read();
        if (done) return; // server closed cleanly: the run is terminal
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf("\n\n")) >= 0) {
          const frame = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 2);
          const lines = frame.split(/\r?\n/);
          const idLine = lines.find((part) => part.startsWith("id: "));
          if (idLine) lastEventId = Number(idLine.slice(4)) || lastEventId;
          const line = lines.find((part) => part.startsWith("data: "));
          if (!line) continue;
          const event = JSON.parse(line.slice(6));
          out(json ? JSON.stringify(event) : `${pc.dim(event.ts || "")} ${event.level === "error" ? pc.red(event.type) : pc.cyan(event.type)} ${event.line || ""}`);
        }
      }
    } catch (error) {
      if (++retries > 5) throw new Error(`daemon task events failed after ${retries} attempts: ${error.message}`);
      elog(`stream dropped — reconnecting from event ${lastEventId} (${retries}/5)`);
      await new Promise((resolve) => setTimeout(resolve, 500 * retries));
    }
  }
}

export function statusText(status) {
  if (status === "done" || status === "passed" || status === "repaired") return pc.green(status);
  if (status === "running" || status === "queued" || status === "doctor_running" || status === "repairing") return pc.cyan(status);
  if (status === "failed" || status === "blocked") return pc.red(status);
  return pc.yellow(status || "unknown");
}

export function parseIds(ids) {
  return parseList(String(ids || ""));
}

export function renderRepairSummary(task) {
  const run = task.output?.run || {};
  const summary = task.summary || {};
  const counts = task.output?.counts || summary.counts || run;
  out(pc.bold(`\nRepair run ${task.id}`));
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

export function renderResumePlan(plan) {
  if (!plan) return;
  const safeToRun = plan.safeToRun ?? plan.canResume;
  out(`  resume    ${safeToRun ? pc.green(plan.nextAction) : pc.dim(plan.nextAction || "none")}`);
  if (plan.reason) out(`  reason    ${pc.dim(plan.reason)}`);
  if (plan.commands?.length) {
    out(pc.bold("\n  Resume Plan"));
    for (const command of plan.commands) out(`  ${pc.dim("$")} ${command}`);
  }
}

export function missionNodeDetail(node) {
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

export function renderMissionBrief(graph) {
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

export function renderMissionGraph(graph) {
  out(pc.bold(`\nPipeline run ${graph.id}`));
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

export function renderJourneyPlan(journey) {
  out(pc.bold(`\nPipeline ${journey.id}`));
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
export function renderChecks(checks, pad = 22) {
  for (const ch of checks) {
    out(`${ICON[ch.status]} ${ch.name.padEnd(pad)} ${pc.dim(ch.detail)}`);
    if (ch.status !== "pass" && ch.fix) out(`    ${pc.dim("fix:")} ${ch.fix}`);
  }
}

// Effective mode: --remote/--local override the persisted cfg.mode. The
// fallback mirrors the config contract's fail-safe default (config-schema.mjs:
// a fresh checkout must NOT touch GCP), so a missing mode can never silently
// target the cloud.
export const modeOf = (args, cfg) => (args.remote ? "remote" : args.local ? "local" : cfg.mode || "local");
// Local "build boundary": the last pre-cloud harness stage. Local builds stop here.
export const LOCAL_BUILD_BOUNDARY = "previewed";
