---
type: Proof Obligation
title: "Golden eval obligation — Run the Sales & Use Tax Automation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-sales-use-tax-automation-end-to-end"
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

# Golden eval obligation — Run the Sales & Use Tax Automation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [sales-use-tax-automation-end-to-end](/tests/sales-use-tax-automation-end-to-end.md)


## Mechanisms

- [query_avalara_avalara_records](/tools/query-avalara-avalara-records.md)
- [query_vertex_tax_vertex_tax_records](/tools/query-vertex-tax-vertex-tax-records.md)
- [query_sap_s_4hana_sd_sales_orders](/tools/query-sap-s-4hana-sd-sales-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_sales_use_tax_automation_controls_playbook](/tools/lookup-sales-use-tax-automation-controls-playbook.md)

## Entities that must be referenced

- avalara_records
- vertex_tax_records
- sales_orders
- analytics_events

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [sales-use-tax-automation-controls-playbook](/documents/sales-use-tax-automation-controls-playbook.md)
