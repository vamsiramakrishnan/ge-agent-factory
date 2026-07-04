// golden-path — the three first-class verbs (capture · prove · handoff) and
// the position report behind the bare-`ge` board and the console header.
//
// These verbs are a better front door on the same house: each one dispatches
// to an implementation that already exists and stays supported under its own
// name — nothing here forks logic.
//
//   capture  → the console Interview (starts it if needed, deep-links it);
//              `--from <spec.json>` wires the existing registerSpec path
//   prove    → fresh machine (no agents built yet): firstProof (health check
//              → first validated workspace); agents present: provisionLocal /
//              provision — exactly what `ge agents build` runs
//   handoff  → the release op (upload proven workspaces, run the
//              post-boundary stages remotely), gated on a known target so an
//              unsupported target is a four-field DxError, not a stack trace
//
// House pattern: createGoldenPathOps takes its cross-cutting dependencies
// injected (same shape as createProvisionOps and friends) because
// factory-core.mjs is the module that composes and re-exports these — this
// file must not import factory-core.mjs back.
import { existsSync, mkdirSync, openSync, readdirSync } from "node:fs";
import { spawn } from "node:child_process";
import { join } from "node:path";
import { readJson } from "@ge/std/json-io";
import { DxError } from "./errors/dx-error.mjs";
import { REPO_ROOT, STATE_PATHS, LEGACY_STATE_PATHS, allExistingPaths } from "./state-paths.mjs";
import { LOCAL_PROJECTS, LOCAL_PROJECT_STORE, workspaceStoreItems } from "./local-workspaces.mjs";
import { ledgerRuns } from "./ledger/factory-ledger.mjs";

const noop = () => {};

// The console Interview is capture's front door today (CLI-native capture is
// roadmap). One port, one deep link — both also printed by `mise run console`.
export const CONSOLE_PORT = 18260;
export const CAPTURE_URL = `http://localhost:${CONSOLE_PORT}/#/interview`;

// Contract sources that should re-trigger a proof in `ge prove --watch`:
// captured contracts (agent-spec.json under the interviews root) and the
// checked-in catalog specs the factory builds from. Pure computation feeds on
// these, so watching them is safe to loop — the build boundary stops anything
// cloud-side from re-running.
export function contractWatchRoots(repoRoot) {
  return allExistingPaths([
    STATE_PATHS.interviews.root,
    LEGACY_STATE_PATHS.interviews.root,
    join(repoRoot, "apps", "factory", "catalog"),
  ]);
}

async function consoleAlive(port = CONSOLE_PORT) {
  try {
    const res = await fetch(`http://127.0.0.1:${port}/`, { signal: AbortSignal.timeout(1200) });
    return res.ok || res.status < 500;
  } catch {
    return false;
  }
}

function countCapturedSpecs() {
  let specs = 0;
  for (const root of allExistingPaths([STATE_PATHS.interviews.root, LEGACY_STATE_PATHS.interviews.root])) {
    for (const dir of readdirSync(root, { withFileTypes: true })) {
      if (dir.isDirectory() && existsSync(join(root, dir.name, "agent-spec.json"))) specs += 1;
    }
  }
  return specs;
}

function listBuiltWorkspaces() {
  const store = readJson(LOCAL_PROJECT_STORE, { workspaces: [] });
  return workspaceStoreItems(store).filter((ws) => ws?.id && existsSync(join(LOCAL_PROJECTS, ws.id)));
}

