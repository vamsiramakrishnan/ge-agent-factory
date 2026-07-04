---
type: Workflow Stage
title: Campaign Brief Intake
description: "Receive campaign brief with target audience, funnel stage, value proposition, and platform targets. Pull historical creative performance from BigQuery for context."
source_id: campaign_brief_intake
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Campaign Brief Intake

Receive campaign brief with target audience, funnel stage, value proposition, and platform targets. Pull historical creative performance from BigQuery for context.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_google_ads_rsa_performance](/tools/query-google-ads-rsa-performance.md)
- [query_meta_ads_manager_creative_performance](/tools/query-meta-ads-manager-creative-performance.md)
- [query_bigquery_historical_creative_performance](/tools/query-bigquery-historical-creative-performance.md)
- [action_meta_ads_manager_publish_creative](/tools/action-meta-ads-manager-publish-creative.md)
- [evidence_performance_tested_library](/tools/evidence-performance-tested-library.md)

Next: [Creative Performance Analysis](/workflow/creative-performance-analysis.md)
