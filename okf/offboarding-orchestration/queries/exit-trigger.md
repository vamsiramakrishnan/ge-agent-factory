---
type: Query Capability
title: Detect termination or resignation event in Workday. Initiate offboarding work...
description: Detect termination or resignation event in Workday. Initiate offboarding workflow with appropriate urgency (voluntary vs. involuntary) and compliance requirements.
source_id: "exit-trigger"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Detect termination or resignation event in Workday. Initiate offboarding workflow with appropriate urgency (voluntary vs. involuntary) and compliance requirements.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_offboarding_orchestration_policy_handbook](/tools/lookup-offboarding-orchestration-policy-handbook.md)
- [action_workday_provision](/tools/action-workday-provision.md)

## Runs in

- [exit_trigger](/workflow/exit-trigger.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Offboarding Orchestration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/offboarding-orchestration-end-to-end.md)

# Citations

- [Offboarding Orchestration Policy Handbook](/documents/offboarding-orchestration-policy-handbook.md)
