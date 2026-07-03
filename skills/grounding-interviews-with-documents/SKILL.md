---
name: grounding-interviews-with-documents
description: Grounds the spec interview in user-supplied documents — upload a BRD/policy/schema, parse it server-side, preview/confirm, then inject it so the interview's questions and the agent-spec are evidence-backed; then edit the spec in the canvas and register. Use when the operator has source documents to drive interview→spec, or when working the console's artifact-driven interview.
---

# Grounding Interviews With Documents

Use this as the front-of-funnel extension to `interviewing-specs` when the user brings real documents (a BRD, policy handbook, schema, sample data). It is the console's artifact-driven interview path.

In plain language: don't interview from a blank slate when the user has source material. Upload → parse → confirm the extracted text → inject it as grounding so the agent asks fewer, better questions and the spec cites real requirements. Then the spec renders as a structured, editable artifact, not raw JSON.

## Assembly-Line Slot

- **First step:** if the user has documents, ingest them before generating questions; otherwise fall straight through to `interviewing-specs`.
- **Plays a role in:** the upload → parse → ground → spec-canvas-edit → register front of the line.
- **Input:** a usecaseId + one or more uploaded documents.
- **Output:** grounding text injected into the interview prompt, and a registered (optionally edited) agent-spec.
- **Next step:** hand the registered spec to `planning-missions` (this is the same handoff `interviewing-specs` makes).

## Workflow

1. Upload each document to `POST /api/interviews/:usecaseId/documents` (base64 JSON; works under Bun + Vite). It is stored (GCS when configured, else local) and parsed server-side (text/markdown/csv natively; PDF via pdftotext; Office via JSZip — degrades gracefully if a parser is absent).
2. Show the extracted-text **preview** and let the user confirm "use for grounding" before the interview consumes it (transparency, not silent ingestion).
3. Build the interview prompt with the confirmed grounding (the budget guard clamps oversized text), then run the harness interview per `interviewing-specs`.
4. Render the resulting `agent-spec.json` in the structured **spec canvas** (sections, not `<pre>`); allow inline edits + accept/reject of agent revisions.
5. Save edits (`POST /api/interviews/:usecaseId/spec`) and register via the interview spec registry — then proceed exactly as `interviewing-specs` does.

## Common mistakes

- Interviewing from scratch when the user already attached requirements (wastes the user's answers; ungrounded spec).
- Injecting a whole large document unclamped (blows the context budget) — clamp + summarize.
- Treating parser-unavailable (no pdftotext/JSZip) as fatal — it degrades to a "paste text" note; surface it, don't crash.

## Done when

A registered, evidence-backed agent-spec exists whose claims trace to the uploaded documents, ready for `planning-missions`.

## References

- Read `references/example-session.md` before driving the upload→ground→register flow for the first time — a worked session against the console API with real parser output/notes, the size/type limits, and the parser-unavailable failure variant.
- Copy `assets/upload-request-example.json` as the request body for `POST /api/interviews/<usecaseId>/documents` — annotated with the server-side limits and supported document kinds.
