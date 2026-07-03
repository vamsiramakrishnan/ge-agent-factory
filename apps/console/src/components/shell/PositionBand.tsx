import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { CommandChip, statusToneClasses, type StatusTone } from "@ge/ui";
import { ge, type GoldenPathPosition, type GoldenPathStage } from "../../services/geClient";

// Slim golden-path band under the TopBar: capture → prove → handoff with the
// current stage lit, the blocker (if any), and the exact next command as a
// copyable chip. Semantics come from the server — GET /api/ge/position wraps
// the same goldenPathPosition() that renders the bare-`ge` board — so the
// console shell and the terminal can never disagree about where you are.
//
// Tones reuse the shared status ramp (packages/ui/src/status.ts): passed for
// done stages, running for the current one, queued for pending, failed for
// the blocker — the same semantics as the CS-2 board.
//
// Lazy poll (load + every 45s); hides itself entirely when the API is
// unavailable rather than crashing or nagging.

function stageTone(stage: GoldenPathStage, current: string): StatusTone {
  if (stage.done) return "passed";
  if (stage.id === current) return "running";
  return "queued";
}

// The capture stage's front door is the console Interview.
const STAGE_LINKS: Partial<Record<GoldenPathStage["id"], string>> = {
  capture: "#/interview",
};

export function PositionBand() {
  const { data } = useQuery({
    queryKey: ["goldenPathPosition"],
    queryFn: async (): Promise<GoldenPathPosition | null> => {
      try {
        return await ge.position();
      } catch {
        // best-effort: API unavailable (older server, network) — hide the band.
        return null;
      }
    },
    refetchInterval: 45_000,
    staleTime: 30_000,
    retry: false,
  });

  if (!data || !Array.isArray(data.stages) || data.stages.length === 0) return null;

  const blockerTone = statusToneClasses("failed");

  return (
    <div
      className="flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-outline-variant/60 bg-surface px-6 py-1.5 text-xs"
      aria-label="Golden path position"
    >
      <span className="select-none text-4xs font-semibold uppercase tracking-wide text-secondary">
        Golden path
      </span>

      <div className="flex items-center gap-1">
        {data.stages.map((stage, index) => {
          const tone = statusToneClasses(stageTone(stage, data.current));
          const isCurrent = stage.id === data.current && !stage.done;
          const chip = (
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-mono text-3xs ${tone.badge} ${isCurrent ? "font-semibold" : ""}`}
              title={stage.detail}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} aria-hidden />
              {stage.id}
            </span>
          );
          const link = STAGE_LINKS[stage.id];
          return (
            <span key={stage.id} className="flex items-center gap-1">
              {link ? (
                <a href={link} className="rounded-full transition-opacity hover:opacity-80" title={stage.detail}>
                  {chip}
                </a>
              ) : (
                chip
              )}
              {index < data.stages.length - 1 && (
                <ChevronRight className="h-3 w-3 text-outline-variant" aria-hidden />
              )}
            </span>
          );
        })}
      </div>

      {data.blocker && (
        <span
          className={`inline-flex min-w-0 items-center gap-1.5 rounded-full border px-2 py-0.5 text-3xs ${blockerTone.badge}`}
          title={data.blocker}
        >
          <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${blockerTone.dot}`} aria-hidden />
          <span className="truncate">{data.blocker}</span>
        </span>
      )}

      {data.next && (
        <span className="ml-auto flex items-center gap-1.5">
          <span className="select-none text-4xs font-semibold uppercase tracking-wide text-secondary">
            Next
          </span>
          <CommandChip command={data.next} />
        </span>
      )}
    </div>
  );
}
