// Tests for tools/gen-cli-reference.mjs — the generator that renders the
// `ge` command reference in docs/reference/cli.md from the citty tree.
import { test, expect } from "bun:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { generateRegion } from "./gen-cli-reference.mjs";
import { rootCommand } from "./ge.mjs";
import { common } from "./ge/shared.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const DOC_PATH = join(HERE, "..", "docs", "reference", "cli.md");

test("region renders one heading per command path, including nested leaves", async () => {
  const region = await generateRegion();
  for (const heading of [
    "### `ge`",
    "### `ge up`",
    "### `ge agents build`",
    "### `ge fleet repair`",
    "### `ge apply`",
  ]) {
    expect(region).toContain(`${heading}\n`);
  }
});

test("shared flags render exactly once, not per command", async () => {
  const region = await generateRegion();
  const jsonRows = region.split("\n").filter((line) => line.startsWith("| `--json` |"));
  expect(jsonRows.length).toBe(1);
  expect(region).toContain("| `--project` / `--gcp-project` | string |");
});

test("every root subcommand appears in the region", async () => {
  const region = await generateRegion();
  for (const name of Object.keys(rootCommand.subCommands)) {
    expect(region).toContain(`### \`ge ${name}\``);
  }
});

test("descriptions come from the tree; no cell content without a source", async () => {
  const region = await generateRegion();
  // Collect every description string reachable in the tree (meta + args).
  const sourced = new Set(Object.values(common).map((a) => a.description));
  const stack = [rootCommand];
  while (stack.length) {
    const cmd = stack.pop();
    for (const def of Object.values(cmd.args ?? {})) if (def.description) sourced.add(def.description);
    for (const sub of Object.values(cmd.subCommands ?? {})) stack.push(sub);
  }
  const rows = region.split("\n").filter((l) => l.startsWith("| ") && !l.startsWith("| Flag") && !l.startsWith("|---"));
  for (const row of rows) {
    const description = row.split(" | ").at(-1).replace(/ \|$/, "").replaceAll("\\|", "|");
    if (description === "") continue; // empty cell is the allowed no-description case
    expect(sourced.has(description)).toBe(true);
  }
});

test("checked-in docs/reference/cli.md region matches the tree (no drift)", async () => {
  const doc = readFileSync(DOC_PATH, "utf8");
  const begin = "<!-- BEGIN GENERATED: ge-command-tree — do not edit; run `bun run docs:cli` -->";
  const end = "<!-- END GENERATED: ge-command-tree -->";
  const region = doc.slice(doc.indexOf(begin) + begin.length, doc.indexOf(end)).replace(/^\n/, "").replace(/\n$/, "");
  expect(region).toBe(await generateRegion());
});
