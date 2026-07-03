// Types mirror the JSON the factory-core ops emit.
export interface Plane { name: string; up: boolean; detail: string }
export interface StatusBoard { mode: "local" | "remote"; project: string | null; app: string | null; region: string; planes: Plane[]; next: string; clientDoes: string }
export interface Check { name: string; status: "pass" | "warn" | "fail"; detail: string; fix: string | null; category?: string; action?: string }
export interface DoctorRepairPlanItem { section?: string; check: string; category: string; command: string; status: string }
export interface DoctorSection { name: string; checks: Check[]; fails: number; repairPlan?: DoctorRepairPlanItem[] }
export interface DoctorReport { project: string | null; region: string; sections: DoctorSection[]; fails: number; repairPlan?: DoctorRepairPlanItem[] }
// Fleet + pipeline + artifact shapes now live in @ge/contracts — the single shared shape
// both apps (and the .mjs tools via JSDoc) agree on. Imported for local use by the runtime
// types below and re-exported so existing `from "../services/geClient"` importers are unchanged.
import type {
  Fleet,
  FleetActionPlan,
  FleetAgent,
  FleetBlocker,
  FleetHealth,
  PipelinePlan,
  PipelineStage,
  PipelineArtifactRef,
  RiskLevel,
} from "@ge/contracts";
export type {
  Fleet,
  FleetActionPlan,
  FleetAgent,
  FleetBlocker,
  FleetHealth,
  PipelinePlan,
  PipelineStage,
  PipelineArtifactRef,
} from "@ge/contracts";
// Opt-in Firebase auth. When disabled (the default / IAP deploy) authEnabled is
// false and getToken() resolves null, so the request helpers add nothing and
// behave exactly as before.
import { authEnabled, getToken } from "../auth/firebase";
import type { LedgerEvent } from "@ge/run-ledger/frames";
// A known built-in simulated system (from the generator registry) or, once
// synthesized, a brand-new LIVE simulator bound to the interview.
export interface SystemOption {
  id: string;
  displayName: string;
  maturity: string;
  family: string | null;
}
export interface SynthesizedSystem {
  ok: boolean;
  id: string;
  displayName: string;
  source: string;
  tools: Array<{ name: string; description?: string } | string>;
  collections: Record<string, number>;
  registered: boolean;
  contract?: Record<string, any>;
  error?: string;
}
export interface SpecOption {
  id: string;
  title: string;
  department: string | null;
  domainId?: string | null;
  persona?: string | null;
  subtitle?: string | null;
  systems: string[];
  source: string;
  sourcePath?: string | null;
  familyId?: string;
  variantId?: string;
  variantLabel?: string;
  buildable?: boolean;
  hasBehaviorContract?: boolean;
  description?: string;
}
export interface SpecCatalog {
  kind: "ge.agent_spec.catalog";
  version: number;
  total: number;
  returned: number;
  byDepartment: Record<string, number>;
  departments: string[];
  summary?: Record<string, any>;
  specs: SpecOption[];
}
export interface SpecRegisterResult {
  ok: boolean;
  id: string;
  title?: string;
  path: string;
  buildable?: boolean;
  gaps?: string[];
  familyId?: string;
  variant?: Record<string, any>;
  catalog?: { synced?: boolean; stdout?: string; note?: string };
}
export interface SpecReviewResult {
  kind: "ge.spec.review";
  source?: "generated_artifact" | "registered_interview_spec" | "canonical_catalog_spec" | "unresolved" | string;
  resolvedFrom?: string | null;
  found: boolean;
  usecaseId?: string | null;
  path: string;
  spec?: Record<string, any> | null;
  content: string;
  parseError?: string;
  summary?: {
    id?: string | null;
    title?: string | null;
    department?: string | null;
    persona?: string | null;
    systems?: string[];
    sourceSystems?: number;
    entities?: number;
    documents?: number;
    anomalies?: number;
    goldenEvals?: number;
    buildable?: boolean;
    maturity?: string;
  } | null;
  gaps?: string[];
  candidates?: Array<{ id: string; title?: string; department?: string | null; source?: string }>;
}
export interface GeEvent { runId?: string; agentId?: string; stage?: string; ts?: string; type: string; level?: string; line?: string; data?: any }
export interface InterviewDocument {
  filename: string;
  uri: string;
  storage: "gcs" | "local" | string;
  bytes: number;
  mimeType?: string | null;
  kind: string;
  charCount: number;
  truncated: boolean;
  note?: string | null;
  uploadedAt?: string;
  /** Extracted plain text (present on upload response + list). */
  text?: string;
  sections?: Array<{ title: string; lines: string[] }>;
}
export interface InterviewDocumentList { documents: InterviewDocument[] }
export interface InterviewSpecWriteResult { path: string; absolutePath?: string }
/**
 * The interview's agent-spec rendered as an OKF v0.1 Knowledge Bundle: a flat
 * map of `<relPath>.md -> markdown`, mirroring what scripts/spec-to-okf.mjs
 * writes to disk. Matches the server's GET /api/interviews/:id/okf response.
 */
