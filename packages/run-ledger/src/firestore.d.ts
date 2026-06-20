// Type surface for firestore.mjs — the lazy Firestore backend.
import type { LedgerEvent } from "./frames";

export declare function normalizeFirestoreLedgerEvent(doc: any, index?: number): LedgerEvent;
export declare function createFirestoreLedgerReader(opts?: {
  projectId?: string;
  databaseId?: string;
  collection?: string;
  db?: any;
}): Promise<{
  events: (runId: string, opts?: { afterSeq?: number; limit?: number }) => Promise<LedgerEvent[]>;
  getRun: (runId: string) => Promise<any>;
  listRuns: (opts?: { limit?: number }) => Promise<any[]>;
  listenEvents: (
    runId: string,
    opts: { afterSeq?: number },
    onEvents: (events: LedgerEvent[]) => void,
    onError?: (err: unknown) => void,
  ) => (() => void) | null;
  db: any;
  projectId?: string;
  databaseId?: string;
  collection?: string;
}>;
export declare function createFirestoreEventMirror(opts?: {
  projectId?: string;
  databaseId?: string;
  collection?: string;
}): Promise<{
  startRun: (run: any) => Promise<any>;
  completeRun: (runId: string, opts?: { ok?: boolean | null; finishedAt?: string }) => Promise<any>;
  recordEvent: (runId: string, event: any) => Promise<any>;
  applyFactoryEvent: (runId: string, event: any, opts?: { mode?: string }) => Promise<any>;
  db: any;
}>;
