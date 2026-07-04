---
type: Workflow Stage
title: "Coverage Gap & Endorsement Analysis"
description: "Gemini validates extracted coverage against contract requirements: 'Contract requires $10M umbrella coverage but COI shows $5M — gap flagged.' Interprets endorsement language: 'Waiver of subrogation endorsement is present but limited to named location — contract requires blanket waiver.'"
source_id: coverage_gap_endorsement_analysis
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Coverage Gap & Endorsement Analysis

Gemini validates extracted coverage against contract requirements: 'Contract requires $10M umbrella coverage but COI shows $5M — gap flagged.' Interprets endorsement language: 'Waiver of subrogation endorsement is present but limited to named location — contract requires blanket waiver.'

- **Mode:** sequential
- **Stage:** 3 of 3

## Tools

- [query_contract_system_contract_system_records](/tools/query-contract-system-contract-system-records.md)
- [action_insurance_cert_management_validate](/tools/action-insurance-cert-management-validate.md)
