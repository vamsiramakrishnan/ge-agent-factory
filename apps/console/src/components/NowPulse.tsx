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
    // The live-runs counter renders behind readout glass (the one black
    // window in the fascia, like the T1000's dial) — lit glyphs on dark,
    // dimmed when the count is zero.
    <button
      onClick={() => { location.hash = "#/activity"; }}
      className="dial-window inline-flex items-center gap-2.5 rounded-full px-3 py-1 font-mono text-xs tabular-nums transition-opacity hover:opacity-90"
      title="Live runs — open Activity"
      aria-label={`${counts.running} running, ${counts.blocked} need attention, ${counts.failed} failed, ${counts.done} done`}
    >
      <span className={`inline-flex items-center gap-1 ${counts.running ? "text-status-running" : "text-white/35"}`}>
        <span className={counts.running ? "animate-pulse motion-reduce:animate-none" : ""}>▶</span>
        {counts.running}
      </span>
      <span className={`inline-flex items-center gap-1 ${counts.blocked ? "text-status-blocked" : "text-white/35"}`}>
        ⏸{counts.blocked}
      </span>
      <span className={`inline-flex items-center gap-1 ${counts.failed ? "text-status-failed" : "text-white/35"}`}>
        ✕{counts.failed}
      </span>
      <span className={`inline-flex items-center gap-1 ${counts.done ? "text-status-passed" : "text-white/35"}`}>
        ✓{counts.done}
      </span>
    </button>
  );
}
