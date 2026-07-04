---
type: Agent Tool
title: query_linkedin_ads_sponsored_content
description: Retrieve LinkedIn Ads sponsored content performance and professional tone requirements.
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

# query_linkedin_ads_sponsored_content

Retrieve LinkedIn Ads sponsored content performance and professional tone requirements.

- **Kind:** query
- **Source system:** [LinkedIn Ads](/systems/linkedin-ads.md)

## Inputs

- campaign_id

## Outputs

- linkedin_performance
- tone_guidance

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [LinkedIn Ads](/systems/linkedin-ads.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [copy_generation_adaptation](/workflow/copy-generation-adaptation.md)

## Evals

- [Generate platform-specific ad copy for a GE industrial software campaign targeting manufacturing CTOs. Brief: Value prop is 30% downtime reduction. Funnel stage: cold acquisition. Provide RSA headlines, Meta social ad text, and LinkedIn professional copy. Set up A/B tests and recommend winners.](/tests/multi-platform-happy-path.md)

## Evidence emitted

- sql_result
- source_system_record

## Required inputs

- campaign_id

## Produces

- linkedin_performance
- tone_guidance

# Examples

```
query_linkedin_ads_sponsored_content(campaign_id=<campaign_id>)
```

# Citations

- [LinkedIn Ads](/systems/linkedin-ads.md)
