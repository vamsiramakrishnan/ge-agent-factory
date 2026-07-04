---
type: Agent Tool
title: query_google_document_ai_google_document_ai_records
description: "Retrieve google document ai records from Google Document AI for the Insurance & Liability Monitor workflow."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_google_document_ai_google_document_ai_records

Retrieve google document ai records from Google Document AI for the Insurance & Liability Monitor workflow.

- **Kind:** query
- **Source system:** [Google Document AI](/systems/google-document-ai.md)

## Inputs

- lookup_key
- date_range

## Outputs

- google_document_ai_records_records
- google_document_ai_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Document AI](/systems/google-document-ai.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [ocr_extraction_validation](/workflow/ocr-extraction-validation.md)

## Evals

- [Run the Insurance & Liability Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/insurance-liability-monitor-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- google_document_ai_records_records
- google_document_ai_records_summary

# Examples

```
query_google_document_ai_google_document_ai_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Google Document AI](/systems/google-document-ai.md)
