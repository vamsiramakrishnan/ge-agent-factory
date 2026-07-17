// Cassette (agent-behavior) mutation operators for eval mutation testing.
//
// Mutation-testing analog: the cassette is the program-under-test — the
// agent's recorded behavior — and the compiled evalset is the fixed test
// suite. Each operator perturbs the recording toward a violation of exactly
// one declared expectation (a required tool, a forbidden tool, a citation, an
// answer). A load-bearing eval MUST turn the live proof red; a mutant that
// survives is an ornamental eval — the proof claims to check a behavior it
// does not actually enforce.
//
// This is the opposite direction from mutating the contract: weakening a
// contract only ever REMOVES an expectation, which can never flip a green
// cassette red, so it can't measure eval teeth. Mutating the program (the
// cassette) against fixed expectations is the true analog and is immune to
// that false-survivor artifact.
//
// Operators are pure: each takes the parsed NDJSON record array and returns a
// fresh array, never mutating the input. Determinism: no clock, no random —
// the same records + operator yield byte-identical output.

// Deep clone via structured JSON round-trip. Cassette records are plain JSON
// (meta/request/chunk/span), so this is total and order-preserving.
function clone(records) {
  return records.map((record) => JSON.parse(JSON.stringify(record)));
}

// Tool invocations ride the cassette as bare strings, but the live transcript
// folder also accepts the object forms {tool} / {name} / {toolName}. Normalize
// so a mutation compares like-for-like — otherwise dropping a required tool
// that happens to be in object form would silently no-op (a false survivor).
export function toolNameOf(entry) {
  if (typeof entry === "string") return entry;
  return entry?.tool || entry?.name || entry?.toolName || null;
}

// Walk every reply object across every chunk record, applying `fn(reply)`.
// The Discovery Engine stream shape is chunk.json.answer.replies[].
function forEachReply(records, fn) {
  for (const record of records) {
    if (record.type !== "chunk") continue;
    const replies = record.json?.answer?.replies;
    if (!Array.isArray(replies)) continue;
    for (const reply of replies) fn(reply, record);
  }
}

// The union of tool names the cassette invokes, across all turns — the same
// set prove-live folds into transcript.invocationTools.
export function cassetteInvocationTools(records) {
  const tools = new Set();
  for (const record of records) {
    if (record.type !== "chunk") continue;
    for (const tool of record.json?.invocationTools || []) {
      const name = toolNameOf(tool);
      if (name) tools.add(name);
    }
  }
  return [...tools];
}

// Does any reply carry grounding references (i.e. a citation prove-live can
// surface)? Drives whether strip_citations has anything to remove.
export function cassetteHasCitations(records) {
  let found = false;
  forEachReply(records, (reply) => {
    if (reply.groundedContent?.textGroundingMetadata?.references?.length) found = true;
  });
  return found;
}

// ── operators ────────────────────────────────────────────────────────────

// Remove one required tool from every chunk's invocationTools. The agent
// "forgot" to make a call the evalset requires → tool_trajectory: missing.
export function dropRequiredTool(records, toolName) {
  const next = clone(records);
  for (const record of next) {
    if (record.type !== "chunk" || !Array.isArray(record.json?.invocationTools)) continue;
    record.json.invocationTools = record.json.invocationTools.filter((tool) => toolNameOf(tool) !== toolName);
  }
  return next;
}

// Add one forbidden tool to the transcript. The agent did a thing the evalset
// forbids → tool_trajectory: forbidden called. Attached to the first chunk
// that already reports tool metadata (so it rides the same turn), else the
// first content-bearing chunk.
export function injectForbiddenTool(records, toolName) {
  const next = clone(records);
  const target =
    next.find((record) => record.type === "chunk" && Array.isArray(record.json?.invocationTools)) ||
    next.find((record) => record.type === "chunk" && record.json?.answer?.replies?.length);
  if (!target) return next;
  const existing = Array.isArray(target.json.invocationTools) ? target.json.invocationTools : [];
  if (!existing.includes(toolName)) target.json.invocationTools = [...existing, toolName];
  return next;
}

// Strip all grounding references — the agent answered without evidence →
// grounding_citations sees none. This probes citation presence; concrete
// source identity is probed separately by replaceRequiredCitation.
export function stripCitations(records) {
  const next = clone(records);
  forEachReply(next, (reply) => {
    if (reply.groundedContent?.textGroundingMetadata) delete reply.groundedContent.textGroundingMetadata;
  });
  return next;
}

// Replace one concrete required citation while leaving the citation record in
// place. This distinguishes source-identity enforcement from the weaker
// "some evidence exists" check: a proof that only counts citations lets this
// mutant survive.
export function replaceRequiredCitation(records, citationId) {
  const next = clone(records);
  forEachReply(next, (reply) => {
    const references = reply.groundedContent?.textGroundingMetadata?.references;
    if (!Array.isArray(references)) return;
    for (const reference of references) {
      const doc = reference?.documentMetadata;
      if (!doc || (doc.document !== citationId && doc.uri !== citationId)) continue;
      doc.document = `mutant://unrelated/${encodeURIComponent(citationId)}`;
      doc.uri = `mutant://unrelated/${encodeURIComponent(citationId)}`;
      doc.title = "Unrelated mutation-test source";
    }
  });
  return next;
}

// Replace all grounded answer text with an off-topic string so token-F1
// against the recorded reference collapses below the match floor →
// response_match: fail. The sentinel shares no tokens with benefits copy.
const CORRUPTION = "Unrelated placeholder response with no shared vocabulary whatsoever.";
export function corruptAnswer(records) {
  const next = clone(records);
  forEachReply(next, (reply) => {
    if (typeof reply.groundedContent?.content?.text === "string") {
      reply.groundedContent.content.text = CORRUPTION;
    }
  });
  return next;
}

// Serialize a record array back to NDJSON (trailing newline, matching the
// checked-in fixtures) for writing a mutated cassette to disk.
export function toNdjson(records) {
  return records.map((record) => JSON.stringify(record)).join("\n") + "\n";
}
