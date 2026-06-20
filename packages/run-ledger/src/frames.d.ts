// Type surface for frames.mjs — the shared frame/event schema.

// One ledger event as it rides over SSE / Firestore.
export interface LedgerEvent {
  seq?: number;
  ts?: string;
  type: string;
  stage?: string | null;
  status?: string;
  workItemId?: string | null;
  error?: string | null;
  data?: Record<string, any> | null;
  ok?: boolean | null;
}

export declare const STAGE_LOG_TYPE: "stage_log";
export declare const RUN_COMPLETE_TYPE: "run_complete";

export declare function nextEventSeq(): number;
export declare function stageLogLines(frame: Partial<LedgerEvent> | null | undefined): string[];
export declare function stageLogFrameData(lines: string[]): { lines: string[] };
