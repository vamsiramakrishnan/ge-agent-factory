---
type: Query Capability
title: "Conversational intake captures role requirements from hiring managers. Auto-v..."
description: "Conversational intake captures role requirements from hiring managers. Auto-validates against headcount plan, budget, and comp bands from Workday."
source_id: "intake-validation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Conversational intake captures role requirements from hiring managers. Auto-validates against headcount plan, budget, and comp bands from Workday.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_requisition_intake_validation_policy_handbook](/tools/lookup-requisition-intake-validation-policy-handbook.md)

## Runs in

- [intake_validation](/workflow/intake-validation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Requisition Intake & Validation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/requisition-intake-validation-end-to-end.md)

# Citations

- [Requisition Intake & Validation Policy Handbook](/documents/requisition-intake-validation-policy-handbook.md)
