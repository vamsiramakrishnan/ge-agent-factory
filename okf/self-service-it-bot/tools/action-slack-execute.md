---
type: Agent Tool
title: action_slack_execute
description: Execute the execute step in Slack after the agent has gathered evidence and validated escalation gates.
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

# action_slack_execute

Execute the execute step in Slack after the agent has gathered evidence and validated escalation gates.

- **Kind:** action
- **Source system:** [Slack](/systems/slack.md)
- **API:** POST /api/slack/execute

## Inputs

- target_id
- rationale

## Outputs

- action_id
- audit_record_id

## Side Effects

- May change Slack state because the spec classifies it as action.

## Idempotency

Declared idempotency key: target_id+rationale.

## Confirmation

- [Confirmation policy — action_slack_execute](/policies/confirmation-action-slack-execute.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Slack](/systems/slack.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [resolution_execution](/workflow/resolution-execution.md)

## Evals

- [Run the Self-Service IT Bot workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/self-service-it-bot-end-to-end.md)

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
action_slack_execute(target_id=<target_id>, rationale=<rationale>)
```

# Citations

- [Slack](/systems/slack.md)
- [Confirmation policy — action_slack_execute](/policies/confirmation-action-slack-execute.md)
- [Idempotency policy — action_slack_execute](/policies/idempotency-action-slack-execute.md)
