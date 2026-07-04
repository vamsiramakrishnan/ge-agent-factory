---
type: Query Capability
title: Stream transaction events from SAP via change data capture. Apply SoD matrix ...
description: "Stream transaction events from SAP via change data capture. Apply SoD matrix and authorization rules in real-time."
source_id: "real-time-ingestion"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Stream transaction events from SAP via change data capture. Apply SoD matrix and authorization rules in real-time.

## Tools used

- [query_sap_grc_control_tests](/tools/query-sap-grc-control-tests.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

## Runs in

- [real_time_ingestion](/workflow/real-time-ingestion.md)

## Evidence expected

- source_system_record
- sql_result

## Evals

- [Run the Continuous Controls Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/continuous-controls-monitor-end-to-end.md)

# Citations

- [Continuous Controls Monitor Controls Playbook](/documents/continuous-controls-monitor-controls-playbook.md)
