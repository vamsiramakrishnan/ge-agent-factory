import { expect, test } from "bun:test";
import { FACTORY_STAGE_GRAPH, RETRY_POLICIES, RETRY_POLICY_VALUES } from "./factory-orchestration.js";

test("every factory stage declares a known, typed retry policy (no free-text drift)", () => {
  for (const stage of FACTORY_STAGE_GRAPH) {
    expect(RETRY_POLICY_VALUES.has(stage.retry)).toBe(true);
  }
});

test("RETRY_POLICIES is frozen and its values are unique", () => {
  expect(Object.isFrozen(RETRY_POLICIES)).toBe(true);
  const values = Object.values(RETRY_POLICIES);
  expect(new Set(values).size).toBe(values.length);
});
