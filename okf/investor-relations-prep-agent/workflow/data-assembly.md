---
type: Workflow Stage
title: Data Assembly
description: Compile quarterly results from BigQuery. Pull analyst consensus estimates from Bloomberg and Capital IQ. Gather peer results for competitive context.
source_id: data_assembly
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Data Assembly

Compile quarterly results from BigQuery. Pull analyst consensus estimates from Bloomberg and Capital IQ. Gather peer results for competitive context.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_bloomberg_bloomberg_records](/tools/query-bloomberg-bloomberg-records.md)
- [query_s_p_capital_iq_s_p_capital_iq_records](/tools/query-s-p-capital-iq-s-p-capital-iq-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_investor_relations_prep_agent_controls_playbook](/tools/lookup-investor-relations-prep-agent-controls-playbook.md)

Next: [Q&A Preparation](/workflow/q-a-preparation.md)
