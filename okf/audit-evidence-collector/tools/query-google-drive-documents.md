---
type: Agent Tool
title: query_google_drive_documents
description: Retrieve documents from Google Drive for the Audit Evidence Collector workflow.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_google_drive_documents

Retrieve documents from Google Drive for the Audit Evidence Collector workflow.

- **Kind:** query
- **Source system:** [Google Drive](/systems/google-drive.md)

## Inputs

- lookup_key
- date_range

## Outputs

- documents_records
- documents_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Drive](/systems/google-drive.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [multi_system_collection](/workflow/multi-system-collection.md)
- [gap_analysis](/workflow/gap-analysis.md)

## Evals

- [Run the Audit Evidence Collector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/audit-evidence-collector-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- documents_records
- documents_summary

# Examples

```
query_google_drive_documents(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Google Drive](/systems/google-drive.md)
