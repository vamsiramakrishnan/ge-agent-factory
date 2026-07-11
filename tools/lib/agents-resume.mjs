// Resume plan for plain factory builds (the `ge agents resume` verb).
//
// The pipeline state machine already computes one next action per work item
// (`ge ledger plan`), but until now the operator had to hand-translate those
// rows into commands (`--force`? `handoff --start-stage`? rebuild?). This folds
// the rows into at most three executable groups — one command each — so an
// interrupted or failed fleet can be recovered with a single verb.
//
// Pure: rows in → groups out. No I/O, no config. Testable in isolation.

const GROUP_META = {
  build_local: {
    label: "Build locally",
    describe: (n) => `${n} item(s) retry or advance on this machine`,
  },
  handoff: {
    label: "Hand off to the cloud",
    describe: (n) => `${n} item(s) are past the build boundary — hand off for deploy/register/publish`,
  },
  advance_remote: {
    label: "Resume on the cloud factory",
    describe: (n) => `${n} item(s) continue from their exact failed cloud stage`,
  },
};

// Deterministic execution order: finish local work, then hand off, then let
// the cloud advance. Mirrors the pipeline's own stage ordering.
const GROUP_ORDER = ["build_local", "handoff", "advance_remote"];

function groupKeyFor(row) {
  if (row.action === "retry") {
    // A retry re-runs the failed stage on whichever side owns it.
    return row.owner === "cloud" ? "advance_remote" : "build_local";
  }
  if (GROUP_META[row.action]) return row.action;
  return null;
}

export function resumeCommandFor(action, { useCaseIds = [], workspaceIds = [] } = {}) {
  if (action === "build_local") return `ge agents build --local --ids ${useCaseIds.join(",")}`;
  if (action === "handoff") return `ge handoff agents-cli --ids ${workspaceIds.join(",")}`;
  if (action === "advance_remote") return `ge agents resume --remote --run --ids ${useCaseIds.join(",")}`;
  return null;
}

// rows: the output of core.ledgerPlan() — one entry per work item, each
// carrying { useCaseId, workspaceId, action, owner, currentStage, nextStage,
// reason } from the pipeline state machine.
export function groupResumeActions(rows = []) {
  const buckets = new Map();
  let done = 0;
  for (const row of rows) {
    if (!row) continue;
    if (row.action === "none") { done += 1; continue; }
    const key = groupKeyFor(row);
    if (!key) continue;
    if (!buckets.has(key)) buckets.set(key, []);
    buckets.get(key).push(row);
  }
  const groups = GROUP_ORDER.filter((key) => buckets.has(key)).map((key) => {
    const items = buckets.get(key);
    const useCaseIds = [...new Set(items.map((row) => row.useCaseId).filter(Boolean))];
    // Ship consumes local workspace ids; fall back to the use-case id when the
    // ledger row predates workspace recording.
    const workspaceIds = [...new Set(items.map((row) => row.workspaceId || row.useCaseId).filter(Boolean))];
    return {
      action: key,
      label: GROUP_META[key].label,
      detail: GROUP_META[key].describe(items.length),
      useCaseIds,
      workspaceIds,
      command: resumeCommandFor(key, { useCaseIds, workspaceIds }),
      items,
    };
  });
  return { groups, done, actionable: groups.reduce((sum, group) => sum + group.items.length, 0) };
}
