# Console artifact-driven interview — design

**Date:** 2026-06-17
**Status:** Approved, implementing
**Sub-project:** 1 of 3 (see also presentation deploy UI, simulator-systems fidelity)

## Goal

Replace the console's "fill a 3-field form → fire-and-watch an agent run" interview with a
**two-pane, artifact-driven** experience modelled on the pixelpitch substrate:

- **Left** — the agent-driven guided interview: streamed agent prose + rich dynamic forms
  (built on the *existing* `RuntimeInteractionForm` round-trip; **no** free-text chat box).
- **Right** — the `agent-spec.json` **materializing live** as a structured, **inline-editable**
  artifact with accept/reject of agent revisions (not a raw JSON `<pre>`).

Plus a new front-of-funnel: **upload a BRD/document → parse server-side → preview/confirm →
ground the interview** with the extracted text.

## Decisions (locked)

| Decision | Choice |
|---|---|
| Interview home | Console hosts the full experience; presentation only *consumes* the result |
| "Live chat" scope | Agent-driven rich forms (reuse `RuntimeInteractionForm`); no free-text chat surface |
| BRD handling | Parse-and-ground **and** show extracted-text preview/confirm before use |
| Spec canvas | Structured renderer + inline field editing + accept/reject of agent revisions |
| Upload storage / auth | GCS sink (matches `factory-bridge.js` prod), per-`usecaseId` scope, IAP at ingress |

## What we are emulating (and what we are NOT)

Pixelpitch is a **substrate, not an interview product**. We port its rendering/streaming machinery,
not a finished wizard:

- Port `apps/web/src/artifacts/parser.ts` (`createArtifactParser`) — partial-tag-aware streaming
  `<artifact>` parser.
- Port the manifest→renderer concept from `apps/web/src/artifacts/{types,manifest,renderer-registry}.ts`,
  adapted to a single `agent-spec` artifact kind (JSON, not HTML).
- Port the resizable split-pane layout pattern from `apps/web/src/components/ProjectView.tsx`
  (`--chat-pane-width`, pointer resizer, focus mode).
- Port `apps/daemon/src/document-preview.ts` (pdftotext + JSZip OOXML extraction, with
  zip-bomb/XXE guards) for BRD parsing.

We do **not** port pixelpitch's iframe runtime (`runtime/srcdoc.ts`) or DOM `edit-mode/`
(`ManualEditPatch`) — those target HTML artifacts; our artifact is a JSON spec, so editing is
purpose-built (form-style field editing + JSON diff).

We do **not** adopt pixelpitch's `<question-form>` schema — we keep the console's existing
interaction contract (`RuntimeInteractionForm` + `ge.runtimeInteraction`) as the single
dynamic-form system and only restyle the renderer.

## Architecture

```
views/Interview.tsx  (resizable split container, replaces single-column form)
├── components/interview/InterviewPane.tsx        (LEFT)
│     ├── DocumentDropzone.tsx        upload → POST /api/interviews/:id/documents
│     ├── DocumentPreview.tsx         extracted-text preview + confirm/use-for-grounding
│     ├── InterviewTranscript.tsx     streamed agent turns (antigravity.text_delta as prose)
│     └── RuntimeInteractionForm.tsx  (existing; restyled) agent-emitted dynamic forms
└── components/interview/SpecCanvas.tsx           (RIGHT)
      ├── artifacts/specArtifact.ts   manifest + kind + streaming status (ported concept)
      ├── artifacts/parser.ts         createArtifactParser (ported)
      ├── SpecSectionRenderer.tsx     structured render of agent-spec.json sections
      ├── SpecFieldEditor.tsx         inline edit of a field
      └── SpecRevisionDiff.tsx        accept/reject agent revision (JSON diff)
```

`SpecReview.tsx` is absorbed into `SpecCanvas` (readiness gates + Register button move there).
Interview-start logic currently duplicated in `views/Interview.tsx` and `views/Journey.tsx` is
extracted to `lib/startInterview.ts` and consumed by both.

### Backend (`apps/console/src/server`)

New route, registered via the descriptor→dispatch split in `ge-api.mjs` + `ge-api-router.mjs`:

- `POST /api/interviews/:usecaseId/documents` — multipart upload (multer). First multipart route
  in the console; `transport.mjs` gains a small blob/stream seam (existing routes read
  `req.text()` as JSON only).
  - Stores the raw file in **GCS** at `gs://<bucket>/interviews/<usecaseId>/<filename>`
    (bucket/prefix mirror `factory-bridge.js`). Local-dev fallback: write under
    `.ge/interviews/<usecaseId>/uploads/`.
  - Synchronously extracts text via the ported `document-preview` module and returns
    `{ uri, filename, bytes, text, truncated }`.
