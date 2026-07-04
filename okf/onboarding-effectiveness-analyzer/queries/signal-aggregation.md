---
type: Query Capability
title: "Collect survey responses, completion metrics, early performance signals, and ..."
description: "Collect survey responses, completion metrics, early performance signals, and engagement data from Workday. Aggregate into BigQuery analytics warehouse."
source_id: "signal-aggregation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Collect survey responses, completion metrics, early performance signals, and engagement data from Workday. Aggregate into BigQuery analytics warehouse.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_survey_platform_survey_platform_records](/tools/query-survey-platform-survey-platform-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_onboarding_effectiveness_analyzer_policy_handbook](/tools/lookup-onboarding-effectiveness-analyzer-policy-handbook.md)
- [action_workday_recommend](/tools/action-workday-recommend.md)

## Runs in

- [signal_aggregation](/workflow/signal-aggregation.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Onboarding Effectiveness Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/onboarding-effectiveness-analyzer-end-to-end.md)

# Citations

- [Onboarding Effectiveness Analyzer Policy Handbook](/documents/onboarding-effectiveness-analyzer-policy-handbook.md)
