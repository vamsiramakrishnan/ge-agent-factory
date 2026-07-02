import { useEffect, useRef, useState } from "react";
import {
  streamLedgerRun,
  streamLogs,
  type LedgerEvent,
  type StreamStatus,
} from "../services/geClient";
import { type RunStatus } from "../lib/runStatus";
import {
  applyEvent,
  createRunAccumulator,
  isStageLogFrame,
  orderStages,
  type RunStageView,
} from "@ge/run-ledger/reduce";
import { stageLogLines } from "@ge/run-ledger/frames";

const MAX_TAIL = 200; // hard cap on rolling log memory (ledger lines + live logs)
const ACTIVE_TAIL = 40; // rolling tail surfaced to the UI

export type { RunStageView };

export interface RunStreamState {
  runId: string | null;
  status: RunStatus; // overall run status
  stages: RunStageView[]; // ordered
  activeStage: string | null;
  blockedReason: string | null;
  logTail: string[]; // last ~40 lines, ledger + live merged
  reconnecting: boolean;
  complete: boolean;
  hasEvents: boolean;
  // The full ordered event list, retained so a finished run can be REPLAYED:
  // the reducer is pure, so any position in the run is a fold over a prefix
  // of this array (see useRunScrubber).
  events: LedgerEvent[];
}

// Subscribe to a run's live ledger stream and reduce it into an ordered stage
// timeline + rolling log tail. The frame→state reduction (applyEvent/orderStages),
// the frame schema, and status normalization are the framework-agnostic
// @ge/run-ledger core; this hook owns only the EventSource wiring, refs, and
// rendering. For the ACTIVE stage we also attempt a live log tail via streamLogs
// and merge it; this degrades gracefully — remote runs that have no live log
// endpoint simply keep showing the ledger event lines.
export function useRunStream(runId: string | null): RunStreamState {
  const [state, setState] = useState<RunStreamState>(() => emptyState(runId));

  // Mutable accumulators live in refs so reconnect replays don't reset progress.
  const accRef = useRef(createRunAccumulator());
  const tailRef = useRef<string[]>([]);
  const hasEventsRef = useRef(false);
  const eventsRef = useRef<LedgerEvent[]>([]);

  // Re-render at ~1s so running stage elapsed clocks tick without new events.
  const [, setTick] = useState(0);

  useEffect(() => {
    // Reset all accumulators when the followed run changes.
    accRef.current = createRunAccumulator();
    tailRef.current = [];
    hasEventsRef.current = false;
    eventsRef.current = [];
    setState(emptyState(runId));

    if (!runId) return;

    let activeLogStage: string | null = null;
    let unsubLogs: (() => void) | null = null;

    const publish = () => {
      const acc = accRef.current;
      setState({
        runId,
        status: acc.signals.status,
        stages: orderStages(acc.stages, acc.firstSeen),
        activeStage: acc.signals.active,
        blockedReason: acc.signals.blockedReason,
        logTail: tailRef.current.slice(-ACTIVE_TAIL),
        reconnecting: false, // ledger stream is terminal-close, not reconnect-churn
        complete: acc.signals.complete,
        hasEvents: hasEventsRef.current,
        events: eventsRef.current,
      });
    };

    const pushTail = (line: string) => {
      const trimmed = line.trimEnd();
      if (!trimmed) return;
      tailRef.current = [...tailRef.current, trimmed].slice(-MAX_TAIL);
    };

    // Live log tail for the active stage (best-effort; remote runs may 404).
    const ensureLogStream = (stage: string | null) => {
      if (stage === activeLogStage) return;
      if (unsubLogs) { unsubLogs(); unsubLogs = null; }
      activeLogStage = stage;
      if (!stage || !runId) return;
      unsubLogs = streamLogs(
        runId,
        stage,
        (e) => {
          if (typeof e.line === "string" && e.line.trim()) {
            pushTail(e.line);
            publish();
          }
        },
        undefined,
        (_s: StreamStatus) => { /* degrade silently: ledger lines remain the source of truth */ },
      );
    };

    const unsubLedger = streamLedgerRun(runId, (ev) => {
      hasEventsRef.current = true;
      // Retain the raw ordered stream for replay (new array so React memo
      // consumers see the change).
      eventsRef.current = [...eventsRef.current, ev];
      const acc = accRef.current;
      if (ev.stage && !acc.firstSeen.includes(ev.stage)) acc.firstSeen.push(ev.stage);
      // Live command-output frames (remote): text rides in data.lines. Feed the tail
      // directly and skip the synthesized event line + status reduction.
      if (isStageLogFrame(ev)) {
        const lines = stageLogLines(ev);
        for (const l of lines) pushTail(l);
        if (ev.stage && lines.length) {
          const s = acc.stages.get(ev.stage);
          if (s) s.lastLine = String(lines[lines.length - 1]);
        }
        publish();
        return;
      }
      applyEvent(ev, acc.stages, acc.signals);
      // Prefer event line/error for the rolling ledger tail.
      const line = ev.error
        ? `error: ${ev.error}`
        : ev.stage
          ? `[${ev.stage}] ${ev.type.replace(/_/g, " ")}${ev.workItemId ? ` · ${ev.workItemId}` : ""}`
          : ev.type.replace(/_/g, " ");
      if (ev.type !== "run_complete" || ev.error) pushTail(line);
      // Track the active stage's last line for the timeline row.
      if (ev.stage && line) {
        const s = acc.stages.get(ev.stage);
        if (s) s.lastLine = line;
      }
      ensureLogStream(acc.signals.active);
      publish();
    });

    const ticker = window.setInterval(() => {
      if (!accRef.current.signals.complete) setTick((t) => t + 1);
    }, 1000);

    return () => {
      unsubLedger();
      if (unsubLogs) unsubLogs();
      window.clearInterval(ticker);
    };
  }, [runId]);

  // Recompute elapsed on tick without new events (cheap; refs are stable).
  return {
    ...state,
    stages: state.runId ? orderStages(accRef.current.stages, accRef.current.firstSeen) : state.stages,
  };
}

function emptyState(runId: string | null): RunStreamState {
  return {
    runId,
    status: "pending",
    stages: [],
    activeStage: null,
    blockedReason: null,
    logTail: [],
    reconnecting: false,
    complete: false,
    hasEvents: false,
    events: [],
  };
}
