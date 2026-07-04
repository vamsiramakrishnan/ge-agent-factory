---
type: Eval Scenario
title: Run the ER Case Intelligence workflow for the current period. Cite the releva...
description: "Run the ER Case Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "er-case-intelligence-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the ER Case Intelligence workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [case-intake-classification](/queries/case-intake-classification.md)

## Mechanisms to call

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_legal_db_legal_db_records](/tools/query-legal-db-legal-db-records.md)
- [lookup_er_case_intelligence_policy_handbook](/tools/lookup-er-case-intelligence-policy-handbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

## Success rubric

Action recommend executed against ServiceNow, with audit-trail entry and ER Lead notified of outcomes.

# Citations

- [ER Case Intelligence Policy Handbook](/documents/er-case-intelligence-policy-handbook.md)
