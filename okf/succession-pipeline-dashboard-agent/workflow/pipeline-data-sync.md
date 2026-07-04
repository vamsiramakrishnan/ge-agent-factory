---
type: Workflow Stage
title: Pipeline Data Sync
description: "Continuous sync of succession plans, readiness scores, and org changes from Workday into BigQuery pipeline analytics warehouse."
source_id: pipeline_data_sync
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pipeline Data Sync

Continuous sync of succession plans, readiness scores, and org changes from Workday into BigQuery pipeline analytics warehouse.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_succession_pipeline_dashboard_agent_policy_handbook](/tools/lookup-succession-pipeline-dashboard-agent-policy-handbook.md)

Next: [Executive Dashboard](/workflow/executive-dashboard.md)
