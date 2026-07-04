---
type: Eval Scenario
title: "Agency 'Palmetto Ridge Agency Partners' has a quote-volume variance_pct of -1..."
description: "Agency 'Palmetto Ridge Agency Partners' has a quote-volume variance_pct of -19.4% in the latest BigQuery analytics_events row, just under the At-Risk band defined in the Agency Segmentation & Re-Engagement Playbook, and the historical_metrics record backing it has a computed_at timestamp 36 hours old. Decide whether to escalate to the Agency Distribution Manager or trigger the next scheduled re-engagement campaign for this agency."
source_id: "agency-production-performance-monitor-stale-threshold-edge"
generation_status: inferred
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Agency 'Palmetto Ridge Agency Partners' has a quote-volume variance_pct of -19.4% in the latest BigQuery analytics_events row, just under the At-Risk band defined in the Agency Segmentation & Re-Engagement Playbook, and the historical_metrics record backing it has a computed_at timestamp 36 hours old. Decide whether to escalate to the Agency Distribution Manager or trigger the next scheduled re-engagement campaign for this agency.

## Validates

- [variance-scoring-against-historical-baseline](/queries/variance-scoring-against-historical-baseline.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_agency_production_performance_monitor_authority_guide](/tools/lookup-agency-production-performance-monitor-authority-guide.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Agency Production Performance Monitor Authority & Referral Guide](/documents/agency-production-performance-monitor-authority-guide.md)
- [Agency Segmentation & Re-Engagement Playbook](/documents/agency-segmentation-reengagement-playbook.md)
