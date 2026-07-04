import { useState, useEffect, useRef } from "react";
import { Search, Trash2, Wifi } from "lucide-react";
import { streamLogs, type GeEvent } from "../services/geClient";

interface LogStreamProps {
  runId: string | null;
  stage: string;
  item?: string;
}

interface DisplayEvent extends GeEvent {
  id: number;
}

// Minimal ANSI SGR parser: handles foreground colors 30-37, 90-97, and reset (0/39)
function ansiToSegments(line: string): { text: string; className: string }[] {
  const segments: { text: string; className: string }[] = [];
  const regex = /\x1b\[([0-9;]+)m/g;
  let lastIndex = 0;
  let currentClass = "";

  const colorMap: Record<string, string> = {
    "31": "text-rose-500",
    "32": "text-emerald-500",
    "33": "text-amber-500",
    "34": "text-blue-500",
    "36": "text-cyan-500",
    "90": "text-slate-500",
    "91": "text-rose-400",
    "92": "text-emerald-400",
    "93": "text-amber-400",
    "94": "text-blue-400",
    "96": "text-cyan-400",
  };

  let match: RegExpExecArray | null;
  while ((match = regex.exec(line)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ text: line.slice(lastIndex, match.index), className: currentClass });
    }
    const codes = match[1].split(";");
    for (const code of codes) {
      if (code === "0" || code === "39") {
        currentClass = "";
      } else if (colorMap[code]) {
        currentClass = colorMap[code];
      }
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < line.length) {
    segments.push({ text: line.slice(lastIndex), className: currentClass });
  }

  // If no segments, return the whole line as-is (no ANSI codes)
  return segments.length > 0 ? segments : [{ text: line, className: "" }];
}

export function LogStream({ runId, stage, item }: LogStreamProps) {
  const [events, setEvents] = useState<DisplayEvent[]>([]);
  const [filter, setFilter] = useState("");
  const [follow, setFollow] = useState(true);
  // Connection state for the reconnect chip: drops to true when the SSE
  // transport blips, clears as soon as lines (or onopen) resume.
  const [reconnecting, setReconnecting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const eventIdRef = useRef(0);

  useEffect(() => {
    if (!runId) {
      setEvents([]);
      setReconnecting(false);
      return;
    }

    setReconnecting(false);
    const unsubscribe = streamLogs(
      runId,
      stage,
      (evt) => {
        // Lines are flowing again — clear any reconnect indicator.
        setReconnecting(false);
        setEvents((prev) => {
          const newEvent = { ...evt, id: eventIdRef.current++ };
          const updated = [...prev, newEvent];
          // Cap at 5000 events
          return updated.length > 5000 ? updated.slice(-5000) : updated;
        });
      },
      item,
      (status) => setReconnecting(status === "reconnecting")
    );

    return () => {
      unsubscribe();
    };
  }, [runId, stage, item]);

  useEffect(() => {
    if (follow && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events, follow]);

  if (!runId) {
    return (
      <div className="flex items-center justify-center h-full text-secondary">
        <p>Waiting for a run…</p>
      </div>
    );
  }

  const filterLower = filter.toLowerCase();
  const filteredEvents = filter
    ? events.filter((e) => {
        if (e.type === "log" && e.line) return e.line.toLowerCase().includes(filterLower);
        if (e.stage) return e.stage.toLowerCase().includes(filterLower);
        return false;
      })
    : events;

  // Render only last 1000 filtered rows for performance
  const displayEvents = filteredEvents.slice(-1000);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-2 border-b border-outline-variant bg-surface-container">
        <div className="flex-1 flex items-center gap-2 px-2 py-1 bg-surface rounded border border-outline">
          <Search className="w-4 h-4 text-secondary" />
          <input
            type="text"
            placeholder="Filter logs..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="flex-1 bg-transparent text-sm outline-none text-on-surface placeholder:text-secondary"
          />
        </div>
        {reconnecting && (
          <span
            className="px-2 py-1 text-xs font-medium rounded inline-flex items-center gap-1.5 bg-status-warning/10 text-status-warning-ink border border-status-warning/30"
            title="Log stream dropped; reconnecting automatically"
          >
            <Wifi className="w-3 h-3 animate-pulse" />
            Reconnecting…
          </span>
        )}
        <button
          onClick={() => setFollow(!follow)}
          aria-pressed={follow}
          className={`key inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
            follow
              ? "border-outline/70 bg-surface font-semibold text-on-surface"
              : "border-outline/50 bg-surface-container-low text-secondary hover:text-on-surface"
          }`}
        >
          {follow && <span className="lamp h-1.5 w-1.5 rounded-full bg-primary" aria-hidden />}
          Follow
        </button>
        <button
          onClick={() => setEvents([])}
          className="key inline-flex items-center gap-1.5 rounded-full border border-outline/50 bg-surface-container-low px-3 py-1 text-xs font-medium text-secondary transition-colors hover:text-on-surface"
        >
          <Trash2 className="w-3 h-3" />
          Clear
        </button>
      </div>

      <div
        ref={containerRef}
        className="dial-window flex-1 overflow-auto rounded-none border-x-0 border-b-0 font-mono text-xs p-2"
      >
        {displayEvents.map((evt, idx) => {
          if (evt.type === "log") {
            // Dark terminal surface: lighter -400 shades stay legible on
            // slate-900, unlike the AA-on-light-surface status ramp tokens.
            const levelClass =
              evt.level === "error"
                ? "text-rose-400"
                : evt.level === "warn"
                  ? "text-amber-400"
                  : "";
            const segments = evt.line ? ansiToSegments(evt.line) : [];
            return (
              <div key={evt.id} className="leading-snug">
                <span className="text-white/30 select-none mr-2">{idx + 1}</span>
                <span className={levelClass}>
                  {segments.map((seg, si) => (
                    <span key={si} className={seg.className}>
                      {seg.text}
                    </span>
                  ))}
                </span>
              </div>
            );
          }

          if (evt.type === "stage_started" || evt.type === "stage_done" || evt.type === "stage_failed") {
            const color =
              evt.type === "stage_done"
                ? "text-emerald-400"
                : evt.type === "stage_failed"
                  ? "text-rose-400"
                  : "text-blue-400";
            return (
              <div key={evt.id} className={`border-t border-white/15 mt-1 pt-1 ${color} font-semibold`}>
                {evt.type.replace(/_/g, " ").toUpperCase()}: {evt.stage}
              </div>
            );
          }

          if (evt.type === "metric" || evt.type === "artifact") {
            return (
              <div key={evt.id} className="text-cyan-400 text-3xs">
                [{evt.type}] {JSON.stringify(evt.data)}
              </div>
            );
          }

          return null;
        })}
      </div>
    </div>
  );
}