export interface SpecOkfBundle {
  id: string;
  conceptCount: number;
  files: Record<string, string>;
}
export interface RuntimeInteractionOption {
  id: string;
  label: string;
}
export interface RuntimeInteractionQuestion {
  id: string;
  label: string;
  type: "radio" | "checkbox" | "select" | "text" | "textarea" | string;
  required?: boolean;
  placeholder?: string;
  help?: string;
  defaultValue?: string | string[];
  maxSelections?: number;
  options?: RuntimeInteractionOption[];
}
export interface RuntimeInteractionForm {
  schemaVersion: number;
  id: string;
  title: string;
  description?: string;
  submitLabel?: string;
  questions: RuntimeInteractionQuestion[];
}
export interface RuntimeStatus {
  ok: boolean;
  status?: string;
  protocolVersion?: number;
  supportedTaskKinds?: string[];
  capabilities?: Record<string, any>;
  pid?: number | null;
  port?: number;
  error?: string;
  restartCommand?: string;
  runs?: RuntimeTaskSummary[];
}
export interface DoctorEvent extends GeEvent {
  section?: string;
  check?: Check;
  sectionReport?: DoctorSection;
  report?: DoctorReport;
}
export interface WorkspaceBlocker { id: string; message: string; detail?: any }
export interface WorkspaceRepairTask { id: string; command: string; reason: string; owner?: string }
export interface WorkspaceDoctorReport {
  kind?: string;
  workspace: string;
  stage: string;
  ok: boolean;
  summary?: { total: number; passed: number; failed: number };
  blockers: WorkspaceBlocker[];
  repairTasks: WorkspaceRepairTask[];
  evidence?: Record<string, string | null>;
}
export interface WorkspaceRepairReport {
  kind?: string;
  workspace: string;
  stage: string;
  ok: boolean;
  attempts: Array<{ index: number; doctor: WorkspaceDoctorReport; actions: Array<{ taskId: string; ok?: boolean; skipped?: boolean; summary?: string; error?: string }> }>;
  finalDoctor: WorkspaceDoctorReport;
  nextRepairTasks?: WorkspaceRepairTask[];
}
export interface RepairRun {
  id: string;
  targetStage: string;
  status: string;
  options: Record<string, any>;
  total: number;
  passed: number;
  repaired: number;
  blocked: number;
  createdAt: string;
  updatedAt: string;
  endedAt: string | null;
}
export interface RepairItem {
  runId: string;
  agentId: string;
  workspaceId: string;
  targetStage: string;
  status: string;
  attempts: number;
  blockers: WorkspaceBlocker[];
  doctor: WorkspaceDoctorReport | null;
  repair: WorkspaceRepairReport | null;
  updatedAt: string;
}
export interface RepairDetail { run: RepairRun; items: RepairItem[] }
export interface RepairStartResult {
  skipped?: boolean;
  runId: string;
  reason?: string;
  pipeline?: FactoryRepairPipeline;
}
export interface FactoryRepairPipeline {
  kind: string;
  version: number;
  createdAt: string;
  mode: string;
  modeContract: {
    mode: string;
    factorySurface: string;
    workspaceSource: string;
    artifactSource: string;
    repairCapability: string;
    effectiveFactoryTarget: string;
    buildBoundary: string | null;
    cloudContinuation: null | Record<string, any>;
    constraints: string[];
  };
  intent: string;
  target: {
    requested: string;
    workspaceGate: string;
    localFactoryTarget: string;
    remoteFactoryTarget: string;
    cloudContinuation: null | Record<string, any>;
    requiredArtifacts: string[];
  };
  policy: Record<string, any>;
  summary: {
    selected: number;
    factory: number;
    repair: number;
    remoteObserve: number;
    repairAfterFactory: number;
    missingWorkspaces: number;
    existingWorkspaces: number;
  };
  phases: Array<{ id: string; owner: string; action: string; command?: any; itemCount?: number; gate?: string; status?: string }>;
  roster: Array<{
    agentId: string;
    title: string;
    department: string | null;
    status: string;
    workspaceId: string;
    workspaceState: string;
    factoryAction: string;
    repairAction: string;
  }>;
  disambiguation: string[];
}
export interface GeCommand {
  id: string;
  method: string;
  path: string;
  cli: string;
  label: string;
  summary: string;
  // Typed from @ge/contracts (parity with the registry is enforced by
  // tools/contracts-registry-parity.test.mjs); `string & {}` keeps unknown
  // future risks assignable without erasing autocompletion.
  risk: RiskLevel | (string & {});
  expectedDuration: string;
  requirements?: {
    bins?: string[];
    config?: string[];
    cloudAuth?: boolean;
    terraformRoot?: boolean;
    configWritable?: boolean;
    localToolchain?: boolean;
  };
}
// Golden-path position (GET /api/ge/position) — the same contract
// tools/lib/golden-path.mjs's goldenPathPosition() emits for the bare-`ge`
// board: where am I on capture → prove → handoff, what blocks me, and the
// exact next command to run.
export type GoldenPathStageId = "capture" | "prove" | "handoff";
export interface GoldenPathStage {
  id: GoldenPathStageId;
  done: boolean;
  detail: string;
}
export interface GoldenPathPosition {
  stages: GoldenPathStage[];
  current: GoldenPathStageId;
  blocker: string | null;
  next: string;
}
export interface GeJob {
  id: string;
  argv: string[];
  command: GeCommand | null;
  status: "running" | "done" | "failed" | "blocked" | string;
  code: number | null;
  startedAt: string;
  updatedAt: string;
  endedAt: string | null;
  lastLine: string | null;
  checks: Check[];
}
export interface FactoryRunSummary {
  id: string;
  kind: string;
  status: "running" | "done" | "failed" | string;
  ok: boolean | null;
  startedAt: string;
  updatedAt: string;
  finishedAt: string | null;
  targetStage: string | null;
  planPath: string | null;
  runPath: string | null;
  markdownPath: string | null;
  eventsPath: string | null;
  totals: Record<string, any> | null;
  selected: number;
  failed: number;
  results: FactoryRunResult[];
  recentEvents: Array<{ ts?: string | null; type: string; stage?: string | null; level?: string; line: string }>;
}
export interface FactoryRunResult {
  id: string;
  useCaseId: string;
  title: string;
  department: string | null;
  status: string;
  targetStage: string | null;
  workspaceId: string | null;
  workspacePath: string | null;
  error: string | null;
  systems: string[];
  stages: Array<{ name: string; status: string }>;
  validation: Record<string, any> | null;
  harnessReview: Record<string, any> | null;
  dataPackage: Record<string, any> | null;
  preview: Record<string, any> | null;
}
export interface RuntimeTaskPresentation {
  title: string;
  subtitle: string;
  statusTone: "danger" | "success" | "default" | string;
  primaryAction: string;
  secondaryActions: string[];
  artifactSummary: string;
  blockerSummary: string;
}
export interface RuntimeTaskSummary {
  id: string;
  kind: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  endedAt: string | null;
  input?: Record<string, any> | null;
  output?: RuntimeTaskOutput | null;
  graph?: PipelineRuntimeGraph | null;
  counts?: { total: number; passed: number; repaired: number; blocked: number } | null;
  lastEvent?: GeEvent | null;
  nextAction?: string;
  resumePlan?: {
    state: string;
    nextAction: string;
    safeToRun: boolean;
    reason: string;
    commands: string[];
    blockers: unknown[];
    artifacts: unknown[];
  } | null;
  artifactRefs?: PipelineArtifactRef[];
  summary?: string | Record<string, any> | null;
  presentation?: RuntimeTaskPresentation;
}

