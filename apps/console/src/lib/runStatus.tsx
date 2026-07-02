// Moved to @ge/ui (shared across console + deck): the run-status vocabulary
// (normalizeStatus + RunStatus from @ge/run-ledger/status), the Tailwind palette
// (runStatusStyle), and the <StatusChip> follow-surface pill. Re-exported here —
// like components/StatusPill.tsx — so every existing "../lib/runStatus" importer
// (StatusChip, normalizeStatus, statusStyle, RunStatus, RunStatusStyle) is unchanged.
export {
  StatusChip,
  normalizeStatus,
  runStatusStyle as statusStyle,
  type RunStatus,
  type RunStatusStyle,
} from "@ge/ui";
