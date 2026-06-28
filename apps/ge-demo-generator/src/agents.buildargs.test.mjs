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

  test("maps disabled tools to repeated --disable-tool flags", () => {
    const args = sdk.buildArgs("prompt", {
      cwd: "/ws",
      permissionProfile: "workspace_write",
      disableTools: ["DELETE_FILE", "GENERATE_IMAGE"],
    });
    expect(args.filter((a) => a === "--disable-tool").length).toBe(2);
    expect(args).toContain("DELETE_FILE");
    expect(args).toContain("GENERATE_IMAGE");
  });

  test("maps read-only fan-out and resume options to flags", () => {
    const args = sdk.buildArgs("prompt", {
      cwd: "/ws",
      permissionProfile: "review",
      enableSubagents: true,
      conversationId: "refine-abc",
      saveDir: "/data/harness-sessions/refine-abc",
    });
    expect(args).toContain("--enable-subagents");
    const conv = args.indexOf("--conversation-id");
    expect(conv).toBeGreaterThan(-1);
    expect(args[conv + 1]).toBe("refine-abc");
    const save = args.indexOf("--save-dir");
    expect(save).toBeGreaterThan(-1);
    expect(args[save + 1]).toBe("/data/harness-sessions/refine-abc");
  });

  test("omits new flags when unset (backward compatible)", () => {
    const args = sdk.buildArgs("prompt", { cwd: "/ws", permissionProfile: "review" });
    expect(args).not.toContain("--response-schema-file");
    expect(args).not.toContain("--protect-file");
    expect(args).not.toContain("--disable-tool");
    expect(args).not.toContain("--enable-subagents");
    expect(args).not.toContain("--conversation-id");
    expect(args).not.toContain("--save-dir");
  });
});
