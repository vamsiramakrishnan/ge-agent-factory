// Synthesize a compliant-agent cassette from an evalset case.
//
// The behavioral mutation harness needs a GREEN baseline: a recording whose
// behavior satisfies the case's declared expectations. Compiled evalsets
// (emitAdkEvalset) carry no reference answers, so response_match is
// not_applicable and the only expectations to satisfy are the tool/citation
// guards. This builds the smallest Discovery-Engine stream that a compliant
// agent would produce for one case:
//   • invokes exactly the mustCall tools (and none of the mustNotCall ones),
//   • carries a citation iff the case declares mustCite,
//   • threads a session across turns and reaches SUCCEEDED,
// so proveLive grades it green by construction. Mutating this cassette then
// probes whether each declared guard actually bites.
//
// Determinism: fixed timestamps/session ids, no clock, no random.

const RECORDED_AT = "2026-01-01T00:00:00.000Z";

// Build a compliant citation reference block (shape mirrors the checked-in
// success.ndjson fixture that proveLive is known to surface as a citation).
function citationBlock(cite) {
  return {
    references: [
      {
        documentMetadata: {
          document: cite,
          title: "Synthesized evidence",
          uri: `gs://synthetic/${encodeURIComponent(cite)}.pdf`,
        },
      },
    ],
  };
}

// records for one turn: request → in-progress → content (tools + optional
// citation) → succeeded. Tools/citation ride the first turn only; proveLive
// aggregates invocationTools across the whole transcript.
function turnRecords({ turnIndex, userText, session, tools, cite, agentId, target }) {
  // textGroundingMetadata sits on groundedContent, a sibling of content —
  // the shape proveLive and cassetteHasCitations read (see success.ndjson).
  const groundedContent = { content: { text: `Synthesized compliant answer for turn ${turnIndex}.` } };
  if (cite) groundedContent.textGroundingMetadata = citationBlock(cite);
  const contentChunk = {
    type: "chunk",
    turn: turnIndex,
    atMs: 400,
    json: {
      answer: { state: "IN_PROGRESS", replies: [{ groundedContent }] },
    },
  };
  if (tools.length) contentChunk.json.invocationTools = tools;
  return [
    { type: "request", turn: turnIndex, session: turnIndex === 0 ? null : session, body: { query: { text: userText } } },
    { type: "chunk", turn: turnIndex, atMs: 0, json: { answer: { state: "IN_PROGRESS", replies: [] } } },
    contentChunk,
    {
      type: "chunk",
      turn: turnIndex,
      atMs: 800,
      json: {
        answer: { state: "SUCCEEDED", metadata: agentId ? { agentId } : {} },
        sessionInfo: { session },
        assistToken: `tok-turn-${turnIndex}`,
      },
    },
  ];
}

// Build the full record array for a case. `turns` is [{ user }]; `expected`
// is the case's geMetadata.expected; `target`/`agentId` seed the meta record.
export function synthesizeCassetteRecords(turns, expected = {}, { target, agentId, session = "synthetic-session-0" } = {}) {
  const tools = expected.mustCall || [];
  const cite = (expected.mustCite || [])[0] || null;
  const records = [{ type: "meta", version: 1, target, recordedAt: RECORDED_AT }];
  turns.forEach((turn, turnIndex) => {
    records.push(
      ...turnRecords({
        turnIndex,
        userText: turn.user || turn,
        session: `${target?.engine || "engine"}/sessions/${session}`,
        tools: turnIndex === 0 ? tools : [],
        cite: turnIndex === 0 ? cite : null,
        agentId,
        target,
      }),
    );
  });
  return records;
}

// A synthetic but internally-consistent target. proveLive reads the target
// from cassette meta, so the exact values only need to be stable.
export function syntheticTarget(agentId) {
  return {
    project: "synthetic",
    location: "global",
    engine: `projects/synthetic/locations/global/collections/default_collection/engines/${agentId}-engine`,
    assistant: "default_assistant",
  };
}
