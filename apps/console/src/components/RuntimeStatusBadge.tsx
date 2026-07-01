import { useEffect, useRef, useState } from "react";
import { useRuntimeStatus } from "../hooks/useRuntimeStatus";
import { ge, startJob, type RuntimeStatus } from "../services/geClient";

function tone(status: RuntimeStatus | null, loading: boolean) {
  if (loading && !status) return { dot: "bg-secondary/40", text: "text-secondary", label: "daemon…" };
  if (status?.ok) return { dot: "bg-emerald-500", text: "text-emerald-600", label: "daemon up" };
  return { dot: "bg-rose-500", text: "text-rose-600", label: "daemon down" };
}

// Starts the local daemon via the same `ge daemon start` path the CLI uses
// (idempotent — a no-op with a friendly line if it's already running), then
// re-checks status a couple of times so the pill/card flips green without
// waiting for the next poll interval.
function useDaemonStart(refresh: () => Promise<void> | void) {
  const [starting, setStarting] = useState(false);
  const start = async () => {
    setStarting(true);
    try {
      await startJob("ge daemon start", ge.daemonStart());
      for (const delay of [400, 1000, 2000]) {
        await new Promise((resolve) => setTimeout(resolve, delay));
        await refresh();
      }
    } finally {
      setStarting(false);
    }
  };
  return { starting, start };
}

// Compact, always-visible daemon health pill for the TopBar. Clickable — opens
// a small popover with the real status, a one-click "Start daemon" action, and
// a copyable restart command as the always-available fallback. Previously this
// only had a hover `title` tooltip: a red dead end with no way to act on it.
export function RuntimeStatusBadge() {
  const { status, loading, refresh } = useRuntimeStatus();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { starting, start } = useDaemonStart(refresh);
  const ref = useRef<HTMLDivElement>(null);
  const t = tone(status, loading);
  const down = !loading && !status?.ok;
  const restart = status?.restartCommand || "ge daemon stop && ge daemon start";

  useEffect(() => {
    if (!open) return;
    const onOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(restart);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={`inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-xs transition-colors hover:bg-surface-container-low ${t.text}`}
      >
        <span className={`w-2 h-2 rounded-full ${t.dot} ${down ? "animate-pulse" : ""}`} />
        <span className="font-medium">{t.label}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-outline-variant/40 bg-surface p-3 shadow-ambient-lg">
          {loading && !status ? (
            <div className="text-xs text-secondary">Checking the local runtime daemon…</div>
          ) : status?.ok ? (
            <>
              <div className="text-sm font-semibold text-on-surface">Runtime daemon healthy</div>
              <div className="mt-1 text-xs text-secondary">
                {status?.port ? `Port ${status.port}` : ""}{status?.pid ? ` · pid ${status.pid}` : ""}
              </div>
            </>
          ) : (
            <>
              <div className="text-sm font-semibold text-rose-700">
                Runtime daemon {status?.status || "down"}
              </div>
              <p className="mt-1 text-xs text-secondary">
                Interviews, missions, and local runs need it. {status?.error ? `(${status.error})` : ""}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <button
                  onClick={start}
                  disabled={starting}
                  className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-container disabled:opacity-50"
                >
                  {starting ? "Starting…" : "Start daemon"}
                </button>
                <button
                  onClick={handleCopy}
                  className="rounded-md border border-outline-variant/50 px-3 py-1.5 text-xs font-medium text-secondary transition-colors hover:bg-surface-container"
                >
                  {copied ? "Copied" : "Copy restart command"}
                </button>
              </div>
            </>
          )}
          <div className="mt-3 flex items-center justify-between border-t border-outline-variant/30 pt-2">
            <code className="truncate text-[11px] text-secondary">{restart}</code>
            <button onClick={() => refresh()} className="shrink-0 pl-2 text-xs font-medium text-primary hover:underline">
              Re-check
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Full readiness-style row for the Doctor view.
export function RuntimeStatusCard() {
  const { status, loading, refresh } = useRuntimeStatus(15000);
  const ok = status?.ok === true;
  const down = !loading && !ok;
  const restart = status?.restartCommand || "ge daemon stop && ge daemon start";
  const [copied, setCopied] = useState(false);
  const { starting, start } = useDaemonStart(refresh);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(restart);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    } catch { /* ignore */ }
  };

  return (
    <div className="mb-4 editorial-micro-card rounded-lg p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              loading && !status ? "bg-secondary/40" : ok ? "bg-emerald-500" : "bg-rose-500"
            } ${down ? "animate-pulse" : ""}`}
          />
          <div>
            <div className="text-sm font-semibold text-on-surface">
              Runtime daemon{status?.port ? ` · port ${status.port}` : ""}
            </div>
            <div className="text-xs text-secondary">
              {loading && !status
                ? "Checking the local runtime daemon…"
                : ok
                  ? `Healthy${status?.pid ? ` · pid ${status.pid}` : ""}${
                      status?.supportedTaskKinds?.length ? ` · ${status.supportedTaskKinds.length} task kinds` : ""
                    }`
                  : `${status?.status || "unavailable"}${status?.error ? ` — ${status.error}` : ""}`}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {down && (
            <button
              onClick={start}
              disabled={starting}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-container disabled:opacity-50"
            >
              {starting ? "Starting…" : "Start daemon"}
            </button>
          )}
          <button
            onClick={() => refresh()}
            className="px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors rounded-lg"
          >
            Re-check
          </button>
        </div>
      </div>
      {down && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded border border-rose-400/20 bg-rose-500/5 px-3 py-2 text-xs text-rose-700">
          <span>
            Interviews and local runs need the daemon. If "Start daemon" doesn't stick, restart it with{" "}
            <code className="font-mono text-rose-800">{restart}</code>
          </span>
          <button
            onClick={handleCopy}
            className="shrink-0 rounded-md border border-rose-400/30 px-2 py-1 font-medium text-rose-700 transition-colors hover:bg-rose-500/10"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
    </div>
  );
}
