---
type: Query Capability
title: "Multi-step orchestration across ServiceNow, Slack, and Google Workspace. Trai..."
description: "Multi-step orchestration across ServiceNow, Slack, and Google Workspace. Training auto-assigned, buddy paired, team channels joined."
source_id: "task-orchestration"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Multi-step orchestration across ServiceNow, Slack, and Google Workspace. Training auto-assigned, buddy paired, team channels joined.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_onboarding_orchestration_policy_handbook](/tools/lookup-onboarding-orchestration-policy-handbook.md)
- [action_workday_assign](/tools/action-workday-assign.md)

## Runs in

- [task_orchestration](/workflow/task-orchestration.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Onboarding Orchestration workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/onboarding-orchestration-end-to-end.md)

# Citations

- [Onboarding Orchestration Policy Handbook](/documents/onboarding-orchestration-policy-handbook.md)
