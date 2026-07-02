import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button, ButtonLink, CommandChip, cx } from "@ge/ui";
import {
  ge,
  streamRuntimeEvents,
  type GeEvent,
  type RuntimeInteractionForm as RuntimeInteractionFormSchema,
  type RuntimeStatus,
  type RuntimeTaskSummary,
  type SpecRegisterResult,
  type StatusBoard,
} from "../services/geClient";
import { InterviewPane } from "../components/interview/InterviewPane";
import { SpecCanvas } from "../components/interview/SpecCanvas";
import { ErrorBanner } from "../components/ErrorBanner";
import { combinedGroundingText, type GroundedDocument } from "../components/interview/DocumentPreview";
import { slugify, startInterview, humanizeInterviewError } from "../lib/startInterview";

const DEFAULT_OUTCOME = "Help HR teams resolve benefits enrollment exceptions before payroll cutover.";
const DEFAULT_SYSTEMS = "workday,sap_concur";
const DEFAULT_CONSTRAINTS = "Use existing simulator packs when available. Require evidence before any write action.";

const MIN_LEFT = 360;
const MAX_LEFT = 760;
const DEFAULT_LEFT = 480;

type InteractionAnswers = Record<string, string | string[]>;
interface Interaction { id: string; form: RuntimeInteractionFormSchema; answered?: boolean; submittedAnswers?: InteractionAnswers }

function persistGeneratedSpecIdentity({ id, path, taskId }: { id: string; path: string; taskId?: string }) {
  window.localStorage.setItem("ge.interview.generatedSpec", JSON.stringify({
    id,
    path,
    taskId: taskId || null,
    updatedAt: new Date().toISOString(),
  }));
}

