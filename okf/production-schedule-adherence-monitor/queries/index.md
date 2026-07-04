---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query SAP S/4HANA PP process_orders and Siemens Opcenter MES production_orders for the current shift via query_sap_s_4hana_pp_process_orders and query_siemens_opcenter_mes_production_orders, matching on order_number and material_number to find orders where confirmed_qty is falling behind scheduled_start.](/queries/plan-vs-confirmation-pull.md)
- [Cross-reference material_stagings.shortage_flag and machine_events on the affected resource to determine whether a trending-late process_order is a materials shortage, a constraint-asset stoppage, or a genuine schedule slip before it gets scored.](/queries/staging-and-constraint-check.md)
- [Compare the gap against historical_metrics and analytics_events in BigQuery via query_bigquery_analytics_events to quantify downstream capacity and customer-ship impact, then rank the at-risk process_orders and production_orders queue for the Production Scheduler.](/queries/variance-scoring-against-baseline.md)
- [Cite the governing sections of the Production Schedule Adherence Monitor SOP and the Constraint Asset Re-Sequencing and Expedite Freight Authorization Work Instruction via lookup_production_schedule_adherence_monitor_sop before proposing a specific re-sequencing option and its freight cost.](/queries/sop-gated-recommendation.md)
- [Execute action_sap_s_4hana_pp_publish to push the approved re-sequence back to SAP S/4HANA PP with a full audit trail, refresh the shift-start adherence dashboard via query_looker_dashboards, and notify the Production Scheduler of the top three at-risk orders.](/queries/publish-and-shift-handover.md)
