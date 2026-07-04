---
type: Eval Scenario
title: Run the Inventory Rebalancing Orchestrator workflow for the current period. C...
description: "Run the Inventory Rebalancing Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "inventory-rebalancing-orchestrator-end-to-end"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Inventory Rebalancing Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [surplus-deficit-matching](/queries/surplus-deficit-matching.md)

## Mechanisms to call

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_inventory_rebalancing_orchestrator_sop](/tools/lookup-inventory-rebalancing-orchestrator-sop.md)
- [action_sap_s_4hana_mm_recommend](/tools/action-sap-s-4hana-mm-recommend.md)

## Success rubric

Action recommend executed against SAP S/4HANA MM, with audit-trail entry and Inventory Analyst notified of outcomes.

# Citations

- [Inventory Rebalancing Orchestrator Standard Operating Procedure](/documents/inventory-rebalancing-orchestrator-sop.md)
