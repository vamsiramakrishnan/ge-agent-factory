---
type: Query Capability
title: Gemini generates exception narratives explaining the likely cause of each fla...
description: Gemini generates exception narratives explaining the likely cause of each flagged anomaly based on recent transactions and known events.
source_id: "exception-narratives"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Gemini generates exception narratives explaining the likely cause of each flagged anomaly based on recent transactions and known events.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

## Runs in

- [exception_narratives](/workflow/exception-narratives.md)

## Evidence expected

- sql_result

## Evals

- [Run the Trial Balance Validator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/trial-balance-validator-end-to-end.md)

# Citations

- [Trial Balance Validator Controls Playbook](/documents/trial-balance-validator-controls-playbook.md)
