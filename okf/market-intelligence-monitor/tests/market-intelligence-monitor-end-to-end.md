---
type: Eval Scenario
title: Run the Market Intelligence Monitor workflow for the current period. Cite the...
description: "Run the Market Intelligence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "market-intelligence-monitor-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Market Intelligence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [feed-ingestion-storage](/queries/feed-ingestion-storage.md)

## Mechanisms to call

- [query_s_p_global_platts_s_p_global_platts_records](/tools/query-s-p-global-platts-s-p-global-platts-records.md)
- [query_icis_icis_records](/tools/query-icis-icis-records.md)
- [query_mintec_mintec_records](/tools/query-mintec-mintec-records.md)
- [query_google_news_api_google_news_api_records](/tools/query-google-news-api-google-news-api-records.md)
- [lookup_market_intelligence_monitor_policy_guide](/tools/lookup-market-intelligence-monitor-policy-guide.md)

## Success rubric

Category Manager receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Market Intelligence Monitor Procurement Policy Guide](/documents/market-intelligence-monitor-policy-guide.md)
