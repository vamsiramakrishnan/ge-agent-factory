// LiveTranscript — the one behavioral artifact shared by every live surface.
//
// `ge drive`, `ge prove --live`, `ge bench`, cassette replay, the console's
// live views, and the MCP tools all produce and consume this shape. If two
// live features ever need different transcript shapes, the abstraction is
// wrong — extend this one instead.
//
// The wire shape mirrors what the Discovery Engine AssistantService actually
// streams (verified against @google-cloud/discoveryengine v1 — see
// tests/e2e/stream-assist.e2e.test.mjs for the live-fire proof of the field
// paths): each streamed chunk is a StreamAssistResponse
//   { answer?: { state, replies[].groundedContent... }, sessionInfo?: { session }, assistToken? }
// and answer text accumulates from replies[].groundedContent.content.text
// while state is IN_PROGRESS, terminating at SUCCEEDED / FAILED / SKIPPED.
import { z } from "zod";
import { liveErrorShape } from "./errors.mjs";

export const TRANSCRIPT_API_VERSION = "ge.dev/v1";
export const TRANSCRIPT_KIND = "LiveTranscript";

const LiveErrorShapeSchema = z.object({
  code: z.string().nullable(),
  what: z.string(),
  where: z.string().nullable().optional(),
  why: z.string().nullable().optional(),
  fix: z.string().nullable().optional(),
  retryable: z.boolean(),
});

const StreamChunkSchema = z.object({
  atMs: z.number(),
  // What the chunk contributed, folded down for the record. Raw chunk JSON
  // stays in the cassette, not the transcript, to keep transcripts readable.
  textDelta: z.string().optional(),
  state: z.string().optional(),
  session: z.string().optional(),
  assistToken: z.string().optional(),
});

const CitationSchema = z.object({
  source: z.string(),
  title: z.string().optional(),
  uri: z.string().optional(),
});

// OTLP/JSON-shaped span (see otel-spans.mjs): hex ids, nanosecond timestamps
// as strings, attributes as {key, value} pairs. Kept permissive on the value
// side — the shape authority is the OTLP spec, not this schema.
const OtlpSpanSchema = z.object({
  traceId: z.string(),
  spanId: z.string(),
  parentSpanId: z.string().optional(),
  name: z.string(),
  kind: z.string(),
  startTimeUnixNano: z.string(),
  endTimeUnixNano: z.string(),
  attributes: z.array(z.object({ key: z.string(), value: z.record(z.string(), z.any()) })).optional(),
  events: z.array(z.object({
    name: z.string(),
    timeUnixNano: z.string(),
    attributes: z.array(z.object({ key: z.string(), value: z.record(z.string(), z.any()) })).optional(),
  })).optional(),
  status: z.object({ code: z.string(), message: z.string().optional() }),
});

const TranscriptTurnSchema = z.object({
  index: z.number().int().min(0),
  user: z.object({ text: z.string(), at: z.string().optional() }),
  assistant: z.object({
    text: z.string(),
    state: z.string().optional(),
  }),
  stream: z.object({
    chunks: z.array(StreamChunkSchema),
    ttftMs: z.number().nullable(),
    fullResponseMs: z.number().nullable(),
    maxInterChunkGapMs: z.number().nullable(),
  }),
  sessionBefore: z.string().nullable(),
  sessionAfter: z.string().nullable(),
  assistToken: z.string().nullable().optional(),
  invocationTools: z.array(z.string()).optional(),
  citations: z.array(CitationSchema).optional(),
  errors: z.array(LiveErrorShapeSchema).optional(),
});

export const TranscriptSchema = z.object({
  apiVersion: z.literal(TRANSCRIPT_API_VERSION),
  kind: z.literal(TRANSCRIPT_KIND),
  id: z.string().min(1),
  target: z.object({
    project: z.string().optional(),
    location: z.string(),
    engine: z.string(),
    assistant: z.string(),
    expectedAgentId: z.string().nullable().optional(),
  }),
  source: z.object({
    runner: z.enum(["streamassist", "cassette"]),
    replay: z.boolean(),
  }),
  session: z.object({
    name: z.string().nullable(),
    continued: z.boolean(),
  }),
  responder: z.object({
    expectedAgentId: z.string().nullable(),
    observedAgentId: z.string().nullable(),
    assertion: z.enum(["matched", "mismatched", "unknown", "not_applicable"]),
    evidence: z.array(z.string()),
  }),
  turns: z.array(TranscriptTurnSchema),
  timings: z.object({
    startedAt: z.string().nullable(),
    totalMs: z.number().nullable(),
  }),
  invocationTools: z.array(z.string()),
  // The run's OTel trace: one root ge.live.conversation span + a CLIENT span
  // per turn (first-token events, tool/citation/timing attributes). Optional so
  // transcripts recorded before the span layer stay valid.
  trace: z
    .object({
      traceId: z.string(),
      spans: z.array(OtlpSpanSchema),
    })
    .optional(),
  verdict: z
    .object({
      ok: z.boolean(),
      blockers: z.array(LiveErrorShapeSchema),
    })
    .optional(),
  raw: z
    .object({
      cassettePath: z.string().optional(),
      assistTokens: z.array(z.string()).optional(),
    })
    .optional(),
});

export function validateTranscript(candidate) {
  const parsed = TranscriptSchema.safeParse(candidate);
  if (parsed.success) return { ok: true, transcript: parsed.data, issues: [] };
  return {
    ok: false,
    transcript: null,
    issues: parsed.error.issues.map((issue) => `${issue.path.join(".") || "<root>"}: ${issue.message}`),
  };
}

