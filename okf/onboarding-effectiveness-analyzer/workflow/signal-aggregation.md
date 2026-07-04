---
type: Workflow Stage
title: Signal Aggregation
description: "Collect survey responses, completion metrics, early performance signals, and engagement data from Workday. Aggregate into BigQuery analytics warehouse."
source_id: signal_aggregation
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Signal Aggregation

Collect survey responses, completion metrics, early performance signals, and engagement data from Workday. Aggregate into BigQuery analytics warehouse.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_survey_platform_survey_platform_records](/tools/query-survey-platform-survey-platform-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_onboarding_effectiveness_analyzer_policy_handbook](/tools/lookup-onboarding-effectiveness-analyzer-policy-handbook.md)
- [action_workday_recommend](/tools/action-workday-recommend.md)

Next: [Effectiveness Scoring](/workflow/effectiveness-scoring.md)