export interface RuntimeTaskStart {
  kind: "pipeline.run" | "harness.run" | "repair.run" | "ge.command" | "process.command" | string;
  ids?: string[];
  scenario?: string | null;
  spec?: string | null;
  workspace?: string | null;
  systems?: string[];
  targetStage?: string;
  repair?: boolean;
  attempts?: number;
  runPreview?: boolean;
  executeFactory?: boolean;
  query?: Record<string, any>;
  argv?: string[];
  command?: Record<string, any> | null;
  input?: Record<string, any> | null;
  useAntigravity?: boolean;
  harnessAgent?: string;
  harnessModel?: string;
  harnessLocation?: string;
}

export interface RuntimeTaskOutput {
  graph?: PipelineRuntimeGraph | null;
  artifactRefs?: PipelineArtifactRef[];
  counts?: Record<string, number> | null;
  reason?: string;
}

export interface PipelineRuntimeGraph {
  id?: string;
  status?: string;
  counts?: Record<string, number>;
  nodes?: PipelineRuntimeNode[];
}

export interface PipelineRuntimeNode {
  id: string;
  kind?: string;
  label?: string;
  status: string;
  runtimeKind?: string;
  childTaskId?: string;
  input?: Record<string, any> | null;
  childTask?: RuntimeTaskSummary | Record<string, any> | null;
  warnings?: unknown[];
  blockers?: Array<{ id?: string; message?: string; error?: string } | string>;
  artifacts?: PipelineArtifactRef[];
  summary?: string | Record<string, any> | null;
  resumePlan?: {
    state: string;
    nextAction: string;
    safeToRun: boolean;
    reason: string;
    commands: string[];
    blockers: unknown[];
    artifacts: unknown[];
  } | null;
}

