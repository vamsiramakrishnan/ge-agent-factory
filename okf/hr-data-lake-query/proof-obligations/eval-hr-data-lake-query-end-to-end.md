---
type: Proof Obligation
title: "Golden eval obligation — Run the HR Data Lake Query workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-hr-data-lake-query-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the HR Data Lake Query workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [hr-data-lake-query-end-to-end](/tests/hr-data-lake-query-end-to-end.md)


## Mechanisms

- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [query_google_cloud_billing_records](/tools/query-google-cloud-billing-records.md)
- [lookup_hr_data_lake_query_policy_handbook](/tools/lookup-hr-data-lake-query-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Entities that must be referenced

- analytics_events
- employees
- dashboards
- billing_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute execute without two-system evidence

# Citations

- [hr-data-lake-query-policy-handbook](/documents/hr-data-lake-query-policy-handbook.md)
