---
type: Query Capability
title: "Continuously sync all ER cases, outcomes, and timelines from ServiceNow into ..."
description: "Continuously sync all ER cases, outcomes, and timelines from ServiceNow into BigQuery. Enrich with org hierarchy and demographic data from Workday."
source_id: "case-data-aggregation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Continuously sync all ER cases, outcomes, and timelines from ServiceNow into BigQuery. Enrich with org hierarchy and demographic data from Workday.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_er_case_analytics_agent_policy_handbook](/tools/lookup-er-case-analytics-agent-policy-handbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Runs in

- [case_data_aggregation](/workflow/case-data-aggregation.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the ER Case Analytics Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/er-case-analytics-agent-end-to-end.md)

# Citations

- [ER Case Analytics Agent Policy Handbook](/documents/er-case-analytics-agent-policy-handbook.md)
