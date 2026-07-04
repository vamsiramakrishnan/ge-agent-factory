---
type: Eval Scenario
title: Run the Org Structure Analyzer workflow for the current period. Cite the rele...
description: "Run the Org Structure Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "org-structure-analyzer-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Org Structure Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [org-data-sync](/queries/org-data-sync.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [query_visio_visio_records](/tools/query-visio-visio-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_org_structure_analyzer_policy_handbook](/tools/lookup-org-structure-analyzer-policy-handbook.md)

## Success rubric

HRBP receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Org Structure Analyzer Policy Handbook](/documents/org-structure-analyzer-policy-handbook.md)
