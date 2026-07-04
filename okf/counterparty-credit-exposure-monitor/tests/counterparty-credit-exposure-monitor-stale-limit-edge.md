---
type: Eval Scenario
title: "For the credit desk, risk_measures record measure_id 500213 (var_99_1day) sho..."
description: "For the credit desk, risk_measures record measure_id 500213 (var_99_1day) shows limit_utilization_pct at 97.8% against its approved_limit_value, with an as_of_date of 2026-06-30 — four days stale relative to today, 2026-07-04. The same snapshot logs backtest_exceptions_250d = 2. Determine whether this desk requires escalation and produce today's exposure narrative."
source_id: "counterparty-credit-exposure-monitor-stale-limit-edge"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# For the credit desk, risk_measures record measure_id 500213 (var_99_1day) shows limit_utilization_pct at 97.8% against its approved_limit_value, with an as_of_date of 2026-06-30 — four days stale relative to today, 2026-07-04. The same snapshot logs backtest_exceptions_250d = 2. Determine whether this desk requires escalation and produce today's exposure narrative.

## Validates

- [exposure-collateral-aggregation](/queries/exposure-collateral-aggregation.md)

## Mechanisms to call

- [query_murex_mx_3_risk_measures](/tools/query-murex-mx-3-risk-measures.md)
- [lookup_counterparty_credit_exposure_monitor_compliance_policy](/tools/lookup-counterparty-credit-exposure-monitor-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Counterparty Credit Exposure Monitor Banking Compliance Policy](/documents/counterparty-credit-exposure-monitor-compliance-policy.md)
