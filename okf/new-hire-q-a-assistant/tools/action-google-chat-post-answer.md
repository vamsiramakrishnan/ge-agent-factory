---
type: Agent Tool
title: action_google_chat_post_answer
description: "Post the cited answer back to the new-hire's Google Chat thread, tagging the source confluence page and noting any unresolved follow-up needed from a human partner."
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

# action_google_chat_post_answer

Post the cited answer back to the new-hire's Google Chat thread, tagging the source confluence page and noting any unresolved follow-up needed from a human partner.

- **Kind:** action
- **Source system:** [Google Chat](/systems/google-chat.md)
- **API:** POST /v1/spaces/{space_id}/messages

## Inputs

- thread_id
- answer_text
- citation_anchors

## Outputs

- chat_message_id
- delivery_receipt

## Side Effects

- May change Google Chat state because the spec classifies it as action.

## Idempotency

Declared idempotency key: thread_id+answer_hash.

## Confirmation

- [Confirmation policy — action_google_chat_post_answer](/policies/confirmation-action-google-chat-post-answer.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Chat](/systems/google-chat.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [knowledge_indexing](/workflow/knowledge-indexing.md)
- [contextual_answer_generation](/workflow/contextual-answer-generation.md)
- [learning_escalation](/workflow/learning-escalation.md)

## Evals

_No eval scenario explicitly exercises this tool._

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- thread_id
- answer_text
- citation_anchors

## Produces

- chat_message_id
- delivery_receipt

# Examples

```
action_google_chat_post_answer(thread_id=<thread_id>, answer_text=<answer_text>, citation_anchors=<citation_anchors>)
```

# Citations

- [Google Chat](/systems/google-chat.md)
- [Confirmation policy — action_google_chat_post_answer](/policies/confirmation-action-google-chat-post-answer.md)
- [Idempotency policy — action_google_chat_post_answer](/policies/idempotency-action-google-chat-post-answer.md)
