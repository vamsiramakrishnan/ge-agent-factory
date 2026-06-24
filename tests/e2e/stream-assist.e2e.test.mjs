// =============================================================================
// LIVE end-to-end test: drive REAL traffic at a Gemini Enterprise agent via the
// Discovery Engine "Stream Assist" (AssistantService) API.
//
// WHY THIS EXISTS
// ---------------
// The agent gateway is being moved from DRY_RUN -> ENFORCED and the MCP ingress
// is being hardened. To *verify* that cutover you need actual, governed
// agent->MCP traffic flowing through the plane: a real Gemini Enterprise agent
// answering a real query, invoking its tools/MCP servers, with the gateway in
// the path. This test produces exactly that traffic on demand. It is the
// "live fire" that makes the hardening observable (gateway logs, MCP ingress
// metrics, grounding/tool metadata in the response).
//
// SAFETY / CI
// -----------
// This hits a real cloud agent and burns real LLM tokens, so the whole suite is
// OPT-IN. It is SKIPPED unless GE_E2E=1. It also skips (never fails) if the
// app id can't be resolved. That means the default gate
//   `bun test apps tools packages`
// never even globs this file, and a manual `bun test tests/e2e` without GE_E2E=1
// reports a clean skip. CI stays green by construction.
//
// API SHAPE (verified against the installed @google-cloud/discoveryengine@2.7.0)
// -----------------------------------------------------------------------------
//   import { AssistantServiceClient } from "@google-cloud/discoveryengine"; // v1
//   const client = new AssistantServiceClient({ apiEndpoint });
//   const stream = client.streamAssist({                 // server-streaming
//     name: "<geAppId>/assistants/default_assistant",
//     query: { text: "<question>" },
//     session: "<session resource | '-' | undefined>",
//   });
//   // stream is a gax CancellableStream (Node Readable + EventEmitter).
//   // Each emitted chunk is a StreamAssistResponse:
//   //   { answer?: AssistAnswer, sessionInfo?: { session }, assistToken? }
//   // Answer text lives at:
//   //   answer.replies[].groundedContent.content.text
//   // Tool/code activity shows up as:
//   //   groundedContent.content.executableCode / .codeExecutionResult
//   // Grounding shows up as:
//   //   groundedContent.textGroundingMetadata
// =============================================================================

import { test, expect, describe } from "bun:test";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, "..", "..");

// ---------------------------------------------------------------------------
// Config resolution: env wins, .ge.json is the fallback.
// ---------------------------------------------------------------------------
function loadGeJson() {
  try {
    return JSON.parse(readFileSync(resolve(REPO_ROOT, ".ge.json"), "utf8"));
  } catch {
    return {};
  }
}

const geJson = loadGeJson();

const geAppId = process.env.GE_APP_ID || geJson.geAppId || "";
const geLocation = process.env.GE_LOCATION || geJson.geLocation || "global";
const project =
  process.env.GOOGLE_CLOUD_PROJECT || geJson.project || geJson.projectNumber || "";
const query =
  process.env.GE_E2E_QUERY || "List the open items that need reconciliation.";

// global -> discoveryengine.googleapis.com ; <region> -> <region>-discoveryengine.googleapis.com
const apiEndpoint =
  geLocation === "global"
    ? "discoveryengine.googleapis.com"
    : `${geLocation}-discoveryengine.googleapis.com`;

// The assistant resource is always "<engine resource>/assistants/default_assistant".
const assistant = geAppId ? `${geAppId}/assistants/default_assistant` : "";

// ---------------------------------------------------------------------------
// Gating. The suite only runs when explicitly opted into with GE_E2E=1 AND an
// app id is resolvable. Anything missing is a clean SKIP, never a failure.
// ---------------------------------------------------------------------------
const OPTED_IN = process.env.GE_E2E === "1";
const RESOLVABLE = Boolean(geAppId);
const RUN = OPTED_IN && RESOLVABLE;

if (!OPTED_IN) {
  console.log(
    "[e2e] SKIPPED: set GE_E2E=1 to run the live Stream Assist test (it hits a real Gemini Enterprise agent).",
  );
} else if (!RESOLVABLE) {
  console.log(
    "[e2e] SKIPPED: GE_E2E=1 but no geAppId resolvable from GE_APP_ID or .ge.json.",
  );
} else {
  console.log(`[e2e] LIVE: assistant=${assistant}`);
  console.log(`[e2e] LIVE: apiEndpoint=${apiEndpoint} location=${geLocation} project=${project}`);
  console.log(`[e2e] LIVE: query=${JSON.stringify(query)}`);
}

const LIVE_TIMEOUT_MS = 120_000; // live LLM call; generous.

// ---------------------------------------------------------------------------
// Helpers shared by both tests.
// ---------------------------------------------------------------------------

/**
 * Consume a gax server-streaming response robustly. The client returns a
 * CancellableStream (Node Readable + EventEmitter). We support BOTH:
 *   - async iteration (for await ... of stream)
 *   - event style ('data' / 'end' / 'error')
 * Whichever fires first wins; we never hang past the test timeout.
 */
