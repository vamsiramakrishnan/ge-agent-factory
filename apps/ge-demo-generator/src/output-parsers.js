/**
 * Multi-format agent output parsing.
 *
 * Normalizes output from different agent CLIs into a common event model:
 *   { kind, text?, name?, input?, result?, isError?, raw? }
 *
 * Supported formats:
 *   - claude-stream-json: Claude Code's --output-format stream-json
 *   - gemini-json: Gemini CLI JSON event lines
 *   - json-lines: Generic JSON-per-line (Codex, OpenCode, etc.)
 *   - plain: Raw text passthrough
 */

export function createOutputParser(format = "plain") {
  let buffer = "";

  function feed(chunk) {
    buffer += chunk;
    const events = [];
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      const parsed = parseLine(format, trimmed);
      if (parsed) events.push(parsed);
    }
    return events;
  }

  function flush() {
    const events = [];
    if (buffer.trim()) {
      const parsed = parseLine(format, buffer.trim());
      if (parsed) events.push(parsed);
    }
    buffer = "";
    return events;
  }

  return { feed, flush };
}

function parseLine(format, line) {
  switch (format) {
    case "claude-stream-json": return parseClaudeStreamJson(line);
    case "gemini-json": return parseGeminiJson(line);
    case "json-lines": return parseGenericJsonLine(line);
    case "plain": default: return { kind: "text", text: line + "\n" };
  }
}

function parseClaudeStreamJson(line) {
  let obj;
  try { obj = JSON.parse(line); } catch { return { kind: "text", text: line + "\n" }; }

  const type = obj.type || "";

  if (type === "assistant" && obj.message?.content) {
    return null;
  }

  if (type === "content_block_delta") {
    const delta = obj.delta;
    if (delta?.type === "text_delta") return { kind: "text", text: delta.text || "" };
    if (delta?.type === "thinking_delta") return { kind: "thinking", text: delta.thinking || "" };
    if (delta?.type === "input_json_delta") return { kind: "tool_input_delta", text: delta.partial_json || "" };
    return null;
  }

  if (type === "content_block_start") {
    const block = obj.content_block;
    if (block?.type === "tool_use") {
      return { kind: "tool_use", id: block.id, name: block.name, input: {} };
    }
    if (block?.type === "thinking") return { kind: "thinking_start" };
    return null;
  }

  if (type === "content_block_stop") {
    return null;
  }

  if (type === "message_start") {
    return { kind: "status", label: "started", raw: obj };
  }

  if (type === "message_delta") {
    const reason = obj.delta?.stop_reason;
    if (reason === "tool_use") return { kind: "status", label: "tool_use" };
    if (reason === "end_turn") return { kind: "status", label: "end_turn" };
    if (obj.usage) return { kind: "usage", inputTokens: obj.usage.input_tokens, outputTokens: obj.usage.output_tokens };
    return null;
  }

  if (type === "message_stop") {
    return { kind: "status", label: "complete" };
  }

  if (type === "tool_result" || type === "result") {
    return {
      kind: "tool_result",
      toolUseId: obj.tool_use_id || obj.id,
      content: typeof obj.content === "string" ? obj.content : JSON.stringify(obj.content),
      isError: obj.is_error || false,
    };
  }

  if (type === "error") {
    return { kind: "error", text: obj.error?.message || obj.message || JSON.stringify(obj) };
  }

  if (obj.text || obj.delta || obj.message) {
    return { kind: "text", text: obj.text || obj.delta || (typeof obj.message === "string" ? obj.message : "") };
  }

  return { kind: "raw", raw: obj };
}

function parseGeminiJson(line) {
  let obj;
  try { obj = JSON.parse(line); } catch { return { kind: "text", text: line + "\n" }; }

  const type = obj.type || obj.kind || obj.event || "";

  if (type === "message" && typeof obj.content === "string") {
    return { kind: "text", text: obj.content };
  }

  if (type === "text_delta" || type === "text" || type === "stdout") {
    return { kind: "text", text: obj.delta || obj.text || obj.content || "" };
  }

  if (type === "stderr") {
    return { kind: "error", text: obj.delta || obj.message || obj.text || "" };
  }

  if (type.includes("tool_result") || type.includes("tool_call_result") || type === "function_response") {
    return {
      kind: "tool_result",
      toolUseId: obj.tool_use_id || obj.tool_call_id || obj.id,
      content: typeof obj.output === "string" ? obj.output : typeof obj.result === "string" ? obj.result : JSON.stringify(obj.output || obj.result || obj),
      isError: obj.is_error || obj.isError || false,
    };
  }

  if (type.includes("tool_call") || type.includes("tool_use") || type === "function_call") {
    return {
      kind: "tool_use",
      id: obj.id || obj.tool_call_id,
      name: obj.name || obj.input?.name || obj.function?.name || obj.raw?.name || type,
      input: obj.input || obj.args || obj.arguments || obj.raw || {},
    };
  }

  if (type === "thinking" || type === "thought") {
    return { kind: "thinking", text: obj.text || obj.delta || obj.content || "" };
  }

  if (type === "status") {
    return { kind: "status", label: obj.label || obj.status || obj.message || type, raw: obj };
  }

  if (type === "usage" || obj.inputTokens || obj.input_tokens) {
    return {
      kind: "usage",
      inputTokens: obj.inputTokens || obj.input_tokens,
      outputTokens: obj.outputTokens || obj.output_tokens,
      costUsd: obj.costUsd || obj.cost_usd,
    };
  }

  if (type === "error") {
    return { kind: "error", text: obj.message || obj.error || JSON.stringify(obj) };
  }

  const text = obj.text || obj.delta || obj.message || obj.content;
  if (typeof text === "string") return { kind: "text", text };

  return { kind: "raw", raw: obj };
}

function parseGenericJsonLine(line) {
  let obj;
  try { obj = JSON.parse(line); } catch { return { kind: "text", text: line + "\n" }; }

  if (obj.type === "text" || obj.type === "content" || obj.kind === "text") {
    return { kind: "text", text: obj.text || obj.content || obj.delta || "" };
  }

  if (obj.type === "tool_call" || obj.kind === "tool_use") {
    return { kind: "tool_use", id: obj.id, name: obj.name || obj.function, input: obj.input || obj.args || {} };
  }

  if (obj.type === "tool_result" || obj.kind === "tool_result") {
    return { kind: "tool_result", toolUseId: obj.id || obj.tool_use_id, content: obj.output || obj.result || "", isError: !!obj.is_error };
  }

  if (obj.type === "error" || obj.kind === "error") {
    return { kind: "error", text: obj.message || obj.text || JSON.stringify(obj) };
  }

  const text = obj.text || obj.delta || obj.message || obj.content || obj.output;
  if (typeof text === "string") return { kind: "text", text };

  return { kind: "raw", raw: obj };
}

export function detectFormat(agentId) {
  const id = (agentId || "").toLowerCase();
  if (id === "claude" || id === "claude-code") return "claude-stream-json";
  if (id === "gemini" || id.includes("gemini")) return "gemini-json";
  if (id === "codex" || id === "opencode") return "json-lines";
  return "plain";
}
