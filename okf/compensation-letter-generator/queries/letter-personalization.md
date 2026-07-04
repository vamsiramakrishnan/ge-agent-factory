---
type: Query Capability
title: Gemini generates personalized total compensation statements with visual break...
description: "Gemini generates personalized total compensation statements with visual breakdowns, contextual messaging, and manager talking points for each employee."
source_id: "letter-personalization"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates personalized total compensation statements with visual breakdowns, contextual messaging, and manager talking points for each employee.

## Tools used

- [lookup_compensation_letter_generator_policy_handbook](/tools/lookup-compensation-letter-generator-policy-handbook.md)
- [action_workday_generate](/tools/action-workday-generate.md)

## Runs in

- [letter_personalization](/workflow/letter-personalization.md)

## Evidence expected

- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Compensation Letter Generator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/compensation-letter-generator-end-to-end.md)

# Citations

- [Compensation Letter Generator Policy Handbook](/documents/compensation-letter-generator-policy-handbook.md)