// PipelineArtifactRef moved to @ge/contracts (imported + re-exported near the top of this file).

// EventSource can't set request headers, so when auth is on we pass the Firebase
// ID token as a query param (?access_token=) — the server's bearerFrom() reads it.
// Construction is therefore async (await the token first). Harmless no-op when off.
async function withToken(url: string): Promise<string> {
  if (!authEnabled) return url;
  const token = await getToken();
  if (!token) return url;
  const sep = url.includes("?") ? "&" : "?";
  return `${url}${sep}access_token=${encodeURIComponent(token)}`;
}

async function j<T>(url: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
    ...((init?.headers as Record<string, string>) || {}),
  };
  if (authEnabled) {
    const token = await getToken();
    if (token) headers["authorization"] = `Bearer ${token}`;
  }
  const r = await fetch(url, { ...init, headers });
  const text = await r.text();
  if (!r.ok) {
    let detail = text.slice(0, 500);
    try {
      const parsed = JSON.parse(text);
      detail = parsed.error || parsed.message || detail;
    } catch {
      // keep raw text
    }
    const error = new Error(`${r.status}: ${detail}`) as Error & { status?: number; detail?: string };
    error.status = r.status;
    error.detail = detail;
    throw error;
  }
  return text ? JSON.parse(text) : ({} as T);
}
const post = (url: string, body: unknown) => j(url, { method: "POST", body: JSON.stringify(body ?? {}) });

