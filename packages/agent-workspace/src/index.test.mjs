import { describe, expect, test } from "bun:test";
import {
  ARTIFACT_PATHS,
  DATA_PATHS,
  REQUIRED_WORKSPACE_COMMANDS,
  WORKSPACE_PATHS,
  buildWorkspaceManifestSchema,
  createWorkspaceManifest,
  isKnownWorkspacePath,
  listWorkspacePathEntries,
  requiredGeneratedWorkspaceFiles,
  validateWorkspaceManifestShape,
  workspacePath,
  workspacePaths,
} from "./index.mjs";

describe("workspace path constants", () => {
  test("exports canonical workspace, artifact, and data paths", () => {
    expect(WORKSPACE_PATHS.agent).toBe("app/agent.py");
    expect(ARTIFACT_PATHS.validationReport).toBe("artifacts/validation-report.json");
    expect(DATA_PATHS.cloudDataManifest).toBe("mock_data/cloud/cloud-data-manifest.json");
  });

  test("enumerates path entries with their source group", () => {
    const entries = listWorkspacePathEntries();
    expect(entries.some((entry) => entry.group === "workspace" && entry.key === "agent")).toBe(true);
    expect(entries.some((entry) => entry.group === "artifact" && entry.path === ARTIFACT_PATHS.graph)).toBe(true);
  });

  test("recognizes known workspace contract paths", () => {
    expect(isKnownWorkspacePath(WORKSPACE_PATHS.workspaceManifest)).toBe(true);
    expect(isKnownWorkspacePath("not-a-contract-path.json")).toBe(false);
  });
});

describe("workspace path helpers", () => {
  test("joins relative paths under a workspace directory", () => {
    expect(workspacePath("/tmp/workspace", WORKSPACE_PATHS.tools)).toBe("/tmp/workspace/app/tools.py");
    expect(workspacePaths("/tmp/workspace", { agent: WORKSPACE_PATHS.agent })).toEqual({
      agent: "/tmp/workspace/app/agent.py",
    });
  });

  test("rejects absolute and parent-traversing relative paths", () => {
    expect(() => workspacePath("/tmp/workspace", "/etc/passwd")).toThrow();
    expect(() => workspacePath("/tmp/workspace", "../outside")).toThrow();
  });
});

describe("manifest schema helpers", () => {
  test("buildWorkspaceManifestSchema exposes required command and object shape", () => {
    const schema = buildWorkspaceManifestSchema();
    expect(schema.requiredCommands).toEqual([...REQUIRED_WORKSPACE_COMMANDS]);
    expect(schema.agent).toContain("entrypoint");
  });

  test("createWorkspaceManifest produces a shape accepted by validateWorkspaceManifestShape", () => {
    const manifest = createWorkspaceManifest({
      purpose: "Reconcile workforce records",
      agent: { runtime: "python", entrypoint: "app.agent:root_agent" },
      commands: Object.fromEntries(REQUIRED_WORKSPACE_COMMANDS.map((name) => [name, `make ${name}`])),
      registration: { agentRegistryReady: true, geminiEnterpriseReady: false },
      generatedFiles: [{ path: WORKSPACE_PATHS.workspaceManifest, required: true }],
    });
    expect(validateWorkspaceManifestShape(manifest).ok).toBe(true);
  });

  test("validateWorkspaceManifestShape reports missing migration-critical fields", () => {
    const result = validateWorkspaceManifestShape({});
    expect(result.ok).toBe(false);
    expect(result.missingCommands).toEqual([...REQUIRED_WORKSPACE_COMMANDS]);
  });

  test("requiredGeneratedWorkspaceFiles folds generated required files into the baseline set", () => {
    const files = requiredGeneratedWorkspaceFiles({
      generatedFiles: [
        { path: "custom/required.json", required: true },
        { path: "custom/optional.json", required: false },
      ],
    });
    expect(files).toContain(WORKSPACE_PATHS.workspaceManifest);
    expect(files).toContain("custom/required.json");
    expect(files).not.toContain("custom/optional.json");
  });
});
