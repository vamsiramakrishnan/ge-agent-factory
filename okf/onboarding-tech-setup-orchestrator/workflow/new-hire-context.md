---
type: Workflow Stage
title: New Hire Context
description: "Pull new hire details from Workday 5 days before start. Determine role, department, team, manager, location, and any special requirements noted in the requisition."
source_id: new_hire_context
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# New Hire Context

Pull new hire details from Workday 5 days before start. Determine role, department, team, manager, location, and any special requirements noted in the requisition.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_workday_employees](/tools/query-workday-employees.md)
- [lookup_onboarding_tech_setup_orchestrator_runbook](/tools/lookup-onboarding-tech-setup-orchestrator-runbook.md)
- [action_workday_trigger](/tools/action-workday-trigger.md)

Next: [Personalized Provisioning](/workflow/personalized-provisioning.md)
