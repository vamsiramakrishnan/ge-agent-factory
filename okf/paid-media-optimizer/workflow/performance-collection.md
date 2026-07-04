---
type: Workflow Stage
title: Performance Collection
description: "Pull daily performance data from Google Ads, Meta Ads, and LinkedIn Ads. Aggregate in BigQuery with lead source attribution from HubSpot."
source_id: performance_collection
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Performance Collection

Pull daily performance data from Google Ads, Meta Ads, and LinkedIn Ads. Aggregate in BigQuery with lead source attribution from HubSpot.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_google_ads_campaigns](/tools/query-google-ads-campaigns.md)
- [query_meta_ads_campaigns](/tools/query-meta-ads-campaigns.md)
- [query_linkedin_ads_campaigns](/tools/query-linkedin-ads-campaigns.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_paid_media_optimizer_playbook](/tools/lookup-paid-media-optimizer-playbook.md)

Next: [Root Cause Diagnosis](/workflow/root-cause-diagnosis.md)
