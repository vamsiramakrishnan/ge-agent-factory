// Type surface for contract.mjs — the daemon/runtime task-contract normalizers.
// Every output property below traces to a line in contract.mjs that writes it;
// input types declare only the fields the normalizers read.

// The normalized artifact reference every normalizer emits.
// Same shape as @ge/contracts' MissionArtifactRef (journey.ts
// MissionArtifactRefSchema) modulo required-ness (this side guarantees
// name/type/status and a nullable path after normalization; the schema keeps
// everything optional pre-normalization) — merge tracked by the action-kinds
// reconciliation spec (docs/design-specs/specs/2026-06-14-console-presentation-unification.md).
export type ArtifactRef = {
  name: string;
  type: string;
  path: string | null;
  status: string;
  metadata: { [key: string]: unknown };
  [key: string]: unknown;
};

export type Blocker = {
  id: string;
  message: string;
  /** Present when normalized from an object input (detail ?? data ?? null); absent for string inputs. */
  detail?: unknown;
  [key: string]: unknown;
};

// ── input shapes (what the normalizers read) ──────────────────────────────────

// Raw blocker as producers emit it: a bare message string or an object whose
// id/message are recovered from the field fallbacks normalizeBlocker reads.
export type BlockerInput =
  | string
  | {
      id?: string;
      code?: string;
      name?: string;
      message?: string;
      error?: string;
      detail?: unknown;
      data?: unknown;
      [key: string]: unknown;
    };

// Raw artifact ref: a bare path string or an object; normalizeArtifactRef
// falls back name→id→path and path→resolvedPath.
export type ArtifactRefInput =
  | string
  | {
      name?: string;
      id?: string;
      type?: string;
      path?: string | null;
      resolvedPath?: string | null;
      status?: string;
      metadata?: { [key: string]: unknown };
      [key: string]: unknown;
    };

export interface ResumePlanInput {
  state?: string;
  nextAction?: string;
  safeToRun?: boolean;
  reason?: string;
  commands?: string[];
  blockers?: BlockerInput[];
  artifacts?: ArtifactRefInput[];
  [key: string]: unknown;
}

// A graph node as read by taskArtifacts/taskBlockers (artifact + blocker
// collection; blocked/failed nodes contribute their blockers).
export interface RuntimeGraphNodeInput {
  status?: string;
  artifacts?: ArtifactRefInput[];
  blockers?: BlockerInput[];
  resumePlan?: { blockers?: BlockerInput[]; [key: string]: unknown } | null;
  [key: string]: unknown;
}

export interface RuntimeTaskOutputInput {
  graph?: { nodes?: RuntimeGraphNodeInput[]; [key: string]: unknown } | null;
  items?: Array<{ blockers?: BlockerInput[]; [key: string]: unknown }>;
  artifactRefs?: ArtifactRefInput[];
  blockers?: BlockerInput[];
  resumePlan?: ResumePlanInput | null;
  [key: string]: unknown;
}

// A raw daemon/runtime task as the normalizers read it. `summary` is either a
// display string (runtimeTaskPresentation) or a structured object carrying
// artifactRefs/resumePlan (taskArtifacts/taskBlockers).
export interface RuntimeTaskInput {
  id?: string;
  kind?: string;
  status?: string;
  summary?:
    | string
    | {
        artifactRefs?: ArtifactRefInput[];
        resumePlan?: { blockers?: BlockerInput[]; [key: string]: unknown } | null;
        [key: string]: unknown;
      }
    | null;
  output?: RuntimeTaskOutputInput | null;
  graph?: { nodes?: RuntimeGraphNodeInput[]; [key: string]: unknown } | null;
  artifactRefs?: ArtifactRefInput[];
  blockers?: BlockerInput[];
  resumePlan?: ResumePlanInput | null;
  presentation?: RuntimeTaskPresentation;
  [key: string]: unknown;
}

// ── output shapes (what the normalizers build) ────────────────────────────────

// normalizeRuntimeEvent output: type/level/line guaranteed strings, data
// guaranteed present (null when absent); the input event's other fields pass
// through via spread, hence the index signature.
export interface RuntimeEventShape {
  type: string;
  level: string;
  line: string;
  data: unknown;
  [key: string]: unknown;
}

export interface ResumePlanShape {
  /** plan.state, else the task status, else "unknown". */
  state: string;
  nextAction: string;
  safeToRun: boolean;
  reason: string;
  commands: string[];
  blockers: Blocker[];
  artifacts: ArtifactRef[];
}

export interface RuntimeTaskPresentation {
  title: string;
  subtitle: string;
  statusTone: "danger" | "success" | "default";
  primaryAction: string;
  secondaryActions: string[];
  artifactSummary: string;
  blockerSummary: string;
}

// normalizeRuntimeTask output: identity/status guaranteed, artifact refs and
// blockers rolled up from every place a task carries them (top level, summary,
// output, output items, graph nodes) and normalized; the raw task's other
// fields pass through via spread, hence the index signature.
export interface RuntimeTaskShape {
  id: string;
  kind: string;
  status: string;
  output: RuntimeTaskOutputInput;
  artifactRefs: ArtifactRef[];
  blockers: Blocker[];
  resumePlan: ResumePlanShape;
  presentation: RuntimeTaskPresentation;
  [key: string]: unknown;
}

export function normalizeBlocker(blocker?: BlockerInput | null): Blocker;
export function normalizeArtifactRef(ref?: ArtifactRefInput | null): ArtifactRef;
export function normalizeRuntimeEvent(event?: unknown): RuntimeEventShape;
export function normalizeResumePlan(
  plan?: ResumePlanInput | null,
  task?: RuntimeTaskInput,
): ResumePlanShape;
export function runtimeTaskPresentation(task?: RuntimeTaskInput): RuntimeTaskPresentation;
export function normalizeRuntimeTask(task?: RuntimeTaskInput): RuntimeTaskShape;
