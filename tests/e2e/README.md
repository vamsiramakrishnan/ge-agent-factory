# e2e — live Gemini Enterprise Stream Assist

This folder drives **real traffic** at a registered Gemini Enterprise agent using
the Discovery Engine **Stream Assist** API (`AssistantService.streamAssist`,
server-streaming) via the official Node client `@google-cloud/discoveryengine`.

## Why this exists

We are moving the **agent gateway** from `DRY_RUN` → `ENFORCED` and hardening the
**MCP ingress**. To verify that cutover you need actual, *governed* agent → MCP
traffic flowing through the plane: a real agent answering a real query, invoking
its tools/MCP servers, with the gateway in the path. This test generates exactly
that traffic on demand, and surfaces grounding/tool/code-execution metadata so
you can confirm the agent really exercised its tools (visible in gateway logs and
MCP ingress metrics during the run).

## It is OPT-IN — the default gate never runs it

- The suite is **skipped unless `GE_E2E=1`**. Without it you get a clean skip
  (0 fail), so `bun test` stays green.
- The repo's default gate is `bun test apps tools packages` — it only globs those
  directories, so `tests/e2e` is **never** picked up in CI.
- Even with `GE_E2E=1`, if the app id can't be resolved the test **skips** (never
  fails).

## Prerequisites

1. **ADC** — Application Default Credentials. `@google-cloud/discoveryengine`
   picks these up automatically.
   ```bash
   gcloud auth application-default login
   ```
   (or run where an ambient service account is available).
2. A **registered agent** in the target Gemini Enterprise app (engine) with at
   least one tool/MCP server, so there is something to answer + ground against.
3. `GE_E2E=1`.

## Run

```bash
# from the repo root
GE_E2E=1 bun test tests/e2e
# or the wired script:
bun run test:e2e
```

Without `GE_E2E=1` the suite reports all tests skipped:

```bash
bun test tests/e2e   # -> skipped, 0 fail
```

## Environment variables

| Var | Default | Meaning |
| --- | --- | --- |
| `GE_E2E` | unset | Must be `1` to run the live suite. |
| `GE_APP_ID` | `.ge.json` `geAppId` | Engine resource `projects/<num>/locations/<loc>/collections/default_collection/engines/<engine>`. |
| `GE_LOCATION` | `.ge.json` `geLocation` / `global` | Drives the `apiEndpoint`. |
| `GOOGLE_CLOUD_PROJECT` | `.ge.json` `project` | Project (informational / ADC project). |
| `GE_E2E_QUERY` | `List the open items that need reconciliation.` | The natural-language query. |

The assistant resource is derived as `<geAppId>/assistants/default_assistant`.
The API endpoint is `discoveryengine.googleapis.com` for `global`, else
`<location>-discoveryengine.googleapis.com`.

## Client / method / request shape (as used)

Verified against the installed `@google-cloud/discoveryengine@2.7.0`:

```js
import { AssistantServiceClient } from "@google-cloud/discoveryengine"; // v1
const client = new AssistantServiceClient({ apiEndpoint });
const stream = client.streamAssist({                 // SERVER_STREAMING
  name: "<geAppId>/assistants/default_assistant",
  query: { text: "<question>" },
  session: "<session resource>",                     // optional, for multi-turn
});
// stream is a gax CancellableStream (Node Readable + EventEmitter).
// Each chunk is a StreamAssistResponse:
//   { answer?: AssistAnswer, sessionInfo?: { session }, assistToken? }
// Answer text:        answer.replies[].groundedContent.content.text
// Tool/code activity: groundedContent.content.executableCode / .codeExecutionResult
// Grounding:          groundedContent.textGroundingMetadata
```

## REST equivalent (manual debugging)

```bash
GE_APP_ID="projects/440790012685/locations/global/collections/default_collection/engines/phoenix-telco_1751440131886"

curl -sS -X POST \
  "https://discoveryengine.googleapis.com/v1/${GE_APP_ID}/assistants/default_assistant:streamAssist" \
  -H "Authorization: Bearer $(gcloud auth print-access-token)" \
  -H "Content-Type: application/json" \
  -d '{
        "query": { "text": "List the open items that need reconciliation." }
      }'
```

For a regional app, swap the host to `<location>-discoveryengine.googleapis.com`.
Add `"session": "<session resource>"` to continue a conversation.
