---
type: Query Capability
title: "Verify discrepancy against the GE Benefits Runbook, auto-sync and resolve und..."
description: "Verify discrepancy against the GE Benefits Runbook, auto-sync and resolve under-threshold discrepancies"
source_id: "analyze-resolve"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Verify discrepancy against the GE Benefits Runbook, auto-sync and resolve under-threshold discrepancies

## Tools used

- [query_sap_s_4hana_fi_benefit_enrollments](/tools/query-sap-s-4hana-fi-benefit-enrollments.md)
- [query_blackline_benefit_deductions](/tools/query-blackline-benefit-deductions.md)
- [lookup_benefits_runbook](/tools/lookup-benefits-runbook.md)
- [action_sap_s_4hana_fi_sync_enrollment](/tools/action-sap-s-4hana-fi-sync-enrollment.md)

## Runs in

- [analyze_resolve](/workflow/analyze-resolve.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Retrieve pre-payroll benefits exceptions for employee EMP101. Verify their enrollment status in SAP S/4HANA FI, retrieve BlackLine wellness expense reports and deductions, check the benefits runbook, and if eligible, resolve the discrepancy under safety thresholds.](/tests/happy-path-reconciliation.md)
- [Evaluate benefits exception EXC102 for Bob Jones (employee ID EMP102). Verify their SAP S/4HANA FI enrollment details and BlackLine premium deductions, and process correction if safe under runbook procedures.](/tests/escalation-high-variance.md)
- [Evaluate benefits exception EXC103 for Charlie Brown (employee ID EMP103). Verify their SAP S/4HANA FI employee record and sync their payroll enrollment if possible.](/tests/refusal-inactive-employee.md)

# Citations

- [GE Benefits Enrollment and Payroll Reconciliation Runbook](/documents/benefits-enrollment-runbook.md)
