---
type: Workflow Stage
title: Case Data Aggregation
description: "Continuously sync all ER cases, outcomes, and timelines from ServiceNow into BigQuery. Enrich with org hierarchy and demographic data from Workday."
source_id: case_data_aggregation
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Case Data Aggregation

Continuously sync all ER cases, outcomes, and timelines from ServiceNow into BigQuery. Enrich with org hierarchy and demographic data from Workday.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_er_case_analytics_agent_policy_handbook](/tools/lookup-er-case-analytics-agent-policy-handbook.md)
- [action_servicenow_recommend](/tools/action-servicenow-recommend.md)

Next: [Pattern & Trend Analysis](/workflow/pattern-trend-analysis.md)
