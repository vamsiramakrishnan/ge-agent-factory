import { existsSync, readFileSync } from "node:fs";
import { readJson } from "@ge/std/json-io";
import { parseStdoutJson } from "./pipeline-artifacts.mjs";

function readJsonArtifact(artifact) {
  return readJson(artifact?.resolvedPath, null);
}

function artifactByName(artifactCheck, name) {
  return (artifactCheck?.artifacts || []).find((artifact) => artifact.name === name) || null;
}

function stdoutPayload(childTask) {
  try {
    return parseStdoutJson(childTask?.output?.stdoutFull || childTask?.output?.stdout || "");
  } catch {
    return null;
  }
}

function summarizeMockGenerate({ childTask, artifactCheck }) {
  const stdout = stdoutPayload(childTask) || {};
  const dataPlan = readJsonArtifact(artifactByName(artifactCheck, "data_plan"));
  const scenarioGraph = readJsonArtifact(artifactByName(artifactCheck, "scenario_graph"));
  const realizationPlan = readJsonArtifact(artifactByName(artifactCheck, "snowfakery_realization_plan"));
  const simulatorIndex = readJsonArtifact(artifactByName(artifactCheck, "simulator_index"));
  return {
    kind: "mock.generate",
    ok: stdout.ok !== false && artifactCheck?.ok !== false,
    usecase: stdout.usecase || dataPlan?.usecase || dataPlan?.id || null,
    sources: stdout.sources ?? dataPlan?.sources?.length ?? null,
    datastores: stdout.datastores || dataPlan?.datastores?.map((item) => item.id || item.datastore || item) || [],
    scenarioGraph: {
      nodes: stdout.scenarioGraph?.nodes ?? scenarioGraph?.nodes?.length ?? null,
      edges: stdout.scenarioGraph?.edges ?? scenarioGraph?.edges?.length ?? null,
      datastores: stdout.scenarioGraph?.datastores || dataPlan?.scenarioGraph?.datastores || {},
      path: stdout.scenarioGraph?.path || dataPlan?.scenarioGraph?.path || null,
    },
    snowfakery: {
      objects: stdout.snowfakeryRealization?.objects ?? realizationPlan?.objects?.length ?? null,
      path: stdout.snowfakeryRealization?.path || "mock_data/snowfakery/realization-plan.json",
    },
    simulatorSeeds: stdout.simulatorSeeds || dataPlan?.simulatorSeeds || simulatorIndex?.simulators || [],
  };
}

function summarizeSnowfakeryGenerate({ artifactCheck }) {
  const output = artifactByName(artifactCheck, "snowfakery_output");
  const realization = readJsonArtifact(artifactByName(artifactCheck, "snowfakery_realization_plan"));
  return {
    kind: "snowfakery.generate",
    ok: artifactCheck?.ok !== false,
    objects: realization?.objects?.length ?? null,
    output: {
      path: output?.path || null,
      csvFiles: output?.metadata?.csvFiles ?? null,
      rowCount: output?.metadata?.rowCount ?? null,
      files: output?.metadata?.files ?? null,
    },
  };
}

function summarizeSimulatorSeed({ childTask, artifactCheck }) {
  const stdout = stdoutPayload(childTask) || readJsonArtifact(artifactByName(artifactCheck, "simulator_seed_report")) || {};
  return {
    kind: "simulator.seed",
    ok: stdout.ok !== false && artifactCheck?.ok !== false,
    workspace: stdout.workspace || null,
    snowfakeryOutputRoot: stdout.snowfakeryOutputRoot || null,
    simulatorIndex: stdout.simulatorIndex || null,
    simulators: (stdout.simulators || []).map((simulator) => ({
      simulatorId: simulator.simulatorId,
      seed: simulator.seed,
      inputs: simulator.inputs || [],
      collections: simulator.collections || {},
    })),
  };
}

function summarizeSimulatorValidate({ childTask, artifactCheck }) {
  const stdout = stdoutPayload(childTask) || {};
  const simulators = stdout.simulators || [];
  return {
    kind: "simulator.validate",
    ok: stdout.ok === true && artifactCheck?.ok !== false,
    simulators: simulators.map((simulator) => ({
      id: simulator.id,
      ok: simulator.ok,
      errors: simulator.errors || [],
      warnings: simulator.warnings || [],
      tools: simulator.tools ?? null,
      collections: simulator.collections ?? null,
      workflowHandlers: simulator.workflowHandlers ?? null,
    })),
    totals: {
      simulators: simulators.length,
      errors: simulators.reduce((sum, simulator) => sum + (simulator.errors || []).length, 0),
      warnings: simulators.reduce((sum, simulator) => sum + (simulator.warnings || []).length, 0),
      tools: simulators.reduce((sum, simulator) => sum + (simulator.tools || 0), 0),
      collections: simulators.reduce((sum, simulator) => sum + (simulator.collections || 0), 0),
    },
  };
}

export function summarizePipelineNode({ node = {}, childTask = null, artifactCheck = null } = {}) {
  if (node.kind === "mock.generate") return summarizeMockGenerate({ childTask, artifactCheck });
  if (node.kind === "snowfakery.generate") return summarizeSnowfakeryGenerate({ childTask, artifactCheck });
  if (node.kind === "simulator.seed") return summarizeSimulatorSeed({ childTask, artifactCheck });
  if (node.kind === "simulator.validate") return summarizeSimulatorValidate({ childTask, artifactCheck });
  return {
    kind: node.kind || node.runtimeKind || "pipeline.node",
    ok: artifactCheck?.ok !== false && !["blocked", "failed"].includes(childTask?.status),
  };
}
