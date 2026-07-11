import { describe, expect, test } from "bun:test";
import { buildBoundedToolSpec } from "./deploy.mjs";

function tool(index, { propertyCount = 6 } = {}) {
  const properties = Object.fromEntries(Array.from({ length: propertyCount }, (_, propertyIndex) => [
    `argument_${propertyIndex}`,
    { type: propertyIndex % 2 ? "integer" : "string", description: "A verbose runtime-only property description." },
  ]));
  return {
    name: `tool_${String(index).padStart(3, "0")}`,
    description: `A long description for tool ${index}. `.repeat(12),
    inputSchema: { type: "object", properties, required: Object.keys(properties) },
    simulator: { system_id: "runtime-only", tool: `tool_${index}` },
  };
}

describe("Agent Registry tool-spec projection", () => {
  test("keeps every tool while fitting the 10 KB API limit", () => {
    const tools = Array.from({ length: 42 }, (_, index) => tool(index));
    const result = buildBoundedToolSpec(tools);
    expect(result.content).not.toBeNull();
    expect(result.bytes).toBeLessThanOrEqual(10 * 1024);
    expect(result.spec.tools.map((entry) => entry.name)).toEqual(tools.map((entry) => entry.name));
    expect(result.spec.tools.every((entry) => !("simulator" in entry))).toBe(true);
    expect(result.propertyLimit).toBeGreaterThan(0);
  });

  test("fails explicitly instead of truncating tools when names alone cannot fit", () => {
    const tools = Array.from({ length: 400 }, (_, index) => ({
      name: `tool_${index}_${"x".repeat(40)}`,
      inputSchema: { type: "object", properties: {} },
    }));
    const result = buildBoundedToolSpec(tools, { maxBytes: 1024 });
    expect(result.content).toBeNull();
    expect(result.toolCount).toBe(tools.length);
    expect(result.bytes).toBeGreaterThan(1024);
  });
});
