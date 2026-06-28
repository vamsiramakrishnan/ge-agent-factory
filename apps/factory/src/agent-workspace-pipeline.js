import { runWorkspaceValidation } from "./workspace-validation.js";
import { updateWorkspaceCapabilities } from "./workspace-capabilities.js";
import { ARTIFACT_PATHS, writeWorkspaceJson, writeWorkspaceText } from "./workspace-contract.js";

export function renderValidationReport(report) {
  return [
    "# Validation Report",
    "",
    `Workspace: ${report.workspace}`,
    `Status: ${report.ok ? "pass" : "fail"}`,
    `Generated: ${report.generatedAt}`,
    "",
    "## Readiness",
    "```json",
    JSON.stringify(report.readiness, null, 2),
    "```",
    "",
    "## Spec-Code Trace",
    report.specCodeTrace
      ? `Status: ${report.specCodeTrace.ok ? "pass" : "fail"}`
      : "Status: missing",
    ...(report.specCodeTrace?.blockers?.length
      ? report.specCodeTrace.blockers.map((blocker) => `- ${blocker}`)
      : ["- no blockers"]),
    "",
    "## Next Actions",
    ...report.nextActions.map((action) => `- ${action}`),
    "",
  ].join("\n");
}

export async function validateAgentWorkspace({
  workspaceDir,
  manifestPath,
  workspaceId,
  repoRoot,
  testsRequested = true,
  testExitCode = null,
  source = "pipeline",
} = {}) {
  if (!workspaceDir || !manifestPath || !workspaceId) {
    throw new Error("workspaceDir, manifestPath, and workspaceId are required");
  }
  const quality = await runWorkspaceValidation(workspaceDir);
  await writeWorkspaceJson(workspaceDir, ARTIFACT_PATHS.specCodeTrace, quality.specCodeTrace);

  const manifest = await updateWorkspaceCapabilities({ workspaceDir, manifestPath, patch: { repoRoot } });
  const checksOk = quality.ok && manifest.readiness.agent.status === "ready" && manifest.readiness.mockData.status === "ready";
  const report = {
    ok: checksOk && (!testsRequested || testExitCode === 0),
    workspace: workspaceId,
    source,
    checks: quality.checks,
    summary: quality.summary,
    specCodeTrace: {
      ok: quality.specCodeTrace?.ok === true,
      coverage: quality.specCodeTrace?.coverage || null,
      blockers: quality.specCodeTrace?.blockers || [],
      path: ARTIFACT_PATHS.specCodeTrace,
    },
    testsRequested,
    testExitCode,
    readiness: manifest.readiness,
    nextActions: manifest.nextActions,
    generatedAt: new Date().toISOString(),
  };

  await writeWorkspaceJson(workspaceDir, ARTIFACT_PATHS.validationReport, report);
  await writeWorkspaceText(workspaceDir, ARTIFACT_PATHS.validationReportMarkdown, renderValidationReport(report));
  const updatedManifest = await updateWorkspaceCapabilities({ workspaceDir, manifestPath, patch: { repoRoot } });
  report.readiness = updatedManifest.readiness;
  report.nextActions = updatedManifest.nextActions;
  await writeWorkspaceJson(workspaceDir, ARTIFACT_PATHS.validationReport, report);
  await writeWorkspaceText(workspaceDir, ARTIFACT_PATHS.validationReportMarkdown, renderValidationReport(report));
  return report;
}
