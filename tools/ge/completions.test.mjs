// Tests for tools/ge/completions.mjs — the `ge completions bash|zsh|fish`
// shell-completion generator.
import { test, expect } from "bun:test";
import { buildTree, renderBash, renderFish, renderZsh } from "./completions.mjs";
import { rootCommand } from "../ge.mjs";

test("buildTree includes every root subcommand and its leaf subcommands", async () => {
  const tree = await buildTree(rootCommand, "ge");
  for (const name of Object.keys(rootCommand.subCommands)) {
    expect(Object.keys(tree.subcommands)).toContain(name);
  }
  expect(Object.keys(tree.subcommands.agents.subcommands)).toContain("build");
  expect(Object.keys(tree.subcommands.mcp.subcommands)).toEqual(["deploy", "doctor"]);
});

test("renderBash offers every top-level command and a case arm per group", async () => {
  const tree = await buildTree(rootCommand, "ge");
  const script = renderBash(tree);
  expect(script).toContain("complete -F _ge_completions ge");
  expect(script).toContain("agents) COMPREPLY=($(compgen -W \"register track build resume status logs sync\" -- \"$cur\")) ;;");
  expect(script).not.toContain("undefined");
});

test("renderZsh offers every top-level command and a case arm per group", async () => {
  const tree = await buildTree(rootCommand, "ge");
  const script = renderZsh(tree);
  expect(script).toContain("#compdef ge");
  expect(script).toContain("mcp) _values 'mcp subcommand' 'deploy' 'doctor' ;;");
  expect(script).not.toContain("undefined");
});

test("renderFish emits one complete line per top-level and per-group subcommand", async () => {
  const tree = await buildTree(rootCommand, "ge");
  const script = renderFish(tree);
  expect(script).toContain('complete -c ge -n "__fish_use_subcommand" -f -a "agents"');
  expect(script).toContain('complete -c ge -n "__fish_seen_subcommand_from mcp" -f -a "deploy"');
  expect(script).not.toContain("undefined");
});

test("all three renderers stay in sync with the live command tree (no dropped/renamed group)", async () => {
  const tree = await buildTree(rootCommand, "ge");
  const groupNames = Object.entries(tree.subcommands)
    .filter(([, node]) => Object.keys(node.subcommands).length > 0)
    .map(([name]) => name);
  const bash = renderBash(tree);
  const zsh = renderZsh(tree);
  const fish = renderFish(tree);
  for (const name of groupNames) {
    expect(bash).toContain(`${name}) COMPREPLY=`);
    expect(zsh).toContain(`${name}) _values`);
    expect(fish).toContain(`__fish_seen_subcommand_from ${name}`);
  }
});
