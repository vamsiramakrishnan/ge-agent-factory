---
type: Query Capability
title: "Validate multi-jurisdiction tax compliance, regulatory withholding rules, and..."
description: "Validate multi-jurisdiction tax compliance, regulatory withholding rules, and filing deadlines. Gemini generates compliance narrative with risk assessment for each jurisdiction."
source_id: "compliance-validation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Validate multi-jurisdiction tax compliance, regulatory withholding rules, and filing deadlines. Gemini generates compliance narrative with risk assessment for each jurisdiction.

## Tools used

- [query_tax_systems_tax_systems_records](/tools/query-tax-systems-tax-systems-records.md)
- [lookup_payroll_reconciliation_compliance_agent_policy_handbook](/tools/lookup-payroll-reconciliation-compliance-agent-policy-handbook.md)

## Runs in

- [compliance_validation](/workflow/compliance-validation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Payroll Reconciliation & Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/payroll-reconciliation-compliance-agent-end-to-end.md)

# Citations

- [Payroll Reconciliation & Compliance Agent Policy Handbook](/documents/payroll-reconciliation-compliance-agent-policy-handbook.md)
