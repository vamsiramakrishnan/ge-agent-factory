// Thin re-export shim. The Firestore-backed ledger backend now lives in the
// in-repo workspace package @ge/run-ledger/firestore (packages/run-ledger). Kept
// so existing relative importers (console transport, tests) don't have to change
// their import paths.
export {
  normalizeFirestoreLedgerEvent,
  createFirestoreLedgerReader,
  createFirestoreEventMirror,
} from "@ge/run-ledger/firestore";
