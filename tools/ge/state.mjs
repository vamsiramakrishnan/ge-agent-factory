// tools/ge/state.mjs — `ge state paths|reset`. Moved verbatim out of
// tools/ge.mjs.
import { defineCommand } from "citty";
import { existsSync, rmSync } from "node:fs";
import { LEGACY_STATE_PATHS, STATE_PATHS, ensureStateLayout, displayStatePath } from "../lib/state-paths.mjs";
import { guarded, emit, out, pc, readPidFile, processAlive, processLooksLikeDaemon } from "./shared.mjs";
import { daemonPaths } from "../lib/runtime-daemon.mjs";

const stateReset = defineCommand({
  meta: { name: "reset", description: "Clear local GE runtime/factory/mission/interview state" },
  args: {
    yes: { type: "boolean", description: "Confirm destructive local state reset" },
    json: { type: "boolean", description: "Machine-readable JSON result on stdout" },
  },
  run: guarded(({ args }) => {
    if (!args.yes) throw new Error("state reset is destructive; rerun with `ge state reset --yes`");
    const paths = daemonPaths();
    const pid = readPidFile(paths.pidPath);
    const stopped = Boolean(pid && processAlive(pid) && processLooksLikeDaemon(pid));
    if (stopped) {
      try { process.kill(pid, "SIGTERM"); } catch {}
    }
    const targets = [
      STATE_PATHS.root,
      LEGACY_STATE_PATHS.runtime.root,
      LEGACY_STATE_PATHS.missions.root,
      LEGACY_STATE_PATHS.interviews.root,
      LEGACY_STATE_PATHS.skills.root,
      LEGACY_STATE_PATHS.console.jobs,
      LEGACY_STATE_PATHS.factory.root,
      LEGACY_STATE_PATHS.factory.projects,
      LEGACY_STATE_PATHS.factory.projectsJson,
      LEGACY_STATE_PATHS.cache.uv,
    ].filter(Boolean);
    const removed = [];
    for (const target of targets) {
      if (!existsSync(target)) continue;
      rmSync(target, { recursive: true, force: true });
      removed.push(displayStatePath(target));
    }
    ensureStateLayout();
    const result = {
      ok: true,
      canonicalRoot: displayStatePath(STATE_PATHS.root),
      stoppedDaemon: stopped ? pid : null,
      removed,
      recreated: [
        displayStatePath(STATE_PATHS.runtime.runs),
        displayStatePath(STATE_PATHS.missions.root),
        displayStatePath(STATE_PATHS.interviews.root),
        displayStatePath(STATE_PATHS.factory.workspaces),
        displayStatePath(STATE_PATHS.cache.uv),
      ],
    };
    emit(args, result, (r) => {
      out(pc.green(`✓ reset local GE state under ${r.canonicalRoot}`));
      if (r.stoppedDaemon) out(pc.dim(`  stopped daemon pid=${r.stoppedDaemon}`));
      if (r.removed.length) out(pc.dim(`  removed ${r.removed.length} state path(s)`));
      out(pc.dim("  next: mise run setup && ge daemon start"));
    });
  }),
});

const statePaths = defineCommand({
  meta: { name: "paths", description: "Show the canonical local GE state layout" },
  args: {
    json: { type: "boolean", description: "Machine-readable JSON result on stdout" },
  },
  run: guarded(({ args }) => {
    const paths = {
      root: { path: displayStatePath(STATE_PATHS.root), means: "one local state root for this repository" },
      runtime: { path: displayStatePath(STATE_PATHS.runtime.root), means: "durable task runs, events, resume plans, daemon metadata" },
      missions: { path: displayStatePath(STATE_PATHS.missions.root), means: "scenario data plans, generated rows, simulator seed overlays, validation artifacts" },
      interviews: { path: displayStatePath(STATE_PATHS.interviews.root), means: "generated interview specs before/after registry review" },
      factory: { path: displayStatePath(STATE_PATHS.factory.root), means: "factory plans, build run metadata, generated workspaces" },
      workspaces: { path: displayStatePath(STATE_PATHS.factory.workspaces), means: "generated agent code workspaces" },
      skills: { path: displayStatePath(STATE_PATHS.skills.root), means: "synced harness skill manifest and skill cache" },
      console: { path: displayStatePath(STATE_PATHS.console.root), means: "console job database and UI-local execution records" },
      cache: { path: displayStatePath(STATE_PATHS.cache.root), means: "tool caches such as uv/Snowfakery" },
    };
    emit(args, { kind: "ge.state.paths", paths }, (result) => {
      out(pc.bold("\nGE Local State"));
      for (const [name, entry] of Object.entries(result.paths)) {
        out(`  ${pc.cyan(name.padEnd(10))} ${entry.path.padEnd(28)} ${pc.dim(entry.means)}`);
      }
      out(pc.dim("\n  reset: ge state reset --yes"));
    });
  }),
});

export const state = defineCommand({
  meta: { name: "state", description: "Local GE state: paths · reset" },
  subCommands: { paths: statePaths, reset: stateReset },
});
