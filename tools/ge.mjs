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

import { defineCommand, runMain, showUsage as cittyShowUsage } from "citty";
import { resolve } from "node:path";
import { cfgFrom, common, emit, out, pc, ui } from "./ge/shared.mjs";
import * as core from "./lib/factory-core.mjs";
import { init } from "./ge/init.mjs";
import { cutover, mode, doctor, up, config } from "./ge/orientation.mjs";
import { capture } from "./ge/capture.mjs";
import { drive } from "./ge/drive.mjs";
import { bench } from "./ge/bench.mjs";
import { evals } from "./ge/evals.mjs";
import { prove } from "./ge/prove.mjs";
import { handoff } from "./ge/handoff.mjs";
import { renderRootUsage, renderCommandOrientation } from "./ge/help.mjs";
import { devex } from "./ge/devex.mjs";
import { infra } from "./ge/infra.mjs";
import { images } from "./ge/images.mjs";
import { data } from "./ge/data.mjs";
import { mcp } from "./ge/mcp.mjs";
import { agents } from "./ge/agents.mjs";
import { pipeline } from "./ge/pipeline.mjs";
import { fleet } from "./ge/fleet.mjs";
import { runs } from "./ge/runs.mjs";
import { daemon } from "./ge/daemon.mjs";
import { state } from "./ge/state.mjs";
import { ledger } from "./ge/ledger.mjs";
import { apply } from "./ge/apply.mjs";
import { okf } from "./ge/okf.mjs";
import { shouldPromptForInitProject, GE_INIT_NO_PROJECT_MESSAGE } from "./ge/init.mjs";

// ── root: bare `ge` → the three-question board + next step ───────────────────
// citty invokes the root `run` even when a subcommand matches, so only render the
// board when the first positional is NOT one of our subcommands.
const SUBCOMMANDS = new Set(["capture", "prove", "handoff", "status", "drive", "bench", "evals", "up", "doctor", "init", "cutover", "mode", "devex", "config", "infra", "images", "data", "mcp", "agents", "pipeline", "fleet", "runs", "daemon", "state", "ledger", "apply", "okf"]);

// The board answers three questions before anything else: where am I on
// capture → prove → handoff, what blocks me, and the exact next command.
// The pre-existing mode/planes report stays intact below an Operate divider.
async function statusBoardResult(args) {
  const cfg = cfgFrom(args);
  const res = core.statusBoard(cfg);
  const goldenPath = await core.goldenPathPosition(cfg, { haveConfig: !!res.project, operateNext: res.next });
  return { ...res, goldenPath };
}

function renderStatusBoard(r) {
  // Contract (tools/ge/status-board.test.mjs): the first four non-blank lines
  // are title → "capture → prove → handoff…" → "blocker …" → "next ge …".
  out(ui.title("GE Agent Factory"));
  const gp = r.goldenPath;
  if (gp) {
    const stageWord = (stage) => stage.done ? pc.green(stage.id) : stage.id === gp.current ? ui.cmd(stage.id) : pc.dim(stage.id);
    const currentDetail = gp.stages.find((stage) => stage.id === gp.current)?.detail;
    out(`  ${gp.stages.map(stageWord).join(pc.dim(" → "))}${currentDetail ? pc.dim(`   (${currentDetail})`) : ""}`);
    out(ui.kv([
      ["blocker", gp.blocker ? pc.red(gp.blocker) : pc.dim("none")],
      ["next", ui.cmd(gp.next)],
    ]));
  }
  // First run (no project configured): orient before reporting. Three
  // steps, each with an honest effort estimate — the status board's plane
  // detail only makes sense once there is a project to report on.
  if (!r.project) {
    out(pc.dim("\n  Turn an enterprise use case into a generated, tested, deployable agent."));
    out(ui.section("First run — three steps, all local, no cloud credentials:"));
    const steps = [
      ["mise run setup", "toolchain + daemon (one time, ~5-10m)"],
      ["ge init", "discover config, write .ge.json (~30s)"],
      ["ge prove", "first proof: health check → first agent built and validated"],
    ];
    const stepWidth = Math.max(...steps.map(([command]) => command.length));
    steps.forEach(([command, note], i) => out(`  ${i + 1}. ${ui.padVisible(ui.cmd(command), stepWidth)}   ${pc.dim(note)}`));
    out(`\n  ${pc.dim("then:")} ${ui.cmd("ge capture")}   ${pc.dim("(capture your own agent contract in the console)")}`);
    out(pc.dim("  docs: docs/start/getting-started.md · ge --help for all commands"));
    return;
  }
  out(ui.divider("Operate"));
  out(ui.kv([
    { key: "mode", value: ui.cmd(r.mode), note: r.clientDoes },
    ["project", ui.cmd(r.project)],
    ["app", r.app ? pc.dim(r.app) : pc.yellow("<unset>")],
  ]));
  out("");
  out(ui.kv(r.planes.map((p) => ({ glyph: p.up ? "passed" : "queued", key: p.name, value: pc.dim(p.detail) }))));
  out(pc.dim("\n  (ge --help for all commands · ge mode to switch local/remote · ge pipeline status for the pipeline)"));
  out(ui.next(r.next));
}

// `ge status` — the board as a first-class verb (the bare spelling stays).
const status = defineCommand({
  meta: { name: "status", description: "Where am I? Position on capture → prove → handoff, the current blocker, and the exact next command" },
  args: { ...common },
  async run({ args }) {
    const res = await statusBoardResult(args);
    emit(args, res, renderStatusBoard);
  },
});

const root = defineCommand({
  meta: { name: "ge", description: "GE Agent Factory — set up · stand up · run agents. Bare `ge` shows status + next step." },
  args: { ...common },
  async run({ args }) {
    const firstPositional = process.argv.slice(2).find((a) => !a.startsWith("-"));
    if (firstPositional && SUBCOMMANDS.has(firstPositional)) return; // a subcommand handles it
    const res = await statusBoardResult(args);
    emit(args, res, renderStatusBoard);
  },
  subCommands: {
    // the golden path
    capture, prove, handoff, status,
    // live surfaces (drive/verify/load the shipped agent)
    drive, bench, evals,
    // lifecycle
    up, doctor, init, cutover, mode, devex, config,
    // the consolidated orchestration surface
    pipeline, fleet, runs,
    // noun groups
    infra, images, data, mcp, agents, daemon, state, ledger,
    okf,
    // declarative reconcile
    apply,
  },
});

// Root `--help` renders grouped (Golden path first, Operate after) —
// progressive disclosure without hiding a single command. Subcommand help
// stays citty's renderer, followed by the registry-sourced ORIENTATION
// section (use-when, duration, risk, literal next commands) so a --help
// screen positions the reader instead of only listing flags.
async function showGroupedUsage(cmd, parent) {
  if (cmd !== root) {
    await cittyShowUsage(cmd, parent);
    const orientation = renderCommandOrientation(cmd.meta?.name);
    if (orientation) out(orientation);
    return;
  }
  out(renderRootUsage(root));
}

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
  runMain(root, { showUsage: showGroupedUsage }).catch((e) => { process.stderr.write(pc.red(`✗ ${e?.message || e}`) + "\n"); process.exit(1); });
}
