---
title: Capture a contract from documents
parent: Guides
nav_order: 2
layout: default
description: Ground the console interview in a BRD or policy documents so the captured contract cites real requirements.
---

# Capture a contract from documents

**Scope:** local-only — uploads are stored under `.ge/interviews/`; a GCS mirror is optional.

## When to use this

The requirements already exist as documents — a BRD, a policy handbook, a
schema export, sample data — and you don't want the interview to start from a
blank slate. Uploading the documents first grounds the interview: the
extracted text is injected into the interview prompt, the agent asks fewer and
better questions, and the captured contract cites real requirements instead of
reconstructed ones.

This guide covers only the document path; the interview itself is
[Capture a contract in the interview](capture-from-interview.html).

## Input artifact

One or more source documents. The console dropzone accepts
`.txt .md .csv .json .pdf .docx .pptx .xlsx`, up to 25 MB per file
(`apps/console/src/components/interview/DocumentDropzone.tsx`). Server-side
parsing handles text/markdown/csv natively, PDF via `pdftotext`, and Office
formats via JSZip — and degrades gracefully when a parser is absent.

Environment prerequisites are the same as the interview guide: `mise run setup`,
the console at http://localhost:18260 (`mise run console`), and healthy local
mode (`mise run doctor-local`).

## Steps

1. **Start an interview for the use case** — see
   [Capture a contract in the interview](capture-from-interview.html). The
   `usecaseId` in the routes below is the interview's use-case id.

2. **Upload each document.**

   In the console, drop the file on the interview's document dropzone. Or call
   the route directly — it takes base64 JSON, not multipart:

   ```bash
   curl -s -X POST http://localhost:18260/api/interviews/<usecaseId>/documents \
     -H 'content-type: application/json' \
     -d '{"filename":"brd.pdf","mimeType":"application/pdf","contentBase64":"'"$(base64 -w0 brd.pdf)"'"}'
   ```

   The server stores the file under `.ge/interviews/<usecaseId>/uploads/`,
   extracts its text, caches the extraction alongside, and returns the record
   (`filename`, `kind`, `charCount`, `text`, ...). Re-uploading the same
   filename replaces the earlier record.

   > When `GE_INTERVIEW_BUCKET` (or `GE_FACTORY_BUCKET`) is set and
   > `@google-cloud/storage` is installed, uploads are also mirrored to GCS.
   > The mirror is best-effort; the local copy is the source of truth in
   > development.
   {: .note }

3. **Confirm the extracted text before it grounds anything.**

   The console shows an extracted-text preview
   (`apps/console/src/components/interview/DocumentPreview.tsx`) and asks you
   to confirm "use for grounding" — ingestion is explicit, not silent. To list
   what's stored, including cached extracted text:

   ```bash
   curl -s http://localhost:18260/api/interviews/<usecaseId>/documents
   ```

4. **Run the interview with the grounding in place.**

   The confirmed documents' text is concatenated into the interview prompt as
   grounding. A budget guard (`apps/console/src/lib/groundingBudget.ts`)
   clamps oversized text so a large handbook doesn't blow the context budget.
   Drive the contract in the canvas as usual.

5. **Save the contract.**

   ```
   POST /api/interviews/:usecaseId/spec
   ```

   The saved contract's claims should now trace back to the uploaded
   documents.

## Expected output

- `GET /api/interviews/<usecaseId>/documents` lists each upload with a
  non-empty `text` and a plausible `kind` and `charCount`.
- The contract captured by the interview reflects the documents — systems,
  rules, and queries you recognize from the BRD, not generic ones.

## Console view

The **Interview** view hosts the dropzone and the extraction preview. See the
[console tour](../console/index.html) and the
[contract editor](../console/contract-editor.html) for the review side.

## Generated files

Under `.ge/interviews/<usecaseId>/`:

- `uploads/<filename>` — the stored original.
- `uploads/<filename>.extracted.txt` — the cached extracted text.
- `uploads/documents.json` — the upload index.
- `agent-spec.json` — the contract, once saved.

Plus a GCS object at `gs://<bucket>/interviews/<usecaseId>/uploads/<filename>`
when a bucket is configured.

## Common failures

- **413 — document exceeds the 25 MB limit** — the server rejects oversized
  uploads; the client dropzone guards the same limit.
- **400 — `contentBase64` is required / uploaded document is empty** — the
  direct API call sent no payload or a zero-byte decode.
- **Extraction returns empty text with a `note`** — the parser for that format
  is unavailable (no `pdftotext`, or an Office parse failed). The file is
  still stored; it can't ground the interview.
- **Grounding seems truncated** — the budget guard clamped an oversized
  document; that is by design.

## Repair

- Parser unavailable: install `pdftotext`, or convert the document and
  re-upload it as `.md` / `.txt` (same filename replaces the record).
- Clamped grounding: split the document, or upload a shorter extract
  containing the sections that matter.
- Missing GCS mirror: check the console server log for the
  `[interview-docs] GCS mirror skipped` warning; the local copy is still
  authoritative.

## Next step

Return to [Capture a contract in the interview](capture-from-interview.html)
to finish driving and saving the contract, then
[Compile a contract](compile-a-contract.html).
