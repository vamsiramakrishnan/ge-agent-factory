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
