// tools/ge/handoff.mjs — `ge handoff [target]`: the golden path's last verb.
// Hands proven agents to a deploy target. `agents-cli` is the supported
// target today (ship → agents-cli deploy → Agent Engine → Gemini Enterprise);
// an unsupported target renders the four-field error contract, not a stack
// trace. The core handoff op uploads proven workspaces and runs the
// post-boundary stages (load_data → deploy → register → publish) remotely.
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, ui, elog, core } from "./shared.mjs";

export const handoff = defineCommand({
  meta: { name: "handoff", description: "Hand off proven agents to a deploy target (supported today: agents-cli → Agent Engine → Gemini Enterprise)" },
  args: {
    ...common,
    target: { type: "positional", required: false, description: "Deploy target (default agents-cli)" },
    ids: { type: "string", description: "Comma-separated local workspace ids (default: all built locally)" },
    "start-stage": { type: "string", description: "Stage to start at remotely (default load_data)" },
    "target-stage": { type: "string", description: "Stage to stop at (default publish_enterprise)" },
    concurrency: { type: "string", description: "Parallel remote submissions (default 2)" },
    "no-proxy": { type: "boolean", description: "Call the gateway directly over HTTPS instead of the gcloud run proxy tunnel" },
  },
  run: guarded(async ({ args }) => {
    const res = await core.handoff(cfgFrom(args), { target: args.target || "agents-cli", ids: args.ids, startStage: args["start-stage"], targetStage: args["target-stage"], concurrency: args.concurrency, noProxy: args["no-proxy"], log: elog });
    emit(args, res, (r) => {
      out(ui.title("Handoff"));
      out(ui.kv([
        { key: "target", value: ui.cmd(r.target), note: "agents-cli deploy → Agent Engine → Gemini Enterprise" },
        { key: "shipped", value: `${pc.green(r.submitted)}  failed ${r.failed ? pc.red(r.failed) : "0"}`, note: `${r.startStage || "load_data"} → ${r.targetStage || "publish_enterprise"}, remote` },
      ]));
      out(ui.next("ge agents status --watch", "follow the handoff to done"));
    });
  }),
});
