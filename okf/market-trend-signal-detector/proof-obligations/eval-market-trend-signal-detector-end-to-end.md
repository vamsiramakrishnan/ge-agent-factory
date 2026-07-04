---
type: Proof Obligation
title: "Golden eval obligation — Run the Market Trend & Signal Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-market-trend-signal-detector-end-to-end"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Market Trend & Signal Detector workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [market-trend-signal-detector-end-to-end](/tests/market-trend-signal-detector-end-to-end.md)


## Mechanisms

- [query_google_trends_google_trends_records](/tools/query-google-trends-google-trends-records.md)
- [query_semrush_keyword_rankings](/tools/query-semrush-keyword-rankings.md)
- [query_linkedin_linkedin_records](/tools/query-linkedin-linkedin-records.md)
- [query_google_news_api_google_news_api_records](/tools/query-google-news-api-google-news-api-records.md)
- [lookup_market_trend_signal_detector_playbook](/tools/lookup-market-trend-signal-detector-playbook.md)
- [action_google_trends_recommend](/tools/action-google-trends-recommend.md)

## Entities that must be referenced

- google_trends_records
- keyword_rankings
- linkedin_records
- google_news_api_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not execute recommend without two-system evidence

# Citations

- [market-trend-signal-detector-playbook](/documents/market-trend-signal-detector-playbook.md)
