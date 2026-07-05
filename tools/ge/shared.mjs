// tools/ge/shared.mjs — helpers shared by every command-group module under
// tools/ge/*. Moved verbatim out of tools/ge.mjs (structural split only; no
// behavior change). See tools/ge.mjs for the composition root that wires
// these command groups into the citty command tree.
import pc from "picocolors";
import { parseList } from "@ge/std/list";
import { existsSync, readFileSync } from "node:fs";
import * as ui from "./ui.mjs";
import * as core from "../lib/factory-core.mjs";
import { daemonPaths, getDaemonStatus } from "../lib/runtime-daemon.mjs";

// Stable-error-code registry — a dependency-free data leaf that lives beside
// FactoryCommandError (whose fail(msg, code) mints the codes). This is a
// CLI-boundary file, not tools/lib/*, so the tools/lib → apps/factory layering
// rule (tools/check-no-app-imports.mjs) does not apply; importing the leaf
// here is the sanctioned alternative to hand-mirroring the code table.
import { docsUrlFor, resolveErrorCode } from "../../apps/factory/scripts/factory/core/error-codes.mjs";
import { GE_COMMANDS } from "@ge/capability-registry";
import { isDxError, dxErrorShape } from "../lib/errors/dx-error.mjs";

export { core, pc, ui };

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

// Status color is one identity from TTY to UI: these resolve through the
// shared ramp (packages/design/src/status-ramp.mjs) that also generates the
// console's --color-status-* tokens — same semantics, nearest-ANSI rendering.
// ICON is a compatibility alias into the kit's glyph set (tools/ge/ui.mjs) —
// same bytes as the historical green ✓ / yellow ▲ / red ✗ triple. New code
// should call ui.glyph(tone) directly.
export const ICON = {
  pass: ui.glyph("passed"),
  warn: ui.glyph("warning"),
  fail: ui.glyph("failed"),
};

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
// registry (packages/capability-registry/src/registry.mjs) the console and MCP server read,
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
      if (isDxError(e)) {
        // The four-field error contract (tools/lib/errors/dx-error.mjs):
        // what already rendered as the ✗ line above; where/why explain it and
        // fix is a literal command. --json callers additionally get the shape
        // on stdout — structure where a plain Error leaves silence.
        const shape = dxErrorShape(e);
        if (shape.where) process.stderr.write(pc.dim(`  where: ${shape.where}`) + "\n");
        if (shape.why) process.stderr.write(pc.dim(`  why:   ${shape.why}`) + "\n");
        if (shape.fix) process.stderr.write(`  ${pc.dim("fix:")}   ${pc.cyan(shape.fix)}` + "\n");
        if (ctx?.args?.json) out(JSON.stringify({ ok: false, error: shape }, null, 2));
      } else if (e?.hint) {
        // Errors can carry a machine-attached recovery hint (err.hint) — render it
        // as the same next-step affordance every successful command prints
        // (ui.next), minus the leading blank line so it hugs the ✗ line above.
        process.stderr.write(ui.next(e.hint).slice(1) + "\n");
      }
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
// by `ge runs events --follow` and the `--follow` flags on pipeline run and
// fleet repair, so "start it" and "watch it" can be one command.
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
  // Same output bytes as the old hardcoded green/cyan/red/yellow branches —
  // the mapping lives in the shared status ramp (via the kit) so TTY and
  // console can't disagree about what color a status is.
  return ui.statusWord(status);
}

export function parseIds(ids) {
  return parseList(String(ids || ""));
}

