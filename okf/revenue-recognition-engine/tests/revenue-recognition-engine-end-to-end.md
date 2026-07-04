---
type: Eval Scenario
title: Run the Revenue Recognition Engine workflow for the current period. Cite the ...
description: "Run the Revenue Recognition Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "revenue-recognition-engine-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Revenue Recognition Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [gemini-reads-complex-contract-language-and-applies-the-asc-606-5](/queries/gemini-reads-complex-contract-language-and-applies-the-asc-606-5.md)

## Mechanisms to call

- [query_sap_s_4hana_sd_fi_sales_orders](/tools/query-sap-s-4hana-sd-fi-sales-orders.md)
- [query_revpro_zuora_revpro_zuora_records](/tools/query-revpro-zuora-revpro-zuora-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_revenue_recognition_engine_controls_playbook](/tools/lookup-revenue-recognition-engine-controls-playbook.md)

## Success rubric

Controller receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Revenue Recognition Engine Controls Playbook](/documents/revenue-recognition-engine-controls-playbook.md)