export const ge = {
  status: () => j<StatusBoard>("/api/ge/status"),
  commands: () => j<{ commands: GeCommand[] }>("/api/ge/commands"),
  // Golden-path position for the shell's capture → prove → handoff band.
  position: () => j<GoldenPathPosition>("/api/ge/position"),
  specs: (body: { q?: string; department?: string; ids?: string[]; limit?: number } = {}) => {
    const params = new URLSearchParams();
    if (body.q) params.set("q", body.q);
    if (body.department && body.department !== "all") params.set("department", body.department);
    if (body.ids?.length) params.set("ids", body.ids.join(","));
    if (body.limit) params.set("limit", String(body.limit));
    const qs = params.toString();
    return j<SpecCatalog>(`/api/ge/specs${qs ? `?${qs}` : ""}`);
  },
  reviewSpec: (body: { usecaseId?: string; path?: string } = {}) => {
    const params = new URLSearchParams();
    if (body.usecaseId) params.set("usecaseId", body.usecaseId);
    if (body.path) params.set("path", body.path);
    const qs = params.toString();
    return j<SpecReviewResult>(`/api/ge/specs/review${qs ? `?${qs}` : ""}`);
  },
  jobs: (limit = 50) => j<{ jobs: GeJob[] }>(`/api/ge/jobs?limit=${encodeURIComponent(String(limit))}`),
  factoryRuns: (limit = 10) => j<{ kind: string; root: string; eventLog: string; runs: FactoryRunSummary[] }>(`/api/ge/factory/runs?limit=${encodeURIComponent(String(limit))}`),
  // Durable run ledger (ADR 0001): one source of truth for local + remote runs.
  ledgerRuns: (limit = 25) => j<{ runs: FactoryRunSummary[] }>(`/api/ge/ledger/runs?limit=${encodeURIComponent(String(limit))}`),
  ledgerRun: (id: string) => j<FactoryRunSummary>(`/api/ge/ledger/runs/${encodeURIComponent(id)}`),
  // Declarative reconcile (ADR 0001 phase 5): drift between desired manifest and actual.
  applyPlan: () => j<ReconcilePlan>("/api/ge/apply/plan"),
  job: (id: string) => j<GeJob | { error: string; status: string }>(`/api/ge/jobs/${encodeURIComponent(id)}`),
  doctor: (scope = "all", command?: string) =>
    j<DoctorReport>(`/api/ge/doctor?scope=${encodeURIComponent(scope)}${command ? `&command=${encodeURIComponent(command)}` : ""}`),
  fleet: () => j<Fleet>("/api/ge/fleet"),
  pipelinePlan: (body: { scenario?: string; spec?: string; usecaseId?: string; systems?: string[]; ids?: string[]; targetStage?: string } = {}) => {
    const params = new URLSearchParams();
    if (body.scenario) params.set("scenario", body.scenario);
    if (body.spec) params.set("spec", body.spec);
    if (body.usecaseId) params.set("usecaseId", body.usecaseId);
    if (body.systems?.length) params.set("systems", body.systems.join(","));
    if (body.ids?.length) params.set("ids", body.ids.join(","));
    if (body.targetStage) params.set("targetStage", body.targetStage);
    const qs = params.toString();
    return j<PipelinePlan>(`/api/ge/pipeline/plan${qs ? `?${qs}` : ""}`);
  },
  agent: (id: string) => j<{ agent: FleetAgent | null }>(`/api/ge/agents/${encodeURIComponent(id)}`),
  workspaceDoctor: (id: string, stage = "preview") =>
    j<WorkspaceDoctorReport>(`/api/ge/workspaces/${encodeURIComponent(id)}/doctor?stage=${encodeURIComponent(stage)}`),
  workspaceRepair: (id: string, body: { stage?: string; attempts?: number; agent?: string; runPreview?: boolean }) =>
    post(`/api/ge/workspaces/${encodeURIComponent(id)}/repair`, body) as Promise<WorkspaceRepairReport>,
  pipelineGraphPlan: (body: { ids?: string[]; targetStage?: string; repair?: boolean; attempts?: number; runPreview?: boolean }) => {
    const params = new URLSearchParams();
    if (body.ids?.length) params.set("ids", body.ids.join(","));
    if (body.targetStage) params.set("targetStage", body.targetStage);
    if (body.repair !== undefined) params.set("repair", String(body.repair));
    if (body.attempts !== undefined) params.set("attempts", String(body.attempts));
    if (body.runPreview !== undefined) params.set("runPreview", String(body.runPreview));
    const qs = params.toString();
    return j<FactoryRepairPipeline>(`/api/ge/pipeline/graph${qs ? `?${qs}` : ""}`);
  },
  repairRuns: (limit = 20) => j<{ runs: RepairRun[] }>(`/api/ge/repair?limit=${encodeURIComponent(String(limit))}`),
  repairRun: (id: string) => j<RepairDetail>(`/api/ge/repair/${encodeURIComponent(id)}`),
  repairRunEvents: (id: string, afterSeq = 0) =>
    j<{ events: Array<{ seq: number; event: GeEvent }> }>(`/api/ge/repair/${encodeURIComponent(id)}/events?afterSeq=${encodeURIComponent(String(afterSeq))}`),
  startRepair: (body: { ids?: string[]; targetStage?: string; repair?: boolean; attempts?: number; runPreview?: boolean }) =>
    post("/api/ge/repair", body) as Promise<RepairStartResult>,
  resumeRepair: (id: string) => post(`/api/ge/repair/${encodeURIComponent(id)}/resume`, {}) as Promise<{ run: RepairRun | null }>,
  logs: (runId: string, stage: string, item?: string) =>
    j<{ found: boolean; source: string; ndjson: string }>(`/api/ge/logs/${encodeURIComponent(runId)}?stage=${encodeURIComponent(stage)}${item ? `&item=${encodeURIComponent(item)}` : ""}`),
  artifact: (runId: string, item: string, name: string) =>
    j<{ found: boolean; source: string; content: string }>(`/api/ge/artifacts/${encodeURIComponent(runId)}/${encodeURIComponent(item)}/${encodeURIComponent(name)}`),
  setMode: (mode: "local" | "remote") => post("/api/ge/mode", { mode }),
  up: (planes?: string[]) => post("/api/ge/up", { planes }),
  dataUp: () => post("/api/ge/data/up", {}),
  mcpDeploy: () => post("/api/ge/mcp/deploy", {}),
  // Idempotent: no-ops (with a friendly "already running" line) if the daemon is
  // already up. Backs the header pill + Doctor's "Start daemon" action.
  daemonStart: () => post("/api/ge/daemon/start", {}),
  build: (b: { scope?: string; ids?: string; dept?: string; local?: boolean; force?: boolean }) => post("/api/ge/agents/build", b),
  handoff: (b: { target?: string; ids?: string; startStage?: string; targetStage?: string }) => post("/api/ge/handoff", b),
  sync: (b: { ids?: string | string[]; push?: boolean; local?: boolean; remoteMode?: boolean; remote?: string; create?: boolean; noCommit?: boolean }) => post("/api/ge/agents/sync", b),
  registerSpec: (body: { input: string; allowDraft?: boolean; syncCatalog?: boolean }) => post("/api/ge/specs/register", body) as Promise<SpecRegisterResult>,
  // Interview BRD/document grounding (sub-project 1). Upload uses base64 JSON so
  // it works identically under Bun (fetch) and Vite (Node), no multipart needed.
  uploadInterviewDocument: (usecaseId: string, file: { filename: string; mimeType?: string; contentBase64: string }) =>
    post(`/api/interviews/${encodeURIComponent(usecaseId)}/documents`, file) as Promise<InterviewDocument>,
  listInterviewDocuments: (usecaseId: string) =>
    j<InterviewDocumentList>(`/api/interviews/${encodeURIComponent(usecaseId)}/documents`),
  saveInterviewSpec: (usecaseId: string, spec: Record<string, any>) =>
    post(`/api/interviews/${encodeURIComponent(usecaseId)}/spec`, { spec }) as Promise<InterviewSpecWriteResult>,
  // The interview's agent-spec AS an OKF Knowledge Bundle (path -> markdown map).
  // 404s with a typed error when no agent-spec is on disk yet.
  interviewOkf: (usecaseId: string) =>
    j<SpecOkfBundle>(`/api/interviews/${encodeURIComponent(usecaseId)}/okf`),
  // Bring-Your-Own-System: list known simulators, or synthesize a new one.
  systems: () => j<{ systems: SystemOption[] }>("/api/systems"),
  synthesizeSystem: (body: {
    mode?: "nl" | "samples" | "openapi";
    description?: string;
    displayName?: string;
    samples?: Record<string, any[]>;
    openapi?: Record<string, any>;
    seed?: number;
    useLlm?: boolean;
  }) => post("/api/systems/synthesize", body) as Promise<SynthesizedSystem>,
  runtimeStatus: () => j<RuntimeStatus>("/api/runtime/status"),
  runtimeTasks: (limit = 25, full = false) =>
    j<{ tasks: RuntimeTaskSummary[] }>(`/api/runtime/tasks?limit=${encodeURIComponent(String(limit))}${full ? "&full=true" : ""}`),
  runtimeTask: (id: string) => j<RuntimeTaskSummary>(`/api/runtime/tasks/${encodeURIComponent(id)}`),
  runtimeEvents: (id: string, afterSeq = 0) =>
    j<{ events: Array<{ seq: number; event: GeEvent }> }>(`/api/runtime/tasks/${encodeURIComponent(id)}/events?format=json&afterSeq=${encodeURIComponent(String(afterSeq))}`),
  runtimeStart: (body: RuntimeTaskStart) => post("/api/runtime/tasks", body) as Promise<RuntimeTaskSummary>,
  pipelineRun: (body: Omit<RuntimeTaskStart, "kind">) => post("/api/runtime/tasks", { kind: "pipeline.run", ...body }) as Promise<RuntimeTaskSummary>,
  runtimeResume: (id: string) => post(`/api/runtime/tasks/${encodeURIComponent(id)}/resume`, {}),
  runtimeInteraction: (taskId: string, interactionId: string, body: unknown) =>
    post(`/api/runtime/tasks/${encodeURIComponent(taskId)}/interactions/${encodeURIComponent(interactionId)}`, body) as Promise<{ ok: boolean; interactionId: string; responseCount: number }>,
};

