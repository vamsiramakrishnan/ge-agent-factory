import { jsonrepair } from "jsonrepair";

// Parse a JSON candidate that an LLM emitted, tolerating the usual model slop
// (trailing commas, single quotes, unquoted keys, smart quotes, comments,
// truncated tails). jsonrepair fixes the syntax, JSON.parse does the parse.
export function parseLooseJson(candidate) {
  return JSON.parse(jsonrepair(candidate));
}

// Locate the first balanced { ... } object in (possibly fenced, possibly
// prose-wrapped) LLM text and parse it leniently. If the object is truncated
// (stream cut off mid-response) we hand the open tail to jsonrepair, which
// closes the structure. THROWS when no object is present at all — callers
// (harness review/refine) rely on the exception to surface malformed output;
// this must NOT be softened to a null return.
export function extractFirstJsonObject(text) {
  const raw = String(text || "").trim();
  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const input = fenced ? fenced[1].trim() : raw;
  let start = -1;
  let depth = 0;
  let inString = false;
  let escaped = false;
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (start < 0) {
      if (ch === "{") {
        start = i;
        depth = 1;
      }
      continue;
    }
    if (inString) {
      if (escaped) escaped = false;
      else if (ch === "\\") escaped = true;
      else if (ch === "\"") inString = false;
      continue;
    }
    if (ch === "\"") inString = true;
    else if (ch === "{") depth++;
    else if (ch === "}") {
      depth--;
      if (depth === 0) return parseLooseJson(input.slice(start, i + 1));
    }
  }
  // Found an opening brace but never balanced it → truncated object. jsonrepair
  // completes the open tail rather than throwing on the partial response.
  if (start >= 0) return parseLooseJson(input.slice(start));
  throw new Error("Harness response did not contain a JSON object.");
}
