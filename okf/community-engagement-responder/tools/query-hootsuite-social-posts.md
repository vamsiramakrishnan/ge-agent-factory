---
type: Agent Tool
title: query_hootsuite_social_posts
description: Retrieve social posts from Hootsuite for the Community Engagement Responder workflow.
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_hootsuite_social_posts

Retrieve social posts from Hootsuite for the Community Engagement Responder workflow.

- **Kind:** query
- **Source system:** [Hootsuite](/systems/hootsuite.md)

## Inputs

- lookup_key
- date_range

## Outputs

- social_posts_records
- social_posts_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Hootsuite](/systems/hootsuite.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [mention_intake_classification](/workflow/mention-intake-classification.md)
- [publishing_escalation](/workflow/publishing-escalation.md)

## Evals

- [Run the Community Engagement Responder workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/community-engagement-responder-end-to-end.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- social_posts_records
- social_posts_summary

# Examples

```
query_hootsuite_social_posts(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Hootsuite](/systems/hootsuite.md)
