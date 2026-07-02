// Doctor streaming transport: prefer proxying the daemon's doctor task stream,
// fall back to spawning `ge doctor --json` and replaying its report as events.
// Verbatim move from transport.mjs.

import { spawn } from "node:child_process";
import * as core from "../../../../../tools/lib/factory-core.mjs";
import { GE_CLI, REPO_ROOT } from "./paths.mjs";

function doctorScopeOpts(scope, command) {
  const withCommand = (opts) => command ? { ...opts, command } : opts;
  if (scope === "local") return withCommand({ local: true, cloud: false, data: false, mcp: false });
  if (scope === "cloud") return withCommand({ local: false, cloud: true, data: false, mcp: false });
  if (scope === "data") return withCommand({ local: false, cloud: false, data: true, mcp: false });
  if (scope === "mcp") return withCommand({ local: false, cloud: false, data: false, mcp: true });
  return withCommand({ local: false, cloud: true, data: true, mcp: true });
}

function doctorArgv(scope, command) {
  const argv = ["doctor", "--json"];
  if (scope === "local") argv.push("--local");
  else if (scope === "cloud") argv.push("--cloud");
  else if (scope === "data") argv.push("--data");
  else if (scope === "mcp") argv.push("--mcp");
  if (command) argv.push("--command", command);
  return argv;
}

async function proxyDoctorFromDaemon({ scope = "all", command } = {}, writeSSE, isClosed, onEnd) {
  const port = Number(process.env.GE_DAEMON_PORT || 17654);
  const base = `http://127.0.0.1:${port}`;
  const qs = new URLSearchParams({ scope });
  if (command) qs.set("command", command);
  const start = await fetch(`${base}/api/doctor?${qs.toString()}`, {
    method: "POST",
    signal: AbortSignal.timeout(600),
  });
  if (!start.ok) throw new Error(`daemon doctor start failed: ${start.status}`);
  const run = await start.json();
  const stream = await fetch(`${base}/api/tasks/${encodeURIComponent(run.id)}/events`, {
    signal: AbortSignal.timeout(60000),
  });
  if (!stream.ok || !stream.body) throw new Error(`daemon doctor stream failed: ${stream.status}`);
  const reader = stream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  for (;;) {
    if (isClosed()) break;
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let idx;
    while ((idx = buffer.indexOf("\n\n")) >= 0) {
      const frame = buffer.slice(0, idx);
      buffer = buffer.slice(idx + 2);
      const line = frame.split(/\r?\n/).find((part) => part.startsWith("data: "));
      if (line && !isClosed()) writeSSE(line.slice(6));
    }
  }
  onEnd();
}

function replayDoctorReport(report, emit) {
  for (const section of report.sections || []) {
    if (!emit({ type: "section_started", section: section.name, line: `checking ${section.name}` })) return false;
    for (const check of section.checks || []) {
      if (!emit({
        type: "check_result",
        section: section.name,
        level: check.status === "fail" ? "error" : check.status === "warn" ? "warn" : "info",
        line: `${check.name}: ${check.status}`,
        check,
      })) return false;
    }
    if (!emit({
      type: section.fails ? "section_blocked" : "section_done",
      section: section.name,
      level: section.fails ? "error" : "info",
      line: section.fails ? `${section.name}: ${section.fails} failure${section.fails === 1 ? "" : "s"}` : `${section.name}: passed`,
      sectionReport: section,
    })) return false;
  }
  return true;
}

export function streamDoctor(args = {}, writeSSE, isClosed, onEnd = () => {}) {
  proxyDoctorFromDaemon(args, writeSSE, isClosed, onEnd).catch((error) => {
    console.warn(`[transport] doctor: daemon proxy failed, falling back to subprocess — ${error?.message || error}`);
    streamDoctorSubprocess(args, writeSSE, isClosed, onEnd);
  });
}

function streamDoctorSubprocess({ scope = "all", command, query = {} } = {}, writeSSE, isClosed, onEnd = () => {}) {
  const cfg = core.loadConfig(query || {});
  const startedAt = new Date().toISOString();
  const emit = (event) => {
    if (isClosed()) return false;
    writeSSE(JSON.stringify({ ts: new Date().toISOString(), ...event }));
    return true;
  };

  emit({
    type: "doctor_started",
    line: command ? `doctor ${scope} readiness for ${command}` : `doctor ${scope}`,
    data: { scope, command: command || null, project: cfg.project, region: cfg.region, startedAt },
  });

  const argv = doctorArgv(scope, command);
  const child = spawn("bun", [GE_CLI, ...argv], {
    cwd: REPO_ROOT,
    env: { ...process.env, CLOUDSDK_CORE_DISABLE_PROMPTS: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  let closed = false;
  const heartbeat = setInterval(() => {
    if (isClosed()) {
      child.kill();
      clearInterval(heartbeat);
      return;
    }
    emit({ type: "doctor_heartbeat", level: "info", line: "doctor still running" });
  }, 2000);
  child.stdout.on("data", (chunk) => { stdout += String(chunk); });
  child.stderr.on("data", (chunk) => {
    const text = String(chunk);
    stderr += text;
    for (const line of text.split(/\r?\n/).filter(Boolean)) {
      emit({ type: "doctor_log", level: /fail|error|blocked/i.test(line) ? "error" : /warn|unset|not found/i.test(line) ? "warn" : "info", line });
    }
  });
  child.on("error", (e) => {
    if (closed) return;
    closed = true;
    clearInterval(heartbeat);
    const report = {
      mode: "all",
      project: cfg.project,
      region: cfg.region,
      sections: [{ name: "doctor", checks: [{ name: "doctor subprocess", status: "fail", detail: e.message || String(e), fix: "ge doctor --json" }], fails: 1 }],
      fails: 1,
    };
    replayDoctorReport(report, emit);
    emit({ type: "doctor_blocked", level: "error", line: "doctor subprocess failed", report });
    onEnd();
  });
  child.on("close", (code) => {
    if (closed) return;
    closed = true;
    clearInterval(heartbeat);
    let report;
    try {
      report = JSON.parse(stdout || "{}");
    } catch {
      report = {
        mode: "all",
        project: cfg.project,
        region: cfg.region,
        sections: [{ name: "doctor", checks: [{ name: "doctor output", status: "fail", detail: (stderr || stdout || "no output").slice(-1000), fix: "ge doctor --json" }], fails: 1 }],
        fails: 1,
      };
    }
    if (code !== 0 && (!report.sections || !report.sections.length)) {
      report.sections = [{ name: "doctor", checks: [{ name: "doctor exit", status: "fail", detail: `exit ${code}`, fix: "ge doctor --json" }], fails: 1 }];
      report.fails = 1;
    }
    replayDoctorReport(report, emit);
    emit({
      type: report.fails ? "doctor_blocked" : "doctor_done",
      level: report.fails ? "error" : "info",
      line: report.fails ? `blocked by ${report.fails} failure${report.fails === 1 ? "" : "s"}` : "all checks passed",
      report,
    });
    onEnd();
  });
}

