---
type: Query Capability
title: "Poll global news feeds, ingest Resilinc and Everstream disruption alerts, cor..."
description: "Poll global news feeds, ingest Resilinc and Everstream disruption alerts, correlate weather event data and maritime AIS signals with supplier locations and shipping lanes."
source_id: "continuous-signal-ingestion"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Poll global news feeds, ingest Resilinc and Everstream disruption alerts, correlate weather event data and maritime AIS signals with supplier locations and shipping lanes.

## Tools used

- [query_resilinc_resilinc_records](/tools/query-resilinc-resilinc-records.md)
- [query_everstream_everstream_records](/tools/query-everstream-everstream-records.md)
- [query_google_news_api_google_news_api_records](/tools/query-google-news-api-google-news-api-records.md)
- [query_weather_apis_weather_apis_records](/tools/query-weather-apis-weather-apis-records.md)
- [lookup_supply_chain_disruption_monitor_policy_guide](/tools/lookup-supply-chain-disruption-monitor-policy-guide.md)

## Runs in

- [continuous_signal_ingestion](/workflow/continuous-signal-ingestion.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Supply Chain Disruption Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supply-chain-disruption-monitor-end-to-end.md)

# Citations

- [Supply Chain Disruption Monitor Procurement Policy Guide](/documents/supply-chain-disruption-monitor-policy-guide.md)
