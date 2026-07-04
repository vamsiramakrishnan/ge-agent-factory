---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull maintenance_work_orders, upcoming PM schedules, and asset_registry_entries criticality_ranking from IBM Maximo (query_ibm_maximo_maintenance_work_orders) to build the part-level demand signal, cross-referencing failure_codes history for repeat-failure parts.](/queries/demand-signal-aggregation.md)
- [Cross-reference on-hand and on-order quantities in SAP S/4HANA MM purchase_orders against vendor lead times in vendors records (query_sap_s_4hana_mm_purchase_orders) to identify SKUs whose coverage window has closed.](/queries/coverage-lead-time-exposure-check.md)
- [Compare current coverage exposure against historical_metrics and analytics_events baselines in BigQuery (query_bigquery_analytics_events) to score stockout probability per part and rank the MRO Storeroom Manager's queue by asset criticality_ranking.](/queries/stockout-risk-scoring.md)
- [Validate proposed reorder point and safety stock changes against the Spare Parts Stockout Prediction Agent SOP and the Reorder Point and Safety Stock Policy (lookup_spare_parts_stockout_prediction_agent_sop), citing control-limit sections before drafting any purchase requisition.](/queries/reorder-policy-requisition-drafting.md)
- [Execute action_ibm_maximo_recommend against IBM Maximo with a full audit trail for the approved requisition, and escalate any expedite or high-risk-vendor exceptions to the MRO Storeroom Manager.](/queries/requisition-execution-audit.md)
