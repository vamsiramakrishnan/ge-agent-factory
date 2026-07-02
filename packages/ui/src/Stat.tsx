import type { ReactNode } from "react";
import { cx } from "./cx";

// The one label-over-value stat tile. Replaces four near-identical local
// implementations (Pipeline MetricPill, AgentDetail Metric, RepairQueue
// Metric, and the ad-hoc header stats): same structure, two sizes.
export interface StatProps {
  label: ReactNode;
  /** Value node — a string, a count, or a <StatusChip>. */
  value: ReactNode;
  size?: "sm" | "md";
  className?: string;
  title?: string;
}

export function Stat({ label, value, size = "sm", className, title }: StatProps) {
  return (
    <div
      title={title}
      className={cx(
        "border border-outline-variant/40 bg-surface",
        size === "sm" ? "rounded-md px-3 py-2" : "rounded-lg px-4 py-3",
        className,
      )}
    >
      <div className="text-[10px] font-semibold uppercase tracking-wide text-secondary">{label}</div>
      <div className={cx("text-on-surface", size === "sm" ? "text-xs font-semibold truncate" : "mt-0.5 text-xl font-semibold")}>{value}</div>
    </div>
  );
}
