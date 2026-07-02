// tools/ge/data.mjs — `ge data up|doctor` (shared data plane). Moved
// verbatim out of tools/ge.mjs.
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, blog, core, renderChecks } from "./shared.mjs";

const dataUp = defineCommand({
  meta: { name: "up", description: "Provision the shared data stores (terraform apply) → merge coords into .ge.json" },
  args: { ...common },
  run: guarded(async ({ args }) => {
    const res = await core.dataUp(cfgFrom(args), { log: blog });
    emit(args, res, (r) => {
      out(pc.green("\n✓ data plane applied. Coordinates written to .ge.json:"));
      for (const [k, v] of Object.entries(r.data)) out(`  ${k.padEnd(18)} ${v ? pc.green(v) : pc.yellow("<unset>")}`);
    });
  }),
});

const dataDoctorCmd = defineCommand({
  meta: { name: "doctor", description: "Check the shared data stores (bucket, AlloyDB DSN secret, Bigtable, BigQuery)" },
  args: { ...common },
  run: guarded(({ args }) => {
    const res = core.dataDoctor(cfgFrom(args));
    emit(args, res, (r) => { out(pc.bold(`\nData doctor — ${r.project} (${r.region})\n`)); renderChecks(r.checks); out(r.fails === 0 ? pc.green("\nAll hard checks passed.") : pc.red(`\n${r.fails} hard failure(s).`)); });
  }),
});

export const data = defineCommand({ meta: { name: "data", description: "Data plane (GCS/BigQuery/AlloyDB/Bigtable/Firestore): up · doctor" }, subCommands: { up: dataUp, doctor: dataDoctorCmd } });
