import { mkdir, readFile, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join, resolve } from "node:path";

export const HARNESS_STAGE_SKILLS = {
  harness_review: ["running-factory", "checking-workspaces", "recording-evidence"],
  harness_refine: ["running-factory", "checking-workspaces", "recording-evidence"],
  validate: ["checking-workspaces", "recording-evidence"],
  preview: ["checking-workspaces", "recording-evidence"],
};

export const HARNESS_STAGE_EXPECTED_ARTIFACTS = {
  harness_review: ["artifacts/harness-review.json", "artifacts/generator-feedback.json"],
  harness_refine: ["artifacts/harness-refine.json", "artifacts/spec-code-trace.json", "artifacts/validation-report.json"],
  validate: ["artifacts/validation-report.json", "artifacts/spec-code-trace.json"],
  preview: ["artifacts/preview-report.json"],
};

export function buildHarnessWorkItem({
  runId = null,
  itemId = null,
  workspaceDir,
  stage = "harness_refine",
  adapter = "antigravity-sdk",
  locality = "local",
  project = null,
  location = null,
  targetGate = "validate",
  skillsManifest = null,
  permissionProfile = "workspace_write",
  model = "default",
  soft = true,
  expectedArtifacts = null,
} = {}) {
  const resolvedWorkspace = resolve(workspaceDir || ".");
  return {
    kind: "ge.harness.work_item",
    version: 1,
    runId,
    itemId,
    stage,
    targetGate,
    adapter,
    locality,
    workspaceDir: resolvedWorkspace,
    permissionProfile,
    model,
    soft: Boolean(soft),
    project,
    location,
    skillsManifest: skillsManifest || process.env.GE_HARNESS_SKILLS_MANIFEST || null,
    requiredSkills: HARNESS_STAGE_SKILLS[stage] || [],
    expectedArtifacts: expectedArtifacts || HARNESS_STAGE_EXPECTED_ARTIFACTS[stage] || [],
    allowedWriteRoots: [resolvedWorkspace],
    disallowedRoots: ["repository generator source", "unrelated workspaces", ".git"],
    createdAt: new Date().toISOString(),
  };
}

export async function writeHarnessWorkItem(workspaceDir, workItem, artifactName = "harness-work-item.json") {
  const artifactsDir = join(workspaceDir, "artifacts");
  await mkdir(artifactsDir, { recursive: true });
  const path = join(artifactsDir, artifactName);
  await writeFile(path, `${JSON.stringify(workItem, null, 2)}\n`);
  return path;
}

export async function readJsonIfExists(path, fallback = null) {
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(await readFile(path, "utf8"));
  } catch {
    return fallback;
  }
}

export async function buildHarnessRefinePrompt({
  workItem,
  workspaceContext,
  review = null,
  feedback = null,
} = {}) {
  return [
    "Actively refine this generated GE ADK agent workspace after deterministic generation.",
    "",
    "This is a structured harness work item. Follow it exactly:",
    JSON.stringify(workItem, null, 2),
    "",
    "You may edit files inside the workspace. Keep changes scoped to generated workspace files only.",
    "Primary goal: improve spec-to-code fidelity against the use case's behavior contract, source-system naming, ADK tool patterns, mock-data realism, and eval coverage.",
    "Do not change repository generator source files. Do not deploy or publish. Do not require auth beyond this harness run.",
    "",
    "Required workflow:",
    "1. Inspect the current spec, app/agent.py, app/tools.py, evals, and tests.",
    "2. Trace each behaviorContract.toolIntent, evidenceRequirement, escalationRule, refusalRule, and goldenEval into generated code or tests.",
    "3. Apply targeted fixes to the generated workspace if useful.",
    "4. Prefer deterministic, contract-compatible changes over broad rewrites.",
    "5. Preserve tool names that match source systems and behaviorContract tool intents.",
    "6. Run ge validate / factory test when available, or record the exact blocker.",
    "7. End with a JSON object only: {\"changed_files\":[],\"summary\":\"...\",\"verification_commands\":[],\"remaining_gaps\":[],\"spec_to_code_fidelity\":\"pass|partial|fail\"}.",
    "",
    review ? `Existing review JSON:\n${JSON.stringify(review, null, 2)}` : "No prior review JSON found.",
    feedback ? `Existing feedback JSON:\n${JSON.stringify(feedback, null, 2)}` : "",
    "",
    workspaceContext || "",
  ].filter(Boolean).join("\n");
}

export async function buildHarnessRunSummary({ workItem, result, provider, output = null, changedFiles = [] } = {}) {
  return {
    kind: "ge.harness.run_summary",
    version: 1,
    ok: Boolean(result?.ok),
    status: result?.status || (result?.ok ? "succeeded" : "failed"),
    stage: workItem?.stage || "harness_refine",
    adapter: provider || workItem?.adapter || "unknown",
    locality: workItem?.locality || "local",
    workspaceDir: workItem?.workspaceDir || null,
    output,
    changedFiles,
    expectedArtifacts: workItem?.expectedArtifacts || [],
    code: result?.code ?? null,
    signal: result?.signal ?? null,
    completedAt: new Date().toISOString(),
  };
}
