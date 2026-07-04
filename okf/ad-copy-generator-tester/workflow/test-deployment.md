---
type: Workflow Stage
title: Test Deployment
description: "Push generated copy variants to ad platforms. Configure A/B tests, track performance metrics, pause underperformers, and scale winning variants automatically."
source_id: test_deployment
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Test Deployment

Push generated copy variants to ad platforms. Configure A/B tests, track performance metrics, pause underperformers, and scale winning variants automatically.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_google_ads_rsa_performance](/tools/query-google-ads-rsa-performance.md)
- [query_meta_ads_manager_creative_performance](/tools/query-meta-ads-manager-creative-performance.md)
- [query_bigquery_historical_creative_performance](/tools/query-bigquery-historical-creative-performance.md)
- [action_google_ads_publish_rsa_variants](/tools/action-google-ads-publish-rsa-variants.md)
- [action_ads_create_ab_test](/tools/action-ads-create-ab-test.md)
- [evidence_performance_tested_library](/tools/evidence-performance-tested-library.md)
