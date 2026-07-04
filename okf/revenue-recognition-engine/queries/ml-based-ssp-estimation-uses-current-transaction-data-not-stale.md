---
type: Query Capability
title: "ML-based SSP estimation uses current transaction data, not stale spreadsheets"
description: "ML-based SSP estimation uses current transaction data, not stale spreadsheets"
source_id: "ml-based-ssp-estimation-uses-current-transaction-data-not-stale-"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# ML-based SSP estimation uses current transaction data, not stale spreadsheets

## Tools used

- [query_sap_s_4hana_sd_fi_sales_orders](/tools/query-sap-s-4hana-sd-fi-sales-orders.md)
- [query_revpro_zuora_revpro_zuora_records](/tools/query-revpro-zuora-revpro-zuora-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_revenue_recognition_engine_controls_playbook](/tools/lookup-revenue-recognition-engine-controls-playbook.md)

## Evidence expected

- source_system_record
- sql_result
- document_reference

## Evals

- [Run the Revenue Recognition Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/revenue-recognition-engine-end-to-end.md)

# Citations

- [Revenue Recognition Engine Controls Playbook](/documents/revenue-recognition-engine-controls-playbook.md)
