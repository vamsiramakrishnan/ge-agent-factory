---
type: Eval Scenario
title: Run the Offboarding Orchestration workflow for the current period. Cite the r...
description: "Run the Offboarding Orchestration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "offboarding-orchestration-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Offboarding Orchestration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [exit-trigger](/queries/exit-trigger.md)

## Mechanisms to call

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_active_directory_directory_users](/tools/query-active-directory-directory-users.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_offboarding_orchestration_policy_handbook](/tools/lookup-offboarding-orchestration-policy-handbook.md)
- [action_workday_provision](/tools/action-workday-provision.md)

## Success rubric

Action provision executed against Workday, with audit-trail entry and HR Ops Lead notified of outcomes.

# Citations

- [Offboarding Orchestration Policy Handbook](/documents/offboarding-orchestration-policy-handbook.md)
