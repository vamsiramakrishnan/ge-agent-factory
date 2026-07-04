---
type: Query Capability
title: Execute query against BigQuery HR data lake. Validate results for reasonablen...
description: "Execute query against BigQuery HR data lake. Validate results for reasonableness and enrich with real-time Workday data where needed."
source_id: "execution-validation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Execute query against BigQuery HR data lake. Validate results for reasonableness and enrich with real-time Workday data where needed.

## Tools used

- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_hr_data_lake_query_policy_handbook](/tools/lookup-hr-data-lake-query-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Runs in

- [execution_validation](/workflow/execution-validation.md)

## Evidence expected

- sql_result
- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the HR Data Lake Query workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/hr-data-lake-query-end-to-end.md)

# Citations

- [HR Data Lake Query Policy Handbook](/documents/hr-data-lake-query-policy-handbook.md)
