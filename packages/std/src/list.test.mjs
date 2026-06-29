import { describe, expect, test } from "bun:test";
import { parseList } from "./list.mjs";

describe("parseList", () => {
  test("splits, trims, drops empties", () => {
    expect(parseList("a, b ,  c ")).toEqual(["a", "b", "c"]);
    expect(parseList("a,,b, ,c")).toEqual(["a", "b", "c"]);
  });
  test("null/undefined/empty -> []", () => {
    expect(parseList(null)).toEqual([]);
    expect(parseList(undefined)).toEqual([]);
    expect(parseList("")).toEqual([]);
    expect(parseList("  ,  ")).toEqual([]);
  });
  test("custom separator (regex)", () => {
    expect(parseList("a; b , c", /[;,]/)).toEqual(["a", "b", "c"]);
  });
});
