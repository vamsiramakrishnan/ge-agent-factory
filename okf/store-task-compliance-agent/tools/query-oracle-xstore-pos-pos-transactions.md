---
type: Agent Tool
title: query_oracle_xstore_pos_pos_transactions
description: Retrieve pos transactions from Oracle Xstore POS for the Store Task Compliance Agent workflow.
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

Retrieve pos transactions from Oracle Xstore POS for the Store Task Compliance Agent workflow.

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

- [pos_execution_cross_check](/workflow/pos-execution-cross-check.md)

## Evals

- [Run the Store Task Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/store-task-compliance-agent-end-to-end.md)
- [Store 482 marked the Saturday planogram reset (task shift on shift_schedules) complete for business date 2026-06-27, but Oracle Xstore POS shows zero transaction_count in store_shift_summaries and no matching pos_transactions during the reset window. Confirm completion for the district scorecard.](/tests/store-task-compliance-agent-selfreport-pos-conflict.md)
- [District 214's back-to-school promo went live this morning at store 1187. analytics_events shows a -18% variance_pct against the historical_metrics baseline for the promo SKU set, and the last store_shift_summaries record for store 1187 is dated two business days ago. Close out the promo verification exception as resolved.](/tests/store-task-compliance-agent-promo-staleness-edge.md)

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
