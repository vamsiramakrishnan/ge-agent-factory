// tools/ge/handoff.mjs — `ge handoff [target]`: the golden path's last verb.
// Hands proven agents to a deploy target. `agents-cli` is the supported
// target today (ship → agents-cli deploy → Agent Engine → Gemini Enterprise);
// an unsupported target renders the four-field error contract, not a stack
// trace. Delegates to the same core ship() as `ge agents ship`.
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, elog, core } from "./shared.mjs";

export const handoff = defineCommand({
  meta: { name: "handoff", description: "Hand off proven agents to a deploy target (supported today: agents-cli → Agent Engine → Gemini Enterprise)" },
  args: {
    ...common,
    target: { type: "positional", required: false, description: "Deploy target (default agents-cli)" },
    ids: { type: "string", description: "Comma-separated local workspace ids (default: all built locally)" },
  },
  run: guarded(async ({ args }) => {
    const res = await core.handoff(cfgFrom(args), { target: args.target || "agents-cli", ids: args.ids, log: elog });
    emit(args, res, (r) => {
      out(pc.bold("\nHandoff"));
      out(`  target    ${pc.cyan(r.target)}  ${pc.dim("(agents-cli deploy → Agent Engine → Gemini Enterprise)")}`);
      out(`  shipped   ${pc.green(r.submitted)}  failed ${r.failed ? pc.red(r.failed) : "0"}  ${pc.dim(`(${r.startStage || "load_data"} → ${r.targetStage || "publish_enterprise"}, remote)`)}`);
      out(pc.dim("\n  next: ge agents status --watch   (follow the handoff to done)"));
    });
  }),
});
