---
type: Query Capability
title: "Receive campaign brief with target audience, funnel stage, value proposition,..."
description: "Receive campaign brief with target audience, funnel stage, value proposition, and platform targets. Pull historical creative performance from BigQuery for context."
source_id: "campaign-brief-intake"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive campaign brief with target audience, funnel stage, value proposition, and platform targets. Pull historical creative performance from BigQuery for context.

## Tools used

- [query_google_ads_rsa_performance](/tools/query-google-ads-rsa-performance.md)
- [query_meta_ads_manager_creative_performance](/tools/query-meta-ads-manager-creative-performance.md)
- [query_bigquery_historical_creative_performance](/tools/query-bigquery-historical-creative-performance.md)
- [action_meta_ads_manager_publish_creative](/tools/action-meta-ads-manager-publish-creative.md)
- [evidence_performance_tested_library](/tools/evidence-performance-tested-library.md)

## Runs in

- [campaign_brief_intake](/workflow/campaign-brief-intake.md)

## Evidence expected

- sql_result
- source_system_record
- api_response
- generated_audit_trail
- document_reference

## Evals

- [Generate platform-specific ad copy for a GE industrial software campaign targeting manufacturing CTOs. Brief: Value prop is 30% downtime reduction. Funnel stage: cold acquisition. Provide RSA headlines, Meta social ad text, and LinkedIn professional copy. Set up A/B tests and recommend winners.](/tests/multi-platform-happy-path.md)

# Citations

- [GE Brand Voice & Compliance Policy](/documents/brand-voice-and-compliance-policy.md)
- [Performance-Tested Creative Library](/documents/performance-tested-creative-library.md)
