import { describe, expect, test } from "bun:test";
import {
  buildBoundedToolSpec,
  buildIapEgressGrantArgs,
  upsertAgentRegistryMcpService,
} from "./deploy.mjs";

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

describe("Agent Registry IAP egress grant", () => {
  test("uses the current gcloud kebab-case MCP server flag", () => {
    const args = buildIapEgressGrantArgs({
      project: "example-project",
      region: "global",
      serverName: "example-agent",
      principalSet: "principalSet://example",
    });

    expect(args).toContain("--mcp-server=example-agent");
    expect(args).not.toContain("--mcpServer=example-agent");
    expect(args).toContain("--resource-type=agent-registry");
    expect(args).toContain("--condition=None");
  });

  test("preserves the read-only MCP condition as one argv entry", () => {
    const args = buildIapEgressGrantArgs({
      project: "example-project",
      region: "global",
      serverName: "example-agent",
      principalSet: "principalSet://example",
      readOnly: true,
    });

    expect(args.at(-1)).toBe("--condition=expression=request.auth.type == 'MCP' && mcp.tool.isReadOnly,title=read-only-egress");
  });
});

describe("Agent Registry MCP service upsert", () => {
  const input = {
    project: "example-project",
    region: "global",
    serverName: "example-agent",
    displayName: "Example Agent",
    specPath: "/tmp/toolspec.json",
    serviceUrl: "https://example.run.app/mcp?agent=example-agent",
    protocolBinding: "JSONRPC",
  };
  const registryResource = "projects/123/locations/global/mcpServers/agentregistry-123";

  test("updates an existing service", async () => {
    const calls = [];
    const runCommand = async (command, args, options) => {
      calls.push({ command, args, options });
      return { code: 0, stdout: registryResource, stderr: "" };
    };

    expect(await upsertAgentRegistryMcpService({ ...input, runCommand })).toEqual({
      action: "updated",
      registryResource,
      mcpServerId: "agentregistry-123",
    });
    expect(calls.map((call) => call.args[3])).toEqual(["describe", "update"]);
    expect(calls[1].args).toContain("--interfaces=url=https://example.run.app/mcp?agent=example-agent,protocolBinding=JSONRPC");
    expect(calls[1].args).toContain("--format=value(registryResource)");
  });

  test("creates a missing service", async () => {
    const calls = [];
    const runCommand = async (command, args, options) => {
      calls.push({ command, args, options });
      if (args[3] === "describe") return { code: 1, stdout: "", stderr: "NOT_FOUND: service" };
      return { code: 0, stdout: registryResource, stderr: "" };
    };

    expect((await upsertAgentRegistryMcpService({ ...input, runCommand })).action).toBe("created");
    expect(calls.map((call) => call.args[3])).toEqual(["describe", "create"]);
  });

  test("updates after a concurrent create wins the race", async () => {
    const calls = [];
    const runCommand = async (command, args, options) => {
      calls.push({ command, args, options });
      if (args[3] === "describe") return { code: 1, stdout: "", stderr: "NOT_FOUND: service" };
      if (args[3] === "create") return { code: 1, stdout: "", stderr: "ALREADY_EXISTS: service" };
      return { code: 0, stdout: registryResource, stderr: "" };
    };

    expect((await upsertAgentRegistryMcpService({ ...input, runCommand })).action).toBe("updated");
    expect(calls.map((call) => call.args[3])).toEqual(["describe", "create", "update"]);
  });
});
