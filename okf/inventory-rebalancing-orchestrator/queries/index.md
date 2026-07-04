---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull supply_plans, demand_signals, and scenario_runs from Kinaxis RapidResponse across all plants (1010, 1020, 2040, 3100, external_vendor) via query_kinaxis_rapidresponse_supply_plans, query_kinaxis_rapidresponse_demand_signals, and query_kinaxis_rapidresponse_scenario_runs to establish tonight's baseline stock and demand picture.](/queries/nightly-multi-site-signal-pull.md)
- [Cross-reference supply_plans safety_stock_qty against demand_signals demand_qty by material_number, then confirm against SAP S/4HANA MM purchase_orders and material_movements (query_sap_s_4hana_mm_purchase_orders, query_sap_s_4hana_mm_material_movements) and BigQuery historical_metrics (query_bigquery_historical_metrics) to isolate genuine donor-plant/receiver-plant pairs and rule out timing mismatches.](/queries/surplus-deficit-matching.md)
- [Quantify freight cost versus expedite/premium-purchase cost for each candidate transfer using vendors (query_sap_s_4hana_mm_vendors) rating and risk_score data and BigQuery cached_aggregates and analytics_events, ranking transfers by inventory-turns and cycle-time impact.](/queries/transfer-economics-scoring.md)
- [Cite the Inventory Rebalancing Orchestrator Standard Operating Procedure (lookup_inventory_rebalancing_orchestrator_sop) and the Inter-Site Transfer Authorization Matrix for staleness limits, safety-stock floors, and dollar-threshold co-sign requirements before any transfer is released.](/queries/sop-authorization-gate.md)
- [Draft and execute the stock transport order in SAP S/4HANA MM (action_sap_s_4hana_mm_recommend) with the full audit trail, then track the transfer through material_movements postings to receipt and notify the Inventory Analyst of the outcome.](/queries/stock-transport-order-execution-receipt-tracking.md)
