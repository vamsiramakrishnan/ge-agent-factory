---
type: Eval Scenario
title: Run the Supply Chain Disruption Monitor workflow for the current period. Cite...
description: "Run the Supply Chain Disruption Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "supply-chain-disruption-monitor-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Supply Chain Disruption Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [continuous-signal-ingestion](/queries/continuous-signal-ingestion.md)

## Mechanisms to call

- [query_resilinc_resilinc_records](/tools/query-resilinc-resilinc-records.md)
- [query_everstream_everstream_records](/tools/query-everstream-everstream-records.md)
- [query_google_news_api_google_news_api_records](/tools/query-google-news-api-google-news-api-records.md)
- [query_weather_apis_weather_apis_records](/tools/query-weather-apis-weather-apis-records.md)
- [lookup_supply_chain_disruption_monitor_policy_guide](/tools/lookup-supply-chain-disruption-monitor-policy-guide.md)

## Success rubric

Supply Chain Lead receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Supply Chain Disruption Monitor Procurement Policy Guide](/documents/supply-chain-disruption-monitor-policy-guide.md)
