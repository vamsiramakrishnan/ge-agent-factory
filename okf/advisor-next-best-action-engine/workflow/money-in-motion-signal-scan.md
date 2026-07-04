---
type: Workflow Stage
title: "Money-in-Motion Signal Scan"
description: "Poll BigQuery analytics_events and historical_metrics for large cash deposits, maturing CDs, and rollover-eligible 401k balances that outpace the household's cached_aggregates baseline."
source_id: money_in_motion_signal_scan
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Money-in-Motion Signal Scan

Poll BigQuery analytics_events and historical_metrics for large cash deposits, maturing CDs, and rollover-eligible 401k balances that outpace the household's cached_aggregates baseline.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_advisor_next_best_action_engine_compliance_policy](/tools/lookup-advisor-next-best-action-engine-compliance-policy.md)

Next: [Household & Account Context Pull](/workflow/household-account-context-pull.md)
