import { useState, useEffect, useMemo } from "react";
import { streamDoctor, startJob, type StatusBoard, type DoctorReport as DoctorReportData, type DoctorEvent } from "../services/geClient";
import { DoctorReport } from "../components/DoctorReport";
import { RuntimeStatusCard } from "../components/RuntimeStatusBadge";
import { ErrorBanner } from "../components/ErrorBanner";
import { useRunFollow } from "../state/runFollow";
import { useUrlParam } from "../lib/useUrlState";
import { resolveFix, runFix } from "../lib/doctorFix";

type ScopeValue = "all" | "local" | "cloud" | "data" | "mcp";
type CommandValue = "" | "up" | "data.up" | "mcp.deploy" | "agents.build" | "agents.build.local" | "agents.ship" | "agents.sync";

const SCOPE_VALUES: ScopeValue[] = ["all", "local", "cloud", "data", "mcp"];
const COMMAND_VALUES: CommandValue[] = ["", "up", "data.up", "mcp.deploy", "agents.build", "agents.build.local", "agents.ship", "agents.sync"];

const SCOPE_CAPTIONS: Record<ScopeValue, string> = {
  all: "every plane + toolchain",
  local: "your local toolchain/CLIs",
  cloud: "the deployed factory + worker",
  data: "AlloyDB/BigQuery/Firestore data plane",
  mcp: "the MCP tool servers",
};

interface DoctorProps {
  status?: StatusBoard | null;
}

// Last completed report per scope+command, so re-entering Doctor shows readiness instantly
// instead of flashing empty while a fresh scope=all stream runs.
const doctorCache = new Map<string, DoctorReportData>();
const cacheKey = (scope: string, command: string) => `${scope}|${command}`;

// Roll all sections' checks into a single pass/warn/fail verdict.
function verdictCounts(report: DoctorReportData | null) {
  let pass = 0;
  let warn = 0;
  let fail = 0;
  for (const section of report?.sections ?? []) {
    for (const check of section.checks) {
      if (check.status === "pass") pass++;
      else if (check.status === "warn") warn++;
      else fail++;
    }
  }
  return { pass, warn, fail };
}

