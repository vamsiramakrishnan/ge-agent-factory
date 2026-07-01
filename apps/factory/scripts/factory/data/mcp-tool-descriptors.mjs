// Compute the agent's MCP tool descriptors from its fixture manifest. Single
// source of truth for BOTH the Agent Registry tool spec (buildToolSpec) and the
// per-agent GCS manifest the department MCP service reads at runtime
// (mock_data/cloud/mcp-tools.json → gs://<dataBucket>/agents/<id>/mcp-tools.json).
// Shape matches mcp-service/server.py: [{ name, description, inputSchema }].
// Extracted from factory.mjs verbatim — pure function of (manifest, the
// simulator registry).

import { safePyName, snakeCase } from "@ge/std/naming";
import { findSimulatorForSystem, loadSimulatorRegistry, simulatorBindingForTool } from "../simulators/registry.mjs";

export function mcpToolDescriptors(manifest) {
  const tables = manifest?.tables || [];
  const simulatorRegistry = loadSimulatorRegistry();
  const tools = [
    {
      name: "list_systems",
      description: `List all tables and documents in the ${manifest?.id || "mock"} scenario.`,
      inputSchema: { type: "object", properties: {} },
    },
  ];
  for (const t of tables) {
    const props = {};
    const filterCols = (t.columns || []).filter((c) => c.type === "string" && !["id", "name", "email"].includes(c.name)).slice(0, 3);
    for (const c of filterCols) {
      props[c.name] = { type: "string", description: `Filter by ${c.name}` };
    }
    props.limit = { type: "integer", description: "Max rows to return (default 20)" };
    tools.push({
      name: `query_${snakeCase(t.name)}`,
      description: `Query ${t.name} table. ${t.rowCount || "N"} rows. Columns: ${(t.columns || []).map((c) => c.name).join(", ")}.`,
      inputSchema: { type: "object", properties: props },
    });
  }
  const behaviorContract = manifest?.useCaseSpec?.behaviorContract || null;
  const contractToolKinds = new Set(["action", "notification", "evidence_lookup", "calculation"]);
  for (const intent of behaviorContract?.toolIntents || []) {
    if (!intent?.name || !contractToolKinds.has(intent.kind)) continue;
    const name = safePyName(intent.name);
    const props = {};
    for (const input of intent.requiredInputs || []) {
      props[input] = { type: "string", description: `Required input: ${input}` };
    }
    const tool = {
      name,
      description: `[${intent.kind}/${intent.sourceSystemId}] ${intent.description || intent.name}`,
      inputSchema: {
        type: "object",
        properties: props,
        required: intent.requiredInputs || [],
      },
    };
    const simulator = simulatorBindingForTool({
      sourceSystemId: intent.sourceSystemId,
      sourceSystem: intent.sourceSystem,
      toolName: name,
    }, simulatorRegistry);
    if (simulator) tool.simulator = simulator;
    tools.push(tool);
  }
  const existingToolNames = new Set(tools.map((tool) => tool.name));
  for (const system of manifest?.systems || []) {
    const simulator = findSimulatorForSystem(system.id || system.name, simulatorRegistry);
    if (!simulator?.toolCatalog?.tools?.length) continue;
    for (const toolSpec of simulator.toolCatalog.tools) {
      if (!toolSpec?.name || existingToolNames.has(toolSpec.name)) continue;
      tools.push({
        name: toolSpec.name,
        description: toolSpec.description || `${simulator.displayName} simulator tool ${toolSpec.name}`,
        inputSchema: toolSpec.inputSchema || { type: "object", properties: {} },
        simulator: {
          system_id: simulator.id,
          tool: toolSpec.name,
        },
      });
      existingToolNames.add(toolSpec.name);
    }
  }
  return tools;
}
