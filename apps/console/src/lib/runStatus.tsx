// The single status system for live run UX (Run Drawer + Now pulse + Activity
// follow). The framework-agnostic normalization (normalizeStatus + the RunStatus
// vocabulary, including cancelled/timeout→failed) now lives in @ge/run-ledger; this
// module keeps only the React/Tailwind surface: a single source of truth for the
// palette (emerald=done, rose=failed, amber=blocked, blue=running, slate=pending)
// and the StatusChip JSX. StatusPill (@ge/ui) stays for legacy surfaces; StatusChip
// below is the new follow-surface chip built on the shared normalization.

import { normalizeStatus, type RunStatus } from "@ge/run-ledger/status";

export { normalizeStatus };
export type { RunStatus };

export interface RunStatusStyle {
  label: string;
  dotClass: string;
  textClass: string;
  badgeClass: string;
  icon: string;
}

const STYLES: Record<RunStatus, RunStatusStyle> = {
  done: {
    label: "Done",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-700",
    badgeClass: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
    icon: "●",
  },
  failed: {
    label: "Failed",
    dotClass: "bg-rose-500",
    textClass: "text-rose-700",
    badgeClass: "border-rose-500/20 bg-rose-500/10 text-rose-700",
    icon: "✕",
  },
  blocked: {
    label: "Blocked",
    dotClass: "bg-amber-500",
    textClass: "text-amber-700",
    badgeClass: "border-amber-500/20 bg-amber-500/10 text-amber-700",
    icon: "⏸",
  },
  running: {
    label: "Running",
    dotClass: "bg-blue-500",
    textClass: "text-blue-700",
    badgeClass: "border-blue-500/20 bg-blue-500/10 text-blue-700",
    icon: "◐",
  },
  pending: {
    label: "Pending",
    dotClass: "bg-slate-400",
    textClass: "text-slate-600",
    badgeClass: "border-slate-400/20 bg-slate-500/10 text-slate-600",
    icon: "○",
  },
};

export function statusStyle(status: RunStatus): RunStatusStyle {
  return STYLES[status];
}

// Tiny pill driven by the normalization above. Use in the new follow surfaces
// (Run Drawer header, Activity run cards). Accepts a raw status string.
export function StatusChip({ status, className = "" }: { status: string; className?: string }) {
  const s = normalizeStatus(status);
  const style = STYLES[s];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${style.badgeClass} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dotClass} ${s === "running" ? "animate-pulse motion-reduce:animate-none" : ""}`} />
      {style.label}
    </span>
  );
}
