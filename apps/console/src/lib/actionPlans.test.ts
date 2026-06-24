import { test, expect } from "bun:test";
import { planNavigates } from "./actionPlans";

const plan = (over: Record<string, unknown>) => ({ kind: "none", label: "x", owner: "y", safeToRun: true, commands: [] as string[], ...over } as any);

test("navigate kinds resolve a route", () => {
  expect(planNavigates(plan({ kind: "start_interview" }))).toBe("#/interview");
  expect(planNavigates(plan({ kind: "review_spec", route: "#/spec-review/foo" }))).toBe("#/spec-review/foo");
  expect(planNavigates(plan({ kind: "watch_runtime" }), "interview")).toBe("#/interview");
  expect(planNavigates(plan({ kind: "watch_runtime" }), "data")).toBe("#/activity");
});

test("execute kinds never navigate, even with a stray route", () => {
  for (const kind of ["run_mission", "run_preview", "build_agents", "ship_agents", "resume_mission", "resume_harness", "resume_autopilot", "repair_agent"]) {
    expect(planNavigates(plan({ kind, route: "#/somewhere" }))).toBeNull();
  }
});

test("copyOnly does not navigate", () => {
  expect(planNavigates(plan({ kind: "generate_evals", route: "#/x" }))).toBeNull();
});

test("unknown kinds keep legacy route-if-present behavior", () => {
  expect(planNavigates(plan({ kind: "mystery", route: "#/x" }))).toBe("#/x");
  expect(planNavigates(plan({ kind: "mystery" }))).toBeNull();
});

test("null plan returns null", () => {
  expect(planNavigates(null)).toBeNull();
});
