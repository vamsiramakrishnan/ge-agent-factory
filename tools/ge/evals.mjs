// tools/ge/evals.mjs — `ge evals`: the behavioral compiler as a first-class
// verb. Compile a captured agent contract (or any spec envelope you bring)
// into the full executable behavior suite: behavioral graph, coverage report,
// selected conversation cases, ADK evalset, grading dataset, and load
// profile. The generator engine derives its per-workspace eval artifacts from
// the same contract, so compiled suites cannot drift from what gets built.
import { defineCommand } from "citty";
import { guarded, common, emit, out, pc, ui } from "./shared.mjs";
import { compileEvals } from "../lib/evals/compile-command.mjs";
import { importEvalset } from "../lib/evals/import-command.mjs";
import { evalsCoverage } from "../lib/evals/coverage-command.mjs";
import { METRIC_APPLICABILITY, renderMetricApplicabilityMarkdown } from "@ge/evalkit/metric-applicability";

function renderCompile(r) {
  out(ui.title("Evals — compiled", r.subject.agentId));
  out(ui.kv([
    ["source", pc.dim(`${r.subject.source} · ${r.subject.sourcePath}`)],
    ["graph", pc.dim(`${r.counts.capabilities} capabilities · ${r.counts.tools} tools · ${r.counts.authority} evidence rules`)],
    ["cases", `${r.counts.selected} selected ${pc.dim(`of ${r.counts.candidates} candidates${r.counts.dropped ? ` · ${r.counts.dropped} dropped by --max-cases` : ""}`)}`],
    ["coverage", r.coverageGaps.length ? pc.yellow(`${r.coverageGaps.length} gap(s)`) : pc.green("no gaps")],
  ]));
  if (r.coverageGaps.length) for (const gap of r.coverageGaps.slice(0, 5)) out(`    ${pc.yellow("gap")} ${pc.dim(gap)}`);
  if (r.options) out(`    ${pc.dim(`options: --perturb ${r.options.perturbVariants} ${r.options.adversarial ? "--adversarial" : ""}`.trimEnd())}`);
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
    perturb: { type: "string", description: "Linguistic perturbation variants per selected case (default 0 — off; variants mirror selected cases)" },
    adversarial: { type: "boolean", description: "Add adversarial/safety cases (prompt injection, spoofing, exfiltration, …) to the pool and require adversarial coverage" },
    out: { type: "string", description: "Output directory (default .ge/behavioral)" },
  },
  run: guarded(async ({ args }) => {
    const result = await compileEvals({
      spec: args.spec,
      id: args.id,
      maxCases: args.maxCases ? Number(args.maxCases) : undefined,
      perturbVariants: args.perturb ? Number(args.perturb) : undefined,
      adversarial: !!args.adversarial,
      outDir: args.out,
    });
    emit(args, result, renderCompile);
  }),
});

function renderImport(r) {
  out(ui.title("Evals — imported", r.id));
  out(ui.kv([
    ["source", pc.dim(r.source)],
    ["cases", `${r.cases} case(s) · ${r.turns} turn(s)`],
    ["out", pc.dim(r.out)],
  ]));
  out(ui.next(`ge evals coverage --id ${r.id}`, "check coverage against the compiled behavioral graph"));
}

const importCmd = defineCommand({
  meta: { name: "import", description: "Import a bring-your-own ADK-compatible evalset into .ge/behavioral, alongside compiled suites" },
  args: {
    ...common,
    evalset: { type: "string", description: "Path to an external ADK-compatible evalset JSON file", required: true },
    id: { type: "string", description: "Id to store the evalset under (default: the file's own evalSetId, or a filename slug)" },
    force: { type: "boolean", description: "Overwrite an existing evalset with the same id" },
  },
  run: guarded(async ({ args }) => {
    const result = importEvalset({ evalset: args.evalset, id: args.id, force: args.force });
    emit(args, result, renderImport);
  }),
});

function renderCoverage(r) {
  out(ui.title("Evals — coverage", r.evalset?.path));
  out(ui.kv([
    ["candidates", String(r.totalCandidates)],
    ["selected", String(r.selected)],
    ["gaps", r.summary.totals.gaps ? pc.yellow(`${r.summary.totals.gaps} gap(s)`) : pc.green("no gaps")],
  ]));
  out(ui.section("Dimensions"));
  for (const [dimension, d] of Object.entries(r.summary.dimensions)) {
    out(`  ${dimension.padEnd(20)} ${d.covered}/${d.required} covered ${d.gapCount ? pc.yellow(`· ${d.gapCount} gap(s)`) : pc.green("· complete")}`);
  }
  if (r.summary.gaps.length) {
    out(ui.section("Gaps"));
    for (const gap of r.summary.gaps.slice(0, 10)) out(`    ${pc.yellow(gap.dimension)} ${pc.dim(gap.gap)}`);
  }
  if (r.evalset) out(ui.kv([["evalset", `${r.evalset.cases} case(s) · ${pc.dim(r.evalset.path)}`]]));
}

const coverage = defineCommand({
  meta: { name: "coverage", description: "Report per-dimension coverage from the last `ge evals compile` (required/covered/gaps), optionally scoped to one evalset id" },
  args: {
    ...common,
    id: { type: "string", description: "Evalset id to also report case counts for (compiled or imported)" },
  },
  run: guarded(async ({ args }) => {
    const result = evalsCoverage({ id: args.id });
    emit(args, result, renderCoverage);
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
  subCommands: { compile, import: importCmd, coverage, applicability },
});
