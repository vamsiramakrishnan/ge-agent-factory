import { spawn as nodeSpawn, spawnSync as nodeSpawnSync } from "node:child_process";

const decode = (value) => {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return new TextDecoder().decode(value);
};

// Bun's node:child_process compatibility layer can lose piped bytes for sync
// children. Keep one runtime-neutral capture boundary for generators and
// subprocess oracles instead of weakening their output assertions.
export function spawnSyncCapture(command, args = [], { cwd, env, timeout, input } = {}) {
  if (globalThis.Bun?.spawnSync) {
    const result = globalThis.Bun.spawnSync([command, ...args], {
      ...(cwd ? { cwd } : {}),
      ...(env ? { env } : {}),
      ...(timeout ? { timeout } : {}),
      stdin: input == null ? "ignore" : Buffer.from(String(input)),
      stdout: "pipe",
      stderr: "pipe",
    });
    return {
      status: result.exitCode,
      signal: result.signalCode ?? null,
      stdout: decode(result.stdout),
      stderr: decode(result.stderr),
      error: result.error || null,
    };
  }

  return nodeSpawnSync(command, args, {
    ...(cwd ? { cwd } : {}),
    ...(env ? { env } : {}),
    ...(timeout ? { timeout } : {}),
    ...(input != null ? { input } : {}),
    encoding: "utf8",
  });
}

export function execFileSyncCapture(command, args = [], options = {}) {
  const result = spawnSyncCapture(command, args, options);
  if (result.error || result.status !== 0) {
    const detail = result.stderr || result.stdout || result.error?.message || "no output";
    const error = new Error(`Command failed: ${command} ${args.join(" ")}\n${detail}`);
    error.status = result.status;
    error.signal = result.signal;
    error.stdout = result.stdout;
    error.stderr = result.stderr;
    error.cause = result.error || undefined;
    throw error;
  }
  return result.stdout;
}

function bunSpawnCapture(command, args, { cwd, env, timeout, input } = {}) {
  const child = globalThis.Bun.spawn([command, ...args], {
    ...(cwd ? { cwd } : {}),
    ...(env ? { env } : {}),
    stdin: input == null ? "ignore" : Buffer.from(String(input)),
    stdout: "pipe",
    stderr: "pipe",
  });
  let timedOut = false;
  const timer = timeout ? setTimeout(() => {
    timedOut = true;
    child.kill();
  }, timeout) : null;
  timer?.unref?.();

  return Promise.all([
    new Response(child.stdout).text(),
    new Response(child.stderr).text(),
    child.exited,
  ]).then(([stdout, stderr, status]) => {
    if (timer) clearTimeout(timer);
    return {
      status,
      signal: child.signalCode ?? null,
      stdout,
      stderr,
      error: timedOut ? new Error(`Command timed out after ${timeout}ms`) : null,
    };
  });
}

function nodeSpawnCapture(command, args, { cwd, env, timeout, input } = {}) {
  return new Promise((resolve) => {
    const child = nodeSpawn(command, args, {
      ...(cwd ? { cwd } : {}),
      ...(env ? { env } : {}),
      stdio: [input == null ? "ignore" : "pipe", "pipe", "pipe"],
    });
    const stdout = [];
    const stderr = [];
    let spawnError = null;
    let timedOut = false;
    const timer = timeout ? setTimeout(() => {
      timedOut = true;
      child.kill();
    }, timeout) : null;
    timer?.unref?.();

    child.stdout.on("data", (chunk) => stdout.push(chunk));
    child.stderr.on("data", (chunk) => stderr.push(chunk));
    child.once("error", (error) => { spawnError = error; });
    child.once("close", (status, signal) => {
      if (timer) clearTimeout(timer);
      resolve({
        status: status ?? 1,
        signal,
        stdout: Buffer.concat(stdout).toString("utf8"),
        stderr: Buffer.concat(stderr).toString("utf8"),
        error: timedOut ? new Error(`Command timed out after ${timeout}ms`) : spawnError,
      });
    });
    if (input != null) child.stdin.end(String(input));
  });
}

export function spawnCapture(command, args = [], options = {}) {
  return globalThis.Bun?.spawn
    ? bunSpawnCapture(command, args, options)
    : nodeSpawnCapture(command, args, options);
}

export async function execFileCapture(command, args = [], options = {}) {
  const result = await spawnCapture(command, args, options);
  if (result.error || result.status !== 0) {
    const detail = result.stderr || result.stdout || result.error?.message || "no output";
    const error = new Error(`Command failed: ${command} ${args.join(" ")}\n${detail}`);
    error.status = result.status;
    error.signal = result.signal;
    error.stdout = result.stdout;
    error.stderr = result.stderr;
    error.cause = result.error || undefined;
    throw error;
  }
  return result.stdout;
}
