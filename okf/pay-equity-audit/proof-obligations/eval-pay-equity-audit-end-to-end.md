---
type: Proof Obligation
title: "Golden eval obligation — Run the Pay Equity Audit workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-pay-equity-audit-end-to-end"
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

# Golden eval obligation — Run the Pay Equity Audit workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [pay-equity-audit-end-to-end](/tests/pay-equity-audit-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_syndio_syndio_records](/tools/query-syndio-syndio-records.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [lookup_pay_equity_audit_policy_handbook](/tools/lookup-pay-equity-audit-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Entities that must be referenced

- employees
- analytics_events
- syndio_records
- sheets

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute execute without two-system evidence

# Citations

- [pay-equity-audit-policy-handbook](/documents/pay-equity-audit-policy-handbook.md)
