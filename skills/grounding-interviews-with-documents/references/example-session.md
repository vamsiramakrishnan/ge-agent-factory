# Example session — ground the interview in a real BRD

A worked upload → parse → confirm → interview → register flow against the
console API (`ge capture` starts the console on :18260). Parser results and
error texts are real (from the extraction layer); HTTP framing matches the
route code in `apps/console/src/server/interview-docs.mjs`. Read this when
it's unclear how a document becomes grounding, or how to react when a parser
is missing.

## The ask

> Operator: "Here's our benefits reconciliation BRD (`benefits-brd.md`) and
> last cycle's exception export. Build the agent spec from these — don't
> make me re-type what's already written down."

Decisions: documents exist → this skill, not a blank-slate interview. Each
file is uploaded, previewed, and *confirmed by the user* before it grounds
anything — transparency, not silent ingestion.

## Step 1 — upload (base64 JSON; shape in `assets/upload-request-example.json`)

```console
$ curl -s -X POST http://localhost:18260/api/interviews/benefits-reconciliation/documents \
    -H 'content-type: application/json' \
    -d "{\"filename\":\"benefits-brd.md\",\"mimeType\":\"text/markdown\",\"contentBase64\":\"$(base64 -w0 benefits-brd.md)\"}"
{
  "filename": "benefits-brd.md",
  "uri": ".ge/interviews/benefits-reconciliation/uploads/benefits-brd.md",
  "storage": "local",
  "bytes": 4210,
  "kind": "text",
  "charCount": 4180,
  "truncated": false,
  "note": null,
  "text": "# Benefits Enrollment Exceptions BRD\n\n## Problem\nHR spends 3 days each cycle…",
  "sections": [ { "title": "benefits-brd.md", "lines": ["…"] } ]
}
```

Reading it: `storage: "local"` (GCS mirroring engages only when
`GE_INTERVIEW_BUCKET`/`GE_FACTORY_BUCKET` is set — best-effort either way),
`kind`/`charCount` come from server-side extraction, `truncated` flips at
the 200k-char extraction cap. Uploads over 25MB are rejected with
`413 — document exceeds 25MB limit`; an empty body with
`400 — contentBase64 is required`.

## Step 2 — preview and confirm

Show the operator the extracted `text` (the console renders this preview)
and ask which documents to use. Only confirmed files feed
`GET /api/interviews/benefits-reconciliation/documents` → grounding. The
combined grounding is clamped to ~12,000 chars at a sentence boundary
(`clampGrounding`), appending `[grounding truncated to 12,000 characters]`
when it trims — summarize oversized documents rather than relying on the
hard cut.

## Step 3 — interview with grounding, then edit in the canvas

Run the harness interview per `interviewing-specs`, with the confirmed
grounding in the prompt. The agent now asks about the $1000 auto-fix
threshold *because the BRD names it*, instead of asking what systems exist.
The resulting spec renders in the structured spec canvas; the operator edits
two refusal rules inline. Persist:

```console
$ curl -s -X POST http://localhost:18260/api/interviews/benefits-reconciliation/spec \
    -H 'content-type: application/json' -d @agent-spec.json
{ "path": ".ge/interviews/benefits-reconciliation/agent-spec.json", "absolutePath": "…" }
```

Then register through the interview spec registry exactly as
`interviewing-specs` does (`register-agent-spec.mjs`).

## Step 4 — report back

> Agent: "Spec registered and evidence-backed: 14 of 16 contract claims
> trace to `benefits-brd.md` (thresholds, freeze window, escalation target);
> the 2 ungrounded ones were confirmed by you in the interview. Uploads and
> extracted text are under `.ge/interviews/benefits-reconciliation/uploads/`.
> Next: `planning-missions` with the registered id."

## Failure variant — parser unavailable / unsupported type

A PDF on a machine without `pdftotext` still uploads and indexes, but its
extracted text carries a note instead of content:

```console
  "kind": "pdf",
  "charCount": 71,
  "text": "PDF text extraction is unavailable on this server (pdftotext not installed).",
```

React: NOT fatal and not silently ignorable — surface it to the operator
("the PDF stored fine but can't ground the interview here") and offer the
degraded path: paste the relevant text as `.md`/`.txt`, or install
`pdftotext` (poppler-utils) and re-upload. Office files behave the same when
`jszip` is absent (`note: "jszip-missing"`). Truly unsupported types are a
hard 415:

```console
$ curl … -d '{"filename":"photo.png", …}'
{ "error": "unsupported document type: photo.png" }
```

And if every mutation suddenly returns
`403 — console is read-only (GE_CONSOLE_READONLY)`, the console is
deliberately read-only — that is an operator setting, not a bug to work
around.
