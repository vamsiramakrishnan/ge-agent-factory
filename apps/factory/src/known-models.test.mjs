import { expect, test } from "bun:test";
import {
  KNOWN_AGENT_MODELS,
  DEFAULT_AGENT_MODEL,
  assertKnownModel,
  isKnownModel,
} from "./known-models.js";

test("the default agent model is itself in the allowlist", () => {
  expect(KNOWN_AGENT_MODELS).toContain(DEFAULT_AGENT_MODEL);
});

test("assertKnownModel returns a known model unchanged", () => {
  expect(assertKnownModel("gemini-3.5-flash")).toBe("gemini-3.5-flash");
});

test("assertKnownModel rejects an off-allowlist model with a helpful error", () => {
  expect(() => assertKnownModel("gemini-9.9-imaginary")).toThrow(/unknown agent model/i);
});

test("isKnownModel reflects allowlist membership", () => {
  expect(isKnownModel("gemini-2.5-pro")).toBe(true);
  expect(isKnownModel("totally-made-up-model")).toBe(false);
});
