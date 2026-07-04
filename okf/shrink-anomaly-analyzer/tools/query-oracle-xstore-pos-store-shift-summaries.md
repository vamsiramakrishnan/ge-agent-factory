---
type: Agent Tool
title: query_oracle_xstore_pos_store_shift_summaries
description: Retrieve store shift summaries from Oracle Xstore POS for the Shrink Anomaly Analyzer workflow.
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

Retrieve store shift summaries from Oracle Xstore POS for the Shrink Anomaly Analyzer workflow.

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

_No eval scenario explicitly exercises this tool._

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
