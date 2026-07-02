import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Boxes,
  ClipboardCheck,
  ExternalLink,
  FileText,
  GitBranch,
  Hammer,
  Loader2,
  Play,
  Radio,
  RefreshCw,
  Rocket,
  TriangleAlert,
  Wrench,
} from "lucide-react";
import { Button, EmptyState, Segmented, Stat } from "@ge/ui";
import {
  ge,
  startJob,
  type FleetActionPlan,
  type FleetAgent,
  type JourneyPlan,
  type JourneyStage,
  type StatusBoard,
  type WorkspaceDoctorReport,
  type WorkspaceRepairReport,
} from "../services/geClient";
import { StatusPill } from "../components/StatusPill";
import { StatusChip, normalizeStatus } from "../lib/runStatus";
import { Lifecycle } from "../components/Lifecycle";
import { ErrorBanner } from "../components/ErrorBanner";
import { actionCommand, planNavigates } from "../lib/actionPlans";

interface AgentDetailProps {
  id: string;
  status: StatusBoard | null;
  refresh: () => Promise<void>;
}

type StageFilter = "all" | "attention" | "active" | "done";

export default function AgentDetail({ id, status, refresh }: AgentDetailProps) {
  const [agent, setAgent] = useState<FleetAgent | null>(null);
  const [journey, setJourney] = useState<JourneyPlan | null>(null);
  const [doctor, setDoctor] = useState<WorkspaceDoctorReport | null>(null);
  const [repairReport, setRepairReport] = useState<WorkspaceRepairReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [journeyLoading, setJourneyLoading] = useState(false);
  const [doctorLoading, setDoctorLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [codeSyncing, setCodeSyncing] = useState(false);
  const [repairing, setRepairing] = useState(false);
  const [actionBusy, setActionBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stageFilter, setStageFilter] = useState<StageFilter>("all");
  const [lastSyncedAt, setLastSyncedAt] = useState<string | null>(null);
  const [codeSyncRemote, setCodeSyncRemote] = useState(() => window.localStorage.getItem("ge.sync.remote") || "");
  const [codeSyncPush, setCodeSyncPush] = useState(() => window.localStorage.getItem("ge.sync.push") !== "false");

  const workspaceId = agent?.workspaceId || agent?.actionPlan?.workspaceIds?.[0] || null;
  const primaryPlan = agent?.actionPlan || journey?.next?.actionPlan || null;
  const primaryCommand = actionCommand(primaryPlan);
  const currentStage = agent?.stage || journey?.next?.id || "spec";

  const loadWorkspaceDoctor = async (nextWorkspaceId = workspaceId, stage = "preview") => {
    if (!nextWorkspaceId) {
      setDoctor(null);
      return;
    }
    setDoctorLoading(true);
    try {
      const report = await ge.workspaceDoctor(nextWorkspaceId, stage);
      setDoctor(report);
      setRepairReport(null);
    } catch (err) {
      setDoctor({
        workspace: nextWorkspaceId,
        stage,
        ok: false,
        blockers: [{ id: "console:doctor", message: err instanceof Error ? err.message : String(err) }],
        repairTasks: [],
      });
    } finally {
      setDoctorLoading(false);
    }
  };

  const loadSecondaryState = async (nextAgent: FleetAgent, wait: boolean) => {
    setJourneyLoading(true);
    const nextWorkspaceId = nextAgent.workspaceId || nextAgent.actionPlan?.workspaceIds?.[0] || null;
    const journeyPromise = ge.journey({
      scenario: nextAgent.id,
      usecaseId: nextAgent.id,
      ids: [nextAgent.id],
      targetStage: "preview",
    }).then((nextJourney) => {
      setJourney(nextJourney);
    }).catch((err) => {
      setError(err instanceof Error ? err.message : String(err));
    }).finally(() => {
      setJourneyLoading(false);
    });
    const doctorPromise = loadWorkspaceDoctor(nextWorkspaceId, "preview");
    if (wait) await Promise.allSettled([journeyPromise, doctorPromise]);
  };

  const load = async (options: { awaitSecondary?: boolean; silent?: boolean } = {}) => {
    const initialLoad = !agent && !options.silent;
    if (initialLoad) setLoading(true);
    if (options.silent) setSyncing(true);
    setError(null);
    try {
      const result = await ge.agent(id);
      const nextAgent = result.agent;
      if (!nextAgent) {
        setAgent(null);
        setJourney(null);
        setDoctor(null);
        setError("Agent not found");
        return;
      }
      setAgent(nextAgent);
      setLoading(false);
      const secondary = loadSecondaryState(nextAgent, Boolean(options.awaitSecondary));
      if (options.awaitSecondary) await secondary;
      else void secondary;
      setLastSyncedAt(new Date().toISOString());
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setAgent(null);
      setJourney(null);
    } finally {
      if (initialLoad) setLoading(false);
      if (options.silent) setSyncing(false);
    }
  };

  useEffect(() => {
    void load();
  }, [id]);

  useEffect(() => {
    const onJobDone = () => {
      void load({ awaitSecondary: true, silent: true });
    };
    window.addEventListener("ge:job:done", onJobDone);
    // Don't go stale: calm off-:00 silent re-sync so the triage band, gate, and
    // next action track the backend without a manual refresh. Cancelled on unmount.
    const interval = window.setInterval(() => {
      void load({ silent: true });
    }, 5100);
    return () => {
      window.removeEventListener("ge:job:done", onJobDone);
      window.clearInterval(interval);
    };
  }, [id]);

  const runPlan = async (plan: FleetActionPlan | null | undefined) => {
    if (!plan || !agent) return;
    const command = actionCommand(plan);
    // reconcile-b: navigate only for navigate-mode kinds; execute kinds run below.
    const nav = planNavigates(plan, journey?.next?.id || "");
    if (nav) {
      location.hash = nav;
      return;
    }

    setActionBusy(true);
    try {
      if (plan.kind === "build_agents" || command.startsWith("ge agents build")) {
        const ids = plan.agentIds?.length ? plan.agentIds.join(",") : agent.id;
        await startJob(`Build ${agent.title}`, ge.build({ ids, local: status?.mode === "remote" ? false : true }));
        await Promise.all([load({ awaitSecondary: true, silent: true }), refresh()]);
        return;
      }

      if (plan.kind === "ship_agents" || command.startsWith("ge agents ship")) {
        const ids = plan.workspaceIds?.length
          ? plan.workspaceIds.join(",")
          : workspaceId || agent.id;
        await startJob(`Ship ${agent.title}`, ge.ship({ ids }));
        await Promise.all([load({ awaitSecondary: true, silent: true }), refresh()]);
        return;
      }

      if ((plan.kind === "resume_mission" || plan.kind === "resume_autopilot" || plan.kind === "resume_harness") && plan.taskId) {
        await ge.runtimeResume(plan.taskId);
        await Promise.all([load({ awaitSecondary: true, silent: true }), refresh()]);
        return;
      }

      if (plan.kind === "run_mission" || plan.kind === "run_preview" || command.startsWith("ge pipeline run") || command.startsWith("ge mission run")) {
        await ge.missionRun({
          scenario: agent.id,
          ids: [agent.id],
          targetStage: "preview",
          attempts: 3,
          runPreview: true,
        });
        await Promise.all([load({ awaitSecondary: true, silent: true }), refresh()]);
        return;
      }

      if (plan.kind === "repair_agent") {
        // Canonical autopilot path so the repair is recorded in the Repair Queue.
        await ge.startAutopilot({
          ids: [agent.id],
          targetStage: "preview",
          repair: true,
          attempts: 3,
          runPreview: true,
        });
        await Promise.all([load({ awaitSecondary: true, silent: true }), refresh()]);
        return;
      }

      if (plan.route) {
        location.hash = plan.route;
        return;
      }
      setError(`No console executor is registered for action kind: ${plan.kind}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setActionBusy(false);
    }
  };

  const handleRepair = async () => {
    if (!workspaceId) return;
    setRepairing(true);
    try {
      const report = await ge.workspaceRepair(workspaceId, {
        stage: doctor?.stage || "preview",
        attempts: 3,
        agent: "none",
        runPreview: false,
      });
      setRepairReport(report);
      setDoctor(report.finalDoctor);
      await Promise.all([load({ awaitSecondary: true, silent: true }), refresh()]);
    } catch (err) {
      setDoctor({
        workspace: workspaceId,
        stage: doctor?.stage || "preview",
        ok: false,
        blockers: [{ id: "console:repair", message: err instanceof Error ? err.message : String(err) }],
        repairTasks: [],
      });
    } finally {
      setRepairing(false);
    }
  };

  const handleCodeSync = async () => {
    if (!agent) return;
    setCodeSyncing(true);
    setError(null);
    try {
      const remote = codeSyncRemote.trim();
      window.localStorage.setItem("ge.sync.remote", remote);
      window.localStorage.setItem("ge.sync.push", String(codeSyncPush));
      await startJob(`Sync ${agent.title}`, ge.sync({
        ids: [agent.id],
        local: true,
        remote: remote || undefined,
        push: codeSyncPush,
      }));
      await Promise.all([load({ awaitSecondary: true, silent: true }), refresh()]);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setCodeSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !agent) {
    return (
      <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center px-6 text-center">
        <TriangleAlert className="mb-3 h-7 w-7 text-amber-600" />
        <h1 className="text-lg font-semibold text-on-surface">{error || "Agent not found"}</h1>
        <p className="mt-2 text-sm text-secondary">Fleet could not resolve this agent detail record.</p>
        <button
          type="button"
          onClick={() => load()}
          className="mt-5 inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-container"
        >
          <RefreshCw className="h-4 w-4" />
          Retry
        </button>
      </div>
    );
  }

  const health = agent.healthStatus || agent.status;
  const evidence = Object.entries(doctor?.evidence || {}).filter(([, value]) => Boolean(value)) as Array<[string, string]>;
  const nextStage = journey?.next;
  // Triage at a glance: the single most useful "what's wrong / what to do" line,
  // derived from already-loaded state. Blocker reasons win (that's what's wrong);
  // otherwise fall back to the plan/next-stage label (that's what to do next).
  const triageReason =
    agent.blocker?.message ||
    nextStage?.blocker?.message ||
    doctor?.blockers?.[0]?.message ||
    agent.nextAction ||
    primaryPlan?.label ||
    nextStage?.label ||
    "Waiting for the next pipeline transition.";
  const triageState = normalizeStatus(health);
  const triageActionLabel = primaryPlan?.label || nextStage?.label || null;
  const hasPlannerStages = Boolean(journey?.stages?.length);
  const displayedStages = hasPlannerStages ? journey!.stages : fallbackStages(agent, primaryPlan);
  const filteredStages = filterStages(displayedStages, stageFilter);
  const stageStats = countStages(displayedStages);

  return (
    <div className="mx-auto max-w-7xl px-6 py-7">
      <header className="mb-6 border-b border-outline-variant/40 pb-6">
        <button
          type="button"
          onClick={() => { location.hash = "#/fleet"; }}
          className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-secondary transition-colors hover:text-on-surface"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Fleet
        </button>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_auto] xl:items-end">
          <div className="min-w-0">
            <div className="mb-1 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary">
              <span>{agent.department || "unknown department"}</span>
              <span>·</span>
              <code className="font-mono normal-case tracking-normal">{agent.id}</code>
            </div>
            <h1 className="truncate text-3xl font-bold text-on-surface">{agent.title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-secondary">
              This detail view mirrors Fleet and Pipeline state: the same action plan, workspace gate, artifacts, and runtime handoff.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => load({ awaitSecondary: true, silent: true })}
              disabled={loading || actionBusy || syncing}
            >
              <RefreshCw className={`h-4 w-4 ${syncing ? "animate-spin" : ""}`} />
              Sync
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                window.localStorage.setItem("ge.pipeline.selectedSpecId", agent.id);
                location.hash = "#/pipeline";
              }}
            >
              <GitBranch className="h-4 w-4" />
              Pipeline
            </Button>
            <Button variant="outline" size="sm" onClick={() => { location.hash = "#/activity"; }}>
              <Radio className="h-4 w-4" />
              Runs
            </Button>
          </div>
        </div>
      </header>

      {/* Triage band — current stage + status + the single most useful next action /
          blocker reason, so the operator knows what's wrong and what to do without
          opening a tab. The primary CTA on the right mirrors the Next action card. */}
      <div
        className={`mb-6 flex flex-wrap items-center gap-x-3 gap-y-2 rounded-lg border px-4 py-3 ${
          triageState === "failed"
            ? "border-rose-500/30 bg-rose-500/10"
            : triageState === "blocked"
              ? "border-amber-500/30 bg-amber-500/10"
              : triageState === "running"
                ? "border-blue-500/30 bg-blue-500/10"
                : triageState === "done"
                  ? "border-emerald-500/30 bg-emerald-500/10"
                  : "border-outline-variant/40 bg-surface-container-low"
        }`}
      >
        <StatusChip status={health} />
        <span className="text-xs font-semibold uppercase tracking-wide text-secondary">{currentStage}</span>
        <span className="hidden text-outline-variant/60 sm:inline">·</span>
        <span className="min-w-0 flex-1 truncate text-sm font-medium text-on-surface" title={triageReason}>
          {triageReason}
        </span>
        {primaryPlan && (
          <Button
            variant="primary"
            size="md"
            className="shrink-0"
            onClick={() => runPlan(primaryPlan)}
            disabled={actionBusy || primaryPlan.safeToRun === false}
            loading={actionBusy}
          >
            {!actionBusy && actionIcon(primaryPlan)}
            {triageActionLabel || "Run next action"}
          </Button>
        )}
      </div>

      {error && <ErrorBanner tone="amber" message={error} onRetry={() => load()} />}

      <section className="mb-6 grid gap-3 md:grid-cols-4">
        <Stat size="md" label="Health" value={<StatusChip status={health} />} />
        <Stat size="md" label="Stage" value={currentStage} />
        <Stat
          size="md"
          label="Workspace"
          title={workspaceId || "not built"}
          value={<span className="block truncate font-mono">{workspaceId || "not built"}</span>}
        />
        <Stat size="md" label="Owner" value={agent.owner || nextStage?.owner || "none"} />
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="grid gap-6">
          <section className="overflow-hidden rounded-lg border border-outline-variant/40 bg-surface">
            <div className="border-b border-outline-variant/30 px-5 py-4">
              <div className="grid gap-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary">
                    <GitBranch className="h-3.5 w-3.5" />
                    Pipeline position
                  </div>
                  <h2 className="mt-1 text-lg font-semibold text-on-surface">What has happened and what comes next</h2>
                  <div className="mt-1 text-xs text-secondary">
                    {lastSyncedAt ? `Synced ${formatTime(lastSyncedAt)}` : "Waiting for first sync"}
                    {syncing && <span className="ml-2 text-primary">syncing...</span>}
                  </div>
                </div>
                <Segmented<StageFilter>
                  aria-label="Filter stages"
                  options={[
                    { value: "all", label: "All", count: stageStats.all },
                    { value: "attention", label: "Attention", count: stageStats.attention },
                    { value: "active", label: "Active", count: stageStats.active },
                    { value: "done", label: "Complete", count: stageStats.done },
                  ]}
                  value={stageFilter}
                  onChange={setStageFilter}
                />
              </div>
            </div>
            <div className="px-5 py-4">
              {journeyLoading && !hasPlannerStages && (
                <div className="mb-4 flex items-center gap-2 text-xs text-secondary">
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-primary" />
                  Planner is refreshing; showing Fleet-derived state until the typed journey returns.
                </div>
              )}
              {displayedStages.length > 0 && filteredStages.length > 0 && (
                <Lifecycle
                  stages={filteredStages}
                  nextId={journey?.next?.id}
                  onAction={(plan, _stage) => runPlan(plan)}
                  orientation="vertical"
                />
              )}
              {!journeyLoading && displayedStages.length === 0 && (
                <EmptyState title="No journey stages were returned for this agent." />
              )}
              {displayedStages.length > 0 && filteredStages.length === 0 && (
                <EmptyState title="No stages match this filter." />
              )}
            </div>
          </section>

          <section className="overflow-hidden rounded-lg border border-outline-variant/40 bg-surface">
            <div className="grid gap-3 border-b border-outline-variant/30 px-5 py-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary">
                  <ClipboardCheck className="h-3.5 w-3.5" />
                  Workspace gate
                </div>
                <h2 className="mt-1 text-lg font-semibold text-on-surface">
                  {doctor?.ok ? "Preview checks are passing" : workspaceId ? "Preview checks need attention" : "Workspace has not been built"}
                </h2>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => loadWorkspaceDoctor(workspaceId, "preview")}
                  disabled={doctorLoading || repairing || !workspaceId}
                  className="inline-flex items-center gap-2 rounded-md border border-primary/30 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:opacity-50"
                >
                  {doctorLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ClipboardCheck className="h-4 w-4" />}
                  Check
                </button>
                <button
                  type="button"
                  onClick={handleRepair}
                  disabled={repairing || doctorLoading || doctor?.ok === true || !workspaceId}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-container disabled:opacity-50"
                >
                  {repairing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wrench className="h-4 w-4" />}
                  Fix
                </button>
              </div>
            </div>
            <div className="grid gap-5 px-5 py-4 lg:grid-cols-[220px_minmax(0,1fr)]">
              <div className="rounded-md bg-surface-container-low px-4 py-3">
                <div className="text-xs font-medium uppercase tracking-wide text-secondary">Gate status</div>
                <div className="mt-2 flex items-center gap-2">
                  <StatusPill status={doctor?.ok ? "pass" : "warn"} />
                  {doctorLoading && <Loader2 className="h-3.5 w-3.5 animate-spin text-secondary" />}
                </div>
                <div className="mt-3 text-xs leading-5 text-secondary">
                  {doctor
                    ? `${doctor.stage} · ${doctor.summary?.failed ?? doctor.blockers.length} blocker(s) · ${doctor.repairTasks?.length ?? 0} repair task(s)`
                    : workspaceId
                      ? "Run a check to inspect this workspace."
                      : "Build must create a workspace before checks can inspect it."}
                </div>
              </div>
              <div className="min-w-0">
                {doctor?.blockers?.length ? (
                  <div className="grid gap-2">
                    {doctor.blockers.map((blocker) => (
                      <div key={blocker.id} className="rounded-md border border-amber-400/20 bg-amber-500/10 px-3 py-2 text-xs text-amber-800">
                        <span className="font-mono">{blocker.id}</span>: {blocker.message}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-3 py-2 text-xs text-emerald-800">
                    {workspaceId ? "No workspace blockers reported." : "No workspace exists yet."}
                  </div>
                )}
                {repairReport && (
                  <p className="mt-3 text-xs text-secondary">
                    Repair {repairReport.ok ? "converged" : "stopped"} after {repairReport.attempts.length} attempt(s).
                  </p>
                )}
              </div>
            </div>
          </section>
        </main>

        <aside className="grid content-start gap-6">
          <section className="rounded-lg border border-outline-variant/40 bg-surface p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-secondary">Next action</div>
            <h2 className="mt-1 text-lg font-semibold text-on-surface">{primaryPlan?.label || nextStage?.label || "No action required"}</h2>
            <p className="mt-2 text-sm leading-6 text-secondary">
              {agent.blocker?.message || nextStage?.blocker?.message || actionSummary(primaryPlan) || "This agent is currently waiting for the next pipeline transition."}
            </p>
            {primaryCommand && (
              <div className="mt-3 overflow-hidden rounded-md bg-surface-container px-3 py-2 font-mono text-[11px] text-secondary">
                <div className="truncate" title={primaryCommand}>{primaryCommand}</div>
              </div>
            )}
            <Button
              variant="primary"
              size="md"
              className="mt-4 w-full"
              onClick={() => runPlan(primaryPlan)}
              disabled={!primaryPlan || primaryPlan.safeToRun === false}
              loading={actionBusy}
            >
              {!actionBusy && actionIcon(primaryPlan)}
              {primaryPlan?.label || "No runnable action"}
            </Button>
          </section>

          <section className="rounded-lg border border-outline-variant/40 bg-surface p-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary">
              <Boxes className="h-3.5 w-3.5" />
              Artifacts
            </div>
            <div className="grid gap-2">
              {evidence.length ? evidence.map(([name, value]) => (
                <ArtifactLine key={name} name={name} value={value || ""} />
              )) : (
                <div className="rounded-md bg-surface-container-low px-3 py-3 text-sm text-secondary">
                  {workspaceId ? "No evidence paths were reported by the workspace gate yet." : "Artifacts appear after a workspace is built."}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-lg border border-outline-variant/40 bg-surface p-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary">
              <GitBranch className="h-3.5 w-3.5" />
              Code sync
            </div>
            <p className="text-sm leading-6 text-secondary">
              Copy this generated workspace into `generated-agents/` or into a dedicated git repo.
            </p>
            <label className="mt-3 grid gap-1 text-xs font-medium text-secondary">
              Destination git repo
              <input
                type="text"
                value={codeSyncRemote}
                onChange={(event) => setCodeSyncRemote(event.target.value)}
                placeholder="blank uses generated-agents/ in this repo"
                className="w-full rounded-md border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-sm font-normal text-on-surface focus:border-primary/50 focus:outline-none"
              />
            </label>
            <label className="mt-3 inline-flex items-center gap-2 text-sm font-medium text-on-surface">
              <input
                type="checkbox"
                checked={codeSyncPush}
                onChange={(event) => setCodeSyncPush(event.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Push after commit
            </label>
            <button
              type="button"
              onClick={handleCodeSync}
              disabled={codeSyncing || !workspaceId}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-primary/30 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10 disabled:border-outline/20 disabled:text-secondary disabled:opacity-60"
            >
              {codeSyncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <GitBranch className="h-4 w-4" />}
              Sync code
            </button>
          </section>

          <section className="rounded-lg border border-outline-variant/40 bg-surface p-5">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-secondary">
              <Radio className="h-3.5 w-3.5" />
              Runtime handoff
            </div>
            <div className="grid gap-3 text-sm">
              <InfoRow label="Runtime task" value={agent.runtimeTaskId || nextStage?.taskId || "none"} mono />
              <InfoRow label="Factory run" value={agent.runId || "none"} mono />
              <InfoRow label="Source" value={agent.source || "catalog"} />
            </div>
            <button
              type="button"
              onClick={() => { location.hash = "#/activity"; }}
              className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md border border-outline/30 px-3 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
            >
              <ExternalLink className="h-4 w-4" />
              Open Runs
            </button>
          </section>
        </aside>
      </div>
    </div>
  );
}

function ArtifactLine({ name, value }: { key?: string; name: string; value: string }) {
  return (
    <div className="rounded-md border border-outline-variant/30 bg-surface-container-low px-3 py-2">
      <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-wide text-secondary">
        <FileText className="h-3.5 w-3.5" />
        {name.replace(/_/g, " ")}
      </div>
      <div className="mt-1 truncate font-mono text-[11px] text-on-surface" title={value}>
        {value}
      </div>
    </div>
  );
}

function InfoRow({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[11px] font-medium uppercase tracking-wide text-secondary">{label}</div>
      <div className={`mt-1 truncate text-sm text-on-surface ${mono ? "font-mono text-xs" : ""}`} title={value}>{value}</div>
    </div>
  );
}

function actionIcon(plan: FleetActionPlan | null) {
  if (!plan) return <Play className="h-4 w-4" />;
  if (plan.kind.includes("ship")) return <Rocket className="h-4 w-4" />;
  if (plan.kind.includes("build")) return <Hammer className="h-4 w-4" />;
  if (plan.kind.includes("repair")) return <Wrench className="h-4 w-4" />;
  if (plan.kind.includes("resume")) return <Play className="h-4 w-4" />;
  return <Play className="h-4 w-4" />;
}

function actionSummary(plan: FleetActionPlan | null) {
  if (!plan) return "";
  if (plan.kind.includes("ship")) return "Preview-ready workspace is available; ship it through the cloud deployment boundary.";
  if (plan.kind.includes("build")) return "Generate the local workspace and package the agent artifacts.";
  if (plan.kind.includes("repair")) return "Run Autopilot repair against the preview gate.";
  if (plan.kind.includes("resume")) return "Resume the durable runtime task from its saved state.";
  return plan.label;
}

function filterStages(stages: JourneyStage[], filter: StageFilter) {
  if (filter === "all") return stages;
  if (filter === "attention") {
    return stages.filter((stage) => stage.status === "blocked" || stage.status === "failed" || Boolean(stage.blocker));
  }
  if (filter === "active") {
    return stages.filter((stage) => Boolean(stage.actionPlan) || ["pending", "running", "blocked", "failed"].includes(stage.status));
  }
  return stages.filter((stage) => stage.status === "done" || stage.status === "skipped");
}

function countStages(stages: JourneyStage[]): Record<StageFilter, number> {
  return {
    all: stages.length,
    attention: filterStages(stages, "attention").length,
    active: filterStages(stages, "active").length,
    done: filterStages(stages, "done").length,
  };
}

function formatTime(value: string) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date(value));
}

function fallbackStages(agent: FleetAgent, actionPlan: FleetActionPlan | null): JourneyStage[] {
  const order = [
    { id: "spec", label: "Spec", owner: "catalog" },
    { id: "data", label: "Data", owner: "runtime" },
    { id: "simulator", label: "Simulator", owner: "runtime" },
    { id: "build", label: "Agent Build", owner: "factory" },
    { id: "eval", label: "Eval", owner: "antigravity" },
    { id: "preview", label: "Preview", owner: "repair" },
    { id: "deploy", label: "Deploy", owner: "factory" },
  ];
  const stageId = agent.stage || "spec";
  const currentIndex = Math.max(0, order.findIndex((stage) => stage.id === stageId));
  return order.map((stage, index) => {
    const isBefore = index < currentIndex;
    const isCurrent = index === currentIndex;
    const isReadyDeploy = agent.healthStatus === "ready" && stage.id === "deploy";
    const status = isBefore
      ? "done"
      : isReadyDeploy
        ? "pending"
        : isCurrent
          ? agent.healthStatus === "blocked" || agent.status === "failed" ? "blocked" : "pending"
          : "pending";
    return {
      id: stage.id,
      label: stage.label,
      owner: stage.owner,
      status,
      blocker: isCurrent ? agent.blocker || null : null,
      taskId: isCurrent ? agent.runtimeTaskId || null : null,
      nodeIds: [],
      artifacts: [],
      actionPlan: isCurrent || isReadyDeploy ? actionPlan : null,
    };
  });
}
