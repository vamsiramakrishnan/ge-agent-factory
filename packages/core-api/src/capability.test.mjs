import { describe, expect, test } from "bun:test";
import {
  MCP_PARAM_TYPES,
  OBSERVABILITY_MODES,
  REQUIREMENT_KEYS,
  RISK_LEVELS,
  assertCapabilityTable,
  capabilityMeta,
  validateCapability,
} from "./capability.mjs";

// A minimal well-formed entry; each test perturbs one field from here.
const valid = () => ({
  id: "example",
  method: "POST",
  path: "/api/ge/example",
  cli: "ge example",
  label: "Run the example",
  summary: "Run the example capability",
  risk: "read-only",
  expectedDuration: "under 10s",
  observability: { mode: "command-output", events: false },
  requirements: { bins: ["bun"], config: [] },
  mcp: {
    tool: "factory_example",
    description: "Run the example capability.",
    params: { id: { type: "string", optional: true, description: "An id" } },
  },
  guide: { when: "always", next: ["ge example"] },
  argv: () => ["example"],
});

describe("kernel vocabularies", () => {
  test("vocabularies are frozen, non-empty string lists", () => {
    for (const vocabulary of [RISK_LEVELS, OBSERVABILITY_MODES, REQUIREMENT_KEYS, MCP_PARAM_TYPES]) {
      expect(Object.isFrozen(vocabulary)).toBe(true);
      expect(vocabulary.length).toBeGreaterThan(0);
      expect(vocabulary.every((value) => typeof value === "string" && value.length > 0)).toBe(true);
    }
  });
});

describe("capabilityMeta", () => {
  test("projects the client-facing fields and defaults observability", () => {
    const { observability, ...entry } = valid();
    const meta = capabilityMeta(entry);
    expect(meta.id).toBe("example");
    expect(meta.observability).toEqual({ mode: "command-output", events: false });
    expect(meta).not.toHaveProperty("argv");
    expect(meta).not.toHaveProperty("mcp");
  });
});

describe("validateCapability", () => {
  test("accepts a well-formed entry", () => {
    expect(validateCapability(valid())).toEqual([]);
  });

  test("accepts a route-less, mcp-less, guide-less entry (observe commands)", () => {
    const entry = { ...valid(), method: null, path: null };
    delete entry.mcp;
    delete entry.guide;
    delete entry.observability;
    expect(validateCapability(entry)).toEqual([]);
  });

  const broken = [
    ["unknown risk", (entry) => (entry.risk = "harmless"), "risk"],
    ["half a console route", (entry) => (entry.method = null), "method/path"],
    ["path outside /api/", (entry) => (entry.path = "/ge/example"), "path"],
    ["unknown requirement key", (entry) => (entry.requirements.sudo = true), "requirements.sudo"],
    ["non-boolean requirement flag", (entry) => (entry.requirements.cloudAuth = "yes"), "requirements.cloudAuth"],
    ["unknown observability mode", (entry) => (entry.observability.mode = "psychic"), "observability.mode"],
    ["unknown observability key", (entry) => (entry.observability.logs = true), "observability.logs"],
    ["non-factory mcp tool name", (entry) => (entry.mcp.tool = "geExample"), "mcp.tool"],
    ["unknown mcp param type", (entry) => (entry.mcp.params.id.type = "date"), "mcp.params.id.type"],
    ["unknown mcp param descriptor key", (entry) => (entry.mcp.params.id.required = true), "mcp.params.id.required"],
    ["unknown guide key", (entry) => (entry.guide.also = "x"), "guide.also"],
    ["missing argv builder", (entry) => delete entry.argv, "argv"],
    ["blank summary", (entry) => (entry.summary = " "), "summary"],
  ];
  for (const [name, mutate, field] of broken) {
    test(`rejects ${name}`, () => {
      const entry = valid();
      mutate(entry);
      const problems = validateCapability(entry);
      expect(problems.length).toBeGreaterThan(0);
      expect(problems.join("\n")).toContain(field);
    });
  }
});

describe("assertCapabilityTable", () => {
  test("returns the table when every entry is well-formed", () => {
    const table = { example: valid() };
    expect(assertCapabilityTable(table)).toBe(table);
  });

  test("rejects an entry whose id disagrees with its table key", () => {
    expect(() => assertCapabilityTable({ other: valid() })).toThrow(/does not match its table key/);
  });

  test("rejects two entries claiming the same console route", () => {
    const twin = { ...valid(), id: "example2", mcp: undefined, guide: undefined };
    delete twin.mcp;
    delete twin.guide;
    expect(() => assertCapabilityTable({ example: valid(), example2: twin })).toThrow(/already owned by 'example'/);
  });

  test("rejects two entries claiming the same MCP tool name", () => {
    const twin = { ...valid(), id: "example2", method: null, path: null };
    expect(() => assertCapabilityTable({ example: valid(), example2: twin })).toThrow(/factory_example' already owned/);
  });

  test("aggregates every problem into one error", () => {
    const first = valid();
    first.risk = "harmless";
    const second = { ...valid(), id: "second", method: null, path: null };
    second.mcp = undefined;
    delete second.mcp;
    second.summary = "";
    let message = "";
    try {
      assertCapabilityTable({ example: first, second });
    } catch (error) {
      message = error.message;
    }
    expect(message).toContain("example.risk");
    expect(message).toContain("second.summary");
  });
});
