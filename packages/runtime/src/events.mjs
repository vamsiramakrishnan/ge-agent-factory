export function makeEvent({ runId, agentId, stage, type = "log", level = "info", line, data, ts } = {}) {
  return {
    runId,
    agentId,
    stage,
    ts: ts || new Date().toISOString(),
    type,
    level,
    ...(line != null ? { line } : {}),
    ...(data != null ? { data } : {}),
  };
}

export function splitLines() {
  let buf = "";
  return {
    push(chunk) {
      buf += String(chunk);
      const out = [];
      let nl;
      while ((nl = buf.indexOf("\n")) >= 0) {
        let line = buf.slice(0, nl);
        buf = buf.slice(nl + 1);
        const cr = line.lastIndexOf("\r");
        if (cr >= 0) line = line.slice(cr + 1);
        out.push(line);
      }
      return out;
    },
    flush() {
      const rest = buf.trim() ? [buf] : [];
      buf = "";
      return rest;
    },
  };
}

export function inferLevel(stream, line) {
  if (stream === "stderr" && /\b(error|fatal|exception|traceback)\b/i.test(line)) return "error";
  if (/\bwarn(ing)?\b/i.test(line)) return "warn";
  return stream === "stderr" ? "warn" : "info";
}
