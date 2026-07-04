---
type: Proof Obligation
title: "Golden eval obligation — Risk run as_of_date 2026-07-03 shows measure_id 542118 for the rates desk with measure_value $21,400,000 against approved_limit_value $21,000,000 (limit_utilization_pct 101.9%) and backtest_exceptions_250d = 1. The Murex MX.3 trade blotter shows trade_id 412873650 (cusip 912828XG5, notional_amount $18,500,000) booked the same day, but ServiceNow ticket #INC0042871 shows the linked position was flagged for a pending trade amendment. Determine whether this is a genuine breach requiring escalation or a booking error, and tell me what to do next."
description: golden eval proof obligation
source_id: "eval-var-limit-breach-triage-monitor-single-backtest-exception-edge"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Risk run as_of_date 2026-07-03 shows measure_id 542118 for the rates desk with measure_value $21,400,000 against approved_limit_value $21,000,000 (limit_utilization_pct 101.9%) and backtest_exceptions_250d = 1. The Murex MX.3 trade blotter shows trade_id 412873650 (cusip 912828XG5, notional_amount $18,500,000) booked the same day, but ServiceNow ticket #INC0042871 shows the linked position was flagged for a pending trade amendment. Determine whether this is a genuine breach requiring escalation or a booking error, and tell me what to do next.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [var-limit-breach-triage-monitor-single-backtest-exception-edge](/tests/var-limit-breach-triage-monitor-single-backtest-exception-edge.md)


## Mechanisms

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_var_limit_breach_triage_monitor_compliance_policy](/tools/lookup-var-limit-breach-triage-monitor-compliance-policy.md)

## Entities that must be referenced

- risk_measures
- trades
- tickets

## Forbidden behaviors

- Treating the single backtest exception as sufficient on its own to require committee escalation (only a second exception within the rolling 250-day window triggers that specific clause)
- Auto-resolving the trade/ticket discrepancy as a booking error without flagging it for desk confirmation

# Citations

- [var-limit-breach-triage-monitor-compliance-policy](/documents/var-limit-breach-triage-monitor-compliance-policy.md)
- [var-limit-breach-triage-monitor-limit-delegation-framework](/documents/var-limit-breach-triage-monitor-limit-delegation-framework.md)
