#!/usr/bin/env node
import { resolve } from "node:path";
import { buildDeployPlan, renderPlanMarkdown } from "../src/deploy-plan.js";
import { updateWorkspaceCapabilities, writeJsonArtifact, writeMarkdownArtifact } from "../src/workspace-capabilities.js";

const args = process.argv.slice(2);
const flags = {};
for (let i = 0; i < args.length; i += 1) {
  const arg = args[i];
  if (arg.startsWith("--")) {
    const key = arg.slice(2);
    flags[key] = args[i + 1] && !args[i + 1].startsWith("--") ? args[++i] : "true";
  }
}

const workspaceDir = resolve(flags["workspace-dir"] || ".");
const projectId = flags["project-id"];
if (!projectId) throw new Error("--project-id is required");

const manifestPath = resolve(workspaceDir, "workspace.json");
const manifest = await updateWorkspaceCapabilities({
  workspaceDir,
  manifestPath,
  patch: { repoRoot: resolve(flags["repo-root"] || ".") },
});
const target = flags.target || "agent_runtime";
const plan = buildDeployPlan({ projectId, workspaceDir, readiness: manifest.readiness, target });
await writeJsonArtifact(workspaceDir, "artifacts/deploy-plan.json", plan);
await writeMarkdownArtifact(workspaceDir, "artifacts/DEPLOY_PLAN.md", renderPlanMarkdown("Deploy Plan", plan));
const updated = await updateWorkspaceCapabilities({
  workspaceDir,
  manifestPath,
  patch: { repoRoot: resolve(flags["repo-root"] || ".") },
});

console.log(JSON.stringify({
  ok: true,
  projectId,
  workspaceDir,
  plan: "artifacts/DEPLOY_PLAN.md",
  json: "artifacts/deploy-plan.json",
  readiness: updated.readiness,
  nextActions: updated.nextActions,
}, null, 2));
