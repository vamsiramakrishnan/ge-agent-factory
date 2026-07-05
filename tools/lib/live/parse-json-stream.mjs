// Incremental parser for a streamed JSON array of objects — the REST wire
// format of streaming assist calls (`POST …:streamAssist` returns
// `[ {…}, {…}, … ]` delivered in arbitrary byte chunks).
//
// Robustness contract (tested):
//   - objects split across network chunks
//   - multi-byte UTF-8 sequences split across chunks
//   - whitespace / newlines between elements
//   - either a bare object stream (NDJSON-ish) or a JSON array wrapper
// The parser is a small brace-matcher rather than JSON.parse-on-the-buffer so
// each complete element is surfaced the moment its closing brace arrives —
// that is what makes time-to-first-text measurable at all.
import { liveError } from "./errors.mjs";

export function createJsonStreamParser({ onObject } = {}) {
  const decoder = new TextDecoder("utf-8");
  let buffer = "";
  let scanned = 0; // next buffer index to scan — bytes before it already advanced the state machine
  let depth = 0;
  let inString = false;
  let escaped = false;
  let start = -1;
  const objects = [];

  function scan() {
    for (let i = scanned; i < buffer.length; i += 1) {
      const ch = buffer[i];
      if (inString) {
        if (escaped) escaped = false;
        else if (ch === "\\") escaped = true;
        else if (ch === '"') inString = false;
        continue;
      }
      if (ch === '"') { inString = true; continue; }
      if (ch === "{") {
        if (depth === 0) start = i;
        depth += 1;
      } else if (ch === "}") {
        depth -= 1;
        if (depth === 0 && start >= 0) {
          const raw = buffer.slice(start, i + 1);
          let parsed;
          try {
            parsed = JSON.parse(raw);
          } catch (cause) {
            throw liveError("GELIVE004", "stream element is not valid JSON", {
              where: `byte window ${start}..${i}`,
              why: cause?.message || String(cause),
              fix: "retry the call; if it persists, record the raw stream and file the cassette",
              cause,
            });
          }
          objects.push(parsed);
          if (onObject) onObject(parsed);
          buffer = buffer.slice(i + 1);
          i = -1;
          start = -1;
          scanned = 0;
        } else if (depth < 0) {
          throw liveError("GELIVE004", "unbalanced braces in stream", {
            where: `at byte ${i}`,
            why: "a closing brace arrived with no matching open — the stream is corrupt or not JSON",
            fix: "retry the call; if it persists, ge config explain (check geAppId / geLocation match the live engine)",
          });
        }
      }
      // Array punctuation ([ ] ,) and whitespace between elements fall through.
    }
    scanned = buffer.length;
  }

  return {
    // Accept either raw bytes (Uint8Array — UTF-8 boundaries handled by the
    // streaming decoder) or an already-decoded string.
    push(chunk) {
      buffer += typeof chunk === "string" ? chunk : decoder.decode(chunk, { stream: true });
      scan();
      return objects.splice(0, objects.length);
    },
    // End of stream: anything left that isn't whitespace/array punctuation is
    // a truncated element.
    end() {
      buffer += decoder.decode();
      scan();
      const rest = buffer.replace(/[\s\[\],]/g, "");
      if (rest.length || depth !== 0) {
        throw liveError("GELIVE004", "stream ended mid-element", {
          where: `trailing ${rest.length} byte(s)`,
          why: "the connection closed before the last JSON element completed",
          fix: "retry the call (transient network failure)",
        });
      }
      return objects.splice(0, objects.length);
    },
  };
}

// Convenience: parse a whole recorded byte sequence in one call.
export function parseJsonStream(chunks) {
  const parser = createJsonStreamParser();
  const objects = [];
  for (const chunk of Array.isArray(chunks) ? chunks : [chunks]) objects.push(...parser.push(chunk));
  objects.push(...parser.end());
  return objects;
}
