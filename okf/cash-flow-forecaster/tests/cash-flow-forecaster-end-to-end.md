---
type: Eval Scenario
title: Run the Cash Flow Forecaster workflow for the current period. Cite the releva...
description: "Run the Cash Flow Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "cash-flow-forecaster-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Cash Flow Forecaster workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [cash-position-aggregation](/queries/cash-position-aggregation.md)

## Mechanisms to call

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_cash_flow_forecaster_controls_playbook](/tools/lookup-cash-flow-forecaster-controls-playbook.md)
- [action_kyriba_execute](/tools/action-kyriba-execute.md)

## Success rubric

Action execute executed against Kyriba, with audit-trail entry and Treasurer notified of outcomes.

# Citations

- [Cash Flow Forecaster Controls Playbook](/documents/cash-flow-forecaster-controls-playbook.md)
