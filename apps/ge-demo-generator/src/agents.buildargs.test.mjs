import { describe, expect, test } from "bun:test";
import { AGENT_DEFS } from "./agents.js";

const sdk = AGENT_DEFS.find((agent) => agent.id === "antigravity-sdk");

describe("antigravity-sdk buildArgs", () => {
  test("maps response schema file and protected files to flags", () => {
    const args = sdk.buildArgs("prompt", {
      cwd: "/ws",
      permissionProfile: "workspace_write",
      responseSchemaFile: "/schemas/harness-refine.schema.json",
      protectFiles: ["tools.py", "agent.py"],
    });

    const schemaIdx = args.indexOf("--response-schema-file");
    expect(schemaIdx).toBeGreaterThan(-1);
    expect(args[schemaIdx + 1]).toBe("/schemas/harness-refine.schema.json");

    expect(args.filter((a) => a === "--protect-file").length).toBe(2);
    expect(args).toContain("tools.py");
    expect(args).toContain("agent.py");
  });

  test("omits new flags when unset (backward compatible)", () => {
    const args = sdk.buildArgs("prompt", { cwd: "/ws", permissionProfile: "review" });
    expect(args).not.toContain("--response-schema-file");
    expect(args).not.toContain("--protect-file");
  });
});
