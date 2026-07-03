// tools/ge/prove.mjs — `ge prove`: the golden path's middle verb.
// One dispatch rule, no flags needed on the golden path:
//   nothing built yet   → the first proof (health check → one validated
//                         workspace from the catalog)
//   agents built        → rebuild their proof (agents build: local engine,
//                         or the cloud factory in remote mode)
// `--watch` re-proves whenever a contract source changes (captured contracts
// under the interviews root, catalog specs) — the Vite loop. Watch runs stay
// on this machine (pure computation to the build boundary), so looping is
// safe by construction.
import { watch } from "node:fs";
import { defineCommand } from "citty";
import { contractWatchRoots } from "../lib/golden-path.mjs";
import { guarded, common, cfgFrom, emit, out, pc, ui, elog, core, renderChecks } from "./shared.mjs";

function renderProve(r) {
  out(ui.title("Prove"));
  if (r.path === "fresh") {
    out(pc.dim("  fresh machine — proving from scratch (health check → first agent build)"));
    if (!r.ok) {
      out(`  ${ui.glyph("blocked")} ${pc.red(`blocked at ${r.stage || "unknown"}`)}`);
      renderChecks((r.doctor?.checks || []).filter((check) => check.status !== "pass"));
      out(ui.next(typeof r.next === "string" ? r.next : "mise run setup"));
      return;
    }
    out(`  ${ui.glyph("passed")} ${pc.green(`proof passed → ${r.target}`)}`);
    if (r.workspace) {
      out(ui.kv([
        { key: "workspace", value: ui.cmd(r.workspace.id), note: r.workspace.path },
        r.workspace.manifest && ["manifest", pc.dim(r.workspace.manifest)],
        r.workspace.evalConfig && ["eval", pc.dim(r.workspace.evalConfig)],
      ]));
    }
    out(ui.next("ge handoff agents-cli", "hand the proven agent to the cloud"));
    return;
  }
  if (r.mode === "remote") {
    out(`  submitted ${pc.green(r.submitted)}  failed ${r.failed ? pc.red(r.failed) : "0"}  ${pc.dim("(cloud factory)")}`);
    out(ui.next("ge agents status --watch"));
    return;
  }
  out(`  ${ui.glyph("passed")} ${pc.green(`proof rebuilt → ${r.target} (build boundary)`)}`);
  out(ui.kv([
    ["workspaces", pc.dim(r.projectsDir)],
    r.selected && ["selected", pc.dim(String(r.selected))],
    r.run && ["run", pc.dim(r.run)],
  ]));
  out(ui.next("ge handoff agents-cli", "hand the proven agents to the cloud"));
}

export const prove = defineCommand({
  meta: { name: "prove", description: "Prove the current contracts end to end: fresh machine → health check + first agent build; agents built already → rebuild their proof. --watch re-proves on contract change" },
  args: {
    ...common,
    id: { type: "string", description: "Prove one use-case/workspace id (default: everything built, or the catalog canary when fresh)" },
    target: { type: "string", description: "Stop at this stage (default: validated when fresh, the build boundary otherwise)" },
    force: { type: "boolean", description: "Re-prove from scratch (wipes matching local workspaces first)" },
    preview: { type: "boolean", description: "Shortcut for --target previewed (may require project/Vertex auth)" },
    vertex: { type: "boolean", description: "Use Vertex-backed stages when the target reaches them" },
    warm: { type: "boolean", description: "Pre-warm the shared uv cache before running" },
    watch: { type: "boolean", description: "Watch contract sources and re-prove on change (local, pure computation — safe to loop)" },
  },
  run: guarded(async ({ args }) => {
    const opts = { id: args.id, target: args.target, force: args.force, vertex: args.vertex, warm: args.warm, preview: args.preview, log: elog };
    if (!args.watch) {
      const res = await core.prove(cfgFrom(args), opts);
      emit(args, res, renderProve);
      if (res.ok === false) process.exitCode = 1;
      return;
    }

    // Watch loop: force local mode (the build boundary makes looping safe;
    // remote submissions must stay deliberate), debounce bursts, never let one
    // failed proof kill the loop — the next save gets a fresh verdict.
    const cfg = { ...cfgFrom(args), mode: "local" };
    const roots = contractWatchRoots(core.REPO_ROOT);
    const runOnce = async () => {
      try {
        const res = await core.prove(cfg, opts);
        emit(args, res, renderProve);
      } catch (e) {
        process.stderr.write(pc.red(`✗ ${e?.message || e}`) + "\n");
        if (e?.fix || e?.hint) process.stderr.write(ui.fixLine(e.fix || e.hint, 2) + "\n");
      }
    };
    await runOnce();
    if (!roots.length) {
      out(`\n  ${ui.glyph("warning")} ${pc.yellow("nothing to watch: no contract sources found (capture one first: ge capture)")}`);
      return;
    }
    out(pc.dim(`\n  watching ${roots.length} contract root(s) — save a contract to re-prove (ctrl-c to stop)`));
    let timer = null;
    let running = false;
    let dirty = false;
    const trigger = () => {
      if (timer) clearTimeout(timer);
      timer = setTimeout(async () => {
        if (running) { dirty = true; return; }
        running = true;
        do {
          dirty = false;
          out(pc.dim("\n  contract changed — re-proving…"));
          await runOnce();
        } while (dirty);
        running = false;
        out(pc.dim("  watching (ctrl-c to stop)"));
      }, 400);
    };
    for (const root of roots) watch(root, { recursive: true }, trigger);
    await new Promise(() => {}); // hold the loop open until ctrl-c
  }),
});