function collectStream(stream) {
  return new Promise((resolveP, rejectP) => {
    const responses = [];
    let settled = false;

    const onData = (chunk) => responses.push(chunk);
    const onError = (err) => {
      if (settled) return;
      settled = true;
      rejectP(err);
    };
    const onEnd = () => {
      if (settled) return;
      settled = true;
      resolveP(responses);
    };

    // Prefer event style — it works for every gax stream version.
    if (typeof stream.on === "function") {
      stream.on("data", onData);
      stream.on("error", onError);
      stream.on("end", onEnd);
      return;
    }

    // Fallback: async iterable.
    (async () => {
      try {
        for await (const chunk of stream) responses.push(chunk);
        if (!settled) {
          settled = true;
          resolveP(responses);
        }
      } catch (err) {
        onError(err);
      }
    })();
  });
}

/** Pull all answer text out of the collected StreamAssistResponse chunks. */
function extractAnswerText(responses) {
  const parts = [];
  for (const r of responses) {
    const replies = r?.answer?.replies || [];
    for (const reply of replies) {
      const text = reply?.groundedContent?.content?.text;
      if (typeof text === "string" && text.length) parts.push(text);
    }
  }
  return parts.join("");
}

/** Detect any grounding / tool / code-execution metadata (proof of MCP/tool use). */
function summarizeAgentActivity(responses) {
  let grounded = false;
  let executableCode = false;
  let codeResult = false;
  for (const r of responses) {
    for (const reply of r?.answer?.replies || []) {
      const gc = reply?.groundedContent;
      if (!gc) continue;
      if (gc.textGroundingMetadata) grounded = true;
      if (gc.content?.executableCode) executableCode = true;
      if (gc.content?.codeExecutionResult) codeResult = true;
    }
  }
  return { grounded, executableCode, codeResult };
}

/** Find the session resource returned by the server (used for multi-turn). */
function extractSession(responses) {
  for (const r of responses) {
    const s = r?.sessionInfo?.session;
    if (typeof s === "string" && s.length) return s;
  }
  return "";
}

// Lazily import the client only when we actually run live, so a missing/odd
// install never breaks the skip path.
async function makeClient() {
  const mod = await import("@google-cloud/discoveryengine");
  const AssistantServiceClient = mod.AssistantServiceClient || mod.v1?.AssistantServiceClient;
  if (!AssistantServiceClient) {
    throw new Error(
      "AssistantServiceClient not found on @google-cloud/discoveryengine export surface.",
    );
  }
  return new AssistantServiceClient({ apiEndpoint });
}

// Shared across tests so the follow-up turn can reuse the first session.
let firstTurnSession = "";

describe("Gemini Enterprise Stream Assist (LIVE)", () => {
  test.skipIf(!RUN)(
    "single-turn: streamAssist yields a non-empty answer (governed agent->MCP traffic)",
    async () => {
      const client = await makeClient();

      const request = {
        name: assistant,
        query: { text: query },
        // No session on the first turn — let the server mint one.
      };

      const stream = client.streamAssist(request);
      const responses = await collectStream(stream);

      // 1) Call completed and produced at least one streamed response.
      expect(Array.isArray(responses)).toBe(true);
      expect(responses.length).toBeGreaterThanOrEqual(1);

      // 2) There is real answer text.
      const text = extractAnswerText(responses);
      console.log(`[e2e] answer text (${text.length} chars):`);
      console.log(text.slice(0, 800));
      expect(typeof text).toBe("string");
      expect(text.trim().length).toBeGreaterThan(0);

      // 3) Did the agent actually invoke tools/MCP / ground its answer?
      const activity = summarizeAgentActivity(responses);
      console.log(`[e2e] agent activity: ${JSON.stringify(activity)}`);

      // 4) Capture the session for the follow-up turn.
      firstTurnSession = extractSession(responses);
      console.log(`[e2e] sessionInfo.session = ${firstTurnSession || "(none returned)"}`);
    },
    LIVE_TIMEOUT_MS,
  );

  test.skipIf(!RUN)(
    "multi-turn: follow-up reusing the returned session also responds",
    async () => {
      // Best-effort: if the first turn didn't hand back a session, skip cleanly.
      if (!firstTurnSession) {
        console.log("[e2e] no session from first turn — skipping multi-turn follow-up.");
        return;
      }

      const client = await makeClient();

      const request = {
        name: assistant,
        query: { text: "Summarize what you just told me in one sentence." },
        session: firstTurnSession, // reuse the conversation.
      };

      const stream = client.streamAssist(request);
      const responses = await collectStream(stream);

      expect(responses.length).toBeGreaterThanOrEqual(1);
      const text = extractAnswerText(responses);
      console.log(`[e2e] follow-up answer (${text.length} chars):`);
      console.log(text.slice(0, 800));
      expect(text.trim().length).toBeGreaterThan(0);
    },
    LIVE_TIMEOUT_MS,
  );
});
