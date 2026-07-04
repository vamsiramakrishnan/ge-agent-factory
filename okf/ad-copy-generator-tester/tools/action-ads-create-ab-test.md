---
type: Agent Tool
title: action_ads_create_ab_test
description: Configure A/B tests across platforms with variant assignment and performance tracking setup.
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

# action_ads_create_ab_test

Configure A/B tests across platforms with variant assignment and performance tracking setup.

- **Kind:** action
- **Source system:** [Google Ads](/systems/google-ads.md)

## Inputs

- variant_a_id
- variant_b_id

## Outputs

- ab_test_id
- tracking_setup

## Side Effects

- May change Google Ads state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_ads_create_ab_test](/policies/confirmation-action-ads-create-ab-test.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Google Ads](/systems/google-ads.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [copy_generation_adaptation](/workflow/copy-generation-adaptation.md)
- [test_deployment](/workflow/test-deployment.md)

## Evals

- [Generate platform-specific ad copy for a GE industrial software campaign targeting manufacturing CTOs. Brief: Value prop is 30% downtime reduction. Funnel stage: cold acquisition. Provide RSA headlines, Meta social ad text, and LinkedIn professional copy. Set up A/B tests and recommend winners.](/tests/multi-platform-happy-path.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- variant_a_id
- variant_b_id

## Produces

- ab_test_id
- tracking_setup

# Examples

```
action_ads_create_ab_test(variant_a_id=<variant_a_id>, variant_b_id=<variant_b_id>)
```

# Citations

- [Google Ads](/systems/google-ads.md)
- [Confirmation policy — action_ads_create_ab_test](/policies/confirmation-action-ads-create-ab-test.md)
