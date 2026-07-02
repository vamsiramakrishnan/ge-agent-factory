// Shared status vocabulary → operator-facing label + Tailwind tone. The single source
// for status colour across every GE surface (lifted from the console StatusPill).
//
// Two vocabularies live here on purpose:
//   1. StatusValue/statusLabel/statusStyle — the loose legacy vocabulary behind
//      <StatusPill> (doctor checks, plane up/down, fleet byStatus buckets).
//   2. RunStatus/normalizeStatus/runStatusStyle — the run-follow vocabulary
//      behind <StatusChip>. The framework-agnostic normalization (including
//      cancelled/timeout→failed) is owned by @ge/run-ledger/status; this module
//      re-exports it and owns the one Tailwind palette for it (emerald=done,
//      rose=failed, amber=blocked, blue=running, slate=pending).

import { normalizeStatus, type RunStatus } from "@ge/run-ledger/status";

export { normalizeStatus };
export type { RunStatus };

export type StatusValue = "pass" | "warn" | "fail" | "up" | "down" | "none" | string;

const STATUS_LABELS: Record<string, string> = {
  none: "Not started",
  pass: "Healthy",
  up: "Up",
  down: "Down",
  warn: "Needs attention",
  fail: "Failed",
  failed: "Failed",
  blocked: "Blocked",
  pending: "Pending",
  running: "Running",
  submitted: "Submitted",
  skipped: "Skipped",
  done: "Done",
  ready: "Ready",
  success: "Succeeded",
  completed: "Completed",
  error: "Error",
};

export function statusLabel(status: StatusValue): string {
  const normalized = String(status || "").toLowerCase();
  if (STATUS_LABELS[normalized]) return STATUS_LABELS[normalized];
  const words = normalized.replace(/[._-]+/g, " ").trim();
  return words ? words.charAt(0).toUpperCase() + words.slice(1) : "Unknown";
}

function getStatusStyles(status: StatusValue): string {
  const normalized = String(status || "").toLowerCase();
  if (["pass", "up", "ready", "done", "success", "completed"].includes(normalized)) return "bg-emerald-500/10 text-emerald-700";
  if (["warn", "pending", "running", "submitted", "skipped"].includes(normalized)) return "bg-amber-500/10 text-amber-700";
  if (["fail", "failed", "blocked", "down", "error"].includes(normalized)) return "bg-rose-500/10 text-rose-700";
  return "bg-slate-500/10 text-slate-600";
}

function getDotColor(status: StatusValue): string {
  const normalized = String(status || "").toLowerCase();
  if (["pass", "up", "ready", "done", "success", "completed"].includes(normalized)) return "bg-emerald-500";
  if (["warn", "pending", "running", "submitted", "skipped"].includes(normalized)) return "bg-amber-500";
  if (["fail", "failed", "blocked", "down", "error"].includes(normalized)) return "bg-rose-500";
  return "bg-slate-400";
}

export function statusStyle(status: StatusValue) {
  return { className: getStatusStyles(status), dot: getDotColor(status) };
}

// ── Run-status vocabulary (moved from apps/console/src/lib/runStatus.tsx) ──

export interface RunStatusStyle {
  label: string;
  dotClass: string;
  textClass: string;
  badgeClass: string;
  icon: string;
}

const RUN_STATUS_STYLES: Record<RunStatus, RunStatusStyle> = {
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

// Named runStatusStyle (not statusStyle) because the legacy StatusValue-keyed
// statusStyle above already owns that name in this module. The console's
// lib/runStatus shim re-exports this as `statusStyle` for its existing callers.
export function runStatusStyle(status: RunStatus): RunStatusStyle {
  return RUN_STATUS_STYLES[status];
}
