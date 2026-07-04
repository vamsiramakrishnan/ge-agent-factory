---
type: Eval Scenario
title: Run the Requisition Prioritization Agent workflow for the current period. Cit...
description: "Run the Requisition Prioritization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "requisition-prioritization-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Requisition Prioritization Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [req-pool-aggregation](/queries/req-pool-aggregation.md)

## Mechanisms to call

- [query_ats_ats_records](/tools/query-ats-ats-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_requisition_prioritization_agent_policy_handbook](/tools/lookup-requisition-prioritization-agent-policy-handbook.md)
- [action_ats_file](/tools/action-ats-file.md)

## Success rubric

Action file executed against ATS, with audit-trail entry and TA Lead notified of outcomes.

# Citations

- [Requisition Prioritization Agent Policy Handbook](/documents/requisition-prioritization-agent-policy-handbook.md)
