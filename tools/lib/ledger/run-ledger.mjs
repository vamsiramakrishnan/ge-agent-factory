// Thin re-export shim. The run/stage ledger core now lives in the in-repo
// workspace package @ge/run-ledger (packages/run-ledger) — a framework-agnostic
// "follow any long-running pipeline" observability primitive. This file is kept
// so existing relative importers (factory-core, pipeline-state-machine, tests)
// don't have to change their import paths.
export {
  LEDGER_STAGES,
  factoryEventToLedgerOp,
  createRunLedger,
  sqliteAdapter,
  pgAdapter,
  openRunLedger,
} from "@ge/run-ledger";
