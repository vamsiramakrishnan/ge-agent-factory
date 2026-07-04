---
type: Query Capability
title: "Start date triggers personalized onboarding plan based on role, location, sen..."
description: "Start date triggers personalized onboarding plan based on role, location, seniority, and compliance requirements from Workday."
source_id: "onboarding-plan-generation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Start date triggers personalized onboarding plan based on role, location, seniority, and compliance requirements from Workday.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_onboarding_orchestration_policy_handbook](/tools/lookup-onboarding-orchestration-policy-handbook.md)
- [action_workday_assign](/tools/action-workday-assign.md)

## Runs in

- [onboarding_plan_generation](/workflow/onboarding-plan-generation.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Onboarding Orchestration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/onboarding-orchestration-end-to-end.md)

# Citations

- [Onboarding Orchestration Policy Handbook](/documents/onboarding-orchestration-policy-handbook.md)
