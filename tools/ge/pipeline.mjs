// tools/ge/pipeline.mjs — `ge pipeline plan|run|status|resume|graph|runs`.
//
// THE canonical noun for taking specs through the factory. This group absorbs
// two former surfaces that described the same thing from different angles:
//   · `ge journey`  — the user-facing stage view (interview → … → deploy)
//   · `ge mission`  — the executable orchestration DAG behind it
// A "pipeline run" is one execution of that DAG (daemon task kind
// `pipeline.run`; persisted wire kind `mission.run` — see TASK_KIND_ALIASES in
// tools/lib/runtime-daemon.mjs). The old groups remain as deprecated aliases
// in tools/ge/journey.mjs and tools/ge/mission.mjs.
import { defineCommand } from "citty";
import { buildJourneyPlan } from "../lib/journey-plan.mjs";
import { buildMissionGraph } from "../lib/mission/mission-plan.mjs";
import {
  guarded, common, cfgFrom, emit, out, pc, core,
  daemonPort, daemonStatusSnapshot, daemonRequest, parseIds,
  renderMissionGraph, renderJourneyPlan, renderResumePlan, statusText,
  followTaskEvents,
} from "./shared.mjs";

const pipelineArgs = {
  ...common,
  ids: { type: "string", description: "Comma-separated agent/workspace ids" },
  scenario: { type: "string", description: "Scenario/use-case id" },
  usecase: { type: "string", description: "Use case id from interview/spec registry" },
  systems: { type: "string", description: "Comma-separated source-system simulator ids" },
  "target-stage": { type: "string", description: "Target stage (default preview)" },
  port: { type: "string", description: "Daemon port (default 17654)" },
};

const runArgs = {
  ...pipelineArgs,
  workspace: { type: "string", description: "Scenario workspace path (default .ge/missions/<scenario>)" },
  attempts: { type: "string", description: "Repair attempts per item (default 3)" },
  "run-preview": { type: "boolean", description: "Run preview after repair when supported" },
  "with-factory": { type: "boolean", description: "Actually schedule the factory build node" },
  "no-antigravity": { type: "boolean", description: "Do not include the Antigravity spec/data review node" },
  "harness-agent": { type: "string", description: "Harness agent for the review node (default antigravity-sdk)" },
  model: { type: "string", description: "Model for the Antigravity review node" },
  location: { type: "string", description: "Location for the Antigravity review node" },
  follow: { type: "boolean", description: "Stay attached and stream the run's live events" },
};

