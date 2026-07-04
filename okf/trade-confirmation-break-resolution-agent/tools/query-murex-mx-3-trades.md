---
type: Agent Tool
title: query_murex_mx_3_trades
description: Retrieve trades from Murex MX.3 for the Trade Confirmation Break Resolution Agent workflow.
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

# query_murex_mx_3_trades

Retrieve trades from Murex MX.3 for the Trade Confirmation Break Resolution Agent workflow.

- **Kind:** query
- **Source system:** [Murex MX.3](/systems/murex-mx-3.md)

## Inputs

- trade_id
- cusip
- date_range

## Outputs

- trades_records
- trades_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Murex MX.3](/systems/murex-mx-3.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [confirmation_booking_intake](/workflow/confirmation-booking-intake.md)
- [field_level_break_diagnosis](/workflow/field-level-break-diagnosis.md)
- [evidence_gated_escalation_audit](/workflow/evidence-gated-escalation-audit.md)

## Evals

- [Run the Trade Confirmation Break Resolution Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/trade-confirmation-break-resolution-agent-end-to-end.md)
- [Trade 412458901 (CUSIP 456789123, interest_rate_swap, notional $18,400,000 with Meridian Capital Partners) shows settlement_status 'matched' in the latest Murex MX.3 trades extract, but the ServiceNow ticket opened against that same trade_id is still open and unresolved from three business days ago. Reconcile the conflict and tell me whether this break is actually closed.](/tests/trade-confirmation-break-resolution-agent-cross-entity-conflict.md)
- [Trade 431987650 (fx_forward, CUSIP 178452963, notional $10,050,000 with Harborview Municipal Trust) has sat pending_match for 31 days past its trade_date. Historical baselines in BigQuery for this counterparty show typical resolution inside 10 days. Decide whether to auto-escalate this or keep working it in the normal queue.](/tests/trade-confirmation-break-resolution-agent-aging-threshold-edge.md)

## Evidence emitted

- source_system_record

## Required inputs

- trade_id
- cusip
- date_range

## Produces

- trades_records
- trades_summary

# Examples

```
query_murex_mx_3_trades(trade_id=<trade_id>, cusip=<cusip>, date_range=<date_range>)
```

# Citations

- [Murex MX.3](/systems/murex-mx-3.md)
