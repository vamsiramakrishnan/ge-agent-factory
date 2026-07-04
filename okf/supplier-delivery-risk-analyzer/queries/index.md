---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query supply_plans, demand_signals, and scenario_runs from Kinaxis RapidResponse (query_kinaxis_rapidresponse_supply_plans) alongside open purchase_orders from SAP S/4HANA MM (query_sap_s_4hana_mm_purchase_orders) for the current planning horizon.](/queries/supply-demand-signal-pull.md)
- [Score each open purchase_orders record's late-delivery probability from the vendor's rolling on-time performance and order size, cross-referencing supply_risk_score in supply_plans against variance_pct in BigQuery analytics_events (query_bigquery_analytics_events).](/queries/late-delivery-risk-scoring.md)
- [Simulate the downstream production impact of predicted PO slips using scenario_runs service_level_pct and safety_stock_qty in supply_plans within Kinaxis RapidResponse, isolating which purchase_orders threaten a constraint work center this week.](/queries/production-impact-simulation.md)
- [Cross-check every risk score and chase-list candidate against the Supplier Delivery Risk Analyzer Standard Operating Procedure (lookup_supplier_delivery_risk_analyzer_sop) and the Approved Vendor List & Denied-Party Screening Policy before any recommendation is issued.](/queries/sop-evidence-validation.md)
- [Publish differentiated safety-stock recommendations and supplier reliability trends to Looker dashboards (query_looker_dashboards), execute action_sap_s_4hana_mm_publish with a full audit trail, and escalate exceptions to the Materials Manager.](/queries/chase-list-publish-escalation.md)
