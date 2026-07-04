---
type: Query Capability
title: "Ingest headcount, attrition, and financial plan data from Workday, SAP BPC, a..."
description: "Ingest headcount, attrition, and financial plan data from Workday, SAP BPC, and Anaplan. Normalize into a unified workforce data model in BigQuery."
source_id: "data-aggregation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest headcount, attrition, and financial plan data from Workday, SAP BPC, and Anaplan. Normalize into a unified workforce data model in BigQuery.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_bpc_budget_lines](/tools/query-sap-bpc-budget-lines.md)
- [query_anaplan_budget_lines](/tools/query-anaplan-budget-lines.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_workforce_scenario_modeling_policy_handbook](/tools/lookup-workforce-scenario-modeling-policy-handbook.md)

## Runs in

- [data_aggregation](/workflow/data-aggregation.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Workforce Scenario Modeling workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/workforce-scenario-modeling-end-to-end.md)

# Citations

- [Workforce Scenario Modeling Policy Handbook](/documents/workforce-scenario-modeling-policy-handbook.md)
