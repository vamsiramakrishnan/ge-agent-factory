import { test, expect } from "bun:test";
import { cliForCommand, cliForRoute } from "./cliEquivalent";
// The real registry payload the console fetches from /api/ge/commands, via the
// sanctioned bridge (shared/ge-commands.mjs) — so these assertions prove the
// view-facing lookup resolves against the actual `cli` field, not a fixture
// that could drift.
import { GE_COMMAND_LIST } from "../shared/ge-commands.mjs";

test("cliForCommand resolves a command id to its registry cli string", () => {
  expect(cliForCommand(GE_COMMAND_LIST, "capture")).toBe("ge capture");
  expect(cliForCommand(GE_COMMAND_LIST, "prove")).toBe("ge prove");
  expect(cliForCommand(GE_COMMAND_LIST, "handoff")).toBe("ge handoff");
  expect(cliForCommand(GE_COMMAND_LIST, "agents.build")).toBe("ge agents build");
  expect(cliForCommand(GE_COMMAND_LIST, "agents.build.local")).toBe("ge agents build --local");
  expect(cliForCommand(GE_COMMAND_LIST, "agents.sync")).toBe("ge agents sync");
  expect(cliForCommand(GE_COMMAND_LIST, "mcp.deploy")).toBe("ge mcp deploy");
  expect(cliForCommand(GE_COMMAND_LIST, "pipeline.run")).toBe("ge pipeline run");
});

test("every registry command's id resolves to its own cli string", () => {
  for (const command of GE_COMMAND_LIST) {
    expect({ id: command.id, cli: cliForCommand(GE_COMMAND_LIST, command.id) })
      .toEqual({ id: command.id, cli: command.cli });
  }
});

test("unknown ids and missing payloads resolve to null (affordance hides)", () => {
  expect(cliForCommand(GE_COMMAND_LIST, "not.a.command")).toBeNull();
  // agents.ship is gone from the registry outright — the handoff verb replaced it.
  expect(cliForCommand(GE_COMMAND_LIST, "agents.ship")).toBeNull();
  expect(cliForCommand(undefined, "prove")).toBeNull();
  expect(cliForCommand(null, "prove")).toBeNull();
  expect(cliForCommand([], "prove")).toBeNull();
});

test("cliForRoute resolves a console route to its registry cli string", () => {
  expect(cliForRoute(GE_COMMAND_LIST, "POST", "/api/ge/prove")).toBe("ge prove");
  expect(cliForRoute(GE_COMMAND_LIST, "POST", "/api/ge/handoff")).toBe("ge handoff");
  expect(cliForRoute(GE_COMMAND_LIST, "POST", "/api/ge/agents/build")).toBe("ge agents build");
  expect(cliForRoute(GE_COMMAND_LIST, "GET", "/api/ge/prove")).toBeNull();
  expect(cliForRoute(GE_COMMAND_LIST, "POST", "/api/ge/nope")).toBeNull();
});
