import { describe, expect, test } from "bun:test";
import { okf } from "./okf.mjs";

describe("ge okf command registration", () => {
  test("leaf commands expose citty run handlers", () => {
    for (const name of ["audit", "graph", "explain", "compile", "diff", "repair"]) {
      expect(typeof okf.subCommands[name]?.run).toBe("function");
    }
  });
});