export default function Doctor({ status }: DoctorProps) {
  const { followRun } = useRunFollow();
  const [scopeParam, setScopeParam] = useUrlParam("scope", "all");
  const [commandParam, setCommandParam] = useUrlParam("command", "");
  const scope: ScopeValue = SCOPE_VALUES.includes(scopeParam as ScopeValue) ? (scopeParam as ScopeValue) : "all";
  const command: CommandValue = COMMAND_VALUES.includes(commandParam as CommandValue) ? (commandParam as CommandValue) : "";

  const [report, setReport] = useState<DoctorReportData | null>(() => doctorCache.get(cacheKey(scope, command)) ?? null);
  const [loading, setLoading] = useState(() => !doctorCache.get(cacheKey(scope, command)));
  const [error, setError] = useState<string | null>(null);
  const [events, setEvents] = useState<DoctorEvent[]>([]);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  // Section-row progress: name → state, in the order sections are first seen.
  const [progress, setProgress] = useState<{ name: string; state: "checking" | "pass" | "fail"; fails: number }[]>([]);
  // Failures-first: default ON when there are fails, OFF otherwise. User can override.
  const [failuresOnly, setFailuresOnly] = useState(false);
  const [failuresTouched, setFailuresTouched] = useState(false);
  const [fixingAll, setFixingAll] = useState(false);

  const fetchReport = (scopeValue: ScopeValue, commandValue: CommandValue) => {
    const key = cacheKey(scopeValue, commandValue);
    setLoading(true);
    setError(null);
    setReport(doctorCache.get(key) ?? { project: status?.project ?? null, region: status?.region ?? "us-central1", sections: [], fails: 0 });
    setEvents([]);
    setActiveSection(null);
    setProgress([]);
    return streamDoctor(scopeValue, commandValue || undefined, (event) => {
      setEvents((prev) => [...prev.slice(-80), event]);

      if (event.type === "section_started" && event.section) {
        setActiveSection(event.section);
        setProgress((prev) =>
          prev.some((row) => row.name === event.section)
            ? prev
            : [...prev, { name: event.section!, state: "checking", fails: 0 }],
        );
      }
      if (event.type === "section_done" || event.type === "section_blocked") {
        setActiveSection(null);
        const name = event.section || event.sectionReport?.name;
        const fails = event.sectionReport?.fails ?? (event.type === "section_blocked" ? 1 : 0);
        if (name) {
          setProgress((prev) => {
            const next = prev.some((row) => row.name === name)
              ? prev.map((row) => (row.name === name ? { ...row, state: fails > 0 ? "fail" as const : "pass" as const, fails } : row))
              : [...prev, { name, state: fails > 0 ? "fail" as const : "pass" as const, fails }];
            return next;
          });
        }
        setReport((prev) => {
          if (!event.sectionReport) return prev;
          const base = prev || { project: status?.project ?? null, region: status?.region ?? "us-central1", sections: [], fails: 0 };
          const sections = [...base.sections.filter((section) => section.name !== event.sectionReport!.name), event.sectionReport];
          return { ...base, sections, fails: sections.reduce((n, section) => n + section.fails, 0) };
        });
      }
      if (event.report) {
        doctorCache.set(key, event.report);
        setReport(event.report);
        setLoading(false);
      }
      if (event.type === "doctor_stream_error") {
        setError(event.line || "Readiness stream disconnected");
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    const stop = fetchReport(scope, command);
    return () => { stop?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope, command]);

  const counts = useMemo(() => verdictCounts(report), [report]);

  // Auto-default the failures-first toggle once a settled report arrives, unless
  // the operator has already flipped it themselves.
  useEffect(() => {
    if (loading || failuresTouched) return;
    setFailuresOnly(counts.fail > 0);
  }, [loading, counts.fail, failuresTouched]);

  // Distinct runnable repair commands → drives the "Fix all" affordance.
  const runnableRepairs = useMemo(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const item of report?.repairPlan ?? []) {
      if (!resolveFix(item.command)) continue;
      const label = resolveFix(item.command)!.label;
      if (seen.has(label)) continue;
      seen.add(label);
      out.push(item.command);
    }
    return out;
  }, [report]);

  // The single recommended next command: first repair-plan entry, else the first
  // failing check's fix.
  const recommended = useMemo(() => {
    if (report?.repairPlan?.length) return report.repairPlan[0].command;
    for (const section of report?.sections ?? []) {
      for (const check of section.checks) {
        if (check.status === "fail" && check.fix) return check.fix;
      }
    }
    return null;
  }, [report]);

  const verdict = loading
    ? { label: "CHECKING…", className: "text-secondary" }
    : counts.fail > 0
      ? { label: "NOT READY", className: "text-rose-600" }
      : counts.warn > 0
        ? { label: "NEEDS ATTENTION", className: "text-amber-600" }
        : { label: "READY", className: "text-emerald-600" };

  const handleRunRecommended = () => {
    if (recommended) void runFix(recommended, followRun);
  };

  const handleCopyRecommended = async () => {
    if (recommended) { try { await navigator.clipboard.writeText(recommended); } catch { /* ignore */ } }
  };

  const handleFixAll = async () => {
    setFixingAll(true);
    try {
      let first = true;
      for (const command of runnableRepairs) {
        const resolved = resolveFix(command);
        if (!resolved) continue;
        const id = await startJob(resolved.label, resolved.run());
        if (id && first) { followRun(id, { kind: "fix", source: resolved.label }); first = false; }
      }
    } finally {
      setFixingAll(false);
    }
  };

  const seen = progress.length;
  const completed = progress.filter((row) => row.state !== "checking").length;
  const pct = seen > 0 ? Math.round((completed / seen) * 100) : 0;

  const scopeOptions: { label: string; value: ScopeValue }[] = [
    { label: "All", value: "all" },
    { label: "Toolchain (local)", value: "local" },
    { label: "Factory (cloud)", value: "cloud" },
    { label: "Data", value: "data" },
    { label: "Tool", value: "mcp" },
  ];
  const commandOptions: { label: string; value: CommandValue }[] = [
    { label: "No command target", value: "" },
    { label: "ge up", value: "up" },
    { label: "ge data up", value: "data.up" },
    { label: "ge mcp deploy", value: "mcp.deploy" },
    { label: "ge agents build", value: "agents.build" },
    { label: "ge agents build --local", value: "agents.build.local" },
    { label: "ge agents ship", value: "agents.ship" },
    { label: "ge agents sync", value: "agents.sync" },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-6">
        <div className="flex items-baseline justify-between mb-4">
          <h1 className="text-2xl font-bold text-on-surface">Readiness</h1>
          <button
            onClick={() => fetchReport(scope, command)}
            disabled={loading}
            className="px-3 py-1.5 text-sm font-medium text-primary hover:bg-primary/10 transition-colors rounded-lg disabled:opacity-50"
          >
            Re-run
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {scopeOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setScopeParam(option.value)}
              aria-pressed={scope === option.value}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                scope === option.value
                  ? "bg-primary text-white"
                  : "bg-surface-container-low text-secondary hover:bg-surface-container"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-xs text-secondary">Verifies {SCOPE_CAPTIONS[scope]}.</p>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs font-medium text-secondary">Readiness target</span>
          <select
            value={command}
            onChange={(event) => setCommandParam(event.target.value)}
            className="rounded-lg border border-outline-variant/50 bg-surface px-3 py-2 text-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            {commandOptions.map((option) => (
              <option key={option.value || "none"} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <ErrorBanner message={error} onRetry={() => fetchReport(scope, command)} />}

      {/* Verdict header — the scannable bottom line. */}
      <div className="mb-4 editorial-micro-card rounded-lg p-5" aria-live="polite">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className={`text-2xl font-bold tracking-tight ${verdict.className}`}>{verdict.label}</div>
            <div className="mt-1 flex items-center gap-3 text-sm">
              <span className="font-medium text-emerald-700">✓ {counts.pass}</span>
              <span className="font-medium text-amber-700">! {counts.warn}</span>
              <span className="font-medium text-rose-700">✕ {counts.fail}</span>
            </div>
          </div>
          {!loading && (counts.fail > 0 || counts.warn > 0) && recommended && (
            <div className="flex flex-wrap items-center gap-2">
              {resolveFix(recommended) ? (
                <button
                  onClick={handleRunRecommended}
                  className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-container"
                >
                  Run <code className="font-mono">{resolveFix(recommended)!.label}</code>
                </button>
              ) : (
                <span className="rounded-lg bg-surface-container-low px-3 py-2 text-xs font-mono text-on-surface">{recommended}</span>
              )}
              <button
                onClick={handleCopyRecommended}
                className="rounded-lg px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/10"
              >
                Copy
              </button>
              {runnableRepairs.length >= 2 && (
                <button
                  onClick={handleFixAll}
                  disabled={fixingAll}
                  className="rounded-lg border border-outline/30 px-3 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container disabled:opacity-50"
                >
                  {fixingAll ? "Fixing…" : "Fix all"}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <RuntimeStatusCard />

      {/* Live progress — clean section ticks + a thin bar, raw logs tucked away. */}
      {(loading || progress.length > 0) && (
        <div className="mb-4 editorial-micro-card rounded-lg p-4">
          <div className="mb-2 flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-on-surface" aria-live="polite">
              {loading ? (activeSection ? `Checking ${activeSection}` : "Starting readiness check") : "Readiness check complete"}
            </div>
            <div className="text-xs text-secondary">{completed}/{seen || "…"} sections</div>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-container" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
            <div className="h-full bg-primary transition-all duration-500 motion-reduce:transition-none" style={{ width: `${pct}%` }} />
          </div>
          {progress.length > 0 && (
            <div className="mt-3 space-y-1">
              {progress.map((row) => (
                <div key={row.name} className="flex items-center gap-2 text-xs">
                  {row.state === "checking" ? (
                    <svg className="h-3.5 w-3.5 animate-spin text-primary motion-reduce:animate-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                    </svg>
                  ) : row.state === "fail" ? (
                    <span className="text-rose-600" aria-hidden="true">✕</span>
                  ) : (
                    <span className="text-emerald-600" aria-hidden="true">✓</span>
                  )}
                  <span className="text-on-surface">{row.name}</span>
                  {row.state === "fail" && row.fails > 0 && (
                    <span className="text-rose-600">{row.fails} fail{row.fails === 1 ? "" : "s"}</span>
                  )}
                  {row.state === "checking" && <span className="text-secondary">checking…</span>}
                </div>
              ))}
            </div>
          )}
          {events.length > 0 && (
            <details className="mt-3">
              <summary className="cursor-pointer text-xs font-medium text-secondary hover:text-on-surface">
                Stream logs ({events.length})
              </summary>
              <div className="mt-2 max-h-48 overflow-auto rounded border border-outline-variant/30 bg-surface-container-low/40">
                {events.map((event, index) => (
                  <div key={`${event.ts || index}-${index}`} className="flex gap-2 border-b border-outline-variant/20 px-3 py-1.5 text-xs last:border-b-0">
                    <span className={`w-14 shrink-0 font-medium ${event.level === "error" ? "text-rose-600" : event.level === "warn" ? "text-amber-700" : "text-secondary"}`}>
                      {event.level || "info"}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-on-surface">{event.line || event.type}</span>
                  </div>
                ))}
              </div>
            </details>
          )}
        </div>
      )}

      {/* Failures-first toggle. */}
      {!loading && (counts.fail > 0 || counts.warn > 0) && (
        <div className="mb-3 flex items-center justify-end">
          <label className="inline-flex cursor-pointer items-center gap-2 text-xs font-medium text-secondary">
            <input
              type="checkbox"
              checked={failuresOnly}
              onChange={(e) => { setFailuresOnly(e.target.checked); setFailuresTouched(true); }}
              className="h-3.5 w-3.5 rounded border-outline-variant/50 text-primary focus:ring-primary/20"
            />
            Failures only
          </label>
        </div>
      )}

      <DoctorReport report={report} loading={loading} failuresOnly={failuresOnly} />
    </div>
  );
}
