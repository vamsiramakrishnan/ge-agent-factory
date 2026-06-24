import { expect, test } from "bun:test";
import {
  autopilotCounts,
  autopilotItemsFromMission,
  createAutopilotItemState,
  createAutopilotRunState,
  runAutopilotConvergence,
} from "./autopilot-runner.mjs";

test("autopilotItemsFromMission selects doctor and remote observation items", () => {
  const mission = {
    roster: [
      { agentId: "a1", workspaceId: "w1", autopilotAction: "doctor_repair" },
      { agentId: "a2", workspaceId: "w2", autopilotAction: "observe_remote_run" },
      { agentId: "a3", workspaceId: "w3", autopilotAction: "after_factory_output" },
    ],
  };
  expect(autopilotItemsFromMission(mission)).toEqual([
    { agentId: "a1", workspaceId: "w1" },
    { agentId: "a2", workspaceId: "w2" },
  ]);
});

test("runAutopilotConvergence records remote observation as passed", async () => {
  const run = createAutopilotRunState({
    id: "auto-1",
    targetStage: "preview",
    options: { mission: { modeContract: { autopilotCapability: "remote_observe_only" } } },
    items: [createAutopilotItemState({ runId: "auto-1", targetStage: "preview", agentId: "a1", workspaceId: "w1" })],
  });
  const updates = [];
  const events = [];
  const result = await runAutopilotConvergence({
    run,
    items: [createAutopilotItemState({ runId: "auto-1", targetStage: "preview", agentId: "a1", workspaceId: "w1" })],
    core: {},
    cfg: {},
    emit: (event) => events.push(event),
    updateItem: (item) => updates.push(item),
  });

  expect(result.status).toBe("done");
  expect(result.items[0].status).toBe("passed");
  expect(updates.at(-1).doctor.kind).toBe("ge.remote_factory_observation");
  expect(events.some((event) => event.type === "item_observed")).toBe(true);
});

test("runAutopilotConvergence blocks when repair is disabled", async () => {
  const item = createAutopilotItemState({ runId: "auto-2", targetStage: "preview", agentId: "a1", workspaceId: "w1" });
  const run = createAutopilotRunState({ id: "auto-2", targetStage: "preview", options: { mission: {} }, items: [item] });
  const result = await runAutopilotConvergence({
    run,
    items: [item],
    repair: false,
    cfg: {},
    core: {
      workspaceDoctor: () => ({ ok: false, blockers: [{ id: "missing-file", message: "missing file" }] }),
    },
    updateItem: () => {},
  });

  expect(result.status).toBe("blocked");
  expect(result.items[0].status).toBe("blocked");
  expect(result.items[0].nextAction).toBe("repair");
  expect(autopilotCounts(result.items)).toMatchObject({ total: 1, blocked: 1 });
});
