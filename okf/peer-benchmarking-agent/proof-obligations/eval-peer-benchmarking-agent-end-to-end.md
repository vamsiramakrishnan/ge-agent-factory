---
type: Proof Obligation
title: "Golden eval obligation — Run the Peer Benchmarking Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-peer-benchmarking-agent-end-to-end"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.0
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Run the Peer Benchmarking Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [peer-benchmarking-agent-end-to-end](/tests/peer-benchmarking-agent-end-to-end.md)


## Mechanisms

- [query_s_p_capital_iq_s_p_capital_iq_records](/tools/query-s-p-capital-iq-s-p-capital-iq-records.md)
- [query_bloomberg_bloomberg_records](/tools/query-bloomberg-bloomberg-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_peer_benchmarking_agent_controls_playbook](/tools/lookup-peer-benchmarking-agent-controls-playbook.md)

## Entities that must be referenced

- s_p_capital_iq_records
- bloomberg_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [peer-benchmarking-agent-controls-playbook](/documents/peer-benchmarking-agent-controls-playbook.md)
