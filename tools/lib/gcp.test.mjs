import { expect, test } from "bun:test";
import { assertValidAudience } from "./gcp.mjs";

test("accepts a normal https service audience", () => {
  expect(assertValidAudience("https://ge-agent-factory-worker-abc.a.run.app")).toBe(
    "https://ge-agent-factory-worker-abc.a.run.app",
  );
});

test("rejects an audience containing shell metacharacters", () => {
  expect(() => assertValidAudience("https://x.run.app; rm -rf /")).toThrow(/invalid audience/i);
  expect(() => assertValidAudience("$(curl evil)")).toThrow(/invalid audience/i);
  expect(() => assertValidAudience("a`whoami`b")).toThrow(/invalid audience/i);
});

test("rejects whitespace and empty audiences", () => {
  expect(() => assertValidAudience("has space")).toThrow(/invalid audience/i);
  expect(() => assertValidAudience("")).toThrow(/invalid audience/i);
  expect(() => assertValidAudience(null)).toThrow(/invalid audience/i);
});
