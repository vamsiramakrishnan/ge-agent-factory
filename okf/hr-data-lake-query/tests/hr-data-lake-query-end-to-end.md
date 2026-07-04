---
type: Eval Scenario
title: Run the HR Data Lake Query workflow for the current period. Cite the relevant...
description: "Run the HR Data Lake Query workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "hr-data-lake-query-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the HR Data Lake Query workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [execution-validation](/queries/execution-validation.md)

## Mechanisms to call

- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_google_cloud_billing_records](/tools/query-google-cloud-billing-records.md)
- [lookup_hr_data_lake_query_policy_handbook](/tools/lookup-hr-data-lake-query-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Success rubric

Action execute executed against Workday, with audit-trail entry and People Analyst notified of outcomes.

# Citations

- [HR Data Lake Query Policy Handbook](/documents/hr-data-lake-query-policy-handbook.md)
