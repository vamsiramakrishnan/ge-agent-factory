#!/usr/bin/env bun
/**
 * ge — unified CLI for the GE Agent Factory (human surface).
 *
 * Lifecycle: set up the machine → stand up the project → run agents.
 *
 *   ge                 status board: project/app, planes ✓/○, next command
 *   ge up              stand up the platform (infra + data + tool planes) → doctor
 *   ge doctor          one report: toolchain · factory · data plane · tool plane
 *   ge agents build    build agents (cloud gateway, or --local via the harness)
 *
 * Commands are grouped by noun (infra/images/data/mcp/agents). Thin renderer over
 * tools/lib/factory-core.mjs — every command supports --json (result → stdout,
 * progress → stderr); the MCP server drives the same core for model/harness callers.
 *
 * This file is the composition root: it wires each command group (defined
 * under tools/ge/*) into the citty command tree. Shared helpers (emit,
 * cfgFrom, out, pc, common args, etc.) live in tools/ge/shared.mjs so every
 * group module can import them without a tangle of cross-imports.
 */

import { defineCommand, runMain } from "citty";
import { resolve } from "node:path";
import { cfgFrom, common, emit, out, pc } from "./ge/shared.mjs";
import * as core from "./lib/factory-core.mjs";
import { init } from "./ge/init.mjs";
import { cutover, mode, doctor, up, config } from "./ge/orientation.mjs";
import { devex } from "./ge/devex.mjs";
import { infra } from "./ge/infra.mjs";
import { images } from "./ge/images.mjs";
import { data } from "./ge/data.mjs";
import { mcp } from "./ge/mcp.mjs";
import { agents } from "./ge/agents.mjs";
import { pipeline } from "./ge/pipeline.mjs";
import { fleet } from "./ge/fleet.mjs";
import { runs } from "./ge/runs.mjs";
import { autopilot } from "./ge/autopilot.mjs";
import { mission } from "./ge/mission.mjs";
import { journey } from "./ge/journey.mjs";
import { daemon, runtime } from "./ge/daemon.mjs";
import { state } from "./ge/state.mjs";
import { ledger } from "./ge/ledger.mjs";
import { apply } from "./ge/apply.mjs";
import { shouldPromptForInitProject, GE_INIT_NO_PROJECT_MESSAGE } from "./ge/init.mjs";

// ── root: bare `ge` → status board + next step ────────────────────────────────
// citty invokes the root `run` even when a subcommand matches, so only render the
// board when the first positional is NOT one of our subcommands.
const SUBCOMMANDS = new Set(["up", "doctor", "init", "cutover", "mode", "devex", "config", "infra", "images", "data", "mcp", "agents", "pipeline", "fleet", "runs", "autopilot", "mission", "journey", "daemon", "runtime", "state", "ledger", "apply"]);
const root = defineCommand({
  meta: { name: "ge", description: "GE Agent Factory — set up · stand up · run agents. Bare `ge` shows status + next step." },
  args: { ...common },
  run({ args }) {
    const firstPositional = process.argv.slice(2).find((a) => !a.startsWith("-"));
    if (firstPositional && SUBCOMMANDS.has(firstPositional)) return; // a subcommand handles it
    const res = core.statusBoard(cfgFrom(args));
    emit(args, res, (r) => {
      out(pc.bold("\nGE Agent Factory"));
      // First run (no project configured): orient before reporting. Three
      // steps, each with an honest effort estimate — the status board's plane
      // detail only makes sense once there is a project to report on.
      if (!r.project) {
        out(pc.dim("  Turn an enterprise use case into a generated, tested, deployable agent."));
        out(pc.bold("\n  First run — three steps, all local, no cloud credentials:"));
        out(`  1. ${pc.cyan("mise run setup")}      ${pc.dim("toolchain + daemon (one time, ~5-10m)")}`);
        out(`  2. ${pc.cyan("ge init")}             ${pc.dim("discover config, write .ge.json (~30s)")}`);
        out(`  3. ${pc.cyan("ge devex smoke")}      ${pc.dim("prove the pipeline: doctor → canary agent build")}`);
        out(pc.dim("\n  then: ge pipeline status   (the full pipeline, stage by stage)"));
        out(pc.dim("  docs: docs/cookbooks/getting-started.md · ge --help for all commands"));
        return;
      }
      out(`  mode      ${pc.cyan(r.mode)}  ${pc.dim(r.clientDoes)}`);
      out(`  project   ${pc.cyan(r.project)}`);
      out(`  app       ${r.app ? pc.dim(r.app) : pc.yellow("<unset>")}`);
      out("");
      for (const p of r.planes) out(`  ${p.up ? pc.green("✓") : pc.yellow("○")} ${p.name.padEnd(12)} ${pc.dim(p.detail)}`);
      out(`\n  next: ${pc.bold(pc.cyan(r.next))}`);
      out(pc.dim("  (ge --help for all commands · ge mode to switch local/remote · ge pipeline status for the pipeline)"));
    });
  },
  subCommands: {
    // lifecycle
    up, doctor, init, cutover, mode, devex, config,
    // the consolidated orchestration surface
    pipeline, fleet, runs,
    // noun groups
    infra, images, data, mcp, agents, daemon, state, ledger,
    // deprecated aliases (journey/mission → pipeline · autopilot → fleet repair · runtime → runs)
    autopilot, mission, journey, runtime,
    // declarative reconcile
    apply,
  },
});

// The full citty command tree, exported so tooling (tools/gen-cli-reference.mjs)
// can walk it without spawning the CLI. Importing this module never runs the
// CLI — see the __isEntryPoint guard below.
export const rootCommand = root;

// Pure logic exported for unit tests (e.g. the init-command project-resolution
// gating below, defined in ./ge/init.mjs). Guarded so importing this module
// for tests doesn't also run the CLI against the test runner's own argv.
export const __test = { shouldPromptForInitProject, GE_INIT_NO_PROJECT_MESSAGE };

const __isEntryPoint = (() => {
  try {
    const invoked = process.argv?.[1] ? new URL(`file://${resolve(process.argv[1])}`).href : null;
    return invoked === import.meta.url;
  } catch {
    return false;
  }
})();

if (__isEntryPoint) {
  runMain(root).catch((e) => { process.stderr.write(pc.red(`✗ ${e?.message || e}`) + "\n"); process.exit(1); });
}
