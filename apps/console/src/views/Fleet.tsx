import { useState, useEffect, useMemo } from "react";
import { ge, startJob, type StatusBoard, type Fleet as FleetData } from "../services/geClient";
import { FleetTable } from "../components/FleetTable";
import { ErrorBanner } from "../components/ErrorBanner";
import { useUrlParam } from "../lib/useUrlState";
import { useToast } from "../lib/toast";

interface FleetProps {
  status: StatusBoard | null;
  refresh: () => Promise<void>;
}

export default function Fleet({ status, refresh }: FleetProps) {
  const [fleet, setFleet] = useState<FleetData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Filters live in the hash query so a filtered fleet is shareable + reload-safe.
  const [searchText, setSearchText] = useUrlParam("q", "");
  const [filterDept, setFilterDept] = useUrlParam("dept", "all");
  const [filterStatus, setFilterStatus] = useUrlParam("status", "all");
  const [filterStage, setFilterStage] = useUrlParam("stage", "all");

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [busyAction, setBusyAction] = useState<"build" | "ship" | "sync" | "repair" | "regenerate" | null>(null);
  const notify = useToast();
  const [syncRemote, setSyncRemote] = useState(() => window.localStorage.getItem("ge.sync.remote") || "");
  const [syncPush, setSyncPush] = useState(() => window.localStorage.getItem("ge.sync.push") !== "false");

  const fetchFleet = async () => {
    try {
      const f = await ge.fleet();
      setFleet(f);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch fleet");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFleet();
  }, []);

  // Don't go stale: re-fetch on a calm off-:00 interval and whenever a followed
  // job completes (JobToast broadcasts ge:job:done). Cancelled on unmount.
  useEffect(() => {
    const interval = window.setInterval(() => { void fetchFleet(); }, 5300);
    const onJobDone = () => { void fetchFleet(); };
    window.addEventListener("ge:job:done", onJobDone);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("ge:job:done", onJobDone);
    };
  }, []);

  const departments = useMemo(() => {
    if (!fleet) return [];
    return ["all", ...Object.keys(fleet.byDept).sort()];
  }, [fleet]);

  const statuses = useMemo(() => {
    if (!fleet) return [];
    return ["all", ...Object.keys(fleet.health?.byHealth || fleet.byStatus).sort()];
  }, [fleet]);

  const stages = useMemo(() => ["all", ...(fleet?.health?.stages || [])], [fleet]);

  const filteredAgents = useMemo(() => {
    if (!fleet) return [];
    let agents = fleet.agents;

    if (searchText) {
      const search = searchText.toLowerCase();
      agents = agents.filter(
        (a) =>
          a.id.toLowerCase().includes(search) ||
          a.title.toLowerCase().includes(search)
      );
    }

    if (filterDept !== "all") {
      agents = agents.filter((a) => a.department === filterDept);
    }

    if (filterStatus !== "all") {
      agents = agents.filter((a) => (a.healthStatus || a.status) === filterStatus);
    }

    if (filterStage !== "all") {
      agents = agents.filter((a) => (a.stage || "spec") === filterStage);
    }

    return agents;
  }, [fleet, searchText, filterDept, filterStatus, filterStage]);

  const allSelected = filteredAgents.length > 0 && filteredAgents.every((a) => selected.has(a.id));

  const handleToggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const handleToggleAll = (checked: boolean) => {
    if (checked) {
      setSelected(new Set(filteredAgents.map((a) => a.id)));
    } else {
      setSelected(new Set());
    }
  };

  const handleRowClick = (id: string) => {
    location.hash = `#/agent/${id}`;
  };

  // A duration arg historically meant the error/failure variant; map it to tone.
  const showToast = (message: string, duration?: number) => notify(message, duration ? "error" : "success");

  const handleBuild = async () => {
    if (selected.size === 0) return;
    setBusyAction("build");
    try {
      const ids = Array.from(selected).join(",");
      await startJob(`ge agents build (${selected.size})`, ge.build({ ids, local: status?.mode === "remote" ? false : true }));
      showToast(`Build started for ${selected.size} agent(s)`);
      setSelected(new Set());
      await fetchFleet();
    } catch (err: any) {
      showToast(`Build failed: ${err.message}`, 5000);
    } finally {
      setBusyAction(null);
    }
  };

  const handleRegenerate = async () => {
    if (selected.size === 0) return;
    const ok = window.confirm(
      `Regenerate ${selected.size} agent(s)? This wipes each workspace and rebuilds it from scratch — ` +
      `unlike Build, which resumes and skips completed stages. Existing generated artifacts are overwritten.`,
    );
    if (!ok) return;
    setBusyAction("regenerate");
    try {
      const ids = Array.from(selected).join(",");
      await startJob(`ge agents build --force (${selected.size})`, ge.build({ ids, local: status?.mode === "remote" ? false : true, force: true }));
      showToast(`Regenerate started for ${selected.size} agent(s)`);
      setSelected(new Set());
      await fetchFleet();
    } catch (err: any) {
      showToast(`Regenerate failed: ${err.message}`, 5000);
    } finally {
      setBusyAction(null);
    }
  };

  const handleShip = async () => {
    if (selected.size === 0) return;
    setBusyAction("ship");
    try {
      const selectedAgents = (fleet?.agents || []).filter((agent) => selected.has(agent.id));
      const ids = selectedAgents
        .map((agent) => agent.actionPlan?.workspaceIds?.[0] || agent.workspaceId || agent.id)
        .join(",");
      await startJob(`ge agents ship (${selected.size})`, ge.ship({ ids }));
      showToast(`Ship started for ${selected.size} agent(s)`);
      setSelected(new Set());
      await fetchFleet();
    } catch (err: any) {
      showToast(`Ship failed: ${err.message}`, 5000);
    } finally {
      setBusyAction(null);
    }
  };

  const handleSync = async () => {
    if (selected.size === 0) return;
    if (syncPush) {
      const target = syncRemote.trim() || "the configured git remote";
      const ok = window.confirm(`Push generated code for ${selected.size} agent(s) to ${target}? This writes to the git repository.`);
      if (!ok) return;
    }
    setBusyAction("sync");
    try {
      const ids = Array.from(selected.values()) as string[];
      const remote = syncRemote.trim();
      window.localStorage.setItem("ge.sync.remote", remote);
      window.localStorage.setItem("ge.sync.push", String(syncPush));
      await startJob(`Sync code (${selected.size})`, ge.sync({
        ids,
        push: syncPush,
        local: true,
        remote: remote || undefined,
      }));
      showToast(`Sync started for ${selected.size} agent(s)`);
      setSelected(new Set());
      await fetchFleet();
    } catch (err: any) {
      showToast(`Sync failed: ${err.message}`, 5000);
    } finally {
      setBusyAction(null);
    }
  };

  const handleFixBlockers = async () => {
    if (selected.size === 0) return;
    setBusyAction("repair");
    try {
      const ids = Array.from(selected.values()) as string[];
      const selectedAgents = (fleet?.agents || []).filter((agent) => ids.includes(agent.id));
      const buildIds = selectedAgents
        .filter((agent) => agent.actionPlan?.kind === "build_agents")
        .map((agent) => agent.id);
      const repairIds = selectedAgents
        .filter((agent) => agent.actionPlan?.kind === "repair_agent")
        .map((agent) => agent.id);
      const resumeTaskIds: string[] = [];
      for (const agent of selectedAgents) {
        const kind = agent.actionPlan?.kind;
        const taskId = agent.actionPlan?.taskId;
        if ((kind === "resume_mission" || kind === "resume_autopilot") && typeof taskId === "string" && !resumeTaskIds.includes(taskId)) {
          resumeTaskIds.push(taskId);
        }
      }

      const actions: string[] = [];
      let focusTaskId = "";
      if (buildIds.length) {
        await startJob(`ge agents build (${buildIds.length})`, ge.build({ ids: buildIds.join(","), local: status?.mode === "remote" ? false : true }));
        actions.push(`build ${buildIds.length}`);
      }
      for (const taskId of resumeTaskIds) {
        await ge.runtimeResume(taskId);
        if (!focusTaskId) focusTaskId = taskId;
        actions.push(`resume ${taskId}`);
      }
      if (repairIds.length) {
        // Route through the canonical autopilot path (not raw runtimeStart) so the run is
        // recorded in autopilot_runs and shows up in the Repair Queue — otherwise daemon
        // autopilot.run tasks were invisible there (data-integrity gap).
        const started = await ge.startAutopilot({
          ids: repairIds,
          targetStage: "preview",
          repair: true,
          attempts: 3,
          runPreview: true,
        });
        if (started.runId) focusTaskId = started.runId;
        actions.push(`repair ${repairIds.length}${started.runId ? ` (${started.runId})` : ""}`);
      }

      if (actions.length === 0) {
        showToast("Selected items need user input or have no runnable action.", 5000);
      } else {
        showToast(`Started: ${actions.join(", ")}`, 5000);
      }
      setSelected(new Set());
      await fetchFleet();
      location.hash = focusTaskId ? `#/activity?task=${encodeURIComponent(focusTaskId)}` : "#/activity";
    } catch (err: any) {
      showToast(`Repair failed: ${err.message}`, 6000);
    } finally {
      setBusyAction(null);
    }
  };

  const statusCounts = fleet?.byStatus ?? {};
  const totalCount = fleet?.total ?? 0;
  const health = fleet?.health;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <h1 className="text-2xl font-bold text-on-surface">Fleet</h1>
          <button
            onClick={fetchFleet}
            disabled={loading}
            className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors rounded-lg disabled:opacity-50"
          >
            {loading ? "Loading..." : "Refresh"}
          </button>
        </div>
        <p className="text-sm text-secondary mb-2">
          The persistent roster of every agent. To take a spec through the build &amp; deploy flow, use the <a href="#/journey" className="text-primary hover:underline">Pipeline</a>.
        </p>

        <div className="flex items-center gap-4 text-sm">
          <span className="text-secondary">
            Total: <span className="font-semibold text-on-surface">{totalCount}</span>
          </span>
          {Object.entries(health?.byHealth || statusCounts).slice(0, 4).map(([status, count]) => (
            <span key={status} className="text-secondary">
              {status}: <span className="font-semibold text-on-surface">{count}</span>
            </span>
          ))}
        </div>
      </div>

      {error && <ErrorBanner label="Failed to load fleet:" message={error} onRetry={fetchFleet} />}

      {health && (
        <div className="mb-6 grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.8fr)]">
          <div className="editorial-micro-card rounded-lg p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-on-surface">Agents by stage</h2>
              <span className="text-xs text-secondary">{health.blocked} blocked · {health.repairable} repairable</span>
            </div>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-7">
              {health.stages.map((stage) => (
                <button
                  key={stage}
                  onClick={() => setFilterStage(filterStage === stage ? "all" : stage)}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    filterStage === stage
                      ? "border-primary/40 bg-primary/10"
                      : "border-outline-variant/40 bg-surface-container/40 hover:bg-surface-container"
                  }`}
                >
                  <div className="text-[11px] font-medium uppercase text-secondary">{stage}</div>
                  <div className="mt-1 text-xl font-semibold text-on-surface">{health.byStage[stage] || 0}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="editorial-micro-card rounded-lg p-4">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-on-surface">Repair Owners</h2>
              <span className="text-xs text-secondary">who can move it</span>
            </div>
            <div className="space-y-2">
              {(Object.entries(health.byOwner) as Array<[string, number]>).sort((a, b) => b[1] - a[1]).map(([owner, count]) => (
                <div key={owner} className="flex items-center justify-between rounded-md bg-surface-container/50 px-3 py-2 text-sm">
                  <span className="text-secondary">{owner}</span>
                  <span className="font-semibold text-on-surface">{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {health?.bottlenecks?.length ? (
        <div className="mb-6 editorial-micro-card rounded-lg p-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-on-surface">Top Bottlenecks</h2>
            <button
              onClick={() => setFilterStatus("blocked")}
              className="text-xs font-medium text-primary hover:bg-primary/10 rounded-md px-2 py-1"
            >
              Show blocked
            </button>
          </div>
          <div className="grid gap-2 md:grid-cols-2 xl:grid-cols-3">
            {health.bottlenecks.slice(0, 6).map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setFilterStage(item.stage);
                  setFilterStatus("blocked");
                }}
                className="rounded-md border border-outline-variant/40 bg-surface-container/40 p-3 text-left hover:bg-surface-container"
              >
                <div className="mb-1 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-700">{item.stage}</span>
                  <span className="text-xs font-semibold text-on-surface">{item.count}</span>
                </div>
                <div className="truncate font-mono text-[11px] text-secondary">{item.blockerId}</div>
                <div className="mt-1 line-clamp-2 text-xs text-secondary">{item.message}</div>
                <div className="mt-2 text-[11px] text-secondary">
                  owner: {item.owner} · {item.actionPlan?.label || "Inspect"}
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="editorial-micro-card rounded-lg p-4 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search agents..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-surface border border-outline-variant/30 rounded-lg focus:outline-none focus:border-primary/40 transition-colors"
            />
          </div>

          <div>
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="px-3 py-2 text-sm bg-surface border border-outline-variant/30 rounded-lg focus:outline-none focus:border-primary/40 transition-colors cursor-pointer"
            >
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept === "all" ? "All Departments" : dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 text-sm bg-surface border border-outline-variant/30 rounded-lg focus:outline-none focus:border-primary/40 transition-colors cursor-pointer"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status === "all" ? "All Health" : status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <select
              value={filterStage}
              onChange={(e) => setFilterStage(e.target.value)}
              className="px-3 py-2 text-sm bg-surface border border-outline-variant/30 rounded-lg focus:outline-none focus:border-primary/40 transition-colors cursor-pointer"
            >
              {stages.map((stage) => (
                <option key={stage} value={stage}>
                  {stage === "all" ? "All Stages" : stage}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {selected.size > 0 && (
        <div className="mb-4 rounded-lg border border-primary/20 bg-primary/5 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm font-medium text-on-surface">
              {selected.size} selected
            </span>
            <div className="flex flex-wrap gap-2">
            <button
              onClick={handleFixBlockers}
              disabled={busyAction !== null}
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-container transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {busyAction === "repair" && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {busyAction === "repair" ? "Repairing..." : "Fix Blockers"}
            </button>
            <button
              onClick={handleBuild}
              disabled={busyAction !== null}
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-container transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {busyAction === "build" && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {busyAction === "build" ? "Building..." : "Build"}
            </button>
            <button
              onClick={handleRegenerate}
              disabled={busyAction !== null}
              title="Wipe the workspace and rebuild from scratch (overwrites artifacts)"
              className="px-4 py-2 text-sm font-medium text-on-surface border border-outline/30 hover:bg-surface-container transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {busyAction === "regenerate" && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {busyAction === "regenerate" ? "Regenerating..." : "Regenerate"}
            </button>
            <button
              onClick={handleShip}
              disabled={busyAction !== null}
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-container transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {busyAction === "ship" && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {busyAction === "ship" ? "Shipping..." : "Ship"}
            </button>
            <button
              onClick={handleSync}
              disabled={busyAction !== null}
              className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-container transition-colors rounded-lg disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
            >
              {busyAction === "sync" && (
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              )}
              {busyAction === "sync" ? "Syncing..." : "Sync code"}
            </button>
            </div>
          </div>
          <div className="mt-3 grid gap-3 border-t border-primary/15 pt-3 md:grid-cols-[minmax(240px,1fr)_auto] md:items-end">
            <label className="grid gap-1 text-xs font-medium text-secondary">
              Destination git repo
              <input
                type="text"
                value={syncRemote}
                onChange={(event) => setSyncRemote(event.target.value)}
                placeholder="blank writes generated-agents/ in this repo; paste a git remote to sync elsewhere"
                className="w-full rounded-md border border-outline-variant/40 bg-surface px-3 py-2 text-sm font-normal text-on-surface focus:border-primary/50 focus:outline-none"
              />
            </label>
            <label className="inline-flex items-center gap-2 rounded-md border border-outline-variant/40 bg-surface px-3 py-2 text-sm font-medium text-on-surface">
              <input
                type="checkbox"
                checked={syncPush}
                onChange={(event) => setSyncPush(event.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Push after commit
            </label>
          </div>
        </div>
      )}

      <FleetTable
        agents={filteredAgents}
        selected={selected}
        onToggle={handleToggle}
        onToggleAll={handleToggleAll}
        allSelected={allSelected}
        onRowClick={handleRowClick}
        totalCount={fleet?.agents.length ?? totalCount}
        loading={loading}
        hasFilters={searchText !== "" || filterDept !== "all" || filterStatus !== "all" || filterStage !== "all"}
        onClearFilters={() => {
          setSearchText("");
          setFilterDept("all");
          setFilterStatus("all");
          setFilterStage("all");
        }}
      />
    </div>
  );
}
