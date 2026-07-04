---
type: Eval Scenario
title: "Run the Market Trend & Signal Detector workflow for the current period. Cite ..."
description: "Run the Market Trend & Signal Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "market-trend-signal-detector-end-to-end"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Market Trend & Signal Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [multi-signal-collection](/queries/multi-signal-collection.md)

## Mechanisms to call

- [query_google_trends_google_trends_records](/tools/query-google-trends-google-trends-records.md)
- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [query_google_news_api_google_news_api_records](/tools/query-google-news-api-google-news-api-records.md)
- [lookup_market_trend_signal_detector_playbook](/tools/lookup-market-trend-signal-detector-playbook.md)
- [action_google_trends_recommend](/tools/action-google-trends-recommend.md)

## Success rubric

Action recommend executed against Google Trends, with audit-trail entry and Marketing Analyst notified of outcomes.

# Citations

- [Market Trend & Signal Detector Playbook](/documents/market-trend-signal-detector-playbook.md)
