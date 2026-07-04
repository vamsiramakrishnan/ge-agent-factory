---
type: Query Capability
title: "Validate employee eligibility against FMLA, ADA, and jurisdiction-specific le..."
description: "Validate employee eligibility against FMLA, ADA, and jurisdiction-specific leave regulations using Workday employment data and AbsenceSoft rules."
source_id: "eligibility-pre-screening"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Validate employee eligibility against FMLA, ADA, and jurisdiction-specific leave regulations using Workday employment data and AbsenceSoft rules.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_leave_accommodation_intake_agent_policy_handbook](/tools/lookup-leave-accommodation-intake-agent-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Runs in

- [eligibility_pre_screening](/workflow/eligibility-pre-screening.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Leave & Accommodation Intake Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/leave-accommodation-intake-agent-end-to-end.md)

# Citations

- [Leave & Accommodation Intake Agent Policy Handbook](/documents/leave-accommodation-intake-agent-policy-handbook.md)
