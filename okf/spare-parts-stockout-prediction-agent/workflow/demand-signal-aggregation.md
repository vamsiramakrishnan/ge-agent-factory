---
type: Workflow Stage
title: Demand Signal Aggregation
description: "Pull maintenance_work_orders, upcoming PM schedules, and asset_registry_entries criticality_ranking from IBM Maximo (query_ibm_maximo_maintenance_work_orders) to build the part-level demand signal, cross-referencing failure_codes history for repeat-failure parts."
source_id: demand_signal_aggregation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Demand Signal Aggregation

Pull maintenance_work_orders, upcoming PM schedules, and asset_registry_entries criticality_ranking from IBM Maximo (query_ibm_maximo_maintenance_work_orders) to build the part-level demand signal, cross-referencing failure_codes history for repeat-failure parts.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_spare_parts_stockout_prediction_agent_sop](/tools/lookup-spare-parts-stockout-prediction-agent-sop.md)
- [action_ibm_maximo_recommend](/tools/action-ibm-maximo-recommend.md)

Next: [Coverage & Lead-Time Exposure Check](/workflow/coverage-lead-time-exposure-check.md)
