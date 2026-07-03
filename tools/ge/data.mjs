// tools/ge/data.mjs — `ge data`: the data noun. Two cloud verbs (`up`,
// `doctor`) manage the shared data stores; `synth` generates the synthetic
// seed data those stores and the simulator twins consume. `up`/`doctor`
// moved verbatim out of tools/ge.mjs.
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, ui, blog, core, renderChecks, announceExpectedDuration } from "./shared.mjs";
import { DxError } from "../lib/errors/dx-error.mjs";

const dataUp = defineCommand({
  meta: { name: "up", description: "Provision the shared data stores (terraform apply) → merge coords into .ge.json" },
  args: { ...common },
  run: guarded(async ({ args }) => {
    announceExpectedDuration("data.up");
    const res = await core.dataUp(cfgFrom(args), { log: blog });
    emit(args, res, (r) => {
      out(`\n${ui.glyph("passed")} ${pc.green("data plane applied. Coordinates written to .ge.json:")}`);
      out(ui.kv(Object.entries(r.data).map(([k, v]) => [k, v ? pc.green(v) : pc.yellow("<unset>")])));
    });
  }),
});

const dataDoctorCmd = defineCommand({
  meta: { name: "doctor", description: "Check the shared data stores (bucket, AlloyDB DSN secret, Bigtable, BigQuery)" },
  args: { ...common },
  run: guarded(({ args }) => {
    const res = core.dataDoctor(cfgFrom(args));
    emit(args, res, (r) => {
      out(ui.title("Data doctor", `${r.project} (${r.region})`) + "\n");
      renderChecks(r.checks);
      out(r.fails === 0
        ? `\n${ui.glyph("passed")} ${pc.green("All hard checks passed.")}`
        : `\n${ui.glyph("failed")} ${pc.red(`${r.fails} hard failure(s).`)}`);
    });
  }),
});

function renderSynth(r) {
  out(ui.title("Data — synthesized seed", r.system));
  out(ui.kv([
    ["tier", ui.cmd(r.tier)],
    ["seed", String(r.seed)],
    r.profile && ["profile", `${r.profile} ${pc.dim(`· ${r.personas} personas · ${r.edgeCases} edge cases · ${r.distributionFields} distribution fields`)}`],
    ["rows", `${r.totalRows} across ${r.collections} collection(s)`],
    ["fk closure", r.fkClosureOk ? pc.green("closed") : pc.red(`${r.fkViolations} violation(s)`)],
    r.out && ["out", pc.dim(r.out)],
  ]));
  out(ui.next(`node apps/factory/scripts/validate-simulator-pack.mjs --system ${r.system}`, "validate the pack against the new seed"));
}

const dataSynth = defineCommand({
  meta: { name: "synth", description: "Synthesize deterministic seed data for a simulator system twin: pack contract → recipe → seeded rows → seed.json" },
  args: {
    ...common,
    system: { type: "string", description: "Simulator system id under apps/factory/simulator-systems/ (e.g. servicenow)" },
    pack: { type: "string", description: "Explicit pack directory (schema/projection/materialization/workflows JSON) instead of --system" },
    seed: { type: "string", description: "Deterministic seed — the same contract and seed always produce identical bytes (default 42)" },
    profile: { type: "string", description: "Realization profile: baseline (default) or realistic (skewed distributions, shared personas, seeded edge cases)" },
    "edge-case-rate": { type: "string", description: "Fraction of rows given realistic edge cases with --profile realistic, 0..1 (default 0.06)" },
    out: { type: "string", description: "Seed output path (default: the pack's own seed.json)" },
    stdout: { type: "boolean", description: "Print the seed JSON to stdout instead of writing a file; the summary goes to stderr" },
    "no-snowfakery": { type: "boolean", description: "Skip the Snowfakery tier and force the offline in-process tier" },
  },
  run: guarded(async ({ args }) => {
    if (!args.system && !args.pack) {
      throw new DxError("nothing to synthesize", {
        where: "ge data synth",
        why: "seed generation needs a simulator pack contract to realize",
        fix: "ge data synth --system servicenow   (ids live under apps/factory/simulator-systems/)",
      });
    }
    // In-process import of the generator core (the spec-to-okf.mjs pattern);
    // dynamic so bare `ge` startup never pays for @ge/synthkit.
    const { synthesizeSeed } = await import("../../apps/factory/scripts/generate-simulator-data.mjs");
    const { summary, data, fk } = synthesizeSeed({
      system: args.system,
      pack: args.pack,
      seed: args.seed ? Number(args.seed) : undefined,
      profile: args.profile,
      edgeCaseRate: args["edge-case-rate"] === undefined ? undefined : Number(args["edge-case-rate"]),
      out: args.out,
      write: !args.stdout,
      // citty parses `--no-snowfakery` as a negation: snowfakery === false.
      preferSnowfakery: args.snowfakery !== false,
    });
    if (!fk.ok) {
      throw new DxError(`seed realized but ${fk.violations.length} foreign-key reference(s) do not resolve`, {
        where: summary.out || summary.system,
        why: "every ref: value in a seed must point at a generated primary key; an open reference means the pack contract and recipe disagree",
        fix: `node apps/factory/scripts/validate-simulator-pack.mjs --system ${summary.system}`,
      });
    }
    if (args.stdout) {
      // stdout carries the seed JSON only (pipe-clean); the summary goes to
      // stderr — same split as the underlying generator script.
      out(JSON.stringify(data, null, 2));
      process.stderr.write(JSON.stringify(summary, null, 2) + "\n");
      return;
    }
    emit(args, summary, renderSynth);
  }),
});

export const data = defineCommand({ meta: { name: "data", description: "Data: provision the shared cloud stores (up · doctor) · synthesize deterministic simulator seeds (synth)" }, subCommands: { up: dataUp, doctor: dataDoctorCmd, synth: dataSynth } });
