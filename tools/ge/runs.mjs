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
  guarded, emit, out, pc, ui, core, statusText,
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
      out(ui.title("Runs"));
      out(ui.kv([{ key: "daemon", value: r.daemon.ok ? pc.green("healthy") : pc.yellow(r.daemon.status), note: `http://127.0.0.1:${port}` }]));
      if (!r.runs.length) {
        out(pc.dim("  no runs recorded yet — start one:"));
        out(ui.nextList(["ge pipeline run", "ge agents build", "ge fleet repair"]));
        return;
      }
      out("");
      out(ui.columns(r.runs, [
        { header: "status", value: (row) => statusText(row.status) },
        { header: "source", value: (row) => pc.dim(row.source) },
        { header: "kind", value: (row) => String(row.kind) },
        { header: "id", value: (row) => String(row.id) },
        { header: "detail", value: (row) => pc.dim(row.detail || row.updatedAt) },
      ]));
      out("\n" + ui.nextList([
        { command: "ge runs show <id>", note: "detail" },
        { command: "ge runs events <id> --follow", note: "follow" },
        { command: "ge runs replay <id>", note: "replay" },
      ]));
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
    if (!args.json) out(ui.title(`Replay ${args.id}`, `${events.length} events${args.instant ? "" : ` · ${Number(args.speed || 10)}× speed`}`));
    const seqW = Math.max(...events.map(({ seq }) => String(seq).length), 4);
    const typeW = Math.max(...events.map(({ event }) => String(event.type || "").length), 0);
    for (let i = 0; i < events.length; i += 1) {
      if (delays && delays[i]) await new Promise((resolve) => setTimeout(resolve, delays[i]));
      const { seq, event } = events[i];
      if (args.json) {
        out(JSON.stringify({ seq, event }));
        continue;
      }
      const tone = event.level === "error" ? pc.red(event.type) : event.level === "warn" ? pc.yellow(event.type) : pc.cyan(event.type);
      out(`  ${String(seq).padStart(seqW)} ${pc.dim(event.ts || "")} ${ui.padVisible(tone, typeW)} ${event.line || ""}`);
    }
    if (!args.json) out(ui.next(`ge runs show ${args.id}`, "live view"));
  }),
});

// `respond` closes the operator↔run loop for anything driving this CLI (a
// human, CI, or an AI assistant): a running task that pauses on a question
// emits a `ge.interaction.request` event on its stream; this verb submits the
// answer through the same daemon route the console uses. Watch with
// `ge runs events <id> --follow`, answer with `ge runs respond`.
const runsRespondCmd = defineCommand({
  meta: { name: "respond", description: "Answer a running task's pending question (interaction): --answers JSON, --freeform text, or --cancel" },
  args: {
    task: { type: "positional", required: true, description: "Task id (from ge runs list / the event stream)" },
    interaction: { type: "positional", required: true, description: "Interaction id (from the ge.interaction.request event)" },
    answers: { type: "string", description: 'Full responses JSON: [{"questionId":"q1","selectedOptionIds":["a"],"freeformResponse":"..."}]' },
    question: { type: "string", description: "Question id for --freeform/--select (single-question shorthand)" },
    freeform: { type: "string", description: "Freeform answer text (with --question)" },
    select: { type: "string", description: "Comma-separated option ids to select (with --question)" },
    cancel: { type: "boolean", description: "Cancel the interaction instead of answering" },
    json: { type: "boolean", description: "Machine-readable JSON result on stdout" },
    port: { type: "string", description: "Daemon port (default 17654)" },
  },
  run: guarded(async ({ args }) => {
    let responses = [];
    if (args.answers) responses = JSON.parse(args.answers);
    else if (args.question) {
      responses = [{
        questionId: args.question,
        ...(args.select ? { selectedOptionIds: String(args.select).split(",").map((option) => option.trim()).filter(Boolean) } : {}),
        ...(args.freeform ? { freeformResponse: args.freeform } : {}),
      }];
    }
    const result = await daemonRequest(daemonPort(args), `/api/tasks/${encodeURIComponent(args.task)}/interactions/${encodeURIComponent(args.interaction)}`, {
      method: "POST",
      body: { cancelled: !!args.cancel, responses },
    });
    emit(args, result, (r) => {
      out(ui.kv([
        ["submitted", pc.green(args.interaction)],
        ["answers", String(r.responseCount ?? responses.length)],
        args.cancel && ["cancelled", pc.yellow("yes")],
      ]));
      out(ui.next(`ge runs events ${args.task} --follow`, "watch the task pick the answer up"));
    });
  }),
});

export const runs = defineCommand({
  meta: { name: "runs", description: "Run activity across every kind: list · show · events · replay · resume · respond · job" },
  subCommands: {
    list: runsListCmd,
    show: defineCommand({ meta: { name: "show", description: runtimeLeaves.task.meta.description }, args: runtimeLeaves.task.args, run: runtimeLeaves.task.run }),
    events: runtimeLeaves.events,
    replay: runsReplayCmd,
    resume: runtimeLeaves.resume,
    respond: runsRespondCmd,
    job: defineCommand({ meta: { name: "job", description: "Run a ge command as a background run; pass args after --" }, args: runtimeLeaves.startJob.args, run: runtimeLeaves.startJob.run }),
  },
});
