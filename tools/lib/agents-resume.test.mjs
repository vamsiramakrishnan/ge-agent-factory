import { describe, expect, test } from "bun:test";
import { groupResumeActions, resumeCommandFor } from "./agents-resume.mjs";

const row = (over = {}) => ({
  useCaseId: "uc-101",
  workspaceId: "ws-uc-101",
  action: "build_local",
  owner: "local",
  currentStage: "created",
  nextStage: "validated",
  reason: "build → validated on this machine",
  ...over,
});

describe("groupResumeActions", () => {
  test("empty ledger yields no groups", () => {
    expect(groupResumeActions([])).toEqual({ groups: [], done: 0, actionable: 0 });
  });

  test("terminal items count as done, not actionable", () => {
    const { groups, done, actionable } = groupResumeActions([row({ action: "none" }), row({ action: "none" })]);
    expect(groups).toEqual([]);
    expect(done).toBe(2);
    expect(actionable).toBe(0);
  });

  test("local retry folds into the local build group", () => {
    const { groups } = groupResumeActions([
      row({ action: "retry", owner: "local", useCaseId: "uc-1", workspaceId: "ws-1" }),
      row({ action: "build_local", useCaseId: "uc-2", workspaceId: "ws-2" }),
    ]);
    expect(groups).toHaveLength(1);
    expect(groups[0].action).toBe("build_local");
    expect(groups[0].useCaseIds).toEqual(["uc-1", "uc-2"]);
    expect(groups[0].command).toBe("ge agents build --local --ids uc-1,uc-2");
  });

  test("cloud retry folds into the remote group", () => {
    const { groups } = groupResumeActions([row({ action: "retry", owner: "cloud", useCaseId: "uc-9" })]);
    expect(groups).toHaveLength(1);
    expect(groups[0].action).toBe("advance_remote");
    expect(groups[0].command).toBe("ge agents resume --remote --run --ids uc-9");
  });

  test("groups render in pipeline order: local, ship, remote", () => {
    const { groups, actionable } = groupResumeActions([
      row({ action: "advance_remote", useCaseId: "uc-3" }),
      row({ action: "handoff", useCaseId: "uc-2", workspaceId: "ws-2" }),
      row({ action: "build_local", useCaseId: "uc-1" }),
    ]);
    expect(groups.map((g) => g.action)).toEqual(["build_local", "handoff", "advance_remote"]);
    expect(actionable).toBe(3);
  });

  test("handoff uses workspace ids, falling back to use-case id", () => {
    const { groups } = groupResumeActions([
      row({ action: "handoff", useCaseId: "uc-1", workspaceId: "ws-1" }),
      row({ action: "handoff", useCaseId: "uc-2", workspaceId: null }),
    ]);
    expect(groups[0].command).toBe("ge handoff agents-cli --ids ws-1,uc-2");
  });

  test("duplicate ids collapse", () => {
    const { groups } = groupResumeActions([
      row({ useCaseId: "uc-1" }),
      row({ useCaseId: "uc-1" }),
    ]);
    expect(groups[0].useCaseIds).toEqual(["uc-1"]);
  });
});

describe("resumeCommandFor", () => {
  test("unknown action yields null", () => {
    expect(resumeCommandFor("noop", {})).toBeNull();
  });
});
