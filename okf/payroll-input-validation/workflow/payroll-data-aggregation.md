---
type: Workflow Stage
title: Payroll Data Aggregation
description: "Pull all payroll inputs from Workday (HRIS changes, benefits), ADP (garnishments, tax), and time systems. Build unified pre-run dataset with every input source cross-referenced."
source_id: payroll_data_aggregation
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Payroll Data Aggregation

Pull all payroll inputs from Workday (HRIS changes, benefits), ADP (garnishments, tax), and time systems. Build unified pre-run dataset with every input source cross-referenced.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_adp_adp_records](/tools/query-adp-adp-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_payroll_input_validation_policy_handbook](/tools/lookup-payroll-input-validation-policy-handbook.md)

Next: [Cross-System Validation](/workflow/cross-system-validation.md)
