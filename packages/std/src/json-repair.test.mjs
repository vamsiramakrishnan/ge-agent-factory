import { describe, expect, test } from "bun:test";
import { extractFirstJsonObject, parseLooseJson } from "./json-repair.mjs";

describe("extractFirstJsonObject", () => {
  test("parses a clean object", () => {
    expect(extractFirstJsonObject('{"a":1,"b":[2,3]}')).toEqual({ a: 1, b: [2, 3] });
  });

  test("tolerates model slop (trailing commas, single quotes) and prose/fences", () => {
    expect(extractFirstJsonObject("{'a':'x','b':2,}")).toEqual({ a: "x", b: 2 });
    expect(extractFirstJsonObject("Here:\n```json\n{\"ok\":true}\n```\nthanks")).toEqual({ ok: true });
    expect(extractFirstJsonObject('noise {"a":{"b":1}} tail')).toEqual({ a: { b: 1 } });
  });

  test("completes a truncated object via jsonrepair", () => {
    expect(extractFirstJsonObject('{"verdict":"pass","note":"cut o')).toEqual({ verdict: "pass", note: "cut o" });
  });

  // Regression guard (critic fix #2): the no-object path MUST throw, not return
  // null — harness review/refine surface malformed output via this exception.
  test("THROWS when there is no JSON object (must not swallow to null)", () => {
    expect(() => extractFirstJsonObject("no json here")).toThrow("Harness response did not contain a JSON object.");
    expect(() => extractFirstJsonObject("")).toThrow();
  });
});

describe("parseLooseJson", () => {
  test("repairs then parses", () => {
    expect(parseLooseJson("{a:1, b:'two',}")).toEqual({ a: 1, b: "two" });
  });
});
