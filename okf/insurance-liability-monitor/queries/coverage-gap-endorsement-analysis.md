---
type: Query Capability
title: "Gemini validates extracted coverage against contract requirements: 'Contract ..."
description: "Gemini validates extracted coverage against contract requirements: 'Contract requires $10M umbrella coverage but COI shows $5M — gap flagged.' Interprets endorsement language: 'Waiver of subrogation endorsement is present but limited to named location — contract requires blanket waiver.'"
source_id: "coverage-gap-endorsement-analysis"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini validates extracted coverage against contract requirements: 'Contract requires $10M umbrella coverage but COI shows $5M — gap flagged.' Interprets endorsement language: 'Waiver of subrogation endorsement is present but limited to named location — contract requires blanket waiver.'

## Tools used

- [query_contract_system_contract_system_records](/tools/query-contract-system-contract-system-records.md)
- [action_insurance_cert_management_validate](/tools/action-insurance-cert-management-validate.md)

## Runs in

- [coverage_gap_endorsement_analysis](/workflow/coverage-gap-endorsement-analysis.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Run the Insurance & Liability Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/insurance-liability-monitor-end-to-end.md)

# Citations

- [Insurance & Liability Monitor Procurement Policy Guide](/documents/insurance-liability-monitor-policy-guide.md)
