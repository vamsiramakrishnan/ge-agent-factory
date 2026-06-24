import { useMemo } from "react";
import { ArrowLeft } from "lucide-react";
import { SpecCanvas } from "../components/interview/SpecCanvas";
import { slugify } from "../lib/startInterview";

/**
 * Standalone spec review (deep link `#/spec-review/:usecaseId`).
 *
 * The readiness gates + inline editing + Register button now live in SpecCanvas
 * (absorbed from the old bespoke page). This view is a thin shell that resolves the
 * use case id and renders the canvas in standalone mode (loads the authoritative
 * spec on mount — there is no live interview run feeding it here).
 */
function restoredUsecaseId(): string {
  try {
    const generated = JSON.parse(window.localStorage.getItem("ge.interview.generatedSpec") || "{}");
    if (typeof generated.id === "string" && generated.id.trim()) return generated.id;
  } catch {
    // Ignore stale local state.
  }
  try {
    const seed = JSON.parse(window.localStorage.getItem("ge.interview.seed") || "{}");
    if (typeof seed.outcome === "string" && seed.outcome.trim()) return slugify(seed.outcome);
  } catch {
    // Ignore stale local state.
  }
  return "new-agent";
}

export default function SpecReview({ usecaseId }: { usecaseId?: string }) {
  const resolvedUsecaseId = useMemo(() => usecaseId || restoredUsecaseId(), [usecaseId]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex flex-wrap items-end justify-between gap-3 border-b border-outline-variant/40 px-6 py-4">
        <div>
          <a href="#/journey" className="inline-flex items-center gap-2 text-xs font-semibold text-secondary hover:text-on-surface">
            <ArrowLeft className="h-4 w-4" />
            Pipeline
          </a>
          <h1 className="mt-2 text-xl font-bold text-on-surface">Generated spec review</h1>
          <p className="mt-1 max-w-2xl text-sm text-secondary">
            Inspect, edit, and register the artifact produced by the interview before it enters the build pipeline.
          </p>
        </div>
        <a href="#/interview" className="rounded-md border border-outline-variant/50 px-3 py-1.5 text-xs font-medium text-secondary hover:bg-surface-container">
          Open Interview
        </a>
      </div>
      <div className="min-h-0 flex-1 p-4">
        <div className="mx-auto h-full max-w-4xl overflow-hidden rounded-lg border border-outline-variant/40 bg-surface">
          <SpecCanvas usecaseId={resolvedUsecaseId} task={null} events={[]} standalone />
        </div>
      </div>
    </div>
  );
}
