import { describe, expect, test } from "bun:test";
import { GE_COMMANDS } from "./lib/ge-command-registry.mjs";
import { GeCommandIdSchema, RiskLevelSchema } from "@ge/contracts";
import { TASK_CREATE_SCHEMAS } from "./lib/daemon/task-schemas.mjs";

// Structural replacement for the "keep X in sync with Y" comments that used to
// connect the command registry, @ge/contracts, and the daemon: if a vocabulary
// grows on one side without the other, this fails in CI instead of drifting.

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
