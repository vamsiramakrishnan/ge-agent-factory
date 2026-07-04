---
type: Eval Scenario
title: Run the Market Benchmarking Analysis Agent workflow for the current period. C...
description: "Run the Market Benchmarking Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "market-benchmarking-analysis-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Market Benchmarking Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [survey-data-aggregation](/queries/survey-data-aggregation.md)

## Mechanisms to call

- [query_mercer_mercer_records](/tools/query-mercer-mercer-records.md)
- [query_radford_radford_records](/tools/query-radford-radford-records.md)
- [query_payscale_payscale_records](/tools/query-payscale-payscale-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_market_benchmarking_analysis_agent_policy_handbook](/tools/lookup-market-benchmarking-analysis-agent-policy-handbook.md)

## Success rubric

Comp Manager receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Market Benchmarking Analysis Agent Policy Handbook](/documents/market-benchmarking-analysis-agent-policy-handbook.md)