// Stable de-dup key for an SSE event, mirroring streamRuntimeEvents. On
// reconnect the server replays buffered frames; this lets us drop the repeats.
function eventDedupeKey(event: any, raw: string): string {
  return [event?.seq, event?.ts, event?.type, event?.stage, event?.line].filter(Boolean).join("|") || raw;
}

// Connection lifecycle callback for reconnect-aware consumers (e.g. LogStream's
// "reconnecting…" chip). "open" fires on (re)connect, "reconnecting" when the
// transport drops, "closed" only on a real terminal close (we never get that
// from EventSource itself, but unsubscribe is the explicit close).
export type StreamStatus = "open" | "reconnecting";

// Live NDJSON log stream over SSE. Returns an unsubscribe fn. Each frame's data is one NDJSON line.
// onStatus (optional) reports transport state so callers can show reconnect UI.
export function streamLogs(
  runId: string,
  stage: string,
  onEvent: (e: GeEvent) => void,
  item?: string,
  onStatus?: (s: StreamStatus) => void,
): () => void {
  const qs = new URLSearchParams({ stage }); if (item) qs.set("item", item);
  const seen = new Set<string>();
  return openEventSource(`/api/ge/runs/${encodeURIComponent(runId)}/logs?${qs.toString()}`, (es) => {
    es.onopen = () => { try { onStatus?.("open"); } catch { /* ignore */ } };
    es.onmessage = (m) => {
      try {
        const event = JSON.parse(m.data);
        const key = eventDedupeKey(event, m.data);
        if (seen.has(key)) return;       // drop frames replayed after a reconnect
        seen.add(key);
        if (seen.size > 5000) seen.clear();
        onEvent(event);
      } catch { /* ignore non-JSON heartbeats */ }
    };
    es.onerror = () => {
      // Do NOT close: EventSource auto-reconnects (honoring the server's retry:).
      // Surface the drop so the UI can chip "reconnecting…"; it clears when
      // onopen/onmessage resume. Closing here would turn a transient blip into a
      // dead stream and break the reconnect contract.
      if (es.readyState !== EventSource.CLOSED) { try { onStatus?.("reconnecting"); } catch { /* ignore */ } }
    };
  });
}

