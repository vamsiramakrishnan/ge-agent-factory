// Shared SSE-writer plumbing for the five console transports (jobs, repair,
// doctor, ledger, logs). Verbatim move from transport.mjs.

// SSE reconnect support.
// The actual `data: <line>\n\n` framing is produced by the router's writeSSE
// (ge-api-router.mjs). To make streams reconnect-safe we wrap that writer so we
// can also emit `id: <seq>` (lets the browser's EventSource replay from
// Last-Event-ID) and a one-time `retry: <ms>` (caps the reconnect backoff).
//
// Two writer shapes are supported, both backward compatible:
//   1. Plain  writeSSE(line)            -> router frames as `data: line\n\n`
//   2. Framed writeSSE.frame({ id, retry, data })
//      (if the router exposes a `.frame` method it can emit the extra field
//       lines; until then we fall back to plain framing, preserving behavior)
const SSE_RETRY_MS = 3000;

export function makeSseWriter(writeSSE) {
  const canFrame = typeof writeSSE === "function" && typeof writeSSE.frame === "function";
  let retrySent = false;
  // emit(line, { seq }) — line is the NDJSON payload string (the event body).
  return (line, { seq } = {}) => {
    if (canFrame) {
      const frame = { data: line };
      if (!retrySent) { frame.retry = SSE_RETRY_MS; retrySent = true; }
      if (Number.isFinite(seq)) frame.id = seq;
      writeSSE.frame(frame);
      return;
    }
    // Plain writer: framing is owned by the router; we can only pass the data
    // payload. The router change to honor id/retry is a one-liner noted in the
    // PR summary. Behavior is identical to before for plain writers.
    writeSSE(line);
  };
}
