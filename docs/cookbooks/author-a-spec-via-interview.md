---
title: Author a spec via the interview
parent: Cookbooks
nav_order: 2
layout: default
---

# Author a spec via the interview

## Goal

Use the console's artifact-driven interview to produce an agent spec — upload a
BRD, drive the spec with chat/forms, watch it render in the spec canvas — and
confirm the result carries `behaviorContract.workflow` and
`behaviorContract.answerableQueries`. Then export it as an OKF knowledge bundle.

## Prerequisites

- Local toolchain installed and the daemon running (`mise run setup`). See
  [Getting started locally](getting-started.html).
- The console running: `mise run console` → http://localhost:18260.
- The interview fires an Antigravity harness run, so local (Antigravity) mode
  must be healthy (`mise run doctor-local`).

## Steps

1. **Open the interview in the console.**

   From the console, start a new interview for a use case. The "start" action is
   client-side logic in `apps/console/src/lib/startInterview.ts` — it calls
   `ge.runtimeStart({ kind: "harness.run", ... })` (the generic runtime task
   route `POST /api/runtime/tasks`), not a dedicated interview endpoint.

2. **Provide a brief and (optionally) upload a BRD.**

   Fill the brief (outcome, systems, guardrails). Drop a BRD into the document
   dropzone; the console uploads it via:

   ```
   POST /api/interviews/:usecaseId/documents
   ```

   Extracted document text is fed into the interview prompt as grounding.
   (List uploaded docs with `GET /api/interviews/:usecaseId/documents`.)

3. **Drive the spec; watch the canvas fill in.**

   The harness streams the spec back inline as `<artifact identifier="agent-spec" ...>`
   chunks. The spec canvas (`apps/console/src/components/interview/SpecCanvas.tsx`)
   parses the stream and renders sections incrementally as you chat/edit.

4. **Confirm the spec carries the workflow + answerable queries.**

   The interview prompt explicitly instructs the agent to emit:

   - `behaviorContract.workflow` — `{ mode: "sequential" | "parallel"; steps: [...] }`
   - `behaviorContract.answerableQueries` — `[{ request, tools, evidence?, stage? }]`

   These are first-class, typed fields (see
   `apps/console/src/components/interview/artifacts/specArtifact.ts`). They feed
   multi-agent ADK generation and the OKF Query/Test concepts.

5. **Save the edited spec.**

   ```
   POST /api/interviews/:usecaseId/spec
   ```

   (Invoked by `ge.saveInterviewSpec(usecaseId, spec)` from the canvas Save action.)

6. **Export the spec as an OKF bundle.**

   The OKF export is a server endpoint:

   ```
   GET /api/interviews/:id/okf
   ```

   It returns `{ id, conceptCount, files }` — a path→markdown map of the OKF
   Knowledge Bundle.

   > Caveat: this route works server-side but is **not** wired to a console
   > button today. Call it directly (e.g. with `curl` against the console's
   > `/api/...` origin), or use the CLI path in
   > [Spec ⇄ OKF](spec-to-okf.html) for a file-on-disk bundle.

## Verify

- The spec canvas shows Workflow and Answerable-Queries sections populated.
- Fetch the OKF bundle and confirm it has concepts:

  ```bash
  curl -s http://localhost:18260/api/interviews/<usecaseId>/okf | head
  ```

  Expect a JSON object with a non-zero `conceptCount`.

## Troubleshoot

- **Interview never streams a spec** — the harness run failed. Confirm local
  Antigravity mode is healthy (`mise run doctor-local`) and the daemon is up
  (`ge daemon status`).
- **No `workflow` / `answerableQueries` in the spec** — re-run the interview;
  the prompt requires both. Older specs predate these fields.
- **`/okf` returns empty** — the spec must be saved first
  (`POST /api/interviews/:id/spec`). For a guaranteed file bundle, use
  `spec-to-okf.mjs` instead — see [Spec ⇄ OKF](spec-to-okf.html).
