---
type: Proof Obligation
title: "Golden eval obligation — Run the Revenue Recognition Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-revenue-recognition-engine-end-to-end"
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

# Golden eval obligation — Run the Revenue Recognition Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [revenue-recognition-engine-end-to-end](/tests/revenue-recognition-engine-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_sd_fi_sales_orders](/tools/query-sap-s-4hana-sd-fi-sales-orders.md)
- [query_revpro_zuora_revpro_zuora_records](/tools/query-revpro-zuora-revpro-zuora-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_revenue_recognition_engine_controls_playbook](/tools/lookup-revenue-recognition-engine-controls-playbook.md)

## Entities that must be referenced

- sales_orders
- revpro_zuora_records
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [revenue-recognition-engine-controls-playbook](/documents/revenue-recognition-engine-controls-playbook.md)