export function renderRepairSummary(task) {
  const run = task.output?.run || {};
  const summary = task.summary || {};
  const counts = task.output?.counts || summary.counts || run;
  out(ui.title(`Repair run ${task.id}`));
  out(ui.kv([
    ["status", statusText(run.status || task.status)],
    ["target", ui.cmd(run.targetStage || task.input?.targetStage || summary.input?.targetStage || "preview")],
    ["mode", pc.dim(run.options?.mode || "<unknown>")],
    { key: "repair", value: run.options?.repair === false ? pc.yellow("off") : pc.green("on"), note: `${run.options?.attempts ?? task.input?.attempts ?? 3} attempt(s)` },
    ["results", `${counts.passed || 0} passed · ${counts.repaired || 0} repaired · ${counts.blocked || 0} blocked · ${counts.total || 0} total`],
    (task.output?.reason || summary.summary) && ["reason", pc.dim(task.output?.reason || summary.summary)],
    task.error && ["error", pc.red(task.error)],
  ]));
  if ((task.output?.items || []).length) {
    out(ui.section("Items"));
    out(ui.columns(task.output.items, [
      { header: "", value: (item) => statusText(item.status) },
      { header: "", value: (item) => String(item.agentId || item.workspaceId) },
      { header: "", value: (item) => pc.dim(item.blockers?.[0]?.id || item.blockers?.[0]?.message || "") },
    ]));
  }
}

export function renderResumePlan(plan) {
  if (!plan) return;
  const safeToRun = plan.safeToRun ?? plan.canResume;
  out(ui.kv([
    ["resume", safeToRun ? pc.green(plan.nextAction) : pc.dim(plan.nextAction || "none")],
    plan.reason && ["reason", pc.dim(plan.reason)],
  ]));
  if (plan.commands?.length) {
    out(ui.section("Resume Plan"));
    out(ui.nextList(plan.commands));
  }
}

