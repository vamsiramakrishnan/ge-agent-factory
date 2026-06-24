/**
 * Shared interview-start logic.
 *
 * The "fill brief → fire an Antigravity harness run → persist the active task +
 * seed" flow was duplicated verbatim in views/Interview.tsx and views/Journey.tsx.
 * This module is the single source of truth: both views import `startInterview`,
 * `interviewArtifacts`, `buildInterviewPrompt`, and the small string helpers.
 *
 * No data-contract changes — it builds the exact same ge.runtimeStart input shape
 * and writes the same localStorage keys the views relied on before, plus an optional
 * grounding block (clamped via lib/groundingBudget) when the user uploaded BRDs.
 */
import { ge, type MissionArtifactRef, type RuntimeTaskSummary, type StatusBoard } from "../services/geClient";
import { clampGrounding } from "./groundingBudget";

export function splitCsv(value: string): string[] {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

export function slugify(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 64) || "new-agent";
}

/** The five artifacts the downstream pipeline consumes from an interview. */
export function interviewArtifacts(usecaseId: string): MissionArtifactRef[] {
  const root = `.ge/interviews/${usecaseId}`;
  return [
    {
      name: "agent-spec",
      type: "json",
      path: `${root}/agent-spec.json`,
      ui: {
        title: "Spec",
        role: "spec",
        action: "Run Mission",
        command: `ge mission run --spec ${root}/agent-spec.json`,
      },
    },
    {
      name: "interview-notes",
      type: "file",
      path: `${root}/interview-notes.md`,
      ui: { title: "Interview", role: "notes", action: "Review" },
    },
    {
      name: "golden-evals",
      type: "json",
      path: `${root}/golden-evals.json`,
      ui: { title: "Evals", role: "eval", action: "Validate" },
    },
    {
      name: "simulator-needs",
      type: "json",
      path: `${root}/simulator-needs.json`,
      ui: { title: "Simulators", role: "simulation", action: "Plan Seeds" },
    },
    {
      name: "mock-data-needs",
      type: "json",
      path: `${root}/mock-data-needs.json`,
      ui: { title: "Mock Data", role: "mock_data", action: "Generate Data" },
    },
  ];
}

export function buildInterviewPrompt({
  usecaseId,
  outcome,
  systems,
  constraints,
  groundingText,
}: {
  usecaseId: string;
  outcome: string;
  systems: string[];
  constraints: string;
  groundingText?: string;
}): string {
  const artifactDir = `.ge/interviews/${usecaseId}`;
  const lines = [
    "Use the interviewing-specs skill and produce a pipeline-ready agent spec.",
    "",
    `Use case id: ${usecaseId}`,
    `Business outcome: ${outcome.trim()}`,
    `Systems: ${systems.join(", ") || "unknown"}`,
    `Guardrails: ${constraints.trim() || "none supplied"}`,
    "",
    "Required work:",
    "1. If missing information changes systems, write permissions, simulator scope, mock data, evals, or deployment, ask the user with the available interaction/question mechanism before continuing.",
    "2. Map existing systems and simulator packs before proposing new ones.",
    "3. Define tool intents, read/write safety gates, evidence requirements, mock data needs, simulator seed needs, unstructured evidence needs, and golden eval scenarios.",
    "4. Use existing ge/ge-mock/simulator tooling where applicable; do not invent one-off scripts.",
    "5. Make agent-spec.json catalog-grade, with the same level of detail as the existing 363 specs: subtitle, persona, KPIs with before/after, status quo, agentification, architecture connections/pipeline, generationSpec.version, rowPolicy, sourceSystems with owns/protocol/localBacking/toolNames/evidence, entities with datastore/rowCount/columns, documents with citation anchors, anomalies, datastorePackaging, validation smoke prompt/assertions, and a complete behaviorContract with golden evals.",
    "5a. When the use case is multi-stage (architecture.pipeline has 2+ stages), include behaviorContract.workflow = { mode: \"sequential\" | \"parallel\", steps: [{ label, description, tools }] } — one ordered step per pipeline stage, each step's `tools` listing the behaviorContract.toolIntents[].name values that stage uses. Use \"parallel\" only when stages truly run independently; otherwise \"sequential\". Omit workflow for single-stage / single-tool use cases so they stay single-agent.",
    "5b. Specify what the agent ANSWERS as behaviorContract.answerableQueries = [{ id, request, tools, evidence, stage? }] — one capability per distinct question/request the agent handles (or per workflow stage when multi-stage). `request` is the natural-language question (e.g. \"What is this account's reconciliation status?\"); `tools` lists the behaviorContract.toolIntents[].name values that serve it; `evidence` is what it must surface; `stage` is the workflow step id when applicable. Cover every inScope item.",
    "5c. For EACH golden eval, add `mechanisms`: the toolIntent names that MUST be called to satisfy that test (the write/query tools its query needs) — these become the eval's expected tool trajectory. Keep mechanisms consistent with the eval's expectedToolCalls.",
    "5d. Ground answerableQueries, evidence, and eval mechanisms in any uploaded BRD documents: cite the originating document (its generationSpec.documents[].id) on the relevant query/eval (mustCiteDocuments) rather than inventing requirements.",
    `6. Write artifacts under ${artifactDir}: agent-spec.json, interview-notes.md, golden-evals.json, simulator-needs.json, mock-data-needs.json.`,
    "7. End with the exact next ge mission command that should run this spec.",
    `8. As you finalize the spec, ALSO stream it inline wrapped in <artifact identifier="agent-spec" type="application/json" title="Agent Spec">…</artifact> in addition to writing agent-spec.json.`,
  ];

  const grounding = (groundingText ?? "").trim();
  if (grounding) {
    const clamped = clampGrounding(grounding);
    lines.push(
      "",
      "Grounding documents (uploaded by the user):",
      "Treat the following as authoritative source material. Extract systems, entities, documents, and constraints from it before asking the user to re-supply what it already states.",
      "--- BEGIN GROUNDING ---",
      clamped.text,
      "--- END GROUNDING ---",
    );
  }

  return lines.join("\n");
}

