---
type: Query Capability
title: "Ingest and normalize compensation survey data from Mercer, Radford, and Paysc..."
description: "Ingest and normalize compensation survey data from Mercer, Radford, and Payscale. Harmonize job matching taxonomies and percentile scales across providers."
source_id: "survey-data-aggregation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest and normalize compensation survey data from Mercer, Radford, and Payscale. Harmonize job matching taxonomies and percentile scales across providers.

## Tools used

- [query_mercer_mercer_records](/tools/query-mercer-mercer-records.md)
- [query_radford_radford_records](/tools/query-radford-radford-records.md)
- [query_payscale_payscale_records](/tools/query-payscale-payscale-records.md)

## Runs in

- [survey_data_aggregation](/workflow/survey-data-aggregation.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Market Benchmarking Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/market-benchmarking-analysis-agent-end-to-end.md)

# Citations

- [Market Benchmarking Analysis Agent Policy Handbook](/documents/market-benchmarking-analysis-agent-policy-handbook.md)
