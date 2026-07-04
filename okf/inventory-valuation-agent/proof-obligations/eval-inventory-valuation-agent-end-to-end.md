---
type: Proof Obligation
title: "Golden eval obligation — Run the Inventory Valuation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
description: golden eval proof obligation
source_id: "eval-inventory-valuation-agent-end-to-end"
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

# Golden eval obligation — Run the Inventory Valuation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.0
- **Eval:** [inventory-valuation-agent-end-to-end](/tests/inventory-valuation-agent-end-to-end.md)


## Mechanisms

- [query_sap_s_4hana_mm_fi_purchase_orders](/tools/query-sap-s-4hana-mm-fi-purchase-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_inventory_valuation_agent_controls_playbook](/tools/lookup-inventory-valuation-agent-controls-playbook.md)

## Entities that must be referenced

- purchase_orders
- analytics_events
- finance_3_records

## Forbidden behaviors

- do not invent KPI numbers
- do not skip the evidence_lookup step before any recommendation
- do not act on single-system evidence

# Citations

- [inventory-valuation-agent-controls-playbook](/documents/inventory-valuation-agent-controls-playbook.md)
