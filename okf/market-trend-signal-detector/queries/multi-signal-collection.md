---
type: Query Capability
title: "Monitor search trends from Google Trends, keyword patterns from SEMrush, Link..."
description: "Monitor search trends from Google Trends, keyword patterns from SEMrush, LinkedIn topic activity, and industry news. Aggregate into unified signal stream."
source_id: "multi-signal-collection"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Monitor search trends from Google Trends, keyword patterns from SEMrush, LinkedIn topic activity, and industry news. Aggregate into unified signal stream.

## Tools used

- [query_google_trends_google_trends_records](/tools/query-google-trends-google-trends-records.md)
- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [query_google_news_api_google_news_api_records](/tools/query-google-news-api-google-news-api-records.md)
- [lookup_market_trend_signal_detector_playbook](/tools/lookup-market-trend-signal-detector-playbook.md)
- [action_google_trends_recommend](/tools/action-google-trends-recommend.md)

## Runs in

- [multi_signal_collection](/workflow/multi-signal-collection.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the Market Trend & Signal Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/market-trend-signal-detector-end-to-end.md)

# Citations

- [Market Trend & Signal Detector Playbook](/documents/market-trend-signal-detector-playbook.md)
