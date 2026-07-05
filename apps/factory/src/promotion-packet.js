import { stat } from "node:fs/promises";
import { existsSync } from "node:fs";
import { join } from "node:path";
import { glob } from "tinyglobby";
import { readJsonAsync } from "@ge/std/json-io";
import { computeProofBinding, validateProofBinding } from "@ge/admission";
import {
  updateWorkspaceCapabilities,
  writeJsonArtifact,
  writeMarkdownArtifact,
} from "./workspace-capabilities.js";
import { ARTIFACT_PATHS, DATA_PATHS, PROMOTION_POLICY, PROMOTION_SHARE_FILES, WORKSPACE_PATHS } from "./workspace-contract.js";
import {
  buildDeliveryGraph,
  buildGoogleCloudCommandGroups,
  renderGraphArtifact,
  renderMermaidGraph,
} from "./deploy-plan.js";

// Merged refine completion packet (provider-agnostic) emitted by `factory
// harness-refine`. Carries the SDK-validated spec_to_code_fidelity verdict.
const HARNESS_REFINE_PATH = "artifacts/harness-refine.json";

function readJson(path, fallback = null) {
  return readJsonAsync(path, fallback, { rethrowUnexpected: true });
}

async function listWorkspaceFiles(workspaceDir) {
  const rels = await glob("**/*", {
    cwd: workspaceDir, onlyFiles: true, dot: true,
    ignore: ["**/.git/**", "**/.venv/**", "**/__pycache__/**"],
  });
  // Preserve the prior dotfile rule: skip dot entries at any level EXCEPT .ge-harness.
  const kept = rels.filter((p) => !p.split("/").some((seg) => seg.startsWith(".") && seg !== ".ge-harness"));
  const files = await Promise.all(kept.map(async (rel) => {
    const info = await stat(join(workspaceDir, rel));
    return { path: rel, size: info.size, mtime: info.mtimeMs };
  }));
  return files.sort((a, b) => a.path.localeCompare(b.path));
}

function artifactStatus(path, value, summary = "") {
  return {
    path,
    ok: Boolean(value),
    summary,
  };
}

function compactPreview(previewReport) {
  if (!previewReport) return null;
  return {
    ok: previewReport.ok === true,
    prompt: previewReport.prompt || "hello",
    response: previewReport.response || "",
    rootAgentPath: previewReport.rootAgentPath || "app",
    exitCode: previewReport.code ?? null,
    generatedAt: previewReport.generatedAt || null,
  };
}

function buildPromotionGate({ validationReport, specCodeTrace, generatorFeedback, refineResult, proofBinding }) {
  const blockers = [];
  if (validationReport?.ok !== true) blockers.push("validation report is not passing");
  if (!specCodeTrace) blockers.push(`missing ${ARTIFACT_PATHS.specCodeTrace}`);
  else if (specCodeTrace.ok !== true) blockers.push(...(specCodeTrace.blockers || ["spec-code trace is not passing"]));
  const hardFeedback = [
    ...(generatorFeedback?.specGaps || []),
    ...(generatorFeedback?.toolGaps || []),
    ...(generatorFeedback?.evalGaps || []),
  ].filter(Boolean);
  if (hardFeedback.length) blockers.push(...hardFeedback.map((gap) => `harness feedback: ${gap}`));
  const specToCodeScore = Number(generatorFeedback?.specToCodeScore || 0);
  if (generatorFeedback && specToCodeScore > 0 && specToCodeScore < 4) blockers.push(`harness spec-to-code score below threshold: ${specToCodeScore}`);
  // Review verdict: an explicit "not ok to promote" is a hard block.
  if (generatorFeedback && generatorFeedback.okToPromote === false) blockers.push("harness review verdict: ok_to_promote is false");
  // Refine verdict: the structured spec-to-code fidelity must be "pass". This is
  // the SDK-validated field the refine harness now emits — it finally gates here.
  const specToCodeFidelity = refineResult?.spec_to_code_fidelity || null;
  if (specToCodeFidelity && specToCodeFidelity !== "pass") blockers.push(`refine spec-to-code fidelity: ${specToCodeFidelity}`);
  if (proofBinding?.ok !== true) blockers.push("proof binding is missing or stale");
  return {
    ok: blockers.length === 0,
    policy: PROMOTION_POLICY,
    specToCodeScore: generatorFeedback ? specToCodeScore : null,
    specToCodeFidelity,
    blockers,
  };
}

