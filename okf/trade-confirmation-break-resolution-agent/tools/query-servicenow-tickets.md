---
type: Agent Tool
title: query_servicenow_tickets
description: Retrieve tickets from ServiceNow for the Trade Confirmation Break Resolution Agent workflow.
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

# query_servicenow_tickets

Retrieve tickets from ServiceNow for the Trade Confirmation Break Resolution Agent workflow.

- **Kind:** query
- **Source system:** [ServiceNow](/systems/servicenow.md)

## Inputs

- lookup_key
- date_range

## Outputs

- tickets_records
- tickets_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [ServiceNow](/systems/servicenow.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [confirmation_booking_intake](/workflow/confirmation-booking-intake.md)
- [remediation_routing](/workflow/remediation-routing.md)

## Evals

- [Run the Trade Confirmation Break Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/trade-confirmation-break-resolution-agent-end-to-end.md)
- [Trade 412458901 (CUSIP 456789123, interest_rate_swap, notional $18,400,000 with Meridian Capital Partners) shows settlement_status 'matched' in the latest Murex MX.3 trades extract, but the ServiceNow ticket opened against that same trade_id is still open and unresolved from three business days ago. Reconcile the conflict and tell me whether this break is actually closed.](/tests/trade-confirmation-break-resolution-agent-cross-entity-conflict.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- tickets_records
- tickets_summary

# Examples

```
query_servicenow_tickets(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [ServiceNow](/systems/servicenow.md)
