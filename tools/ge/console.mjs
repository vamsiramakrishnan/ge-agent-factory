// tools/ge/console.mjs — `ge console deploy|doctor` (the operator console UI's
// Cloud Run service). Mirrors tools/ge/mcp.mjs and tools/ge/images.mjs: deploy
// composes the SAME core.build/core.infra primitives `ge images build`/
// `ge infra apply` use (no bespoke shell logic — see tools/lib/planes/
// factory-plane.mjs's `console` build target + consoleImage terraform var).
//
// Exported as `consoleCommand` (not `console`) so importing this module never
// shadows the global `console` object in the composition root; register it
// under the "console" subcommand key regardless of the export name.
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, ui, elog, blog, core, renderChecks, announceExpectedDuration } from "./shared.mjs";

const consoleDeployCmd = defineCommand({
  meta: { name: "deploy", description: "Build the console image + bind it via terraform apply (Terraform owns Cloud Run config)" },
  args: {
    ...common,
    tag: { type: "string", description: "Explicit image tag (default: git short SHA)" },
    apply: {
      type: "boolean",
      default: true,
      description: "Bind the built image via terraform apply (default)",
      negativeDescription: "Build + push only — skip terraform apply (bind later with a plain `ge console deploy` or `ge infra apply`)",
    },
  },
  run: guarded(({ args }) => {
    const cfg = cfgFrom(args);
    announceExpectedDuration("console.deploy");
    blog("building console image");
    const { consoleImage } = core.build(cfg, { target: "console", tag: args.tag, log: elog });
    if (args.apply === false) {
      emit(args, { consoleImage, applied: false }, (r) => {
        out(`${ui.glyph("passed")} ${pc.green("built: " + r.consoleImage)}`);
        out(pc.dim("  --no-apply: skipped terraform apply — bind it with `ge console deploy` (no flag) or `ge infra apply`"));
      });
      return;
    }
    blog("binding console image via terraform apply (Terraform owns Cloud Run config)");
    core.infra(cfg, { sub: "apply", consoleImage, log: elog });
    emit(args, { consoleImage, applied: true }, (r) => {
      out(`${ui.glyph("passed")} ${pc.green("console deployed: " + r.consoleImage)}`);
      out(pc.dim("  CPU/memory/env/IAM/IAP are Terraform-owned (installer/terraform/ui_services.tf)"));
    });
  }),
});

const consoleDoctorCmd = defineCommand({
  meta: { name: "doctor", description: "Check the console Cloud Run service + config (read-only; never fails hard — see `ge doctor` for the mutating gateway/worker plane)" },
  args: { ...common },
  run: guarded(({ args }) => {
    const res = core.consoleDoctor(cfgFrom(args));
    emit(args, res, (r) => {
      out(ui.title("Console doctor", `${r.project || "<no project>"} (${r.region || ""})`) + "\n");
      renderChecks(r.checks);
      out(r.ok
        ? `\n${ui.glyph("passed")} ${pc.green("All checks passed.")}`
        : `\n${ui.glyph("failed")} ${pc.red(`${r.fails} check(s) need attention.`)}`);
    });
  }),
});

export const consoleCommand = defineCommand({
  meta: { name: "console", description: "Operator console UI (Cloud Run service): deploy · doctor" },
  subCommands: { deploy: consoleDeployCmd, doctor: consoleDoctorCmd },
});
