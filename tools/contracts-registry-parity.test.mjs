import { describe, expect, test } from "bun:test";
import { GE_COMMANDS } from "@ge/capability-registry";
import { GeCommandIdSchema, RiskLevelSchema } from "@ge/contracts";
import { OBSERVABILITY_MODES, RISK_LEVELS } from "@ge/core-api";
import { TASK_CREATE_SCHEMAS } from "./lib/daemon/task-schemas.mjs";

// Structural replacement for the "keep X in sync with Y" comments that used to
// connect the command registry, @ge/contracts, @ge/core-api, and the daemon:
// if a vocabulary grows on one side without the other, this fails in CI
// instead of drifting.

describe("contracts ↔ registry parity", () => {
  test("every GE_COMMANDS id is a valid GeCommandId", () => {
    const missing = Object.keys(GE_COMMANDS).filter((id) => !GeCommandIdSchema.safeParse(id).success);
    expect(missing).toEqual([]);
  });

  test("every GE_COMMANDS risk is a valid RiskLevel", () => {
    const missing = [...new Set(Object.values(GE_COMMANDS).map((command) => command.risk))]
      .filter((risk) => !RiskLevelSchema.safeParse(risk).success);
    expect(missing).toEqual([]);
  });
});

describe("contracts ↔ core-api kernel parity", () => {
  test("@ge/contracts' RiskLevelSchema and @ge/core-api's RISK_LEVELS are the same vocabulary", () => {
    // contracts carries the zod twin (for typed front-ends), core-api the
    // dependency-free one (registry validation, browser bundles). A value
    // added to one without the other would let a registry entry validate on
    // one surface and fail typing on another.
    expect([...RiskLevelSchema.options]).toEqual([...RISK_LEVELS]);
  });

  test("every registry observability mode is a kernel observability mode", () => {
    const modes = [...new Set(Object.values(GE_COMMANDS).map((command) => command.observability?.mode).filter(Boolean))];
    const unknown = modes.filter((mode) => !OBSERVABILITY_MODES.includes(mode));
    expect(unknown).toEqual([]);
  });
});

describe("daemon task-kind vocabulary", () => {
  test("the collapsed nouns are the wire kinds — pipeline.run and repair.run have create schemas", () => {
    expect(TASK_CREATE_SCHEMAS["pipeline.run"]).toBeDefined();
    expect(TASK_CREATE_SCHEMAS["repair.run"]).toBeDefined();
  });

  test("retired legacy kinds have no schema (no alias layer — unreleased wire)", () => {
    expect(TASK_CREATE_SCHEMAS["mission.run"]).toBeUndefined();
    expect(TASK_CREATE_SCHEMAS["autopilot.run"]).toBeUndefined();
  });
});
