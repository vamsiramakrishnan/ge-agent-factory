---
type: Eval Scenario
title: Run the Total Rewards Optimizer workflow for the current period. Cite the rel...
description: "Run the Total Rewards Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "total-rewards-optimizer-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Total Rewards Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [employee-profile-assembly](/queries/employee-profile-assembly.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_mercer_mercer_records](/tools/query-mercer-mercer-records.md)
- [query_e_trade_e_trade_records](/tools/query-e-trade-e-trade-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_total_rewards_optimizer_policy_handbook](/tools/lookup-total-rewards-optimizer-policy-handbook.md)

## Success rubric

Comp Manager receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Total Rewards Optimizer Policy Handbook](/documents/total-rewards-optimizer-policy-handbook.md)
