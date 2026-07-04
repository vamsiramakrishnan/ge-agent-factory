---
type: Workflow Stage
title: Signal Collection
description: "Aggregate performance data, 360 feedback, learning velocity, and project impact signals from Workday. Combine with assessment results in BigQuery."
source_id: signal_collection
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Signal Collection

Aggregate performance data, 360 feedback, learning velocity, and project impact signals from Workday. Combine with assessment results in BigQuery.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_360_platform_360_platform_records](/tools/query-360-platform-360-platform-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_hipo_identification_nomination_agent_policy_handbook](/tools/lookup-hipo-identification-nomination-agent-policy-handbook.md)

Next: [HiPo Scoring & Bias Adjustment](/workflow/hi-po-scoring-bias-adjustment.md)
