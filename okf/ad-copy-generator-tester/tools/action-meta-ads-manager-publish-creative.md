---
type: Agent Tool
title: action_meta_ads_manager_publish_creative
description: Publish creative variants to Meta Ads Manager for social platform deployment.
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

# action_meta_ads_manager_publish_creative

Publish creative variants to Meta Ads Manager for social platform deployment.

- **Kind:** action
- **Source system:** [Meta Ads Manager](/systems/meta-ads-manager.md)
- **API:** POST /systems/meta-ads/creative

## Inputs

- campaign_id
- creative_content

## Outputs

- creative_ids
- ad_link

## Side Effects

- May change Meta Ads Manager state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_meta_ads_manager_publish_creative](/policies/confirmation-action-meta-ads-manager-publish-creative.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Meta Ads Manager](/systems/meta-ads-manager.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [campaign_brief_intake](/workflow/campaign-brief-intake.md)
- [creative_performance_analysis](/workflow/creative-performance-analysis.md)

## Evals

- [Generate platform-specific ad copy for a GE industrial software campaign targeting manufacturing CTOs. Brief: Value prop is 30% downtime reduction. Funnel stage: cold acquisition. Provide RSA headlines, Meta social ad text, and LinkedIn professional copy. Set up A/B tests and recommend winners.](/tests/multi-platform-happy-path.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- campaign_id
- creative_content

## Produces

- creative_ids
- ad_link

# Examples

```
action_meta_ads_manager_publish_creative(campaign_id=<campaign_id>, creative_content=<creative_content>)
```

# Citations

- [Meta Ads Manager](/systems/meta-ads-manager.md)
- [Confirmation policy — action_meta_ads_manager_publish_creative](/policies/confirmation-action-meta-ads-manager-publish-creative.md)
