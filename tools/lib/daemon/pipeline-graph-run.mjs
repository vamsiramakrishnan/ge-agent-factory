// tools/lib/daemon/pipeline-graph-run.mjs — the "pipeline.run" run-kind: the
// pipeline-graph resume-rehydration cluster. Plans a pipeline DAG
// (pipeline-graph-plan.mjs), walks it scheduling one runnable node at a time by
// delegating to whichever of the other five run-kinds a node's runtimeKind
// names, verifies each node's expected artifacts before advancing, and — on
// resume — rehydrates a stale graph against a freshly-planned one so nodes
// downstream of the resume point re-run with the *current* node-registry
// command shape rather than a possibly-stale persisted one. Also owns
// attaching a resumed pipeline's delegated child run back onto the parent
// run record (rehoming the child's graph/resumePlan pipeline-id references
// onto the parent). Moved verbatim out of tools/lib/runtime-daemon.mjs.
import { readJson } from "@ge/std/json-io";
import * as core from "../factory-core.mjs";
import { verifyPipelineArtifacts } from "../pipeline/pipeline-artifacts.mjs";
import { isDataPipelineNodeKind, validatePipelineNodeArtifacts } from "../pipeline/pipeline-node-registry.mjs";
import { summarizePipelineNode } from "../pipeline/pipeline-node-summary.mjs";
import { buildPipelineGraph, nextRunnablePipelineNode, patchPipelineNode, resetPipelineGraphForResume } from "../pipeline/pipeline-graph-plan.mjs";
import { REPO_ROOT } from "../state-paths.mjs";
import {
  appendEvent,
  createRun,
  runMetaPath,
  runOutput,
  updateRun,
  updateRunOutput,
  waitForTaskTerminal,
} from "./run-store.mjs";
import { taskDetail, taskSummary } from "./resume-plan.mjs";
import { startDoctorTask } from "./doctor-run.mjs";
import { startGeCommandTask, startProcessCommandTask } from "./command-run.mjs";
import { startHarnessRunTask } from "./harness-run.mjs";
import { startPipelineNodeCommandTask } from "./pipeline-node-run.mjs";
import { startRepairTask } from "./repair-run.mjs";

export function childStatusToNodeStatus(status) {
  if (status === "done") return "done";
  if (status === "skipped") return "skipped";
  if (["blocked", "failed"].includes(status)) return "blocked";
  return status || "blocked";
}

