---
type: Query Capability
title: "Collect payroll run results and GL entries from ADP. Cross-reference with Wor..."
description: "Collect payroll run results and GL entries from ADP. Cross-reference with Workday compensation records and benefits deductions for complete reconciliation dataset."
source_id: "post-run-collection"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Collect payroll run results and GL entries from ADP. Cross-reference with Workday compensation records and benefits deductions for complete reconciliation dataset.

## Tools used

- [query_adp_adp_records](/tools/query-adp-adp-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_tax_systems_tax_systems_records](/tools/query-tax-systems-tax-systems-records.md)
- [lookup_payroll_reconciliation_compliance_agent_policy_handbook](/tools/lookup-payroll-reconciliation-compliance-agent-policy-handbook.md)
- [action_adp_update](/tools/action-adp-update.md)

## Runs in

- [post_run_collection](/workflow/post-run-collection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Payroll Reconciliation & Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/payroll-reconciliation-compliance-agent-end-to-end.md)

# Citations

- [Payroll Reconciliation & Compliance Agent Policy Handbook](/documents/payroll-reconciliation-compliance-agent-policy-handbook.md)
