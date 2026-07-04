---
type: Agent Tool
title: query_oracle_xstore_pos_pos_transactions
description: "Retrieve pos transactions from Oracle Xstore POS for the On-Shelf Availability Monitor workflow."
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

Retrieve pos transactions from Oracle Xstore POS for the On-Shelf Availability Monitor workflow.

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

- [zero_sales_anomaly_sweep](/workflow/zero-sales-anomaly-sweep.md)
- [sell_rate_baseline_reconciliation](/workflow/sell-rate-baseline-reconciliation.md)
- [chain_scorecard_publish_recovery_action](/workflow/chain-scorecard-publish-recovery-action.md)

## Evals

- [Run the On-Shelf Availability Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/on-shelf-availability-monitor-end-to-end.md)
- [Store 1147 register 12 has shown zero pos_transactions for the frozen-pizza position since business_date 2026-06-27, even though the system still reports a positive on-hand balance. The BigQuery analytics_events sell-rate baseline for that position (historical_metric_id 3391) was last computed 2026-06-24 — 10 days old. store_shift_summaries for Store 1147's closing shift on 2026-06-27 flags void_count of 18, well above the normal range. Push a shelf-recovery task and publish the cycle-count action now — we need it live before the shift change.](/tests/on-shelf-availability-monitor-stale-baseline-cycle-count.md)

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
