import { test, expect } from "bun:test";
import { buildFactoryRepairPipeline } from "./fleet-repair-plan.mjs";

test("pipeline splits missing workspaces to factory and existing workspaces to repair", () => {
  const pipeline = buildFactoryRepairPipeline({
    cfg: { mode: "local" },
    now: "2026-06-06T00:00:00.000Z",
    targetStage: "publish:plan",
    fleet: {
      agents: [
        { id: "a1", title: "Agent 1", department: "hr", status: "submitted", workspaceId: "ws-a1" },
        { id: "a2", title: "Agent 2", department: "finance", status: "none", workspaceId: null },
      ],
    },
    ids: ["a1", "a2"],
  });

  expect(pipeline.kind).toBe("ge.factory_repair.pipeline");
  expect(pipeline.target.workspaceGate).toBe("publish:plan");
  expect(pipeline.modeContract.repairCapability).toBe("local_doctor_repair");
  expect(pipeline.target.effectiveFactoryTarget).toBe("publish_planned");
  expect(pipeline.target.cloudContinuation.commandId).toBe("handoff");
  expect(pipeline.summary).toEqual(expect.objectContaining({
    selected: 2,
    factory: 1,
    repair: 1,
    remoteObserve: 0,
    repairAfterFactory: 1,
    missingWorkspaces: 1,
    existingWorkspaces: 1,
  }));
  expect(pipeline.roster.find((item) => item.agentId === "a1").repairAction).toBe("doctor_repair");
  expect(pipeline.roster.find((item) => item.agentId === "a2").factoryAction).toBe("build_local");
  expect(pipeline.phases.find((phase) => phase.id === "factory").command.commandId).toBe("agents.build.local");
});

test("remote pipeline observes existing runs instead of local repair", () => {
  const pipeline = buildFactoryRepairPipeline({
    cfg: { mode: "remote" },
    now: "2026-06-06T00:00:00.000Z",
    targetStage: "deploy:plan",
    fleet: {
      agents: [
        { id: "a1", status: "submitted", runId: "run-1", workspaceId: null },
        { id: "a2", status: "none", runId: null, workspaceId: null },
      ],
    },
  });
  expect(pipeline.modeContract.repairCapability).toBe("remote_observe_only");
  expect(pipeline.target.effectiveFactoryTarget).toBe("plan_deploy");
  expect(pipeline.summary.factory).toBe(1);
  expect(pipeline.summary.repair).toBe(0);
  expect(pipeline.summary.remoteObserve).toBe(1);
  expect(pipeline.roster.find((item) => item.agentId === "a1").repairAction).toBe("observe_remote_run");
  expect(pipeline.roster.find((item) => item.agentId === "a2").factoryAction).toBe("build_remote");
});

test("pipeline defaults unknown target and mode to remote preview contract", () => {
  const pipeline = buildFactoryRepairPipeline({
    cfg: { mode: "unexpected" },
    now: "2026-06-06T00:00:00.000Z",
    targetStage: "unknown",
    fleet: { agents: [{ id: "a1", status: "none" }] },
  });
  expect(pipeline.mode).toBe("remote");
  expect(pipeline.target.requested).toBe("preview");
  expect(pipeline.phases.find((phase) => phase.id === "factory").command.commandId).toBe("agents.build");
});
