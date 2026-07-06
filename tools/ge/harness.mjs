// tools/ge/harness.mjs — `ge harness hooks install|show`.
//
// The harness (Claude Code today; the adapter ids in apps/factory/src/agents.js
// generally) is an entry point on equal footing with the CLI and console.
// This group wires the factory's own checks into the harness's hook system so
// post-action gates run inside the assistant session: see
// tools/lib/harness-hooks.mjs for the hook plan and merge semantics.
import { defineCommand } from "citty";
import pc from "picocolors";
import { CLAUDE_HOOK_PLAN, installHarnessHooks, SUPPORTED_HARNESSES } from "../lib/harness-hooks.mjs";
import { common, emit, guarded, out, ui } from "./shared.mjs";

function renderInstall(r) {
  out(ui.title("Harness Hooks", r.harness));
  out(ui.kv([
    ["settings", pc.dim(r.path)],
    ["mode", r.dryRun ? "dry-run (nothing written)" : r.wrote ? pc.green("written") : pc.dim("already installed — no change")],
  ]));
  for (const hook of r.added) out(`  ${pc.green("+")} ${hook.event}${hook.matcher ? ` [${hook.matcher}]` : ""} → ${ui.cmd(hook.command)} ${pc.dim(`(${hook.why})`)}`);
  for (const hook of r.alreadyPresent) out(`  ${pc.dim("=")} ${hook.event}${hook.matcher ? ` [${hook.matcher}]` : ""} → ${pc.dim(hook.command)}`);
  if (!r.dryRun && r.wrote) out(ui.next("git add .claude/settings.json", "commit so every contributor session gets the hooks"));
}

const hooksInstall = defineCommand({
  meta: { name: "install", description: `Write this repo's post-action checks into a harness's hook config (supported: ${SUPPORTED_HARNESSES.join(", ")})` },
  args: {
    ...common,
    harness: { type: "string", description: "Harness to configure (default claude → .claude/settings.json)" },
    "dry-run": { type: "boolean", description: "Show the merge without writing" },
  },
  run: guarded(({ args }) => {
    emit(args, installHarnessHooks({ harness: args.harness || "claude", dryRun: !!args["dry-run"] }), renderInstall);
  }),
});

const hooksShow = defineCommand({
  meta: { name: "show", description: "Show the hook plan `install` would apply, per harness" },
  args: { ...common },
  run: guarded(({ args }) => {
    emit(args, { kind: "ge.harness.hooks.plan", harness: "claude", plan: CLAUDE_HOOK_PLAN }, (r) => {
      out(ui.title("Harness Hook Plan", r.harness));
      for (const hook of r.plan) out(`  ${hook.event}${hook.matcher ? ` [${hook.matcher}]` : ""} → ${ui.cmd(hook.command)} ${pc.dim(`(${hook.why})`)}`);
      out(ui.next("ge harness hooks install", "apply the plan to .claude/settings.json"));
    });
  }),
});

const hooks = defineCommand({
  meta: { name: "hooks", description: "Post-action checks inside the harness session: install · show" },
  subCommands: { install: hooksInstall, show: hooksShow },
});

export const harness = defineCommand({
  meta: { name: "harness", description: "Harness integration: wire factory gates into the assistant's own hook system" },
  subCommands: { hooks },
});
