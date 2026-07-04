---
type: Eval Scenario
title: Run the Onboarding Effectiveness Analyzer workflow for the current period. Ci...
description: "Run the Onboarding Effectiveness Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "onboarding-effectiveness-analyzer-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Onboarding Effectiveness Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [signal-aggregation](/queries/signal-aggregation.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [query_survey_platform_survey_platform_records](/tools/query-survey-platform-survey-platform-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_onboarding_effectiveness_analyzer_policy_handbook](/tools/lookup-onboarding-effectiveness-analyzer-policy-handbook.md)
- [action_workday_recommend](/tools/action-workday-recommend.md)

## Success rubric

Action recommend executed against Workday, with audit-trail entry and HR Ops Lead notified of outcomes.

# Citations

- [Onboarding Effectiveness Analyzer Policy Handbook](/documents/onboarding-effectiveness-analyzer-policy-handbook.md)
