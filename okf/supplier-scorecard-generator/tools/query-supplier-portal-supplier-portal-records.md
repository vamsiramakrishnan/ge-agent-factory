---
type: Agent Tool
title: query_supplier_portal_supplier_portal_records
description: Retrieve supplier portal records from Supplier Portal for the Supplier Scorecard Generator workflow.
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

# query_supplier_portal_supplier_portal_records

Retrieve supplier portal records from Supplier Portal for the Supplier Scorecard Generator workflow.

- **Kind:** query
- **Source system:** [Supplier Portal](/systems/supplier-portal.md)

## Inputs

- lookup_key
- date_range

## Outputs

- supplier_portal_records_records
- supplier_portal_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Supplier Portal](/systems/supplier-portal.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [scoring_benchmarking](/workflow/scoring-benchmarking.md)
- [publish_distribute](/workflow/publish-distribute.md)

## Evals

- [Run the Supplier Scorecard Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supplier-scorecard-generator-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- supplier_portal_records_records
- supplier_portal_records_summary

# Examples

```
query_supplier_portal_supplier_portal_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Supplier Portal](/systems/supplier-portal.md)
