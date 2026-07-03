import { ArrowRight, Check, MessageSquareText, Rocket, Send, Stethoscope, X } from "lucide-react";

// First-run guided walkthrough. Rendered only while the product is genuinely empty
// (no agents, no runs) — the moment there's real state, the live dashboards
// take over. Each step says what it is, how much effort it takes, and derives
// its done-state from live data, so the card doubles as a resume point if the
// user leaves halfway through.
export interface GetStartedState {
  hasAgents: boolean;
  hasRuns: boolean;
  hasDeployed: boolean;
  mode: string;
  onDismiss: () => void;
}

interface StepDef {
  key: string;
  title: string;
  effort: string;
  detail: string;
  done: boolean;
  cta: { label: string; hash: string };
  Icon: typeof Rocket;
}

export function GetStartedCard({ hasAgents, hasRuns, hasDeployed, mode, onDismiss }: GetStartedState) {
  const steps: StepDef[] = [
    {
      key: "build",
      title: "Build your first agent",
      effort: "one guided flow · ~5 min",
      detail: mode === "remote"
        ? "Pick a registered spec (or interview a new one) — the cloud factory builds it for you."
        : "Pick a registered spec (or interview a new one) — it builds on this machine, no cloud credentials needed.",
      done: hasAgents || hasRuns,
      cta: { label: "Open Pipeline", hash: "#/pipeline" },
      Icon: MessageSquareText,
    },
    {
      key: "watch",
      title: "Watch it run, live",
      effort: "zero effort · it follows you",
      detail: "Every run streams stage-by-stage into the run drawer and the Runs timeline. Close the tab mid-run — it reattaches when you come back.",
      done: hasRuns,
      cta: { label: "Open Runs", hash: "#/activity" },
      Icon: Rocket,
    },
    {
      key: "handoff",
      title: "Hand it off to the cloud",
      effort: "one click · deploy → register → publish",
      detail: "When the local build reaches the boundary, the handoff sends it to the cloud factory, which deploys and publishes it end to end.",
      done: hasDeployed,
      cta: { label: "Open Fleet", hash: "#/fleet" },
      Icon: Send,
    },
  ];
  const firstOpen = steps.findIndex((step) => !step.done);
  const started = hasAgents || hasRuns;

  return (
    <div className="editorial-micro-card rounded-lg p-5 mb-6">
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 mb-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-secondary mb-1">Get started</div>
          <h2 className="text-lg font-semibold text-on-surface">From use case to running agent — three steps</h2>
          <p className="text-sm text-secondary mt-1 max-w-2xl">
            {started
              ? "Pick up where you left off — your progress below is live."
              : "Nothing here yet — that's expected on a fresh factory. The first agent takes about five minutes."}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <a
            href="#/doctor"
            className="inline-flex items-center gap-1.5 rounded-lg border border-outline/30 px-3 py-2 text-sm font-medium text-on-surface transition-colors hover:bg-surface-container"
          >
            <Stethoscope className="w-4 h-4" />
            Not sure this machine is ready? Run Readiness (~1 min)
          </a>
          <button
            onClick={onDismiss}
            className="rounded-lg p-2 text-secondary transition-colors hover:bg-surface-container hover:text-on-surface"
            title="Dismiss the getting-started guide"
            aria-label="Dismiss the getting-started guide"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <ol className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {steps.map((step, index) => {
          const active = index === firstOpen;
          return (
            <li
              key={step.key}
              className={`rounded-lg border p-4 ${
                step.done
                  ? "border-primary/30 bg-primary/5"
                  : active
                    ? "border-primary/50 bg-surface"
                    : "border-outline-variant/30 bg-surface"
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`inline-flex items-center justify-center w-5 h-5 rounded-full text-3xs font-semibold ${
                    step.done ? "bg-primary text-white" : active ? "bg-primary/15 text-primary" : "bg-surface-container text-secondary"
                  }`}
                >
                  {step.done ? <Check className="w-3 h-3" /> : index + 1}
                </span>
                <span className="text-sm font-semibold text-on-surface">{step.title}</span>
              </div>
              <div className="text-3xs font-medium text-primary mb-1.5">{step.effort}</div>
              <p className="text-xs leading-5 text-secondary mb-3">{step.detail}</p>
              {active && (
                <a
                  href={step.cta.hash}
                  className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-container"
                >
                  {step.cta.label}
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
