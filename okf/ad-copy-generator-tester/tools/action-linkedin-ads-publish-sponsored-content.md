---
type: Agent Tool
title: action_linkedin_ads_publish_sponsored_content
description: Publish professional ad copy to LinkedIn Ads platform.
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

# action_linkedin_ads_publish_sponsored_content

Publish professional ad copy to LinkedIn Ads platform.

- **Kind:** action
- **Source system:** [LinkedIn Ads](/systems/linkedin-ads.md)
- **API:** POST /systems/linkedin-ads/sponsored-content

## Inputs

- campaign_id
- copy_variant

## Outputs

- sponsored_content_id
- ad_link

## Side Effects

- May change LinkedIn Ads state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_linkedin_ads_publish_sponsored_content](/policies/confirmation-action-linkedin-ads-publish-sponsored-content.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [LinkedIn Ads](/systems/linkedin-ads.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [copy_generation_adaptation](/workflow/copy-generation-adaptation.md)

## Evals

- [Generate platform-specific ad copy for a GE industrial software campaign targeting manufacturing CTOs. Brief: Value prop is 30% downtime reduction. Funnel stage: cold acquisition. Provide RSA headlines, Meta social ad text, and LinkedIn professional copy. Set up A/B tests and recommend winners.](/tests/multi-platform-happy-path.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- campaign_id
- copy_variant

## Produces

- sponsored_content_id
- ad_link

# Examples

```
action_linkedin_ads_publish_sponsored_content(campaign_id=<campaign_id>, copy_variant=<copy_variant>)
```

# Citations

- [LinkedIn Ads](/systems/linkedin-ads.md)
- [Confirmation policy — action_linkedin_ads_publish_sponsored_content](/policies/confirmation-action-linkedin-ads-publish-sponsored-content.md)
