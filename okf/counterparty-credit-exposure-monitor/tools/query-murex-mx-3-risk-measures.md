---
type: Agent Tool
title: query_murex_mx_3_risk_measures
description: Retrieve risk measures from Murex MX.3 for the Counterparty Credit Exposure Monitor workflow.
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

# query_murex_mx_3_risk_measures

Retrieve risk measures from Murex MX.3 for the Counterparty Credit Exposure Monitor workflow.

- **Kind:** query
- **Source system:** [Murex MX.3](/systems/murex-mx-3.md)

## Inputs

- measure_id
- date_range

## Outputs

- risk_measures_records

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

- [For the credit desk, risk_measures record measure_id 500213 (var_99_1day) shows limit_utilization_pct at 97.8% against its approved_limit_value, with an as_of_date of 2026-06-30 — four days stale relative to today, 2026-07-04. The same snapshot logs backtest_exceptions_250d = 2. Determine whether this desk requires escalation and produce today's exposure narrative.](/tests/counterparty-credit-exposure-monitor-stale-limit-edge.md)

## Evidence emitted

- source_system_record

## Required inputs

- measure_id
- date_range

## Produces

- risk_measures_records

# Examples

```
query_murex_mx_3_risk_measures(measure_id=<measure_id>, date_range=<date_range>)
```

# Citations

- [Murex MX.3](/systems/murex-mx-3.md)
