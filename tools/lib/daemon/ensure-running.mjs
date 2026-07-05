// tools/lib/daemon/ensure-running.mjs — the idempotent "make sure the local
// GE runtime daemon is up" core, extracted out of `ge daemon start`'s CLI
// handler (tools/ge/daemon.mjs) so a second caller can bind to the exact same
// logic instead of re-implementing it (or shelling out to `ge daemon start`
// as a subprocess just to get its side effect). tools/ge/daemon.mjs's
// daemonStart command is now a thin renderer over this function; this module
// owns the actual behavior: detect an already-healthy daemon, clear a stale
// pidfile if the last one died without cleaning up, spawn a detached
// `node tools/ge.mjs daemon start --foreground`, and poll until it answers
// its health check (or the 5s deadline elapses).
//
// Pure return/throw, no console output here (AGENTS.md convention) — every
// caller (the CLI renderer, or tools/lib/daemon/detached-submit.mjs's default
// ensureDaemon) gets a plain result object and decides for itself what to
// print, if anything.
import { spawn } from "node:child_process";
import { closeSync, existsSync, mkdirSync, openSync, readFileSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { REPO_ROOT } from "../state-paths.mjs";
import { daemonPaths, getDaemonStatus } from "../runtime-daemon.mjs";

// tools/lib/daemon/ensure-running.mjs -> tools/ge.mjs (the daemon re-spawns
// itself as `node <path> daemon start --foreground ...`), same resolution
// tools/ge/daemon.mjs uses for GE_CLI_PATH.
const GE_CLI_PATH = fileURLToPath(new URL("../../ge.mjs", import.meta.url));
const START_POLL_DEADLINE_MS = 5000;
const START_POLL_INTERVAL_MS = 200;

function readPidFile(pidPath) {
  if (!existsSync(pidPath)) return null;
  const pid = Number(readFileSync(pidPath, "utf8").trim());
  return Number.isFinite(pid) && pid > 0 ? pid : null;
}

function processAlive(pid) {
  if (!pid) return false;
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

function processLooksLikeDaemon(pid) {
  if (!pid) return false;
  if (!existsSync(`/proc/${pid}/cmdline`)) return true;
  try {
    const cmdline = readFileSync(`/proc/${pid}/cmdline`, "utf8").replaceAll("\0", " ");
    return cmdline.includes("tools/ge.mjs") && cmdline.includes("daemon") && cmdline.includes("start") && cmdline.includes("--foreground");
  } catch {
    return false;
  }
}

async function statusSnapshot(port) {
  const paths = daemonPaths();
  try {
    const status = await getDaemonStatus({ port });
    return { ok: true, pid: status.pid, port, dataDir: paths.dir, logPath: paths.logPath };
  } catch (e) {
    const pid = readPidFile(paths.pidPath);
    const alive = processAlive(pid) && processLooksLikeDaemon(pid);
    return {
      ok: false,
      status: alive ? "unreachable" : "stopped",
      pid: alive ? pid : null,
      port,
      dataDir: paths.dir,
      logPath: paths.logPath,
      error: e.message || String(e),
    };
  }
}

// Resolve { port, host } from an explicit port/host, or a baseUrl (parsed),
// or (last) the same env fallback `ge daemon start`/getDaemonStatus already
// use — so a caller that passes nothing behaves exactly like `ge daemon
// start` with no flags.
function resolveTarget({ port, host, baseUrl } = {}) {
  if (baseUrl) {
    const parsed = new URL(baseUrl);
    return {
      port: port ?? Number(parsed.port || daemonPaths().defaultPort),
      host: host || parsed.hostname || "127.0.0.1",
    };
  }
  return {
    port: port ?? Number(process.env.GE_DAEMON_PORT || daemonPaths().defaultPort),
    host: host || process.env.GE_DAEMON_HOST || "127.0.0.1",
  };
}

// ensureDaemonRunning({ port?, host?, baseUrl? }) -> result
//
// result.ok === true means the daemon is confirmed healthy (either it already
// was, or the spawn+poll loop saw it come up) — result.alreadyRunning /
// result.started distinguish which. result.ok === false means the 5s startup
// deadline elapsed without the health check answering (matches `ge daemon
// start`'s own "did not become healthy" fallback) — the caller decides
// whether that's fatal.
export async function ensureDaemonRunning({ port, host, baseUrl } = {}) {
  const target = resolveTarget({ port, host, baseUrl });
  const paths = daemonPaths();
  const existing = await statusSnapshot(target.port);
  if (existing.ok) {
    return { ok: true, alreadyRunning: true, started: false, clearedStale: false, pid: existing.pid, port: target.port, host: target.host, logPath: paths.logPath };
  }

  let clearedStale = false;
  let clearedPid = null;
  if (existing.status === "unreachable") {
    clearedStale = true;
    clearedPid = existing.pid;
    const pid = readPidFile(paths.pidPath);
    if (pid && processAlive(pid) && processLooksLikeDaemon(pid)) {
      try { process.kill(pid, "SIGTERM"); } catch { /* best-effort: stale pid may exit between the liveness probe and the kill */ }
    }
    rmSync(paths.pidPath, { force: true });
  }

  mkdirSync(paths.dir, { recursive: true });
  const logFd = openSync(paths.logPath, "a");
  const child = spawn(process.execPath, [GE_CLI_PATH, "daemon", "start", "--foreground", "--port", String(target.port), "--host", target.host], {
    cwd: REPO_ROOT,
    detached: true,
    stdio: ["ignore", logFd, logFd],
    env: { ...process.env, GE_DAEMON_PORT: String(target.port), GE_DAEMON_HOST: target.host, GE_DAEMON_BACKGROUND: "1" },
  });
  closeSync(logFd);
  child.unref();

  const deadline = Date.now() + START_POLL_DEADLINE_MS;
  while (Date.now() < deadline) {
    try {
      const current = await getDaemonStatus({ port: target.port });
      return { ok: true, alreadyRunning: false, started: true, clearedStale, clearedPid, pid: current.pid, port: target.port, host: target.host, logPath: paths.logPath };
    } catch {
      await new Promise((resolve) => setTimeout(resolve, START_POLL_INTERVAL_MS));
    }
  }
  const fallback = await statusSnapshot(target.port);
  return {
    ok: false,
    alreadyRunning: false,
    started: false,
    clearedStale,
    clearedPid,
    pid: fallback.pid || null,
    port: target.port,
    host: target.host,
    logPath: paths.logPath,
    status: fallback.status || "stopped",
    error: fallback.error || null,
  };
}
