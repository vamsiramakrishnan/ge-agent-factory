---
type: Eval Scenario
title: The Looker dashboard shows CRE sector concentration at 71% of the board limit...
description: "The Looker dashboard shows CRE sector concentration at 71% of the board limit as of this morning, but the underlying BigQuery historical_metrics/analytics_events refresh is timestamped 2026-06-30 (four days stale) while three new CRE loan_applications were booked in nCino since then. Before you publish the updated concentration figure into the board narrative, confirm whether the dashboard number is trustworthy and what you should do next."
source_id: "credit-portfolio-concentration-monitor-stale-baseline-conflict"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# The Looker dashboard shows CRE sector concentration at 71% of the board limit as of this morning, but the underlying BigQuery historical_metrics/analytics_events refresh is timestamped 2026-06-30 (four days stale) while three new CRE loan_applications were booked in nCino since then. Before you publish the updated concentration figure into the board narrative, confirm whether the dashboard number is trustworthy and what you should do next.

## Validates

- [concentration-limit-testing](/queries/concentration-limit-testing.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_credit_portfolio_concentration_monitor_compliance_policy](/tools/lookup-credit-portfolio-concentration-monitor-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Credit Portfolio Concentration Monitor Banking Compliance Policy](/documents/credit-portfolio-concentration-monitor-compliance-policy.md)
