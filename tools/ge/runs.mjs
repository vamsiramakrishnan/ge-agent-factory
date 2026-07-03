// tools/ge/runs.mjs — `ge runs list|show|events|replay|resume|job`.
//
// THE canonical noun for run observability: every execution — pipeline runs,
// fleet repairs, harness runs, doctor, jobs (daemon tasks), AND durable
// factory builds (ledger runs) — is a *run*, and this group is where you
// list, inspect, follow, replay, and resume them.
//
// `list` is the unified timeline (ledger unification, read side): daemon
// tasks and ledger runs merged into one newest-first view, the same merge the
// console's Runs view performs. The write-side unification (one store) is a
// tracked follow-up — see docs/plans/ux-journey-audit.md.
//
// `replay` folds a finished run's recorded events back through the terminal
// at speed — the events are already durable and sequenced, so a run you
// missed is a run you can still watch.
import { defineCommand } from "citty";
import { runtimeLeaves } from "./daemon.mjs";
import {
  guarded, emit, out, pc, core, statusText,
  daemonPort, daemonStatusSnapshot, daemonRequest,
} from "./shared.mjs";

export const runsEventsCmd = runtimeLeaves.events;
export const runsResumeCmd = runtimeLeaves.resume;

const runsListCmd = defineCommand({
  meta: { name: "list", description: "One timeline over every run: daemon tasks + durable ledger runs, newest first" },
  args: {
    json: { type: "boolean", description: "Machine-readable JSON result on stdout" },
    port: { type: "string", description: "Daemon port (default 17654)" },
    limit: { type: "string", description: "Max runs to list per source (default 20)" },
  },
  run: guarded(async ({ args }) => {
    const limit = Math.max(1, Math.min(Number(args.limit) || 20, 200));
    const port = daemonPort(args);
    const daemon = await daemonStatusSnapshot(port);
    const tasks = (daemon.runs || []).map((task) => ({
      source: "runtime",
      id: task.id,
      kind: task.kind || "task",
      status: task.status,
      updatedAt: task.updatedAt || task.createdAt || "",
      detail: "",
    }));
    let ledgerRows = [];
    try {
      ledgerRows = (await core.ledgerRuns({ limit })).map((run) => ({
        source: "ledger",
        id: run.id,
        kind: run.kind || "build",
        status: run.status,
        updatedAt: run.updatedAt || run.startedAt || "",
        detail: run.total ? `${run.ok || 0}/${run.total} ok${run.targetStage ? ` → ${run.targetStage}` : ""}` : "",
      }));
    } catch {
      // best-effort: no ledger driver (plain node, fresh checkout) just means
      // the timeline shows daemon tasks only — same degradation as the console.
    }
    const rows = [...tasks, ...ledgerRows]
      .sort((a, b) => String(b.updatedAt).localeCompare(String(a.updatedAt)))
      .slice(0, limit);
    emit(args, { runs: rows, daemon: { ok: daemon.ok, status: daemon.status || "healthy", port } }, (r) => {
      out(pc.bold("\nRuns"));
      out(`  daemon    ${r.daemon.ok ? pc.green("healthy") : pc.yellow(r.daemon.status)}  ${pc.dim(`http://127.0.0.1:${port}`)}`);
      if (!r.runs.length) {
        out(pc.dim("  no runs recorded yet — start one: ge pipeline run · ge agents build · ge fleet repair"));
        return;
      }
      for (const row of r.runs) {
        out(`  ${statusText(row.status).padEnd(14)} ${pc.dim(row.source.padEnd(8))} ${String(row.kind).padEnd(16)} ${String(row.id).padEnd(32)} ${pc.dim(row.detail || row.updatedAt)}`);
      }
      out(pc.dim("\n  detail: ge runs show <id>   ·   follow: ge runs events <id> --follow   ·   replay: ge runs replay <id>"));
    });
  }),
});

// Cap the pause between replayed events so an overnight gap doesn't stall the
// replay; floor it so bursts stay readable.
const REPLAY_MAX_GAP_MS = 2000;
const REPLAY_MIN_GAP_MS = 15;

export function replayDelays(events, speed) {
  const factor = Number.isFinite(speed) && speed > 0 ? speed : 10;
  const delays = [0];
  for (let i = 1; i < events.length; i += 1) {
    const prev = Date.parse(events[i - 1]?.event?.ts || "");
    const next = Date.parse(events[i]?.event?.ts || "");
    const gap = Number.isFinite(prev) && Number.isFinite(next) ? Math.max(0, next - prev) : 0;
    delays.push(Math.min(REPLAY_MAX_GAP_MS, Math.max(REPLAY_MIN_GAP_MS, gap / factor)));
  }
  return delays;
}

const runsReplayCmd = defineCommand({
  meta: { name: "replay", description: "Replay a finished run's recorded events at speed (default 10×)" },
  args: {
    id: { type: "positional", required: true, description: "Run id (daemon task)" },
    speed: { type: "string", description: "Time-compression factor (default 10; gaps capped at 2s)" },
    instant: { type: "boolean", description: "No pacing — dump the whole event log" },
    json: { type: "boolean", description: "Machine-readable JSON result on stdout" },
    port: { type: "string", description: "Daemon port (default 17654)" },
  },
  run: guarded(async ({ args }) => {
    const port = daemonPort(args);
    const body = await daemonRequest(port, `/api/tasks/${encodeURIComponent(args.id)}/events?format=json`, { timeoutMs: 5000 });
    const events = body.events || [];
    if (!events.length) throw new Error(`no recorded events for ${args.id} — is the id right? (ge runs list)`);
    const delays = args.instant ? null : replayDelays(events, Number(args.speed || 10));
    if (!args.json) out(pc.bold(`\nReplay ${args.id}`) + pc.dim(`  ${events.length} events${args.instant ? "" : ` · ${Number(args.speed || 10)}× speed`}`));
    for (let i = 0; i < events.length; i += 1) {
      if (delays && delays[i]) await new Promise((resolve) => setTimeout(resolve, delays[i]));
      const { seq, event } = events[i];
      if (args.json) {
        out(JSON.stringify({ seq, event }));
        continue;
      }
      const tone = event.level === "error" ? pc.red(event.type) : event.level === "warn" ? pc.yellow(event.type) : pc.cyan(event.type);
      out(`  ${String(seq).padStart(4)} ${pc.dim(event.ts || "")} ${tone.padEnd(24)} ${event.line || ""}`);
    }
    if (!args.json) out(pc.dim(`\n  live view: ge runs show ${args.id}`));
  }),
});

export const runs = defineCommand({
  meta: { name: "runs", description: "Run activity across every kind: list · show · events · replay · resume · job" },
  subCommands: {
    list: runsListCmd,
    show: defineCommand({ meta: { name: "show", description: runtimeLeaves.task.meta.description }, args: runtimeLeaves.task.args, run: runtimeLeaves.task.run }),
    events: runtimeLeaves.events,
    replay: runsReplayCmd,
    resume: runtimeLeaves.resume,
    job: defineCommand({ meta: { name: "job", description: "Run a ge command as a background run; pass args after --" }, args: runtimeLeaves.startJob.args, run: runtimeLeaves.startJob.run }),
  },
});
