import { describe, expect, test } from "bun:test";
import { replayDelays } from "./runs.mjs";

const at = (iso) => ({ event: { ts: iso } });

describe("replayDelays", () => {
  test("first event plays immediately; gaps compress by the speed factor", () => {
    const events = [at("2026-01-01T00:00:00Z"), at("2026-01-01T00:00:01Z")]; // 1s gap
    expect(replayDelays(events, 10)).toEqual([0, 100]);
  });

  test("long gaps cap at 2s so overnight pauses don't stall the replay", () => {
    const events = [at("2026-01-01T00:00:00Z"), at("2026-01-01T08:00:00Z")];
    expect(replayDelays(events, 10)[1]).toBe(2000);
  });

  test("bursts floor at 15ms so output stays readable", () => {
    const events = [at("2026-01-01T00:00:00.000Z"), at("2026-01-01T00:00:00.001Z")];
    expect(replayDelays(events, 10)[1]).toBe(15);
  });

  test("missing timestamps and bad speeds degrade to the floor, not NaN", () => {
    const events = [{ event: {} }, { event: {} }];
    const delays = replayDelays(events, Number.NaN);
    expect(delays).toEqual([0, 15]);
  });
});
