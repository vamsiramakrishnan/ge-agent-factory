---
type: Agent Tool
title: query_oracle_xstore_pos_store_shift_summaries
description: Retrieve store shift summaries from Oracle Xstore POS for the Price Execution Audit Monitor workflow.
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

# query_oracle_xstore_pos_store_shift_summaries

Retrieve store shift summaries from Oracle Xstore POS for the Price Execution Audit Monitor workflow.

- **Kind:** query
- **Source system:** [Oracle Xstore POS](/systems/oracle-xstore-pos.md)

## Inputs

- store_number
- business_date
- date_range

## Outputs

- store_shift_summaries_records

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

_Not bound to a workflow stage._

## Evals

- [Store 482 has been flagged for three consecutive scan-accuracy exceptions on SKU 40521193 (POS ringing $2.99 against a Revionics price of record of $2.49). The store_shift_summaries feed for store 482 hasn't refreshed in 3 business days. Determine whether this is a systemic price-zone feed failure or an isolated register error, and recommend the next action.](/tests/price-execution-audit-monitor-stale-feed-reconciliation.md)

## Evidence emitted

- source_system_record

## Required inputs

- store_number
- business_date
- date_range

## Produces

- store_shift_summaries_records

# Examples

```
query_oracle_xstore_pos_store_shift_summaries(store_number=<store_number>, business_date=<business_date>, date_range=<date_range>)
```

# Citations

- [Oracle Xstore POS](/systems/oracle-xstore-pos.md)
