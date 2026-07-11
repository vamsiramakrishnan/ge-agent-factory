import { expect, test } from "bun:test";
import { canBindLoopback } from "./test-network.mjs";

test("loopback capability probe returns a boolean", async () => {
  expect(typeof await canBindLoopback()).toBe("boolean");
});
