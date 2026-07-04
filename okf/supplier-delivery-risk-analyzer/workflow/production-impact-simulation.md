---
type: Workflow Stage
title: Production Impact Simulation
description: "Simulate the downstream production impact of predicted PO slips using scenario_runs service_level_pct and safety_stock_qty in supply_plans within Kinaxis RapidResponse, isolating which purchase_orders threaten a constraint work center this week."
source_id: production_impact_simulation
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Production Impact Simulation

Simulate the downstream production impact of predicted PO slips using scenario_runs service_level_pct and safety_stock_qty in supply_plans within Kinaxis RapidResponse, isolating which purchase_orders threaten a constraint work center this week.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_kinaxis_rapidresponse_supply_plans](/tools/query-kinaxis-rapidresponse-supply-plans.md)
- [query_sap_s_4hana_mm_purchase_orders](/tools/query-sap-s-4hana-mm-purchase-orders.md)
- [lookup_supplier_delivery_risk_analyzer_sop](/tools/lookup-supplier-delivery-risk-analyzer-sop.md)

Next: [SOP Evidence Validation](/workflow/sop-evidence-validation.md)
