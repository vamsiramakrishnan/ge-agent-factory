---
type: Agent Tool
title: query_oracle_xstore_pos_store_shift_summaries
description: Retrieve store shift summaries from Oracle Xstore POS for the POS Exception Triage Agent workflow.
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

Retrieve store shift summaries from Oracle Xstore POS for the POS Exception Triage Agent workflow.

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

- [Store 1187 register 14 has had three Zendesk tickets opened in the last 24 hours (#91004 P2 hardware, #91011 P3 hardware, #91022 P1 hardware). The store_shift_summaries record for the 2026-07-03 closing shift shows a cash_over_short of -$62.40 on that till, and the most recent BigQuery historical_metrics refresh for this store is dated 2026-06-28. Diagnose whether this is a hardware pattern worth a field-tech dispatch, and tell me if the baseline is fresh enough to act on.](/tests/pos-exception-triage-agent-repeat-register-stale-baseline.md)

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
