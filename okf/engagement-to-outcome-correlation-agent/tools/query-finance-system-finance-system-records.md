---
type: Agent Tool
title: query_finance_system_finance_system_records
description: "Retrieve finance system records from Finance System for the Engagement-to-Outcome Correlation Agent workflow."
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_finance_system_finance_system_records

Retrieve finance system records from Finance System for the Engagement-to-Outcome Correlation Agent workflow.

- **Kind:** query
- **Source system:** [Finance System](/systems/finance-system.md)

## Inputs

- lookup_key
- date_range

## Outputs

- finance_system_records_records
- finance_system_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Finance System](/systems/finance-system.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [data_integration](/workflow/data-integration.md)

## Evals

- [Run the Engagement-to-Outcome Correlation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/engagement-to-outcome-correlation-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- finance_system_records_records
- finance_system_records_summary

# Examples

```
query_finance_system_finance_system_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Finance System](/systems/finance-system.md)
