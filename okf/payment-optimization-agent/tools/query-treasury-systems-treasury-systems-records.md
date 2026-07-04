---
type: Agent Tool
title: query_treasury_systems_treasury_systems_records
description: Retrieve treasury systems records from Treasury Systems for the Payment Optimization Agent workflow.
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

# query_treasury_systems_treasury_systems_records

Retrieve treasury systems records from Treasury Systems for the Payment Optimization Agent workflow.

- **Kind:** query
- **Source system:** [Treasury Systems](/systems/treasury-systems.md)

## Inputs

- lookup_key
- date_range

## Outputs

- treasury_systems_records_records
- treasury_systems_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Treasury Systems](/systems/treasury-systems.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [treasury_briefing_generation](/workflow/treasury-briefing-generation.md)
- [payment_execution](/workflow/payment-execution.md)

## Evals

- [Run the Payment Optimization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/payment-optimization-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- treasury_systems_records_records
- treasury_systems_records_summary

# Examples

```
query_treasury_systems_treasury_systems_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Treasury Systems](/systems/treasury-systems.md)
