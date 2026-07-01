// tools/ge/autopilot.mjs — `ge autopilot run|status|events` (daemon-native
// Autopilot). Moved verbatim out of tools/ge.mjs.
import { defineCommand } from "citty";
import {
  guarded, common, emit, out, pc,
  daemonPort, daemonStatusSnapshot, daemonRequest, parseIds,
  renderAutopilotSummary, statusText,
} from "./shared.mjs";

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
  run: guarded(async ({ args }) => {
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
  }),
});

const autopilotStatus = defineCommand({
  meta: { name: "status", description: "Show one Autopilot run, or list recent daemon-native Autopilot runs" },
  args: {
    id: { type: "positional", required: false },
    json: { type: "boolean", description: "Machine-readable JSON result on stdout" },
    port: { type: "string", description: "Daemon port (default 17654)" },
    limit: { type: "string", description: "Recent Autopilot run count when no id is provided" },
  },
  run: guarded(async ({ args }) => {
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
  }),
});

const autopilotEvents = defineCommand({
  meta: { name: "events", description: "Show daemon-native Autopilot task events" },
  args: {
    id: { type: "positional", required: true },
    json: { type: "boolean", description: "Machine-readable JSON result on stdout" },
    port: { type: "string", description: "Daemon port (default 17654)" },
  },
  run: guarded(async ({ args }) => {
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
  }),
});

export const autopilot = defineCommand({
  meta: { name: "autopilot", description: "Daemon-native Autopilot: run · status · events" },
  subCommands: { run: autopilotRun, status: autopilotStatus, events: autopilotEvents },
});
