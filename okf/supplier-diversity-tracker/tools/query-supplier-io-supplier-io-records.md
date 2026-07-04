---
type: Agent Tool
title: query_supplier_io_supplier_io_records
description: Retrieve supplier io records from Supplier.io for the Supplier Diversity Tracker workflow.
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

# query_supplier_io_supplier_io_records

Retrieve supplier io records from Supplier.io for the Supplier Diversity Tracker workflow.

- **Kind:** query
- **Source system:** [Supplier.io](/systems/supplier-io.md)

## Inputs

- lookup_key
- date_range

## Outputs

- supplier_io_records_records
- supplier_io_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Supplier.io](/systems/supplier-io.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [certification_sync_vendor_matching](/workflow/certification-sync-vendor-matching.md)
- [spend_attribution_goal_tracking](/workflow/spend-attribution-goal-tracking.md)
- [narrative_report_generation](/workflow/narrative-report-generation.md)

## Evals

- [Run the Supplier Diversity Tracker workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-diversity-tracker-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- supplier_io_records_records
- supplier_io_records_summary

# Examples

```
query_supplier_io_supplier_io_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Supplier.io](/systems/supplier-io.md)
