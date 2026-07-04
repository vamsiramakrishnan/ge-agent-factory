---
type: Query Capability
title: "Poll commodity price feeds from Platts, ICIS, and Mintec. Ingest news via Goo..."
description: "Poll commodity price feeds from Platts, ICIS, and Mintec. Ingest news via Google News API. Aggregate D&B credit alerts. Store all signals in BigQuery time-series tables."
source_id: "feed-ingestion-storage"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Poll commodity price feeds from Platts, ICIS, and Mintec. Ingest news via Google News API. Aggregate D&B credit alerts. Store all signals in BigQuery time-series tables.

## Tools used

- [query_s_p_global_platts_s_p_global_platts_records](/tools/query-s-p-global-platts-s-p-global-platts-records.md)
- [query_icis_icis_records](/tools/query-icis-icis-records.md)
- [query_mintec_mintec_records](/tools/query-mintec-mintec-records.md)
- [query_google_news_api_google_news_api_records](/tools/query-google-news-api-google-news-api-records.md)
- [lookup_market_intelligence_monitor_policy_guide](/tools/lookup-market-intelligence-monitor-policy-guide.md)

## Runs in

- [feed_ingestion_storage](/workflow/feed-ingestion-storage.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Market Intelligence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/market-intelligence-monitor-end-to-end.md)

# Citations

- [Market Intelligence Monitor Procurement Policy Guide](/documents/market-intelligence-monitor-policy-guide.md)
