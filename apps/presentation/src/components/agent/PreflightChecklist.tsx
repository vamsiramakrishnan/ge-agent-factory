import React from "react";
import { CheckCircle2, TriangleAlert, MinusCircle, Loader2 } from "lucide-react";
import type { PreflightCheck, PreflightCheckStatus } from "../../services/factoryClient";

/**
 * Renders the structured `checks[]` returned by `preflightTarget` as a per-check
 * list instead of a single collapsed pass/fail badge. Each row surfaces the check
 * label, a status glyph, and the inline detail string (project id, missing APIs,
 * service-account email, etc.) so an operator can see exactly which gate failed.
 */

const STATUS_STYLE: Record<PreflightCheckStatus, { Icon: typeof CheckCircle2; iconClass: string; rowClass: string; labelClass: string }> = {
  pass: {
    Icon: CheckCircle2,
    iconClass: "text-emerald-600",
    rowClass: "bg-emerald-50/60 border-emerald-200/60",
    labelClass: "text-on-surface",
  },
  fail: {
    Icon: TriangleAlert,
    iconClass: "text-red-600",
    rowClass: "bg-red-50/70 border-red-200/70",
    labelClass: "text-red-700",
  },
  skipped: {
    Icon: MinusCircle,
    iconClass: "text-secondary/40",
    rowClass: "bg-surface-container/50 border-outline-variant/20",
    labelClass: "text-secondary/55",
  },
};

export interface PreflightChecklistProps {
  checks: PreflightCheck[] | null;
  busy?: boolean;
  /** Whole-run message (e.g. "2 of 8 preflight checks failed: ..."). Shown as a footer summary. */
  message?: string | null;
}

export function PreflightChecklist({ checks, busy, message }: PreflightChecklistProps) {
  if (busy && (!checks || checks.length === 0)) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-outline-variant/20 bg-surface-container/60 px-3 py-2.5 text-[10px] text-secondary/60">
        <Loader2 className="w-3.5 h-3.5 animate-spin text-primary" />
        Running preflight checks against the target project…
      </div>
    );
  }

  if (!checks || checks.length === 0) return null;

  const failed = checks.filter((c) => c.status === "fail").length;

  return (
    <div className="rounded-lg border border-outline-variant/20 bg-surface-container/40 p-2.5 animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[8px] font-headline font-bold uppercase tracking-[0.14em] text-secondary/55">Preflight Checks</span>
        <span
          className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${
            failed === 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"
          }`}
        >
          {failed === 0 ? `${checks.length} passed` : `${failed} failed`}
        </span>
      </div>

      <ul className="space-y-1.5">
        {checks.map((check) => {
          const style = STATUS_STYLE[check.status] ?? STATUS_STYLE.skipped;
          const Icon = style.Icon;
          return (
            <li key={check.id} className={`flex items-start gap-2 rounded-md border px-2.5 py-1.5 ${style.rowClass}`}>
              <Icon className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${style.iconClass}`} strokeWidth={2.5} />
              <div className="min-w-0 flex-1">
                <div className={`text-[10px] font-headline font-bold leading-tight ${style.labelClass}`}>{check.label}</div>
                {check.detail && (
                  <div className="font-mono text-[9px] text-secondary/60 mt-0.5 break-words leading-snug">{check.detail}</div>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {message && (
        <div className="mt-2 pt-2 border-t border-outline-variant/15 text-[9px] font-medium text-secondary/55">{message}</div>
      )}
    </div>
  );
}
