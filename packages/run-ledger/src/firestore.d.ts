// Type surface for firestore.mjs — the lazy Firestore backend.
// The implementation deliberately duck-types the Firestore client (tests pass
// plain-object fakes; orderBy/limit/onSnapshot are feature-detected), so these
// are structural "Like" slices of @google-cloud/firestore, not its real types.
import type { LedgerEvent } from "./frames";
import type { FactoryEvent, RunSummary } from "./store";

/** Document payload as stored/read; field values are Firestore-dynamic, inspected defensively. */
export type FirestoreDocData = Record<string, unknown>;

// A document snapshot as consumed by docData()/docId(): real snapshots expose
// data() as a method and id/ref, while test fakes may inline a data object or
// BE the data object themselves (hence the index signature).
export interface FirestoreDocLike {
  id?: string;
  ref?: { id?: string };
  data?: (() => FirestoreDocData | null | undefined) | FirestoreDocData;
  exists?: boolean;
  [key: string]: unknown;
}

export interface FirestoreQuerySnapshotLike {
  docs?: FirestoreDocLike[];
}

// A queryable collection: get() is required; orderBy/limit/onSnapshot are
// feature-detected (typeof === "function") so fakes may omit them.
export interface FirestoreQueryLike {
  get(): Promise<FirestoreQuerySnapshotLike>;
  orderBy?(field: string, direction?: "asc" | "desc"): FirestoreQueryLike;
  limit?(count: number): FirestoreQueryLike;
  onSnapshot?(
    onNext: (snapshot: FirestoreQuerySnapshotLike) => void,
    onError?: (err: unknown) => void,
  ): unknown;
}

export interface FirestoreCollectionLike extends FirestoreQueryLike {
  doc(id: string): FirestoreDocRefLike;
}

export interface FirestoreDocRefLike {
  collection(name: string): FirestoreCollectionLike;
  get(): Promise<FirestoreDocLike>;
  /** Only the event mirror writes; the reader never calls set, so fakes may omit it. */
  set?(data: FirestoreDocData, options?: { merge?: boolean }): Promise<unknown>;
}

export interface FirestoreDatabaseLike {
  collection(name: string): FirestoreCollectionLike;
}

export declare function normalizeFirestoreLedgerEvent(
  doc: FirestoreDocLike | null | undefined,
  index?: number,
): LedgerEvent;

export interface FirestoreLedgerReader {
  events(runId: string, opts?: { afterSeq?: number; limit?: number }): Promise<LedgerEvent[]>;
  getRun(runId: string): Promise<RunSummary | null>;
  listRuns(opts?: { limit?: number }): Promise<RunSummary[]>;
  /** Real-time tail; null when the backing collection has no onSnapshot (fakes). */
  listenEvents(
    runId: string,
    opts: { afterSeq?: number },
    onEvents: (events: LedgerEvent[]) => void,
    onError?: (err: unknown) => void,
  ): (() => void) | null;
  db: FirestoreDatabaseLike;
  /** resolveGcpProject() result: null when no project env/flag is set. */
  projectId: string | null;
  databaseId: string;
  collection: string;
}

export declare function createFirestoreLedgerReader(opts?: {
  projectId?: string | null;
  databaseId?: string;
  collection?: string;
  db?: FirestoreDatabaseLike | null;
}): Promise<FirestoreLedgerReader>;

export interface FirestoreEventMirror {
  startRun(run: {
    id: string;
    mode?: string;
    targetStage?: string | null;
    total?: number;
    startedAt?: string;
  }): Promise<unknown>;
  completeRun(runId: string, opts?: { ok?: boolean | null; finishedAt?: string }): Promise<unknown>;
  /** Writes the event doc keyed by seq (or Date.now()) and upserts the item doc. */
  recordEvent(
    runId: string,
    event: LedgerEvent & { workspaceId?: string | null },
  ): Promise<unknown>;
  /** Mirror a single generator event (parity with ledger.applyFactoryEvent). */
  applyFactoryEvent(
    runId: string,
    event: FactoryEvent | null | undefined,
    opts?: { mode?: string },
  ): Promise<unknown>;
  db: FirestoreDatabaseLike;
}

export declare function createFirestoreEventMirror(opts?: {
  projectId?: string | null;
  databaseId?: string;
  collection?: string;
}): Promise<FirestoreEventMirror>;
