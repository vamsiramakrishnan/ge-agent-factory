import { useState, useEffect } from "react";
import { Button, ButtonLink, CommandChip, EmptyState, PageHeader, Section, Stat } from "@ge/ui";
import { useGeQuery } from "../lib/query";
import { ge, startJob, type StatusBoard, type Fleet, type RuntimeTaskSummary, type ReconcilePlan } from "../services/geClient";
import { PlaneCard } from "../components/PlaneCard";
import { ErrorBanner } from "../components/ErrorBanner";
import { useToast } from "../lib/toast";
import { StatusChip } from "../lib/runStatus";
import { User, GitBranch, Boxes, ArrowRight, Check } from "lucide-react";
import { CloudShellCta } from "../components/CloudShellCta";
import { GetStartedCard } from "../components/GetStartedCard";

interface OverviewProps {
  status: StatusBoard | null;
  refresh: () => Promise<void>;
}

type JourneyKey = "preview" | "console" | "platform";

const DEFAULT_SCENARIO = "benefits-enrollment";
const DEFAULT_SYSTEMS = "workday,sap_concur";

function splitCsv(value: string): string[] {
  return value.split(",").map((item) => item.trim()).filter(Boolean);
}

function isActive(status: string) {
  return ["queued", "running", "paused"].includes(status);
}

function isBlocked(status: string) {
  return ["blocked", "failed"].includes(status);
}

