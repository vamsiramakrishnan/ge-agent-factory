// tools/lib/daemon/doctor-run.mjs — the "doctor" run-kind: spawns
// `ge doctor --json` as a child process, replays its section/check report as
// daemon events, and persists a terminal report (blocked/done) on the run.
// Unlike the streamed kinds (task-runner.mjs), doctor buffers stdout to parse
// a JSON report, so it keeps its own spawn executor — but start and resume
// share it (they used to be two verbatim ~50-line copies) and differ only in
// their terminal event vocabulary.
import { spawn } from "node:child_process";
import { join } from "node:path";
import { REPO_ROOT } from "../state-paths.mjs";
import {
  appendEvent,
  appendResumeAttempt,
  createRun,
  newTaskId,
  updateRun,
} from "./run-store.mjs";

const GE_CLI = join(REPO_ROOT, "tools", "ge.mjs");

export function doctorArgv({ scope = "all", command } = {}) {
  const argv = ["doctor", "--json"];
  if (scope === "local") argv.push("--local");
  else if (scope === "cloud") argv.push("--cloud");
  else if (scope === "data") argv.push("--data");
  else if (scope === "mcp") argv.push("--mcp");
  if (command) argv.push("--command", command);
  return argv;
}

export function replayDoctorReport(id, report) {
  for (const section of report.sections || []) {
    appendEvent(id, { type: "section_started", section: section.name, line: `checking ${section.name}` });
    for (const check of section.checks || []) {
      appendEvent(id, {
        type: "check_result",
        section: section.name,
        level: check.status === "fail" ? "error" : check.status === "warn" ? "warn" : "info",
        line: `${check.name}: ${check.status}`,
        check,
      });
    }
    appendEvent(id, {
      type: section.fails ? "section_blocked" : "section_done",
      section: section.name,
      level: section.fails ? "error" : "info",
      line: section.fails ? `${section.name}: ${section.fails} failure${section.fails === 1 ? "" : "s"}` : `${section.name}: passed`,
      sectionReport: section,
    });
  }
}

// One doctor subprocess execution, shared by start and resume. The `resume`
// flag only switches the terminal event vocabulary (doctor_blocked/doctor_done
// vs resume_blocked/resume_done + a resume-attempt record) — the spawn,
// stderr replay, report parsing, and fallback-report shapes are identical.
function executeDoctorProcess(id, { scope, command, resume = false }) {
  const child = spawn(process.execPath, [GE_CLI, ...doctorArgv({ scope, command })], {
    cwd: REPO_ROOT,
    env: { ...process.env, CLOUDSDK_CORE_DISABLE_PROMPTS: "1" },
    stdio: ["ignore", "pipe", "pipe"],
  });
  let stdout = "";
  let stderr = "";
  child.stdout.on("data", (chunk) => { stdout += String(chunk); });
  child.stderr.on("data", (chunk) => {
    const text = String(chunk);
    stderr += text;
    for (const line of text.split(/\r?\n/).filter(Boolean)) {
      appendEvent(id, { type: "doctor_log", level: /fail|error|blocked/i.test(line) ? "error" : /warn|unset|not found/i.test(line) ? "warn" : "info", line });
    }
  });
  child.on("error", (error) => {
    const report = {
      mode: "all",
      project: null,
      region: null,
      sections: [{ name: "doctor", checks: [{ name: "doctor subprocess", status: "fail", detail: error.message || String(error), fix: "ge doctor --json" }], fails: 1 }],
      fails: 1,
    };
    replayDoctorReport(id, report);
    appendEvent(id, { type: resume ? "resume_failed" : "doctor_blocked", level: "error", line: "doctor subprocess failed", report });
    if (resume) appendResumeAttempt(id, { status: "failed", action: "rerun_doctor", error: error.message || String(error) });
    updateRun(id, { status: "failed", code: 1, endedAt: new Date().toISOString(), report });
  });
  child.on("close", (code) => {
    let report;
    try {
      report = JSON.parse(stdout || "{}");
    } catch {
      report = {
        mode: "all",
        project: null,
        region: null,
        sections: [{ name: "doctor", checks: [{ name: "doctor output", status: "fail", detail: (stderr || stdout || "no output").slice(-1000), fix: "ge doctor --json" }], fails: 1 }],
        fails: 1,
      };
    }
    if (code !== 0 && (!report.sections || !report.sections.length)) {
      report.sections = [{ name: "doctor", checks: [{ name: "doctor exit", status: "fail", detail: `exit ${code}`, fix: "ge doctor --json" }], fails: 1 }];
      report.fails = 1;
    }
    replayDoctorReport(id, report);
    const status = report.fails ? "blocked" : "done";
    appendEvent(id, {
      type: report.fails ? (resume ? "resume_blocked" : "doctor_blocked") : (resume ? "resume_done" : "doctor_done"),
      level: report.fails ? "error" : "info",
      line: report.fails ? `blocked by ${report.fails} failure${report.fails === 1 ? "" : "s"}` : "all checks passed",
      report,
    });
    if (resume) appendResumeAttempt(id, { status, action: "rerun_doctor", code, fails: report.fails || 0 });
    updateRun(id, { status, code, endedAt: new Date().toISOString(), report });
  });
}

export function startDoctorTask({ scope = "all", command } = {}) {
  const run = createRun({
    id: newTaskId("doctor"),
    kind: "doctor",
    input: { scope, command: command || null },
  });
  appendEvent(run.id, { type: "doctor_started", line: command ? `doctor ${scope} readiness for ${command}` : `doctor ${scope}`, data: { scope, command: command || null } });
  executeDoctorProcess(run.id, { scope, command });
  return run;
}

export function resumeDoctorTask(run) {
  const scope = run.input?.scope || "all";
  const command = run.input?.command || "";
  updateRun(run.id, { status: "running", endedAt: null, error: null });
  appendEvent(run.id, { type: "doctor_started", line: command ? `doctor ${scope} readiness for ${command} (resume)` : `doctor ${scope} (resume)`, data: { scope, command: command || null } });
  executeDoctorProcess(run.id, { scope, command, resume: true });
}
