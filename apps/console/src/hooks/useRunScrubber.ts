import { useMemo } from "react";
import type { LedgerEvent } from "../services/geClient";
import {
  applyEvent,
  createRunAccumulator,
  isStageLogFrame,
  orderStages,
  type RunStageView,
} from "@ge/run-ledger/reduce";
import type { RunStatus } from "../lib/runStatus";

// Run replay, console side. A finished run is just its ordered event list, and
// the ledger reducer is pure — so "the run at position N" is a fold over the
// first N events. Scrubbing re-folds from zero each move: event lists are
// small (hundreds) and the reducer is O(events), so this stays instant and
// needs no incremental-state bookkeeping.
export interface ScrubSnapshot {
  stages: RunStageView[];
  status: RunStatus;
  lastEvent: LedgerEvent | null;
}

export function scrubSnapshot(events: LedgerEvent[], position: number): ScrubSnapshot {
  const acc = createRunAccumulator();
  const end = Math.max(0, Math.min(position, events.length));
  for (let i = 0; i < end; i += 1) {
    const ev = events[i];
    if (ev.stage && !acc.firstSeen.includes(ev.stage)) acc.firstSeen.push(ev.stage);
    if (isStageLogFrame(ev)) continue;
    applyEvent(ev, acc.stages, acc.signals);
  }
  return {
    stages: orderStages(acc.stages, acc.firstSeen),
    status: acc.signals.status,
    lastEvent: end > 0 ? events[end - 1] : null,
  };
}

export function useRunScrubber(events: LedgerEvent[], position: number | null): ScrubSnapshot | null {
  return useMemo(
    () => (position == null ? null : scrubSnapshot(events, position)),
    [events, position],
  );
}
