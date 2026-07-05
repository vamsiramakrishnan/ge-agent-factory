import { describe, expect, test } from "bun:test";
import { validateCapability } from "@ge/core-api";
import { GE_COMMANDS, GE_COMMAND_LIST, commandForRoute } from "./registry.mjs";

// The Phase-1 acceptance guard for the capability kernel: every entry
// satisfies the @ge/core-api contract, and every surface an entry declares is
// actually reachable through the accessors surfaces consume. Import-time
// assertCapabilityTable already refuses a malformed table; these tests exist
// so a violation reads as a named test failure with the offending field, not
// a load error in whichever surface imported the registry first.

describe("capability surface parity", () => {
  test("every entry satisfies the @ge/core-api capability contract", () => {
    const problems = Object.entries(GE_COMMANDS).flatMap(([key, command]) => validateCapability(command, key));
    expect(problems).toEqual([]);
  });

  test("every declared console route resolves through commandForRoute", () => {
    for (const command of Object.values(GE_COMMANDS)) {
      if (!command.method || !command.path) continue;
      const parts = command.path.replace(/^\//, "").split("/");
      expect(commandForRoute(command.method, parts)?.id).toBe(command.id);
    }
  });

  test("every entry ships a client-facing meta projection", () => {
    const ids = GE_COMMAND_LIST.map((meta) => meta.id).sort();
    expect(ids).toEqual(Object.keys(GE_COMMANDS).sort());
    for (const meta of GE_COMMAND_LIST) {
      expect(meta.observability).toBeTruthy();
      expect(meta).not.toHaveProperty("argv");
    }
  });

  test("every argv builder produces a ge argv from an empty body", () => {
    for (const command of Object.values(GE_COMMANDS)) {
      const argv = command.argv({});
      expect(Array.isArray(argv)).toBe(true);
      expect(argv.length).toBeGreaterThan(0);
      expect(argv.every((part) => typeof part === "string")).toBe(true);
    }
  });

  test("the golden path leads the table so every consumer lists it first", () => {
    expect(Object.keys(GE_COMMANDS).slice(0, 3)).toEqual(["capture", "prove", "handoff"]);
  });
});
