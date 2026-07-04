---
type: Workflow Stage
title: "Permit Clock & Emissions Deviation Correlation"
description: "Compute issue_date plus valid_hours for each active permit_records entry to catch permits running past expiration, and cross-check emissions_readings exceedance flags against BigQuery historical_metrics and analytics_events baselines for the same reporting period."
source_id: permit_clock_emissions_deviation_correlation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Permit Clock & Emissions Deviation Correlation

Compute issue_date plus valid_hours for each active permit_records entry to catch permits running past expiration, and cross-check emissions_readings exceedance flags against BigQuery historical_metrics and analytics_events baselines for the same reporting period.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_permit_to_work_compliance_monitor_sop](/tools/lookup-permit-to-work-compliance-monitor-sop.md)

Next: [SOP-Gated Notification & Escalation](/workflow/sop-gated-notification-escalation.md)
