---
type: Workflow Stage
title: Failure Mode Triage
description: "Cross-reference failure_codes and downtime_events for the asset_number to identify the probable failure_mode and failure_mechanism, and check occurrences_ytd for a repeat-failure pattern."
source_id: failure_mode_triage
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Failure Mode Triage

Cross-reference failure_codes and downtime_events for the asset_number to identify the probable failure_mode and failure_mechanism, and check occurrences_ytd for a repeat-failure pattern.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_predictive_asset_failure_monitor_sop](/tools/lookup-predictive-asset-failure-monitor-sop.md)

Next: [SOP & Severity Gate](/workflow/sop-severity-gate.md)
