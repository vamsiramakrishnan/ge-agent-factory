---
type: Workflow Stage
title: Severity Benchmarking
description: "Compare each open claim's posted reserve_amount and reserve_lines transaction history against BigQuery historical_metrics and analytics_events variance_pct for the matching line_of_business and jurisdiction_state cohort to compute the model-predicted severity gap."
source_id: severity_benchmarking
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Severity Benchmarking

Compare each open claim's posted reserve_amount and reserve_lines transaction history against BigQuery historical_metrics and analytics_events variance_pct for the matching line_of_business and jurisdiction_state cohort to compute the model-predicted severity gap.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_reserve_development_early_warning_monitor_authority_guide](/tools/lookup-reserve-development-early-warning-monitor-authority-guide.md)

Next: [Authority & Referral Gate Check](/workflow/authority-referral-gate-check.md)
