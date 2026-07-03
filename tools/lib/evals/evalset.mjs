// Evalset loading/normalizing — ADK-compatible by policy.
//
// The native on-disk format is the ADK evalset (what `adk eval` and the
// agents-cli eval tooling consume) rather than a GE-invented shape. Design
// rule: parse → normalize minimally → emit round-trip-safe. Fields GE does
// not understand are owned by ADK/agents-cli and must survive a load/save
// cycle byte-for-byte at the JSON level — GE only ever *appends* cases.
//
// ADK serializes its pydantic models with camelCase aliases (evalSetId,
// evalCases, userContent…), but snake_case spellings exist in the wild from
// hand-authored files; both are accepted on read. Writes preserve whatever
// the file already used and default to camelCase for new files.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DxError } from "../errors/dx-error.mjs";

const pick = (obj, ...keys) => {
  for (const key of keys) if (obj?.[key] !== undefined) return obj[key];
  return undefined;
};

function partsText(content) {
  if (typeof content === "string") return content;
  const parts = content?.parts;
  if (!Array.isArray(parts)) return typeof content?.text === "string" ? content.text : "";
  return parts.map((part) => (typeof part?.text === "string" ? part.text : "")).join("");
}

// Normalize one raw case into the internal shape every live surface consumes:
// { id, turns: [{ user, reference? }], raw }.
export function normalizeEvalCase(rawCase, index = 0) {
  const id = String(pick(rawCase, "evalId", "eval_id", "id") ?? `case-${index}`);
  const conversation = pick(rawCase, "conversation") || [];
  if (!Array.isArray(conversation)) {
    throw new DxError(`evalset case "${id}" has a non-array conversation`, {
      where: `case ${id}`,
      why: "ADK eval cases carry an ordered conversation array of invocations",
      fix: "fix the case's conversation field to be an array of invocations",
    });
  }
  const turns = conversation.map((invocation, turnIndex) => {
    const user = partsText(pick(invocation, "userContent", "user_content", "user") ?? "");
    if (!user) {
      throw new DxError(`evalset case "${id}" turn ${turnIndex} has no user text`, {
        where: `case ${id}, invocation ${turnIndex}`,
        why: "a live run needs the user text of every invocation to drive the conversation",
        fix: "add userContent.parts[].text (or a user string) to the invocation",
      });
    }
    const reference = partsText(pick(invocation, "finalResponse", "final_response", "reference") ?? "") || null;
    return { user, reference, raw: invocation };
  });
  return { id, turns, raw: rawCase };
}

export function normalizeEvalset(json, { path = "<inline>" } = {}) {
  if (!json || typeof json !== "object" || Array.isArray(json)) {
    throw new DxError("evalset is not a JSON object", {
      where: path,
      why: "an ADK evalset is an object with an eval-case array, not a bare array or scalar",
      fix: "wrap the cases as { \"evalSetId\": …, \"evalCases\": [...] }",
    });
  }
  const rawCases = pick(json, "evalCases", "eval_cases", "cases");
  if (!Array.isArray(rawCases)) {
    throw new DxError("evalset has no eval-case array", {
      where: path,
      why: "expected evalCases (ADK camelCase), eval_cases, or cases to be an array",
      fix: "add an evalCases array (record one with: ge drive --record <path>)",
    });
  }
  return {
    id: String(pick(json, "evalSetId", "eval_set_id", "id") ?? "evalset"),
    name: pick(json, "name") ?? null,
    cases: rawCases.map((rawCase, index) => normalizeEvalCase(rawCase, index)),
    raw: json,
  };
}

export function loadEvalset(path) {
  if (!existsSync(path)) {
    throw new DxError(`evalset not found: ${path}`, {
      where: path,
      why: "the file does not exist on disk",
      fix: `ge drive --record ${path}`,
    });
  }
  let json;
  try {
    json = JSON.parse(readFileSync(path, "utf8"));
  } catch (cause) {
    throw new DxError(`evalset is not valid JSON: ${path}`, {
      where: path,
      why: cause?.message || String(cause),
      fix: `fix the JSON in ${path} (or re-record it: ge drive --record ${path})`,
      cause,
    });
  }
  return normalizeEvalset(json, { path });
}

// Which key spelling an existing evalset uses (so appends match the file).
function caseArrayKeyOf(json) {
  if (Array.isArray(json?.evalCases)) return "evalCases";
  if (Array.isArray(json?.eval_cases)) return "eval_cases";
  if (Array.isArray(json?.cases)) return "cases";
  return "evalCases";
}

// Append a recorded conversation as a new ADK-shaped eval case. Creates the
// evalset file if missing; otherwise mutates ONLY the case array (unknown
// sibling fields round-trip untouched). Returns { evalsetPath, caseId }.
export function appendRecordedCase(path, { caseId, turns, metadata = {} }) {
  const exists = existsSync(path);
  const json = exists ? JSON.parse(readFileSync(path, "utf8")) : { evalSetId: caseId.replace(/[^a-zA-Z0-9_-]/g, "-"), evalCases: [] };
  const key = caseArrayKeyOf(json);
  if (!Array.isArray(json[key])) json[key] = [];
  if (json[key].some((existing) => String(pick(existing, "evalId", "eval_id", "id")) === caseId)) {
    throw new DxError(`eval case id already exists: ${caseId}`, {
      where: path,
      why: "case ids are unique within an evalset; appending a duplicate would shadow the original",
      fix: `pass a different --record-id (or remove the existing "${caseId}" case first)`,
    });
  }
  json[key].push({
    evalId: caseId,
    conversation: turns.map((turn, index) => ({
      invocationId: `${caseId}-${index}`,
      userContent: { role: "user", parts: [{ text: turn.user }] },
      ...(turn.reference ? { finalResponse: { role: "model", parts: [{ text: turn.reference }] } } : {}),
    })),
    ...(Object.keys(metadata).length ? { geMetadata: metadata } : {}),
  });
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, JSON.stringify(json, null, 2) + "\n");
  return { evalsetPath: path, caseId };
}
