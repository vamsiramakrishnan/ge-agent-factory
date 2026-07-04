---
type: Agent Tool
title: query_slack_messages
description: "Retrieve messages from Slack for the DEI Communication & Programming Assistant workflow."
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

# query_slack_messages

Retrieve messages from Slack for the DEI Communication & Programming Assistant workflow.

- **Kind:** query
- **Source system:** [Slack](/systems/slack.md)

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

No explicit permission scopes declared; source-system access is tied to [Slack](/systems/slack.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [distribution_impact_tracking](/workflow/distribution-impact-tracking.md)

## Evals

- [Run the DEI Communication & Programming Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/dei-communication-programming-assistant-end-to-end.md)

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
query_slack_messages(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Slack](/systems/slack.md)
