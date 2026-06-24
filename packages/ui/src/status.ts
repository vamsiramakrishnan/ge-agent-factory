// Shared status vocabulary → operator-facing label + Tailwind tone. The single source
// for status colour across every GE surface (lifted from the console StatusPill).

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
