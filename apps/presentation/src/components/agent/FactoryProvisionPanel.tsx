import React, { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Cpu, Database, Loader2, Rocket, ChevronDown, ChevronUp, Settings, ExternalLink, TriangleAlert, Link2, X } from "lucide-react";
import { startFactoryRun, startPreflight, getGeminiAgents, FactoryRun, FactoryRunStatus, FactoryStage, PreflightCheck } from "../../services/factoryClient";
import { authEnabled, getToken } from "../../auth/firebase";
import { UseCaseGenerationSpec } from "../../types/architecture";
import type { JourneyStage, MissionArtifactRef, FleetBlocker } from "@ge/contracts";
import { Lifecycle } from "@ge/ui";
import { PreflightChecklist } from "./PreflightChecklist";
import { GenerationSpecView } from "./GenerationSpecView";
import { ProvisionReview } from "./ProvisionReview";

const STAGES: { id: FactoryStage; label: string }[] = [
  { id: "validate", label: "Validate" },
  { id: "preview", label: "Preview" },
  { id: "plan_deploy", label: "Plan" },
  { id: "load_data", label: "Data" },
  { id: "deploy_runtime", label: "Runtime" },
  { id: "poll_runtime", label: "Runtime Ready" },
  { id: "register_tools", label: "Registry" },
  { id: "publish_enterprise", label: "Enterprise" },
];

function toUseCaseId(title: string) {
  return title
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Gets the status string for a factory stage from the run's artifacts.
 * Used by the "Latest State" micro-card display.
 */
function getStageStatus(status: FactoryRunStatus | null, stage: FactoryStage): string {
  const artifact = status?.artifacts?.[stage];
  if (!artifact) return "pending";
  if (artifact.status === "done" || artifact.status === "submitted" || artifact.status === "waiting") return artifact.status;
  if (artifact.status === "failed") return "failed";
  return artifact.status || "pending";
}

/**
 * Pulls artifact references off a stage result so the <Lifecycle> detail panel can
 * link/show them per stage rather than collapsing everything to a last-error string.
 */
function stageArtifacts(artifact: FactoryRunStatus["artifacts"][FactoryStage]): MissionArtifactRef[] {
  if (!artifact) return [];
  const refs: MissionArtifactRef[] = [];
  if (artifact.operation) refs.push({ name: "operation", path: artifact.operation });
  if (artifact.buildStatus) refs.push({ name: "build", path: artifact.buildStatus });
  return refs;
}

/**
 * Maps factory run status to JourneyStage[] for the shared <Lifecycle> component.
 * Each stage carries its own status, blocker (on failure), and artifact refs so the
 * Lifecycle's expandable detail surfaces per-stage error/operation/build info instead
 * of one terse label + a panel-level last-error string.
 */
function factoryStagesToJourney(status: FactoryRunStatus | null): JourneyStage[] {
  return STAGES.map((stage) => {
    const artifact = status?.artifacts?.[stage.id];
    let stageStatus: string = "pending";

    if (artifact) {
      if (artifact.status === "done") stageStatus = "done";
      else if (artifact.status === "submitted" || artifact.status === "waiting") stageStatus = "running";
      else if (artifact.status === "failed") stageStatus = "failed";
      else stageStatus = artifact.status || "pending";
    }

    const blocker: FleetBlocker | null = artifact?.error
      ? { id: `${stage.id}-error`, message: artifact.error }
      : null;

    return {
      id: stage.id,
      label: stage.label,
      owner: "factory",
      status: stageStatus,
      blocker,
      artifacts: stageArtifacts(artifact),
      actionPlan: null,
    };
  });
}

/** Next actionable (first non-done) stage id, so <Lifecycle> emphasizes + auto-expands it. */
function nextStageId(status: FactoryRunStatus | null): string | null {
  if (!status) return null;
  const next = STAGES.find((stage) => {
    const a = status.artifacts?.[stage.id];
    return !a || (a.status !== "done");
  });
  return next?.id ?? null;
}

/**
 * Minimal structural validation of an inbound (console-authored) generationSpec.
 * Mirrors the required top-level shape from types/architecture.ts so a malformed
 * deep-link payload is rejected before it is POSTed to the bridge.
 */
function isValidGenerationSpec(value: unknown): value is UseCaseGenerationSpec {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.entities) &&
    Array.isArray(v.sourceSystems) &&
    Array.isArray(v.documents) &&
    Array.isArray(v.apis) &&
    Array.isArray(v.anomalies) &&
    typeof v.rowPolicy === "object" && v.rowPolicy !== null &&
    typeof v.validation === "object" && v.validation !== null
  );
}

