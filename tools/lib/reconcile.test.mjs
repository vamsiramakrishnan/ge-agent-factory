import { expect, test, describe } from "bun:test";
import { normalizeManifest, planReconcile, PLANE_ORDER } from "./reconcile.mjs";

describe("normalizeManifest", () => {
  test("platform planes are opt-in; fleet defaults to previewed/local/all", () => {
    expect(normalizeManifest({})).toEqual({
      platform: { infra: false, data: false, mcp: false },
      fleet: { target: "previewed", mode: "local", agents: "all" },
    });
  });
  test("honors declared values", () => {
    const m = normalizeManifest({ platform: { infra: true, mcp: true }, fleet: { target: "published", mode: "remote" } });
    expect(m.platform).toEqual({ infra: true, data: false, mcp: true });
    expect(m.fleet).toMatchObject({ target: "published", mode: "remote" });
  });
});

describe("planReconcile — platform drift", () => {
  test("emits steps in dependency order for declared-but-down planes", () => {
    const r = planReconcile(
      { platform: { infra: true, data: true, mcp: true } },
      { planes: { infra: false, data: false, mcp: false }, plan: [] },
    );
    expect(r.inSync).toBe(false);
    expect(r.steps.filter((s) => s.kind === "platform").map((s) => s.plane)).toEqual(PLANE_ORDER);
    expect(r.steps[0].command).toBe("ge up --infra");
  });
  test("planes already up produce no platform steps", () => {
    const r = planReconcile(
      { platform: { infra: true, data: true, mcp: true } },
      { planes: { infra: true, data: true, mcp: true }, plan: [] },
    );
    expect(r.drift.platform).toEqual([]);
  });
  test("undeclared planes are never required (local default)", () => {
    const r = planReconcile({}, { planes: { infra: false }, plan: [] });
    expect(r.drift.platform).toEqual([]);
  });
});

describe("planReconcile — fleet drift", () => {
  const plan = [
    { useCaseId: "uc-a", action: "build_local" },
    { useCaseId: "uc-b", action: "none" },
    { useCaseId: "uc-c", action: "retry" },
  ];
  test("batches agents needing work into one build step", () => {
    const r = planReconcile({ fleet: { target: "previewed" } }, { planes: {}, plan });
    expect(r.drift.fleet).toEqual(["uc-a", "uc-c"]);
    const fleetStep = r.steps.find((s) => s.kind === "fleet");
    expect(fleetStep.command).toContain("--ids uc-a,uc-c");
    expect(fleetStep.command).toContain("--local");
  });
  test("remote mode drops --local", () => {
    const r = planReconcile({ fleet: { mode: "remote" } }, { planes: {}, plan });
    expect(r.steps.find((s) => s.kind === "fleet").command).not.toContain("--local");
  });
  test("agent allowlist filters the plan", () => {
    const r = planReconcile({ fleet: { agents: ["uc-a"] } }, { planes: {}, plan });
    expect(r.drift.fleet).toEqual(["uc-a"]);
  });
  test("preview command flags overflow beyond 25 so it can't be mistaken for the full set", () => {
    const many = Array.from({ length: 30 }, (_, i) => ({ useCaseId: `uc-${i}`, action: "build_local" }));
    const r = planReconcile({ fleet: {} }, { planes: {}, plan: many });
    const cmd = r.steps.find((s) => s.kind === "fleet").command;
    expect(cmd).toContain("(+5 more)");
    expect(r.drift.fleet.length).toBe(30); // executor still gets all 30
  });
  test("everything at target → inSync", () => {
    const r = planReconcile({ fleet: { target: "previewed" } }, { planes: {}, plan: [{ useCaseId: "uc-b", action: "none" }] });
    expect(r.inSync).toBe(true);
    expect(r.steps).toEqual([]);
  });
});

test("full plan orders platform before fleet", () => {
  const r = planReconcile(
    { platform: { mcp: true }, fleet: {} },
    { planes: { mcp: false }, plan: [{ useCaseId: "uc-a", action: "build_local" }] },
  );
  expect(r.steps.map((s) => s.kind)).toEqual(["platform", "fleet"]);
});