- `GET /api/interviews/:usecaseId/documents` — list uploaded docs + cached extracted text.

The extracted text, once the user confirms, is passed into `buildInterviewPrompt(...)` as a
grounding block (full text if under a token budget; otherwise summarized/chunked — a guard in
`lib/groundingBudget.ts`).

### Data flow

```
upload (multipart)
  → GCS object + server-side parse (pdftotext / JSZip)
  → DocumentPreview (confirm "use for grounding")
  → buildInterviewPrompt(outcome, systems, guardrails, groundingText)
  → ge.runtimeStart({ kind:'harness.run', stage:'interview,spec_generation,...' })
  → streamRuntimeEvents (SSE):
        antigravity.text_delta      → InterviewTranscript prose
        antigravity.interaction_request → RuntimeInteractionForm
        <artifact identifier=agent-spec> chunks → SpecCanvas (createArtifactParser)
  → user answers form → ge.runtimeInteraction
  → agent writes agent-spec.json (also streamed as <artifact>)
  → SpecCanvas: inline edits / accept-reject revisions
  → registerSpec
```

## Components — new vs modified

**New**
- `components/interview/{InterviewPane,SpecCanvas,DocumentDropzone,DocumentPreview,InterviewTranscript,SpecSectionRenderer,SpecFieldEditor,SpecRevisionDiff}.tsx`
- `components/interview/artifacts/{parser.ts,specArtifact.ts}` (ported/adapted)
- `lib/startInterview.ts`, `lib/groundingBudget.ts`
- `server/document-preview.mjs` (ported from pixelpitch daemon)
- `server/gcs.mjs` (thin GCS put/get/list helper; reuse factory-bridge env conventions)
- upload route branch in `ge-api.mjs` + case in `ge-api-router.mjs`; blob seam in `transport.mjs`

**Modified**
- `views/Interview.tsx` → split-pane container
- `views/Journey.tsx` → use `lib/startInterview.ts`
- `views/SpecReview.tsx` → thin wrapper / removed (logic into `SpecCanvas`)
- `services/geClient.ts` → `uploadInterviewDocument`, `listInterviewDocuments`; spec patch/register helpers
- `lib/routes.ts` → spec-review route folds into interview
- `components/RuntimeInteractionForm.tsx` → restyle to canvas aesthetic (no contract change)

## Error handling

- Upload: reject > size cap (e.g. 25 MB), unsupported MIME, parse failure → surfaced inline in
  `DocumentPreview` with a retry; partial extraction returns `truncated:true`.
- Parser guards: zip-bomb (uncompressed-size cap), XXE (`assertSafeXml`), credential-key denylist
  (ported from `document-preview.ts`).
- Streaming: reuse the existing console SSE de-dupe/reconnect; `<artifact>` parser tolerates
  partial/duplicated chunks (it's a resumable state machine).
- Spec edit: validate against the spec JSON shape before enabling Register; show readiness gates.

## Testing

- `server/document-preview.test.mjs` — port pixelpitch negative fixtures (zip-bomb, XXE,
  credential-like fields) + happy-path pdf/docx/pptx/xlsx text extraction.
- `server/ge-api.test.mjs` — extend for the multipart upload route (auth scope, size cap, GCS sink
  mocked, parse response).
- `artifacts/parser.test.ts` — partial-tag streaming of an `agent-spec` artifact.
- Component tests: `SpecCanvas` streaming render + inline edit + accept/reject; `DocumentPreview`
  confirm flow.

## Phased implementation

1. **Port artifact substrate** — `artifacts/parser.ts` + `specArtifact.ts` + parser tests.
2. **BRD backend** — `gcs.mjs`, `document-preview.mjs` (+ tests), upload route + `transport.mjs`
   blob seam, `geClient` upload/list.
3. **Spec canvas** — `SpecSectionRenderer`/`SpecFieldEditor`/`SpecRevisionDiff` wired to streamed
   artifact; absorb `SpecReview`.
4. **Split layout + interview pane** — `Interview.tsx` two-pane, `InterviewPane`,
   `DocumentDropzone`/`DocumentPreview`, `InterviewTranscript`, restyle `RuntimeInteractionForm`.
5. **Grounding** — `groundingBudget.ts` + `buildInterviewPrompt` extension; confirm step.
6. **Dedup** — `lib/startInterview.ts`; update `Journey.tsx`; route cleanup.

## Out of scope (follow-ups)

- Free-text bidirectional chat + token-delta chat surface (explicitly deferred per "agent-driven
  forms" decision).
- Explicit IAP JWT verification inside the console backend (rely on ingress IAP for now; port
  `presentation/src/server/iap-jwt.js` later).
- Multi-file / supporting-file artifacts; spec version history beyond accept/reject of the latest.
