#!/usr/bin/env bun
/**
 * Dev entry-point guard.
 *
 * `bun run dev` / `make dev` used to silently start ONLY the presentation app,
 * which was a footgun (you couldn't tell which app — or whether both — would run).
 * Now the bare verbs print this menu and start nothing; you pick an app explicitly.
 */
const apps = [
  ["console", "Main operator UI: Pipeline, specs, Fleet, Activity, Doctor (:18260)", "bun run dev:console", "make console"],
  ["presentation", "Transformation deck and source use-case catalog (:18250)", "bun run dev:presentation", "make presentation"],
  ["generator", "Lower-level generator workbench for mock data/workspaces (:17655)", "bun run dev:generator", "make generator"],
];

const bold = (s) => `\x1b[1m${s}\x1b[0m`;
const cyan = (s) => `\x1b[36m${s}\x1b[0m`;
const dim = (s) => `\x1b[2m${s}\x1b[0m`;

console.log(`\n${bold("Pick one local app to run — this command starts nothing on its own.")}\n`);
console.log(`${dim("Most developers want:")} ${cyan("make console")} ${dim("then open http://localhost:18260")}\n`);
for (const [name, desc, bunCmd, makeCmd] of apps) {
  console.log(`  ${cyan(name.padEnd(13))} ${desc}`);
  console.log(`  ${" ".repeat(13)} ${dim(`${bunCmd}   ·   ${makeCmd}`)}\n`);
}
console.log(`${dim("Build/serve a single app:")} bun run build:console | build:presentation · start:console | start:presentation`);
console.log(`${dim("Need the next command?")} make next`);
console.log(`${dim("Everything else:")} make help\n`);
// Non-zero so scripts/CI never mistake the guard for a successful app launch.
process.exit(1);
