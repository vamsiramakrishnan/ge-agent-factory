---
type: Workflow Stage
title: "Cross-System Validation"
description: "Validate every payroll input against source systems and business rules. Check for missing timesheets, benefit election mismatches, and garnishment conflicts."
source_id: cross_system_validation
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Cross-System Validation

Validate every payroll input against source systems and business rules. Check for missing timesheets, benefit election mismatches, and garnishment conflicts.

- **Mode:** sequential
- **Stage:** 2 of 3

## Tools

- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [lookup_payroll_input_validation_policy_handbook](/tools/lookup-payroll-input-validation-policy-handbook.md)

Next: [Approval Workflow](/workflow/approval-workflow.md)
