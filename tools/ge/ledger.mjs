// tools/ge/ledger.mjs — `ge ledger backfill|runs|fleet|plan` (durable run
// ledger, ADR 0001). Moved verbatim out of tools/ge.mjs.
import { defineCommand } from "citty";
import { guarded, common, emit, out, pc, ui, core, statusText } from "./shared.mjs";

const ledgerBackfill = defineCommand({
  meta: { name: "backfill", description: "Import legacy run state (.ge-state.json + factory-run-*.json) into the durable ledger" },
  args: { ...common },
  run: guarded(async ({ args }) => {
    const res = await core.ledgerBackfillFromDisk();
    emit(args, res, (r) => {
      if (r.note) { out(`${ui.glyph("warning")} ${pc.yellow(r.note)}`); return; }
      out(`${ui.glyph("passed")} ${pc.green(`ledger backfill: ${r.runs} run(s), ${r.items} work item(s) imported`)}`);
    });
  }),
});
const ledgerRunsCmd = defineCommand({
  meta: { name: "runs", description: "List runs recorded in the durable ledger (local + remote, one source of truth)" },
  args: { ...common, limit: { type: "string", description: "Max runs to list (default 25)" } },
  run: guarded(async ({ args }) => {
    const res = await core.ledgerRuns({ limit: Number(args.limit || 25) });
    emit(args, res, (runs) => {
      if (!runs.length) { out(pc.dim("no runs in the ledger yet — run a build, or `ge ledger backfill`")); return; }
      out(ui.title("Ledger Runs"));
      out(ui.columns(runs, [
        { header: "id", value: (run) => ui.cmd(run.id) },
        { header: "mode", value: (run) => String(run.mode) },
        { header: "status", value: (run) => statusText(run.status) },
        { header: "items", value: (run) => `${run.selected} item(s)${run.failed ? pc.red(` · ${run.failed} failed`) : ""}` },
        { header: "updated", value: (run) => pc.dim(run.updatedAt || "") },
      ]));
    });
  }),
});
const ledgerFleetCmd = defineCommand({
  meta: { name: "fleet", description: "Latest work-item state per use case, from the ledger" },
  args: { ...common, limit: { type: "string", description: "Max rows to list (default 50)" } },
  run: guarded(async ({ args }) => {
    const res = await core.ledgerFleet();
    emit(args, res, (rows) => {
      if (!rows.length) { out(pc.dim("ledger fleet is empty — run a build, or `ge ledger backfill`")); return; }
      out(ui.title("Ledger Fleet"));
      out(ui.columns(rows.slice(0, Number(args.limit || 50)), [
        { header: "status", value: (r) => statusText(r.status) },
        { header: "use case", value: (r) => ui.cmd(String(r.useCaseId)) },
        { header: "workspace", value: (r) => pc.dim(r.workspaceId || "") },
        { header: "stage", value: (r) => r.stage || "" },
      ]));
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
      out(ui.title("Ledger Plan"));
      out(ui.columns(rows, [
        { header: "action", value: (r) => (r.action === "none" ? pc.green("none") : r.action === "retry" ? pc.red(r.action) : ui.cmd(r.action)) },
        { header: "use case", value: (r) => pc.dim(String(r.useCaseId)) },
        { header: "stage", value: (r) => `${r.currentStage} → ${r.nextStage || "—"}` },
        { header: "reason", value: (r) => pc.dim(r.reason) },
      ]));
      if (rows.some((r) => r.action !== "none")) out(ui.next("ge agents resume", "fold this plan into executable commands; --run to execute"));
    });
  }),
});
export const ledger = defineCommand({
  meta: { name: "ledger", description: "See every run the factory has ever done, and rebuild the record if it drifts" },
  subCommands: { backfill: ledgerBackfill, runs: ledgerRunsCmd, fleet: ledgerFleetCmd, plan: ledgerPlanCmd },
});
