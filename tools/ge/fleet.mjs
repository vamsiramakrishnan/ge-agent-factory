// tools/ge/fleet.mjs — `ge fleet status|repair|repairs`.
//
// THE canonical noun for many-agent state and convergence. `status` is the
// roster health view; `repair` converges blocked agents to a target stage
// (daemon task kind `repair.run`, which is also the persisted wire kind);
// `repairs` lists/inspects repair runs.
import { defineCommand } from "citty";
import {
  guarded, common, cfgFrom, emit, out, pc, ui, core,
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
      out(ui.title("Fleet Health", `${r.total} agents`));
      out(`  ${ui.glyph("blocked")} ${pc.red("blocked")} ${health.blocked || 0}   ${ui.glyph("warning")} ${pc.yellow("repairable")} ${health.repairable || 0}`);
      if (health.byStage) {
        out(ui.section("By stage"));
        out(ui.kv((health.stages || Object.keys(health.byStage)).map((stage) => [String(stage), String(health.byStage[stage] || 0)])));
      }
      if (health.byOwner) {
        out(ui.section("By owner"));
        out(ui.kv(Object.entries(health.byOwner).sort((a, b) => b[1] - a[1]).map(([owner, count]) => [String(owner), String(count)])));
      }
      const bottlenecks = (health.bottlenecks || []).slice(0, Number(args.limit || 8));
      if (bottlenecks.length) {
        out(ui.section("Top bottlenecks"));
        const countW = Math.max(...bottlenecks.map((item) => String(item.count).length), 0);
        const stageW = Math.max(...bottlenecks.map((item) => String(item.stage).length), 0);
        for (const item of bottlenecks) {
          out(`  ${pc.yellow(String(item.count).padStart(countW))}  ${String(item.stage).padEnd(stageW)}  ${ui.cmd(item.blockerId)} ${pc.dim(item.message)}`);
          if (item.actionPlan?.commands?.[0]) out(pc.dim(`      action: ${item.actionPlan.label} · ${item.actionPlan.commands[0]}`));
          if (item.agentIds?.length) out(pc.dim(`      ${item.agentIds.join(", ")}`));
        }
      }
      out(ui.next("ge fleet repair --ids <comma-ids> --target-stage preview"));
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
        out("\n" + ui.nextList([
          { command: `ge fleet repairs ${t.id}`, note: "watch" },
          { command: `ge runs events ${t.id} --follow`, note: "live events" },
        ]));
        out(pc.dim("  (or start with --follow to stream events inline)"));
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
    const tasks = (body.tasks || []).filter((task) => task.kind === "repair.run");
    emit(args, { tasks, daemon: { ok: true, port } }, (r) => {
      out(ui.title("Repair Runs"));
      out(ui.kv([{ key: "daemon", value: pc.green("healthy"), note: `http://127.0.0.1:${port}` }]));
      if (!r.tasks.length) {
        out(pc.dim("  no recent repair runs — start one:"));
        out(ui.nextList(["ge fleet repair --ids <comma-ids>"]));
        return;
      }
      out("");
      out(ui.columns(r.tasks.slice(0, Math.max(1, Math.min(Number(args.limit) || 20, 200))), [
        { header: "status", value: (task) => statusText(task.output?.run?.status || task.status) },
        { header: "id", value: (task) => String(task.id) },
        { header: "target", value: (task) => pc.dim(task.output?.run?.targetStage || task.input?.targetStage || "preview") },
        { header: "passed/repaired/blocked/total", value: (task) => { const counts = task.output?.counts || task.counts || task.output?.run || {}; return `${counts.passed || 0}/${counts.repaired || 0}/${counts.blocked || 0}/${counts.total || 0}`; } },
      ]));
    });
  }),
});

export const fleet = defineCommand({
  meta: { name: "fleet", description: "Many-agent state and convergence: status · repair · repairs" },
  subCommands: { status: fleetStatusCmd, repair: fleetRepairCmd, repairs: fleetRepairsCmd },
});
