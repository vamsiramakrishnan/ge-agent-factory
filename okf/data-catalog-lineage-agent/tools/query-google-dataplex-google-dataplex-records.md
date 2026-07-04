---
type: Agent Tool
title: query_google_dataplex_google_dataplex_records
description: "Retrieve google dataplex records from Google Dataplex for the Data Catalog & Lineage Agent workflow."
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

# query_google_dataplex_google_dataplex_records

Retrieve google dataplex records from Google Dataplex for the Data Catalog & Lineage Agent workflow.

- **Kind:** query
- **Source system:** [Google Dataplex](/systems/google-dataplex.md)

## Inputs

- lookup_key
- date_range

## Outputs

- google_dataplex_records_records
- google_dataplex_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Dataplex](/systems/google-dataplex.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [auto_cataloging](/workflow/auto-cataloging.md)
- [pii_classification_governance](/workflow/pii-classification-governance.md)

## Evals

- [Run the Data Catalog & Lineage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/data-catalog-lineage-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- google_dataplex_records_records
- google_dataplex_records_summary

# Examples

```
query_google_dataplex_google_dataplex_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Google Dataplex](/systems/google-dataplex.md)
