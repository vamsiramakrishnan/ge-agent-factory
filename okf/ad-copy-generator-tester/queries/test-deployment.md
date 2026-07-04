---
type: Query Capability
title: "Push generated copy variants to ad platforms. Configure A/B tests, track perf..."
description: "Push generated copy variants to ad platforms. Configure A/B tests, track performance metrics, pause underperformers, and scale winning variants automatically."
source_id: "test-deployment"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Push generated copy variants to ad platforms. Configure A/B tests, track performance metrics, pause underperformers, and scale winning variants automatically.

## Tools used

- [query_google_ads_rsa_performance](/tools/query-google-ads-rsa-performance.md)
- [query_meta_ads_manager_creative_performance](/tools/query-meta-ads-manager-creative-performance.md)
- [query_bigquery_historical_creative_performance](/tools/query-bigquery-historical-creative-performance.md)
- [action_google_ads_publish_rsa_variants](/tools/action-google-ads-publish-rsa-variants.md)
- [action_ads_create_ab_test](/tools/action-ads-create-ab-test.md)
- [evidence_performance_tested_library](/tools/evidence-performance-tested-library.md)

## Runs in

- [test_deployment](/workflow/test-deployment.md)

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
