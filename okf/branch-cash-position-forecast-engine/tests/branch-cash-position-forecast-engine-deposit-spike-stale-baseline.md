---
type: Eval Scenario
title: Branch 0417 (account_number 30442198 in core_accounts) posted three teller_ca...
description: "Branch 0417 (account_number 30442198 in core_accounts) posted three teller_cash_deposit entries in account_transactions totaling $184,500.00 on 2026-07-01, but the branch's BigQuery historical_metrics baseline for the period is flat at $42,000.00 with variance_pct of 3.1%, and the linked analytics_events cohort was last computed_at 2026-06-29 (5+ days stale). Regional operations wants tomorrow's shipment/return order published now on schedule. Decide whether to publish and what needs to happen first."
source_id: "branch-cash-position-forecast-engine-deposit-spike-stale-baseline"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Branch 0417 (account_number 30442198 in core_accounts) posted three teller_cash_deposit entries in account_transactions totaling $184,500.00 on 2026-07-01, but the branch's BigQuery historical_metrics baseline for the period is flat at $42,000.00 with variance_pct of 3.1%, and the linked analytics_events cohort was last computed_at 2026-06-29 (5+ days stale). Regional operations wants tomorrow's shipment/return order published now on schedule. Decide whether to publish and what needs to happen first.

## Validates

- [branch-transaction-payroll-calendar-pull](/queries/branch-transaction-payroll-calendar-pull.md)

## Mechanisms to call

- [query_temenos_transact_core_accounts](/tools/query-temenos-transact-core-accounts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_branch_cash_position_forecast_engine_compliance_policy](/tools/lookup-branch-cash-position-forecast-engine-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Branch Cash Position Forecast Engine Banking Compliance Policy](/documents/branch-cash-position-forecast-engine-compliance-policy.md)
- [Cash-in-Transit Carrier Manifest & Insurance Limits Schedule](/documents/cash-in-transit-carrier-manifest-insurance-schedule.md)
