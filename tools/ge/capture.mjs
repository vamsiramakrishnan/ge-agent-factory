// tools/ge/capture.mjs — `ge capture`: the golden path's first verb.
// Opens the front door to capture: starts the console if it isn't running and
// deep-links the Interview (conversational capture, document grounding,
// contract editing). `--from <agent-spec.json>` additionally registers an
// already-captured contract through the existing registerSpec path.
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, elog, core } from "./shared.mjs";

export const capture = defineCommand({
  meta: { name: "capture", description: "Capture an agent contract: opens the console Interview (starts the console if needed); --from registers an existing contract file" },
  args: {
    ...common,
    from: { type: "string", description: "Path to a captured contract (agent-spec.json) to register with the catalog" },
  },
  run: guarded(async ({ args }) => {
    const res = await core.capture(cfgFrom(args), { from: args.from, log: elog });
    emit(args, res, (r) => {
      out(pc.bold("\nCapture"));
      if (r.registered) out(pc.green(`  ✓ registered contract`) + pc.dim(` ${args.from}`));
      if (r.console.alreadyRunning) out(`  console   ${pc.green("already running")} ${pc.dim(`on :${r.console.port}`)}`);
      else out(`  console   ${pc.green("started")} ${pc.dim(`on :${r.console.port} (bun run dev in apps/console)`)}`);
      out(`  open      ${pc.bold(pc.cyan(r.url))}`);
      out(pc.dim(`\n  ${r.note}`));
      out(`\n  next: ${pc.cyan(r.next)}   ${pc.dim("(prove the captured contract end to end)")}`);
    });
  }),
});
