---
type: Query Capability
title: "Gemini reads news articles about tariff changes, geopolitical events, and sup..."
description: "Gemini reads news articles about tariff changes, geopolitical events, and supply disruptions. Reasons about which suppliers and categories are affected even when articles never mention your company. Synthesizes commodity data, news, and supplier geography into actionable briefs."
source_id: "intelligence-synthesis"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini reads news articles about tariff changes, geopolitical events, and supply disruptions. Reasons about which suppliers and categories are affected even when articles never mention your company. Synthesizes commodity data, news, and supplier geography into actionable briefs.

## Tools used

- [query_google_news_api_google_news_api_records](/tools/query-google-news-api-google-news-api-records.md)
- [lookup_market_intelligence_monitor_policy_guide](/tools/lookup-market-intelligence-monitor-policy-guide.md)

## Runs in

- [intelligence_synthesis](/workflow/intelligence-synthesis.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Market Intelligence Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/market-intelligence-monitor-end-to-end.md)

# Citations

- [Market Intelligence Monitor Procurement Policy Guide](/documents/market-intelligence-monitor-policy-guide.md)
