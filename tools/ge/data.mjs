// tools/ge/data.mjs — `ge data up|doctor` (shared data plane). Moved
// verbatim out of tools/ge.mjs.
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, ui, blog, core, renderChecks, announceExpectedDuration } from "./shared.mjs";

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

export const data = defineCommand({ meta: { name: "data", description: "Data plane (GCS/BigQuery/AlloyDB/Bigtable/Firestore): up · doctor" }, subCommands: { up: dataUp, doctor: dataDoctorCmd } });
