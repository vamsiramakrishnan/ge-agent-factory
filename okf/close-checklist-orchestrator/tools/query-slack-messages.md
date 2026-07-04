---
type: Agent Tool
title: query_slack_messages
description: Retrieve messages from Slack for the Close Checklist Orchestrator workflow.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_slack_messages

Retrieve messages from Slack for the Close Checklist Orchestrator workflow.

- **Kind:** query
- **Source system:** [Slack](/systems/slack.md)

## Inputs

- lookup_key
- date_range

## Outputs

- messages_records
- messages_summary

## Side Effects

- May change Slack state because the spec classifies it as query.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — query_slack_messages](/policies/confirmation-query-slack-messages.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Slack](/systems/slack.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Close Checklist Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/close-checklist-orchestrator-end-to-end.md)

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
- [Confirmation policy — query_slack_messages](/policies/confirmation-query-slack-messages.md)
