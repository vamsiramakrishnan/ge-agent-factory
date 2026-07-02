import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { StatusPill, statusStyle } from "@ge/ui";
import { streamJob, type Check, type GeCommand, type GeEvent } from "../services/geClient";

interface Job {
  jobId: string;
  label: string;
  command: GeCommand | null;
  checks: Check[];
  lines: string[];
  status: "running" | "done" | "failed" | "blocked";
  startedAt: number;
  unsub: () => void;
}

// Descriptor persisted across reloads so an in-flight job's toast survives F5.
interface JobDescriptor { jobId: string; label: string; command: GeCommand | null; startedAt: number }
const STORAGE_KEY = "ge:active-jobs";

function loadDescriptors(): JobDescriptor[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as JobDescriptor[]) : [];
  } catch {
    return [];
  }
}

// Global job feedback: listens for window "ge:job" events (dispatched by startJob),
// streams each background job's live log into a bottom-right toast, persists active
// jobs so a reload re-attaches instead of losing them, and calls onDone() when a
// job finishes so the active view can refresh.
export function JobToast({ onDone }: { onDone?: () => void }) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [now, setNow] = useState(Date.now());
  const subscribed = useRef<Set<string>>(new Set());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  // Subscribe to a job's live stream and add its toast. Idempotent per jobId so
  // reload-restore and a late "ge:job" event can't double-subscribe.
  const subscribeJob = useCallback((desc: JobDescriptor) => {
    if (!desc.jobId || subscribed.current.has(desc.jobId)) return;
    subscribed.current.add(desc.jobId);

    setJobs((prev) => prev.some((j) => j.jobId === desc.jobId)
      ? prev
      : [...prev, { jobId: desc.jobId, label: desc.label, command: desc.command, checks: [], lines: [], status: "running", startedAt: desc.startedAt || Date.now(), unsub: () => {} }]);
    setExpanded((prev) => (desc.jobId in prev ? prev : { ...prev, [desc.jobId]: true }));

    const unsub = streamJob(desc.jobId, (ev: GeEvent) => {
      setJobs((prev) => prev.map((j) => {
        if (j.jobId !== desc.jobId) return j;
        const line = typeof ev.line === "string" ? ev.line.trimEnd() : "";
        const lines = line ? [...j.lines, line].slice(-200) : j.lines;
        let status = j.status;
        if (ev.type === "stage_done") status = "done";
        if (ev.type === "stage_failed") status = "failed";
        if (ev.type === "stage_blocked") status = "blocked";
        if (status !== j.status && status !== "running") {
          onDone?.();
          window.dispatchEvent(new CustomEvent("ge:job:done", { detail: { jobId: desc.jobId, status, label: desc.label } }));
        }
        const checks = Array.isArray(ev.data?.checks) ? ev.data.checks : j.checks;
        return { ...j, lines, status, checks };
      }));
    });
    setJobs((prev) => prev.map((j) => j.jobId === desc.jobId ? { ...j, unsub } : j));
  }, [onDone]);

  // Restore in-flight jobs after a reload by re-attaching to their streams.
  useEffect(() => {
    for (const desc of loadDescriptors()) subscribeJob(desc);
  }, [subscribeJob]);

  useEffect(() => {
    const onJob = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      if (!detail.jobId) return;
      subscribeJob({ jobId: detail.jobId, label: detail.label, command: detail.command || null, startedAt: Date.now() });
    };
    window.addEventListener("ge:job", onJob);
    return () => window.removeEventListener("ge:job", onJob);
  }, [subscribeJob]);

  // Persist only still-running jobs so reload re-attaches to live work and
  // finished/dismissed toasts don't resurrect.
  useEffect(() => {
    const active: JobDescriptor[] = jobs
      .filter((j) => j.status === "running")
      .map((j) => ({ jobId: j.jobId, label: j.label, command: j.command, startedAt: j.startedAt }));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(active));
    } catch {
      /* storage unavailable — non-fatal */
    }
  }, [jobs]);

  const dismiss = (jobId: string) => setJobs((prev) => {
    const j = prev.find((x) => x.jobId === jobId);
    j?.unsub();
    subscribed.current.delete(jobId);
    return prev.filter((x) => x.jobId !== jobId);
  });

  const toggle = (jobId: string) => setExpanded((prev) => ({ ...prev, [jobId]: !prev[jobId] }));

  if (!jobs.length) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 w-[30rem] max-w-[calc(100vw-2rem)]">
      {jobs.map((j) => (
        <div key={j.jobId} className="bg-surface rounded-lg shadow-ambient-lg border border-outline-variant/40 overflow-hidden">
          <div className="flex items-start gap-2 px-3 py-2.5 border-b border-outline-variant/30">
            <span className={`h-2 w-2 rounded-full ${statusStyle(j.status).dot} ${j.status === "running" ? "animate-pulse motion-reduce:animate-none" : ""}`} />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-on-surface truncate">{j.label}</span>
                <StatusPill status={j.status} className="shrink-0" />
              </div>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-secondary">
                <span>{formatElapsed(now - j.startedAt)}</span>
                {j.command?.expectedDuration && <span>expected {j.command.expectedDuration}</span>}
                <span>{j.lines.length} log lines</span>
                <span className="truncate">{j.command?.risk || j.jobId}</span>
              </div>
            </div>
            <button
              onClick={() => toggle(j.jobId)}
              className="rounded-md p-1 text-secondary hover:bg-surface-container hover:text-on-surface"
              aria-label={expanded[j.jobId] ? "Collapse job output" : "Expand job output"}
            >
              {expanded[j.jobId] ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
            <button
              onClick={() => dismiss(j.jobId)}
              className="rounded-md p-1 text-secondary hover:bg-surface-container hover:text-on-surface"
              aria-label="Dismiss job"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="px-3 py-2">
            {j.command?.summary && (
              <div className="mb-2 text-xs leading-relaxed text-secondary">
                {j.command.summary}
              </div>
            )}
            <div className="mb-2 rounded-md bg-surface-container-low px-2.5 py-2 text-[11px] font-mono leading-snug text-on-surface/80">
              {j.lines.at(-1) || "Waiting for first log line..."}
            </div>
            {expanded[j.jobId] && (
              <>
                {j.checks.some((check) => check.status === "fail") && (
                  <div className="mb-2 space-y-1 rounded-md border border-amber-400/20 bg-amber-500/5 px-2.5 py-2">
                    {j.checks.filter((check) => check.status === "fail").map((check) => (
                      <div key={check.name} className="text-[11px] leading-snug text-amber-800">
                        <span className="font-semibold">{check.name}:</span> {check.detail}
                        {check.fix && <span className="block font-mono text-amber-700">{check.fix}</span>}
                      </div>
                    ))}
                  </div>
                )}
                <pre className="max-h-56 overflow-y-auto rounded-md bg-on-surface/[0.03] px-2.5 py-2 text-[11px] leading-snug font-mono text-secondary whitespace-pre-wrap">
                  {j.lines.slice(-24).join("\n") || "No output yet."}
                </pre>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

function formatElapsed(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const mins = Math.floor(total / 60);
  const secs = total % 60;
  return mins > 0 ? `${mins}m ${String(secs).padStart(2, "0")}s` : `${secs}s`;
}