function escapeRegExp(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Rewrites references to `fromPipelineId` inside a resume plan's command strings
// so a rehomed child plan points at the parent/new pipeline id. Pipeline ids are
// whole tokens in these commands (`ge runs resume pipe-1`, `.../runs/pipe-1/...`),
// so we only substitute `from` where it is NOT part of a longer identifier —
// guarding both sides against word chars and hyphens. A plain replaceAll would
// corrupt an overlapping id (rehoming `pipe-1` would rewrite the `pipe-1` prefix
// inside `pipe-10`); the boundary lookarounds keep `pipe-10` intact.
export function rehomeResumePlan(plan = null, fromPipelineId = null, toPipelineId = null) {
  if (!plan || !toPipelineId) return plan;
  const from = fromPipelineId ? String(fromPipelineId) : "";
  const pattern = from ? new RegExp(`(?<![\\w-])${escapeRegExp(from)}(?![\\w-])`, "g") : null;
  return {
    ...plan,
    commands: Array.isArray(plan.commands)
      ? plan.commands.map((command) => pattern ? String(command).replace(pattern, () => toPipelineId) : String(command))
      : [],
  };
}

export function rehomePipelineGraph(graph = null, pipelineId = null, fromPipelineId = null) {
  if (!graph || !pipelineId) return graph;
  return {
    ...graph,
    id: pipelineId,
    nodes: (graph.nodes || []).map((node) => ({
      ...node,
      pipelineId,
      resumePlan: rehomeResumePlan(node.resumePlan, fromPipelineId || graph.id, pipelineId),
      childTask: node.childTask?.resumePlan
        ? { ...node.childTask, resumePlan: rehomeResumePlan(node.childTask.resumePlan, fromPipelineId || graph.id, pipelineId) }
        : node.childTask || null,
    })),
    edges: graph.edges || [],
  };
}

export function attachPipelineResumeChild({ parentId, child, nodeId = null }) {
  const parent = readJson(runMetaPath(parentId), null);
  if (!parent || !child) return;
  const currentOutput = parent.output || {};
  const parentGraph = currentOutput.graph || null;
  const delegatedGraph = parentGraph && nodeId
    ? patchPipelineNode(parentGraph, nodeId, {
      status: "running",
      childTaskId: child.id,
      childTask: taskSummary(child),
      blockers: [],
    })
    : parentGraph;
  updateRun(parentId, {
    status: "running",
    endedAt: null,
    output: {
      ...currentOutput,
      graph: delegatedGraph || parentGraph,
      counts: delegatedGraph?.counts || currentOutput.counts || parentGraph?.counts || null,
      delegatedTaskId: child.id,
      delegatedNodeId: nodeId,
    },
  });

  waitForTaskTerminal(child.id, {
    onEvent: (wrapped) => {
      const event = wrapped.event || {};
      if (!event.line) return;
      appendEvent(parentId, {
        type: "pipeline_resume_child_event",
        level: event.level || "info",
        childTaskId: child.id,
        childSeq: wrapped.seq,
        childEventType: event.type || null,
        line: `${child.id}: ${event.line}`,
      });
    },
  }).then((finishedChild) => {
    const latestParent = readJson(runMetaPath(parentId), parent);
    const childOutput = finishedChild?.output || {};
    const childGraph = childOutput.graph
      ? rehomePipelineGraph(childOutput.graph, parentId, child.id)
      : latestParent.output?.graph || null;
    const nextOutput = {
      ...(latestParent.output || {}),
      ...childOutput,
      graph: childGraph,
      counts: childGraph?.counts || childOutput.counts || latestParent.output?.counts || null,
      artifactRefs: childGraph?.nodes?.flatMap((node) => node.artifacts || []) || childOutput.artifactRefs || latestParent.output?.artifactRefs || [],
      delegatedTaskId: child.id,
      delegatedNodeId: nodeId,
    };
    appendEvent(parentId, {
      type: "pipeline_resume_child_terminal",
      level: finishedChild.status === "done" ? "info" : "warn",
      childTaskId: child.id,
      line: `child pipeline ${child.id} ${finishedChild.status}`,
      counts: nextOutput.counts || null,
    });
    updateRun(parentId, {
      status: finishedChild.status,
      endedAt: finishedChild.endedAt || new Date().toISOString(),
      error: finishedChild.error || null,
      output: nextOutput,
    });
  }).catch((error) => {
    const line = error?.message || String(error);
    appendEvent(parentId, { type: "pipeline_resume_child_failed", level: "error", childTaskId: child.id, line });
    updateRun(parentId, { status: "failed", endedAt: new Date().toISOString(), error: line });
  });
}

export async function startChildForPipelineNode(node) {
  if (node.runtimeKind === "doctor") return startDoctorTask(node.input || {});
  if (node.runtimeKind === "ge.command") return startGeCommandTask(node.input || {});
  if (node.runtimeKind === "process.command") return startProcessCommandTask(node.input || {});
  if (node.runtimeKind === "harness.run") return startHarnessRunTask(node.input || {});
  if (isDataPipelineNodeKind(node.runtimeKind)) return startPipelineNodeCommandTask(node.runtimeKind, node.input || {});
  if (node.runtimeKind === "repair.run") return await startRepairTask(node.input || {});
  throw new Error(`unsupported pipeline node runtime kind: ${node.runtimeKind || "<unset>"}`);
}

export function affectedPipelineNodeIds(graph = {}, startNodeId = null) {
  if (!startNodeId) return new Set();
  const nodes = graph.nodes || [];
  const childrenById = new Map();
  for (const node of nodes) {
    for (const dep of node.dependsOn || []) {
      childrenById.set(dep, [...(childrenById.get(dep) || []), node.id]);
    }
  }
  const affected = new Set([startNodeId]);
  const queue = [startNodeId];
  while (queue.length) {
    const current = queue.shift();
    for (const child of childrenById.get(current) || []) {
      if (affected.has(child)) continue;
      affected.add(child);
      queue.push(child);
    }
  }
  return affected;
}

export function rehydratePipelineGraphForResume(resumeGraph = {}, plannedGraph = {}, startNodeId = null) {
  if (!resumeGraph || !plannedGraph) return resumeGraph;
  const plannedById = new Map((plannedGraph.nodes || []).map((node) => [node.id, node]));
  const affected = affectedPipelineNodeIds(resumeGraph, startNodeId);
  const nodes = (resumeGraph.nodes || []).map((node) => {
    const planned = plannedById.get(node.id);
    if (!planned) return node;
    const shouldRunAgain = affected.has(node.id);
    const currentArtifacts = Array.isArray(node.artifacts) ? node.artifacts : [];
    const plannedArtifacts = Array.isArray(planned.artifacts) ? planned.artifacts : [];
    const next = {
      ...node,
      kind: planned.kind,
      label: planned.label,
      runtimeKind: planned.runtimeKind,
      input: planned.input,
      dependsOn: planned.dependsOn,
      blockers: Array.isArray(node.blockers) ? node.blockers : [],
      artifacts: shouldRunAgain ? plannedArtifacts : currentArtifacts.length ? currentArtifacts : plannedArtifacts,
    };
    return { ...next, resumePlan: node.resumePlan };
  });
  return {
    ...resumeGraph,
    input: { ...(plannedGraph.input || {}), ...(resumeGraph.input || {}) },
    edges: plannedGraph.edges || resumeGraph.edges || [],
    nodes,
  };
}

export async function startPipelineTask({ ids = [], scenario = null, spec = null, workspace = null, systems = [], targetStage = "preview", repair = true, attempts = 3, runPreview = false, query = {}, mode = null, executeFactory = false, useAntigravity = true, harnessAgent = null, harnessModel = null, harnessLocation = "global", resumedFrom = null, resumeGraph = null, startAtNode = null } = {}) {
  const cfg = core.loadConfig(query || {});
  // Centralized harness defaults (config-schema.mjs): callers that omit these
  // get the flag→env→.ge.json→default resolution instead of literals here.
  harnessAgent = harnessAgent || cfg.harnessAgent || "antigravity-sdk";
  harnessModel = harnessModel || cfg.refinementModel || "gemini-3.5-flash";
  const plannedGraph = buildPipelineGraph({
    mode: mode || cfg.mode || "local",
    ids,
    scenario,
    spec,
    workspace,
    systems,
    targetStage,
    repair,
    attempts,
    runPreview,
    query,
    executeFactory,
    useAntigravity,
    harnessAgent,
    harnessModel,
    harnessLocation,
  });
  const rehydratedGraph = resumeGraph && startAtNode ? rehydratePipelineGraphForResume(resumeGraph, plannedGraph, startAtNode) : null;
  const graph = rehydratedGraph && startAtNode ? resetPipelineGraphForResume({ ...rehydratedGraph, id: plannedGraph.id }, startAtNode) : plannedGraph;
  const run = createRun({
    id: graph.id,
    kind: "pipeline.run",
    input: { ids, scenario, spec, workspace, systems, targetStage, repair, attempts, runPreview, query, mode: mode || cfg.mode || "local", executeFactory, useAntigravity, harnessAgent, harnessModel, harnessLocation, resumedFrom, startAtNode },
  });
  updateRunOutput(run.id, { graph, counts: graph.counts, artifactRefs: [] });
  appendEvent(run.id, { type: "pipeline_started", line: `pipeline ${run.id} started`, graph: { id: graph.id, counts: graph.counts } });
  if (rehydratedGraph) {
    appendEvent(run.id, {
      type: "pipeline_graph_rehydrated",
      level: "info",
      line: `pipeline graph rehydrated from current node registry at ${startAtNode}`,
      startAtNode,
    });
  }

  (async () => {
    let current = graph;
    try {
      for (;;) {
        const node = nextRunnablePipelineNode(current);
        if (!node) break;
        current = patchPipelineNode(current, node.id, { status: "running" });
        updateRunOutput(run.id, { graph: current, counts: current.counts });
        appendEvent(run.id, { type: "pipeline_node_started", nodeId: node.id, line: `${node.id}: scheduling ${node.runtimeKind}` });
        const child = await startChildForPipelineNode(node);
        current = patchPipelineNode(current, node.id, { childTaskId: child.id, status: "running", childTask: taskSummary(child) });
        updateRunOutput(run.id, { graph: current, counts: current.counts });
        appendEvent(run.id, { type: "pipeline_child_started", nodeId: node.id, childTaskId: child.id, line: `${node.id}: child task ${child.id}` });
        const finishedChild = await waitForTaskTerminal(child.id, {
          onEvent: (wrapped) => {
            const event = wrapped.event || {};
            if (!event.line) return;
            appendEvent(run.id, {
              type: "pipeline_child_log",
              level: event.level || "info",
              nodeId: node.id,
              childTaskId: child.id,
              childSeq: wrapped.seq,
              line: `${node.id}: ${event.line}`,
              childEventType: event.type || null,
            });
          },
        });
        const childDetail = taskDetail(finishedChild);
        const plan = childDetail?.summary?.resumePlan || null;
        const baseArtifactCheck = verifyPipelineArtifacts(node.artifacts || [], { repoRoot: REPO_ROOT, childTask: finishedChild });
        const nodeSummary = summarizePipelineNode({ node, childTask: finishedChild, artifactCheck: baseArtifactCheck });
        const semanticCheck = validatePipelineNodeArtifacts(node.kind || node.runtimeKind, { input: node.input || {}, artifactCheck: baseArtifactCheck, summary: nodeSummary });
        const artifactCheck = {
          ...baseArtifactCheck,
          ok: baseArtifactCheck.ok && semanticCheck.ok,
          blockers: [...(baseArtifactCheck.blockers || []), ...(semanticCheck.blockers || [])],
          warnings: semanticCheck.warnings || [],
          semantic: semanticCheck,
        };
        const childNodeStatus = childStatusToNodeStatus(finishedChild?.status);
        const nodeStatus = childNodeStatus === "done" && !artifactCheck.ok ? "blocked" : childNodeStatus;
        const blockers = [
          ...(plan?.blockers || []),
          ...(childNodeStatus === "done" ? artifactCheck.blockers : []),
        ];
        current = patchPipelineNode(current, node.id, {
          status: nodeStatus,
          childTaskId: child.id,
          childTask: childDetail?.summary || null,
          blockers,
          warnings: artifactCheck.warnings || [],
          artifacts: artifactCheck.artifacts.length ? artifactCheck.artifacts : plan?.artifacts || childDetail?.summary?.artifactRefs || [],
          artifactCheck,
          summary: nodeSummary,
        });
        updateRunOutput(run.id, {
          graph: current,
          counts: current.counts,
          artifactRefs: current.nodes.flatMap((graphNode) => graphNode.artifacts || []),
        });
        appendEvent(run.id, {
          type: nodeStatus === "blocked" ? "pipeline_node_blocked" : "pipeline_node_done",
          level: nodeStatus === "blocked" ? "error" : "info",
          nodeId: node.id,
          childTaskId: child.id,
          line: artifactCheck.ok ? `${node.id}: ${nodeStatus}` : `${node.id}: blocked by ${artifactCheck.blockers.length} artifact issue${artifactCheck.blockers.length === 1 ? "" : "s"}`,
          resumePlan: plan,
          artifactCheck,
          summary: nodeSummary,
        });
        if (nodeStatus === "blocked") break;
      }
      const finalStatus = current.status === "blocked" ? "blocked" : current.counts.pending || current.counts.running ? "paused" : "done";
      appendEvent(run.id, {
        type: finalStatus === "done" ? "pipeline_done" : "pipeline_blocked",
        level: finalStatus === "done" ? "info" : "warn",
        line: `pipeline ${finalStatus}`,
        counts: current.counts,
      });
      updateRun(run.id, { status: finalStatus, endedAt: new Date().toISOString(), output: { ...runOutput(run.id), graph: { ...current, status: finalStatus }, counts: current.counts } });
    } catch (error) {
      const line = error?.message || String(error);
      appendEvent(run.id, { type: "pipeline_failed", level: "error", line });
      updateRun(run.id, { status: "failed", endedAt: new Date().toISOString(), error: line, output: runOutput(run.id) });
    }
  })();

  return readJson(runMetaPath(run.id), run);
}
