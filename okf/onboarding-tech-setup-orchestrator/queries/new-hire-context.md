---
type: Query Capability
title: "Pull new hire details from Workday 5 days before start. Determine role, depar..."
description: "Pull new hire details from Workday 5 days before start. Determine role, department, team, manager, location, and any special requirements noted in the requisition."
source_id: "new-hire-context"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull new hire details from Workday 5 days before start. Determine role, department, team, manager, location, and any special requirements noted in the requisition.

## Tools used

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_onboarding_tech_setup_orchestrator_runbook](/tools/lookup-onboarding-tech-setup-orchestrator-runbook.md)
- [action_workday_trigger](/tools/action-workday-trigger.md)

## Runs in

- [new_hire_context](/workflow/new-hire-context.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Onboarding Tech Setup Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/onboarding-tech-setup-orchestrator-end-to-end.md)

# Citations

- [Onboarding Tech Setup Orchestrator Operations Runbook](/documents/onboarding-tech-setup-orchestrator-runbook.md)
