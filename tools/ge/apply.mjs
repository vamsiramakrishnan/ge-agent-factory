// tools/ge/apply.mjs — `ge apply` (declarative reconcile, ADR 0001 phase 5).
// Moved verbatim out of tools/ge.mjs.
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, ui, elog, core } from "./shared.mjs";

export const apply = defineCommand({
  meta: { name: "apply", description: "Reconcile actual → desired platform + fleet from a manifest (ge.manifest.json). Plans by default; --yes executes." },
  args: { ...common, yes: { type: "boolean", description: "Execute the plan in dependency order (default: plan only)" }, manifest: { type: "string", description: "Path to a manifest JSON (default ge.manifest.json)" } },
  run: guarded(async ({ args }) => {
    const cfg = cfgFrom(args);
    const manifest = args.manifest ? core.readJson(args.manifest, {}) : null;
    if (args.yes) {
      const res = await core.applyApply(cfg, { manifest, log: elog });
      emit(args, res, (r) => out(`\n${ui.glyph("passed")} ${pc.green(`applied ${r.applied} step(s)`)}`));
      return;
    }
    const res = await core.applyPlan(cfg, { manifest });
    emit(args, res, (r) => {
      out(pc.dim(`manifest: ${r.source}`));
      if (r.inSync) { out(`${ui.glyph("passed")} ${pc.green("in sync — nothing to reconcile")}`); return; }
      out(ui.title("Reconcile plan", `${r.steps.length} step(s)`));
      const idW = Math.max(...r.steps.map((s) => String(s.id).length), 0);
      for (const s of r.steps) out(`  ${ui.cmd(ui.padVisible(String(s.id), idW))}  ${s.command}\n      ${pc.dim(s.reason)}`);
      out(ui.next("ge apply --yes", "execute in order"));
    });
  }),
});