// Evaluate the promotion gate for a workspace from its on-disk artifacts, without
// rewriting the packet. Deploy entry points (local CLI + cloud worker) call this
// to refuse shipping a workspace that hasn't passed validation + the harness
// verdicts.
export async function readPromotionGate(workspaceDir) {
  const [validationReport, specCodeTrace, generatorFeedback, refineResult] = await Promise.all([
    readJson(join(workspaceDir, ARTIFACT_PATHS.validationReport), null),
    readJson(join(workspaceDir, ARTIFACT_PATHS.specCodeTrace), null),
    readJson(join(workspaceDir, ARTIFACT_PATHS.generatorFeedback), null),
    readJson(join(workspaceDir, HARNESS_REFINE_PATH), null),
  ]);
  const packet = await readJson(join(workspaceDir, ARTIFACT_PATHS.promotionPacket), null);
  const currentProofBinding = computeProofBinding(workspaceDir);
  const proofBinding = packet?.proofBinding
    ? { ...currentProofBinding, ...validateProofBinding(packet.proofBinding, currentProofBinding) }
    : currentProofBinding;
  return buildPromotionGate({ validationReport, specCodeTrace, generatorFeedback, refineResult, proofBinding });
}

export async function createPromotionPacket({
  workspaceDir,
  manifestPath,
  projectId,
  repoRoot,
  source = "manual",
} = {}) {
  if (!workspaceDir || !manifestPath || !projectId) throw new Error("workspaceDir, manifestPath, and projectId are required");
  const manifest = await updateWorkspaceCapabilities({ workspaceDir, manifestPath, patch: { repoRoot } });
  const validationReport = await readJson(join(workspaceDir, ARTIFACT_PATHS.validationReport), null);
  const specCodeTrace = await readJson(join(workspaceDir, ARTIFACT_PATHS.specCodeTrace), null);
  const generatorFeedback = await readJson(join(workspaceDir, ARTIFACT_PATHS.generatorFeedback), null);
  const refineResult = await readJson(join(workspaceDir, HARNESS_REFINE_PATH), null);
  const previewReport = await readJson(join(workspaceDir, ARTIFACT_PATHS.previewReport), null);
  const deployPlan = await readJson(join(workspaceDir, ARTIFACT_PATHS.deployPlan), null);
  const publishPlan = await readJson(join(workspaceDir, ARTIFACT_PATHS.publishPlan), null);
  const dataStorePlan = await readJson(join(workspaceDir, DATA_PATHS.dataPlan), null);
  const cloudDataPlan = await readJson(join(workspaceDir, DATA_PATHS.cloudDataManifest), null);
  const fixtureManifest = await readJson(join(workspaceDir, WORKSPACE_PATHS.fixtureManifest), null);
  const pipeline = await readJson(join(workspaceDir, WORKSPACE_PATHS.pipeline), null);
  const files = await listWorkspaceFiles(workspaceDir);
  const generatedAt = new Date().toISOString();
  const proofBinding = computeProofBinding(workspaceDir);
  const promotionGate = buildPromotionGate({ validationReport, specCodeTrace, generatorFeedback, refineResult, proofBinding });

  const packet = {
    schemaVersion: 1,
    kind: "ge.harness.promotion_packet",
    workspace: {
      id: projectId,
      name: manifest.name || projectId,
      mode: manifest.mode || "local_mock",
      goal: manifest.goal || null,
      useCaseId: manifest.useCaseId || null,
      departmentId: manifest.departmentId || null,
    },
    source,
    generatedAt,
    capabilities: manifest.capabilities || [],
    readiness: manifest.readiness || {},
    nextActions: manifest.nextActions || [],
    evidence: {
      validation: artifactStatus(
        ARTIFACT_PATHS.validationReport,
        validationReport,
        validationReport ? `${validationReport.ok ? "pass" : "fail"} · ${validationReport.checks?.length || 0} checks` : "missing",
      ),
      preview: artifactStatus(
        ARTIFACT_PATHS.previewReport,
        previewReport,
        previewReport ? `${previewReport.ok ? "pass" : "fail"} · ${previewReport.rootAgentPath || "app"}` : "missing",
      ),
      specCodeTrace: artifactStatus(
        ARTIFACT_PATHS.specCodeTrace,
        specCodeTrace,
        specCodeTrace ? `${specCodeTrace.ok ? "pass" : "fail"} · ${specCodeTrace.totals?.requiredIntentsOk || 0}/${specCodeTrace.totals?.intents || 0} intents` : "missing",
      ),
      generatorFeedback: artifactStatus(
        ARTIFACT_PATHS.generatorFeedback,
        generatorFeedback,
        generatorFeedback ? `${generatorFeedback.okToPromote ? "promote" : "review"} · score ${generatorFeedback.specToCodeScore ?? generatorFeedback.score ?? "n/a"}` : "not generated",
      ),
      fixtures: artifactStatus(
        WORKSPACE_PATHS.fixtureManifest,
        fixtureManifest,
        fixtureManifest ? `${fixtureManifest.tables?.length || 0} tables · ${fixtureManifest.documents?.length || 0} docs` : "missing",
      ),
      deployPlan: artifactStatus(ARTIFACT_PATHS.deployPlan, deployPlan, deployPlan ? deployPlan.target || "plan ready" : "not generated"),
      publishPlan: artifactStatus(ARTIFACT_PATHS.publishPlan, publishPlan, publishPlan ? "plan ready" : "not generated"),
      dataStorePlan: artifactStatus(DATA_PATHS.dataPlan, dataStorePlan, dataStorePlan ? `${dataStorePlan.datastores?.length || 0} datastores` : "not generated"),
      alloyDbPackage: artifactStatus(DATA_PATHS.alloyDbPackage, existsSync(join(workspaceDir, DATA_PATHS.alloyDbPackage)), "OLTP SQL package"),
      firestorePackage: artifactStatus(DATA_PATHS.firestorePackage, existsSync(join(workspaceDir, DATA_PATHS.firestorePackage)), "Firestore/Firebase package"),
      bigtablePackage: artifactStatus(DATA_PATHS.bigtablePackage, existsSync(join(workspaceDir, DATA_PATHS.bigtablePackage)), "Bigtable package"),
      bigqueryPackage: artifactStatus(DATA_PATHS.bigqueryPackage, existsSync(join(workspaceDir, DATA_PATHS.bigqueryPackage)), "BigQuery package"),
      gcsPackage: artifactStatus(DATA_PATHS.gcsObjectPlan, existsSync(join(workspaceDir, DATA_PATHS.gcsObjectPlan)), "Cloud Storage blob package"),
      cloudDataPlan: artifactStatus(DATA_PATHS.cloudDataManifest, cloudDataPlan, cloudDataPlan ? cloudDataPlan.target?.structured || "cloud package ready" : "not generated"),
    },
    preview: compactPreview(previewReport),
    promotionGate,
    proofBinding,
    specCodeTrace: specCodeTrace ? {
      ok: specCodeTrace.ok,
      coverage: specCodeTrace.coverage,
      blockers: specCodeTrace.blockers || [],
      path: ARTIFACT_PATHS.specCodeTrace,
    } : null,
    pipeline: pipeline?.pipeline || pipeline?.steps || null,
    fileInventory: {
      total: files.length,
      artifacts: files.filter((file) => file.path.startsWith("artifacts/")).map((file) => file.path),
      tests: files.filter((file) => file.path.startsWith("tests/")).map((file) => file.path),
      generatedFiles: files
        .filter((file) => !file.path.startsWith("runs/") && !file.path.startsWith(".ge-harness/"))
        .map((file) => file.path)
        .slice(0, 200),
    },
    handoff: {
      shareFiles: PROMOTION_SHARE_FILES.filter((relPath) => relPath === ARTIFACT_PATHS.promotionPacketMarkdown || relPath === ARTIFACT_PATHS.promotionPacket || existsSync(join(workspaceDir, relPath))),
      commands: [
        `ge validate ${projectId}`,
        `ge preview ${projectId}`,
        `ge promote:packet ${projectId}`,
        `ge deploy:plan ${projectId}`,
        `ge publish:plan ${projectId}`,
      ],
      policy: promotionGate.ok
        ? "Plan-only after preview. Do not deploy or publish without explicit approval."
        : "Promotion blocked until validation and spec-code trace pass.",
    },
  };
  packet.googleCloud = {
    commandGroups: buildGoogleCloudCommandGroups({ projectId, workspaceDir, deployPlan, publishPlan }),
  };
  packet.visualization = {
    graphPath: ARTIFACT_PATHS.graph,
    mermaidPath: ARTIFACT_PATHS.graphMarkdown,
  };
  packet.visualization.graph = buildDeliveryGraph(packet);
  packet.visualization.mermaid = renderMermaidGraph(packet.visualization.graph);

  await writeJsonArtifact(workspaceDir, ARTIFACT_PATHS.promotionPacket, packet);
  await writeMarkdownArtifact(workspaceDir, ARTIFACT_PATHS.promotionPacketMarkdown, renderPromotionPacket(packet));
  const updated = await updateWorkspaceCapabilities({ workspaceDir, manifestPath, patch: { repoRoot } });
  const updatedPacket = {
    ...packet,
    capabilities: updated.capabilities || packet.capabilities,
    readiness: updated.readiness,
    nextActions: updated.nextActions,
  };
  updatedPacket.promotionGate = promotionGate;
  updatedPacket.visualization.graph = buildDeliveryGraph(updatedPacket);
  updatedPacket.visualization.mermaid = renderMermaidGraph(updatedPacket.visualization.graph);
  await writeJsonArtifact(workspaceDir, ARTIFACT_PATHS.graph, updatedPacket.visualization.graph);
  await writeMarkdownArtifact(workspaceDir, ARTIFACT_PATHS.graphMarkdown, renderGraphArtifact(updatedPacket));
  await writeJsonArtifact(workspaceDir, ARTIFACT_PATHS.promotionPacket, updatedPacket);
  await writeMarkdownArtifact(workspaceDir, ARTIFACT_PATHS.promotionPacketMarkdown, renderPromotionPacket(updatedPacket));
  return { packet: updatedPacket, paths: [ARTIFACT_PATHS.promotionPacketMarkdown, ARTIFACT_PATHS.promotionPacket, ARTIFACT_PATHS.graphMarkdown, ARTIFACT_PATHS.graph] };
}

