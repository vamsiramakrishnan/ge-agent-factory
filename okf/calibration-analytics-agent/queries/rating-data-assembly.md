---
type: Query Capability
title: "Pull proposed ratings, employee demographics, and manager assignment data fro..."
description: "Pull proposed ratings, employee demographics, and manager assignment data from Workday. Combine with historical rating patterns from BigQuery."
source_id: "rating-data-assembly"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull proposed ratings, employee demographics, and manager assignment data from Workday. Combine with historical rating patterns from BigQuery.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_calibration_analytics_agent_policy_handbook](/tools/lookup-calibration-analytics-agent-policy-handbook.md)
- [action_workday_recommend](/tools/action-workday-recommend.md)

## Runs in

- [rating_data_assembly](/workflow/rating-data-assembly.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Calibration Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/calibration-analytics-agent-end-to-end.md)

# Citations

- [Calibration Analytics Agent Policy Handbook](/documents/calibration-analytics-agent-policy-handbook.md)
