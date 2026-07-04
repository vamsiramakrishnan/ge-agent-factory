---
type: Agent Tool
title: query_bloomberg_tax_bloomberg_tax_records
description: Retrieve bloomberg tax records from Bloomberg Tax for the Tax Research Assistant workflow.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_bloomberg_tax_bloomberg_tax_records

Retrieve bloomberg tax records from Bloomberg Tax for the Tax Research Assistant workflow.

- **Kind:** query
- **Source system:** [Bloomberg Tax](/systems/bloomberg-tax.md)

## Inputs

- lookup_key
- date_range

## Outputs

- bloomberg_tax_records_records
- bloomberg_tax_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Bloomberg Tax](/systems/bloomberg-tax.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [query_understanding](/workflow/query-understanding.md)
- [memo_delivery](/workflow/memo-delivery.md)

## Evals

- [Run the Tax Research Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/tax-research-assistant-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- bloomberg_tax_records_records
- bloomberg_tax_records_summary

# Examples

```
query_bloomberg_tax_bloomberg_tax_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Bloomberg Tax](/systems/bloomberg-tax.md)
