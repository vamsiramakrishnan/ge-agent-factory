---
title: Capture a contract in the interview
parent: Guides
nav_order: 1
layout: default
description: Capture an enterprise agent contract through the console's artifact-driven interview and export it as an OKF bundle.
---

# Capture a contract in the interview

**Scope:** local-only — runs in the console against the local daemon and harness.

## When to use this

This interview captures the contract — the use-case spec, saved as
`agent-spec.json` — in a reviewable, typed form, starting from a business use
case and someone who can answer questions about it. The console's
artifact-driven interview asks the questions, renders the contract
incrementally in a canvas as you answer, and saves the result with the two
fields the compiler depends on: `behaviorContract.workflow` and
`behaviorContract.answerableQueries`.

If you already have a BRD or policy documents, ground the interview in them
first — see [Capture a contract from documents](capture-from-documents.html).
If you already have a spec JSON on disk, skip the interview and go straight to
[Contract ⇄ OKF](spec-to-okf.html) or [Compile a contract](compile-a-contract.html).

<p align="center">
  <img src="../assets/diagrams/interview-artifact-stream.svg" alt="Operator drives the console interview, which streams a spec artifact from the harness into the spec canvas, then saves and exports it as an OKF bundle" width="650">
</p>

## Input artifact

A business brief: the outcome you want, the source systems involved, and the
guardrails. Nothing needs to exist on disk yet.

Environment prerequisites:

- Local toolchain installed and the daemon (the local background job runner)
  up: `mise run setup`. See [Getting started](../start/getting-started.html).
- The console running: `mise run console` → http://localhost:18260.
- The interview fires a **harness** run — the local, LLM-driven runtime that
  drives capture and checks (see the [Glossary](../GLOSSARY.html)) — powered
  by the Antigravity SDK. Local (Antigravity) mode must be healthy:
  `mise run doctor-local`.

## Steps

1. **Open the interview in the console.**

   From the console, start a new interview for a use case. Starting it runs
   client-side logic in `apps/console/src/lib/startInterview.ts`, which calls
   `ge.runtimeStart({ kind: "harness.run", ... })` — the generic runtime task
   route `POST /api/runtime/tasks`, not a dedicated interview endpoint.

2. **Provide the brief and, optionally, ground it in documents.**

   Fill the brief (outcome, systems, guardrails). To ground the interview in a
   BRD or other source documents, upload them via
   `POST /api/interviews/:usecaseId/documents` — the full document path is
   [Capture a contract from documents](capture-from-documents.html).

3. **Drive the contract; watch the canvas fill in.**

   The harness streams the contract back inline as
   `<artifact identifier="agent-spec" ...>` chunks. The spec canvas
   (`apps/console/src/components/interview/SpecCanvas.tsx`) parses the stream
   and renders sections incrementally as you chat and edit.

4. **Confirm the contract carries the workflow and answerable queries.**

   The interview prompt explicitly instructs the agent to emit:

   - `behaviorContract.workflow` — `{ mode: "sequential" | "parallel"; steps: [...] }`
   - `behaviorContract.answerableQueries` — `[{ request, tools, evidence?, stage? }]`

   These are first-class, typed fields (see
   `apps/console/src/components/interview/artifacts/specArtifact.ts`). They
   feed multi-agent generation at compile time and the OKF Query/Test concepts
   that later become the proof set.

5. **Save the edited contract.**

   ```
   POST /api/interviews/:usecaseId/spec
   ```

   (Invoked by `ge.saveInterviewSpec(usecaseId, spec)` from the canvas Save
   action.)

6. **Export the contract as an OKF bundle** — its portable Markdown form:

   ```
   GET /api/interviews/:id/okf
   ```

   It returns `{ id, conceptCount, files }` — a path→markdown map of the OKF
   Knowledge Bundle.

   > This route works server-side but is **not** wired to a console button
   > today. Call it directly (e.g. with `curl` against the console's
   > `/api/...` origin), or use the CLI path in
   > [Contract ⇄ OKF](spec-to-okf.html) for a file-on-disk bundle.
   {: .warning }

## Expected output

- The spec canvas shows Workflow and Answerable-Queries sections populated.
- The saved contract exists at `.ge/interviews/<usecaseId>/agent-spec.json`.
- The OKF export has concepts:

  ```bash
  curl -s http://localhost:18260/api/interviews/<usecaseId>/okf | head
  ```

  Expect a JSON object with a non-zero `conceptCount`.

## Console view

The **Interview** view is where this happens; the captured contract is
reviewed in **Spec Review**. See the [console tour](../console/index.html) and
the [contract editor](../console/contract-editor.html).

## Generated files

- `.ge/interviews/<usecaseId>/agent-spec.json` — the saved contract.
- `.ge/interviews/<usecaseId>/uploads/` — grounding documents, if any were
  uploaded (see [Capture a contract from documents](capture-from-documents.html)).

## Common failures

- **Interview never streams a contract** — the harness run failed, usually
  because local Antigravity mode is unhealthy or the daemon is down.
- **No `workflow` / `answerableQueries` in the contract** — older specs
  predate these fields; the current interview prompt requires both.
- **`/okf` returns empty** — the contract was never saved;
  `GET /api/interviews/:id/okf` reads `agent-spec.json` from disk.

## Repair

- Confirm local mode is healthy (`mise run doctor-local`) and the daemon is up
  (`ge daemon status`), then restart the interview.
- Missing workflow or answerable queries: re-run the interview — the prompt
  emits both — rather than hand-patching the JSON.
- Empty OKF export: save first (`POST /api/interviews/:usecaseId/spec`), or
  produce a guaranteed file-on-disk bundle with
  `node apps/factory/scripts/spec-to-okf.mjs` — see
  [Contract ⇄ OKF](spec-to-okf.html).

## Next step

Compile the captured contract into a runnable agent:
[Compile a contract](compile-a-contract.html). To exchange or review the
contract as Markdown first, see [Contract ⇄ OKF](spec-to-okf.html).
