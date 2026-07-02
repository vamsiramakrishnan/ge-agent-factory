import { afterEach, describe, expect, test } from "bun:test";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  buildWorkspaceContractReport,
  REQUIRED_WORKSPACE_FILES,
  validateWorkspaceManifest,
  WORKSPACE_PATHS,
  WORKSPACE_SCHEMA_VERSION,
} from "./workspace-contract.js";
import * as agentWorkspacePackage from "@ge/agent-workspace";

const roots = [];

async function tempRoot() {
  const root = await mkdtemp(join(tmpdir(), "ge-workspace-contract-"));
  roots.push(root);
  return root;
}

async function writeRel(root, relPath, value = "") {
  await mkdir(join(root, relPath, ".."), { recursive: true });
  await writeFile(join(root, relPath), value, "utf8");
}

function manifest() {
  return {
    schemaVersion: WORKSPACE_SCHEMA_VERSION,
    purpose: "Generated agent workspace with source, fixtures, ADK code, tests, evals, and release artifacts.",
    source: { useCaseId: "account-reconciliation-agent" },
    agent: { runtime: "adk-python", entrypoint: "app.agent:root_agent" },
    commands: {
      install: "uv sync",
      run: "uv run adk web",
      test: "uv run pytest",
      validate: "ge-harness validate account-reconciliation-agent",
      doctor: "ge-harness workspace doctor account-reconciliation-agent --stage preview",
    },
    generatedFiles: [
      { path: WORKSPACE_PATHS.workspaceManifest, required: true, exists: true },
      ...REQUIRED_WORKSPACE_FILES.map((path) => ({ path, required: true, exists: true })),
    ],
    quality: { smokeTests: "passing" },
    registration: { agentRegistryReady: false, geminiEnterpriseReady: false },
  };
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("workspace contract", () => {
  test("rejects manifests without purpose, agent, commands, and registration", () => {
    const report = validateWorkspaceManifest({ schemaVersion: WORKSPACE_SCHEMA_VERSION }, { strictFiles: false });

    expect(report.ok).toBe(false);
    expect(report.checks.filter((check) => check.status === "fail").map((check) => check.id)).toContain("manifest:purpose");
    expect(report.checks.filter((check) => check.status === "fail").map((check) => check.id)).toContain("manifest:agent");
    expect(report.checks.filter((check) => check.status === "fail").map((check) => check.id)).toContain("manifest:commands");
    expect(report.checks.filter((check) => check.status === "fail").map((check) => check.id)).toContain("manifest:registration");
  });

  test("passes when the manifest and required workspace files are present", async () => {
    const root = await tempRoot();
    const value = manifest();
    await writeRel(root, WORKSPACE_PATHS.workspaceManifest, `${JSON.stringify(value, null, 2)}\n`);
    for (const relPath of REQUIRED_WORKSPACE_FILES) await writeRel(root, relPath, "{}\n");

    const report = buildWorkspaceContractReport(root);

    expect(report.ok).toBe(true);
    expect(report.manifest.fails).toBe(0);
    expect(report.required.every((item) => item.exists)).toBe(true);
  });
});

describe("@ge/agent-workspace integration", () => {
  test("workspace-contract re-exports the package's contract verbatim", () => {
    // workspace-contract.js is the package's first (and canonical) consumer:
    // its re-exported constants must be the package's own objects, not copies.
    expect(WORKSPACE_SCHEMA_VERSION).toBe(agentWorkspacePackage.WORKSPACE_SCHEMA_VERSION);
    expect(WORKSPACE_PATHS).toBe(agentWorkspacePackage.WORKSPACE_PATHS);
    expect(REQUIRED_WORKSPACE_FILES).toBe(agentWorkspacePackage.REQUIRED_WORKSPACE_FILES);
  });
});
