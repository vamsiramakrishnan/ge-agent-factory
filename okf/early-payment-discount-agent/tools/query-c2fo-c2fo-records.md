---
type: Agent Tool
title: query_c2fo_c2fo_records
description: Retrieve c2fo records from C2FO for the Early Payment Discount Agent workflow.
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

# query_c2fo_c2fo_records

Retrieve c2fo records from C2FO for the Early Payment Discount Agent workflow.

- **Kind:** query
- **Source system:** [C2FO](/systems/c2fo.md)

## Inputs

- lookup_key
- date_range

## Outputs

- c2fo_records_records
- c2fo_records_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [C2FO](/systems/c2fo.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [discount_eligibility_scan](/workflow/discount-eligibility-scan.md)

## Evals

- [Run the Early Payment Discount Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/early-payment-discount-agent-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- c2fo_records_records
- c2fo_records_summary

# Examples

```
query_c2fo_c2fo_records(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [C2FO](/systems/c2fo.md)