async function pipelineTasks(args) {
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

async function requireDaemon(args) {
  const port = daemonPort(args);
  const daemon = await daemonStatusSnapshot(port);
  if (!daemon.ok) throw new Error(`ge daemon is ${daemon.status || "stopped"}; run: ge daemon start`);
  return port;
}

// ── plan: the user-facing stage plan, before anything runs ──────────────────
export const pipelinePlanCmd = defineCommand({
  meta: { name: "plan", description: "Show the pipeline plan for a spec/scenario (stages, owners, first commands)" },
  args: pipelineArgs,
  run: guarded(async ({ args }) => {
    const cfg = cfgFrom(args);
    const journey = await core.journeyPlan(cfg, {
      scenario: args.scenario || null,
      usecaseId: args.usecase || null,
      systems: parseIds(args.systems),
      ids: parseIds(args.ids),
      targetStage: args["target-stage"] || "preview",
      tasks: [],
    });
    emit(args, journey, renderJourneyPlan);
  }),
});

// ── status: no id → the live stage view; with id → one run's graph ──────────
export const pipelineStatusCmd = defineCommand({
  meta: { name: "status", description: "Pipeline status: bare → the live stage view; with an id → that run's graph + resume plan" },
  args: { id: { type: "positional", required: false, description: "Pipeline run id (omit for the stage view)" }, ...pipelineArgs },
  run: guarded(async ({ args }) => {
    if (args.id) {
      const port = await requireDaemon(args);
      const task = await daemonRequest(port, `/api/tasks/${encodeURIComponent(args.id)}`, { timeoutMs: 3000 });
      emit(args, task, (t) => {
        renderMissionGraph(t.output?.graph || {});
        renderResumePlan(t.summary?.resumePlan);
      });
      return;
    }
    const cfg = cfgFrom(args);
    const tasks = await pipelineTasks(args);
    const [status, fleet] = await Promise.all([Promise.resolve(core.statusBoard(cfg)), core.fleetStatus(cfg)]);
    const latestRun = tasks.find((task) => task.kind === "mission.run" && task.output?.graph);
    const journey = buildJourneyPlan({
      scenario: args.scenario || latestRun?.input?.scenario || null,
      usecaseId: args.usecase || null,
      systems: parseIds(args.systems || latestRun?.input?.systems?.join?.(",") || ""),
      ids: parseIds(args.ids || latestRun?.input?.ids?.join?.(",") || ""),
      targetStage: args["target-stage"] || latestRun?.input?.targetStage || "preview",
      mode: cfg.mode || "local",
      status,
      fleet,
      tasks,
      graph: latestRun?.output?.graph || null,
      includePlannedMission: !latestRun,
    });
    emit(args, journey, renderJourneyPlan);
  }),
});

// ── runs: recent pipeline runs ───────────────────────────────────────────────
export const pipelineRunsCmd = defineCommand({
  meta: { name: "runs", description: "List recent pipeline runs" },
  args: { json: { type: "boolean", description: "Machine-readable JSON result on stdout" }, port: { type: "string", description: "Daemon port (default 17654)" }, limit: { type: "string", description: "Max runs to list (default 20)" } },
  run: guarded(async ({ args }) => {
    const port = await requireDaemon(args);
    const body = await daemonRequest(port, `/api/tasks?limit=${encodeURIComponent(args.limit || "50")}`, { timeoutMs: 3000 });
    const tasks = (body.tasks || []).filter((task) => task.kind === "mission.run");
    emit(args, { tasks }, (r) => {
      out(pc.bold("\nPipeline Runs"));
      if (!r.tasks.length) {
        out(pc.dim("  no recent pipeline runs — start one: ge pipeline run --scenario <scenario>"));
        return;
      }
      for (const task of r.tasks.slice(0, Math.max(1, Math.min(Number(args.limit) || 20, 200)))) {
        const counts = task.counts || {};
        out(`  ${statusText(task.status).padEnd(14)} ${String(task.id).padEnd(30)} ${counts.done || 0}/${counts.blocked || 0}/${counts.pending || 0}/${counts.total || 0}`);
      }
      out(pc.dim("\n  detail: ge pipeline status <id>   ·   events: ge runs events <id> --follow"));
    });
  }),
});

// ── run: start a pipeline run (the orchestration graph, on the daemon) ──────
export const pipelineRunCmd = defineCommand({
  meta: { name: "run", description: "Start a pipeline run: the durable orchestration graph on the daemon" },
  args: runArgs,
  run: guarded(async ({ args }) => {
    const port = await requireDaemon(args);
    const attempts = Number(args.attempts || 3);
    const task = await daemonRequest(port, "/api/tasks", {
      method: "POST",
      timeoutMs: 10000,
      body: {
        kind: "pipeline.run",
        ids: parseIds(args.ids),
        scenario: args.scenario || args.usecase,
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
          location: args.location || "global",
          model: args.model || "gemini-3.5-flash",
          agentIdentityOrgId: args.agentIdentityOrgId,
        },
      },
    });
    emit(args, task, (t) => {
      out(pc.green(`✓ started pipeline run ${t.id}`));
      if (t.output?.graph) renderMissionGraph(t.output.graph);
      if (!args.follow) {
        out(pc.dim(`\n  status: ge pipeline status ${t.id}`));
        out(pc.dim(`  events: ge runs events ${t.id} --follow`));
        out(pc.dim(`  (or start with --follow to stream events inline)`));
      }
    });
    if (args.follow && !args.json) await followTaskEvents(port, task.id);
  }),
});

// ── resume: continue a blocked/interrupted pipeline run ─────────────────────
export const pipelineResumeCmd = defineCommand({
  meta: { name: "resume", description: "Resume a pipeline run via its deterministic resume plan" },
  args: { id: { type: "positional", required: true, description: "Pipeline run id" }, json: { type: "boolean", description: "Machine-readable JSON result on stdout" }, port: { type: "string", description: "Daemon port (default 17654)" } },
  run: guarded(async ({ args }) => {
    const port = await requireDaemon(args);
    const task = await daemonRequest(port, `/api/tasks/${encodeURIComponent(args.id)}/resume`, { method: "POST", timeoutMs: 5000 });
    emit(args, task, (t) => {
      out(pc.bold(`\nPipeline Resume ${t.id}`));
      out(`  status    ${statusText(t.status)}`);
      renderResumePlan(t.summary?.resumePlan);
      out(pc.dim(`\n  events: ge runs events ${t.id} --follow`));
    });
  }),
});

// ── graph: preview the orchestration DAG without running it ─────────────────
export const pipelineGraphCmd = defineCommand({
  meta: { name: "graph", description: "Build the pipeline's orchestration DAG without running it" },
  args: {
    ...runArgs,
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

export const pipeline = defineCommand({
  meta: { name: "pipeline", description: "The spec-to-deploy pipeline: plan · run · status · resume · graph · runs" },
  subCommands: {
    plan: pipelinePlanCmd,
    run: pipelineRunCmd,
    status: pipelineStatusCmd,
    resume: pipelineResumeCmd,
    graph: pipelineGraphCmd,
    runs: pipelineRunsCmd,
  },
});
