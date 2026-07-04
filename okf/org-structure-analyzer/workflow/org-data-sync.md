---
type: Workflow Stage
title: Org Data Sync
description: "Daily sync of org hierarchy, reporting lines, and headcount data from Workday and SAP SuccessFactors into BigQuery for unified analysis."
source_id: org_data_sync
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Org Data Sync

Daily sync of org hierarchy, reporting lines, and headcount data from Workday and SAP SuccessFactors into BigQuery for unified analysis.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_org_structure_analyzer_policy_handbook](/tools/lookup-org-structure-analyzer-policy-handbook.md)

Next: [Spans & Layers Analysis](/workflow/spans-layers-analysis.md)
