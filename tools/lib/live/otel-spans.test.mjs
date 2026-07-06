// Span recorder contract: OTLP/JSON shape, parenting, deterministic clock.
import { describe, expect, test } from "bun:test";
import { createTraceRecorder, otlpAttributes, otlpValue, recordTurnSpan } from "./otel-spans.mjs";

describe("otel span recorder", () => {
  test("spans are OTLP/JSON-shaped with hex ids and nano timestamps", () => {
    let t = 1000;
    const trace = createTraceRecorder({ now: () => t });
    const root = trace.startSpan("ge.live.conversation", { attributes: { "ge.transcript.id": "t-1" } });
    t = 1500;
    root.end({ attributes: { "ge.turns": 2 } });

    const [span] = trace.spans();
    expect(trace.traceId).toMatch(/^[0-9a-f]{32}$/);
    expect(span.traceId).toBe(trace.traceId);
    expect(span.spanId).toMatch(/^[0-9a-f]{16}$/);
    expect(span.name).toBe("ge.live.conversation");
    expect(span.startTimeUnixNano).toBe("1000000000");
    expect(span.endTimeUnixNano).toBe("1500000000");
    expect(span.status).toEqual({ code: "STATUS_CODE_OK" });
    const attrs = Object.fromEntries(span.attributes.map((a) => [a.key, a.value]));
    expect(attrs["ge.transcript.id"]).toEqual({ stringValue: "t-1" });
    expect(attrs["ge.turns"]).toEqual({ intValue: "2" });
  });

  test("child spans carry parentSpanId; double end is a no-op", () => {
    const trace = createTraceRecorder({ now: () => 0 });
    const root = trace.startSpan("root");
    const child = trace.startSpan("child", { parent: root, kind: "SPAN_KIND_CLIENT" });
    child.end();
    child.end();
    root.end();
    const spans = trace.spans();
    expect(spans).toHaveLength(2);
    expect(spans[0].name).toBe("child");
    expect(spans[0].parentSpanId).toBe(spans[1].spanId);
    expect(spans[0].kind).toBe("SPAN_KIND_CLIENT");
  });

  test("otlpValue folds arrays, bools, ints and floats", () => {
    expect(otlpValue(true)).toEqual({ boolValue: true });
    expect(otlpValue(1.5)).toEqual({ doubleValue: 1.5 });
    expect(otlpValue(["a", "b"])).toEqual({ arrayValue: { values: [{ stringValue: "a" }, { stringValue: "b" }] } });
    expect(otlpAttributes({ skip: undefined, keep: "x" })).toEqual([{ key: "keep", value: { stringValue: "x" } }]);
  });

  test("recordTurnSpan captures ttft event, tools, and FAILED status", () => {
    const trace = createTraceRecorder({ now: () => 0 });
    const root = trace.startSpan("root");
    recordTurnSpan(trace, {
      parent: root,
      turnStartMs: 10_000,
      endTimeMs: 12_000,
      turn: {
        index: 0,
        user: { text: "hello" },
        assistant: { text: "answer", state: "SUCCEEDED" },
        stream: { chunks: [{ atMs: 0 }, { atMs: 400 }], ttftMs: 400, fullResponseMs: 900, maxInterChunkGapMs: 400 },
        invocationTools: ["query_invoices"],
        citations: [{ source: "doc-1" }],
        sessionAfter: "projects/p/sessions/s",
      },
    });
    const [span] = trace.spans();
    expect(span.name).toBe("ge.live.turn");
    expect(span.events).toHaveLength(1);
    expect(span.events[0].name).toBe("gen_ai.first_token");
    expect(span.events[0].timeUnixNano).toBe(String((10_000 + 400) * 1e6));
    const attrs = Object.fromEntries(span.attributes.map((a) => [a.key, a.value]));
    expect(attrs["ge.tools.invoked"]).toEqual({ arrayValue: { values: [{ stringValue: "query_invoices" }] } });
    expect(attrs["ge.citations.count"]).toEqual({ intValue: "1" });
    expect(span.status.code).toBe("STATUS_CODE_OK");

    recordTurnSpan(trace, {
      parent: root,
      turnStartMs: 0,
      endTimeMs: 1,
      turn: { index: 1, user: { text: "x" }, assistant: { text: "", state: "FAILED" }, stream: { chunks: [], ttftMs: null, fullResponseMs: null, maxInterChunkGapMs: null } },
    });
    expect(trace.spans()[1].status.code).toBe("STATUS_CODE_ERROR");
  });
});
