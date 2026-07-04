import { normalizeStatus, runStatusStyle } from "./status";

// Tiny pill driven by the shared run-status normalization (@ge/run-ledger via
// ./status). The follow-surface chip: Run Drawer header, Activity run cards,
// Overview/AgentDetail health. Accepts a raw status string — any verb the
// factory/runtime/ledger emit — and renders the normalized five-state palette.
// <StatusPill> stays for the legacy pass/warn/fail vocabulary.
export function StatusChip({ status, className = "" }: { status: string; className?: string }) {
  const s = normalizeStatus(status);
  const style = runStatusStyle(s);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-outline-variant/70 bg-surface px-2 py-0.5 text-4xs font-semibold uppercase tracking-wide ${style.textClass} ${className}`}
    >
      <span className={`lamp h-1.5 w-1.5 rounded-full ${style.dotClass} ${s === "running" ? "animate-pulse motion-reduce:animate-none" : ""}`} />
      {style.label}
    </span>
  );
}
