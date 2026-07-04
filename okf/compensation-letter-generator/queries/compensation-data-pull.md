---
type: Query Capability
title: "Extract individual comp changes including base salary, bonus targets, equity ..."
description: "Extract individual comp changes including base salary, bonus targets, equity grants, and benefits from Workday at comp cycle close."
source_id: "compensation-data-pull"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Extract individual comp changes including base salary, bonus targets, equity grants, and benefits from Workday at comp cycle close.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_compensation_letter_generator_policy_handbook](/tools/lookup-compensation-letter-generator-policy-handbook.md)
- [action_workday_generate](/tools/action-workday-generate.md)

## Runs in

- [compensation_data_pull](/workflow/compensation-data-pull.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Compensation Letter Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/compensation-letter-generator-end-to-end.md)

# Citations

- [Compensation Letter Generator Policy Handbook](/documents/compensation-letter-generator-policy-handbook.md)
