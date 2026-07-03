// Shared status vocabulary → operator-facing label + Tailwind tone. The single source
// for status colour across every GE surface. Every tone traces to the status ramp
// defined once in packages/design/src/tokens.css (--color-status-*): queued (slate),
// running (blue — reuses --color-primary, "blue means live"), passed (green — reuses
// --color-tertiary), failed (red), blocked (orange), repairing (teal), warning (gold).
// A caller anywhere in the console should reach for statusTone()/statusStyle()/
// runStatusStyle() instead of writing a literal emerald-500/rose-700/etc class — that
// literal is exactly the kind of rogue value the token system exists to prevent.
//
// Two vocabularies live here on purpose:
//   1. StatusValue/statusLabel/statusStyle — the loose legacy vocabulary behind
//      <StatusPill> (doctor checks, plane up/down, fleet byStatus buckets).
//   2. RunStatus/normalizeStatus/runStatusStyle — the run-follow vocabulary
//      behind <StatusChip>. The framework-agnostic normalization (including
//      cancelled/timeout→failed) is owned by @ge/run-ledger/status; this module
//      re-exports it and owns the one Tailwind palette for it.

import { normalizeStatus, type RunStatus } from "@ge/run-ledger/status";

export { normalizeStatus };
export type { RunStatus };

export type StatusValue = "pass" | "warn" | "fail" | "up" | "down" | "none" | string;

// The seven-hue semantic ramp. Every status tone in the console reduces to one
// of these — pick the closest meaning rather than inventing an eighth.
export type StatusTone = "queued" | "running" | "passed" | "failed" | "blocked" | "repairing" | "warning";

const TONE_LABELS: Record<StatusTone, string> = {
  queued: "Queued",
  running: "Running",
  passed: "Passed",
  failed: "Failed",
  blocked: "Blocked",
  repairing: "Repairing",
  warning: "Needs attention",
};

// className fragments for the ramp: `dot` (solid fill, for status dots/icons),
// `text` (the AA-safe "-ink" shade, for text on light backgrounds), `badge`
// (the pill recipe: soft tint + border + ink text).
const TONE_CLASSES: Record<StatusTone, { dot: string; text: string; badge: string }> = {
  queued: { dot: "bg-status-queued", text: "text-status-queued-ink", badge: "border-status-queued/25 bg-status-queued/10 text-status-queued-ink" },
  running: { dot: "bg-status-running", text: "text-status-running-ink", badge: "border-status-running/25 bg-status-running/10 text-status-running-ink" },
  passed: { dot: "bg-status-passed", text: "text-status-passed-ink", badge: "border-status-passed/25 bg-status-passed/10 text-status-passed-ink" },
  failed: { dot: "bg-status-failed", text: "text-status-failed-ink", badge: "border-status-failed/25 bg-status-failed/10 text-status-failed-ink" },
  blocked: { dot: "bg-status-blocked", text: "text-status-blocked-ink", badge: "border-status-blocked/25 bg-status-blocked/10 text-status-blocked-ink" },
  repairing: { dot: "bg-status-repairing", text: "text-status-repairing-ink", badge: "border-status-repairing/25 bg-status-repairing/10 text-status-repairing-ink" },
  warning: { dot: "bg-status-warning", text: "text-status-warning-ink", badge: "border-status-warning/25 bg-status-warning/10 text-status-warning-ink" },
};

export function statusToneClasses(tone: StatusTone) {
  return TONE_CLASSES[tone];
}

export function statusToneLabel(tone: StatusTone) {
  return TONE_LABELS[tone];
}

// Legacy StatusValue → one of the seven tones. Kept permissive (falls through
// to "queued") because callers pass whatever verb the doctor/fleet/ledger emit.
function toneOf(status: StatusValue): StatusTone {
  const normalized = String(status || "").toLowerCase();
  if (["pass", "up", "ready", "done", "success", "completed"].includes(normalized)) return "passed";
  if (normalized === "running" || normalized === "active" || normalized === "in_progress") return "running";
  if (normalized === "repairing") return "repairing";
  if (normalized === "warn" || normalized === "warning") return "warning";
  if (normalized === "blocked" || normalized === "down") return "blocked";
  if (normalized === "fail" || normalized === "failed" || normalized === "error") return "failed";
  return "queued";
}

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
  repairing: "Repairing",
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

export function statusStyle(status: StatusValue) {
  const tone = TONE_CLASSES[toneOf(status)];
  return { className: `${tone.badge}`, dot: tone.dot };
}

// ── Run-status vocabulary (moved from apps/console/src/lib/runStatus.tsx) ──

export interface RunStatusStyle {
  label: string;
  dotClass: string;
  textClass: string;
  badgeClass: string;
  icon: string;
}

const RUN_TONE: Record<RunStatus, StatusTone> = {
  done: "passed",
  failed: "failed",
  blocked: "blocked",
  running: "running",
  pending: "queued",
};

const RUN_ICON: Record<RunStatus, string> = {
  done: "●",
  failed: "✕",
  blocked: "⏸",
  running: "◐",
  pending: "○",
};

// Named runStatusStyle (not statusStyle) because the legacy StatusValue-keyed
// statusStyle above already owns that name in this module. The console's
// lib/runStatus shim re-exports this as `statusStyle` for its existing callers.
export function runStatusStyle(status: RunStatus): RunStatusStyle {
  const tone = RUN_TONE[status];
  const classes = TONE_CLASSES[tone];
  return {
    label: statusToneLabel(tone) === "Passed" ? "Done" : statusToneLabel(tone),
    dotClass: classes.dot,
    textClass: classes.text,
    badgeClass: `${classes.badge.replace("/25", "/20")}`,
    icon: RUN_ICON[status],
  };
}