export function pipelineNodeDetail(node) {
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

export function renderPipelineBrief(graph) {
  const nodes = graph.nodes || [];
  const rows = nodes.find((node) => node.id === "snowfakery.generate")?.summary?.output?.rowCount;
  const generatedObjects = nodes.find((node) => node.id === "mock.generate")?.summary?.snowfakery?.objects;
  const seeded = nodes.find((node) => node.id === "simulator.seed")?.summary?.simulators?.length;
  const validated = nodes.find((node) => node.id === "simulator.validate")?.summary?.totals;
  const blockers = nodes.flatMap((node) => (node.blockers || []).map((blocker) => ({ node: node.id, blocker })));
  if (rows === undefined && generatedObjects === undefined && seeded === undefined && !validated && !blockers.length) return;
  out(ui.section("Brief"));
  out(ui.kv([
    generatedObjects !== undefined && ["objects", String(generatedObjects)],
    rows !== undefined && ["rows", String(rows)],
    seeded !== undefined && ["seeded", `${seeded} simulator${seeded === 1 ? "" : "s"}`],
    validated && ["validate", `${validated.simulators || 0} simulators · ${validated.errors || 0} errors · ${validated.warnings || 0} warnings`],
    blockers.length && ["blockers", String(blockers.length)],
  ]));
  for (const item of blockers.slice(0, 3)) out(`    ${pc.red(item.node)} ${pc.dim(item.blocker.message || item.blocker.id || "blocked")}`);
}

export function renderPipelineGraph(graph) {
  out(ui.title(`Pipeline run ${graph.id}`));
  out(ui.kv([
    ["status", statusText(graph.status)],
    ["target", ui.cmd(graph.input?.targetStage || "preview")],
    ["nodes", `${graph.counts?.done || 0} done · ${graph.counts?.blocked || 0} blocked · ${graph.counts?.pending || 0} pending · ${graph.counts?.total || 0} total`],
    graph.input?.executeFactory === false && ["factory", pc.dim("represented, not auto-run")],
  ]));
  renderPipelineBrief(graph);
  out(ui.section("Graph"));
  const nodes = graph.nodes || [];
  // Two-line rows (status/id/kind, then a hanging detail line) — computed
  // widths so the detail line's hanging indent always lands under the kind.
  const statusW = Math.max(...nodes.map((node) => ui.visibleWidth(statusText(node.status))), 0);
  const idW = Math.max(...nodes.map((node) => String(node.id).length), 0);
  for (const node of nodes) {
    const deps = node.dependsOn?.length ? pc.dim(` ← ${node.dependsOn.join(",")}`) : "";
    const child = node.childTaskId ? pc.dim(` child=${node.childTaskId}`) : "";
    const detail = pipelineNodeDetail(node);
    out(`  ${ui.padVisible(statusText(node.status), statusW)}  ${String(node.id).padEnd(idW)}  ${pc.dim(node.kind || node.runtimeKind)}${deps}${child}`);
    if (detail) out(`  ${" ".repeat(statusW)}  ${" ".repeat(idW)}  ${pc.dim(detail)}`);
  }
}

export function renderPipelinePlan(pipeline) {
  out(ui.title(`Pipeline ${pipeline.id}`));
  out(ui.kv([
    ["status", statusText(pipeline.status)],
    ["target", ui.cmd(pipeline.targetStage || "preview")],
    pipeline.input?.scenario && ["scenario", ui.cmd(pipeline.input.scenario)],
    pipeline.input?.systems?.length && ["systems", pipeline.input.systems.join(", ")],
    pipeline.input?.ids?.length && ["agents", pipeline.input.ids.join(", ")],
  ]));
  if (pipeline.next) {
    out(ui.section("Next"));
    out(`  ${statusText(pipeline.next.status)}  ${String(pipeline.next.label)}  ${pc.dim(pipeline.next.owner || "runtime")}`);
    const nextRows = ui.kv([
      pipeline.next.blocker?.message && ["blocker", pc.red(pipeline.next.blocker.message)],
      pipeline.next.actionPlan?.label && ["action", pipeline.next.actionPlan.label],
    ]);
    if (nextRows) out(nextRows);
    if (pipeline.next.actionPlan?.commands?.length) out(ui.nextList(pipeline.next.actionPlan.commands));
  }
  out(ui.section("Pipeline"));
  const stages = pipeline.stages || [];
  const statusW = Math.max(...stages.map((stage) => ui.visibleWidth(statusText(stage.status))), 0);
  const labelW = Math.max(...stages.map((stage) => String(stage.label).length), 0);
  for (const stage of stages) {
    const command = stage.actionPlan?.commands?.[0] ? pc.dim(` · ${stage.actionPlan.commands[0]}`) : "";
    const blocker = stage.blocker?.message ? pc.red(` · ${stage.blocker.message}`) : "";
    const task = stage.taskId ? pc.dim(` · ${stage.taskId}`) : "";
    out(`  ${ui.padVisible(statusText(stage.status), statusW)}  ${String(stage.label).padEnd(labelW)}  ${pc.dim(stage.owner || "")}${task}${blocker}${command}`);
  }
}

// Render one checks[] section (shared by data/mcp/section doctors, ge doctor,
// prove's blocked-at-doctor screen, and devex). One shape everywhere: ramp
// glyph, name in a computed column, dim detail, and the standard fix
// affordance (ui.fixLine) under anything that isn't passing.
export function renderChecks(checks, { indent = 2 } = {}) {
  const pad = " ".repeat(indent);
  const width = Math.max(...checks.map((ch) => ch.name.length), 0);
  for (const ch of checks) {
    out(`${pad}${ui.glyph(ch.status)} ${ch.name.padEnd(width)}  ${pc.dim(ch.detail)}`);
    if (ch.status !== "pass" && ch.fix) out(ui.fixLine(ch.fix, indent + 4));
  }
}

// Effective mode: --remote/--local override the persisted cfg.mode. The
// fallback mirrors the config contract's fail-safe default (config-schema.mjs:
// a fresh checkout must NOT touch GCP), so a missing mode can never silently
// target the cloud.
export const modeOf = (args, cfg) => (args.remote ? "remote" : args.local ? "local" : cfg.mode || "local");
// Local "build boundary": the last pre-cloud harness stage. Local builds stop here.
export const LOCAL_BUILD_BOUNDARY = "previewed";
