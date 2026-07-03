import { test, expect } from "bun:test";
import { buildFactoryAutopilotMission } from "./factory-autopilot-mission.mjs";

test("mission splits missing workspaces to factory and existing workspaces to autopilot", () => {
  const mission = buildFactoryAutopilotMission({
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

  expect(mission.kind).toBe("ge.factory_autopilot.mission");
  expect(mission.target.workspaceGate).toBe("publish:plan");
  expect(mission.modeContract.autopilotCapability).toBe("local_doctor_repair");
  expect(mission.target.effectiveFactoryTarget).toBe("publish_planned");
  expect(mission.target.cloudContinuation.commandId).toBe("agents.ship");
  expect(mission.summary).toEqual(expect.objectContaining({
    selected: 2,
    factory: 1,
    autopilot: 1,
    remoteObserve: 0,
    autopilotAfterFactory: 1,
    missingWorkspaces: 1,
    existingWorkspaces: 1,
  }));
  expect(mission.roster.find((item) => item.agentId === "a1").autopilotAction).toBe("doctor_repair");
  expect(mission.roster.find((item) => item.agentId === "a2").factoryAction).toBe("build_local");
  expect(mission.phases.find((phase) => phase.id === "factory").command.commandId).toBe("agents.build.local");
});

test("remote mission observes existing runs instead of local repair", () => {
  const mission = buildFactoryAutopilotMission({
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
  expect(mission.modeContract.autopilotCapability).toBe("remote_observe_only");
  expect(mission.target.effectiveFactoryTarget).toBe("plan_deploy");
  expect(mission.summary.factory).toBe(1);
  expect(mission.summary.autopilot).toBe(0);
  expect(mission.summary.remoteObserve).toBe(1);
  expect(mission.roster.find((item) => item.agentId === "a1").autopilotAction).toBe("observe_remote_run");
  expect(mission.roster.find((item) => item.agentId === "a2").factoryAction).toBe("build_remote");
});

test("mission defaults unknown target and mode to remote preview contract", () => {
  const mission = buildFactoryAutopilotMission({
    cfg: { mode: "unexpected" },
    now: "2026-06-06T00:00:00.000Z",
    targetStage: "unknown",
    fleet: { agents: [{ id: "a1", status: "none" }] },
  });
  expect(mission.mode).toBe("remote");
  expect(mission.target.requested).toBe("preview");
  expect(mission.phases.find((phase) => phase.id === "factory").command.commandId).toBe("agents.build");
});
