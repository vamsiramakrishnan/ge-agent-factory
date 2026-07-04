---
type: Proof Obligation
title: "Golden eval obligation — Retrieve pre-payroll benefits exceptions for employee EMP101. Verify their enrollment status in SAP S/4HANA FI, retrieve BlackLine wellness expense reports and deductions, check the benefits runbook, and if eligible, resolve the discrepancy under safety thresholds."
description: golden eval proof obligation
source_id: "eval-happy-path-reconciliation"
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

# Golden eval obligation — Retrieve pre-payroll benefits exceptions for employee EMP101. Verify their enrollment status in SAP S/4HANA FI, retrieve BlackLine wellness expense reports and deductions, check the benefits runbook, and if eligible, resolve the discrepancy under safety thresholds.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [happy-path-reconciliation](/tests/happy-path-reconciliation.md)


## Mechanisms

- [query_sap_s_4hana_fi_employees](/tools/query-sap-s-4hana-fi-employees.md)
- [query_sap_s_4hana_fi_benefit_enrollments](/tools/query-sap-s-4hana-fi-benefit-enrollments.md)
- [query_sap_s_4hana_fi_payroll_exceptions](/tools/query-sap-s-4hana-fi-payroll-exceptions.md)
- [query_blackline_expense_reports](/tools/query-blackline-expense-reports.md)
- [query_blackline_benefit_deductions](/tools/query-blackline-benefit-deductions.md)
- [lookup_benefits_runbook](/tools/lookup-benefits-runbook.md)
- [action_blackline_update_deduction](/tools/action-blackline-update-deduction.md)
- [action_sap_s_4hana_fi_sync_enrollment](/tools/action-sap-s-4hana-fi-sync-enrollment.md)

## Entities that must be referenced

- employees
- benefit_enrollments
- payroll_exceptions
- expense_reports
- benefit_deductions

## Forbidden behaviors

- Do not run action_blackline_update_deduction before checking query_sap_s_4hana_fi_employees first
- Do not bypass runbook rules lookup

# Citations

- [benefits-enrollment-runbook](/documents/benefits-enrollment-runbook.md)
