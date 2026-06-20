// Type surface for reduce.mjs — the pure frames→state reducer.
import type { RunStatus } from "./status";
import type { LedgerEvent } from "./frames";

export interface StageAccumulator {
  id: string;
  name: string;
  status: RunStatus;
  startedAt?: number;
  endedAt?: number;
  lastLine?: string;
}

export interface RunStageView {
  id: string;
  name: string;
  status: RunStatus;
  startedAt?: number;
  endedAt?: number;
  elapsedMs: number;
  lastLine?: string;
}

export interface RunSignals {
  active: string | null;
  status: RunStatus;
  blockedReason: string | null;
  complete: boolean;
}

export interface RunAccumulator {
  stages: Map<string, StageAccumulator>;
  firstSeen: string[];
  signals: RunSignals;
}

export declare const CANONICAL_ORDER: string[];

export declare function parseTs(ts?: string | null): number | undefined;
export declare function createRunAccumulator(): RunAccumulator;
export declare function applyEvent(
  ev: LedgerEvent,
  stages: Map<string, StageAccumulator>,
  signals: RunSignals,
): { tailLine?: string };
export declare function orderStages(
  stages: Map<string, StageAccumulator>,
  firstSeen: string[],
  now?: number,
): RunStageView[];
export declare function isStageLogFrame(ev: Partial<LedgerEvent> | null | undefined): boolean;
