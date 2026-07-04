---
type: Agent Tool
title: action_slack_notify_okr_owner
description: "Notify the OKR owner in Slack when a key result is detected as stalled or off-track, attaching the cited Jira/Workday evidence and the recommended next action."
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# action_slack_notify_okr_owner

Notify the OKR owner in Slack when a key result is detected as stalled or off-track, attaching the cited Jira/Workday evidence and the recommended next action.

- **Kind:** action
- **Source system:** [Slack](/systems/slack.md)
- **API:** POST /api/chat.postMessage

## Inputs

- owner_user_id
- objective_id
- evidence_links

## Outputs

- slack_message_id
- delivery_receipt

## Side Effects

- May change Slack state because the spec classifies it as action.

## Idempotency

Declared idempotency key: owner_user_id+objective_id+digest_hash.

## Confirmation

- [Confirmation policy — action_slack_notify_okr_owner](/policies/confirmation-action-slack-notify-okr-owner.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Slack](/systems/slack.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- owner_user_id
- objective_id
- evidence_links

## Produces

- slack_message_id
- delivery_receipt

# Examples

```
action_slack_notify_okr_owner(owner_user_id=<owner_user_id>, objective_id=<objective_id>, evidence_links=<evidence_links>)
```

# Citations

- [Slack](/systems/slack.md)
- [Confirmation policy — action_slack_notify_okr_owner](/policies/confirmation-action-slack-notify-okr-owner.md)
- [Idempotency policy — action_slack_notify_okr_owner](/policies/idempotency-action-slack-notify-okr-owner.md)
