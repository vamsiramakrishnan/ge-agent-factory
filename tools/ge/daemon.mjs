// tools/ge/daemon.mjs — `ge daemon start|status|tasks|task|events|stop`.
// Leaf commands are defined once and re-used by the `ge runs` group
// (tools/ge/runs.mjs) via runtimeLeaves. Moved verbatim out of tools/ge.mjs.
//
// GE_CLI_PATH must resolve to tools/ge.mjs itself (the daemon re-spawns
// itself as `node <GE_CLI_PATH> daemon start --foreground ...`), NOT to this
// file — so it is intentionally resolved relative to this file's known
// location rather than via `import.meta.url` here.
import { defineCommand } from "citty";
import { parseList } from "@ge/std/list";
import { spawn } from "node:child_process";
import { closeSync, mkdirSync, openSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { daemonPaths, getDaemonStatus, startDaemonServer } from "../lib/runtime-daemon.mjs";
import {
  guarded, emit, out, pc, ui, core,
  readPidFile, processAlive, processLooksLikeDaemon, daemonStatusSnapshot,
  renderResumePlan, daemonPort, daemonRequest, statusText, followTaskEvents,
} from "./shared.mjs";

const GE_CLI_PATH = fileURLToPath(new URL("../ge.mjs", import.meta.url));

const daemonStart = defineCommand({
  meta: { name: "start", description: "Start the local GE runtime daemon" },
  args: { foreground: { type: "boolean", description: "Run the daemon in this process instead of detaching" }, port: { type: "string", description: "Daemon port (default 17654)" }, host: { type: "string", description: "Bind host (default 127.0.0.1)" } },
  run: guarded(async ({ args }) => {
    const port = Number(args.port || process.env.GE_DAEMON_PORT || daemonPaths().defaultPort);
    const host = args.host || process.env.GE_DAEMON_HOST || "127.0.0.1";
    const paths = daemonPaths();
    if (args.foreground) {
      startDaemonServer({ host, port, foreground: true });
      return;
    }
    const existing = await daemonStatusSnapshot(port);
    if (existing.ok) {
      out(`${ui.glyph("passed")} ${pc.green(`ge daemon already running pid=${existing.pid} http://127.0.0.1:${port}`)}`);
      return;
    }
    if (existing.status === "unreachable") {
      const pid = readPidFile(paths.pidPath);
      if (pid && processAlive(pid) && processLooksLikeDaemon(pid)) {
        try { process.kill(pid, "SIGTERM"); } catch { /* best-effort: stale pid may exit between the liveness probe and the kill */ }
      }
      rmSync(paths.pidPath, { force: true });
      out(`${ui.glyph("warning")} ${pc.yellow(`cleared unreachable ge daemon pid=${existing.pid}`)}`);
    }
    mkdirSync(paths.dir, { recursive: true });
    const logFd = openSync(paths.logPath, "a");
    const child = spawn(process.execPath, [GE_CLI_PATH, "daemon", "start", "--foreground", "--port", String(port), "--host", host], {
      cwd: core.REPO_ROOT,
      detached: true,
      stdio: ["ignore", logFd, logFd],
      env: { ...process.env, GE_DAEMON_PORT: String(port), GE_DAEMON_HOST: host, GE_DAEMON_BACKGROUND: "1" },
    });
    closeSync(logFd);
    child.unref();
    const deadline = Date.now() + 5000;
    while (Date.now() < deadline) {
      try {
        const current = await getDaemonStatus({ port });
        out(`${ui.glyph("passed")} ${pc.green(`ge daemon started pid=${current.pid} http://127.0.0.1:${port}`)}`);
        return;
      } catch {
        await new Promise((resolve) => setTimeout(resolve, 200));
      }
    }
    const fallback = await daemonStatusSnapshot(port);
    if (fallback.status === "unreachable") {
      out(`${ui.glyph("warning")} ${pc.yellow(`ge daemon process started pid=${fallback.pid}, but health is not reachable yet`)}`);
      out(pc.dim(`  log: ${paths.logPath}`));
      out(ui.next("ge daemon status"));
      return;
    }
    out(`${ui.glyph("warning")} ${pc.yellow("ge daemon did not become healthy within 5s")}`);
    out(pc.dim(`  log: ${paths.logPath}`));
    out(pc.dim("  fallback: console and ge doctor will run without the daemon"));
  }),
});

const daemonStatus = defineCommand({
  meta: { name: "status", description: "Show local GE runtime daemon status" },
  args: { json: { type: "boolean", description: "Machine-readable JSON result on stdout" }, port: { type: "string", description: "Daemon port (default 17654)" } },
  run: guarded(async ({ args }) => {
    const port = Number(args.port || process.env.GE_DAEMON_PORT || daemonPaths().defaultPort);
    const status = await daemonStatusSnapshot(port);
    emit(args, status, (s) => {
      out(ui.title("GE Runtime Daemon"));
      out(ui.kv([
        ["status", s.ok ? pc.green("healthy") : s.status === "unreachable" ? pc.yellow("unreachable") : pc.dim("stopped")],
        ["pid", s.pid ? ui.cmd(String(s.pid)) : pc.dim("<none>")],
        ["url", ui.cmd(`http://127.0.0.1:${s.port}`)],
        ["data", pc.dim(s.dataDir)],
        s.logPath && ["log", pc.dim(s.logPath)],
        (s.error && !s.ok) && ["detail", pc.dim(s.error)],
        ["runs", String(s.runs?.length || 0)],
      ]));
    });
  }),
});

const daemonTasks = defineCommand({
  meta: { name: "tasks", description: "List recent local GE runtime daemon tasks" },
  args: { json: { type: "boolean", description: "Machine-readable JSON result on stdout" }, port: { type: "string", description: "Daemon port (default 17654)" }, limit: { type: "string", description: "Max tasks to list (default 20)" } },
  run: guarded(async ({ args }) => {
    const port = Number(args.port || process.env.GE_DAEMON_PORT || daemonPaths().defaultPort);
    const status = await daemonStatusSnapshot(port);
    const tasks = status.runs || [];
    emit(args, { tasks, daemon: { ok: status.ok, status: status.status || "healthy", port, pid: status.pid || null } }, (r) => {
      out(ui.title("GE Runtime Tasks"));
      out(ui.kv([{ key: "daemon", value: r.daemon.ok ? pc.green("healthy") : pc.yellow(r.daemon.status), note: `http://127.0.0.1:${port}` }]));
      if (!tasks.length) {
        out(pc.dim("  no recent tasks"));
        return;
      }
      out("");
      out(ui.columns(tasks.slice(0, Math.max(1, Math.min(Number(args.limit) || 20, 200))), [
        { header: "status", value: (task) => statusText(task.status) },
        { header: "kind", value: (task) => String(task.kind || "task") },
        { header: "id", value: (task) => String(task.id) },
        { header: "updated", value: (task) => pc.dim(task.updatedAt || task.createdAt || "") },
      ]));
    });
  }),
});

const daemonTask = defineCommand({
  meta: { name: "task", description: "Show one local GE runtime daemon task" },
  args: { id: { type: "positional", required: true, description: "Runtime task id" }, json: { type: "boolean", description: "Machine-readable JSON result on stdout" }, port: { type: "string", description: "Daemon port (default 17654)" } },
  run: guarded(async ({ args }) => {
    const port = Number(args.port || process.env.GE_DAEMON_PORT || daemonPaths().defaultPort);
    const response = await fetch(`http://127.0.0.1:${port}/api/tasks/${encodeURIComponent(args.id)}`, {
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) throw new Error(`daemon task lookup failed: ${response.status}`);
    const task = await response.json();
    emit(args, task, (t) => {
      out(ui.title(`GE Runtime Task ${t.id}`));
      out(ui.kv([
        ["kind", ui.cmd(t.kind || "task")],
        ["status", statusText(t.status)],
        ["created", pc.dim(t.createdAt || "")],
        ["updated", pc.dim(t.updatedAt || "")],
        t.output?.run && ["repair", `${t.output.run.passed || 0} passed · ${t.output.run.repaired || 0} repaired · ${t.output.run.blocked || 0} blocked · ${t.output.run.total || 0} total`],
      ]));
      renderResumePlan(t.summary?.resumePlan);
      if (t.error) out(ui.kv([["error", pc.red(t.error)]]));
    });
  }),
});

const runtimeResume = defineCommand({
  meta: { name: "resume", description: "Resume a runtime task using its deterministic resumePlan" },
  args: { id: { type: "positional", required: true, description: "Runtime task id" }, json: { type: "boolean", description: "Machine-readable JSON result on stdout" }, port: { type: "string", description: "Daemon port (default 17654)" } },
  run: guarded(async ({ args }) => {
    const port = daemonPort(args);
    const daemon = await daemonStatusSnapshot(port);
    if (!daemon.ok) throw new Error(`ge daemon is ${daemon.status || "stopped"}; run: ge daemon start`);
    const task = await daemonRequest(port, `/api/tasks/${encodeURIComponent(args.id)}/resume`, { method: "POST", timeoutMs: 5000 });
    emit(args, task, (t) => {
      out(ui.title(`Runtime Resume ${t.id}`));
      out(ui.kv([
        ["kind", ui.cmd(t.kind || "task")],
        ["status", statusText(t.status)],
      ]));
      renderResumePlan(t.summary?.resumePlan);
      out(ui.next(`ge runs events ${t.id} --follow`, "stream live events"));
    });
  }),
});

const daemonEvents = defineCommand({
  meta: { name: "events", description: "Show or follow one local GE runtime task event stream" },
  args: { id: { type: "positional", required: true, description: "Runtime task id" }, json: { type: "boolean", description: "Machine-readable JSON result on stdout" }, port: { type: "string", description: "Daemon port (default 17654)" }, follow: { type: "boolean", description: "Follow the live event stream (SSE)" } },
  run: guarded(async ({ args }) => {
    const port = Number(args.port || process.env.GE_DAEMON_PORT || daemonPaths().defaultPort);
    if (args.follow) {
      await followTaskEvents(port, args.id, { json: args.json });
      return;
    }
    const response = await fetch(`http://127.0.0.1:${port}/api/tasks/${encodeURIComponent(args.id)}/events?format=json`, {
      signal: AbortSignal.timeout(1500),
    });
    if (!response.ok) throw new Error(`daemon task events failed: ${response.status}`);
    const body = await response.json();
    emit(args, body, (b) => {
      out(ui.title(`GE Runtime Events ${args.id}`));
      const events = b.events || [];
      const seqW = Math.max(...events.map(({ seq }) => String(seq).length), 3);
      const typeW = Math.max(...events.map(({ event }) => String(event.type || "").length), 0);
      for (const { seq, event } of events) {
        const type = event.level === "error" ? pc.red(event.type) : event.level === "warn" ? pc.yellow(event.type) : pc.cyan(event.type);
        out(`  ${String(seq).padStart(seqW)} ${ui.padVisible(type, typeW)} ${event.line || ""}`);
      }
    });
  }),
});

const runtimeStartJob = defineCommand({
  meta: { name: "job", description: "Start a GE command runtime task; pass command args after --" },
  args: { json: { type: "boolean", description: "Machine-readable JSON result on stdout" }, port: { type: "string", description: "Daemon port (default 17654)" } },
  run: guarded(async ({ args }) => {
    const separator = process.argv.indexOf("--");
    const argv = separator >= 0 ? process.argv.slice(separator + 1) : [];
    if (!argv.length) throw new Error("usage: ge runs job -- ge <args>");
    const geArgv = argv[0] === "ge" ? argv.slice(1) : argv;
    const port = Number(args.port || process.env.GE_DAEMON_PORT || daemonPaths().defaultPort);
    const response = await fetch(`http://127.0.0.1:${port}/api/tasks`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ kind: "ge.command", argv: geArgv }),
      signal: AbortSignal.timeout(5000),
    });
    if (!response.ok) throw new Error(`daemon job start failed: ${response.status}`);
    const task = await response.json();
    emit(args, task, (t) => {
      out(`${ui.glyph("passed")} ${pc.green(`started job task ${t.id}`)}`);
      out(ui.next(`ge runs events ${t.id} --follow`));
    });
  }),
});

// Leaf commands re-used by the canonical `ge runs` group (tools/ge/runs.mjs).
export const runtimeLeaves = {
  tasks: daemonTasks,
  task: daemonTask,
  events: daemonEvents,
  resume: runtimeResume,
  status: daemonStatus,
  startJob: runtimeStartJob,
};

const daemonStop = defineCommand({
  meta: { name: "stop", description: "Stop the local GE runtime daemon" },
  args: {},
  run: guarded(() => {
    const { pidPath } = daemonPaths();
    const pid = readPidFile(pidPath);
    if (!pid) {
      out(`${ui.glyph("warning")} ${pc.yellow("ge daemon is not running")}`);
      return;
    }
    if (!processAlive(pid) || !processLooksLikeDaemon(pid)) {
      rmSync(pidPath, { force: true });
      out(`${ui.glyph("warning")} ${pc.yellow(`cleared stale ge daemon pid=${pid}`)}`);
      return;
    }
    try {
      process.kill(pid, "SIGTERM");
      rmSync(pidPath, { force: true });
      out(`${ui.glyph("passed")} ${pc.green(`stopped ge daemon pid=${pid}`)}`);
    } catch (e) {
      rmSync(pidPath, { force: true });
      throw new Error(`failed to stop daemon pid=${pid}: ${e.message}`);
    }
  }),
});

export const daemon = defineCommand({
  meta: { name: "daemon", description: "Keep long factory work running after your terminal closes" },
  subCommands: { start: daemonStart, status: daemonStatus, tasks: daemonTasks, task: daemonTask, events: daemonEvents, stop: daemonStop },
});
