---
type: Query Capability
title: "Dispatch IT provisioning, facilities setup, security access, and buddy assign..."
description: "Dispatch IT provisioning, facilities setup, security access, and buddy assignment tasks to ServiceNow and Google Workspace with SLA tracking."
source_id: "cross-functional-orchestration"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Dispatch IT provisioning, facilities setup, security access, and buddy assignment tasks to ServiceNow and Google Workspace with SLA tracking.

## Tools used

- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_pre_boarding_orchestration_agent_policy_handbook](/tools/lookup-pre-boarding-orchestration-agent-policy-handbook.md)
- [action_workday_assign](/tools/action-workday-assign.md)

## Runs in

- [cross_functional_orchestration](/workflow/cross-functional-orchestration.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Pre-boarding Orchestration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/pre-boarding-orchestration-agent-end-to-end.md)

# Citations

- [Pre-boarding Orchestration Agent Policy Handbook](/documents/pre-boarding-orchestration-agent-policy-handbook.md)
