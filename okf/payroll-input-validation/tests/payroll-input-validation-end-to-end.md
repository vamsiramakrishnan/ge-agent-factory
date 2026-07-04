---
type: Eval Scenario
title: Run the Payroll Input Validation workflow for the current period. Cite the re...
description: "Run the Payroll Input Validation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "payroll-input-validation-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Payroll Input Validation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [payroll-data-aggregation](/queries/payroll-data-aggregation.md)

## Mechanisms to call

- [query_adp_adp_records](/tools/query-adp-adp-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [lookup_payroll_input_validation_policy_handbook](/tools/lookup-payroll-input-validation-policy-handbook.md)

## Success rubric

Payroll Manager receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Payroll Input Validation Policy Handbook](/documents/payroll-input-validation-policy-handbook.md)
