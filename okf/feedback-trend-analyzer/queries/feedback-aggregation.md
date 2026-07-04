---
type: Query Capability
title: "Ingest 360 feedback, pulse surveys, and peer reviews from Lattice and Workday..."
description: "Ingest 360 feedback, pulse surveys, and peer reviews from Lattice and Workday. Normalize and store in BigQuery analytics warehouse."
source_id: "feedback-aggregation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest 360 feedback, pulse surveys, and peer reviews from Lattice and Workday. Normalize and store in BigQuery analytics warehouse.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_lattice_engagement_surveys](/tools/query-lattice-engagement-surveys.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_survey_platform_survey_platform_records](/tools/query-survey-platform-survey-platform-records.md)
- [lookup_feedback_trend_analyzer_policy_handbook](/tools/lookup-feedback-trend-analyzer-policy-handbook.md)
- [action_workday_generate](/tools/action-workday-generate.md)

## Runs in

- [feedback_aggregation](/workflow/feedback-aggregation.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Feedback Trend Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/feedback-trend-analyzer-end-to-end.md)

# Citations

- [Feedback Trend Analyzer Policy Handbook](/documents/feedback-trend-analyzer-policy-handbook.md)
