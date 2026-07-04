---
type: Workflow Stage
title: "Real-Time Ingestion"
description: "Stream transaction events from SAP via change data capture. Apply SoD matrix and authorization rules in real-time."
source_id: real_time_ingestion
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Real-Time Ingestion

Stream transaction events from SAP via change data capture. Apply SoD matrix and authorization rules in real-time.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sap_grc_control_tests](/tools/query-sap-grc-control-tests.md)
- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

Next: [Statistical Process Control](/workflow/statistical-process-control.md)
