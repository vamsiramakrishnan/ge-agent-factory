---
type: Agent Tool
title: action_jira_generate
description: Execute the generate step in Jira after the agent has gathered evidence and validated escalation gates.
tags:
  - it
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_jira_generate

Execute the generate step in Jira after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Jira](/systems/jira.md)
- **API:** POST /api/jira/generate

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Jira state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_jira_generate](/policies/confirmation-action-jira-generate.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Jira](/systems/jira.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [kpi_aggregation](/workflow/kpi-aggregation.md)
- [performance_narrative](/workflow/performance-narrative.md)
- [dashboard_publication](/workflow/dashboard-publication.md)

## Evals

- [Run the IT OKR & KPI Dashboard workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/it-okr-kpi-dashboard-end-to-end.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- target_id
- rationale

## Produces

- action_id
- audit_record_id

# Examples

```
action_jira_generate(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Jira](/systems/jira.md)
- [Confirmation policy — action_jira_generate](/policies/confirmation-action-jira-generate.md)
- [Idempotency policy — action_jira_generate](/policies/idempotency-action-jira-generate.md)
