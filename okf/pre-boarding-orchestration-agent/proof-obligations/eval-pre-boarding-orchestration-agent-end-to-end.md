---
type: Proof Obligation
title: "Golden eval obligation — Run the Pre-boarding Orchestration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-pre-boarding-orchestration-agent-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Pre-boarding Orchestration Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [pre-boarding-orchestration-agent-end-to-end](/tests/pre-boarding-orchestration-agent-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_google_workspace_accounts](/tools/query-google-workspace-accounts.md)
- [lookup_pre_boarding_orchestration_agent_policy_handbook](/tools/lookup-pre-boarding-orchestration-agent-policy-handbook.md)
- [action_workday_assign](/tools/action-workday-assign.md)

## Entities that must be referenced

- employees
- tickets
- messages
- accounts

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute assign without two-system evidence

# Citations

- [pre-boarding-orchestration-agent-policy-handbook](/documents/pre-boarding-orchestration-agent-policy-handbook.md)
