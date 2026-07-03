// tools/ge/images.mjs — `ge images build|deploy`. Moved verbatim out of
// tools/ge.mjs.
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, ui, elog, core } from "./shared.mjs";

const imagesBuild = defineCommand({
  meta: { name: "build", description: "Build images: no arg = gateway+worker; 'builder' = shared toolchain image" },
  args: { ...common, target: { type: "positional", required: false, description: "builder = shared toolchain image (default: gateway+worker)" } },
  run: guarded(({ args }) => {
    const res = core.build(cfgFrom(args), { target: args.target, log: elog });
    emit(args, res, (r) => out(`${ui.glyph("passed")} ${pc.green("built: " + Object.values(r).join(", "))}`));
  }),
});

const imagesDeploy = defineCommand({
  meta: { name: "deploy", description: "Build gateway/worker images + bind via terraform (Terraform owns Cloud Run config)" },
  args: { ...common, target: { type: "positional", required: false, description: "gateway|worker|all (advisory; terraform apply reconciles the whole module)" } },
  run: guarded(({ args }) => {
    const res = core.deploy(cfgFrom(args), { target: args.target || "all", log: elog });
    emit(args, res, (r) => {
      out(`${ui.glyph("passed")} ${pc.green(`deployed: ${r.deployed.join(", ")}`)}`);
      out(pc.dim(`  images: ${r.gatewayImage} · ${r.workerImage}  (CPU/memory/env/IAM are Terraform-owned)`));
    });
  }),
});

export const images = defineCommand({ meta: { name: "images", description: "Gateway/worker images: build · deploy" }, subCommands: { build: imagesBuild, deploy: imagesDeploy } });
