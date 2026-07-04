---
type: Query Capability
title: "Daily sync of org hierarchy, reporting lines, and headcount data from Workday..."
description: "Daily sync of org hierarchy, reporting lines, and headcount data from Workday and SAP SuccessFactors into BigQuery for unified analysis."
source_id: "org-data-sync"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Daily sync of org hierarchy, reporting lines, and headcount data from Workday and SAP SuccessFactors into BigQuery for unified analysis.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_org_structure_analyzer_policy_handbook](/tools/lookup-org-structure-analyzer-policy-handbook.md)

## Runs in

- [org_data_sync](/workflow/org-data-sync.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Org Structure Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/org-structure-analyzer-end-to-end.md)

# Citations

- [Org Structure Analyzer Policy Handbook](/documents/org-structure-analyzer-policy-handbook.md)
