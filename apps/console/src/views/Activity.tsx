import { useEffect, useMemo, useRef, useState } from "react";
import { Button, EmptyState, Segmented } from "@ge/ui";
import { useActivity } from "../hooks/useActivity";
import { useUrlParam } from "../lib/useUrlState";
import { StatusPill } from "../components/StatusPill";
import { ErrorBanner } from "../components/ErrorBanner";
import { StatusChip, normalizeStatus, type RunStatus } from "../lib/runStatus";
import { useRunFollow } from "../state/runFollow";
import { useGeQuery } from "../lib/query";
import {
  ge,
  streamJob,
  streamRuntimeEvents,
  streamLedgerRun,
  type FactoryRunResult,
  type FactoryRunSummary,
  type GeEvent,
  type GeJob,
  type LedgerEvent,
  type MissionArtifactRef,
  type MissionRuntimeGraph,
  type MissionRuntimeNode,
  type RuntimeTaskSummary,
} from "../services/geClient";

// One chronological timeline over three run sources. Each row is normalized into
// a TimelineRow so the list can be sorted, filtered, and rendered uniformly — the
// `kind` tag (Mission / Build / Job) is the only visible cue to its origin, and a
// normalized status drives the single status filter + StatusChip.
type RowKind = "mission" | "build" | "job";

interface TimelineRow {
  id: string;
  kind: RowKind;
  rawStatus: string;
  status: RunStatus;
  updatedAt: string;
  sortTime: number;
  title: string;
  summary: string;
  haystack: string;
  followKind: string;
  followSource?: string;
  // Source records kept around for the expandable detail panels + actions.
  task?: RuntimeTaskSummary;
  run?: FactoryRunSummary;
  job?: GeJob;
}

// Rows from different sources can share an id (a mission and a build can both be
// "abc123"). The list key — and therefore the expand/stream identity — must be
// the composite `${kind}:${id}`, never the bare id, or expanding one row expands
// its id-twin and the live tail subscribes to the wrong source.
export function rowKey(row: { kind: RowKind; id: string }): string {
  return `${row.kind}:${row.id}`;
}

export function findExpandedRow<T extends { kind: RowKind; id: string }>(
  rows: T[],
  expanded: string | null,
): T | null {
  if (!expanded) return null;
  return rows.find((r) => rowKey(r) === expanded) || null;
}

const KIND_LABEL: Record<RowKind, string> = {
  mission: "Mission",
  build: "Build",
  job: "Job",
};

const KIND_FILTERS: Array<[string, string]> = [
  ["all", "All"],
  ["mission", "Missions"],
  ["build", "Builds"],
  ["job", "Jobs"],
];

const STATUS_FILTERS: Array<[string, string]> = [
  ["all", "All"],
  ["active", "Active"],
  ["blocked", "Blocked"],
  ["done", "Done"],
  ["failed", "Failed"],
];

function matchesStatusFilter(status: RunStatus, filter: string): boolean {
  if (filter === "all") return true;
  if (filter === "active") return status === "running" || status === "pending";
  return status === filter;
}

