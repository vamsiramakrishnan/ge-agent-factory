---
type: Eval Scenario
title: Run the Feedback Trend Analyzer workflow for the current period. Cite the rel...
description: "Run the Feedback Trend Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "feedback-trend-analyzer-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Feedback Trend Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [feedback-aggregation](/queries/feedback-aggregation.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_lattice_engagement_surveys](/tools/query-lattice-engagement-surveys.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_survey_platform_survey_platform_records](/tools/query-survey-platform-survey-platform-records.md)
- [lookup_feedback_trend_analyzer_policy_handbook](/tools/lookup-feedback-trend-analyzer-policy-handbook.md)
- [action_workday_generate](/tools/action-workday-generate.md)

## Success rubric

Action generate executed against Workday, with audit-trail entry and HRBP notified of outcomes.

# Citations

- [Feedback Trend Analyzer Policy Handbook](/documents/feedback-trend-analyzer-policy-handbook.md)
