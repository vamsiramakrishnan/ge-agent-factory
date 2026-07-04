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

// Rendered as a physical selector switch: a recessed track (tokens.css
// .well) in which the engaged option is a raised, machined key with a lit
// indicator lamp — state is shown the way the chassis shows it everywhere
// else (the lamp), never by flooding the control with color.
export function Segmented<V extends string = string>({ options, value, onChange, className, ...aria }: SegmentedProps<V>) {
  return (
    <div role="group" {...aria} className={cx("well inline-flex rounded-full bg-surface-container p-1", className)}>
      {options.map((option) => {
        const active = option.value === value;
        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option.value)}
            className={cx(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
              active ? "key bg-surface font-semibold text-on-surface" : "text-secondary hover:text-on-surface",
            )}
          >
            {active && <span className="lamp h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />}
            {option.label}
            {option.count != null && (
              <span className={cx("rounded-full px-1.5 text-4xs font-semibold tabular-nums", active ? "bg-surface-container text-secondary" : "text-secondary")}>
                {option.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
