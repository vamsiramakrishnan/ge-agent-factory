---
type: Agent Tool
title: query_highradius_payment_remittances
description: Retrieve payment remittances from HighRadius for the Dunning Communication Drafter workflow.
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

# query_highradius_payment_remittances

Retrieve payment remittances from HighRadius for the Dunning Communication Drafter workflow.

- **Kind:** query
- **Source system:** [HighRadius](/systems/highradius.md)

## Inputs

- lookup_key
- date_range

## Outputs

- payment_remittances_records
- payment_remittances_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [HighRadius](/systems/highradius.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [dunning_context_assembly](/workflow/dunning-context-assembly.md)
- [response_prediction](/workflow/response-prediction.md)

## Evals

- [Run the Dunning Communication Drafter workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dunning-communication-drafter-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- payment_remittances_records
- payment_remittances_summary

# Examples

```
query_highradius_payment_remittances(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [HighRadius](/systems/highradius.md)
