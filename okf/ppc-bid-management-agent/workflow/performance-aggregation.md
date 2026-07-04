---
type: Workflow Stage
title: Performance Aggregation
description: "Pull campaign-level and keyword-level performance from Google Ads and Microsoft Ads. Aggregate in BigQuery with historical bid data and budget pacing."
source_id: performance_aggregation
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Performance Aggregation

Pull campaign-level and keyword-level performance from Google Ads and Microsoft Ads. Aggregate in BigQuery with historical bid data and budget pacing.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_google_ads_campaigns](/tools/query-google-ads-campaigns.md)
- [query_microsoft_ads_microsoft_ads_records](/tools/query-microsoft-ads-microsoft-ads-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_ppc_bid_management_agent_playbook](/tools/lookup-ppc-bid-management-agent-playbook.md)

Next: [Execution & Dashboards](/workflow/execution-dashboards.md)
