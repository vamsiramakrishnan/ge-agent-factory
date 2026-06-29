import { describe, expect, test } from "bun:test";
import { inferRequestedCapabilities } from "./harness-runtime.js";

describe("harness runtime capability inference", () => {
  test("detects mock data and simulator requests for Antigravity skill selection", () => {
    const capabilities = inferRequestedCapabilities({
      message: "Use Antigravity to run mock.generate, Snowfakery, simulator.seed, and simulator.validate.",
    });

    expect(capabilities).toContain("mock_data");
    expect(capabilities).toContain("simulation");
  });
});
