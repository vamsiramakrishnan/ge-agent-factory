---
type: Query Capability
title: "Pull daily performance data from Google Ads, Meta Ads, and LinkedIn Ads. Aggr..."
description: "Pull daily performance data from Google Ads, Meta Ads, and LinkedIn Ads. Aggregate in BigQuery with lead source attribution from HubSpot."
source_id: "performance-collection"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull daily performance data from Google Ads, Meta Ads, and LinkedIn Ads. Aggregate in BigQuery with lead source attribution from HubSpot.

## Tools used

- [query_google_ads_campaigns](/tools/query-google-ads-campaigns.md)
- [query_meta_ads_campaigns](/tools/query-meta-ads-campaigns.md)
- [query_linkedin_ads_campaigns](/tools/query-linkedin-ads-campaigns.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_paid_media_optimizer_playbook](/tools/lookup-paid-media-optimizer-playbook.md)

## Runs in

- [performance_collection](/workflow/performance-collection.md)

## Evidence expected

- sql_result
- document_reference

## Evals

- [Run the Paid Media Optimizer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/paid-media-optimizer-end-to-end.md)

# Citations

- [Paid Media Optimizer Playbook](/documents/paid-media-optimizer-playbook.md)
