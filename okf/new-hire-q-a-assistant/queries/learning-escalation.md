---
type: Query Capability
title: Track interaction patterns to improve response quality. Route complex or unan...
description: Track interaction patterns to improve response quality. Route complex or unanswered questions to HR with full conversation context.
source_id: "learning-escalation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Track interaction patterns to improve response quality. Route complex or unanswered questions to HR with full conversation context.

## Tools used

- [action_google_chat_post_answer](/tools/action-google-chat-post-answer.md)

## Runs in

- [learning_escalation](/workflow/learning-escalation.md)

## Evidence expected

- api_response
- generated_audit_trail

## Evals

- [Run the New Hire Q&A Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/new-hire-q-a-assistant-end-to-end.md)

# Citations

- [New Hire Q&A Assistant Policy Handbook](/documents/new-hire-q-a-assistant-policy-handbook.md)
