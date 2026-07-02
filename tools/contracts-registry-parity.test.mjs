import { describe, expect, test } from "bun:test";
import { GE_COMMANDS } from "./lib/ge-command-registry.mjs";
import { GeCommandIdSchema, RiskLevelSchema } from "@ge/contracts";
import { TASK_KIND_ALIASES } from "./lib/runtime-daemon.mjs";
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
  test("every canonical alias maps onto a wire kind with a create schema", () => {
    for (const [canonical, wire] of Object.entries(TASK_KIND_ALIASES)) {
      expect(TASK_CREATE_SCHEMAS[wire], `${canonical} → ${wire} needs a schema`).toBeDefined();
    }
  });

  test("the collapsed nouns are exactly pipeline and repair", () => {
    expect(Object.keys(TASK_KIND_ALIASES).sort()).toEqual(["pipeline.run", "repair.run"]);
  });
});
