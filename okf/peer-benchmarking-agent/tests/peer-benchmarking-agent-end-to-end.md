---
type: Eval Scenario
title: Run the Peer Benchmarking Agent workflow for the current period. Cite the rel...
description: "Run the Peer Benchmarking Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "peer-benchmarking-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Peer Benchmarking Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [peer-group-construction](/queries/peer-group-construction.md)

## Mechanisms to call

- [query_s_p_capital_iq_s_p_capital_iq_records](/tools/query-s-p-capital-iq-s-p-capital-iq-records.md)
- [query_bloomberg_bloomberg_records](/tools/query-bloomberg-bloomberg-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_peer_benchmarking_agent_controls_playbook](/tools/lookup-peer-benchmarking-agent-controls-playbook.md)

## Success rubric

CFO receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Peer Benchmarking Agent Controls Playbook](/documents/peer-benchmarking-agent-controls-playbook.md)
