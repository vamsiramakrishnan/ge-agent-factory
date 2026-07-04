---
type: Agent Tool
title: query_oracle_xstore_pos_pos_transactions
description: Retrieve pos transactions from Oracle Xstore POS for the Price Execution Audit Monitor workflow.
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

Retrieve pos transactions from Oracle Xstore POS for the Price Execution Audit Monitor workflow.

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

- [pos_scan_reconciliation](/workflow/pos-scan-reconciliation.md)
- [fix_it_dispatch_escalation](/workflow/fix-it-dispatch-escalation.md)

## Evals

- [Run the Price Execution Audit Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/price-execution-audit-monitor-end-to-end.md)
- [Store 482 has been flagged for three consecutive scan-accuracy exceptions on SKU 40521193 (POS ringing $2.99 against a Revionics price of record of $2.49). The store_shift_summaries feed for store 482 hasn't refreshed in 3 business days. Determine whether this is a systemic price-zone feed failure or an isolated register error, and recommend the next action.](/tests/price-execution-audit-monitor-stale-feed-reconciliation.md)

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
