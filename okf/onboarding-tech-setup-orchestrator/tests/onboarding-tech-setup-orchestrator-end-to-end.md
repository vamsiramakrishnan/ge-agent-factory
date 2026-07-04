---
type: Eval Scenario
title: Run the Onboarding Tech Setup Orchestrator workflow for the current period. C...
description: "Run the Onboarding Tech Setup Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "onboarding-tech-setup-orchestrator-end-to-end"
generation_status: inferred
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Onboarding Tech Setup Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [new-hire-context](/queries/new-hire-context.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_okta_users](/tools/query-okta-users.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [query_manageengine_manageengine_records](/tools/query-manageengine-manageengine-records.md)
- [lookup_onboarding_tech_setup_orchestrator_runbook](/tools/lookup-onboarding-tech-setup-orchestrator-runbook.md)
- [action_workday_trigger](/tools/action-workday-trigger.md)

## Success rubric

Action trigger executed against Workday, with audit-trail entry and End User Support Lead notified of outcomes.

# Citations

- [Onboarding Tech Setup Orchestrator Operations Runbook](/documents/onboarding-tech-setup-orchestrator-runbook.md)
