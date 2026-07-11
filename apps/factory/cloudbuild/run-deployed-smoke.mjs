#!/usr/bin/env bun

import { appendFile, mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";

const RETRYABLE_FAILURE = /(?:read timed out|timed? out|timeout|deadline exceeded|temporarily unavailable|service unavailable|connection (?:reset|aborted|refused)|remote end closed|econnreset|econnrefused|\b(?:408|409|425|429|500|502|503|504)\b)/i;

function boundedInteger(value, fallback, { min, max }) {
  const parsed = Number.parseInt(String(value ?? ""), 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.max(min, Math.min(max, parsed));
}

function joinedOutput(stdout, stderr) {
  const parts = [stdout, stderr].map((part) => String(part || "").trimEnd()).filter(Boolean);
  return parts.length ? `${parts.join("\n")}\n` : "";
}

export function isRetryableSmokeFailure({ exitCode, timedOut = false, stdout = "", stderr = "" } = {}) {
  if (timedOut || exitCode === 124 || exitCode === 143) return true;
  return RETRYABLE_FAILURE.test(`${stdout}\n${stderr}`);
}

export async function executeAgentsCli({ command, cwd = process.cwd(), env = process.env, timeoutMs }) {
  const child = Bun.spawn(command, {
    cwd,
    env,
    stdout: "pipe",
    stderr: "pipe",
  });
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    child.kill("SIGTERM");
  }, timeoutMs);
  try {
    const [stdout, stderr, exitCode] = await Promise.all([
      new Response(child.stdout).text(),
      new Response(child.stderr).text(),
      child.exited,
    ]);
    return { stdout, stderr, exitCode: Number.isInteger(exitCode) ? exitCode : 1, timedOut };
  } finally {
    clearTimeout(timer);
  }
}

export async function runDeployedSmoke({
  url,
  prompt = "hello",
  outputPath = "artifacts/deployed-smoke-stdout.log",
  metadataPath = "artifacts/deployed-smoke.json",
  retries = 2,
  timeoutSeconds = 150,
  cwd = process.cwd(),
  env = process.env,
  execute = executeAgentsCli,
  sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
  progress = (phase, message) => process.stdout.write(`::ge-progress ${phase} ${message}\n`),
} = {}) {
  if (!url) throw new Error("--url is required for the deployed smoke test");

  const retryCount = boundedInteger(retries, 2, { min: 0, max: 4 });
  const attemptLimit = retryCount + 1;
  const effectiveTimeoutSeconds = boundedInteger(timeoutSeconds, 150, { min: 30, max: 600 });
  await mkdir(dirname(outputPath), { recursive: true });
  await mkdir(dirname(metadataPath), { recursive: true });
  await writeFile(outputPath, "", "utf8");

  const attempts = [];
  let lastResult = { exitCode: 1, timedOut: false, stdout: "", stderr: "" };
  for (let attempt = 1; attempt <= attemptLimit; attempt += 1) {
    progress("poll_runtime.smoke.attempt", `agents-cli run deployed smoke attempt ${attempt}/${attemptLimit}`);
    const attemptPath = outputPath.replace(/\.log$/i, `-attempt-${attempt}.log`);
    const startedAt = new Date().toISOString();
    lastResult = await execute({
      command: ["agents-cli", "run", prompt, "--url", url, "--mode", "adk"],
      cwd,
      env,
      timeoutMs: effectiveTimeoutSeconds * 1000,
      attempt,
    });
    const output = joinedOutput(lastResult.stdout, lastResult.stderr);
    await writeFile(attemptPath, output, "utf8");
    await appendFile(outputPath, `=== attempt ${attempt}/${attemptLimit} (${startedAt}) ===\n${output}`, "utf8");

    const retryable = lastResult.exitCode !== 0 && isRetryableSmokeFailure(lastResult);
    attempts.push({
      attempt,
      exitCode: lastResult.exitCode,
      timedOut: Boolean(lastResult.timedOut),
      retryable,
      log: attemptPath,
    });
    if (lastResult.exitCode === 0) {
      const result = {
        status: "passed",
        attempts,
        attemptCount: attempt,
        maxAttempts: attemptLimit,
        timeoutSeconds: effectiveTimeoutSeconds,
        url,
      };
      await writeFile(metadataPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
      progress("poll_runtime.smoke.done", `deployed smoke passed on attempt ${attempt}/${attemptLimit}`);
      return result;
    }
    if (!retryable || attempt >= attemptLimit) break;
    progress("poll_runtime.smoke.retry", `transient deployed smoke failure; retrying after ${attempt * 5}s`);
    await sleep(attempt * 5000);
  }

  const result = {
    status: "failed",
    attempts,
    attemptCount: attempts.length,
    maxAttempts: attemptLimit,
    timeoutSeconds: effectiveTimeoutSeconds,
    url,
    exitCode: lastResult.exitCode,
  };
  await writeFile(metadataPath, `${JSON.stringify(result, null, 2)}\n`, "utf8");
  const error = new Error(`deployed smoke failed after ${attempts.length}/${attemptLimit} attempt(s)`);
  error.exitCode = lastResult.exitCode || 1;
  throw error;
}

function parseArgs(argv) {
  const parsed = {};
  for (let index = 0; index < argv.length; index += 1) {
    const key = argv[index];
    if (!key.startsWith("--")) throw new Error(`unexpected argument: ${key}`);
    const value = argv[index + 1];
    if (value == null || value.startsWith("--")) throw new Error(`${key} requires a value`);
    parsed[key.slice(2)] = value;
    index += 1;
  }
  return parsed;
}

if (import.meta.main) {
  try {
    const args = parseArgs(process.argv.slice(2));
    await runDeployedSmoke({
      url: args.url,
      prompt: args.prompt || "hello",
      outputPath: args.output || "artifacts/deployed-smoke-stdout.log",
      metadataPath: args.metadata || "artifacts/deployed-smoke.json",
      retries: args.retries,
      timeoutSeconds: args["timeout-seconds"],
    });
  } catch (error) {
    process.stderr.write(`${error?.message || String(error)}\n`);
    process.exitCode = Number(error?.exitCode) || 1;
  }
}
