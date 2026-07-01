// tools/ge/apply.mjs — `ge apply` (declarative reconcile, ADR 0001 phase 5).
// Moved verbatim out of tools/ge.mjs.
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, elog, core } from "./shared.mjs";

export const apply = defineCommand({
  meta: { name: "apply", description: "Reconcile actual → desired platform + fleet from a manifest (ge.manifest.json). Plans by default; --yes executes." },
  args: { ...common, yes: { type: "boolean", description: "Execute the plan in dependency order (default: plan only)" }, manifest: { type: "string", description: "Path to a manifest JSON (default ge.manifest.json)" } },
  run: guarded(async ({ args }) => {
    const cfg = cfgFrom(args);
    const manifest = args.manifest ? core.readJson(args.manifest, {}) : null;
    if (args.yes) {
      const res = await core.applyApply(cfg, { manifest, log: elog });
      emit(args, res, (r) => out(pc.green(`\n✓ applied ${r.applied} step(s)`)));
      return;
    }
    const res = await core.applyPlan(cfg, { manifest });
    emit(args, res, (r) => {
      out(pc.dim(`manifest: ${r.source}`));
      if (r.inSync) { out(pc.green("✓ in sync — nothing to reconcile")); return; }
      out(pc.bold(`\nReconcile plan — ${r.steps.length} step(s)`));
      for (const s of r.steps) out(`  ${pc.cyan(String(s.id).padEnd(16))} ${s.command}\n      ${pc.dim(s.reason)}`);
      out(pc.dim("\n  run `ge apply --yes` to execute in order"));
    });
  }),
});
