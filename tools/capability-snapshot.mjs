#!/usr/bin/env bun
// Capability snapshot — the additivity oracle for interface refactors.
//
// Dumps every capability the `ge` surface exposes, one canonical sorted line
// per fact, so that `diff /tmp/capability-before.txt /tmp/capability-after.txt`
// shows ONLY `>` additions when a change-set is genuinely additive. A single
// `<` (removed line) means a command, flag, description, registry entry, or
// MCP tool was deleted or mutated — which fails the additivity law.
//
//   bun tools/capability-snapshot.mjs /tmp/capability-before.txt
//   … make changes …
//   bun tools/capability-snapshot.mjs /tmp/capability-after.txt
//   diff /tmp/capability-before.txt /tmp/capability-after.txt
//
// Output paths are scratch by convention — if you want to keep a snapshot as
// a historical record of a specific rename/refactor, file it under
// docs/plans/<name>/ (see docs/plans/rename-sweep-2026-07-03/ for an example),
// not a root artifacts/ dir — that name collides with the per-workspace
// artifacts/ concept used elsewhere in this repo (apps/factory/artifacts/,
// generated workspace artifacts/spec-code-trace.json, etc).
//
// What it snapshots (all statically, without executing any command — several
// commands mutate cloud state, so running each one for a `--json` sample is
// not safe; the full flag surface below IS the `--json` machine contract,
// since every command routes through the same emit() boundary):
//   help:     every command/subcommand path, its description, and every arg
//             (name · type · required · aliases · default · description)
//   registry: every GE_COMMANDS entry (id · method+path · cli · risk ·
//             expectedDuration · requirement keys)
//   mcp:      every MCP tool derived from the registry (name · description ·
//             every param with type/enum/optionality)
//
// Lines are sorted, so purely structural moves (regrouping help output,
// reordering subcommands) do not read as removals — only real capability
// changes do.
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { rootCommand } from "./ge.mjs";
import { GE_COMMANDS } from "./lib/ge-command-registry.mjs";

// citty allows lazy subcommands (`() => import(...)`); resolve either shape.
async function resolveCommand(cmd) {
  const resolved = typeof cmd === "function" ? await cmd() : await cmd;
  return resolved?.default ?? resolved;
}

const clean = (s) => String(s ?? "").replaceAll("\n", " ").trim();

async function walkCommand(cmd, path, lines) {
  cmd = await resolveCommand(cmd);
  const name = path.join(" ");
  lines.push(`help ${name} | description | ${clean(cmd.meta?.description)}`);
  for (const [argName, def] of Object.entries(cmd.args ?? {})) {
    const aliases = def.alias ? (Array.isArray(def.alias) ? def.alias : [def.alias]).join(",") : "";
    lines.push(
      `help ${name} | arg ${argName} | type=${def.type ?? "string"} required=${def.required ?? false}` +
      `${aliases ? ` alias=${aliases}` : ""}${def.default !== undefined ? ` default=${JSON.stringify(def.default)}` : ""}` +
      ` | ${clean(def.description)}`,
    );
  }
  for (const [subName, sub] of Object.entries(cmd.subCommands ?? {})) {
    await walkCommand(sub, [...path, subName], lines);
  }
}

export async function snapshotLines() {
  const lines = [];
  await walkCommand(rootCommand, ["ge"], lines);

  for (const command of Object.values(GE_COMMANDS)) {
    const route = command.method && command.path ? `${command.method} ${command.path}` : "none";
    lines.push(`registry ${command.id} | route ${route} | cli ${clean(command.cli)} | risk ${command.risk} | duration ${clean(command.expectedDuration)}`);
    for (const key of Object.keys(command.requirements ?? {}).sort()) {
      lines.push(`registry ${command.id} | requires ${key}=${JSON.stringify(command.requirements[key])}`);
    }
    if (command.mcp) {
      lines.push(`mcp ${command.mcp.tool} | description | ${clean(command.mcp.description)}`);
      for (const [paramName, param] of Object.entries(command.mcp.params ?? {})) {
        lines.push(
          `mcp ${command.mcp.tool} | param ${paramName} | type=${param.type}` +
          `${param.enum ? ` enum=${param.enum.join(",")}` : ""} optional=${param.optional === true}`,
        );
      }
    }
  }

  return lines.sort();
}

const outPath = process.argv[2];
if (!outPath) {
  process.stderr.write("usage: bun tools/capability-snapshot.mjs <output-file>\n");
  process.exit(2);
}
const lines = await snapshotLines();
mkdirSync(dirname(outPath), { recursive: true });
writeFileSync(outPath, lines.join("\n") + "\n");
process.stdout.write(`wrote ${lines.length} capability lines → ${outPath}\n`);