export default function Overview({ status, refresh }: OverviewProps) {
  // Data via the shared query layer (lib/query.ts): polling cadence, job-done
  // invalidation, dedupe, and focus refetch all come from the conventions
  // there instead of a per-view useEffect/setInterval stack.
  const fleetQuery = useGeQuery<Fleet>(["fleet"], () => ge.fleet(), { intervalMs: 9700 });
  const tasksQuery = useGeQuery(
    ["runtimeTasks", 8],
    () =>
      ge.runtimeTasks(8, true).catch((err) => {
        console.warn("[console] overview: runtime tasks unavailable:", err);
        return { tasks: [] as RuntimeTaskSummary[] };
      }),
    { intervalMs: 9700 },
  );
  // Reconcile drift is best-effort decoration — a failure renders as absence.
  const reconcileQuery = useGeQuery<ReconcilePlan | null>(["applyPlan"], () => ge.applyPlan().catch(() => null), { intervalMs: 60_000 });

  const fleet = fleetQuery.data ?? null;
  const runtimeTasks = tasksQuery.data?.tasks ?? [];
  const reconcile = reconcileQuery.data ?? null;
  const loading = fleetQuery.isLoading;
  const error = fleetQuery.error ? (fleetQuery.error as Error).message || "Failed to fetch overview" : null;
  const refetchOverview = async () => {
    await Promise.all([fleetQuery.refetch(), tasksQuery.refetch()]);
  };

  const [busyPlanes, setBusyPlanes] = useState<Set<string>>(new Set());
  const [busyPreview, setBusyPreview] = useState(false);
  const [getStartedDismissed, setGetStartedDismissed] = useState(() => {
    try {
      return window.localStorage.getItem("ge.getStarted.dismissed") === "1";
    } catch {
      // No storage → show the card; it's only ever additive.
      return false;
    }
  });
  const notify = useToast();

  const dismissGetStarted = () => {
    setGetStartedDismissed(true);
    try {
      window.localStorage.setItem("ge.getStarted.dismissed", "1");
    } catch {
      // Best-effort: without storage the dismissal lasts for this session only.
    }
  };

  // The status board comes in via props from the App shell; keep it as fresh
  // as the queries (the query layer only owns this view's own data).
  useEffect(() => {
    const interval = window.setInterval(() => { void refresh(); }, 9700);
    const onJobDone = () => { void refresh(); };
    window.addEventListener("ge:job:done", onJobDone);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("ge:job:done", onJobDone);
    };
  }, [refresh]);

  // A timeout arg historically meant the error/failure variant; map it to tone.
  const showToast = (message: string, timeout?: number) => notify(message, timeout ? "error" : "success");

  const handleStandUp = async (planeName: string, planeKey: string) => {
    setBusyPlanes((prev) => new Set(prev).add(planeKey));
    try {
      if (planeKey === "data") {
        await startJob("ge data up", ge.dataUp());
      } else if (planeKey === "mcp") {
        await startJob("ge mcp deploy", ge.mcpDeploy());
      } else {
        await startJob(`ge up --${planeKey}`, ge.up([planeKey]));
      }
      showToast(`${planeName}: started. Open Runs for the full timeline.`);
    } catch (err: any) {
      showToast(`Failed to start ${planeName}: ${err.message}`, 6000);
    } finally {
      setBusyPlanes((prev) => {
        const next = new Set(prev);
        next.delete(planeKey);
        return next;
      });
    }
  };

  const handleStartMission = async () => {
    setBusyPreview(true);
    try {
      const task = await ge.missionRun({
        scenario: DEFAULT_SCENARIO,
        systems: splitCsv(DEFAULT_SYSTEMS),
        targetStage: "preview",
        attempts: 3,
        runPreview: true,
      });
      showToast(`Preview run started: ${task.id}`);
      await refetchOverview();
      location.hash = `#/activity?task=${encodeURIComponent(task.id)}`;
    } catch (err: any) {
      showToast(`Failed to start preview: ${err.message}`, 7000);
    } finally {
      setBusyPreview(false);
    }
  };

  const handleResumeMission = async (task: RuntimeTaskSummary) => {
    setBusyPreview(true);
    try {
      await ge.runtimeResume(task.id);
      showToast(`Resume requested for ${task.id}`);
      await refetchOverview();
      location.hash = `#/activity?task=${encodeURIComponent(task.id)}`;
    } catch (err: any) {
      showToast(`Failed to resume run: ${err.message}`, 7000);
    } finally {
      setBusyPreview(false);
    }
  };

  // Route the status board's `next` command. Matched on the exact command
  // prefixes statusBoard() emits (ge init / ge up [--plane] / ge agents build)
  // rather than loose substrings, so "up" inside another word can't misfire and
  // an unrecognized command lands on the Pipeline — the place work starts —
  // with the command surfaced, not silently on the Fleet roster.
  const handleNextStep = async () => {
    const next = (status?.next || "").trim();
    if (!next) return;

    if (next.startsWith("ge init")) {
      showToast("This machine has no GCP project configured — run `ge init` in a terminal, then refresh.", 7000);
      location.hash = "#/doctor";
      return;
    }
    if (next.startsWith("ge data up") || next.startsWith("ge up --data")) {
      try {
        await startJob("ge data up", ge.dataUp());
        showToast("Data plane started. Open Runs for the full timeline.");
      } catch (err: any) {
        showToast(`Failed: ${err.message}`, 6000);
      }
      return;
    }
    if (next.startsWith("ge mcp deploy") || next.startsWith("ge up --mcp")) {
      try {
        await startJob("ge mcp deploy", ge.mcpDeploy());
        showToast("Tool services started. Open Runs for the full timeline.");
      } catch (err: any) {
        showToast(`Failed: ${err.message}`, 6000);
      }
      return;
    }
    if (next.startsWith("ge up")) {
      const planes = ["infra", "data", "mcp"].filter((plane) => next.includes(`--${plane}`));
      try {
        await startJob(next, ge.up(planes.length > 0 ? planes : undefined));
        showToast("Started. Open Runs for the full timeline.");
      } catch (err: any) {
        showToast(`Failed: ${err.message}`, 6000);
      }
      return;
    }
    if (next.startsWith("ge agents build")) {
      location.hash = "#/pipeline";
      return;
    }
    showToast(`Next: \`${next}\` — opening the Pipeline.`);
    location.hash = "#/pipeline";
  };

  const planeKey = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes("factory")) return "infra";
    if (n.includes("tool")) return "mcp";
    if (n.includes("data")) return "data";
    return "infra";
  };

  const recentAgents = fleet?.agents
    .filter((a) => a.status !== "none")
    .slice(0, 6) ?? [];

  const missionTasks = runtimeTasks.filter((task) => task.kind === "mission.run");
  const blockedMission = missionTasks.find((task) => isBlocked(task.status));
  const activeMission = missionTasks.find((task) => isActive(task.status));
  const latestMission = blockedMission || activeMission || missionTasks[0] || null;
  const planes = status?.planes ?? [];
  const readyPlanes = planes.filter((plane) => plane.up).length;
  const allPlanesReady = planes.length > 0 && readyPlanes === planes.length;

  const totalDeployed = fleet?.byStatus?.deployed ?? 0;
  const totalSubmitted = fleet?.byStatus?.submitted ?? 0;
  const totalFailed = fleet?.byStatus?.failed ?? 0;
  const totalNone = fleet?.byStatus?.none ?? 0;
  const total = fleet?.total ?? 0;
  const progress = total > 0 ? ((totalDeployed + totalSubmitted) / total) * 100 : 0;

  const mode = status?.mode ?? "local";
  const toolPlaneReady = planes.find((p) => p.name.toLowerCase().includes("tool"))?.up ?? false;

  // The canonical pipeline, mode-aware. Local builds stop at the build boundary;
  // ship hands the workspace to the cloud, which deploys and registers it. We mark
  // the boundary so it's clear where "this machine" ends and "the cloud" begins.
  const phases = [
    { key: "spec", label: "Spec", hint: "Interview → registered spec", done: total > 0, count: null as number | null },
    { key: "build", label: "Build", hint: mode === "remote" ? "Cloud factory" : "On this machine", done: totalSubmitted + totalDeployed > 0, count: totalNone || null },
    { key: "ship", label: "Ship", hint: "Local → cloud handoff", boundary: true, done: totalDeployed > 0, count: null },
    { key: "deploy", label: "Deploy", hint: "Cloud runtime + tools", done: totalDeployed > 0, count: totalSubmitted || null },
    { key: "running", label: "Running", hint: "Registered & serving", done: totalDeployed > 0, count: totalDeployed || null },
  ];

  if (loading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex flex-wrap items-baseline gap-3 mb-1">
            <div className="animate-pulse rounded bg-surface-container h-4 w-16" />
            <div className="animate-pulse rounded bg-surface-container h-4 w-32" />
          </div>
          <div className="animate-pulse rounded bg-surface-container h-8 w-48 mt-2" />
        </div>

        <div className="editorial-micro-card rounded-lg p-5 mb-6">
          <div className="animate-pulse rounded bg-surface-container h-6 w-40 mb-2" />
          <div className="animate-pulse rounded bg-surface-container h-4 w-full max-w-2xl mb-4" />
          <div className="animate-pulse rounded bg-surface-container h-10 w-32" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="editorial-micro-card rounded-lg p-5">
              <div className="animate-pulse rounded bg-surface-container h-5 w-32 mb-2" />
              <div className="animate-pulse rounded bg-surface-container h-3 w-full mb-4" />
              <div className="animate-pulse rounded bg-surface-container h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {error && <ErrorBanner message={error} onRetry={refetchOverview} />}


      <PageHeader
        title="Overview"
        subtitle="Where your agents are in the pipeline, and what to do next."
        meta={
          <>
            <Stat size="sm" label="Mode" value={mode} />
            <Stat size="sm" label="GCP Project" value={status?.project ?? "No GCP project"} />
            {status?.app ? <Stat size="sm" label="App" value={status.app} /> : null}
          </>
        }
      />

      {/* Self-service install — bring the whole factory up in your own project. */}
      <CloudShellCta />

      {/* Guided first journey with honest effort estimates. Steps check off
          from live state, so this is also the resume point if the user leaves
          halfway. Auto-retires on the first deployed agent; dismissable. */}
      {totalDeployed === 0 && !getStartedDismissed && (
        <GetStartedCard
          hasAgents={total > 0 && totalNone < total}
          hasRuns={runtimeTasks.length > 0}
          hasDeployed={totalDeployed > 0}
          mode={mode}
          onDismiss={dismissGetStarted}
        />
      )}

      {/* Pipeline rail — the build→ship→deploy→run flow, mode-aware. */}
      <Section
        className="mb-6"
        title="Pipeline"
        description={mode === "remote"
          ? "This machine submits; the cloud builds, deploys, and publishes."
          : "This machine runs build → preview (the build boundary). Ship hands off to the cloud."}
        actions={
          <Button variant="ghost" size="sm" onClick={() => { location.hash = "#/pipeline"; }}>
            Open Pipeline <ArrowRight className="w-4 h-4" />
          </Button>
        }
      >
        <div className="flex items-stretch gap-1 overflow-x-auto">
          {phases.map((phase, index) => (
            <div key={phase.key} className="flex items-stretch gap-1 min-w-0">
              <div className={`flex-1 min-w-[7rem] rounded-lg border px-3 py-2.5 ${
                phase.done ? "border-primary/30 bg-primary/5" : "border-outline-variant/30 bg-surface"
              }`}>
                <div className="flex items-center gap-1.5">
                  <span className={`inline-flex items-center justify-center w-4 h-4 rounded-full text-4xs ${
                    phase.done ? "bg-primary text-white" : "bg-surface-container text-secondary"
                  }`}>
                    {phase.done ? <Check className="w-2.5 h-2.5" /> : index + 1}
                  </span>
                  <span className="text-xs font-semibold text-on-surface">{phase.label}</span>
                  {phase.count != null && (
                    <span className="ml-auto text-xs font-semibold text-primary">{phase.count}</span>
                  )}
                </div>
                <p className="text-3xs text-secondary mt-1 leading-tight">{phase.hint}</p>
                {phase.boundary && (
                  <p className="text-4xs font-medium uppercase tracking-wide text-status-warning-ink mt-1">build boundary</p>
                )}
              </div>
              {index < phases.length - 1 && (
                <div className="flex items-center text-outline-variant/50">
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </Section>

      {/* Next step. */}
      <div className="editorial-micro-card rounded-lg p-5 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">Next step</div>
            <h2 className="text-lg font-semibold text-on-surface">
              {blockedMission ? "Resume the blocked run" : activeMission ? "Watch the active run" : allPlanesReady ? "Run a local preview" : "Prepare the missing services"}
            </h2>
            <p className="text-sm text-secondary mt-1 max-w-2xl">
              {blockedMission?.resumePlan?.reason || activeMission?.resumePlan?.reason || status?.clientDoes || status?.next || "Choose a path below."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {blockedMission ? (
              <Button variant="primary" size="md" onClick={() => handleResumeMission(blockedMission)} disabled={busyPreview}>Resume Run</Button>
            ) : activeMission ? (
              <Button variant="primary" size="md" onClick={() => { location.hash = "#/activity"; }}>Open Runs</Button>
            ) : allPlanesReady ? (
              <Button variant="primary" size="md" onClick={handleStartMission} disabled={busyPreview}>Start Preview</Button>
            ) : (
              <Button variant="primary" size="md" onClick={handleNextStep}>{status?.next || "Run Readiness"}</Button>
            )}
            <Button variant="outline" size="md" onClick={() => { location.hash = "#/doctor"; }}>Readiness</Button>
          </div>
        </div>
        {latestMission && (
          <div className="mt-4 pt-4 border-t border-outline/10 flex flex-wrap items-center gap-3 text-xs text-secondary">
            <span className="font-medium text-on-surface">{latestMission.id}</span>
            <StatusChip status={latestMission.status} />
            <span>{latestMission.resumePlan?.nextAction || latestMission.nextAction || "no next step"}</span>
          </div>
        )}
      </div>

      {/* Pipeline vs Fleet — two distinct surfaces, made explicit. */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <button onClick={() => { location.hash = "#/pipeline"; }} className="editorial-micro-card rounded-lg p-5 text-left hover:bg-surface-container-low transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <GitBranch className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-on-surface">Pipeline</h2>
            <ArrowRight className="w-4 h-4 text-secondary ml-auto" />
          </div>
          <p className="text-xs text-secondary">The build &amp; deploy <span className="font-medium text-on-surface">flow</span> — take one spec (or a batch) from interview through build, ship, and deploy. Start and resume runs here.</p>
        </button>
        <button onClick={() => { location.hash = "#/fleet"; }} className="editorial-micro-card rounded-lg p-5 text-left hover:bg-surface-container-low transition-colors">
          <div className="flex items-center gap-2 mb-2">
            <Boxes className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-semibold text-on-surface">Fleet</h2>
            <ArrowRight className="w-4 h-4 text-secondary ml-auto" />
          </div>
          <p className="text-xs text-secondary">Your <span className="font-medium text-on-surface">agents</span> — the persistent roster across every spec, with health, blockers, and per-agent build / regenerate / ship actions.</p>
          <div className="flex flex-wrap gap-3 mt-3 text-xs text-secondary">
            <span><span className="font-semibold text-on-surface">{totalDeployed}</span> deployed</span>
            <span><span className="font-semibold text-on-surface">{totalSubmitted}</span> submitted</span>
            {totalFailed > 0 && <span className="text-status-failed-ink"><span className="font-semibold">{totalFailed}</span> failed</span>}
          </div>
        </button>
      </div>

      {/* Remote readiness — the platform must be deployed from local before remote runs. */}
      <Section
        className="mb-8"
        title="Platform planes"
        description={mode === "remote"
          ? "Remote builds need the platform deployed from this machine first — the factory gateway, the tool plane (per-department MCP), and data stores. A remote build is blocked until the selected agents' tool plane is deployed."
          : "Optional for local preview. Required before you ship or switch to remote: stand these up from this machine."}
        actions={<span className="text-xs text-secondary">{readyPlanes}/{planes.length || 3} ready</span>}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {planes.map((p) => {
            const key = planeKey(p.name);
            return (
              <PlaneCard
                key={p.name}
                name={p.name}
                up={p.up}
                detail={p.detail}
                onCheckReadiness={() => { location.hash = "#/doctor"; }}
                onStandUp={() => handleStandUp(p.name, key)}
                busy={busyPlanes.has(key)}
                // Registry-derived CLI chip: the id each Stand Up POSTs to
                // (data.up / mcp.deploy / up), never a hardcoded string.
                cliCommandId={key === "data" ? "data.up" : key === "mcp" ? "mcp.deploy" : "up"}
              />
            );
          })}
        </div>
        {mode === "remote" && !toolPlaneReady && (
          <div className="mt-4 flex flex-wrap items-center gap-2 rounded border border-status-warning/20 bg-status-warning/5 px-3 py-2 text-xs text-status-warning-ink">
            <span>Tool plane not deployed — remote agents will have no tools. Fix from local:</span>
            <CommandChip command="ge mcp deploy" />
          </div>
        )}
      </Section>

      {/* Reconcile drift — desired manifest vs actual (ge apply). */}
      {reconcile && (
        <div className="editorial-micro-card rounded-lg p-5 mb-8">
          <div className="flex items-center justify-between mb-1">
            <h2 className="text-sm font-semibold text-on-surface">Reconcile</h2>
            <span className="text-xs text-secondary">manifest: {reconcile.source || "default"}</span>
          </div>
          {reconcile.inSync ? (
            <p className="text-xs text-secondary inline-flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-status-passed-ink" /> In sync with the desired manifest — nothing to reconcile.
            </p>
          ) : (
            <>
              <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-secondary">
                <span>{reconcile.steps.length} step{reconcile.steps.length === 1 ? "" : "s"} to reach desired state. Run</span>
                <CommandChip command="ge apply --yes" />
                <span>to execute in order.</span>
              </div>
              <div className="space-y-1.5">
                {reconcile.steps.map((step) => (
                  <div key={step.id} className="flex items-start gap-2 rounded border border-outline-variant/30 bg-surface px-3 py-2">
                    <span className="rounded px-1.5 py-0.5 text-4xs font-semibold uppercase tracking-wide bg-on-surface/[0.05] text-secondary">{step.kind}</span>
                    <div className="min-w-0">
                      <CommandChip command={step.command} />
                      <div className="mt-1 text-3xs text-secondary">{step.reason}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {total > 0 ? (
        <div className="editorial-micro-card rounded-lg p-5 mb-6">
          <h2 className="text-sm font-semibold text-on-surface mb-3">Agent Progress</h2>
          <div className="mb-3">
            <div className="flex items-baseline gap-2 mb-2">
              <span className="font-headline text-2xl font-bold tabular-nums text-on-surface">
                {totalDeployed + totalSubmitted}
              </span>
              <span className="text-sm text-secondary tabular-nums">/ {total}</span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs">
            {totalDeployed > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-status-passed" />
                <span className="text-secondary">Deployed: {totalDeployed}</span>
              </div>
            )}
            {totalSubmitted > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-primary" />
                <span className="text-secondary">Submitted: {totalSubmitted}</span>
              </div>
            )}
            {totalFailed > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-status-failed" />
                <span className="text-secondary">Failed: {totalFailed}</span>
              </div>
            )}
            {totalNone > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-status-queued" />
                <span className="text-secondary">None: {totalNone}</span>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <Section title="Recently Touched Agents">
        {recentAgents.length > 0 ? (
          <div className="space-y-2">
            {recentAgents.map((agent) => (
              <a
                key={agent.id}
                href={`#/agent/${agent.id}`}
                className="flex items-center justify-between p-2 hover:bg-surface-container rounded-md transition-colors"
              >
                <span className="text-xs font-medium text-on-surface">{agent.id}</span>
                <StatusChip status={agent.healthStatus || agent.status} />
              </a>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={User}
            title="No agents have been deployed or submitted yet."
            action={<ButtonLink variant="ghost" size="sm" href="#/fleet">View all agents</ButtonLink>}
          />
        )}
      </Section>
    </div>
  );
}
