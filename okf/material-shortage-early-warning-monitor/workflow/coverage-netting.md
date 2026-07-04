---
type: Workflow Stage
title: Coverage Netting
description: "Query supply_plans and demand_signals from Kinaxis RapidResponse via query_kinaxis_rapidresponse_supply_plans, then net against purchase_orders and material_movements owned by SAP S/4HANA MM (query_sap_s_4hana_mm_purchase_orders) to compute rolling coverage days per material_number."
source_id: coverage_netting
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Coverage Netting

Query supply_plans and demand_signals from Kinaxis RapidResponse via query_kinaxis_rapidresponse_supply_plans, then net against purchase_orders and material_movements owned by SAP S/4HANA MM (query_sap_s_4hana_mm_purchase_orders) to compute rolling coverage days per material_number.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_material_shortage_early_warning_monitor_sop](/tools/lookup-material-shortage-early-warning-monitor-sop.md)
- [action_sap_s_4hana_mm_draft](/tools/action-sap-s-4hana-mm-draft.md)

Next: [Exception Scoring & Prioritization](/workflow/exception-scoring-prioritization.md)
