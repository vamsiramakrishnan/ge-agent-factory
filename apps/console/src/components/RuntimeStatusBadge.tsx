import { useRuntimeStatus } from "../hooks/useRuntimeStatus";
import type { RuntimeStatus } from "../services/geClient";

function tone(status: RuntimeStatus | null, loading: boolean) {
  if (loading && !status) return { dot: "bg-secondary/40", text: "text-secondary", label: "daemon…" };
  if (status?.ok) return { dot: "bg-emerald-500", text: "text-emerald-600", label: "daemon up" };
  return { dot: "bg-rose-500", text: "text-rose-600", label: "daemon down" };
}

// Compact, always-visible daemon health pill for the TopBar.
export function RuntimeStatusBadge() {
  const { status, loading } = useRuntimeStatus();
  const t = tone(status, loading);
  const down = !loading && !status?.ok;
  const restart = status?.restartCommand || "ge daemon stop && ge daemon start";
  const title = down
    ? `Runtime daemon ${status?.status || "down"}${status?.error ? ` — ${status.error}` : ""}\nRestart: ${restart}`
    : status?.ok
      ? `Runtime daemon healthy${status?.port ? ` (port ${status.port})` : ""}`
      : "Checking runtime daemon…";

  return (
    <div className={`inline-flex items-center gap-1.5 text-xs ${t.text}`} title={title}>
      <span className={`w-2 h-2 rounded-full ${t.dot} ${down ? "animate-pulse" : ""}`} />
      <span className="font-medium">{t.label}</span>
    </div>
  );
}

// Full readiness-style row for the Doctor view.
export function RuntimeStatusCard() {
  const { status, loading, refresh } = useRuntimeStatus(15000);
  const ok = status?.ok === true;
  const down = !loading && !ok;
  const restart = status?.restartCommand || "ge daemon stop && ge daemon start";

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
        <button
          onClick={() => refresh()}
          className="px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/10 transition-colors rounded-lg"
        >
          Re-check
        </button>
      </div>
      {down && (
        <div className="mt-3 rounded border border-rose-400/20 bg-rose-500/5 px-3 py-2 text-xs text-rose-700">
          Interviews and local runs need the daemon. Restart it with{" "}
          <code className="font-mono text-rose-800">{restart}</code>
        </div>
      )}
    </div>
  );
}
