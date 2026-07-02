// tools/ge/infra.mjs — `ge infra` (drive the terraform module). Moved
// verbatim out of tools/ge.mjs.
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, elog, core } from "./shared.mjs";

export const infra = defineCommand({
  meta: { name: "infra", description: "Drive the terraform module (init|plan|apply|output|destroy)" },
  args: { ...common, sub: { type: "positional", required: true }, gatewayImage: { type: "string" }, workerImage: { type: "string" }, yes: { type: "boolean" } },
  run: guarded(({ args }) => {
    const res = core.infra(cfgFrom(args), { sub: args.sub, gatewayImage: args.gatewayImage, workerImage: args.workerImage, yes: args.yes, log: elog });
    emit(args, res, (r) => { if (r.outputs) out(JSON.stringify(r.outputs, null, 2)); else out(pc.green(`✓ terraform ${r.sub}`)); });
  }),
});
