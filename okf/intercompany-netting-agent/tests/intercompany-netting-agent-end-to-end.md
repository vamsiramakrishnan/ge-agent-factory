---
type: Eval Scenario
title: Run the Intercompany Netting Agent workflow for the current period. Cite the ...
description: "Run the Intercompany Netting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "intercompany-netting-agent-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Intercompany Netting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [ic-balance-aggregation](/queries/ic-balance-aggregation.md)

## Mechanisms to call

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_intercompany_netting_agent_controls_playbook](/tools/lookup-intercompany-netting-agent-controls-playbook.md)

## Success rubric

Treasury Analyst receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Intercompany Netting Agent Controls Playbook](/documents/intercompany-netting-agent-controls-playbook.md)
