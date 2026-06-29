import { execa } from "execa";
import { makeEvent, splitLines, inferLevel } from "./events.mjs";

const STREAM_ENV = { PYTHONUNBUFFERED: "1", PYTHONIOENCODING: "utf-8", CLOUDSDK_CORE_DISABLE_PROMPTS: "1" };

function compactText(value, limit = 160) {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  if (text.length <= limit) return text;
  return `${text.slice(0, limit - 1)}…`;
}

export function processLineEvent({ stream, line, meta = {} } = {}) {
  const trimmed = String(line || "").trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed?.type === "string" && parsed.type.startsWith("antigravity.")) {
        return makeEvent({
          ...meta,
          type: parsed.type,
          level: parsed.type === "antigravity.error" ? "error" : parsed.type === "antigravity.heartbeat" ? "debug" : "info",
          line: formatAntigravityEvent(parsed),
          data: { ...parsed, stream },
        });
      }
      if (parsed?.type === "ge.harness.event") {
        return makeEvent({
          ...meta,
          type: "harness_event",
          level: parsed.event === "error" ? "error" : "info",
          line: formatHarnessEvent(parsed),
          data: { ...parsed, stream },
        });
      }
    } catch {
      // Non-JSON or partial diagnostics stay as normal process logs.
    }
  }
  return makeEvent({ ...meta, type: "log", level: inferLevel(stream, line), line, data: { stream } });
}

function formatHarnessEvent(event = {}) {
  const name = String(event.event || "event");
  const data = event.data || {};
  if (name === "plan") return `Harness selected ${data.adapterId || "agent"} (${data.permissionProfile || "profile"})`;
  if (name === "status") return `Harness ${data.label || "status"}`;
  if (name === "agent" && data.type === "stderr") return compactText(data.delta || "harness stderr");
  if (name === "error") return `Harness error: ${data.message || data.code || "unknown error"}`;
  if (name === "end") return `Harness ${data.status || "ended"} (exit ${data.code ?? "unknown"})`;
  return `Harness ${name}`;
}

export function formatAntigravityEvent(event = {}) {
  const type = String(event.type || "");
  if (type === "antigravity.config") {
    return `Antigravity configured (${event.model || "default"}, ${event.location || "local"}, ${event.promptChars || 0} prompt chars)`;
  }
  if (type === "antigravity.session_starting") return "Starting Antigravity session";
  if (type === "antigravity.session_started") return "Antigravity session ready";
  if (type === "antigravity.session_hook_start") return "Antigravity session hook started";
  if (type === "antigravity.session_hook_end") return "Antigravity session ended";
  if (type === "antigravity.prompt_sent") return "Prompt sent to Antigravity";
  if (type === "antigravity.heartbeat") return `Antigravity still working (${event.phase || "working"}, ${event.elapsedSec || 0}s)`;
  if (type === "antigravity.thinking") return `Antigravity thinking (${event.totalChars || event.chars || 0} chars)`;
  if (type === "antigravity.text_delta") {
    const preview = compactText(event.preview || "");
    return preview ? `Antigravity response: ${preview}` : `Antigravity response streaming (${event.totalChars || event.chars || 0} chars)`;
  }
  if (type === "antigravity.tool_call") return `Antigravity tool call: ${event.name || event.id || "tool"}`;
  if (type === "antigravity.tool_result") return `Antigravity tool result: ${event.tool_call_id || "tool"}`;
  if (type === "antigravity.post_tool_call") return `Antigravity tool completed: ${compactText(event.preview || "tool result")}`;
  if (type === "antigravity.tool_error") return `Antigravity tool error: ${event.message || event.errorType || "unknown error"}`;
  if (type === "antigravity.interaction_request") return `Antigravity requested input: ${event.form?.title || event.interactionId || "question form"}`;
  if (type === "antigravity.interaction_response") return `Antigravity received input: ${event.interactionId || "question form"}`;
  if (type === "antigravity.compaction") return "Antigravity compacted context";
  if (type === "antigravity.usage") return `Antigravity usage: ${event.value?.total_token_count || event.value?.totalTokenCount || "unknown"} tokens`;
  if (type === "antigravity.structured_output") return `Antigravity structured output: ${compactText(event.preview || "ready")}`;
  if (type === "antigravity.done") return `Antigravity done (${event.elapsedSec || 0}s, ${event.textChars || 0} text chars)`;
  if (type === "antigravity.error") return `Antigravity error: ${event.message || event.errorType || "unknown error"}`;
  if (type === "antigravity.chunk") return `Antigravity event: ${event.chunk_type || "chunk"}`;
  return type || "Antigravity event";
}

// Spawn piped, stream stdout/stderr line-by-line as NDJSON `log` events via onEvent,
// while accumulating the full buffers for the final result. The single subprocess
// choke point so agents-cli/gcloud/antigravity all stream (they block-buffer otherwise).
export function execStream(command, args, { cwd, env = process.env, onEvent = () => {}, meta = {} } = {}) {
  // buffer:false leaves the pipes for us to read live; reject:false turns spawn/exit
  // failures into a resolved result instead of a throw, so we keep the single resolve path.
  const subprocess = execa(command, args, {
    cwd,
    env: { ...env, ...STREAM_ENV },
    extendEnv: false,
    stdin: "ignore",
    reject: false,
    buffer: false,
    stripFinalNewline: false,
  });
  let stdout = "", stderr = "";
  const stdoutSplitter = splitLines();
  const stderrSplitter = splitLines();
  const handler = (stream, splitter) => (chunk) => {
    const text = String(chunk);
    if (stream === "stdout") stdout += text; else stderr += text;
    for (const line of splitter.push(text)) onEvent(processLineEvent({ stream, line, meta }));
  };
  subprocess.stdout?.on("data", handler("stdout", stdoutSplitter));
  subprocess.stderr?.on("data", handler("stderr", stderrSplitter));
  return subprocess.then((r) => {
    for (const line of stdoutSplitter.flush()) onEvent(processLineEvent({ stream: "stdout", line, meta }));
    for (const line of stderrSplitter.flush()) onEvent(processLineEvent({ stream: "stderr", line, meta }));
    // A launch failure (e.g. ENOENT — binary not found) yields no numeric exitCode. Name the
    // command so a missing tool is obvious instead of a cryptic "exit 1".
    if (typeof r.exitCode !== "number") {
      const code = r.code || r.cause?.code;
      const hint = code === "ENOENT" ? ` — '${command}' not found on PATH (is it installed?)` : "";
      const reason = r.shortMessage || r.cause?.message || r.message || "spawn failed";
      return { code: 1, stdout, stderr: `${stderr}failed to launch '${command}': ${reason}${hint}` };
    }
    return { code: r.exitCode ?? 1, signal: r.signal, stdout, stderr };
  });
}
