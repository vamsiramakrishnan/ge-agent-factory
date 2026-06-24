import { existsSync } from "node:fs";
import { join } from "node:path";
import { runWorkspaceValidation } from "./workspace-validation.js";
import { updateWorkspaceCapabilities } from "./workspace-capabilities.js";
import {
  ARTIFACT_PATHS,
  buildWorkspaceContractReport,
  DATA_PATHS,
  readWorkspaceJson,
  writeWorkspaceJson,
  writeWorkspaceText,
  WORKSPACE_PATHS,
} from "./workspace-contract.js";

export const WORKSPACE_DOCTOR_STAGES = Object.freeze([
  "validate",
  "preview",
  "promote",
  "deploy:plan",
  "publish:plan",
]);

const STAGE_LABELS = Object.freeze({
  validate: "Validation",
  preview: "Preview",
  promote: "Promotion",
  "deploy:plan": "Deploy Plan",
  "publish:plan": "Publish Plan",
});

function check(id, ok, message, detail = {}) {
  return { id, ok: Boolean(ok), level: ok ? "ok" : "error", message, ...detail };
}

function task(id, command, reason, owner = "generator") {
  return { id, command, reason, owner };
}

function hasReady(readiness, key, statuses = ["ready"]) {
  return statuses.includes(readiness?.[key]?.status);
}

function readPath(workspaceDir, relPath) {
  return readWorkspaceJson(workspaceDir, relPath, null);
}

function compactChecks(checks) {
  return {
    total: checks.length,
    passed: checks.filter((item) => item.ok).length,
    failed: checks.filter((item) => !item.ok).length,
  };
}

function stageRank(stage) {
  const idx = WORKSPACE_DOCTOR_STAGES.indexOf(stage);
  return idx < 0 ? WORKSPACE_DOCTOR_STAGES.length - 1 : idx;
}

function stageAtLeast(stage, minimum) {
  return stageRank(stage) >= stageRank(minimum);
}

function buildRepairTasks({ stage, checks, validationReport, specCodeTrace, promotionPacket }) {
  const failed = new Set(checks.filter((item) => !item.ok).map((item) => item.id));
  const tasks = [];
  if (failed.has("contract:required_files")) {
    tasks.push(task("regenerate-workspace", "ge-harness create --usecase <id> --name <name>", "Required workspace files are missing."));
  }
  if (failed.has("readiness:mock_data") || failed.has("readiness:agent")) {
    tasks.push(task("regenerate-workspace", "ge-harness create --usecase <id> --name <name>", "Workspace is missing ready mock data or agent code."));
  }
  if (failed.has("validation:computed")) {
    tasks.push(task("repair-spec-code", "ge-harness workspace repair <workspace-id> --stage validate", "Computed workspace validation is failing.", "harness"));
  }
  if (failed.has("validation:report") || failed.has("validation:passing")) {
    tasks.push(task("run-validation", "ge-harness validate <workspace-id>", "Validation must write a passing canonical validation report."));
  }
  if (failed.has("trace:passing")) {
    const reason = specCodeTrace?.blockers?.length ? specCodeTrace.blockers.join("; ") : "Spec-to-code trace is missing or failing.";
    tasks.push(task("repair-spec-code", "ge-harness validate <workspace-id>", reason, "harness"));
  }
  if (failed.has("preview:passing")) {
    tasks.push(task("run-preview", "ge-harness preview <workspace-id>", "Preview evidence must prove the ADK agent can run locally."));
  }
  if (failed.has("promotion:packet") || failed.has("promotion:gate")) {
    const reason = promotionPacket?.promotionGate?.blockers?.length
      ? promotionPacket.promotionGate.blockers.join("; ")
      : "Promotion packet is missing or blocked.";
    tasks.push(task("write-promotion-packet", "ge-harness promote:packet <workspace-id>", reason));
  }
  if (failed.has("deploy:plan")) {
    tasks.push(task("write-deploy-plan", "ge-harness deploy:plan <workspace-id>", "Deploy plan artifact is required before publish planning."));
  }
  if (stageAtLeast(stage, "publish:plan") && !failed.has("deploy:plan") && !validationReport?.ok) {
    tasks.push(task("revalidate-before-publish", "ge-harness validate <workspace-id>", "Publish planning requires a fresh passing validation report."));
  }
  return tasks;
}

export function renderWorkspaceDoctorReport(report) {
  return [
    "# Workspace Doctor",
    "",
    `Workspace: ${report.workspace}`,
    `Stage: ${report.stage}`,
    `Status: ${report.ok ? "pass" : "fail"}`,
    `Generated: ${report.generatedAt}`,
    "",
    "## Checks",
    ...report.checks.map((item) => `- ${item.ok ? "PASS" : "FAIL"} ${item.id}: ${item.message}`),
    "",
    "## Repair Tasks",
    ...(report.repairTasks.length
      ? report.repairTasks.map((item) => `- ${item.id}: ${item.command} (${item.reason})`)
      : ["- none"]),
    "",
  ].join("\n");
}

