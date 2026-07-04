---
type: Proof Obligation
title: "Golden eval obligation — Run the Supply Chain Disruption Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-supply-chain-disruption-monitor-end-to-end"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Supply Chain Disruption Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [supply-chain-disruption-monitor-end-to-end](/tests/supply-chain-disruption-monitor-end-to-end.md)


## Mechanisms

- [query_resilinc_resilinc_records](/tools/query-resilinc-resilinc-records.md)
- [query_everstream_everstream_records](/tools/query-everstream-everstream-records.md)
- [query_google_news_api_google_news_api_records](/tools/query-google-news-api-google-news-api-records.md)
- [query_weather_apis_weather_apis_records](/tools/query-weather-apis-weather-apis-records.md)
- [lookup_supply_chain_disruption_monitor_policy_guide](/tools/lookup-supply-chain-disruption-monitor-policy-guide.md)

## Entities that must be referenced

- resilinc_records
- everstream_records
- google_news_api_records
- weather_apis_records
- maritime_ais_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [supply-chain-disruption-monitor-policy-guide](/documents/supply-chain-disruption-monitor-policy-guide.md)
