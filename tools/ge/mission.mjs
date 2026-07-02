// tools/ge/mission.mjs — `ge mission plan|run|status|resume`. Moved verbatim
// out of tools/ge.mjs.
import { defineCommand } from "citty";
import { buildMissionGraph } from "../lib/mission/mission-plan.mjs";
import {
  guarded, common, cfgFrom, emit, out, pc,
  daemonPort, daemonStatusSnapshot, daemonRequest, parseIds,
  renderMissionGraph, renderResumePlan, statusText,
} from "./shared.mjs";

const missionPlanCmd = defineCommand({
  meta: { name: "plan", description: "Build a mission graph DAG without running it" },
  args: {
    ...common,
    ids: { type: "string", description: "Comma-separated agent/workspace ids" },
    scenario: { type: "string", description: "Scenario/use-case id for data and simulator graph nodes" },
    workspace: { type: "string", description: "Scenario workspace path (default .ge/missions/<scenario>)" },
    systems: { type: "string", description: "Comma-separated simulator system ids to validate" },
    "target-stage": { type: "string", description: "Target convergence stage (default preview)" },
    attempts: { type: "string", description: "Repair attempts per item (default 3)" },
    "run-preview": { type: "boolean", description: "Run preview after repair when supported" },
    "with-factory": { type: "boolean", description: "Include factory build as an auto-run node" },
    "no-antigravity": { type: "boolean", description: "Do not include the Antigravity spec/data review node" },
    "harness-agent": { type: "string", description: "Harness agent for mission review node (default antigravity-sdk)" },
    model: { type: "string", description: "Model for the Antigravity mission review node" },
    location: { type: "string", description: "Location for the Antigravity mission review node" },
  },
  run: guarded(({ args }) => {
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
  }),
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
    attempts: { type: "string", description: "Repair attempts per item (default 3)" },
    "run-preview": { type: "boolean", description: "Run preview after repair when supported" },
    "with-factory": { type: "boolean", description: "Actually schedule the factory build node" },
    "no-antigravity": { type: "boolean", description: "Do not include the Antigravity spec/data review node" },
    "harness-agent": { type: "string", description: "Harness agent for mission review node (default antigravity-sdk)" },
    model: { type: "string", description: "Model for the Antigravity mission review node" },
    location: { type: "string", description: "Location for the Antigravity mission review node" },
    port: { type: "string", description: "Daemon port (default 17654)" },
  },
  run: guarded(async ({ args }) => {
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
  }),
});

const missionStatusCmd = defineCommand({
  meta: { name: "status", description: "Show one mission graph, or list recent mission runs" },
  args: { id: { type: "positional", required: false, description: "Mission task id (omit to list recent runs)" }, json: { type: "boolean", description: "Machine-readable JSON result on stdout" }, port: { type: "string", description: "Daemon port (default 17654)" }, limit: { type: "string", description: "Recent mission run count when no id is provided" } },
  run: guarded(async ({ args }) => {
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
  }),
});

const missionResumeCmd = defineCommand({
  meta: { name: "resume", description: "Resume a mission run via its runtime resume plan" },
  args: { id: { type: "positional", required: true, description: "Mission task id" }, json: { type: "boolean", description: "Machine-readable JSON result on stdout" }, port: { type: "string", description: "Daemon port (default 17654)" } },
  run: guarded(async ({ args }) => {
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
  }),
});

export const mission = defineCommand({
  meta: { name: "mission", description: "Mission graph: plan · run · status · resume" },
  subCommands: { plan: missionPlanCmd, run: missionRunCmd, status: missionStatusCmd, resume: missionResumeCmd },
});