export async function runWorkspaceDoctor({
  workspaceDir,
  manifestPath,
  workspaceId,
  repoRoot,
  stage = "validate",
  write = true,
} = {}) {
  if (!workspaceDir || !manifestPath || !workspaceId) {
    throw new Error("workspaceDir, manifestPath, and workspaceId are required");
  }
  if (!WORKSPACE_DOCTOR_STAGES.includes(stage)) {
    throw new Error(`unknown workspace doctor stage: ${stage}`);
  }

  const contract = buildWorkspaceContractReport(workspaceDir);
  const manifest = await updateWorkspaceCapabilities({ workspaceDir, manifestPath, patch: { repoRoot } });
  const validationReport = await readPath(workspaceDir, ARTIFACT_PATHS.validationReport);
  const specCodeTrace = await readPath(workspaceDir, ARTIFACT_PATHS.specCodeTrace);
  const previewReport = await readPath(workspaceDir, ARTIFACT_PATHS.previewReport);
  const promotionPacket = await readPath(workspaceDir, ARTIFACT_PATHS.promotionPacket);
  const deployPlan = await readPath(workspaceDir, ARTIFACT_PATHS.deployPlan);
  const publishPlan = await readPath(workspaceDir, ARTIFACT_PATHS.publishPlan);
  const dataPlan = await readPath(workspaceDir, DATA_PATHS.dataPlan);

  let quality = null;
  if (stage === "validate") {
    quality = await runWorkspaceValidation(workspaceDir);
  }

  const checks = [
    check("contract:manifest", existsSync(join(workspaceDir, WORKSPACE_PATHS.workspaceManifest)), `${WORKSPACE_PATHS.workspaceManifest} exists`, { path: WORKSPACE_PATHS.workspaceManifest }),
    check("contract:required_files", contract.ok, "required workspace files exist", { missing: contract.required.filter((item) => !item.exists).map((item) => item.path) }),
    check("readiness:mock_data", hasReady(manifest.readiness, "mockData"), "mock data readiness is ready"),
    check("readiness:agent", hasReady(manifest.readiness, "agent"), "agent readiness is ready"),
  ];

  if (quality) {
    checks.push(check("validation:computed", quality.ok, "workspace validation computes cleanly", { summary: quality.summary }));
  }

  if (stageAtLeast(stage, "preview")) {
    checks.push(
      check("validation:report", Boolean(validationReport), `${ARTIFACT_PATHS.validationReport} exists`, { path: ARTIFACT_PATHS.validationReport }),
      check("validation:passing", validationReport?.ok === true, "validation report is passing"),
      check("trace:artifact", Boolean(specCodeTrace), `${ARTIFACT_PATHS.specCodeTrace} exists`, { path: ARTIFACT_PATHS.specCodeTrace }),
      check("trace:passing", specCodeTrace?.ok === true, "spec-to-code trace is passing", { blockers: specCodeTrace?.blockers || [] }),
      check("readiness:tests", manifest.readiness?.tests?.status === "passing", "tests readiness is passing"),
    );
  }

  if (stageAtLeast(stage, "promote")) {
    checks.push(
      check("preview:report", Boolean(previewReport), `${ARTIFACT_PATHS.previewReport} exists`, { path: ARTIFACT_PATHS.previewReport }),
      check("preview:passing", previewReport?.ok === true, "preview report is passing"),
    );
  }

  if (stageAtLeast(stage, "deploy:plan")) {
    checks.push(
      check("promotion:packet", Boolean(promotionPacket), `${ARTIFACT_PATHS.promotionPacket} exists`, { path: ARTIFACT_PATHS.promotionPacket }),
      check("promotion:gate", promotionPacket?.promotionGate?.ok === true, "promotion gate is passing", { blockers: promotionPacket?.promotionGate?.blockers || [] }),
    );
  }

  if (stageAtLeast(stage, "publish:plan")) {
    checks.push(
      check("deploy:plan", Boolean(deployPlan), `${ARTIFACT_PATHS.deployPlan} exists`, { path: ARTIFACT_PATHS.deployPlan }),
      check("publish:data_context", Boolean(dataPlan) || manifest.readiness?.dataPackage?.status === "ready", "data package context is available before publish planning"),
    );
  }

  const blockers = checks.filter((item) => !item.ok).map((item) => ({
    id: item.id,
    message: item.message,
    detail: Object.fromEntries(Object.entries(item).filter(([key]) => !["id", "ok", "level", "message"].includes(key))),
  }));
  const report = {
    kind: "ge.workspace_doctor",
    workspace: workspaceId,
    stage,
    stageLabel: STAGE_LABELS[stage],
    ok: blockers.length === 0,
    generatedAt: new Date().toISOString(),
    contract,
    readiness: manifest.readiness,
    checks,
    summary: compactChecks(checks),
    blockers,
    repairTasks: buildRepairTasks({ stage, checks, validationReport, specCodeTrace, promotionPacket }),
    evidence: {
      validationReport: validationReport ? ARTIFACT_PATHS.validationReport : null,
      specCodeTrace: specCodeTrace ? ARTIFACT_PATHS.specCodeTrace : null,
      previewReport: previewReport ? ARTIFACT_PATHS.previewReport : null,
      promotionPacket: promotionPacket ? ARTIFACT_PATHS.promotionPacket : null,
      deployPlan: deployPlan ? ARTIFACT_PATHS.deployPlan : null,
      publishPlan: publishPlan ? ARTIFACT_PATHS.publishPlan : null,
    },
  };

  if (write) {
    await writeWorkspaceJson(workspaceDir, ARTIFACT_PATHS.workspaceDoctor, report);
    await writeWorkspaceText(workspaceDir, ARTIFACT_PATHS.workspaceDoctorMarkdown, renderWorkspaceDoctorReport(report));
  }
  return report;
}

export async function assertWorkspaceDoctorGate(options = {}) {
  const report = await runWorkspaceDoctor(options);
  if (!report.ok) {
    const first = report.blockers[0];
    const error = new Error(`workspace doctor failed for ${report.stage}: ${first?.id || "unknown"} - ${first?.message || "blocked"}`);
    error.report = report;
    throw error;
  }
  return report;
}
