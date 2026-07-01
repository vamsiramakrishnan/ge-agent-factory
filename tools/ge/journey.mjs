// tools/ge/journey.mjs — `ge journey plan|status|run` (user journey:
// interview → spec → data → simulator → build → eval → preview → deploy).
// Moved verbatim out of tools/ge.mjs.
import { defineCommand } from "citty";
import { buildJourneyPlan } from "../lib/journey-plan.mjs";
import {
  common, cfgFrom, emit, out, pc, core,
  daemonPort, daemonStatusSnapshot, daemonRequest, parseIds,
  renderMissionGraph, renderJourneyPlan,
} from "./shared.mjs";

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

export const journey = defineCommand({
  meta: { name: "journey", description: "User journey: interview → spec → data → simulator → build → eval → preview → deploy" },
  subCommands: { plan: journeyPlanCmd, status: journeyStatusCmd, run: journeyRunCmd },
});
