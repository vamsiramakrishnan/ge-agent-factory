---
type: Query Capability
title: "Pull campaign-level and keyword-level performance from Google Ads and Microso..."
description: "Pull campaign-level and keyword-level performance from Google Ads and Microsoft Ads. Aggregate in BigQuery with historical bid data and budget pacing."
source_id: "performance-aggregation"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Pull campaign-level and keyword-level performance from Google Ads and Microsoft Ads. Aggregate in BigQuery with historical bid data and budget pacing.

## Tools used

- [query_google_ads_campaigns](/tools/query-google-ads-campaigns.md)
- [query_microsoft_ads_microsoft_ads_records](/tools/query-microsoft-ads-microsoft-ads-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_ppc_bid_management_agent_playbook](/tools/lookup-ppc-bid-management-agent-playbook.md)

## Runs in

- [performance_aggregation](/workflow/performance-aggregation.md)

## Evidence expected

- sql_result
- source_system_record
- document_reference

## Evals

- [Run the PPC Bid Management Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/ppc-bid-management-agent-end-to-end.md)

# Citations

- [PPC Bid Management Agent Playbook](/documents/ppc-bid-management-agent-playbook.md)
