---
type: Agent Tool
title: query_slack_email_messages
description: "Retrieve messages from Slack/Email for the Maverick Spend Detector & Nudge workflow."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_slack_email_messages

Retrieve messages from Slack/Email for the Maverick Spend Detector & Nudge workflow.

- **Kind:** query
- **Source system:** [Slack/Email](/systems/slack-email.md)

## Inputs

- lookup_key
- date_range

## Outputs

- messages_records
- messages_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Slack/Email](/systems/slack-email.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [personalized_nudge_generation](/workflow/personalized-nudge-generation.md)
- [nudge_delivery_tracking](/workflow/nudge-delivery-tracking.md)

## Evals

- [Run the Maverick Spend Detector & Nudge workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/maverick-spend-detector-nudge-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- messages_records
- messages_summary

# Examples

```
query_slack_email_messages(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Slack/Email](/systems/slack-email.md)
