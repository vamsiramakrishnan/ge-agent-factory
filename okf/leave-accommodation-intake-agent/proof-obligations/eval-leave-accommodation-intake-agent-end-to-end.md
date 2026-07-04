---
type: Proof Obligation
title: "Golden eval obligation — Run the Leave & Accommodation Intake Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-leave-accommodation-intake-agent-end-to-end"
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

# Golden eval obligation — Run the Leave & Accommodation Intake Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [leave-accommodation-intake-agent-end-to-end](/tests/leave-accommodation-intake-agent-end-to-end.md)


## Mechanisms

- [query_workday_employees](/tools/query-workday-employees.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [query_google_chat_messages](/tools/query-google-chat-messages.md)
- [lookup_leave_accommodation_intake_agent_policy_handbook](/tools/lookup-leave-accommodation-intake-agent-policy-handbook.md)
- [action_workday_execute](/tools/action-workday-execute.md)

## Entities that must be referenced

- employees
- tickets
- messages

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute execute without two-system evidence

# Citations

- [leave-accommodation-intake-agent-policy-handbook](/documents/leave-accommodation-intake-agent-policy-handbook.md)
