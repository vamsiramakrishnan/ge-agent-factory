---
type: Query Capability
title: "Generate plain-language answer with exact policy citations. Route complex sce..."
description: "Generate plain-language answer with exact policy citations. Route complex scenarios to ER team with pre-assembled context for expedited human review."
source_id: "answer-escalation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate plain-language answer with exact policy citations. Route complex scenarios to ER team with pre-assembled context for expedited human review.

## Tools used

- [lookup_policy_q_a_assistant_policy_handbook](/tools/lookup-policy-q-a-assistant-policy-handbook.md)

## Runs in

- [answer_escalation](/workflow/answer-escalation.md)

## Evidence expected

- document_reference

## Evals

- [Run the Policy Q&A Assistant workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/policy-q-a-assistant-end-to-end.md)

# Citations

- [Policy Q&A Assistant Policy Handbook](/documents/policy-q-a-assistant-policy-handbook.md)
