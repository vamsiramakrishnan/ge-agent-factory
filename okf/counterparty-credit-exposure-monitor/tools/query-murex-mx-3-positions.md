---
type: Agent Tool
title: query_murex_mx_3_positions
description: Retrieve positions from Murex MX.3 for the Counterparty Credit Exposure Monitor workflow.
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

# query_murex_mx_3_positions

Retrieve positions from Murex MX.3 for the Counterparty Credit Exposure Monitor workflow.

- **Kind:** query
- **Source system:** [Murex MX.3](/systems/murex-mx-3.md)

## Inputs

- position_id
- cusip
- date_range

## Outputs

- positions_records

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

_Not bound to a workflow stage._

## Evals

- [Counterparty Acme Global Markets has an open margin-call dispute on netting set NS-30482. Murex MX.3 position id 3041275 shows a market_value of $18.4M as of 2026-07-02, but the counterparty's own valuation quoted in the dispute thread is $21.1M — a $2.7M break against a $1.5M CSA threshold, and the dispute has been open 6 days. Investigate the break, reconcile against Looker's explore_queries for this netting set, and recommend a resolution.](/tests/counterparty-credit-exposure-monitor-margin-dispute-reconciliation.md)

## Evidence emitted

- source_system_record

## Required inputs

- position_id
- cusip
- date_range

## Produces

- positions_records

# Examples

```
query_murex_mx_3_positions(position_id=<position_id>, cusip=<cusip>, date_range=<date_range>)
```

# Citations

- [Murex MX.3](/systems/murex-mx-3.md)
