#!/usr/bin/env node
import { spawn } from "node:child_process";

const daemonPort = process.env.GE_HARNESS_PORT || "17654";
const webPort = process.env.GE_HARNESS_WEB_PORT || "17655";
const host = process.env.GE_HARNESS_HOST || "127.0.0.1";
const daemonUrl = process.env.GE_HARNESS_DAEMON_URL || `http://${host}:${daemonPort}`;
const startupTimeoutMs = Number(process.env.GE_HARNESS_STARTUP_TIMEOUT_MS || 10_000);

const children = [];

function start(name, args) {
  const child = spawn("bun", args, {
    stdio: ["ignore", "pipe", "pipe"],
    env: {
      ...process.env,
      GE_HARNESS_HOST: host,
      GE_HARNESS_PORT: daemonPort,
      GE_HARNESS_WEB_PORT: webPort,
      GE_HARNESS_DAEMON_URL: daemonUrl,
    },
  });
  children.push(child);
  child.on("error", (error) => {
    if (shuttingDown) return;
    console.error(`[${name}] failed to start: ${error.message}`);
    shutdown(1);
  });
  child.stdout.on("data", (chunk) => process.stdout.write(`[${name}] ${chunk}`));
  child.stderr.on("data", (chunk) => process.stderr.write(`[${name}] ${chunk}`));
  child.on("exit", (code, signal) => {
    if (shuttingDown) return;
    console.error(`[${name}] exited ${signal || code}`);
    shutdown(code || 1);
  });
  return child;
}

async function waitForDaemon() {
  await waitForHttp(`${daemonUrl}/api/health`, "daemon");
}

async function waitForWeb() {
  await waitForHttp(`http://${host}:${webPort}/`, "web");
}

async function waitForHttp(url, name) {
  const deadline = Date.now() + startupTimeoutMs;
  let lastError = null;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
      lastError = new Error(`health returned ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  throw new Error(`${name} did not become reachable at ${url}: ${lastError?.message || "timed out"}`);
}

let shuttingDown = false;
function shutdown(code = 0) {
  if (shuttingDown) return;
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) child.kill("SIGTERM");
  }
  setTimeout(() => process.exit(code), 250).unref();
}

process.on("SIGINT", () => shutdown(0));
process.on("SIGTERM", () => shutdown(0));

start("daemon", ["src/cli.js", "daemon", "--host", host, "--port", daemonPort, "--no-open"]);
try {
  await waitForDaemon();
  start("web", ["src/cli.js", "web", "--host", host, "--port", webPort, "--daemon-url", daemonUrl, "--no-open"]);
  await waitForWeb();
  console.log(`[dev] web: ${host}:${webPort} -> daemon: ${daemonUrl}`);
} catch (error) {
  console.error(`[dev] ${error.message}`);
  shutdown(1);
}