export default function Interview({ status }: { status?: StatusBoard | null }) {
  const [outcome, setOutcome] = useState(DEFAULT_OUTCOME);
  const [systems, setSystems] = useState(DEFAULT_SYSTEMS);
  const [constraints, setConstraints] = useState(DEFAULT_CONSTRAINTS);
  const [documents, setDocuments] = useState<GroundedDocument[]>([]);
  const [task, setTask] = useState<RuntimeTaskSummary | null>(null);
  const [events, setEvents] = useState<GeEvent[]>([]);
  const [interactions, setInteractions] = useState<Interaction[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [runtimeStatus, setRuntimeStatus] = useState<RuntimeStatus | null>(null);
  const [registeredSpec, setRegisteredSpec] = useState<SpecRegisterResult | null>(null);
  const [leftWidth, setLeftWidth] = useState(DEFAULT_LEFT);

  const usecaseId = useMemo(() => slugify(outcome), [outcome]);
  const runtimeSupportsInterview = runtimeStatus?.supportedTaskKinds?.includes("harness.run") === true;
  const runtimeProblem = Boolean(runtimeStatus && (!runtimeStatus.ok || !runtimeSupportsInterview));
  const restartCommand = runtimeStatus?.restartCommand || "ge daemon stop && ge daemon start";

  const refreshRuntime = useCallback(async () => {
    try {
      const next = await ge.runtimeStatus();
      setRuntimeStatus(next);
      return next;
    } catch (err: any) {
      const next: RuntimeStatus = {
        ok: false,
        status: "unavailable",
        error: err.message || "Runtime unavailable",
        supportedTaskKinds: [],
        capabilities: {},
        restartCommand,
      };
      setRuntimeStatus(next);
      return next;
    }
  }, [restartCommand]);

  useEffect(() => {
    void refreshRuntime();
    void restoreActiveInterview();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stream live events for the active task.
  useEffect(() => {
    if (!task?.id) return;
    setEvents([]);
    void restoreEvents(task.id);
    const unsub = streamRuntimeEvents(task.id, (ev) => {
      setEvents((prev) => [...prev, ev].slice(-400));
      applyInteractionEvent(ev);
      if (["stage_done", "stage_failed", "task_done", "task_failed"].includes(ev.type)) {
        ge.runtimeTask(task.id).then((detail) => {
          setTask(detail);
          if (["stage_failed", "task_failed"].includes(ev.type)) {
            const message = extractRuntimeFailure(detail) || ev.line || "Interview run failed";
            setError(humanizeInterviewError(message, restartCommand));
          }
        }).catch((err) => console.warn("[console] interview: task detail refresh failed:", err));
      }
    });
    return unsub;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [task?.id]);

  // Persist the generated-spec identity once agent-spec.json lands on disk.
  useEffect(() => {
    const agentSpec = (task?.artifactRefs || []).find((artifact) => artifact.name === "agent-spec");
    if (agentSpec?.status !== "present" || !agentSpec.path) return;
    const match = agentSpec.path.match(/\.ge(?:-harness)?\/interviews\/([^/]+)\/agent-spec\.json$/);
    persistGeneratedSpecIdentity({ id: match?.[1] || usecaseId, path: agentSpec.path, taskId: task?.id });
  }, [task?.artifactRefs, task?.id, usecaseId]);

  const restoreActiveInterview = async () => {
    const seed = window.localStorage.getItem("ge.interview.seed");
    if (seed) {
      try {
        const parsed = JSON.parse(seed);
        if (typeof parsed.outcome === "string") setOutcome(parsed.outcome);
        if (typeof parsed.systems === "string") setSystems(parsed.systems);
        if (typeof parsed.constraints === "string") setConstraints(parsed.constraints);
      } catch {
        // Ignore stale local state.
      }
    }
    const taskId = window.localStorage.getItem("ge.interview.activeTaskId");
    if (!taskId) return;
    try {
      const detail = await ge.runtimeTask(taskId);
      setTask(detail);
      await restoreEvents(taskId);
    } catch {
      // The task may have been pruned or the daemon may be offline; starting a new
      // interview remains available.
    }
  };

  const restoreEvents = async (taskId: string) => {
    try {
      const result = await ge.runtimeEvents(taskId, 0);
      const restored = result.events.map((item) => item.event);
      setEvents(restored.slice(-400));
      setInteractions(interactionsFromEvents(restored));
    } catch {
      // Event restoration is best-effort; the live stream still handles new forms.
    }
  };

  const applyInteractionEvent = (ev: GeEvent) => {
    if (ev.type === "antigravity.interaction_request" && ev.data?.form?.id) {
      const id = String(ev.data.form.id);
      setInteractions((prev) => {
        if (prev.some((item) => item.id === id)) return prev;
        return [...prev, { id, form: ev.data.form }];
      });
    }
    if ((ev.type === "antigravity.interaction_response" || ev.type === "ge.interaction.response") && (ev.data?.interactionId || (ev as any).interactionId)) {
      const id = String(ev.data?.interactionId || (ev as any).interactionId);
      setInteractions((prev) => prev.map((item) => item.id === id ? { ...item, answered: true, submittedAnswers: responsesToAnswers(item.form, ev.data?.responses) || item.submittedAnswers } : item));
    }
  };

  const handleStart = async () => {
    setBusy(true);
    setError(null);
    try {
      await refreshRuntime();
      const groundingText = combinedGroundingText(documents);
      const started = await startInterview({ outcome, systems, constraints, usecaseId, groundingText, status });
      setTask(started);
    } catch (err: any) {
      const message = err.detail || err.message || "Failed to start interview";
      setError(humanizeInterviewError(message, restartCommand));
    } finally {
      setBusy(false);
    }
  };

  // Pointer-based split resizer (clamped MIN_LEFT..MAX_LEFT, like pixelpitch's
  // --chat-pane-width). Stacks on small screens (the grid collapses to one column).
  const containerRef = useRef<HTMLDivElement | null>(null);
  const draggingRef = useRef(false);
  const startResize = (event: React.PointerEvent) => {
    event.preventDefault();
    draggingRef.current = true;
    (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
  };
  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      if (!draggingRef.current || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const next = Math.min(MAX_LEFT, Math.max(MIN_LEFT, event.clientX - rect.left));
      setLeftWidth(next);
    };
    const onUp = () => { draggingRef.current = false; };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  // Progress narrative: derived only from signals we already have (task presence,
  // agent-emitted interaction forms, the agent-spec artifact landing, task terminal
  // status, and the SpecCanvas register hand-back) — no invented precision.
  const answeredCount = interactions.filter((item) => item.answered).length;
  const specPresent = (task?.artifactRefs || []).some(
    (artifact) => artifact.name === "agent-spec" && artifact.status === "present",
  );
  const taskSettled = task?.status === "succeeded" || task?.status === "done";
  const steps: ProgressStep[] = [
    { key: "brief", label: "Brief", state: task ? "done" : "active" },
    {
      key: "interview",
      label: "Interview",
      state: !task ? "pending" : specPresent || taskSettled ? "done" : "active",
      detail: interactions.length > 0 ? `${answeredCount}/${interactions.length} answered` : undefined,
    },
    {
      key: "spec",
      label: "Spec",
      state: specPresent || taskSettled ? (registeredSpec ? "done" : "active") : "pending",
    },
    { key: "register", label: "Registered", state: registeredSpec ? "done" : "pending" },
  ];

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-outline-variant/40 px-6 py-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-secondary">Pipeline · Stage 1</div>
            <h1 className="text-xl font-bold text-on-surface">Interview to Spec</h1>
            <p className="mt-1 max-w-2xl text-sm text-secondary">
              The agent drives the interview on the left; the spec materializes, structured and editable, on the right.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ButtonLink href="#/pipeline" variant="outline" size="sm">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              Back to Pipeline
            </ButtonLink>
            <ButtonLink href="#/activity" variant="outline" size="sm">
              Open Runs
            </ButtonLink>
          </div>
        </div>
        <InterviewProgress steps={steps} />
      </div>

      {error && <ErrorBanner tone="amber" message={error} className="mx-6 mt-3" />}

      {runtimeProblem && (
        <div className="mx-6 mt-3 rounded-lg border border-amber-400/20 bg-amber-500/10 p-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="text-sm font-semibold text-amber-800">Runtime daemon needs a refresh</div>
              <p className="mt-1 text-sm text-amber-700">
                The local runtime daemon is running older code and doesn't support interview runs yet. Restart it once so the console can start a new interview.
              </p>
              {runtimeStatus?.error && <div className="mt-1 text-xs text-amber-700/80">{runtimeStatus.error}</div>}
            </div>
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <CommandChip command={restartCommand} />
              <Button variant="outline" size="sm" onClick={refreshRuntime}>
                Recheck
              </Button>
            </div>
          </div>
        </div>
      )}

      <div ref={containerRef} className="flex min-h-0 flex-1 flex-col px-4 py-4 lg:flex-row lg:gap-0">
        <div
          className="min-h-[60vh] overflow-hidden rounded-lg border border-outline-variant/40 bg-surface lg:min-h-0 lg:shrink-0"
          style={{ flexBasis: leftWidth, width: typeof window !== "undefined" && window.innerWidth >= 1024 ? leftWidth : undefined }}
        >
          <InterviewPane
            usecaseId={usecaseId}
            outcome={outcome}
            systems={systems}
            constraints={constraints}
            onOutcomeChange={setOutcome}
            onSystemsChange={setSystems}
            onConstraintsChange={setConstraints}
            documents={documents}
            onDocumentsChange={setDocuments}
            onStart={handleStart}
            busy={busy}
            runtimeProblem={runtimeProblem}
            task={task}
            events={events}
            interactions={interactions}
            onInteractionsChange={setInteractions}
          />
        </div>

        <div
          onPointerDown={startResize}
          className="group hidden w-2 shrink-0 cursor-col-resize items-center justify-center lg:flex"
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize panes"
        >
          <div className="h-12 w-1 rounded-full bg-outline-variant/60 transition-colors group-hover:bg-primary/50" />
        </div>

        <div className="mt-4 min-h-[60vh] flex-1 overflow-hidden rounded-lg border border-outline-variant/40 bg-surface shadow-ambient lg:mt-0 lg:min-h-0">
          <SpecCanvas usecaseId={usecaseId} task={task} events={events} onRegistered={setRegisteredSpec} />
        </div>
      </div>
    </div>
  );
}

type ProgressStepState = "done" | "active" | "pending";
interface ProgressStep { key: string; label: string; state: ProgressStepState; detail?: string }

/**
 * Slim step strip narrating the interview's arc: Brief → Interview → Spec →
 * Registered. States derive from real run signals only; the optional detail chip
 * ("2/3 answered") counts the agent's interaction forms.
 */
function InterviewProgress({ steps }: { steps: ProgressStep[] }) {
  return (
    <ol aria-label="Interview progress" className="mt-3 flex flex-wrap items-center gap-y-1.5">
      {steps.map((step, index) => (
        <li key={step.key} aria-current={step.state === "active" ? "step" : undefined} className="flex items-center">
          {index > 0 && <span aria-hidden className="mx-2.5 h-px w-6 bg-outline-variant/60 sm:w-8" />}
          <span className="flex items-center gap-1.5">
            {step.state === "done" ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" aria-hidden />
            ) : (
              <span
                aria-hidden
                className={cx(
                  "h-2 w-2 rounded-full",
                  step.state === "active"
                    ? "bg-primary animate-pulse motion-reduce:animate-none"
                    : "bg-outline-variant",
                )}
              />
            )}
            <span
              className={cx(
                "text-xs font-medium",
                step.state === "done" ? "text-on-surface" : step.state === "active" ? "text-primary" : "text-secondary/80",
              )}
            >
              {step.label}
            </span>
            {step.detail && (
              <span className="rounded-full bg-surface-container px-1.5 py-0.5 text-[10px] font-medium text-secondary">
                {step.detail}
              </span>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}

function interactionsFromEvents(events: GeEvent[]): Interaction[] {
  const byId = new Map<string, Interaction>();
  for (const ev of events) {
    if (ev.type === "antigravity.interaction_request" && ev.data?.form?.id) {
      const id = String(ev.data.form.id);
      byId.set(id, { ...(byId.get(id) || {}), id, form: ev.data.form });
    }
    if ((ev.type === "antigravity.interaction_response" || ev.type === "ge.interaction.response") && (ev.data?.interactionId || (ev as any).interactionId)) {
      const id = String(ev.data?.interactionId || (ev as any).interactionId);
      const existing = byId.get(id);
      if (existing) byId.set(id, { ...existing, answered: true, submittedAnswers: responsesToAnswers(existing.form, ev.data?.responses) || existing.submittedAnswers });
    }
  }
  return Array.from(byId.values()).filter((item) => item.form);
}

function responsesToAnswers(form: RuntimeInteractionFormSchema, responses: any): InteractionAnswers | null {
  if (!Array.isArray(responses)) return null;
  const questions = new Map((form.questions || []).map((question) => [question.id, question]));
  const answers: InteractionAnswers = {};
  for (const response of responses) {
    const questionId = String(response?.questionId || response?.id || "");
    if (!questionId || !questions.has(questionId)) continue;
    const selected = Array.isArray(response.selectedOptionIds)
      ? response.selectedOptionIds.map(String)
      : Array.isArray(response.selected_option_ids)
        ? response.selected_option_ids.map(String)
        : [];
    const freeform = typeof response.freeformResponse === "string"
      ? response.freeformResponse
      : typeof response.freeform_response === "string"
        ? response.freeform_response
        : "";
    const question = questions.get(questionId);
    answers[questionId] = question?.type === "checkbox" ? selected : selected[0] || freeform;
  }
  return Object.keys(answers).length ? answers : null;
}

function extractRuntimeFailure(task: RuntimeTaskSummary): string {
  const output = (task as any).output || {};
  const candidates = [task.summary, output.error, output.stderr, output.stdout]
    .filter(Boolean)
    .map((value) => (typeof value === "string" ? value : JSON.stringify(value)));
  for (const candidate of candidates) {
    const parsed = parseJsonFailure(candidate);
    if (parsed) return parsed;
    if (/Antigravity Vertex execution requires project and location/i.test(candidate)) return candidate;
  }
  return candidates[0] || "";
}

function parseJsonFailure(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.startsWith("{")) return "";
  try {
    const parsed = JSON.parse(trimmed);
    return parsed.error || parsed.stderr || "";
  } catch {
    return "";
  }
}
