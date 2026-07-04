---
type: Proof Obligation
title: "Golden eval obligation — Run the Payroll Input Validation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-payroll-input-validation-end-to-end"
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

# Golden eval obligation — Run the Payroll Input Validation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [payroll-input-validation-end-to-end](/tests/payroll-input-validation-end-to-end.md)


## Mechanisms

- [query_adp_adp_records](/tools/query-adp-adp-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [lookup_payroll_input_validation_policy_handbook](/tools/lookup-payroll-input-validation-policy-handbook.md)

## Entities that must be referenced

- adp_records
- employees
- analytics_events
- sheets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [payroll-input-validation-policy-handbook](/documents/payroll-input-validation-policy-handbook.md)
