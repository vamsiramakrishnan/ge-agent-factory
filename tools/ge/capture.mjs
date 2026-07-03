// tools/ge/capture.mjs — `ge capture`: the golden path's first verb.
// Opens the front door to capture: starts the console if it isn't running and
// deep-links the Interview (conversational capture, document grounding,
// contract editing). `--from <agent-spec.json>` additionally registers an
// already-captured contract through the existing registerSpec path.
import { defineCommand } from "citty";
import { guarded, common, cfgFrom, emit, out, pc, ui, elog, core } from "./shared.mjs";

export const capture = defineCommand({
  meta: { name: "capture", description: "Capture an agent contract: opens the console Interview (starts the console if needed); --from registers an existing contract file" },
  args: {
    ...common,
    from: { type: "string", description: "Path to a captured contract (agent-spec.json) to register with the catalog" },
  },
  run: guarded(async ({ args }) => {
    const res = await core.capture(cfgFrom(args), { from: args.from, log: elog });
    emit(args, res, (r) => {
      out(ui.title("Capture"));
      out(ui.kv([
        r.registered && { key: "contract", value: pc.green("registered"), glyph: "passed", note: args.from },
        {
          key: "console",
          value: pc.green(r.console.alreadyRunning ? "already running" : "started"),
          glyph: "running",
          note: r.console.alreadyRunning ? `on :${r.console.port}` : `on :${r.console.port} (bun run dev in apps/console)`,
        },
        { key: "open", value: ui.cmd(r.url), glyph: undefined },
      ]));
      out(pc.dim(`\n  ${r.note}`));
      out(ui.next(r.next, "prove the captured contract end to end"));
    });
  }),
});
