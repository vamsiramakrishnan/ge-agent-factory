import { test, expect } from "bun:test";
import { renderToolsModule } from "../scripts/ge-mock/runtime/tools-backend.mjs";

test("tools.py mcp backend resolves toolsets from Agent Registry by server name", () => {
  const src = renderToolsModule({
    agentId: "demo-agent",
    department: "finance",
    mcpServerName: "demo-agent",
  });
  expect(src).toContain('GE_DATA_BACKEND');
  expect(src).toContain("AgentRegistry");
  expect(src).toContain("get_mcp_toolset");
  expect(src).toContain("GcpAuthProvider");                 // ADC / agent-identity auth
  expect(src).toContain("mcpServers/demo-agent");           // resolved by registry name
  expect(src).toContain("source_adapters_fixtures");
});

test("fixtures backend remains the default branch", () => {
  const src = renderToolsModule({ agentId: "a", department: "hr", mcpServerName: "a" });
  expect(src).toContain('_BACKEND = _os.environ.get("GE_DATA_BACKEND", "fixtures")');
  expect(src).toContain("source_adapters = source_adapters_fixtures");
});
