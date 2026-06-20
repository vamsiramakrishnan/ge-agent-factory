import { test, expect } from "bun:test";
import { makeEvent, splitLines } from "./events.mjs";

test("makeEvent fills schema fields", () => {
  const e = makeEvent({ runId: "r1", agentId: "a1", stage: "validate", type: "log", level: "info", line: "hi" });
  expect(e.runId).toBe("r1"); expect(e.type).toBe("log"); expect(typeof e.ts).toBe("string");
});

test("splitLines buffers partial lines and flushes on newline", () => {
  const s = splitLines();
  expect(s.push("foo")).toEqual([]);          // no newline yet
  expect(s.push("bar\nbaz\n")).toEqual(["foobar", "baz"]);
  expect(s.flush()).toEqual([]);              // nothing pending
});

test("splitLines treats carriage-return progress as a line update", () => {
  const s = splitLines();
  expect(s.push("10%\r20%\r30%\n")).toEqual(["30%"]); // \r collapses to last
});
