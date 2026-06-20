import { test, expect } from "bun:test";
import { execStream, processLineEvent } from "./exec-stream.mjs";

test("streams lines live and returns the full buffer + code", async () => {
  const lines = [];
  const r = await execStream("bash", ["-c", "echo one; echo two 1>&2; exit 3"], {
    onEvent: (e) => { if (e.type === "log") lines.push([e.data?.stream, e.line]); },
    meta: { runId: "r", agentId: "a", stage: "s" },
  });
  expect(r.code).toBe(3);
  expect(lines).toContainEqual(["stdout", "one"]);
  expect(lines).toContainEqual(["stderr", "two"]);
  expect(r.stdout).toContain("one");
});

test("spawn failure (ENOENT) names the command instead of a bare exit 1", async () => {
  const r = await execStream("definitely-not-a-real-binary-xyz", ["--x"], {});
  expect(r.code).toBe(1);
  expect(r.stderr).toContain("failed to launch 'definitely-not-a-real-binary-xyz'");
  expect(r.stderr).toContain("not found on PATH");
});

test("injects PYTHONUNBUFFERED into child env", async () => {
  let seen = "";
  await execStream("bash", ["-c", "echo $PYTHONUNBUFFERED"], { onEvent: (e) => { if (e.line) seen += e.line; } });
  expect(seen).toBe("1");
});

test("a line split across chunks is emitted once, whole", async () => {
  const lines = [];
  // print 'hello world' as two writes with no newline between, then a newline
  const r = await execStream("bash", ["-c", "printf 'hel'; sleep 0.05; printf 'lo world\\n'"], {
    onEvent: (e) => { if (e.type === "log" && e.data?.stream === "stdout") lines.push(e.line); },
  });
  expect(r.code).toBe(0);
  expect(lines).toEqual(["hello world"]);
});

test("flushes a final partial line on process close", async () => {
  const lines = [];
  const r = await execStream("bash", ["-c", "printf 'partial'"], {
    onEvent: (e) => { if (e.type === "log" && e.data?.stream === "stdout") lines.push(e.line); },
  });
  expect(r.code).toBe(0);
  expect(lines).toEqual(["partial"]);
});

test("maps Antigravity JSON status lines into typed runtime events", () => {
  const event = processLineEvent({
    stream: "stderr",
    line: JSON.stringify({ type: "antigravity.text_delta", chars: 5, totalChars: 12, preview: "hello" }),
    meta: { runId: "r", stage: "harness.run" },
  });
  expect(event.type).toBe("antigravity.text_delta");
  expect(event.level).toBe("info");
  expect(event.line).toContain("Antigravity response");
  expect(event.data.preview).toBe("hello");
});

test("maps rich Antigravity telemetry into typed runtime events", () => {
  const usage = processLineEvent({
    stream: "stderr",
    line: JSON.stringify({ type: "antigravity.usage", value: { total_token_count: 42 } }),
    meta: { runId: "r", stage: "harness.run" },
  });
  expect(usage.type).toBe("antigravity.usage");
  expect(usage.line).toContain("42");

  const tool = processLineEvent({
    stream: "stderr",
    line: JSON.stringify({ type: "antigravity.post_tool_call", preview: "{\"ok\":true}" }),
    meta: { runId: "r", stage: "harness.run" },
  });
  expect(tool.type).toBe("antigravity.post_tool_call");
  expect(tool.line).toContain("tool completed");

  const structured = processLineEvent({
    stream: "stderr",
    line: JSON.stringify({ type: "antigravity.structured_output", preview: "{\"agent\":\"ready\"}" }),
    meta: { runId: "r", stage: "harness.run" },
  });
  expect(structured.type).toBe("antigravity.structured_output");
  expect(structured.line).toContain("structured output");
});

test("maps harness event JSON lines into readable runtime events", () => {
  const event = processLineEvent({
    stream: "stderr",
    line: JSON.stringify({ type: "ge.harness.event", event: "plan", data: { adapterId: "antigravity-sdk", permissionProfile: "workspace-write" } }),
    meta: { runId: "r", stage: "harness.run" },
  });
  expect(event.type).toBe("harness_event");
  expect(event.line).toContain("antigravity-sdk");
});
