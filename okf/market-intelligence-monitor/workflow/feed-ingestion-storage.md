---
type: Workflow Stage
title: "Feed Ingestion & Storage"
description: "Poll commodity price feeds from Platts, ICIS, and Mintec. Ingest news via Google News API. Aggregate D&B credit alerts. Store all signals in BigQuery time-series tables."
source_id: feed_ingestion_storage
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Feed Ingestion & Storage

Poll commodity price feeds from Platts, ICIS, and Mintec. Ingest news via Google News API. Aggregate D&B credit alerts. Store all signals in BigQuery time-series tables.

- **Mode:** sequential
- **Stage:** 1 of 2

## Tools

- [query_s_p_global_platts_s_p_global_platts_records](/tools/query-s-p-global-platts-s-p-global-platts-records.md)
- [query_icis_icis_records](/tools/query-icis-icis-records.md)
- [query_mintec_mintec_records](/tools/query-mintec-mintec-records.md)
- [query_google_news_api_google_news_api_records](/tools/query-google-news-api-google-news-api-records.md)
- [lookup_market_intelligence_monitor_policy_guide](/tools/lookup-market-intelligence-monitor-policy-guide.md)

Next: [Intelligence Synthesis](/workflow/intelligence-synthesis.md)
