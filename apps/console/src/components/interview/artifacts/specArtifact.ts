/**
 * Agent-spec artifact model for the interview canvas.
 *
 * The interview agent writes `.ge/interviews/<id>/agent-spec.json` to disk, and
 * (when prompted) also streams the same JSON inline inside an
 * <artifact identifier="agent-spec" type="application/json">...</artifact> block.
 * This module turns the streamed parser events into a structured, render-friendly
 * spec state, and turns a parsed spec into the section list the canvas renders.
 */
import type { ArtifactEvent } from "./parser";

/** The identifier the interview prompt instructs the agent to use. */
export const AGENT_SPEC_ARTIFACT_ID = "agent-spec";

export type SpecArtifactStatus = "idle" | "streaming" | "complete" | "error";

/**
 * Optional self-describing workflow the interview agent may emit on
 * `behaviorContract.workflow` when the use case is multi-stage. Mirrors the
 * SPEC-SHAPE workflow the generator authors into catalog specs
 * (apps/factory/scripts/factory/agent-workflow.mjs): ordered steps,
 * each naming the toolIntents it uses. `tools` entries are toolIntent NAMES.
 */
export interface SpecWorkflowStep {
  id?: string;
  label: string;
  description?: string;
  tools: string[];
}
export interface SpecWorkflow {
  mode: "sequential" | "parallel";
  steps: SpecWorkflowStep[];
}

/**
 * A Query Capability — a question/request the agent can answer, with the
 * toolIntent names that serve it and (optionally) the workflow stage it runs
 * in. Emitted on `behaviorContract.answerableQueries`; consumed by the OKF
 * converter to author `queries/<id>.md` (type "Query Capability").
 */
export interface AnswerableQuery {
  id?: string;
  /** The question/request, e.g. "What is an employee's net pay?". */
  request: string;
  /** toolIntent NAMES this capability uses. */
  tools: string[];
  /** Evidence the capability is expected to surface. */
  evidence?: string[];
  /** Optional workflow step id this capability runs in. */
  stage?: string;
}

export interface SpecArtifactState {
  status: SpecArtifactStatus;
  /** Raw streamed text (possibly partial JSON). */
  raw: string;
  /** Best-effort parsed spec (null while unparseable). */
  spec: Record<string, any> | null;
  title: string;
  error: string | null;
}

export function emptySpecArtifact(): SpecArtifactState {
  return { status: "idle", raw: "", spec: null, title: "", error: null };
}

/**
 * Tolerant JSON parse for streaming: returns the strict parse when possible,
 * otherwise attempts to "close" a truncated object/array so a partial spec can
 * still render mid-stream. Returns null when nothing parseable is available.
 */
export function tryParseSpecLoose(raw: string): Record<string, any> | null {
  const text = raw.trim();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    // fall through to loose repair
  }
  const repaired = repairTruncatedJson(text);
  if (repaired) {
    try {
      return JSON.parse(repaired);
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Balance a truncated JSON string by closing open strings/arrays/objects and
 * dropping a dangling trailing comma. Best-effort — only used for live preview.
 */
function repairTruncatedJson(text: string): string | null {
  const stack: string[] = [];
  let inString = false;
  let escaped = false;
  let lastSignificant = "";
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (c === "\\") {
        escaped = true;
      } else if (c === '"') {
        inString = false;
      }
      continue;
    }
    if (c === '"') {
      inString = true;
    } else if (c === "{") {
      stack.push("}");
    } else if (c === "[") {
      stack.push("]");
    } else if (c === "}" || c === "]") {
      stack.pop();
    }
    if (!/\s/.test(c)) lastSignificant = c;
  }
  if (stack.length === 0 && !inString) return null; // nothing to repair (and strict parse already failed)
  let out = text;
  if (inString) out += '"';
  // Drop a trailing comma that would otherwise sit before our synthetic closers.
  if (lastSignificant === ",") {
    out = out.replace(/,\s*$/, "");
  }
  for (let i = stack.length - 1; i >= 0; i--) out += stack[i];
  return out;
}

/** Advance the spec artifact state with one streamed parser event. */
export function reduceSpecArtifact(state: SpecArtifactState, event: ArtifactEvent): SpecArtifactState {
  switch (event.type) {
    case "artifact:start":
      if (event.identifier && event.identifier !== AGENT_SPEC_ARTIFACT_ID) return state;
      return { status: "streaming", raw: "", spec: null, title: event.title || state.title, error: null };
    case "artifact:chunk": {
      if (event.identifier && event.identifier !== AGENT_SPEC_ARTIFACT_ID) return state;
      const raw = state.raw + event.delta;
      return { ...state, status: "streaming", raw, spec: tryParseSpecLoose(raw) ?? state.spec };
    }
    case "artifact:end": {
      if (event.identifier && event.identifier !== AGENT_SPEC_ARTIFACT_ID) return state;
      const raw = event.fullContent || state.raw;
      const spec = tryParseSpecLoose(raw);
      return {
        ...state,
        raw,
        spec: spec ?? state.spec,
        status: spec ? "complete" : "error",
        error: spec ? null : "agent-spec stream did not parse as JSON",
      };
    }
    default:
      return state;
  }
}

export interface SpecSection {
  key: string;
  label: string;
  /** "scalar" | "list" | "table" | "json" — hints the renderer's layout. */
  kind: "scalar" | "list" | "table" | "json";
  value: any;
}

const SECTION_LABELS: Record<string, string> = {
  title: "Title",
  subtitle: "Subtitle",
  persona: "Persona",
  summary: "Summary",
  statusQuo: "Status quo",
  agentification: "Agentification",
  kpis: "KPIs",
  sourceSystems: "Source systems",
  entities: "Entities",
  documents: "Documents",
  anomalies: "Anomalies",
  architecture: "Architecture",
  behaviorContract: "Behavior contract",
  validation: "Validation",
  generationSpec: "Generation spec",
};

/** Ordered, render-friendly sections derived from a parsed agent-spec. */
export function specSections(spec: Record<string, any> | null): SpecSection[] {
  if (!spec || typeof spec !== "object") return [];
  const preferredOrder = Object.keys(SECTION_LABELS);
  const keys = [
    ...preferredOrder.filter((k) => k in spec),
    ...Object.keys(spec).filter((k) => !(k in SECTION_LABELS)),
  ];
  return keys.map((key) => {
    const value = spec[key];
    return {
      key,
      label: SECTION_LABELS[key] || humanizeKey(key),
      kind: classifyValue(value),
      value,
    };
  });
}

function classifyValue(value: any): SpecSection["kind"] {
  if (value == null) return "scalar";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return "scalar";
  if (Array.isArray(value)) {
    if (value.length > 0 && value.every((item) => item && typeof item === "object" && !Array.isArray(item))) {
      return "table";
    }
    return "list";
  }
  return "json";
}

export function humanizeKey(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase());
}

/** Readiness summary derived from a parsed spec (mirrors server reviewSpec.summary). */
export function specReadiness(spec: Record<string, any> | null): {
  systems: number;
  entities: number;
  documents: number;
  evals: number;
} {
  const arr = (v: any) => (Array.isArray(v) ? v.length : 0);
  const evals =
    arr(spec?.behaviorContract?.goldenEvals) ||
    arr(spec?.behaviorContract?.golden_evals) ||
    arr(spec?.goldenEvals);
  return {
    systems: arr(spec?.sourceSystems),
    entities: arr(spec?.entities),
    documents: arr(spec?.documents),
    evals,
  };
}
