import { useEffect, useState } from "react";
import { ge } from "../services/geClient";
import { normalizeStatus } from "../lib/runStatus";

// Compact, calm live cluster for the TopBar: ▶running ⏸blocked ✕failed ✓done,
// derived from the durable run ledger (polled on an off-:00 cadence). Click →
// Activity. `blocked` means pausable/needs-attention; `failed` (incl. cancelled
// /timed-out, which normalize to failed) is terminal and is counted separately
// so we never label a failure as something the operator can resume.
export function NowPulse() {
  const [counts, setCounts] = useState({ running: 0, blocked: 0, failed: 0, done: 0 });
  const [ok, setOk] = useState(true);

  useEffect(() => {
    let alive = true;
    const poll = async () => {
      try {
        const { runs } = await ge.ledgerRuns(25);
        if (!alive) return;
        const next = { running: 0, blocked: 0, failed: 0, done: 0 };
        for (const run of runs) {
          const s = normalizeStatus(run.status);
          if (s === "running") next.running += 1;
          else if (s === "blocked") next.blocked += 1;
          else if (s === "failed") next.failed += 1;
          else if (s === "done") next.done += 1;
        }
        setCounts(next);
        setOk(true);
      } catch {
        if (alive) setOk(false);
      }
    };
    poll();
    const interval = window.setInterval(poll, 4200); // off-:00 cadence
    return () => { alive = false; window.clearInterval(interval); };
  }, []);

  if (!ok) return null;

  return (
    <button
      onClick={() => { location.hash = "#/activity"; }}
      className="inline-flex items-center gap-2 rounded-md border border-outline-variant/40 px-2 py-1 text-xs tabular-nums transition-colors hover:bg-surface-container-low"
      title="Live runs — open Activity"
      aria-label={`${counts.running} running, ${counts.blocked} need attention, ${counts.failed} failed, ${counts.done} done`}
    >
      <span className={`inline-flex items-center gap-1 ${counts.running ? "text-status-running-ink" : "text-secondary"}`}>
        <span className={counts.running ? "animate-pulse motion-reduce:animate-none" : ""}>▶</span>
        {counts.running}
      </span>
      <span className={`inline-flex items-center gap-1 ${counts.blocked ? "text-status-blocked-ink" : "text-secondary"}`}>
        ⏸{counts.blocked}
      </span>
      <span className={`inline-flex items-center gap-1 ${counts.failed ? "text-status-failed-ink" : "text-secondary"}`}>
        ✕{counts.failed}
      </span>
      <span className={`inline-flex items-center gap-1 ${counts.done ? "text-status-passed-ink" : "text-secondary"}`}>
        ✓{counts.done}
      </span>
    </button>
  );
}
