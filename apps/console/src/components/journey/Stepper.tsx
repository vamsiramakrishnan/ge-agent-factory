import { Check } from "lucide-react";

export interface StepDef {
  id: number;
  label: string;
}

/**
 * Slim wizard header. Renders the numbered steps (1 Source · 2 Configure · 3 Review)
 * with completed/active/upcoming states. Completed steps are clickable so the
 * operator can jump back without losing state; upcoming steps are inert.
 *
 * Reduced-motion friendly: transitions are colour-only, no layout animation.
 */
export function Stepper({
  steps,
  current,
  onStep,
}: {
  steps: StepDef[];
  current: number;
  onStep: (id: number) => void;
}) {
  return (
    <nav aria-label="Pipeline steps" className="flex items-center gap-2 sm:gap-3">
      {steps.map((step, index) => {
        const completed = step.id < current;
        const active = step.id === current;
        const clickable = completed;
        return (
          <div key={step.id} className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => clickable && onStep(step.id)}
              disabled={!clickable}
              aria-current={active ? "step" : undefined}
              className={
                "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors " +
                (active
                  ? "bg-primary/10 text-primary"
                  : completed
                    ? "text-on-surface hover:bg-surface-container"
                    : "text-secondary") +
                (clickable ? " cursor-pointer" : " cursor-default")
              }
            >
              <span
                className={
                  "flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold transition-colors " +
                  (active
                    ? "bg-primary text-white"
                    : completed
                      ? "bg-emerald-500/15 text-emerald-700"
                      : "bg-surface-container text-secondary")
                }
              >
                {completed ? <Check className="h-3.5 w-3.5" /> : step.id}
              </span>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
            {index < steps.length - 1 && (
              <span
                className={
                  "h-px w-6 sm:w-10 " + (step.id < current ? "bg-emerald-500/40" : "bg-outline-variant/50")
                }
                aria-hidden
              />
            )}
          </div>
        );
      })}
    </nav>
  );
}
