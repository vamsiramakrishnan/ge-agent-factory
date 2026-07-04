---
type: Query Capability
title: "Pull all payroll inputs from Workday (HRIS changes, benefits), ADP (garnishme..."
description: "Pull all payroll inputs from Workday (HRIS changes, benefits), ADP (garnishments, tax), and time systems. Build unified pre-run dataset with every input source cross-referenced."
source_id: "payroll-data-aggregation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull all payroll inputs from Workday (HRIS changes, benefits), ADP (garnishments, tax), and time systems. Build unified pre-run dataset with every input source cross-referenced.

## Tools used

- [query_adp_adp_records](/tools/query-adp-adp-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_payroll_input_validation_policy_handbook](/tools/lookup-payroll-input-validation-policy-handbook.md)

## Runs in

- [payroll_data_aggregation](/workflow/payroll-data-aggregation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Payroll Input Validation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/payroll-input-validation-end-to-end.md)

# Citations

- [Payroll Input Validation Policy Handbook](/documents/payroll-input-validation-policy-handbook.md)
