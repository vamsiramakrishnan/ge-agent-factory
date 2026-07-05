import { useEffect, useMemo, useState } from "react";
import { Loader2, Play, RotateCw, Wrench } from "lucide-react";
import { Button, EmptyState, PageHeader, Section, Select, Stat } from "@ge/ui";
import { useGeQuery } from "../lib/query";
import { ge, type RepairDetail, type RepairRun, type Fleet, type FleetAgent, type FactoryRepairPipeline, type StatusBoard } from "../services/geClient";
import { StatusPill } from "../components/StatusPill";
import { ErrorBanner } from "../components/ErrorBanner";

interface RepairQueueProps {
  status: StatusBoard | null;
  refresh: () => Promise<void>;
}

const TARGETS = ["preview", "promote", "deploy:plan", "publish:plan"];

export default function RepairQueue({ status }: RepairQueueProps) {
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);
  const [pipeline, setPipeline] = useState<FactoryRepairPipeline | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [department, setDepartment] = useState("all");
  const [agentStatus, setAgentStatus] = useState("all");
  const [targetStage, setTargetStage] = useState("preview");
  const [repair, setRepair] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Shared query layer: fleet dedupes with Overview/Fleet; the run detail
  // fast-polls (2s) ONLY while the followed run is live — same semantics as
  // the old conditional setInterval, expressed as query options.
  const fleetQuery = useGeQuery<Fleet>(["fleet"], () => ge.fleet(), { intervalMs: 8000 });
  const runsQuery = useGeQuery(["repairs", 20], () => ge.repairRuns(20), { intervalMs: 8000 });
  const fleet = fleetQuery.data ?? null;
  const runs = runsQuery.data?.runs ?? [];
  const detailId = selectedRunId ?? runs[0]?.id ?? null;
  const detailQuery = useGeQuery<RepairDetail | null>(
    ["repair-detail", detailId],
    () => (detailId ? ge.repairRun(detailId) : Promise.resolve(null)),
    {
      enabled: !!detailId,
      // Fast-poll only while the followed run is live; terminal runs settle
      // to no polling (the global job-done invalidation still refreshes them).
      intervalMs: (data) => (data && ["running", "paused"].includes(data.run.status) ? 2000 : false),
    },
  );
  const detail = detailQuery.data ?? null;
  const queryError = (fleetQuery.error || runsQuery.error) as Error | null;
  const loadError = error ?? (queryError ? queryError.message || String(queryError) : null);
  const load = async () => {
    setError(null);
    await Promise.all([fleetQuery.refetch(), runsQuery.refetch(), detailQuery.refetch()]);
  };

  const agents = useMemo(() => {
    let list = fleet?.agents || [];
    if (department !== "all") list = list.filter((agent) => agent.department === department);
    if (agentStatus !== "all") list = list.filter((agent) => agent.status === agentStatus);
    return list.slice(0, 250);
  }, [fleet, department, agentStatus]);

  const departments = ["all", ...Object.keys(fleet?.byDept || {}).sort()];
  const statuses = ["all", ...Object.keys(fleet?.byStatus || {}).sort()];

  const selectedIds = Array.from(selected);

  const queueIds = useMemo(
    () => selectedIds.length ? selectedIds : agents.map((agent) => agent.id),
    [agents, selectedIds],
  );
  const actionableRepairItems = useMemo(
    () => pipeline?.roster.filter((item) => ["doctor_repair", "observe_remote_run"].includes(item.repairAction)) || [],
    [pipeline],
  );
  const noActionableRepair = Boolean(pipeline && queueIds.length > 0 && actionableRepairItems.length === 0);

  useEffect(() => {
    if (!queueIds.length) {
      setPipeline(null);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      try {
        const plan = await ge.pipelineGraphPlan({ ids: queueIds, targetStage, repair, attempts: 3, runPreview: false });
        if (!cancelled) setPipeline(plan);
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      }
    }, 250);
    return () => { cancelled = true; clearTimeout(timer); };
  }, [queueIds.join(","), targetStage, repair]);

  const start = async () => {
    if (noActionableRepair) {
      setError("No selected agents need repair for this target. Missing workspaces need a build first; completed workspaces have nothing to fix.");
      return;
    }
    // Confirmation guard for bulk repair fallback (no explicit selection)
    if (selectedIds.length === 0 && queueIds.length > 0) {
      const ok = window.confirm(`Repair ${queueIds.length} agents? This starts ${queueIds.length} repair runs.`);
      if (!ok) return;
    }
    setBusy(true);
    try {
      const started = await ge.startRepair({ ids: queueIds, targetStage, repair, attempts: 3, runPreview: false });
      if (started.reason) setError(started.reason);
      else setError(null);
      if (started.runId) setSelectedRunId(started.runId);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const resume = async (run: RepairRun) => {
    setBusy(true);
    try {
      await ge.resumeRepair(run.id);
      setSelectedRunId(run.id);
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  };

  const toggle = (agent: FleetAgent) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(agent.id)) next.delete(agent.id);
      else next.add(agent.id);
      return next;
    });
  };

  const selectVisible = () => setSelected(new Set(agents.map((agent) => agent.id)));

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <PageHeader
        title={
          <span className="flex items-center gap-2">
            <Wrench className="w-5 h-5 text-primary" />
            Repair Queue
          </span>
        }
        subtitle="Pick agents, check the next gate, and resume only the work that needs attention."
        actions={
          <Button variant="ghost" size="sm" onClick={load} disabled={busy}>
            <RotateCw className="w-4 h-4" />
            Refresh
          </Button>
        }
      />

      {loadError && <ErrorBanner tone="amber" message={loadError} onRetry={load} />}

      <div className="grid grid-cols-1 xl:grid-cols-[420px_1fr] gap-6">
        <Section title="Choose work to fix">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <Select value={department} onChange={(e) => setDepartment(e.target.value)}>
              {departments.map((item) => <option key={item} value={item}>{item === "all" ? "All departments" : item}</option>)}
            </Select>
            <Select value={agentStatus} onChange={(e) => setAgentStatus(e.target.value)}>
              {statuses.map((item) => <option key={item} value={item}>{item === "all" ? "All statuses" : item}</option>)}
            </Select>
          </div>
          <details className="mb-4">
            <summary className="cursor-pointer text-xs font-medium text-secondary">
              Configure repair (target: {targetStage}{repair ? ", repair on" : ", observe only"})
            </summary>
            <div className="mt-2 grid grid-cols-2 gap-3">
              <Select value={targetStage} onChange={(e) => setTargetStage(e.target.value)}>
                {TARGETS.map((item) => <option key={item} value={item}>{item}</option>)}
              </Select>
              <label className="px-3 py-2 text-sm bg-surface border border-outline-variant/30 rounded-lg inline-flex items-center gap-2">
                <input type="checkbox" checked={repair} onChange={(e) => setRepair(e.target.checked)} className="accent-primary" />
                Auto-fix
              </label>
            </div>
          </details>
          <div className="flex items-center justify-between mb-3">
            <button onClick={selectVisible} className="text-xs text-primary hover:underline">Select visible</button>
            <span className="text-xs text-secondary">{selected.size || agents.length} queued</span>
          </div>
          {noActionableRepair && (
            <div className="mb-3 rounded-lg border border-status-warning/20 bg-status-warning/5 px-3 py-2 text-xs text-status-warning-ink">
              No selected agents need repair for this target. Missing workspaces need a build first; already-ready workspaces have nothing to fix.
            </div>
          )}
          <div className="max-h-96 overflow-auto border border-outline-variant/30 rounded-lg">
            {agents.map((agent) => (
              <label key={agent.id} className="flex items-center gap-3 px-3 py-2 border-b border-outline-variant/20 last:border-b-0 cursor-pointer hover:bg-surface-container-low">
                <input type="checkbox" checked={selected.has(agent.id)} onChange={() => toggle(agent)} className="accent-primary" />
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-on-surface truncate">{agent.title}</div>
                  <div className="text-xs text-secondary font-mono">{agent.workspaceId || agent.id}</div>
                </div>
                <StatusPill status={agent.status} />
              </label>
            ))}
          </div>
          <Button
            variant="primary"
            className="mt-4 w-full"
            onClick={start}
            disabled={busy || agents.length === 0 || noActionableRepair}
            loading={busy}
          >
            {!busy && <Play className="w-4 h-4" />}
            Start Repair Run
          </Button>
        </Section>

        <section className="space-y-4">
          {pipeline && (
            <Section
              title="Run Plan"
              actions={<span className="text-xs text-secondary">{pipeline.mode} · gate {pipeline.target.workspaceGate}</span>}
            >
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <Stat size="md" label="Selected" value={pipeline.summary.selected} />
                <Stat size="md" label="Needs build" value={pipeline.summary.factory} />
                <Stat size="md" label="Can fix" value={pipeline.summary.repair} />
                <Stat size="md" label={pipeline.mode === "remote" ? "Observe" : "Missing"} value={pipeline.mode === "remote" ? pipeline.summary.remoteObserve : pipeline.summary.missingWorkspaces} />
              </div>
              <div className="mb-4 border border-outline-variant/30 rounded-lg p-3 bg-surface">
                <div className="text-xs font-semibold uppercase tracking-wide text-secondary">Where work will run</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mt-2 text-xs text-secondary">
                  <div><span className="text-on-surface">Build:</span> {pipeline.modeContract.factorySurface.replaceAll("_", " ")}</div>
                  <div><span className="text-on-surface">Artifacts:</span> {pipeline.modeContract.artifactSource.replaceAll("_", " ")}</div>
                  <div><span className="text-on-surface">Repair:</span> {pipeline.modeContract.repairCapability.replaceAll("_", " ")}</div>
                </div>
                <div className="mt-2 text-xs text-secondary">{pipeline.modeContract.constraints[0]}</div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {pipeline.phases.map((phase) => (
                  <div key={phase.id} className="border border-outline-variant/30 rounded-lg p-3 bg-surface">
                    <div className="text-xs font-semibold uppercase tracking-wide text-secondary">{phase.owner}</div>
                    <div className="text-sm text-on-surface mt-1">{phase.id}</div>
                    <div className="text-xs text-secondary mt-1">{phase.action.replaceAll("_", " ")}</div>
                    {phase.command?.commandId && <div className="text-xs font-mono text-primary mt-2">{phase.command.commandId}</div>}
                  </div>
                ))}
              </div>
              <p className="text-xs text-secondary mt-3">
                Builds create missing workspaces. Repair runs only inspect, fix, or observe work that already exists.
              </p>
            </Section>
          )}

          <Section
            title="Repair Runs"
            actions={<span className="text-xs text-secondary">{status?.mode || "local"} mode</span>}
          >
            <div className="flex flex-wrap gap-2">
              {runs.map((run) => (
                <button
                  key={run.id}
                  onClick={() => setSelectedRunId(run.id)}
                  className={`px-3 py-2 rounded-lg text-left border text-xs ${detail?.run.id === run.id ? "border-primary bg-primary/5" : "border-outline-variant/30 hover:bg-surface-container-low"}`}
                >
                  <div className="font-mono text-on-surface">{run.id}</div>
                  <div className="text-secondary">
                    {run.targetStage} · {run.status} · {run.total === 0 ? "no actionable items" : `${run.passed + run.repaired}/${run.total}`}
                  </div>
                </button>
              ))}
              {!runs.length && <EmptyState title="No repair runs yet." className="w-full py-4" />}
            </div>
          </Section>

          {detail && (
            <div className="editorial-micro-card rounded-lg overflow-hidden">
              <div className="p-4 border-b border-outline-variant/30 flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-on-surface">{detail.run.id}</h2>
                  <p className="text-xs text-secondary">
                    {detail.run.targetStage} · {detail.run.status} · {detail.run.total === 0 ? "no actionable items" : `passed ${detail.run.passed} · repaired ${detail.run.repaired} · blocked ${detail.run.blocked}`}
                  </p>
                </div>
                <button
                  onClick={() => resume(detail.run)}
                  disabled={busy || detail.run.status === "running"}
                  className="px-3 py-1.5 text-xs font-medium text-primary border border-primary/30 rounded-lg hover:bg-primary/10 disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  {busy ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RotateCw className="w-3.5 h-3.5" />}
                  Resume
                </button>
              </div>
              <table className="w-full">
                <thead className="bg-surface-container-low border-b border-outline-variant/30">
                  <tr>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary">Agent</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary">Workspace</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary">Status</th>
                    <th className="px-4 py-2 text-left text-xs font-semibold text-secondary">Current blocker</th>
                  </tr>
                </thead>
                <tbody>
                  {detail.items.length === 0 && (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-sm text-secondary">
                        Nothing to repair — the selected agents are already at their target stage.
                      </td>
                    </tr>
                  )}
                  {detail.items.map((item) => (
                    <tr key={item.agentId} className="border-b border-outline-variant/20">
                      <td className="px-4 py-2 text-sm text-on-surface">{item.agentId}</td>
                      <td className="px-4 py-2 text-xs font-mono text-secondary">{item.workspaceId}</td>
                      <td className="px-4 py-2"><StatusPill status={item.status} /></td>
                      <td className="px-4 py-2 text-xs text-secondary">
                        {item.blockers?.[0] ? `${item.blockers[0].id}: ${item.blockers[0].message}` : "none"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
