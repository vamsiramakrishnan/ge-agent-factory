import { expect, test } from "bun:test";
import {
  repairCounts,
  repairItemsFromPipeline,
  createRepairItemState,
  createRepairRunState,
  runRepairConvergence,
} from "./repair-runner.mjs";

test("repairItemsFromPipeline selects doctor and remote observation items", () => {
  const pipeline = {
    roster: [
      { agentId: "a1", workspaceId: "w1", repairAction: "doctor_repair" },
      { agentId: "a2", workspaceId: "w2", repairAction: "observe_remote_run" },
      { agentId: "a3", workspaceId: "w3", repairAction: "after_factory_output" },
    ],
  };
  expect(repairItemsFromPipeline(pipeline)).toEqual([
    { agentId: "a1", workspaceId: "w1" },
    { agentId: "a2", workspaceId: "w2" },
  ]);
});

test("runRepairConvergence records remote observation as passed", async () => {
  const run = createRepairRunState({
    id: "auto-1",
    targetStage: "preview",
    options: { pipeline: { modeContract: { repairCapability: "remote_observe_only" } } },
    items: [createRepairItemState({ runId: "auto-1", targetStage: "preview", agentId: "a1", workspaceId: "w1" })],
  });
  const updates = [];
  const events = [];
  const result = await runRepairConvergence({
    run,
    items: [createRepairItemState({ runId: "auto-1", targetStage: "preview", agentId: "a1", workspaceId: "w1" })],
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

test("runRepairConvergence blocks when repair is disabled", async () => {
  const item = createRepairItemState({ runId: "auto-2", targetStage: "preview", agentId: "a1", workspaceId: "w1" });
  const run = createRepairRunState({ id: "auto-2", targetStage: "preview", options: { pipeline: {} }, items: [item] });
  const result = await runRepairConvergence({
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
  expect(repairCounts(result.items)).toMatchObject({ total: 1, blocked: 1 });
});
