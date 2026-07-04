---
type: Agent Tool
title: query_vendor_master_vendor_master_records
description: Retrieve vendor master records from Vendor Master for the Supplier Consolidation Analyzer workflow.
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

# query_vendor_master_vendor_master_records

Retrieve vendor master records from Vendor Master for the Supplier Consolidation Analyzer workflow.

- **Kind:** query
- **Source system:** [Vendor Master](/systems/vendor-master.md)

## Inputs

- lookup_key
- date_range

## Outputs

- vendor_master_records_records
- vendor_master_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Vendor Master](/systems/vendor-master.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [supplier_overlap_mapping](/workflow/supplier-overlap-mapping.md)

## Evals

- [Run the Supplier Consolidation Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-consolidation-analyzer-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- vendor_master_records_records
- vendor_master_records_summary

# Examples

```
query_vendor_master_vendor_master_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Vendor Master](/systems/vendor-master.md)
