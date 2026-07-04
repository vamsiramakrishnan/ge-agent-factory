---
type: Proof Obligation
title: "Golden eval obligation — Run the Market Benchmarking Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-market-benchmarking-analysis-agent-end-to-end"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Market Benchmarking Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [market-benchmarking-analysis-agent-end-to-end](/tests/market-benchmarking-analysis-agent-end-to-end.md)


## Mechanisms

- [query_mercer_mercer_records](/tools/query-mercer-mercer-records.md)
- [query_radford_radford_records](/tools/query-radford-radford-records.md)
- [query_payscale_payscale_records](/tools/query-payscale-payscale-records.md)
- [query_google_bigquery_analytics_events](/tools/query-google-bigquery-analytics-events.md)
- [lookup_market_benchmarking_analysis_agent_policy_handbook](/tools/lookup-market-benchmarking-analysis-agent-policy-handbook.md)

## Entities that must be referenced

- mercer_records
- radford_records
- payscale_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [market-benchmarking-analysis-agent-policy-handbook](/documents/market-benchmarking-analysis-agent-policy-handbook.md)
