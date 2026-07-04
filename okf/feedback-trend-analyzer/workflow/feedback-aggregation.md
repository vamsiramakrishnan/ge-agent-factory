---
type: Workflow Stage
title: Feedback Aggregation
description: "Ingest 360 feedback, pulse surveys, and peer reviews from Lattice and Workday. Normalize and store in BigQuery analytics warehouse."
source_id: feedback_aggregation
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Feedback Aggregation

Ingest 360 feedback, pulse surveys, and peer reviews from Lattice and Workday. Normalize and store in BigQuery analytics warehouse.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_lattice_engagement_surveys](/tools/query-lattice-engagement-surveys.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_survey_platform_survey_platform_records](/tools/query-survey-platform-survey-platform-records.md)
- [lookup_feedback_trend_analyzer_policy_handbook](/tools/lookup-feedback-trend-analyzer-policy-handbook.md)
- [action_workday_generate](/tools/action-workday-generate.md)

Next: [NLP Theme Extraction](/workflow/nlp-theme-extraction.md)
