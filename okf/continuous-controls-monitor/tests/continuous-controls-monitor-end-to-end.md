---
type: Eval Scenario
title: Run the Continuous Controls Monitor workflow for the current period. Cite the...
description: "Run the Continuous Controls Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "continuous-controls-monitor-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Continuous Controls Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [real-time-ingestion](/queries/real-time-ingestion.md)

## Mechanisms to call

- [query_sap_grc_control_tests](/tools/query-sap-grc-control-tests.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_continuous_controls_monitor_controls_playbook](/tools/lookup-continuous-controls-monitor-controls-playbook.md)

## Success rubric

Chief Audit Executive receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Continuous Controls Monitor Controls Playbook](/documents/continuous-controls-monitor-controls-playbook.md)
