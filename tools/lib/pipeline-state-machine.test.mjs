import { expect, test, describe } from "bun:test";
import {
  STAGES, BUILD_BOUNDARY, stageOwner, nextStage, isTerminal, planWorkItem,
  resetTransition, applyTransition, reduceTransitions, RESET_STAGE,
} from "./pipeline-state-machine.mjs";

describe("stage ordering + ownership", () => {
  test("build boundary splits local from cloud", () => {
    expect(stageOwner("created")).toBe("local");
    expect(stageOwner(BUILD_BOUNDARY)).toBe("local");
    expect(stageOwner("deploy_planned")).toBe("cloud");
    expect(stageOwner("published")).toBe("cloud");
    expect(stageOwner("nonsense")).toBe("unknown");
  });
  test("nextStage advances one step, capped at target", () => {
    expect(nextStage("created", "published")).toBe("validated");
    expect(nextStage("previewed", "published")).toBe("deploy_planned");
    expect(nextStage("previewed", "previewed")).toBeNull();
    expect(nextStage("published", "published")).toBeNull();
  });
  test("isTerminal when at or past target", () => {
    expect(isTerminal({ stage: "previewed", status: "done" }, "previewed")).toBe(true);
    expect(isTerminal({ stage: "validated", status: "done" }, "previewed")).toBe(false);
    expect(isTerminal({ stage: "previewed", status: "failed" }, "previewed")).toBe(false);
  });
});

describe("planWorkItem — local mode", () => {
  test("advances local stages via the harness", () => {
    expect(planWorkItem({ stage: "created", status: "done" }, { targetStage: "previewed", mode: "local" }))
      .toMatchObject({ action: "build_local", nextStage: "validated", owner: "local" });
  });
  test("ships once the next stage is past the build boundary", () => {
    expect(planWorkItem({ stage: "previewed", status: "done" }, { targetStage: "published", mode: "local" }))
      .toMatchObject({ action: "handoff", nextStage: "deploy_planned", owner: "cloud" });
  });
  test("retry on a failed stage", () => {
    expect(planWorkItem({ stage: "validated", status: "failed" }, { targetStage: "previewed", mode: "local" }))
      .toMatchObject({ action: "retry", nextStage: "validated", terminal: false });
  });
  test("none at target", () => {
    expect(planWorkItem({ stage: "previewed", status: "done" }, { targetStage: "previewed", mode: "local" }))
      .toMatchObject({ action: "none", terminal: true });
  });
  test("a fresh item plans the first build", () => {
    expect(planWorkItem({}, { targetStage: "previewed", mode: "local" }))
      .toMatchObject({ action: "build_local", nextStage: "created" });
  });
});

describe("planWorkItem — remote mode", () => {
  test("cloud factory advances every stage", () => {
    expect(planWorkItem({ stage: "created", status: "done" }, { targetStage: "published", mode: "remote" }))
      .toMatchObject({ action: "advance_remote", nextStage: "validated" });
    expect(planWorkItem({ stage: "previewed", status: "done" }, { targetStage: "published", mode: "remote" }))
      .toMatchObject({ action: "advance_remote", nextStage: "deploy_planned" });
  });
});

describe("transitions reducer", () => {
  test("advances forward only", () => {
    let s = applyTransition(undefined, { stage: "created", status: "done" });
    s = applyTransition(s, { stage: "previewed", status: "done" });
    s = applyTransition(s, { stage: "created", status: "started" }); // late, earlier
    expect(s.stage).toBe("previewed");
  });
  test("reset rewinds to created", () => {
    let s = reduceTransitions([
      { stage: "created", status: "done" },
      { stage: "previewed", status: "done" },
    ]);
    expect(s.stage).toBe("previewed");
    s = applyTransition(s, resetTransition("a"));
    expect(s).toMatchObject({ stage: RESET_STAGE, status: "reset" });
  });
  test("reduceTransitions folds a sequence to final state", () => {
    const s = reduceTransitions([
      { stage: "created", status: "done" },
      { stage: "validated", status: "failed", error: "boom" },
    ]);
    expect(s).toMatchObject({ stage: "validated", status: "failed", error: "boom" });
  });
});

test("STAGES is the canonical ordered list", () => {
  expect(STAGES[0]).toBe("planned");
  expect(STAGES[STAGES.length - 1]).toBe("published");
  expect(STAGES).toContain(BUILD_BOUNDARY);
});
