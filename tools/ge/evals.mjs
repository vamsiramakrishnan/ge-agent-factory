// tools/ge/evals.mjs — `ge evals`: the behavioral compiler as a first-class
// verb. Compile a captured agent contract (or any spec envelope you bring)
// into the full executable behavior suite: behavioral graph, coverage report,
// selected conversation cases, ADK evalset, grading dataset, and load
// profile. The generator engine derives its per-workspace eval artifacts from
// the same contract, so compiled suites cannot drift from what gets built.
import { defineCommand } from "citty";
import { guarded, common, emit, out, pc, ui } from "./shared.mjs";
import { compileEvals } from "../lib/behavioral-compiler/compile-command.mjs";
import { METRIC_APPLICABILITY, renderMetricApplicabilityMarkdown } from "../lib/behavioral-compiler/metric-applicability.mjs";

function renderCompile(r) {
  out(ui.title("Evals — compiled", r.subject.agentId));
  out(ui.kv([
    ["source", pc.dim(`${r.subject.source} · ${r.subject.sourcePath}`)],
    ["graph", pc.dim(`${r.counts.capabilities} capabilities · ${r.counts.tools} tools · ${r.counts.authority} evidence rules`)],
    ["cases", `${r.counts.selected} selected ${pc.dim(`of ${r.counts.candidates} candidates${r.counts.dropped ? ` · ${r.counts.dropped} dropped by --max-cases` : ""}`)}`],
    ["coverage", r.coverageGaps.length ? pc.yellow(`${r.coverageGaps.length} gap(s)`) : pc.green("no gaps")],
  ]));
  if (r.coverageGaps.length) for (const gap of r.coverageGaps.slice(0, 5)) out(`    ${pc.yellow("gap")} ${pc.dim(gap)}`);
  out(ui.section("Artifacts"));
  for (const [name, path] of Object.entries(r.artifacts)) out(`  ${name.padEnd(20)} ${pc.dim(path)}`);
  out(ui.next(r.next, "prove the compiled behavior against the live surface"));
}

const compile = defineCommand({
  meta: { name: "compile", description: "Compile an agent contract into executable behavior: graph, coverage, selected cases, ADK evalset, grading dataset, load profile" },
  args: {
    ...common,
    spec: { type: "string", description: "A GenerationSpecEnvelope JSON file to compile (bring your own spec)" },
    id: { type: "string", description: "Registered/captured spec id (default: the only one, when exactly one exists)" },
    maxCases: { type: "string", description: "Case budget for the set-cover selection (default 40)" },
    out: { type: "string", description: "Output directory (default .ge/behavioral)" },
  },
  run: guarded(async ({ args }) => {
    const result = await compileEvals({
      spec: args.spec,
      id: args.id,
      maxCases: args.maxCases ? Number(args.maxCases) : undefined,
      outDir: args.out,
    });
    emit(args, result, renderCompile);
  }),
});

const applicability = defineCommand({
  meta: { name: "applicability", description: "Which metric families apply locally vs through the live assist surface (and why)" },
  args: { ...common, markdown: { type: "boolean", description: "Print the markdown table instead of the human view" } },
  run: guarded(async ({ args }) => {
    if (args.markdown) return out(renderMetricApplicabilityMarkdown());
    emit(args, { metrics: METRIC_APPLICABILITY }, (r) => {
      out(ui.title("Metric applicability", "local vs live"));
      for (const metric of r.metrics) {
        out(`  ${metric.metric.padEnd(28)} local ${metric.localAdk.padEnd(12)} live ${metric.liveStreamAssist.padEnd(12)} ${pc.dim(metric.notes)}`);
      }
    });
  }),
});

export const evals = defineCommand({
  meta: { name: "evals", description: "Behavioral compiler: turn agent contracts into executable eval suites, datasets, and load profiles" },
  subCommands: { compile, applicability },
});