// Construct an EventSource after (optionally) appending the auth token to the URL.
// Token fetch is async, so we build the URL first then construct. Returns a sync
// unsubscribe fn that closes the source once it exists (and prevents construction
// if unsubscribed before the token resolves). No-op token append when auth is off.
function openEventSource(url: string, wire: (es: EventSource) => void): () => void {
  let es: EventSource | null = null;
  let closed = false;
  void withToken(url).then((finalUrl) => {
    if (closed) return;
    es = new EventSource(finalUrl);
    wire(es);
  });
  return () => {
    closed = true;
    if (es) es.close();
  };
}

// Live run/stage transition events (heartbeat for now; Activity view consumes this).
export function streamEvents(runId: string, onEvent: (e: any) => void): () => void {
  return openEventSource(`/api/ge/runs/${encodeURIComponent(runId)}/events`, (es) => {
    es.onmessage = (m) => { try { onEvent(JSON.parse(m.data)); } catch { /* heartbeat */ } };
  });
}

export function streamDoctor(scope: string, command: string | undefined, onEvent: (e: DoctorEvent) => void): () => void {
  const qs = new URLSearchParams({ scope });
  if (command) qs.set("command", command);
  return openEventSource(`/api/ge/doctor/stream?${qs.toString()}`, (es) => {
    es.onmessage = (m) => { try { onEvent(JSON.parse(m.data)); } catch { /* heartbeat */ } };
    es.onerror = () => {
      onEvent({ type: "doctor_stream_error", level: "error", line: "Readiness stream disconnected" });
      es.close();
    };
  });
}

// ── background jobs (long mutating ops: up / mcp deploy / build / handoff / sync) ──
// These endpoints return { jobId } immediately; the op streams over SSE.
export interface JobStart { jobId: string; command?: GeCommand }