export function renderPromotionPacket(packet) {
  const evidence = packet.evidence || {};
  const lines = [
    "# GE Promotion Packet",
    "",
    `Workspace: ${packet.workspace?.id || "unknown"}`,
    `Mode: ${packet.workspace?.mode || "local_mock"}`,
    `Generated: ${packet.generatedAt}`,
    "",
    "## Capabilities",
    ...(packet.capabilities || []).map((capability) => `- ${capability}`),
    "",
    "## Readiness",
    "```json",
    JSON.stringify(packet.readiness || {}, null, 2),
    "```",
    "",
    "## Evidence",
    ...Object.entries(evidence).map(([name, item]) => `- ${name}: ${item.ok ? "ready" : "missing"} (${item.path}) ${item.summary ? `- ${item.summary}` : ""}`),
    "",
    "## Promotion Gate",
    `Status: ${packet.promotionGate?.ok ? "pass" : "blocked"}`,
    ...(packet.promotionGate?.blockers?.length ? packet.promotionGate.blockers.map((blocker) => `- ${blocker}`) : ["- no blockers"]),
    "",
    "## Preview",
    packet.preview ? `Prompt: ${packet.preview.prompt}` : "No preview report available.",
    packet.preview?.response ? `Response: ${packet.preview.response}` : "",
    "",
    "## Next Actions",
    ...(packet.nextActions || []).map((action) => `- ${action}`),
    "",
    "## Handoff Commands",
    "```bash",
    ...(packet.handoff?.commands || []),
    "```",
    "",
    "## Google Cloud Commands",
    ...(packet.googleCloud?.commandGroups || []).flatMap((group) => [
      `### ${group.title}`,
      "```bash",
      ...(group.commands || []),
      "```",
      group.note ? `Note: ${group.note}` : "",
      "",
    ]),
    "## Graph",
    `See ${packet.visualization?.mermaidPath || "artifacts/GRAPH.md"} and ${packet.visualization?.graphPath || "artifacts/graph.json"}.`,
    "",
    `Policy: ${packet.handoff?.policy || "No policy specified."}`,
    "",
  ];
  return lines.filter((line) => line !== "").join("\n") + "\n";
}
