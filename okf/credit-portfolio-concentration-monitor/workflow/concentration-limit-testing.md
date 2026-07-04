---
type: Workflow Stage
title: Concentration Limit Testing
description: "Compare aggregated exposure against board concentration limits and historical_metrics/analytics_events baselines in BigQuery via query_bigquery_analytics_events to detect sector, geography, and single-name limit breaches."
source_id: concentration_limit_testing
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Concentration Limit Testing

Compare aggregated exposure against board concentration limits and historical_metrics/analytics_events baselines in BigQuery via query_bigquery_analytics_events to detect sector, geography, and single-name limit breaches.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_credit_portfolio_concentration_monitor_compliance_policy](/tools/lookup-credit-portfolio-concentration-monitor-compliance-policy.md)

Next: [Pipeline Deal Simulation](/workflow/pipeline-deal-simulation.md)
