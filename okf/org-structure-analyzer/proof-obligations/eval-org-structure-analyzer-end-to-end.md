---
type: Proof Obligation
title: "Golden eval obligation — Run the Org Structure Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-org-structure-analyzer-end-to-end"
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

# Golden eval obligation — Run the Org Structure Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [org-structure-analyzer-end-to-end](/tests/org-structure-analyzer-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_sap_successfactors_employee_records](/tools/query-sap-successfactors-employee-records.md)
- [query_visio_visio_records](/tools/query-visio-visio-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_org_structure_analyzer_policy_handbook](/tools/lookup-org-structure-analyzer-policy-handbook.md)

## Entities that must be referenced

- employees
- employee_records
- visio_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [org-structure-analyzer-policy-handbook](/documents/org-structure-analyzer-policy-handbook.md)
