---
type: Query Capability
title: Validate every payroll input against source systems and business rules. Check...
description: "Validate every payroll input against source systems and business rules. Check for missing timesheets, benefit election mismatches, and garnishment conflicts."
source_id: "cross-system-validation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Validate every payroll input against source systems and business rules. Check for missing timesheets, benefit election mismatches, and garnishment conflicts.

## Tools used

- [query_google_sheets_sheets](/tools/query-google-sheets-sheets.md)
- [lookup_payroll_input_validation_policy_handbook](/tools/lookup-payroll-input-validation-policy-handbook.md)

## Runs in

- [cross_system_validation](/workflow/cross-system-validation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Payroll Input Validation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/payroll-input-validation-end-to-end.md)

# Citations

- [Payroll Input Validation Policy Handbook](/documents/payroll-input-validation-policy-handbook.md)