// ── Chunk folding ───────────────────────────────────────────────────────────
// Reduce one turn's ordered stream of { atMs, json } StreamAssistResponse
// chunks into the transcript turn record: accumulated text, terminal state,
// session, assist token, tool invocations, citations, and the three latency
// numbers every surface reports (time to first text, full response, max
// inter-chunk gap).

function repliesOf(json) {
  return json?.answer?.replies || [];
}

export function chunkTextDelta(json) {
  const parts = [];
  for (const reply of repliesOf(json)) {
    const text = reply?.groundedContent?.content?.text;
    if (typeof text === "string" && text.length) parts.push(text);
  }
  return parts.join("");
}

export function chunkCitations(json) {
  const citations = [];
  for (const reply of repliesOf(json)) {
    const meta = reply?.groundedContent?.textGroundingMetadata;
    for (const ref of meta?.references || []) {
      const doc = ref?.documentMetadata || {};
      citations.push({ source: doc.document || doc.uri || "unknown", title: doc.title || undefined, uri: doc.uri || undefined });
    }
  }
  return citations;
}

export function chunkInvocationTools(json) {
  const tools = [];
  for (const invocation of json?.invocationTools || []) {
    if (typeof invocation === "string") tools.push(invocation);
    else if (invocation?.tool || invocation?.name) tools.push(String(invocation.tool || invocation.name));
  }
  return tools;
}

export function foldTurnChunks({ index, userText, chunks, sessionBefore = null }) {
  let text = "";
  let state;
  let sessionAfter = sessionBefore;
  let assistToken = null;
  let ttftMs = null;
  let lastAtMs = null;
  let maxGap = null;
  const invocationTools = [];
  const citations = [];
  const folded = [];
  for (const { atMs, json } of chunks) {
    const delta = chunkTextDelta(json);
    if (delta && ttftMs === null) ttftMs = atMs;
    if (lastAtMs !== null) {
      const gap = atMs - lastAtMs;
      if (maxGap === null || gap > maxGap) maxGap = gap;
    }
    lastAtMs = atMs;
    text += delta;
    if (json?.answer?.state) state = json.answer.state;
    if (json?.sessionInfo?.session) sessionAfter = json.sessionInfo.session;
    if (json?.assistToken) assistToken = json.assistToken;
    for (const tool of chunkInvocationTools(json)) if (!invocationTools.includes(tool)) invocationTools.push(tool);
    citations.push(...chunkCitations(json));
    folded.push({
      atMs,
      ...(delta ? { textDelta: delta } : {}),
      ...(json?.answer?.state ? { state: json.answer.state } : {}),
      ...(json?.sessionInfo?.session ? { session: json.sessionInfo.session } : {}),
      ...(json?.assistToken ? { assistToken: json.assistToken } : {}),
    });
  }
  return {
    index,
    user: { text: userText },
    assistant: { text, ...(state ? { state } : {}) },
    stream: {
      chunks: folded,
      ttftMs,
      fullResponseMs: lastAtMs,
      maxInterChunkGapMs: maxGap,
    },
    sessionBefore,
    sessionAfter,
    assistToken,
    ...(invocationTools.length ? { invocationTools } : {}),
    ...(citations.length ? { citations } : {}),
  };
}

// ── Transcript assembly ─────────────────────────────────────────────────────

export function buildTranscript({ id, target, runner, replay, turns, responder, startedAt = null, cassettePath, trace = null }) {
  const sessionAfterLast = turns.length ? turns[turns.length - 1].sessionAfter : null;
  const invocationTools = [];
  const assistTokens = [];
  let totalMs = null;
  for (const turn of turns) {
    for (const tool of turn.invocationTools || []) if (!invocationTools.includes(tool)) invocationTools.push(tool);
    if (turn.assistToken) assistTokens.push(turn.assistToken);
    if (turn.stream.fullResponseMs !== null) totalMs = (totalMs || 0) + turn.stream.fullResponseMs;
  }
  return {
    apiVersion: TRANSCRIPT_API_VERSION,
    kind: TRANSCRIPT_KIND,
    id,
    target: {
      project: target.project,
      location: target.location,
      engine: target.engine,
      assistant: target.assistant,
      expectedAgentId: target.expectedAgentId ?? null,
    },
    source: { runner, replay },
    session: { name: sessionAfterLast, continued: turns.length > 1 },
    responder,
    turns,
    timings: { startedAt, totalMs },
    invocationTools,
    ...(trace ? { trace } : {}),
    raw: {
      ...(cassettePath ? { cassettePath } : {}),
      ...(assistTokens.length ? { assistTokens } : {}),
    },
  };
}

// Attach a pass/fail verdict (used by prove --live and the live gate).
export function withVerdict(transcript, blockers = []) {
  return { ...transcript, verdict: { ok: blockers.length === 0, blockers: blockers.map(liveErrorShape) } };
}

// Session-threading check: each turn after the first must have been sent with
// the session the previous turn's final response handed back. Returns the
// list of turn indexes that broke the thread (empty = threaded correctly).
export function sessionThreadingBreaks(turns) {
  const breaks = [];
  for (let i = 1; i < turns.length; i += 1) {
    const previous = turns[i - 1];
    const current = turns[i];
    if (previous.sessionAfter && current.sessionBefore !== previous.sessionAfter) breaks.push(i);
  }
  return breaks;
}