export default function Activity() {
  const { agents, loading, error, refresh } = useActivity(8000);
  // The three run sources come from the shared query layer — one cadence,
  // shared cache, global job-done invalidation (lib/query.ts).
  const jobsQuery = useGeQuery(["jobs", 25], () => ge.jobs(25), { intervalMs: 5000 });
  const factoryQuery = useGeQuery(["factoryRuns", 10], () => ge.factoryRuns(10), { intervalMs: 5000 });
  const runtimeQuery = useGeQuery(["runtimeTasks", 25], () => ge.runtimeTasks(25, true), { intervalMs: 5000 });
  const jobs: GeJob[] = jobsQuery.data?.jobs ?? [];
  const factoryRuns: FactoryRunSummary[] = factoryQuery.data?.runs ?? [];
  const runtimeTasks: RuntimeTaskSummary[] = runtimeQuery.data?.tasks ?? [];
  const listsError = (jobsQuery.error || factoryQuery.error || runtimeQuery.error) as Error | null;
  const listsErrorMessage = listsError ? listsError.message || "Failed to load jobs" : null;
  const loadingLists = jobsQuery.isLoading || factoryQuery.isLoading || runtimeQuery.isLoading;
  const refreshJobs = async () => {
    await Promise.all([jobsQuery.refetch(), factoryQuery.refetch(), runtimeQuery.refetch()]);
  };
  const [actionError, setActionError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [jobLines, setJobLines] = useState<string[]>([]);
  const [runtimeLines, setRuntimeLines] = useState<string[]>([]);
  const [resumingTask, setResumingTask] = useState<string | null>(null);
  const { followRun } = useRunFollow();

  // Filters live in the hash query so a filtered timeline is shareable + reload-safe
  // (matches Fleet's useUrlParam pattern).
  const [search, setSearch] = useUrlParam("q", "");
  const [kindFilter, setKindFilter] = useUrlParam("kind", "all");
  const [statusFilter, setStatusFilter] = useUrlParam("status", "all");

  // Deep-link target: a "Watch run" handoff arrives as #/activity?task=<id>. The
  // drawer is the primary watch path now, so open it via followRun ONCE per task —
  // shared links and "Open full" still focus the run.
  const [focusTask] = useUrlParam("task");
  const followedFocus = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (!focusTask || followedFocus.current.has(focusTask)) return;
    followedFocus.current.add(focusTask);
    followRun(focusTask);
    // Widen filters so the row is also visible in the list behind the drawer.
    setKindFilter("all");
    setStatusFilter("all");
    setSearch("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [focusTask]);

  const handleRefresh = () => {
    refresh();
    refreshJobs();
  };

  const handleResumeTask = async (id: string) => {
    setResumingTask(id);
    try {
      await ge.runtimeResume(id);
      await refreshJobs();
    } catch (err: any) {
      setActionError(err.message || "Failed to resume runtime task");
    } finally {
      setResumingTask(null);
    }
  };

  // Merge the three sources into one normalized, newest-first timeline.
  const unifiedRows = useMemo<TimelineRow[]>(() => {
    const rows: TimelineRow[] = [];

    for (const task of runtimeTasks) {
      const summary = task.resumePlan?.reason
        || (task.counts
          ? `${task.counts.passed} passed · ${task.counts.repaired} repaired · ${task.counts.blocked} blocked · ${task.counts.total} total`
          : summarizeRuntimeTask(task) || task.lastEvent?.line || "");
      rows.push({
        id: task.id,
        kind: "mission",
        rawStatus: String(task.status || ""),
        status: normalizeStatus(task.status),
        updatedAt: task.updatedAt,
        sortTime: toTime(task.updatedAt),
        title: task.kind,
        summary,
        haystack: [
          task.id, task.kind, task.status, task.resumePlan?.reason,
          task.lastEvent?.line, summary, JSON.stringify(task.input || {}),
        ].filter(Boolean).join(" ").toLowerCase(),
        followKind: task.kind,
        followSource: "activity",
        task,
      });
    }

    for (const run of factoryRuns) {
      const summary = summarizeFactoryRun(run);
      rows.push({
        id: run.id,
        kind: "build",
        rawStatus: String(run.status || ""),
        status: normalizeStatus(run.status),
        updatedAt: run.updatedAt,
        sortTime: toTime(run.updatedAt),
        title: `Agent Factory · ${run.targetStage || "local build"}`,
        summary,
        haystack: [
          run.id, run.kind, run.status, run.targetStage, summary,
          `${run.selected} selected`, `${run.failed} failed`,
        ].filter(Boolean).join(" ").toLowerCase(),
        followKind: run.kind || "factory.run",
        followSource: run.targetStage || "build",
        run,
      });
    }

    for (const job of jobs) {
      const title = job.command?.label || `ge ${job.argv.join(" ")}`;
      const summary = job.lastLine || job.command?.summary || "";
      rows.push({
        id: job.id,
        kind: "job",
        rawStatus: String(job.status || ""),
        status: normalizeStatus(job.status),
        updatedAt: job.updatedAt,
        sortTime: toTime(job.updatedAt),
        title,
        summary,
        haystack: [
          job.id, title, `ge ${job.argv.join(" ")}`, job.status, summary,
        ].filter(Boolean).join(" ").toLowerCase(),
        followKind: "ge.command",
        followSource: "job",
        job,
      });
    }

    rows.sort((a, b) => b.sortTime - a.sortTime);
    return rows;
  }, [runtimeTasks, factoryRuns, jobs]);

  // The expanded row owns the live tail. A mission/job streams its own events; a
  // build mounts FactoryRunDetails (its own stream). Reset tails whenever the
  // expanded target changes so we never show a previous row's lines.
  const expandedRow = useMemo(
    () => findExpandedRow(unifiedRows, expanded),
    [unifiedRows, expanded],
  );

  useEffect(() => {
    setJobLines([]);
    setRuntimeLines([]);
    if (!expandedRow) return;
    if (expandedRow.kind === "job") {
      const unsub = streamJob(expandedRow.id, (ev) => {
        if (ev.line) setJobLines((prev) => [...prev, ev.line || ""].slice(-80));
      });
      return unsub;
    }
    if (expandedRow.kind === "mission") {
      const unsub = streamRuntimeEvents(expandedRow.id, (ev) => {
        const line = formatRuntimeEvent(ev);
        if (line) setRuntimeLines((prev) => [...prev, line].slice(-120));
        if (["stage_done", "stage_failed", "task_done", "task_failed", "task_blocked", "mission_node_done", "mission_node_blocked"].includes(ev.type)) {
          refreshJobs();
        }
      });
      return unsub;
    }
    return;
    // `expanded` is the composite `${kind}:${id}` key, so it alone uniquely
    // identifies the expanded row (and its source) — re-subscribe on its change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const filteredRows = useMemo(() => {
    const query = search.trim().toLowerCase();
    return unifiedRows.filter((row) => {
      if (kindFilter !== "all" && row.kind !== kindFilter) return false;
      if (!matchesStatusFilter(row.status, statusFilter)) return false;
      if (query && !row.haystack.includes(query)) return false;
      return true;
    });
  }, [unifiedRows, kindFilter, statusFilter, search]);

  const hasFilters = search !== "" || kindFilter !== "all" || statusFilter !== "all";

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-2">
          <h1 className="text-2xl font-bold text-on-surface">Runs</h1>
          <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={loading && agents.length === 0}>
            Refresh
          </Button>
        </div>
        <p className="text-sm text-secondary">
          One timeline for every run — missions, factory builds, and console jobs, newest first.
        </p>
      </div>

      {error && <ErrorBanner tone="amber" message={error} onRetry={refresh} />}
      {(listsErrorMessage || actionError) && <ErrorBanner tone="amber" message={listsErrorMessage || actionError || ""} onRetry={refreshJobs} />}

      <section className="mb-8">
        <div className="mb-3 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-on-surface">Timeline</h2>
            <span className="text-xs text-secondary">{filteredRows.length}/{unifiedRows.length} shown</span>
          </div>
          <div className="grid gap-2 md:grid-cols-[1fr_auto_auto]">
            <label className="relative block">
              <span className="sr-only">Search runs</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search id, kind, blocker, command..."
                className="h-10 w-full rounded-lg border border-outline-variant/50 bg-surface px-3 text-sm text-on-surface outline-none transition-colors placeholder:text-secondary focus:border-primary/60"
              />
            </label>
            <Segmented
              aria-label="Filter by kind"
              options={KIND_FILTERS.map(([value, label]) => ({ value, label }))}
              value={kindFilter}
              onChange={setKindFilter}
            />
            <Segmented
              aria-label="Filter by status"
              options={STATUS_FILTERS.map(([value, label]) => ({ value, label }))}
              value={statusFilter}
              onChange={setStatusFilter}
            />
          </div>
        </div>

        {loadingLists ? (
          <div className="space-y-2">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="editorial-micro-card rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <div className="h-6 w-16 animate-pulse rounded-full bg-surface-container motion-reduce:animate-none" />
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="h-4 w-40 animate-pulse rounded bg-surface-container motion-reduce:animate-none" />
                    <div className="h-3 w-56 animate-pulse rounded bg-surface-container motion-reduce:animate-none" />
                  </div>
                  <div className="h-3 w-24 animate-pulse rounded bg-surface-container motion-reduce:animate-none" />
                  <div className="h-8 w-16 animate-pulse rounded-md bg-surface-container motion-reduce:animate-none" />
                </div>
              </div>
            ))}
          </div>
        ) : unifiedRows.length === 0 ? (
          <div className="editorial-micro-card rounded-lg">
            <EmptyState
              title="No runs recorded yet."
              detail={
                <>
                  <a href="#/pipeline" className="font-medium text-primary hover:underline">Open the Pipeline</a>{" "}
                  to build an agent or start a mission — it'll show up here.
                </>
              }
            />
          </div>
        ) : filteredRows.length === 0 ? (
          <div className="editorial-micro-card rounded-lg">
            <EmptyState
              title="No runs match the current filters."
              action={hasFilters ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setSearch(""); setKindFilter("all"); setStatusFilter("all"); }}
                >
                  Clear filters
                </Button>
              ) : undefined}
            />
          </div>
        ) : (
          <div className="space-y-2">
            {filteredRows.map((row) => (
              <TimelineRowCard
                key={rowKey(row)}
                row={row}
                expanded={expanded === rowKey(row)}
                onToggle={() => setExpanded(expanded === rowKey(row) ? null : rowKey(row))}
                onFollow={() => followRun(row.id, { kind: row.followKind, source: row.followSource })}
                onResume={handleResumeTask}
                resuming={resumingTask === row.id}
                jobLines={jobLines}
                runtimeLines={runtimeLines}
              />
            ))}
          </div>
        )}
      </section>

      {loading && agents.length === 0 ? (
        <div className="editorial-micro-card rounded-lg p-6">
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-12 bg-slate-200/60 rounded-lg animate-pulse motion-reduce:animate-none" />
            ))}
          </div>
          <div className="mt-4 text-sm text-secondary text-center">Loading activity...</div>
        </div>
      ) : agents.length === 0 ? (
        <div className="editorial-micro-card rounded-lg">
          <EmptyState
            title="No active runs yet"
            detail={
              <>
                <a href="#/pipeline" className="font-medium text-primary hover:underline">Start a run from the Pipeline</a>{" "}
                or build an agent from the{" "}
                <a href="#/fleet" className="font-medium text-primary hover:underline">Fleet</a> to get started.
              </>
            }
          />
        </div>
      ) : (
        <div className="space-y-2">
          {agents.map((agent) => (
            <a
              key={agent.id}
              href={`#/agent/${agent.id}`}
              className="block editorial-micro-card rounded-lg p-4 hover:bg-surface-container transition-colors"
            >
              <div className="flex items-center gap-4">
                <StatusPill status={agent.status} />
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-sm text-on-surface truncate">{agent.id}</div>
                  <div className="text-xs text-secondary">
                    {agent.department}
                    {agent.runId && (
                      <>
                        <span className="mx-1.5">•</span>
                        <span className="font-mono">{agent.runId}</span>
                      </>
                    )}
                  </div>
                </div>
                {agent.error && (
                  <div className="text-xs text-rose-600 max-w-xs truncate">{agent.error}</div>
                )}
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

function KindTag({ kind }: { kind: RowKind }) {
  return (
    <span className="shrink-0 rounded-md border border-outline-variant/40 bg-on-surface/[0.03] px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary">
      {KIND_LABEL[kind]}
    </span>
  );
}

function TimelineRowCard({
  row,
  expanded,
  onToggle,
  onFollow,
  onResume,
  resuming,
  jobLines,
  runtimeLines,
}: {
  row: TimelineRow;
  expanded: boolean;
  onToggle: () => void;
  onFollow: () => void;
  onResume: (id: string) => void;
  resuming: boolean;
  jobLines: string[];
  runtimeLines: string[];
}) {
  const canResume = row.kind === "mission" && Boolean(row.task?.resumePlan?.safeToRun);
  const detailLabel = row.kind === "build" ? "Build" : row.kind === "mission" ? "Events" : "Output";

  return (
    <div id={`run-${row.id}`} className="editorial-micro-card rounded-lg p-4">
      <div className="flex items-center gap-4">
        <StatusChip status={row.rawStatus} />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <KindTag kind={row.kind} />
            <span className="truncate text-sm font-medium text-on-surface">{row.title}</span>
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-secondary">
            <span className="truncate font-mono">{row.id}</span>
            <span>{formatWhen(row.updatedAt)}</span>
          </div>
        </div>
        <div className="hidden max-w-sm truncate text-xs text-secondary sm:block">
          {row.summary}
        </div>
        <Button variant="ghost" size="sm" className="shrink-0" onClick={onFollow} title="Follow this run live">
          Follow
        </Button>
        <button
          onClick={onToggle}
          className="shrink-0 rounded-md border border-outline-variant/50 px-3 py-1.5 text-xs font-medium text-secondary hover:bg-surface-container"
        >
          {expanded ? `Hide ${detailLabel}` : detailLabel}
        </button>
        {canResume && (
          <Button variant="ghost" size="sm" className="shrink-0" onClick={() => onResume(row.id)} loading={resuming}>
            {resuming ? "Resuming" : "Resume"}
          </Button>
        )}
      </div>

      {row.kind === "mission" && row.task?.kind === "mission.run" && <MissionTaskDetails task={row.task} />}

      {expanded && row.kind === "build" && row.run && <FactoryRunDetails run={row.run} />}
      {expanded && row.kind === "mission" && (
        <div className="mt-3 border-t border-outline-variant/30 pt-3">
          <pre className="max-h-80 overflow-y-auto rounded-md bg-on-surface/[0.03] px-3 py-2 text-[11px] leading-snug font-mono text-secondary whitespace-pre-wrap">
            {runtimeLines.join("\n") || "Waiting for runtime events..."}
          </pre>
        </div>
      )}
      {expanded && row.kind === "job" && row.job && (
        <div className="mt-3 border-t border-outline-variant/30 pt-3">
          {row.job.checks?.some((check) => check.status === "fail") && (
            <div className="mb-3 space-y-2 rounded-md border border-amber-400/20 bg-amber-500/5 px-3 py-2">
              {row.job.checks.filter((check) => check.status === "fail").map((check) => (
                <div key={check.name} className="text-xs text-amber-800">
                  <div className="font-semibold">{check.name}</div>
                  <div>{check.detail}</div>
                  {check.fix && <code className="mt-1 block text-[11px] text-amber-700">{check.fix}</code>}
                </div>
              ))}
            </div>
          )}
          <pre className="max-h-80 overflow-y-auto rounded-md bg-on-surface/[0.03] px-3 py-2 text-[11px] leading-snug font-mono text-secondary whitespace-pre-wrap">
            {jobLines.join("\n") || "Loading job output..."}
          </pre>
        </div>
      )}
    </div>
  );
}

function FactoryRunDetails({ run }: { run: FactoryRunSummary }) {
  // Subscribe to the run's live ledger event stream (SSE). The component only
  // mounts when its run is expanded, so this opens/closes with the disclosure.
  const [liveEvents, setLiveEvents] = useState<LedgerEvent[]>([]);
  useEffect(() => {
    setLiveEvents([]);
    const unsub = streamLedgerRun(run.id, (ev) => {
      setLiveEvents((prev) => [...prev, ev].slice(-60));
    });
    return unsub;
  }, [run.id]);

  return (
    <div className="mt-3 border-t border-outline-variant/30 pt-3">
      <div className="mb-3 grid gap-2 text-[11px] text-secondary sm:grid-cols-2">
        {run.runPath && (
          <div className="min-w-0 rounded bg-on-surface/[0.025] px-2 py-1">
            <span className="font-medium text-on-surface">Run</span>{" "}
            <span className="font-mono break-all">{shortenRepoPath(run.runPath)}</span>
          </div>
        )}
        {run.eventsPath && (
          <div className="min-w-0 rounded bg-on-surface/[0.025] px-2 py-1">
            <span className="font-medium text-on-surface">Events</span>{" "}
            <span className="font-mono break-all">{shortenRepoPath(run.eventsPath)}</span>
          </div>
        )}
      </div>
      {run.results.length ? (
        <div className="space-y-2">
          {run.results.map((result) => (
            <FactoryResultRow key={result.id || result.useCaseId} result={result} />
          ))}
        </div>
      ) : (
        <div className="rounded-md border border-outline-variant/30 bg-surface-container/40 px-3 py-2 text-xs text-secondary">
          The factory run has started; item details will appear as stage events arrive.
        </div>
      )}
      {liveEvents.length ? (
        <div className="mt-3">
          <div className="mb-1 flex items-center gap-1.5 text-[11px] font-medium text-secondary">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse motion-reduce:animate-none" /> live · {liveEvents.length} event{liveEvents.length === 1 ? "" : "s"}
          </div>
          <pre className="max-h-64 overflow-y-auto rounded-md bg-on-surface/[0.03] px-3 py-2 text-[11px] leading-snug font-mono text-secondary whitespace-pre-wrap">
            {liveEvents.map(formatLedgerEvent).join("\n")}
          </pre>
        </div>
      ) : run.recentEvents?.length ? (
        <pre className="mt-3 max-h-64 overflow-y-auto rounded-md bg-on-surface/[0.03] px-3 py-2 text-[11px] leading-snug font-mono text-secondary whitespace-pre-wrap">
          {run.recentEvents.slice(-40).map(formatFactoryEvent).join("\n")}
        </pre>
      ) : null}
    </div>
  );
}

function formatLedgerEvent(ev: LedgerEvent) {
  const ts = ev.ts ? new Date(ev.ts).toLocaleTimeString() : "";
  const label = ev.type === "run_complete"
    ? `run ${ev.status}${ev.ok === false ? " (failed)" : ""}`
    : ev.stage
      ? `[${ev.stage}] ${ev.status}${ev.workItemId ? ` · ${ev.workItemId}` : ""}`
      : `${ev.status}${ev.workItemId ? ` · ${ev.workItemId}` : ""}`;
  return `${ts ? `${ts} ` : ""}${ev.error ? `error: ${ev.error}` : label}`.trim();
}

function FactoryResultRow({ result }: { key?: string; result: FactoryRunResult }) {
  const hasError = Boolean(result.error);
  return (
    <div className="rounded-md border border-outline-variant/30 bg-surface-container/40 px-3 py-2">
      <div className="flex items-start gap-3">
        <StatusChip status={hasError ? "failed" : result.status} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-xs font-semibold text-on-surface">{result.title || result.useCaseId}</span>
            {result.department && <span className="text-[11px] text-secondary">{result.department}</span>}
            {result.workspaceId && <span className="font-mono text-[11px] text-secondary">{result.workspaceId}</span>}
          </div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {normalizedFactoryStages(result).map((stage) => (
              <StageChip key={stage.name} name={stage.name} status={stage.status} />
            ))}
          </div>
          {result.error && (
            <div className="mt-2 line-clamp-3 text-xs text-rose-700">{result.error}</div>
          )}
          {result.harnessReview && (
            <div className="mt-2 text-xs text-secondary">
              Antigravity review: {result.harnessReview.provider || "provider"} · score {result.harnessReview.score ?? "n/a"}
            </div>
          )}
        </div>
        <div className="shrink-0 text-right text-[11px] text-secondary">
          {Array.isArray(result.dataPackage?.datastores) && result.dataPackage.datastores.length ? (
            <div>{result.dataPackage.datastores.length} datastore{result.dataPackage.datastores.length === 1 ? "" : "s"}</div>
          ) : null}
          {result.preview?.ok === true ? <div className="text-emerald-700">preview ok</div> : null}
        </div>
      </div>
    </div>
  );
}

function StageChip({ name, status }: { key?: string; name: string; status: string }) {
  const cls = status === "done"
    ? "border-emerald-500/20 bg-emerald-500/5 text-emerald-700"
    : status === "failed"
      ? "border-rose-500/20 bg-rose-500/5 text-rose-700"
      : status === "running"
        ? "border-blue-500/20 bg-blue-500/5 text-blue-700"
        : "border-outline-variant/40 bg-on-surface/[0.025] text-secondary";
  return (
    <span className={`rounded-full border px-2 py-1 text-[11px] ${cls}`}>
      {name.replaceAll("_", " ")}
    </span>
  );
}

function MissionTaskDetails({ task }: { task: RuntimeTaskSummary }) {
  const graph = missionGraph(task);
  const artifacts = graph?.nodes?.flatMap((node) => node.artifacts || []) || task.artifactRefs || task.output?.artifactRefs || [];
  const blockers = graph?.nodes?.flatMap((node) => node.blockers || []) || task.resumePlan?.blockers || [];
  const artifactCounts = artifactStatusCounts(artifacts);
  const nodeCounts = graph?.counts || task.counts || null;

  return (
    <div className="mt-3 border-t border-outline-variant/30 pt-3">
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] text-secondary">
        {nodeCounts && <MetricChip label="nodes" value={formatCounts(nodeCounts)} />}
        <MetricChip label="artifacts" value={formatArtifactCounts(artifactCounts)} tone={artifactCounts.invalid || artifactCounts.missing ? "warn" : "default"} />
        <MetricChip label="blockers" value={String(blockers.length)} tone={blockers.length ? "warn" : "default"} />
        {task.resumePlan?.nextAction && <MetricChip label="next" value={task.resumePlan.nextAction} />}
      </div>
      {task.resumePlan?.reason && (
        <div className="mb-3 truncate text-xs text-secondary">
          {task.resumePlan.reason}
        </div>
      )}
      {graph?.nodes?.length ? (
        <div className="space-y-1.5">
          {graph.nodes.map((node) => (
            <MissionNodeRow key={node.id} node={node} />
          ))}
        </div>
      ) : artifacts.length ? (
        <div className="grid gap-1.5 sm:grid-cols-2">
          {artifacts.slice(0, 6).map((artifact, index) => (
            <ArtifactLine key={`${artifact.name || artifact.path || "artifact"}-${index}`} artifact={artifact} />
          ))}
        </div>
      ) : (
        <div className="text-xs text-secondary">
          Detailed steps are not available for this run yet.
        </div>
      )}
    </div>
  );
}

function MissionNodeRow({ node }: { key?: string; node: MissionRuntimeNode }) {
  const blockers = node.blockers || [];
  const artifactCounts = artifactStatusCounts(node.artifacts || []);
  const summary = summarizeNode(node);
  const kindLabel = nodeKindLabel(node);
  return (
    <div className="rounded-md border border-outline-variant/30 bg-surface-container/40 px-3 py-2">
      <div className="flex items-start gap-3">
        <StatusChip status={node.status} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-xs font-semibold text-on-surface">{node.label || node.id}</span>
            <span className="font-mono text-[11px] text-secondary">{kindLabel}</span>
            {node.childTaskId && <span className="font-mono text-[11px] text-secondary">{node.childTaskId}</span>}
          </div>
          {summary && <div className="mt-1 text-xs text-secondary">{summary}</div>}
          {node.resumePlan?.reason && ["blocked", "failed", "paused"].includes(node.status) && (
            <div className="mt-1 text-xs text-amber-700">{node.resumePlan.reason}</div>
          )}
        </div>
        <div className="shrink-0 text-right text-[11px] text-secondary">
          <div>{formatArtifactCounts(artifactCounts)}</div>
          {blockers.length > 0 && <div className="text-amber-700">{blockers.length} blocker{blockers.length === 1 ? "" : "s"}</div>}
        </div>
      </div>
      {node.artifacts?.length ? (
        <div className="mt-2 grid gap-1 sm:grid-cols-2">
          {node.artifacts.slice(0, 4).map((artifact, index) => (
            <ArtifactLine key={`${node.id}-${artifact.name || artifact.path || index}`} artifact={artifact} />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function ArtifactLine({ artifact }: { key?: string; artifact: MissionArtifactRef }) {
  const status = artifact.status || "planned";
  const tone = status === "present"
    ? "text-emerald-700"
    : status === "missing" || status === "invalid"
      ? "text-amber-700"
      : "text-secondary";
  const details = artifactDetail(artifact);
  return (
    <div className="flex min-w-0 items-center justify-between gap-2 rounded bg-on-surface/[0.025] px-2 py-1 text-[11px]">
      <span className="min-w-0 truncate text-secondary">{artifact.name || artifact.path || "artifact"}</span>
      <span className={`shrink-0 ${tone}`}>{details ? `${status} · ${details}` : status}</span>
    </div>
  );
}

function MetricChip({ label, value, tone = "default" }: { label: string; value: string; tone?: "default" | "warn" }) {
  const cls = tone === "warn"
    ? "border-amber-400/25 bg-amber-500/5 text-amber-800"
    : "border-outline-variant/40 bg-on-surface/[0.025] text-secondary";
  return (
    <span className={`rounded-full border px-2 py-1 ${cls}`}>
      <span className="font-medium text-on-surface">{label}</span> {value}
    </span>
  );
}

function missionGraph(task: RuntimeTaskSummary): MissionRuntimeGraph | null {
  return task.graph || task.output?.graph || null;
}

function nodeKindLabel(node: MissionRuntimeNode) {
  const kind = node.kind || node.runtimeKind || "";
  if (kind === "harness.run" || node.runtimeKind === "harness.run") return "Antigravity";
  return kind;
}

function summarizeFactoryRun(run: FactoryRunSummary) {
  const first = run.results[0];
  if (!first) return `${run.selected} selected · ${run.failed} failed`;
  const label = run.results.length === 1 ? (first.title || first.useCaseId) : `${run.results.length} agents`;
  const stage = run.targetStage ? ` → ${run.targetStage}` : "";
  return `${label}${stage}`;
}

function normalizedFactoryStages(result: FactoryRunResult) {
  const existing = new Map((result.stages || []).map((stage) => [stage.name, stage.status]));
  const canonical = ["created", "validated", "harness_reviewed", "harness_refined", "data_packaged", "previewed"];
  const stages = canonical.map((name) => ({ name, status: existing.get(name) || "pending" }));
  for (const stage of result.stages || []) {
    if (!canonical.includes(stage.name)) stages.push(stage);
  }
  return stages;
}

function formatFactoryEvent(event: FactoryRunSummary["recentEvents"][number]) {
  const ts = event.ts ? new Date(event.ts).toLocaleTimeString() : "";
  const level = event.level === "error" ? "error: " : "";
  return `${ts ? `${ts} ` : ""}${level}${event.line || event.type}`.trim();
}

function shortenRepoPath(path: string) {
  const marker = "/fde-agent-factory/";
  const index = path.indexOf(marker);
  return index >= 0 ? path.slice(index + marker.length) : path;
}

function summarizeRuntimeTask(task: RuntimeTaskSummary) {
  if (typeof task.summary === "string") return task.summary;
  if (task.kind === "mission.run" && task.counts) return formatCounts(task.counts);
  if (task.summary && typeof task.summary === "object") {
    const summary = task.summary as Record<string, any>;
    if (summary.summary && typeof summary.summary === "string") return summary.summary;
    if (summary.resumePlan?.reason && typeof summary.resumePlan.reason === "string") return summary.resumePlan.reason;
    if (summary.counts && typeof summary.counts === "object") return formatCounts(summary.counts);
  }
  return "";
}

function artifactStatusCounts(artifacts: MissionArtifactRef[]) {
  return artifacts.reduce((counts, artifact) => {
    const status = artifact.status || "planned";
    counts.total += 1;
    if (status === "present") counts.present += 1;
    else if (status === "missing") counts.missing += 1;
    else if (status === "invalid") counts.invalid += 1;
    else counts.planned += 1;
    return counts;
  }, { total: 0, present: 0, missing: 0, invalid: 0, planned: 0 });
}

function formatArtifactCounts(counts: ReturnType<typeof artifactStatusCounts>) {
  if (!counts.total) return "0";
  const bad = counts.missing + counts.invalid;
  if (bad) return `${counts.present}/${counts.total} ok, ${bad} issue${bad === 1 ? "" : "s"}`;
  return `${counts.present || counts.total}/${counts.total} ok`;
}

function formatCounts(counts: Record<string, number>) {
  if ("done" in counts || "pending" in counts) {
    const done = counts.done || 0;
    const blocked = counts.blocked || 0;
    const total = counts.total || done + blocked + (counts.pending || 0) + (counts.running || 0) + (counts.skipped || 0);
    return `${done}/${total} done${blocked ? `, ${blocked} blocked` : ""}`;
  }
  if ("passed" in counts) {
    return `${counts.passed || 0}/${counts.total || 0} passed${counts.blocked ? `, ${counts.blocked} blocked` : ""}`;
  }
  return Object.entries(counts).map(([key, value]) => `${key} ${value}`).join(", ");
}

function summarizeNode(node: MissionRuntimeNode) {
  const rawSummary = node.summary || {};
  const summary = typeof rawSummary === "string" ? {} : rawSummary;
  if (node.kind === "harness.run" || node.runtimeKind === "harness.run") {
    const input = node.input || {};
    const child = node.childTask as RuntimeTaskSummary | Record<string, any> | null | undefined;
    const childSummary = child && typeof child.summary === "string" ? child.summary : "";
    return [
      input.agent || "antigravity-sdk",
      input.model,
      input.location,
      input.stage,
      childSummary,
    ].filter(Boolean).join(" · ");
  }
  if (node.kind === "mock.generate") {
    const graph = summary.scenarioGraph || {};
    return [
      summary.usecase,
      graph.nodes != null ? `${graph.nodes} graph nodes` : null,
      graph.edges != null ? `${graph.edges} edges` : null,
      Array.isArray(summary.datastores) && summary.datastores.length ? `${summary.datastores.length} datastores` : null,
    ].filter(Boolean).join(" · ");
  }
  if (node.kind === "snowfakery.generate") {
    const output = summary.output || {};
    return [
      summary.objects != null ? `${summary.objects} objects` : null,
      output.csvFiles != null ? `${output.csvFiles} csv` : null,
      output.rowCount != null ? `${output.rowCount} rows` : null,
    ].filter(Boolean).join(" · ");
  }
  if (node.kind === "simulator.seed") {
    const simulators = Array.isArray(summary.simulators) ? summary.simulators : [];
    return simulators.length ? `${simulators.length} simulator${simulators.length === 1 ? "" : "s"} seeded` : "";
  }
  if (node.kind === "simulator.validate") {
    const totals = summary.totals || {};
    return [
      totals.simulators != null ? `${totals.simulators} simulators` : null,
      totals.tools != null ? `${totals.tools} tools` : null,
      totals.collections != null ? `${totals.collections} collections` : null,
      totals.errors ? `${totals.errors} errors` : null,
      totals.warnings ? `${totals.warnings} warnings` : null,
    ].filter(Boolean).join(" · ");
  }
  return typeof rawSummary === "string" ? rawSummary : "";
}

function formatRuntimeEvent(ev: GeEvent) {
  if (!ev) return "";
  const ts = ev.ts ? new Date(ev.ts).toLocaleTimeString() : "";
  const stage = ev.stage ? `[${ev.stage}] ` : "";
  const level = ev.level ? `${ev.level}: ` : "";
  const line = ev.line || eventFallbackLine(ev);
  return `${ts ? `${ts} ` : ""}${stage}${level}${line}`.trim();
}

function eventFallbackLine(ev: GeEvent) {
  if (ev.type === "mission_child_log" && ev.data?.line) return String(ev.data.line);
  if (ev.type === "mission_child_log" && ev.data?.event?.line) return String(ev.data.event.line);
  if (ev.data?.summary && typeof ev.data.summary === "string") return ev.data.summary;
  if (ev.data?.code != null) return `${ev.type} exit ${ev.data.code}`;
  return ev.type;
}

function artifactDetail(artifact: MissionArtifactRef) {
  const meta = artifact.metadata || {};
  if (meta.rowCount != null) return `${meta.rowCount} rows`;
  if (meta.csvFiles != null) return `${meta.csvFiles} csv`;
  if (meta.entries != null) return `${meta.entries} entries`;
  if (meta.files != null) return `${meta.files} files`;
  if (meta.size != null) return formatBytes(meta.size);
  return artifact.error || "";
}

function formatBytes(value: number) {
  if (!Number.isFinite(value)) return "";
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${Math.round(value / 1024)} KB`;
  return `${(value / 1024 / 1024).toFixed(1)} MB`;
}

function toTime(value: string | null | undefined) {
  const t = new Date(value || "").getTime();
  return Number.isFinite(t) ? t : 0;
}

function formatWhen(value: string) {
  const time = new Date(value).getTime();
  if (!Number.isFinite(time)) return value;
  const seconds = Math.max(0, Math.floor((Date.now() - time) / 1000));
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}
