// OTel span recording for the live lane — `ge drive`, `ge prove --live`,
// `ge bench`, cassette replay.
//
// Spans are recorded in the OpenTelemetry OTLP/JSON wire shape (hex trace/span
// ids, nanosecond timestamps as strings, attributes as {key, value:{…Value}}
// pairs, STATUS_CODE_* status) so a recorded trace can be POSTed to any OTLP
// collector verbatim later — but recording itself is dependency-free: this
// module never loads an OTel SDK, never opens a socket, and adds no exporter.
// The spans land in the two places the live lane already persists behavior:
//   - the LiveTranscript's optional `trace` block (tools/lib/live/transcript.mjs)
//   - `span` records in the cassette (tools/lib/live/cassette.mjs) — the fourth
//     record type next to meta/request/chunk, skipped by old readers.
//
// Span topology per conversation:
//   ge.live.conversation                (root; runner kind, target, responder)
//   └─ ge.live.turn                     (one per turn; CLIENT — the assist call)
//        events: gen_ai.first_token     (at ttft)
//        attrs:  ge.turn.index, gen_ai.usage-ish sizes, tools, citations, state
//
// Times come from an injectable clock so tests are deterministic.

import { randomBytes } from "node:crypto";

const hex = (bytes) => randomBytes(bytes).toString("hex");
const toNano = (ms) => String(Math.round(ms * 1e6));

// Fold a plain JS value into an OTLP AnyValue.
export function otlpValue(value) {
  if (typeof value === "boolean") return { boolValue: value };
  if (typeof value === "number") return Number.isInteger(value) ? { intValue: String(value) } : { doubleValue: value };
  if (Array.isArray(value)) return { arrayValue: { values: value.map(otlpValue) } };
  return { stringValue: String(value) };
}

export function otlpAttributes(attributes = {}) {
  return Object.entries(attributes)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(([key, value]) => ({ key, value: otlpValue(value) }));
}

/**
 * Create a trace recorder. One recorder = one trace.
 * `now` is injectable (ms since epoch) for deterministic tests.
 */
export function createTraceRecorder({ service = "ge-live", now = () => Date.now() } = {}) {
  const traceId = hex(16);
  const finished = [];

  function startSpan(name, { parent = null, kind = "SPAN_KIND_INTERNAL", attributes = {}, startTimeMs = now() } = {}) {
    const spanId = hex(8);
    const events = [];
    let ended = false;
    const span = {
      spanId,
      addEvent(eventName, eventAttributes = {}, atMs = now()) {
        events.push({ name: eventName, timeUnixNano: toNano(atMs), attributes: otlpAttributes(eventAttributes) });
      },
      end({ attributes: endAttributes = {}, status = "STATUS_CODE_OK", statusMessage, endTimeMs = now() } = {}) {
        if (ended) return;
        ended = true;
        finished.push({
          traceId,
          spanId,
          ...(parent ? { parentSpanId: parent.spanId || parent } : {}),
          name,
          kind,
          startTimeUnixNano: toNano(startTimeMs),
          endTimeUnixNano: toNano(endTimeMs),
          attributes: otlpAttributes({ ...attributes, ...endAttributes }),
          ...(events.length ? { events } : {}),
          status: { code: status, ...(statusMessage ? { message: statusMessage } : {}) },
        });
      },
    };
    return span;
  }

  return {
    traceId,
    service,
    startSpan,
    /** Finished spans, in end order — each one OTLP/JSON-shaped. */
    spans() {
      return [...finished];
    },
    /** Compact summary for artifacts that don't want the full span list. */
    summary() {
      return { traceId, spanCount: finished.length };
    },
  };
}

/**
 * Instrument one folded transcript turn as a CLIENT span under `parent`.
 * `turnStartMs` anchors the stream's relative atMs offsets to wall clock.
 */
export function recordTurnSpan(trace, { parent, turn, turnStartMs, endTimeMs }) {
  const span = trace.startSpan("ge.live.turn", {
    parent,
    kind: "SPAN_KIND_CLIENT",
    startTimeMs: turnStartMs,
    attributes: {
      "gen_ai.system": "gemini-enterprise",
      "ge.turn.index": turn.index,
      "ge.turn.user_chars": turn.user.text.length,
    },
  });
  if (turn.stream.ttftMs !== null) {
    span.addEvent("gen_ai.first_token", { "ge.ttft_ms": turn.stream.ttftMs }, turnStartMs + turn.stream.ttftMs);
  }
  span.end({
    endTimeMs,
    attributes: {
      "ge.turn.state": turn.assistant.state || "UNKNOWN",
      "ge.turn.response_chars": turn.assistant.text.length,
      "ge.stream.chunks": turn.stream.chunks.length,
      ...(turn.stream.ttftMs !== null ? { "ge.stream.ttft_ms": turn.stream.ttftMs } : {}),
      ...(turn.stream.fullResponseMs !== null ? { "ge.stream.full_response_ms": turn.stream.fullResponseMs } : {}),
      ...(turn.stream.maxInterChunkGapMs !== null ? { "ge.stream.max_inter_chunk_gap_ms": turn.stream.maxInterChunkGapMs } : {}),
      ...(turn.invocationTools?.length ? { "ge.tools.invoked": turn.invocationTools } : {}),
      "ge.citations.count": (turn.citations || []).length,
      ...(turn.sessionAfter ? { "ge.session.after": turn.sessionAfter } : {}),
    },
    status: turn.assistant.state === "FAILED" ? "STATUS_CODE_ERROR" : "STATUS_CODE_OK",
    ...(turn.assistant.state === "FAILED" ? { statusMessage: "assist call reported terminal FAILED state" } : {}),
  });
  return span;
}
