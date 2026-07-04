---
type: Workflow Stage
title: "Execution & Validation"
description: "Execute query against BigQuery HR data lake. Validate results for reasonableness and enrich with real-time Workday data where needed."
source_id: execution_validation
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Execution & Validation

Execute query against BigQuery HR data lake. Validate results for reasonableness and enrich with real-time Workday data where needed.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_hr_data_lake_query_policy_handbook](/tools/lookup-hr-data-lake-query-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

Next: [Visualization & Export](/workflow/visualization-export.md)
