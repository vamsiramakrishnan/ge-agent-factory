import { describe, expect, test } from "bun:test";
import { agents } from "./agents.mjs";

describe("ge agents command registration", () => {
  test("leaf commands expose citty run handlers", () => {
    for (const name of ["register", "track", "build", "resume", "status", "logs", "sync"]) {
      expect(typeof agents.subCommands[name]?.run).toBe("function");
    }
  });
});
