---
type: Agent Tool
title: query_sprout_social_social_posts
description: "Retrieve social posts from Sprout Social for the Influencer Discovery & Tracking workflow."
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

# query_sprout_social_social_posts

Retrieve social posts from Sprout Social for the Influencer Discovery & Tracking workflow.

- **Kind:** query
- **Source system:** [Sprout Social](/systems/sprout-social.md)

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

No explicit permission scopes declared; source-system access is tied to [Sprout Social](/systems/sprout-social.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [influencer_discovery](/workflow/influencer-discovery.md)

## Evals

- [Run the Influencer Discovery & Tracking workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/influencer-discovery-tracking-end-to-end.md)

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
query_sprout_social_social_posts(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [Sprout Social](/systems/sprout-social.md)
