---
type: Eval Scenario
title: Run the FX Exposure Monitor workflow for the current period. Cite the relevan...
description: "Run the FX Exposure Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "fx-exposure-monitor-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the FX Exposure Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [market-event-interpretation](/queries/market-event-interpretation.md)

## Mechanisms to call

- [query_kyriba_cash_positions](/tools/query-kyriba-cash-positions.md)
- [query_bloomberg_bloomberg_records](/tools/query-bloomberg-bloomberg-records.md)
- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_fx_exposure_monitor_controls_playbook](/tools/lookup-fx-exposure-monitor-controls-playbook.md)
- [action_kyriba_recommend](/tools/action-kyriba-recommend.md)

## Success rubric

Action recommend executed against Kyriba, with audit-trail entry and Treasurer notified of outcomes.

# Citations

- [FX Exposure Monitor Controls Playbook](/documents/fx-exposure-monitor-controls-playbook.md)
