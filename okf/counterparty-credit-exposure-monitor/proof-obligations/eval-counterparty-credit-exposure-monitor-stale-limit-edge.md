---
type: Proof Obligation
title: "Golden eval obligation — For the credit desk, risk_measures record measure_id 500213 (var_99_1day) shows limit_utilization_pct at 97.8% against its approved_limit_value, with an as_of_date of 2026-06-30 — four days stale relative to today, 2026-07-04. The same snapshot logs backtest_exceptions_250d = 2. Determine whether this desk requires escalation and produce today's exposure narrative."
description: golden eval proof obligation
source_id: "eval-counterparty-credit-exposure-monitor-stale-limit-edge"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — For the credit desk, risk_measures record measure_id 500213 (var_99_1day) shows limit_utilization_pct at 97.8% against its approved_limit_value, with an as_of_date of 2026-06-30 — four days stale relative to today, 2026-07-04. The same snapshot logs backtest_exceptions_250d = 2. Determine whether this desk requires escalation and produce today's exposure narrative.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [counterparty-credit-exposure-monitor-stale-limit-edge](/tests/counterparty-credit-exposure-monitor-stale-limit-edge.md)


## Mechanisms

- [query_murex_mx_3_risk_measures](/tools/query-murex-mx-3-risk-measures.md)
- [lookup_counterparty_credit_exposure_monitor_compliance_policy](/tools/lookup-counterparty-credit-exposure-monitor-compliance-policy.md)

## Entities that must be referenced

- risk_measures

## Forbidden behaviors

- certifying the exposure view off the stale as_of_date risk_measures record without a re-query
- skipping escalation to market_risk_committee because utilization is just under 100%

# Citations

- [counterparty-credit-exposure-monitor-compliance-policy](/documents/counterparty-credit-exposure-monitor-compliance-policy.md)