// `listWorkspaces` / `probeConsole` default to the real file/port probes and
// exist as injection points so the dispatch rules are unit-testable without a
// workspace store or a live console.
export function createGoldenPathOps({ repoRoot, firstProof, provisionLocal, provision, handoffRun, registerSpec, listWorkspaces = listBuiltWorkspaces, probeConsole = consoleAlive }) {
  // ── capture ────────────────────────────────────────────────────────────────
  // Start the console if it isn't running, deep-link the Interview, and say
  // exactly what happened. With --from <agent-spec.json>, also register the
  // spec through the existing registerSpec path (the only CLI-native capture
  // entry point that exists today — document grounding stays console-side).
  async function capture(cfg, { from = null, log = noop } = {}) {
    let registered = null;
    if (from) {
      log(`registering captured contract ${from}`);
      registered = registerSpec({ input: from });
    }

    const alreadyRunning = await probeConsole();
    let started = false;
    if (!alreadyRunning) {
      log("console not running — starting it (bun run dev in apps/console)");
      mkdirSync(STATE_PATHS.console.root, { recursive: true });
      const logPath = join(STATE_PATHS.console.root, "console.log");
      const logFd = openSync(logPath, "a");
      const child = spawn("bun", ["run", "dev"], {
        cwd: join(repoRoot, "apps", "console"),
        detached: true,
        stdio: ["ignore", logFd, logFd],
      });
      child.unref();
      // Give Vite a moment; report honestly if it still isn't up.
      const deadline = Date.now() + 20000;
      while (Date.now() < deadline && !(await probeConsole())) {
        await new Promise((res) => setTimeout(res, 500));
      }
      started = await probeConsole();
      if (!started) {
        throw new DxError("console did not come up on port " + CONSOLE_PORT + ".", {
          where: `console dev server (log: ${logPath})`,
          why: "capture is console-first today — the Interview needs the console running, and it failed to start in 20s",
          fix: "mise run console",
        });
      }
    }

    return {
      kind: "ge.capture",
      url: CAPTURE_URL,
      console: { port: CONSOLE_PORT, alreadyRunning, started },
      registered,
      note: "capture is console-first today: the Interview does conversational capture, document grounding, and contract editing. CLI-native capture is roadmap.",
      next: "ge prove",
    };
  }

  // ── prove ──────────────────────────────────────────────────────────────────
  // One verb, one dispatch rule: nothing built yet → the fresh-machine first
  // proof (health check → first validated workspace); workspaces present →
  // build them (agents build), honoring the active mode. Verify verdicts
  // stream through `log` exactly as the underlying implementations emit them.
  async function prove(cfg, { id = null, target = null, force = false, vertex = false, warm = false, preview = false, log = noop } = {}) {
    const workspaces = listWorkspaces();
    if (!workspaces.length && !id) {
      log("no agents built yet — proving from scratch (health check → first agent build)");
      const result = await firstProof(cfg, { target: target || "validated", preview, vertex, warm, force, log });
      return { ...result, kind: "ge.prove", path: "fresh" };
    }
    const mode = cfg.mode || "local";
    log(`${workspaces.length || "requested"} workspace(s) → rebuilding proof (${mode} mode)`);
    const result = mode === "remote"
      ? await provision(cfg, { ids: id || undefined, force, log })
      : await provisionLocal(cfg, { ids: id || undefined, target: target || undefined, vertex: vertex || undefined, warm, force, log });
    return { ...result, kind: "ge.prove", path: "build", ok: result.ok !== false, mode };
  }

  // ── handoff ────────────────────────────────────────────────────────────────
  // `agents-cli` is the supported target today (agents-cli deploy →
  // Agent Engine → Gemini Enterprise). Anything else gets the error contract.
  const HANDOFF_TARGETS = ["agents-cli"];
  async function handoff(cfg, { target = "agents-cli", ids = undefined, startStage = undefined, targetStage = undefined, concurrency = undefined, noProxy = undefined, force = undefined, log = noop } = {}) {
    if (!HANDOFF_TARGETS.includes(target)) {
      throw new DxError(`unsupported handoff target '${target}'.`, {
        where: "handoff target",
        why: `supported today: ${HANDOFF_TARGETS.join(", ")} (releases local builds through agents-cli deploy to Agent Engine / Gemini Enterprise); more targets are roadmap`,
        fix: "ge handoff agents-cli",
      });
    }
    const result = await handoffRun(cfg, { ids, startStage, targetStage, concurrency, noProxy, force, log });
    return { kind: "ge.handoff", target, ...result };
  }

  return { capture, prove, handoff, goldenPathPosition };
}

// ── position ─────────────────────────────────────────────────────────────────
// The three questions the bare board answers: where am I on
// capture → prove → handoff, what blocks me, what do I type next. Cheap,
// local reads only — this runs on every bare `ge` and on the console shell's
// position header (which imports THIS module directly, not factory-core, so
// the header doesn't drag the whole operator core into the API server).
export async function goldenPathPosition(cfg = {}, { haveConfig = true, operateNext = null } = {}) {
  const repoRoot = REPO_ROOT;
  const captured = countCapturedSpecs();
  const workspaces = listBuiltWorkspaces();
  const catalogAvailable = existsSync(join(repoRoot, "apps", "factory", "catalog"));

  let shipped = 0;
  let lastFailure = null;
  try {
    const runs = await ledgerRuns({ limit: 25 });
    shipped = runs.filter((run) => run.kind === "handoff").length;
    const latest = runs[0];
    if (latest && latest.status === "failed") lastFailure = { runId: latest.id, kind: latest.kind || "build" };
  } catch { /* ledger unavailable (no sqlite driver) — position still renders from file state */ }

  const stages = [
    {
      id: "capture",
      done: captured > 0 || workspaces.length > 0,
      detail: captured > 0
        ? `${captured} contract(s) captured`
        : workspaces.length > 0
          ? "building from the checked-in catalog"
          : catalogAvailable ? "no contracts captured yet — catalog ready for a first proof" : "no contracts captured yet",
    },
    {
      id: "prove",
      done: workspaces.length > 0,
      detail: workspaces.length > 0 ? `${workspaces.length} workspace(s) built to the boundary` : "no proof built yet",
    },
    {
      id: "handoff",
      done: shipped > 0,
      detail: shipped > 0 ? `${shipped} handoff run(s)` : "nothing handed off yet",
    },
  ];

  let blocker = null;
  let next;
  if (!haveConfig) {
    next = "ge init";
    blocker = "no project configured";
  } else if (lastFailure) {
    blocker = `last ${lastFailure.kind} run failed (${lastFailure.runId})`;
    next = "ge agents resume";
  } else if (!stages[0].done) {
    next = "ge capture";
  } else if (!stages[1].done) {
    next = "ge prove";
  } else if (!stages[2].done) {
    next = "ge handoff agents-cli";
  } else {
    next = operateNext || "ge prove";
  }

  const current = stages.find((stage) => !stage.done)?.id || "handoff";
  return { stages, current, blocker, next };
}
