---
type: Eval Scenario
title: "Retrieve pre-payroll benefits exceptions for employee EMP101. Verify their en..."
description: "Retrieve pre-payroll benefits exceptions for employee EMP101. Verify their enrollment status in SAP S/4HANA FI, retrieve BlackLine wellness expense reports and deductions, check the benefits runbook, and if eligible, resolve the discrepancy under safety thresholds."
source_id: "happy-path-reconciliation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Retrieve pre-payroll benefits exceptions for employee EMP101. Verify their enrollment status in SAP S/4HANA FI, retrieve BlackLine wellness expense reports and deductions, check the benefits runbook, and if eligible, resolve the discrepancy under safety thresholds.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_sap_s_4hana_fi_employees](/tools/query-sap-s-4hana-fi-employees.md)
- [query_sap_s_4hana_fi_benefit_enrollments](/tools/query-sap-s-4hana-fi-benefit-enrollments.md)
- [query_sap_s_4hana_fi_payroll_exceptions](/tools/query-sap-s-4hana-fi-payroll-exceptions.md)
- [query_blackline_expense_reports](/tools/query-blackline-expense-reports.md)
- [query_blackline_benefit_deductions](/tools/query-blackline-benefit-deductions.md)
- [lookup_benefits_runbook](/tools/lookup-benefits-runbook.md)
- [action_blackline_update_deduction](/tools/action-blackline-update-deduction.md)
- [action_sap_s_4hana_fi_sync_enrollment](/tools/action-sap-s-4hana-fi-sync-enrollment.md)

## Success rubric

Active wellness deduction updated in BlackLine and SAP S/4HANA FI exception EXC101 resolved with auditable ID.

# Citations

- [GE Benefits Enrollment and Payroll Reconciliation Runbook](/documents/benefits-enrollment-runbook.md)
