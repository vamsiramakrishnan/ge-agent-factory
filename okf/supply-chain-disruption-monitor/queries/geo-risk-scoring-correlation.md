---
type: Query Capability
title: "Map events to supplier locations and sub-tier dependencies. Weather event sev..."
description: "Map events to supplier locations and sub-tier dependencies. Weather event severity classification, port congestion tracking from AIS data, and impact radius estimation using geo-risk scoring models."
source_id: "geo-risk-scoring-correlation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Map events to supplier locations and sub-tier dependencies. Weather event severity classification, port congestion tracking from AIS data, and impact radius estimation using geo-risk scoring models.

## Tools used

- [query_weather_apis_weather_apis_records](/tools/query-weather-apis-weather-apis-records.md)

## Runs in

- [geo_risk_scoring_correlation](/workflow/geo-risk-scoring-correlation.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Supply Chain Disruption Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/supply-chain-disruption-monitor-end-to-end.md)

# Citations

- [Supply Chain Disruption Monitor Procurement Policy Guide](/documents/supply-chain-disruption-monitor-policy-guide.md)
