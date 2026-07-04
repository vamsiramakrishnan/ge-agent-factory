---
type: Proof Obligation
title: "Golden eval obligation — Generate platform-specific ad copy for a GE industrial software campaign targeting manufacturing CTOs. Brief: Value prop is 30% downtime reduction. Funnel stage: cold acquisition. Provide RSA headlines, Meta social ad text, and LinkedIn professional copy. Set up A/B tests and recommend winners."
description: golden eval proof obligation
source_id: "eval-multi-platform-happy-path"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Generate platform-specific ad copy for a GE industrial software campaign targeting manufacturing CTOs. Brief: Value prop is 30% downtime reduction. Funnel stage: cold acquisition. Provide RSA headlines, Meta social ad text, and LinkedIn professional copy. Set up A/B tests and recommend winners.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [multi-platform-happy-path](/tests/multi-platform-happy-path.md)


## Mechanisms

- [query_bigquery_historical_creative_performance](/tools/query-bigquery-historical-creative-performance.md)
- [query_google_ads_character_limits](/tools/query-google-ads-character-limits.md)
- [query_meta_ads_manager_creative_performance](/tools/query-meta-ads-manager-creative-performance.md)
- [query_linkedin_ads_sponsored_content](/tools/query-linkedin-ads-sponsored-content.md)
- [evidence_brand_voice_compliance](/tools/evidence-brand-voice-compliance.md)
- [evidence_performance_tested_library](/tools/evidence-performance-tested-library.md)
- [action_google_ads_publish_rsa_variants](/tools/action-google-ads-publish-rsa-variants.md)
- [action_meta_ads_manager_publish_creative](/tools/action-meta-ads-manager-publish-creative.md)
- [action_linkedin_ads_publish_sponsored_content](/tools/action-linkedin-ads-publish-sponsored-content.md)
- [action_ads_create_ab_test](/tools/action-ads-create-ab-test.md)

## Entities that must be referenced

- campaign_briefs
- creative_variants
- ab_tests
- historical_performance

## Forbidden behaviors

- do not invent performance metrics
- do not publish copy without brand voice check
- do not exceed character limits

# Citations

- [brand-voice-and-compliance-policy](/documents/brand-voice-and-compliance-policy.md)
- [performance-tested-creative-library](/documents/performance-tested-creative-library.md)
