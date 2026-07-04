---
type: Eval Scenario
title: "Risk run as_of_date 2026-07-03 shows measure_id 542118 for the rates desk wit..."
description: "Risk run as_of_date 2026-07-03 shows measure_id 542118 for the rates desk with measure_value $21,400,000 against approved_limit_value $21,000,000 (limit_utilization_pct 101.9%) and backtest_exceptions_250d = 1. The Murex MX.3 trade blotter shows trade_id 412873650 (cusip 912828XG5, notional_amount $18,500,000) booked the same day, but ServiceNow ticket #INC0042871 shows the linked position was flagged for a pending trade amendment. Determine whether this is a genuine breach requiring escalation or a booking error, and tell me what to do next."
source_id: "var-limit-breach-triage-monitor-single-backtest-exception-edge"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Risk run as_of_date 2026-07-03 shows measure_id 542118 for the rates desk with measure_value $21,400,000 against approved_limit_value $21,000,000 (limit_utilization_pct 101.9%) and backtest_exceptions_250d = 1. The Murex MX.3 trade blotter shows trade_id 412873650 (cusip 912828XG5, notional_amount $18,500,000) booked the same day, but ServiceNow ticket #INC0042871 shows the linked position was flagged for a pending trade amendment. Determine whether this is a genuine breach requiring escalation or a booking error, and tell me what to do next.

## Validates

- [risk-run-breach-detection](/queries/risk-run-breach-detection.md)

## Mechanisms to call

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_var_limit_breach_triage_monitor_compliance_policy](/tools/lookup-var-limit-breach-triage-monitor-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [VaR Limit Breach Triage Monitor Banking Compliance Policy](/documents/var-limit-breach-triage-monitor-compliance-policy.md)
- [VaR and Sensitivity Limit Framework & Delegation of Authority](/documents/var-limit-breach-triage-monitor-limit-delegation-framework.md)
