// tools/ge/help.mjs — the root `ge --help` renderer: progressive disclosure.
//
// citty 0.2.x renders subcommands as one flat list; the golden path deserves
// the first screen. This renderer groups instead of hiding: every command the
// tree contains renders here (the gen-cli-reference test walks the tree, and
// the capability snapshot diff would catch a dropped name), the golden-path
// verbs just come first. Wired via runMain's `showUsage` option — no citty
// fork; subcommand help stays citty's own.
//
// The Golden path section is a language-gate zone (tools/lang-gate.mjs):
// operator-register terms must not appear in it. Keep its copy in the golden
// register (agent, contract, proof, handoff) — the gate fails CI otherwise.
import pc from "picocolors";

// Order is the message: the four verbs a stranger needs, in the order they
// need them.
export const GOLDEN_PATH_COMMANDS = ["capture", "prove", "handoff", "status"];

// Operate commands, in lifecycle order (machine → platform → agents → observe).
const OPERATE_COMMANDS = ["init", "up", "mode", "doctor", "devex", "agents", "pipeline", "fleet", "runs", "infra", "images", "data", "mcp", "daemon", "state", "ledger", "apply", "config", "cutover"];

function commandLine(name, sub, width) {
  const description = sub?.meta?.description || "";
  return `  ${pc.cyan(name.padEnd(width))} ${pc.dim(description)}`;
}

// Render ONLY the golden-path section body (exported separately so the
// language gate can check exactly the zone the work order names).
export function renderGoldenPathSection(root, { colors = true } = {}) {
  const width = 10;
  const lines = [];
  for (const name of GOLDEN_PATH_COMMANDS) {
    const sub = root.subCommands?.[name];
    if (!sub) continue;
    lines.push(commandLine(name, sub, width));
  }
  const text = lines.join("\n");
  return colors ? text : text.replace(/\x1b\[[0-9;]*m/g, "");
}

export function renderRootUsage(root) {
  const allNames = Object.keys(root.subCommands || {});
  const grouped = new Set([...GOLDEN_PATH_COMMANDS, ...OPERATE_COMMANDS]);
  // Anything new that hasn't been assigned a group yet still renders — under
  // Operate, never dropped.
  const ungrouped = allNames.filter((name) => !grouped.has(name));
  const width = Math.max(...allNames.map((name) => name.length), 10);

  const section = (title, names) => {
    const lines = names
      .filter((name) => root.subCommands?.[name])
      .map((name) => commandLine(name, root.subCommands[name], width));
    return lines.length ? [pc.bold(title), ...lines, ""] : [];
  };

  return [
    pc.bold("GE Agent Factory") + pc.dim(" — turn an enterprise use case into a proven, deployable agent."),
    "",
    `${pc.dim("usage:")} ge ${pc.dim("[command] [flags]")}   ${pc.dim("· bare `ge` answers: where am I, what blocks me, what next")}`,
    "",
    ...section("Golden path", GOLDEN_PATH_COMMANDS),
    ...section("Operate", [...OPERATE_COMMANDS, ...ungrouped]),
    pc.dim("Every command supports --json. `ge <command> --help` for flags; docs/reference/cli.md for the full reference."),
  ].join("\n");
}
