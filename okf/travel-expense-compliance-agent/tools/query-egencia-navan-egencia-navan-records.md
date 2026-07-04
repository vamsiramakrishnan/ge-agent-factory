---
type: Agent Tool
title: query_egencia_navan_egencia_navan_records
description: "Retrieve egencia navan records from Egencia/Navan for the Travel & Expense Compliance Agent workflow."
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

# query_egencia_navan_egencia_navan_records

Retrieve egencia navan records from Egencia/Navan for the Travel & Expense Compliance Agent workflow.

- **Kind:** query
- **Source system:** [Egencia/Navan](/systems/egencia-navan.md)

## Inputs

- lookup_key
- date_range

## Outputs

- egencia_navan_records_records
- egencia_navan_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Egencia/Navan](/systems/egencia-navan.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Travel & Expense Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/travel-expense-compliance-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- egencia_navan_records_records
- egencia_navan_records_summary

# Examples

```
query_egencia_navan_egencia_navan_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Egencia/Navan](/systems/egencia-navan.md)
