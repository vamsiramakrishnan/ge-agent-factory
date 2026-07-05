// tools/ge/models.mjs — `ge models doctor`: structural readiness for the model
// providers the factory pipeline depends on (Vertex, the harness's Python
// driver, and the refinementModel/judgeModel config knobs). Read-only, no
// network/paid calls — see tools/lib/models-doctor.mjs for what each check
// actually inspects.
//
// This is the ONLY subcommand under `ge models`. There is deliberately no
// adapter-SDK surface here (no `ge models use <provider>` or similar) — the
// runtime model provider path (which model a generated agent actually calls)
// is decided at build/deploy time by the harness and generation pipeline
// (apps/factory/src/known-models.js, GE_AGENT_MODEL, --vertex), not by this
// CLI noun. `ge models doctor` only reports on readiness.
import { defineCommand } from "citty";
import { modelsDoctor } from "../lib/models-doctor.mjs";
import { guarded, common, cfgFrom, emit, out, pc, ui } from "./shared.mjs";

const modelsDoctorCmd = defineCommand({
  meta: { name: "doctor", description: "Structural readiness for model providers: Vertex, harness Python, refinement/judge model config (no network/paid calls)" },
  args: { ...common },
  run: guarded(({ args }) => {
    const cfg = cfgFrom(args);
    const res = modelsDoctor(cfg);
    emit(args, res, (r) => {
      out(ui.title("Models doctor", `${cfg.project || "<no project>"}`) + "\n");
      // renderChecks (shared.mjs) keys off `check.name`; modelsDoctor's checks
      // use `id` (see tools/lib/models-doctor.mjs's header comment on check
      // shape), so map before rendering rather than changing either contract.
      const width = Math.max(...r.checks.map((c) => c.id.length), 0);
      for (const check of r.checks) {
        out(`  ${ui.glyph(check.status)} ${check.id.padEnd(width)}  ${pc.dim(check.detail)}`);
        if (check.status !== "pass" && check.fix) out(ui.fixLine(check.fix, 6));
      }
      out(r.ok
        ? `\n${ui.glyph("passed")} ${pc.green("No hard failures.")}`
        : `\n${ui.glyph("failed")} ${pc.red("One or more hard failures.")}`);
    });
  }),
});

export const models = defineCommand({
  meta: { name: "models", description: "Model provider readiness: doctor" },
  subCommands: { doctor: modelsDoctorCmd },
});