function persistGeneratedSpecIdentity({ id, path, taskId }: { id: string; path: string; taskId?: string }): void {
  window.localStorage.setItem("ge.interview.generatedSpec", JSON.stringify({
    id,
    path,
    taskId: taskId || null,
    updatedAt: new Date().toISOString(),
  }));
}

export interface StartInterviewArgs {
  outcome: string;
  systems: string;
  constraints: string;
  /** Defaults to slugify(outcome) when omitted. */
  usecaseId?: string;
  /** Combined extracted text from selected grounding documents. */
  groundingText?: string;
  status?: StatusBoard | null;
}

/**
 * Start an Antigravity interview harness run.
 *
 * Re-checks runtime readiness first (throws a humanized error if the daemon can't
 * run harness tasks), then fires ge.runtimeStart with the same input shape both
 * views used, persists the active task + seed + generated-spec identity, and
 * returns the started task.
 */
export async function startInterview({
  outcome,
  systems,
  constraints,
  usecaseId,
  groundingText,
  status,
}: StartInterviewArgs): Promise<RuntimeTaskSummary> {
  const id = usecaseId || slugify(outcome);
  const systemList = splitCsv(systems);

  const runtime = await ge.runtimeStatus().catch((err: any) => ({
    ok: false,
    supportedTaskKinds: [] as string[],
    restartCommand: err?.restartCommand || "ge daemon stop && ge daemon start",
  }));
  const restartCommand = (runtime as any).restartCommand || "ge daemon stop && ge daemon start";
  const supportsInterview = runtime.supportedTaskKinds?.includes("harness.run") === true;
  if (!runtime.ok || !supportsInterview) {
    throw new Error(`The local runtime daemon needs to be restarted before interviews can run. Run: ${restartCommand}`);
  }

  const started = await ge.runtimeStart({
    kind: "harness.run",
    input: {
      workspaceDir: ".",
      agent: "antigravity-sdk",
      stage: "interview,spec_generation,mock_data,simulation,eval",
      permissionProfile: "workspace-write",
      vertex: true,
      project: status?.project || undefined,
      location: "global",
      model: "gemini-3.5-flash",
      expectedArtifacts: interviewArtifacts(id),
      message: buildInterviewPrompt({ usecaseId: id, outcome, systems: systemList, constraints, groundingText }),
    },
  });

  window.localStorage.setItem("ge.interview.activeTaskId", started.id);
  window.localStorage.setItem("ge.interview.seed", JSON.stringify({ outcome, systems, constraints }));
  persistGeneratedSpecIdentity({
    id,
    path: `.ge/interviews/${id}/agent-spec.json`,
    taskId: started.id,
  });

  return started;
}

/** Map opaque runtime failures to actionable guidance. Shared by both views. */
export function humanizeInterviewError(message: string, restartCommand: string): string {
  if (/Antigravity Vertex execution requires project and location/i.test(message)) {
    return "Antigravity could not find the Vertex project/location. The runtime now reads .ge.json from the repository root; restart the daemon and retry the interview.";
  }
  if (/unsupported task kind:\s*harness\.run/i.test(message)) {
    return `The local runtime daemon is running older code and does not support interview harness tasks yet. Restart it, then retry: ${restartCommand}`;
  }
  if (/harness run input is not classified safe/i.test(message)) {
    return "The interview request was blocked by the runtime safety gate. Check that the prompt, workspace, agent, and stages are valid.";
  }
  if (/failed to fetch|ECONNREFUSED|stopped|unavailable/i.test(message)) {
    return `The local runtime daemon is not reachable. Start it, then retry: ge daemon start`;
  }
  return message;
}
