---
type: Agent Tool
title: query_fis_payments_hub_payment_instructions
description: Retrieve payment instructions from FIS Payments Hub for the Wire Exception Repair Agent workflow.
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_fis_payments_hub_payment_instructions

Retrieve payment instructions from FIS Payments Hub for the Wire Exception Repair Agent workflow.

- **Kind:** query
- **Source system:** [FIS Payments Hub](/systems/fis-payments-hub.md)

## Inputs

- instruction_id
- date_range

## Outputs

- payment_instructions_records
- payment_instructions_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [FIS Payments Hub](/systems/fis-payments-hub.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [retrieve_records](/workflow/retrieve-records.md)
- [analyze_detect](/workflow/analyze-detect.md)
- [act_audit](/workflow/act-audit.md)

## Evals

- [Run the Wire Exception Repair Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/wire-exception-repair-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- instruction_id
- date_range

## Produces

- payment_instructions_records
- payment_instructions_summary

# Examples

```
query_fis_payments_hub_payment_instructions(instruction_id=<instruction_id>, date_range=<date_range>)
```

# Citations

- [FIS Payments Hub](/systems/fis-payments-hub.md)
