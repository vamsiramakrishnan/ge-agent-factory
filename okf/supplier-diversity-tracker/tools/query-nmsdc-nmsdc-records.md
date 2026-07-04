---
type: Agent Tool
title: query_nmsdc_nmsdc_records
description: Retrieve nmsdc records from NMSDC for the Supplier Diversity Tracker workflow.
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

# query_nmsdc_nmsdc_records

Retrieve nmsdc records from NMSDC for the Supplier Diversity Tracker workflow.

- **Kind:** query
- **Source system:** [NMSDC](/systems/nmsdc.md)

## Inputs

- lookup_key
- date_range

## Outputs

- nmsdc_records_records
- nmsdc_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [NMSDC](/systems/nmsdc.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [certification_sync_vendor_matching](/workflow/certification-sync-vendor-matching.md)

## Evals

- [Run the Supplier Diversity Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-diversity-tracker-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- nmsdc_records_records
- nmsdc_records_summary

# Examples

```
query_nmsdc_nmsdc_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [NMSDC](/systems/nmsdc.md)
