---
type: Query Capability
title: "Continuous sync of succession plans, readiness scores, and org changes from W..."
description: "Continuous sync of succession plans, readiness scores, and org changes from Workday into BigQuery pipeline analytics warehouse."
source_id: "pipeline-data-sync"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Continuous sync of succession plans, readiness scores, and org changes from Workday into BigQuery pipeline analytics warehouse.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_succession_pipeline_dashboard_agent_policy_handbook](/tools/lookup-succession-pipeline-dashboard-agent-policy-handbook.md)

## Runs in

- [pipeline_data_sync](/workflow/pipeline-data-sync.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Succession Pipeline Dashboard Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/succession-pipeline-dashboard-agent-end-to-end.md)

# Citations

- [Succession Pipeline Dashboard Agent Policy Handbook](/documents/succession-pipeline-dashboard-agent-policy-handbook.md)
