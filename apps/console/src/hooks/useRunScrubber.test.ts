import { describe, expect, test } from "bun:test";
import { scrubSnapshot } from "./useRunScrubber";
import type { LedgerEvent } from "../services/geClient";

// Replay is a pure fold: position N = the run reduced over its first N events.
const EVENTS = [
  { seq: 1, ts: "2026-01-01T00:00:00Z", type: "stage_started", stage: "build" },
  { seq: 2, ts: "2026-01-01T00:00:05Z", type: "stage_done", stage: "build" },
  { seq: 3, ts: "2026-01-01T00:00:06Z", type: "stage_started", stage: "deploy" },
  { seq: 4, ts: "2026-01-01T00:00:20Z", type: "stage_done", stage: "deploy" },
  { seq: 5, ts: "2026-01-01T00:00:21Z", type: "run_complete", status: "done" },
] as unknown as LedgerEvent[];

describe("scrubSnapshot", () => {
  test("position 0 is an empty pending run", () => {
    const snap = scrubSnapshot(EVENTS, 0);
    expect(snap.stages).toHaveLength(0);
    expect(snap.status).toBe("pending");
    expect(snap.lastEvent).toBeNull();
  });

  test("mid-run positions show the world as it was", () => {
    const afterStart = scrubSnapshot(EVENTS, 1);
    expect(afterStart.stages.map((s) => [s.name, s.status])).toEqual([["build", "running"]]);
    expect(afterStart.status).toBe("running");

    const midway = scrubSnapshot(EVENTS, 3);
    expect(midway.stages.map((s) => [s.name, s.status])).toEqual([
      ["build", "done"],
      ["deploy", "running"],
    ]);
    expect(midway.lastEvent?.stage).toBe("deploy");
  });

  test("the full fold reaches the terminal state", () => {
    const end = scrubSnapshot(EVENTS, EVENTS.length);
    expect(end.status).toBe("done");
    expect(end.stages.every((s) => s.status === "done")).toBe(true);
  });

  test("positions beyond the end clamp; stage order follows first appearance", () => {
    const over = scrubSnapshot(EVENTS, 99);
    expect(over.stages.map((s) => s.name)).toEqual(["build", "deploy"]);
  });
});
