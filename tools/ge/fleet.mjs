// tools/ge/fleet.mjs — `ge fleet status|repair|repairs`.
//
// THE canonical noun for many-agent state and convergence. `status` is the
// roster health view (formerly `ge agents fleet`); `repair` converges blocked
// agents to a target stage (formerly `ge autopilot run` — daemon task kind
// `repair.run`, persisted wire kind `autopilot.run`); `repairs` lists/inspects
// repair runs (formerly `ge autopilot status`). The old spellings remain as
// deprecated aliases in tools/ge/autopilot.mjs and under `ge agents fleet`.
import { defineCommand } from "citty";
import {
  guarded, common, cfgFrom, emit, out, pc, core,
  daemonPort, daemonStatusSnapshot, daemonRequest, parseIds,
  renderRepairSummary, statusText, followTaskEvents,
} from "./shared.mjs";

async function requireDaemon(args) {
  const port = daemonPort(args);
  const daemon = await daemonStatusSnapshot(port);
  if (!daemon.ok) throw new Error(`ge daemon is ${daemon.status || "stopped"}; run: ge daemon start`);
  return port;
}

export const fleetStatusCmd = defineCommand({
  meta: { name: "status", description: "Fleet pipeline health, bottlenecks, and repair owners" },
  args: { ...common, limit: { type: "string", description: "Max bottlenecks to list (default 8)" } },
  run: guarded(async ({ args }) => {
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
      out(pc.dim("\n  next: ge fleet repair --ids <comma-ids> --target-stage preview"));
    });
  }),
});

export const fleetRepairCmd = defineCommand({
  meta: { name: "repair", description: "Converge blocked agents to a target stage: observe blockers → repair → retry" },
  args: {
    ...common,
    ids: { type: "string", description: "Comma-separated agent/workspace ids (default: current repair queue)" },
    "target-stage": { type: "string", description: "Gate to converge to (default preview)" },
    "no-repair": { type: "boolean", description: "Observe blockers without running repair" },
    attempts: { type: "string", description: "Repair attempts per item (default 3)" },
    "run-preview": { type: "boolean", description: "Run preview after repair when supported" },
    follow: { type: "boolean", description: "Stay attached and stream the run's live events" },
    port: { type: "string", description: "Daemon port (default 17654)" },
  },
  run: guarded(async ({ args }) => {
    const port = await requireDaemon(args);
    const targetStage = args["target-stage"] || "preview";
    const attempts = Number(args.attempts || 3);
    const task = await daemonRequest(port, "/api/tasks", {
      method: "POST",
      timeoutMs: 10000,
      body: {
        kind: "repair.run",
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
      renderRepairSummary(t);
      if (!args.follow) {
        out(pc.dim(`\n  watch: ge fleet repairs ${t.id}`));
        out(pc.dim(`  events: ge runs events ${t.id} --follow`));
        out(pc.dim(`  (or start with --follow to stream events inline)`));
      }
    });
    if (args.follow && !args.json) await followTaskEvents(port, task.id);
  }),
});

export const fleetRepairsCmd = defineCommand({
  meta: { name: "repairs", description: "Show one repair run, or list recent repair runs" },
  args: {
    id: { type: "positional", required: false, description: "Repair run id (omit to list recent runs)" },
    json: { type: "boolean", description: "Machine-readable JSON result on stdout" },
    port: { type: "string", description: "Daemon port (default 17654)" },
    limit: { type: "string", description: "Recent repair run count when no id is provided" },
  },
  run: guarded(async ({ args }) => {
    const port = await requireDaemon(args);
    if (args.id) {
      const task = await daemonRequest(port, `/api/tasks/${encodeURIComponent(args.id)}`, { timeoutMs: 3000 });
      emit(args, task, renderRepairSummary);
      return;
    }
    const body = await daemonRequest(port, `/api/tasks?limit=${encodeURIComponent(args.limit || "50")}`, { timeoutMs: 3000 });
    const tasks = (body.tasks || []).filter((task) => task.kind === "autopilot.run");
    emit(args, { tasks, daemon: { ok: true, port } }, (r) => {
      out(pc.bold("\nRepair Runs"));
      out(`  daemon    ${pc.green("healthy")}  ${pc.dim(`http://127.0.0.1:${port}`)}`);
      if (!r.tasks.length) {
        out(pc.dim("  no recent repair runs — start one: ge fleet repair --ids <comma-ids>"));
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

export const fleet = defineCommand({
  meta: { name: "fleet", description: "Many-agent state and convergence: status · repair · repairs" },
  subCommands: { status: fleetStatusCmd, repair: fleetRepairCmd, repairs: fleetRepairsCmd },
});
