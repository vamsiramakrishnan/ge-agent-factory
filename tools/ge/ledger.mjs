// tools/ge/ledger.mjs — `ge ledger backfill|runs|fleet|plan` (durable run
// ledger, ADR 0001). Moved verbatim out of tools/ge.mjs.
import { defineCommand } from "citty";
import { guarded, common, emit, out, pc, core } from "./shared.mjs";

const ledgerBackfill = defineCommand({
  meta: { name: "backfill", description: "Import legacy run state (.ge-state.json + factory-run-*.json) into the durable ledger" },
  args: { ...common },
  run: guarded(async ({ args }) => {
    const res = await core.ledgerBackfillFromDisk();
    emit(args, res, (r) => {
      if (r.note) { out(pc.yellow(`▲ ${r.note}`)); return; }
      out(pc.green(`✓ ledger backfill: ${r.runs} run(s), ${r.items} work item(s) imported`));
    });
  }),
});
const ledgerRunsCmd = defineCommand({
  meta: { name: "runs", description: "List runs recorded in the durable ledger (local + remote, one source of truth)" },
  args: { ...common, limit: { type: "string" } },
  run: guarded(async ({ args }) => {
    const res = await core.ledgerRuns({ limit: Number(args.limit || 25) });
    emit(args, res, (runs) => {
      if (!runs.length) { out(pc.dim("no runs in the ledger yet — run a build, or `ge ledger backfill`")); return; }
      for (const run of runs) {
        out(`${pc.cyan(run.id)}  ${String(run.mode).padEnd(6)} ${String(run.status).padEnd(8)} ${run.selected} item(s)${run.failed ? pc.red(` · ${run.failed} failed`) : ""}  ${pc.dim(run.updatedAt || "")}`);
      }
    });
  }),
});
const ledgerFleetCmd = defineCommand({
  meta: { name: "fleet", description: "Latest work-item state per use case, from the ledger" },
  args: { ...common, limit: { type: "string" } },
  run: guarded(async ({ args }) => {
    const res = await core.ledgerFleet();
    emit(args, res, (rows) => {
      if (!rows.length) { out(pc.dim("ledger fleet is empty — run a build, or `ge ledger backfill`")); return; }
      for (const r of rows.slice(0, Number(args.limit || 50))) {
        out(`${String(r.status).padEnd(10)} ${pc.cyan(String(r.useCaseId).padEnd(28))} ${pc.dim(r.workspaceId || "")} ${r.stage || ""}`);
      }
    });
  }),
});
const ledgerPlanCmd = defineCommand({
  meta: { name: "plan", description: "Next action per work item from the ledger + pipeline state machine" },
  args: { ...common, target: { type: "string", description: "Target stage (default previewed)" }, mode: { type: "string", description: "local|remote (default local)" } },
  run: guarded(async ({ args }) => {
    const res = await core.ledgerPlan({ targetStage: args.target || "previewed", mode: args.mode || null });
    emit(args, res, (rows) => {
      if (!rows.length) { out(pc.dim("nothing in the ledger to plan — run a build, or `ge ledger backfill`")); return; }
      for (const r of rows) {
        const tag = r.action === "none" ? pc.green("none") : r.action === "retry" ? pc.red(r.action) : pc.cyan(r.action);
        out(`${tag.padEnd(22)} ${pc.dim(String(r.useCaseId).padEnd(28))} ${r.currentStage} → ${r.nextStage || "—"}  ${pc.dim(r.reason)}`);
      }
    });
  }),
});
export const ledger = defineCommand({
  meta: { name: "ledger", description: "Durable run ledger (ADR 0001): backfill · runs · fleet · plan" },
  subCommands: { backfill: ledgerBackfill, runs: ledgerRunsCmd, fleet: ledgerFleetCmd, plan: ledgerPlanCmd },
});
