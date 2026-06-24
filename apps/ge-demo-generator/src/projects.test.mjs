import { afterEach, describe, expect, test } from "bun:test";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createWorkspace, removeWorkspace } from "./projects.js";

const roots = [];

async function tempRoot() {
  const root = await mkdtemp(join(tmpdir(), "ge-workspace-store-"));
  roots.push(root);
  return root;
}

afterEach(async () => {
  await Promise.all(roots.splice(0).map((root) => rm(root, { recursive: true, force: true })));
});

describe("workspace store", () => {
  test("writes canonical workspaces store", async () => {
    const root = await tempRoot();
    const storePath = join(root, "workspaces.json");
    const workspacesRoot = join(root, "workspaces");

    const workspace = await createWorkspace({ storePath, projectsRoot: workspacesRoot, name: "Audit Agent" });
    const raw = JSON.parse(await readFile(storePath, "utf8"));
    const manifest = JSON.parse(await readFile(join(workspacesRoot, workspace.id, "workspace.json"), "utf8"));

    expect(workspace.id).toBe("audit-agent");
    expect(raw.workspaces.map((item) => item.id)).toEqual(["audit-agent"]);
    expect(raw.projects).toBeUndefined();
    expect(manifest.schemaVersion).toBe(1);
    expect(manifest.purpose).toContain("Generated agent workspace");
    expect(manifest.agent).toMatchObject({
      runtime: "adk-python",
      entrypoint: "app.agent:root_agent",
    });
    expect(manifest.commands).toMatchObject({
      install: "uv sync",
      run: "uv run adk web",
      test: "uv run pytest",
    });
    expect(manifest.registration).toMatchObject({
      agentRegistryReady: false,
      geminiEnterpriseReady: false,
    });
    expect(manifest.generatedFiles.some((item) => item.path === "workspace.json" && item.exists)).toBe(true);
  });

  test("removeWorkspace persists the deletion to the store", async () => {
    const root = await tempRoot();
    const storePath = join(root, "workspaces.json");
    const workspacesRoot = join(root, "workspaces");

    await createWorkspace({ storePath, projectsRoot: workspacesRoot, name: "Keep Agent" });
    const drop = await createWorkspace({ storePath, projectsRoot: workspacesRoot, name: "Drop Agent" });

    await removeWorkspace({ storePath, projectsRoot: workspacesRoot, projectId: drop.id });

    const raw = JSON.parse(await readFile(storePath, "utf8"));
    expect(raw.workspaces.map((item) => item.id)).toEqual(["keep-agent"]);
  });
});
