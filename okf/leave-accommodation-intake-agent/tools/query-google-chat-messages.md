---
type: Agent Tool
title: query_google_chat_messages
description: "Retrieve messages from Google Chat for the Leave & Accommodation Intake Agent workflow."
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

# query_google_chat_messages

Retrieve messages from Google Chat for the Leave & Accommodation Intake Agent workflow.

- **Kind:** query
- **Source system:** [Google Chat](/systems/google-chat.md)

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

No explicit permission scopes declared; source-system access is tied to [Google Chat](/systems/google-chat.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Leave & Accommodation Intake Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/leave-accommodation-intake-agent-end-to-end.md)

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
query_google_chat_messages(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Google Chat](/systems/google-chat.md)
