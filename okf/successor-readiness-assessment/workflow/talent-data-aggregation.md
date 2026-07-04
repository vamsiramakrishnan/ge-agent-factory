---
type: Workflow Stage
title: Talent Data Aggregation
description: "Aggregate performance ratings, assessment results, leadership indicators, and career trajectory data from Workday into BigQuery talent warehouse."
source_id: talent_data_aggregation
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Talent Data Aggregation

Aggregate performance ratings, assessment results, leadership indicators, and career trajectory data from Workday into BigQuery talent warehouse.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_assessment_platform_assessment_platform_records](/tools/query-assessment-platform-assessment-platform-records.md)
- [lookup_successor_readiness_assessment_policy_handbook](/tools/lookup-successor-readiness-assessment-policy-handbook.md)

Next: [Potential Modeling & 9-Box](/workflow/potential-modeling-9-box.md)