const GCS_URI = /^gs:\/\/[^/]+\/.+$/;

export interface FactoryProvisionPanelProps {
  title: string;
  department?: string;
  systems?: string[];
  generationSpec?: UseCaseGenerationSpec;
  usecaseId?: string | null;
}

export function FactoryProvisionPanel({ title, department, systems = [], generationSpec, usecaseId }: FactoryProvisionPanelProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [run, setRun] = useState<FactoryRun | null>(null);
  const [status, setStatus] = useState<FactoryRunStatus | null>(null);

  // Configuration states (defaults sourced from build-time env via Vite)
  const [showSettings, setShowSettings] = useState(false);
  const [projectId, setProjectId] = useState(import.meta.env.VITE_DEFAULT_PROJECT_ID || "");
  const [runtimeRegion, setRuntimeRegion] = useState(import.meta.env.VITE_DEFAULT_REGION || "us-central1");
  const [geminiEnterpriseLocation, setGeminiEnterpriseLocation] = useState(import.meta.env.VITE_DEFAULT_GEMINI_LOCATION || "global");
  const [geminiEnterpriseAppId, setGeminiEnterpriseAppId] = useState(import.meta.env.VITE_DEFAULT_GEMINI_APP_ID || "");
  const [serviceAccount, setServiceAccount] = useState("");

  // Gemini App ID selection states
  const [agentsList, setAgentsList] = useState<Array<{ id: string; displayName: string }>>([]);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const [useManualAppId, setUseManualAppId] = useState(false);

  // Preflight states — full structured checklist (not a collapsed badge)
  const [preflightBusy, setPreflightBusy] = useState(false);
  const [preflightChecks, setPreflightChecks] = useState<PreflightCheck[] | null>(null);
  const [preflightMessage, setPreflightMessage] = useState<string | null>(null);
  const [preflightPassed, setPreflightPassed] = useState<boolean | null>(null);

  // Review-gate state
  const [reviewConfirmed, setReviewConfirmed] = useState(false);

  // Consume-console-spec state (deep-link ?spec= / ?archive= or manual entry)
  const [consoleSpec, setConsoleSpec] = useState<UseCaseGenerationSpec | null>(null);
  const [prebuiltArchive, setPrebuiltArchive] = useState<string | null>(null);
  const [consumeError, setConsumeError] = useState<string | null>(null);
  const [consumeBusy, setConsumeBusy] = useState(false);

  const useCaseId = useMemo(() => (usecaseId ?? toUseCaseId(title)), [usecaseId, title]);

  // The spec the run will use: a consumed console spec wins over the slide's hardcoded spec.
  const effectiveSpec = consoleSpec ?? generationSpec ?? null;
  // True once we're provisioning from a console-authored payload (spec or archive).
  const consumingConsole = Boolean(consoleSpec || prebuiltArchive);

  const latestStage = useMemo(() => {
    if (!status) return null;
    return [...STAGES].reverse().find((stage) => status.artifacts?.[stage.id]) || null;
  }, [status]);

  // ── Deep-link consume: ?spec=<json-url> and/or ?archive=<gcs-uri> ──────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const specRef = params.get("spec");
    const archiveRef = params.get("archive");
    if (!specRef && !archiveRef) return;

    let active = true;
    const consume = async () => {
      setConsumeBusy(true);
      setConsumeError(null);
      try {
        if (archiveRef) {
          if (!GCS_URI.test(archiveRef)) throw new Error(`Invalid archive URI: ${archiveRef} (expected gs://bucket/object)`);
          if (active) setPrebuiltArchive(archiveRef);
        }
        if (specRef) {
          const res = await fetch(specRef, { headers: { accept: "application/json" } });
          if (!res.ok) throw new Error(`Failed to fetch console spec (${res.status})`);
          const parsed = await res.json();
          if (!isValidGenerationSpec(parsed)) throw new Error("Console spec failed shape validation (expected a UseCaseGenerationSpec).");
          if (active) setConsoleSpec(parsed);
        }
      } catch (err) {
        if (active) setConsumeError(err instanceof Error ? err.message : String(err));
      } finally {
        if (active) setConsumeBusy(false);
      }
    };
    consume();
    return () => {
      active = false;
    };
  }, []);

  // Handle SSE streaming progress updates
  useEffect(() => {
    if (!run?.runId) return;

    setError(null);
    let es: EventSource | null = null;
    let cancelled = false;

    const open = async () => {
      // EventSource can't set headers, so when opt-in auth is on the ID token
      // rides in the query string (?access_token=) — the server's bearerFrom
      // reads it. No-op when auth is disabled.
      let url = `/api/factory/runs/${encodeURIComponent(run.runId)}/events`;
      if (authEnabled) {
        const token = await getToken();
        if (token) url += `?access_token=${encodeURIComponent(token)}`;
      }
      if (cancelled) return;

      es = new EventSource(url);

      es.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.type === "status") {
            setStatus(payload.data);
          } else if (payload.type === "completed") {
            setStatus(payload.data);
            es?.close();
          } else if (payload.type === "error") {
            setError(payload.error);
            es?.close();
          }
        } catch (err) {
          setError("Failed to parse real-time event updates.");
        }
      };

      es.onerror = () => {
        es?.close();
      };
    };

    open();

    return () => {
      cancelled = true;
      es?.close();
    };
  }, [run?.runId]);

  // Automatically load Gemini Enterprise Apps when project or location changes
  useEffect(() => {
    if (!projectId) {
      setAgentsList([]);
      return;
    }
    let active = true;
    const fetchAgents = async () => {
      setLoadingAgents(true);
      try {
        const res = await getGeminiAgents(projectId, geminiEnterpriseLocation);
        if (!active) return;
        if (res.ok && res.agents && res.agents.length > 0) {
          setAgentsList(res.agents);
          setUseManualAppId(false); // Default to list selection if apps exist
          // Auto-select first app if currently selected app is not in the loaded list
          const exists = res.agents.some((a) => a.id === geminiEnterpriseAppId);
          if (!exists) {
            setGeminiEnterpriseAppId(res.agents[0].id);
          }
        } else {
          setAgentsList([]);
          setUseManualAppId(true); // Default to manual input if list is empty or API fails
        }
      } catch {
        if (!active) return;
        setAgentsList([]);
        setUseManualAppId(true);
      } finally {
        if (active) setLoadingAgents(false);
      }
    };
    fetchAgents();
    return () => {
      active = false;
    };
  }, [projectId, geminiEnterpriseLocation]);

  // Reset preflight + review gate whenever the target changes (a stale green badge is unsafe).
  const invalidateGate = () => {
    setPreflightChecks(null);
    setPreflightMessage(null);
    setPreflightPassed(null);
    setReviewConfirmed(false);
  };

  // Preflight validator — keeps the full structured checks[] for the checklist render.
  const checkPreflight = async () => {
    setPreflightBusy(true);
    setPreflightChecks(null);
    setPreflightMessage(null);
    setPreflightPassed(null);
    try {
      const res = await startPreflight({
        projectId,
        runtimeRegion,
        geminiEnterpriseLocation,
        geminiEnterpriseAppId,
        serviceAccount: serviceAccount || undefined,
      });
      setPreflightChecks(res.checks ?? []);
      setPreflightMessage(res.message ?? null);
      setPreflightPassed(res.ok);
    } catch (err) {
      setPreflightPassed(false);
      setPreflightMessage(err instanceof Error ? err.message : String(err));
    } finally {
      setPreflightBusy(false);
    }
  };

  // Provision is hard-blocked while preflight is explicitly failing.
  const preflightBlocked = preflightPassed === false;

  const start = async () => {
    setBusy(true);
    setError(null);
    try {
      const next = await startFactoryRun({
        title,
        useCaseId,
        usecaseId: usecaseId ?? undefined,
        department,
        systems,
        rows: String(effectiveSpec?.rowPolicy.defaultRowsPerEntity || 48),
        // Consume-console-spec path: pass a console-authored generationSpec OR a
        // prebuilt archive with startStage=load_data (skip scaffolding). Falls back
        // to the slide's hardcoded spec for the normal full-build path.
        generationSpec: effectiveSpec ?? undefined,
        ...(prebuiltArchive ? { prebuiltArchive, startStage: "load_data" as FactoryStage } : {}),
        targetStage: "publish_enterprise",
        target: {
          projectId,
          runtimeRegion,
          genaiLocation: "global",
          geminiEnterpriseLocation,
          geminiEnterpriseAppId: geminiEnterpriseAppId || undefined,
          serviceAccount: serviceAccount || undefined,
        },
      });
      setRun(next);
      setStatus(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  // In-deck per-agent cloud provisioning is DISABLED by default: it would deploy
  // into a target GCP project from the central worker (a cross-project surface).
  // The supported path is the self-service installer — each user deploys the whole
  // factory (incl. this agent) into THEIR OWN project. Set VITE_ENABLE_AGENT_PROVISION
  // =true (plus GE_ENABLE_AGENT_PROVISION=true on the server) only in a trusted env.
  const provisionEnabled = import.meta.env.VITE_ENABLE_AGENT_PROVISION === "true";
  if (!provisionEnabled) {
    const repoUrl =
      (import.meta.env.VITE_INSTALLER_REPO_URL as string | undefined) ??
      "https://github.com/vamsiramakrishnan/ge-agent-factory";
    const cloudShellHref = `https://shell.cloud.google.com/?${new URLSearchParams({
      cloudshell_git_repo: repoUrl,
      cloudshell_workspace: "installer",
      cloudshell_tutorial: "installer/TUTORIAL.md",
    }).toString()}`;
    return (
      <div className="editorial-card p-4 rounded-lg shrink-0 border border-outline-variant/25 shadow-sm bg-surface-container-low">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shadow-inner shrink-0">
              <Cpu className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-headline font-bold uppercase tracking-[0.15em] text-primary/70">Deploy This Agent</div>
              <div className="text-sm font-headline font-bold text-on-surface">Deploy into your own project</div>
              <p className="mt-1 text-xs text-secondary max-w-xl leading-relaxed">
                In-deck provisioning is disabled — there are no shared or cross-project deploys.
                Install the full factory (including this agent) into <span className="font-semibold text-on-surface">your own GCP project</span> via the guided Cloud Shell walkthrough.
              </p>
            </div>
          </div>
          <a
            href={cloudShellHref}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex shrink-0 items-center gap-2 px-4 py-2 rounded-lg hero-gradient text-white text-sm font-headline font-bold shadow-lg shadow-primary/20"
          >
            <Cpu className="w-4 h-4" />
            Open in Cloud Shell →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="editorial-card p-4 rounded-lg shrink-0 border border-outline-variant/25 shadow-sm bg-surface-container-low transition-all">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shadow-inner">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              {/* Disambiguated from DeployYourOwnSlide (install the whole factory):
                  this panel deploys THIS one agent into a target project. */}
              <div className="text-[10px] font-headline font-bold uppercase tracking-[0.15em] text-primary/70">Deploy This Agent</div>
              <div className="text-xs font-headline font-bold text-on-surface truncate">{run?.workspaceId || useCaseId}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {consumingConsole && (
            <span className="flex items-center gap-1 text-[9px] font-headline font-bold text-primary bg-primary/10 px-2 py-1 rounded border border-primary/20">
              <Link2 className="w-3 h-3" />
              {prebuiltArchive ? "Prebuilt archive" : "Console spec"}
            </span>
          )}
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`h-8 px-3 rounded text-[10px] font-headline font-bold transition-all border flex items-center gap-1.5 ${
              showSettings
                ? "bg-secondary text-white border-secondary shadow-sm"
                : "bg-white text-secondary border-outline-variant/30 hover:border-primary/40 hover:text-primary"
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            Config
            {showSettings ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      <p className="mt-2 text-[10px] text-secondary/60 leading-snug">
        Provisions <span className="font-bold text-on-surface/70">{title}</span> into your target GCP project — generates its data,
        deploys the runtime, and publishes it to Gemini Enterprise.
      </p>

      {/* Accordion Config Panel */}
      {showSettings && (
        <div className="mt-4 p-3.5 rounded-lg border border-outline-variant/20 bg-surface-container/60 grid grid-cols-1 md:grid-cols-2 gap-3 text-[10px] animate-fade-in">
          <div>
            <label className="block text-[8px] font-bold text-secondary/55 uppercase tracking-wider mb-1">Target GCP Project ID</label>
            <input
              type="text"
              value={projectId}
              onChange={(e) => { setProjectId(e.target.value); invalidateGate(); }}
              placeholder="my-gcp-project-id"
              className="w-full h-8 px-2.5 rounded border border-outline-variant/30 bg-white font-mono text-[10px] text-secondary focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-[8px] font-bold text-secondary/55 uppercase tracking-wider mb-1">Target GCP Region</label>
            <select
              value={runtimeRegion}
              onChange={(e) => { setRuntimeRegion(e.target.value); invalidateGate(); }}
              className="w-full h-8 px-2.5 rounded border border-outline-variant/30 bg-white text-[10px] text-secondary focus:border-primary focus:outline-none transition-colors"
            >
              <option value="us-central1">us-central1 (Iowa)</option>
              <option value="us-east1">us-east1 (S. Carolina)</option>
              <option value="europe-west1">europe-west1 (Belgium)</option>
              <option value="asia-east1">asia-east1 (Taiwan)</option>
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[8px] font-bold text-secondary/55 uppercase tracking-wider">Gemini Enterprise App ID (Optional)</label>
              {agentsList.length > 0 && (
                <button
                  type="button"
                  onClick={() => setUseManualAppId(!useManualAppId)}
                  className="text-[7px] text-primary hover:underline focus:outline-none"
                >
                  {useManualAppId ? "Select from list" : "Enter manually"}
                </button>
              )}
            </div>
            {loadingAgents ? (
              <div className="w-full h-8 px-2.5 rounded border border-outline-variant/30 bg-white flex items-center gap-1.5 text-secondary/50 text-[9px]">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
                <span>Scanning GCP Project for active apps...</span>
              </div>
            ) : useManualAppId || agentsList.length === 0 ? (
              <input
                type="text"
                value={geminiEnterpriseAppId}
                onChange={(e) => { setGeminiEnterpriseAppId(e.target.value); invalidateGate(); }}
                placeholder="projects/.../agents/[app-id]"
                className="w-full h-8 px-2.5 rounded border border-outline-variant/30 bg-white font-mono text-[9px] text-secondary focus:border-primary focus:outline-none transition-colors"
              />
            ) : (
              <select
                value={geminiEnterpriseAppId}
                onChange={(e) => { setGeminiEnterpriseAppId(e.target.value); invalidateGate(); }}
                className="w-full h-8 px-2.5 rounded border border-outline-variant/30 bg-white text-[10px] text-secondary focus:border-primary focus:outline-none transition-colors"
              >
                <option value="">-- No Gemini App ID --</option>
                {agentsList.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.displayName}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-[8px] font-bold text-secondary/55 uppercase tracking-wider mb-1">Gemini Location</label>
            <input
              type="text"
              value={geminiEnterpriseLocation}
              onChange={(e) => { setGeminiEnterpriseLocation(e.target.value); invalidateGate(); }}
              placeholder="global"
              className="w-full h-8 px-2.5 rounded border border-outline-variant/30 bg-white text-[10px] text-secondary focus:border-primary focus:outline-none transition-colors"
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between pt-2 border-t border-outline-variant/15">
            <button
              type="button"
              onClick={checkPreflight}
              disabled={preflightBusy}
              className="h-7 px-3 rounded bg-secondary/10 hover:bg-secondary/15 text-secondary font-headline font-bold text-[9px] transition-colors flex items-center gap-1"
            >
              {preflightBusy ? <Loader2 className="w-3 animate-spin" /> : null}
              Run Preflight Check
            </button>

            {preflightPassed === true && (
              <span className="flex items-center gap-1 text-[9px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <CheckCircle2 className="w-3 h-3" /> Preflight Passed
              </span>
            )}
            {preflightPassed === false && (
              <span className="flex items-center gap-1 text-[9px] text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-200">
                <TriangleAlert className="w-3 h-3" /> Preflight Failed
              </span>
            )}
          </div>

          {/* Preflight as a checklist (not a single collapsed badge) */}
          {(preflightBusy || (preflightChecks && preflightChecks.length > 0)) && (
            <div className="md:col-span-2">
              <PreflightChecklist checks={preflightChecks} busy={preflightBusy} message={preflightMessage} />
            </div>
          )}
        </div>
      )}

      {/* Consume-console-spec status (deep-link ?spec= / ?archive=) */}
      {consumeBusy && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container/60 px-3 py-2 text-[10px] text-secondary/60 animate-fade-in">
          <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
          Loading console-authored spec…
        </div>
      )}
      {consumeError && (
        <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-2.5 text-[10px] text-amber-800 font-medium flex items-start gap-2 animate-fade-in">
          <TriangleAlert className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
          <div className="min-w-0 flex-1">
            <span className="font-bold">Could not consume console input: </span>{consumeError}
          </div>
          <button onClick={() => setConsumeError(null)} className="text-amber-600 hover:text-amber-800 shrink-0" aria-label="Dismiss">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
      {prebuiltArchive && (
        <div className="mt-4 rounded-lg border border-primary/20 bg-primary/[0.03] p-2.5 text-[10px] animate-fade-in">
          <div className="flex items-center gap-1.5 text-primary font-headline font-bold">
            <Link2 className="w-3 h-3" /> Prebuilt workspace archive
          </div>
          <div className="font-mono text-[9px] text-secondary/60 mt-1 break-all">{prebuiltArchive}</div>
          <div className="text-[8px] text-secondary/45 mt-1">Scaffolding skipped — run starts at <span className="font-bold">load_data</span>.</div>
        </div>
      )}

      {/* Generation spec — collapsed, read-only */}
      {effectiveSpec && (
        <div className="mt-4">
          <GenerationSpecView spec={effectiveSpec} />
        </div>
      )}

      {/* Review + confirm gate, then Provision. When consuming a prebuilt archive
          without a spec there is nothing to summarize, so fall back to a direct
          (still confirmation-checkboxed) provision action below. */}
      {effectiveSpec ? (
        <div className="mt-4">
          <ProvisionReview
            spec={effectiveSpec}
            confirmed={reviewConfirmed}
            onConfirmChange={setReviewConfirmed}
            onProvision={start}
            busy={busy}
            blocked={preflightBlocked}
            blockedReason={preflightBlocked ? "Preflight failed — fix the failed checks above or re-run preflight before provisioning." : null}
          />
        </div>
      ) : (
        <div className="mt-4 flex items-center justify-end">
          <button
            onClick={start}
            disabled={busy || preflightBlocked}
            className="h-9 px-5 rounded bg-primary text-white text-[10px] font-headline font-bold shadow-ambient hover:bg-primary-container disabled:opacity-55 transition-colors flex items-center gap-1.5"
          >
            {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Rocket className="w-3.5 h-3.5" />}
            Provision This Agent
          </button>
        </div>
      )}

      {/* Progress Stages Row — per-stage detail/blocker/artifacts via <Lifecycle> */}
      <div className="mt-4">
        <Lifecycle stages={factoryStagesToJourney(status)} nextId={nextStageId(status)} orientation="horizontal" />
      </div>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-[9px] font-medium text-secondary/70">
        <div className="editorial-micro-card rounded-lg p-2.5 border border-outline-variant/15 bg-white shadow-inner flex flex-col justify-center min-w-0">
          <div className="text-secondary/40 uppercase font-bold tracking-[0.12em] text-[8px]">Run Session ID</div>
          <div className="font-mono text-on-surface truncate font-bold">{run?.runId || "not started"}</div>
        </div>
        <div className="editorial-micro-card rounded-lg p-2.5 border border-outline-variant/15 bg-white shadow-inner flex flex-col justify-center min-w-0">
          <div className="text-secondary/40 uppercase font-bold tracking-[0.12em] text-[8px]">Latest State</div>
          <div className="font-mono text-on-surface truncate font-bold">
            {latestStage ? `${latestStage.label}: ` : "none"}
            <span className={getStageStatus(status, latestStage?.id || "validate") === "failed" ? "text-red-600 font-bold" : "text-primary font-bold"}>
              {latestStage ? getStageStatus(status, latestStage.id).toUpperCase() : ""}
            </span>
          </div>
        </div>
        <div className="editorial-micro-card rounded-lg p-2.5 border border-outline-variant/15 bg-white shadow-inner flex flex-col justify-center min-w-0">
          <div className="text-secondary/40 uppercase font-bold tracking-[0.12em] text-[8px] flex items-center gap-1">
            <Database className="w-3 h-3 text-primary" /> Connected Systems
          </div>
          <div className="font-mono text-on-surface truncate font-bold">{systems.length ? systems.join(", ") : "derived"}</div>
        </div>
      </div>

      {run && usecaseId && (
        <div className="mt-4 flex items-center justify-center">
          {(() => {
            const consoleUrl = (import.meta.env.VITE_CONSOLE_URL as string | undefined) || "";
            return (
              <a
                href={`${consoleUrl}#/agent/${usecaseId}`}
                target="_blank"
                rel="noreferrer"
                className="h-8 px-4 rounded bg-white text-primary border border-primary/30 hover:bg-primary/5 text-[10px] font-headline font-bold shadow-sm transition-colors flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open in Console
              </a>
            );
          })()}
        </div>
      )}

      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-[10px] text-red-700 font-medium flex items-start gap-2 animate-fade-in shadow-inner">
          <TriangleAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold">Error Encountered:</div>
            <div className="font-mono mt-1 whitespace-pre-wrap">{error}</div>
          </div>
        </div>
      )}
    </div>
  );
}
