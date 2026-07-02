import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, Circle, Radio, TriangleAlert } from "lucide-react";
import { createArtifactParser } from "./artifacts/parser";
import type { GeEvent } from "../../services/geClient";

/**
 * The interview's streamed agent turns rendered as readable prose.
 *
 * antigravity.text_delta events carry the agent's narration AND the inline
 * <artifact identifier="agent-spec"> spec (which the SpecCanvas renders). We run a
 * dedicated artifact parser here purely to STRIP the artifact body out of the
 * transcript, so the left pane shows prose and the right pane shows the spec.
 *
 * A compact progress strip beneath the prose surfaces non-text lifecycle events
 * (tool calls, stage transitions, failures) so the run never looks stalled.
 */
export function InterviewTranscript({ events }: { events: GeEvent[] }) {
  const parserRef = useRef(createArtifactParser());
  const processedRef = useRef(0);
  const [prose, setProse] = useState("");
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (events.length < processedRef.current) {
      parserRef.current = createArtifactParser();
      processedRef.current = 0;
      setProse("");
    }
    if (events.length === processedRef.current) return;
    const fresh = events.slice(processedRef.current);
    processedRef.current = events.length;
    let added = "";
    for (const ev of fresh) {
      if (ev.type !== "antigravity.text_delta") continue;
      const text = ev.data?.value ?? ev.data?.delta ?? ev.line;
      if (typeof text !== "string" || !text) continue;
      for (const artifactEvent of parserRef.current.feed(text)) {
        if (artifactEvent.type === "text") added += artifactEvent.delta;
      }
    }
    if (added) setProse((prev) => prev + added);
  }, [events]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [prose]);

  const progress = useMemo(() => lifecycleEvents(events), [events]);
  const trimmed = prose.trim();
  // A terminal lifecycle event settles the transcript; until then the run is live
  // and the prose gets a quiet typing caret.
  const settled = useMemo(
    () => events.some((event) => event.type === "task_done" || event.type === "task_failed"),
    [events],
  );

  return (
    <div className="space-y-3">
      <h3 className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-secondary">
        <Radio className="h-4 w-4" aria-hidden />
        Agent
      </h3>
      <div
        role="log"
        aria-live="polite"
        aria-label="Agent narration"
        className="max-h-80 overflow-y-auto rounded-md border border-outline-variant/30 bg-surface-container/25 px-4 py-3"
      >
        {trimmed ? (
          <p className="text-sm leading-6 text-on-surface whitespace-pre-wrap">
            {trimmed}
            {!settled && (
              <span
                aria-hidden
                className="ml-1 inline-block h-3.5 w-[7px] translate-y-0.5 rounded-[1px] bg-primary/70 animate-pulse motion-reduce:animate-none"
              />
            )}
          </p>
        ) : (
          <p className="py-6 text-center text-sm text-secondary">The agent's narration will stream here.</p>
        )}
        <div ref={bottomRef} />
      </div>
      {progress.length > 0 && (
        <div className="rounded-md border border-outline-variant/30 bg-on-surface/[0.02]">
          {progress.map((event, index) => (
            <ProgressRow key={`${event.ts || "event"}-${index}`} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}

function lifecycleEvents(events: GeEvent[]): GeEvent[] {
  return events
    .filter((event) =>
      [
        "stage_started",
        "stage_done",
        "stage_failed",
        "task_done",
        "task_failed",
        "antigravity.session_started",
        "antigravity.tool_call",
        "antigravity.tool_result",
        "antigravity.tool_error",
        "antigravity.structured_output",
        "antigravity.usage",
      ].includes(event.type) || event.level === "error",
    )
    .slice(-8);
}

function ProgressRow({ event }: { event: GeEvent }) {
  const failed = event.level === "error" || /failed|error/.test(event.type);
  const done = /done|result/.test(event.type);
  const Icon = failed ? TriangleAlert : done ? CheckCircle2 : Circle;
  const tone = failed ? "text-amber-700" : done ? "text-emerald-700" : "text-secondary";
  return (
    <div className="flex items-center gap-2 border-b border-outline-variant/20 px-3 py-1.5 last:border-b-0">
      <Icon className={`h-3.5 w-3.5 shrink-0 ${tone}`} />
      <span className={`truncate text-[11px] font-medium ${tone}`}>{label(event)}</span>
      <span className="ml-auto shrink-0 text-[10px] text-secondary">{event.ts ? new Date(event.ts).toLocaleTimeString() : ""}</span>
    </div>
  );
}

function label(event: GeEvent): string {
  switch (event.type) {
    case "antigravity.session_started": return "Session started";
    case "antigravity.tool_call": return `Tool call${event.data?.name ? `: ${event.data.name}` : ""}`;
    case "antigravity.tool_result": return "Tool result";
    case "antigravity.tool_error": return "Tool error";
    case "antigravity.structured_output": return "Structured output";
    case "antigravity.usage": return "Token usage";
    case "stage_started": return `${event.stage || "stage"} started`;
    case "stage_done": return `${event.stage || "stage"} completed`;
    case "stage_failed": return `${event.stage || "stage"} failed`;
    case "task_done": return "Interview completed";
    case "task_failed": return "Interview failed";
    default: return event.line || event.type.replaceAll("_", " ");
  }
}