// Live job log stream. onEvent receives NDJSON events ({type,line,level,...}). Returns unsubscribe.
// onStatus (optional) reports transport state for reconnect-aware UIs.
export function streamJob(
  jobId: string,
  onEvent: (e: GeEvent) => void,
  onStatus?: (s: StreamStatus) => void,
): () => void {
  const seen = new Set<string>();
  return openEventSource(`/api/ge/jobs/${encodeURIComponent(jobId)}/logs`, (es) => {
    es.onopen = () => { try { onStatus?.("open"); } catch { /* ignore */ } };
    es.onmessage = (m) => {
      try {
        const event = JSON.parse(m.data);
        const key = eventDedupeKey(event, m.data);
        if (seen.has(key)) return;       // drop frames replayed after a reconnect
        seen.add(key);
        if (seen.size > 5000) seen.clear();
        onEvent(event);
      } catch { /* ignore */ }
    };
    es.onerror = () => {
      // Allow EventSource's native reconnect; do not close. Report the drop so
      // job toasts / log panels can show a reconnect indicator.
      if (es.readyState !== EventSource.CLOSED) { try { onStatus?.("reconnecting"); } catch { /* ignore */ } }
    };
  });
}

export interface ReconcileStep {
  id: string;
  kind: "platform" | "fleet";
  command: string;
  reason: string;
  plane?: string;
  agents?: string[];
}
export interface ReconcilePlan {
  inSync: boolean;
  steps: ReconcileStep[];
  drift: { platform: string[]; fleet: string[] };
  source?: string;
  manifest?: { platform: Record<string, boolean>; fleet: { target: string; mode: string; agents: unknown } };
}

// The live ledger frame/event shape now lives in @ge/run-ledger/frames; re-export
// it so existing `import { ..., type LedgerEvent } from "../services/geClient"`
// consumers keep working.
export type { LedgerEvent };

// Subscribe to a run's live ledger event stream (SSE). Locally the server polls
// the SQLite ledger; the cloud control plane pushes the same shape from Firestore.
export function streamLedgerRun(runId: string, onEvent: (e: LedgerEvent) => void): () => void {
  const seen = new Set<number>();
  return openEventSource(`/api/ge/ledger/runs/${encodeURIComponent(runId)}/events`, (es) => {
    es.onmessage = (m) => {
      try {
        const event = JSON.parse(m.data) as LedgerEvent;
        if (typeof event.seq === "number") {
          if (seen.has(event.seq)) return;
          seen.add(event.seq);
        }
        onEvent(event);
        // Terminal frame: close so the browser doesn't auto-reconnect and replay
        // the whole run from seq 0 in a loop.
        if (event.type === "run_complete" || event.type === "ledger_unavailable") es.close();
      } catch {
        // Ignore malformed heartbeat frames.
      }
    };
    es.onerror = () => { /* terminal close / reconnect churn — payload carries real errors */ };
  });
}

export function streamRuntimeEvents(taskId: string, onEvent: (e: GeEvent) => void): () => void {
  const seen = new Set<string>();
  return openEventSource(`/api/runtime/tasks/${encodeURIComponent(taskId)}/events`, (es) => {
    es.onmessage = (m) => {
      try {
        const event = JSON.parse(m.data);
        const key = [event.seq, event.ts, event.type, event.stage, event.line].filter(Boolean).join("|") || m.data;
        if (seen.has(key)) return;
        seen.add(key);
        if (seen.size > 2000) seen.clear();
        onEvent(event);
      } catch {
        // Ignore malformed heartbeat frames.
      }
    };
    es.onerror = () => {
      // EventSource fires this for normal terminal stream closure and browser
      // reconnects. Surface daemon errors from the stream payload, not transport
      // churn that would otherwise make successful runs look broken.
    };
  });
}

// Start a job from a mutating ge.* call and broadcast it to the global JobToast.
// Usage: await startJob("ge mcp deploy", ge.mcpDeploy());
export async function startJob(label: string, p: Promise<any>): Promise<string | null> {
  const r = await p;
  const jobId = r?.jobId || null;
  if (jobId) window.dispatchEvent(new CustomEvent("ge:job", { detail: { jobId, label: r?.command?.label || label, command: r?.command || null } }));
  return jobId;
}
