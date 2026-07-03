// tools/ge/infra.mjs — `ge infra` (drive the terraform module). Moved
// verbatim out of tools/ge.mjs.
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, ui, elog, core } from "./shared.mjs";

export const infra = defineCommand({
  meta: { name: "infra", description: "Drive the terraform module (init|plan|apply|output|destroy)" },
  args: { ...common, sub: { type: "positional", required: true, description: "init | plan | apply | output | destroy" }, gatewayImage: { type: "string", description: "Gateway container image to bind" }, workerImage: { type: "string", description: "Worker container image to bind" }, yes: { type: "boolean", description: "Required confirmation for destroy" } },
  run: guarded(({ args }) => {
    const res = core.infra(cfgFrom(args), { sub: args.sub, gatewayImage: args.gatewayImage, workerImage: args.workerImage, yes: args.yes, log: elog });
    emit(args, res, (r) => { if (r.outputs) out(JSON.stringify(r.outputs, null, 2)); else out(`${ui.glyph("passed")} ${pc.green(`terraform ${r.sub}`)}`); });
  }),
});
