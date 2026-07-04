---
type: Query Capability
title: Compile quarterly results from BigQuery. Pull analyst consensus estimates fro...
description: Compile quarterly results from BigQuery. Pull analyst consensus estimates from Bloomberg and Capital IQ. Gather peer results for competitive context.
source_id: "data-assembly"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Compile quarterly results from BigQuery. Pull analyst consensus estimates from Bloomberg and Capital IQ. Gather peer results for competitive context.

## Tools used

- [query_bloomberg_bloomberg_records](/tools/query-bloomberg-bloomberg-records.md)
- [query_s_p_capital_iq_s_p_capital_iq_records](/tools/query-s-p-capital-iq-s-p-capital-iq-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_investor_relations_prep_agent_controls_playbook](/tools/lookup-investor-relations-prep-agent-controls-playbook.md)

## Runs in

- [data_assembly](/workflow/data-assembly.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Investor Relations Prep Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/investor-relations-prep-agent-end-to-end.md)

# Citations

- [Investor Relations Prep Agent Controls Playbook](/documents/investor-relations-prep-agent-controls-playbook.md)
