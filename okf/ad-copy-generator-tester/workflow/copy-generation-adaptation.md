---
type: Workflow Stage
title: "Copy Generation & Adaptation"
description: "Gemini generates platform-specific ad copy fitting constraints (Google RSA limits, LinkedIn professional tone). Adapts messaging for different audience segments and funnel stages."
source_id: copy_generation_adaptation
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Copy Generation & Adaptation

Gemini generates platform-specific ad copy fitting constraints (Google RSA limits, LinkedIn professional tone). Adapts messaging for different audience segments and funnel stages.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_google_ads_rsa_performance](/tools/query-google-ads-rsa-performance.md)
- [query_google_ads_character_limits](/tools/query-google-ads-character-limits.md)
- [query_linkedin_ads_sponsored_content](/tools/query-linkedin-ads-sponsored-content.md)
- [action_google_ads_publish_rsa_variants](/tools/action-google-ads-publish-rsa-variants.md)
- [action_linkedin_ads_publish_sponsored_content](/tools/action-linkedin-ads-publish-sponsored-content.md)
- [action_ads_create_ab_test](/tools/action-ads-create-ab-test.md)
- [evidence_brand_voice_compliance](/tools/evidence-brand-voice-compliance.md)

Next: [Test Deployment](/workflow/test-deployment.md)
