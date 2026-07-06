import { describe, expect, test } from "bun:test";
import { GE_COMMANDS, commandIds, commandMeta } from "./registry.mjs";

describe("GE command registry contracts", () => {
  test("every command exposes requirements and observability metadata", () => {
    for (const id of commandIds()) {
      const meta = commandMeta(id);
      expect(meta.requirements).toBeTruthy();
      expect(Array.isArray(meta.requirements.config)).toBe(true);
      expect(meta.observability).toBeTruthy();
      expect(typeof meta.observability.mode).toBe("string");
      expect(typeof meta.observability.events).toBe("boolean");
    }
  });

  // GPS-style guidance is a CONTRACT, not a convention: EVERY command carries
  // guide.when (when to reach for it) + guide.next (concrete next commands),
  // so every surface — CLI render, console, skills, MCP descriptions — can
  // tell the operator what to do next. The grandfather backlog is paid off:
  // commands that predate the inline `guide` field get theirs from the
  // COMMAND_GUIDES backfill in registry.mjs. No exemptions remain.
  test("every command carries GPS guidance (guide.when + guide.next)", () => {
    const missing = [];
    for (const id of commandIds()) {
      const guide = GE_COMMANDS[id].guide;
      const hasGuide = Boolean(guide && typeof guide.when === "string" && guide.when.length && Array.isArray(guide.next) && guide.next.length);
      if (!hasGuide) missing.push(id);
    }
    expect(missing).toEqual([]);
  });

  test("every command argv builder returns a concrete ge argv", () => {
    for (const id of commandIds()) {
      const command = GE_COMMANDS[id];
      expect(typeof command.argv).toBe("function");
      const argv = command.argv({});
      expect(Array.isArray(argv)).toBe(true);
      expect(argv.length).toBeGreaterThan(0);
      expect(argv.every((part) => typeof part === "string")).toBe(true);
    }
  });

  test("local agent build preserves selectors and marks local execution", () => {
    expect(GE_COMMANDS["agents.build.local"].argv({ ids: "account-reconciliation-agent" })).toEqual([
      "agents",
      "build",
      "--ids",
      "account-reconciliation-agent",
      "--local",
    ]);
  });

  test("local agent build preserves canary/force flags without dropping local mode", () => {
    expect(GE_COMMANDS["agents.build.local"].argv({ scope: "canary", force: true })).toEqual([
      "agents",
      "build",
      "--canary",
      "--local",
      "--force",
    ]);
  });

  test("local agent build declares durable event and artifact paths", () => {
    const meta = commandMeta("agents.build.local");
    expect(meta.observability).toMatchObject({
      mode: "local-factory-events",
      events: true,
      eventLog: ".ge/factory/factory-events.jsonl",
    });
    expect(meta.observability.artifacts).toContain(".ge/factory/factory-plan.json");
    expect(meta.requirements.localToolchain).toBe(true);
    expect(meta.requirements.config).toEqual(["project"]);
    expect(meta.requirements.config.includes("gatewayUrl")).toBe(false);
  });

  test("remote agent build keeps selectors but does not inherit local observability", () => {
    expect(GE_COMMANDS["agents.build"].argv({ ids: "account-reconciliation-agent" })).toEqual([
      "agents",
      "build",
      "--ids",
      "account-reconciliation-agent",
    ]);
    expect(commandMeta("agents.build").observability).toMatchObject({
      mode: "remote-stage-logs",
      events: false,
    });
  });
});
