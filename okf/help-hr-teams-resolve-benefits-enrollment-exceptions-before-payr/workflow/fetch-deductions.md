---
type: Workflow Stage
title: Fetch Deductions
description: Retrieve current benefit deductions and payroll exception reconciliations from BlackLine
source_id: fetch_deductions
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Fetch Deductions

Retrieve current benefit deductions and payroll exception reconciliations from BlackLine

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [query_sap_s_4hana_fi_benefit_enrollments](/tools/query-sap-s-4hana-fi-benefit-enrollments.md)
- [query_sap_s_4hana_fi_payroll_exceptions](/tools/query-sap-s-4hana-fi-payroll-exceptions.md)
- [query_blackline_expense_reports](/tools/query-blackline-expense-reports.md)
- [query_blackline_benefit_deductions](/tools/query-blackline-benefit-deductions.md)
- [action_blackline_update_deduction](/tools/action-blackline-update-deduction.md)

Next: [Analyze & Resolve](/workflow/analyze-resolve.md)
