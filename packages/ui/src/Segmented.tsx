import type { ReactNode } from "react";
import { cx } from "./cx";

// One segmented control for the four hand-rolled variants (Pipeline scope
// toggle, Activity filter pills, Doctor scope buttons, AgentDetail stage
// filter): a bordered pill container with one active segment.
export interface SegmentedOption<V extends string = string> {
  value: V;
  label: ReactNode;
  /** Optional trailing count badge. */
  count?: number;
}

export interface SegmentedProps<V extends string = string> {
  options: Array<SegmentedOption<V>>;
  value: V;
  onChange: (value: V) => void;
  className?: string;
  "aria-label"?: string;
}

export function Segmented<V extends string = string>({ options, value, onChange, className, ...aria }: SegmentedProps<V>) {
  return (
    <div role="group" {...aria} className={cx("inline-flex rounded-lg border border-outline-variant/30 bg-surface p-1", className)}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cx(
              "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              active ? "bg-primary text-on-primary" : "text-secondary hover:bg-surface-container hover:text-on-surface",
            )}
          >
            {option.label}
            {option.count != null && (
              <span className={cx("rounded-full px-1.5 text-[10px] font-semibold", active ? "bg-white/20" : "bg-surface-container text-secondary")}>
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
