---
type: Agent Tool
title: query_oracle_xstore_pos_pos_transactions
description: Retrieve pos transactions from Oracle Xstore POS for the POS Exception Triage Agent workflow.
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_oracle_xstore_pos_pos_transactions

Retrieve pos transactions from Oracle Xstore POS for the POS Exception Triage Agent workflow.

- **Kind:** query
- **Source system:** [Oracle Xstore POS](/systems/oracle-xstore-pos.md)

## Inputs

- transaction_number
- store_number
- date_range

## Outputs

- pos_transactions_records
- pos_transactions_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Oracle Xstore POS](/systems/oracle-xstore-pos.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [register_health_signal_intake](/workflow/register-health-signal-intake.md)
- [playbook_gated_severity_scoring](/workflow/playbook-gated-severity-scoring.md)
- [escalation_lane_status_notification](/workflow/escalation-lane-status-notification.md)

## Evals

- [Run the POS Exception Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/pos-exception-triage-agent-end-to-end.md)
- [Store 0412, register 7 processed transaction #3345219 on 2026-06-30 for $184.50 with offline_authorization_flag=true in tender_records. The related Zendesk ticket #88213 is still open at P2. Determine whether this offline authorization sits within the EMV fallback floor limit and whether the ticket can be closed out before end of shift.](/tests/pos-exception-triage-agent-emv-floor-limit-edge.md)

## Evidence emitted

- source_system_record

## Required inputs

- transaction_number
- store_number
- date_range

## Produces

- pos_transactions_records
- pos_transactions_summary

# Examples

```
query_oracle_xstore_pos_pos_transactions(transaction_number=<transaction_number>, store_number=<store_number>, date_range=<date_range>)
```

# Citations

- [Oracle Xstore POS](/systems/oracle-xstore-pos.md)
