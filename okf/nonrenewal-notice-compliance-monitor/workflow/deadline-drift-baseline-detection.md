---
type: Workflow Stage
title: "Deadline Drift & Baseline Detection"
description: "Compare today's candidate list against historical_metrics and analytics_events in BigQuery (query_bigquery_analytics_events) to detect if the defective-notice rate or forced-renewal premium exposure is drifting off the tracked baseline, and prioritize the Compliance Officer's daily queue by days-to-deadline."
source_id: deadline_drift_baseline_detection
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Deadline Drift & Baseline Detection

Compare today's candidate list against historical_metrics and analytics_events in BigQuery (query_bigquery_analytics_events) to detect if the defective-notice rate or forced-renewal premium exposure is drifting off the tracked baseline, and prioritize the Compliance Officer's daily queue by days-to-deadline.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_nonrenewal_notice_compliance_monitor_authority_guide](/tools/lookup-nonrenewal-notice-compliance-monitor-authority-guide.md)

Next: [Notice Drafting & Citation Validation](/workflow/notice-drafting-citation-validation.md)
