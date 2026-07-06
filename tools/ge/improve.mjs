// tools/ge/improve.mjs — `ge improve`: the self-improvement loop for one agent.
//
// Drives an agent's OKF blueprint toward a target quality level by looping
// audit → enrich → verify → re-audit (tools/lib/improve.mjs). Preview by
// default (shows the next enrichment batch); `--write` runs the closed loop and
// enriches the corpus. Deterministic and offline — the runtime half (build +
// judge) is the surfaced next step.
import { defineCommand } from "citty";
import pc from "picocolors";
import { improveSpec } from "../lib/improve.mjs";
import { common, emit, guarded, out, ui } from "./shared.mjs";

function renderImprove(r) {
  out(ui.title("GE Improve", r.specId));
  out(ui.kv([
    ["target", r.target],
    ["quality", `${r.startStatus} (${r.startScore}) → ${r.endStatus} (${r.endScore})`],
    ["mode", r.dryRun ? "preview (no writes) — pass --write to enrich" : r.reachedTarget ? pc.green("reached target") : r.stalled ? pc.yellow("stalled below target") : "in progress"],
    ["iterations", String(r.iterations.length)],
  ]));
  for (const it of r.iterations) {
    const delta = it.scoreAfter - it.scoreBefore;
    const move = it.dryRun ? pc.dim("(preview)") : delta > 0 ? pc.green(`+${delta}`) : pc.yellow(`${delta}`);
    out(`  ${pc.dim(`#${it.n}`)} +${it.generated} eval(s)${it.dryRun ? "" : ` applied ${it.applied}`} · score ${it.scoreBefore}→${it.scoreAfter} ${move}${it.note ? pc.dim(`  ${it.note}`) : ""}`);
  }
  if (r.remainingGaps.length) {
    out(pc.dim(`  ${r.remainingGaps.length} gap(s) remaining:`));
    for (const gap of r.remainingGaps.slice(0, 6)) out(`    ${pc.yellow("▲")} ${gap.code} ${pc.dim(gap.message || "")}`);
  }
  out("\n" + ui.nextList(r.next));
}

export const improve = defineCommand({
  meta: { name: "improve", description: "Self-improvement loop: enrich an agent's blueprint toward a target quality level (audit → enrich → verify → re-audit), then build+judge" },
  args: {
    ...common,
    id: { type: "string", description: "Agent/spec id under the OKF corpus root" },
    spec: { type: "string", description: "Alias for --id" },
    target: { type: "string", description: "Target quality level L0–L5 (default L4)" },
    write: { type: "boolean", description: "Run the closed loop and enrich the corpus (default: preview one batch)" },
    "max-iterations": { type: "string", description: "Loop cap when writing (default 5)" },
    "max-evals": { type: "string", description: "Obligations added per iteration (default 5)" },
    root: { type: "string", description: "OKF corpus root (default okf)" },
  },
  run: guarded(async ({ args }) => {
    const result = await improveSpec({
      spec: args.id || args.spec,
      root: args.root || "okf",
      target: args.target || "L4",
      write: !!args.write,
      maxIterations: Number(args["max-iterations"] || 5),
      maxEvalsPerIteration: Number(args["max-evals"] || 5),
    });
    emit(args, result, renderImprove);
  }),
});
