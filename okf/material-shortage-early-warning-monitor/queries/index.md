---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query supply_plans and demand_signals from Kinaxis RapidResponse via query_kinaxis_rapidresponse_supply_plans, then net against purchase_orders and material_movements owned by SAP S/4HANA MM (query_sap_s_4hana_mm_purchase_orders) to compute rolling coverage days per material_number.](/queries/coverage-netting.md)
- [Compare projected coverage against historical_metrics and analytics_events baselines in BigQuery (query_bigquery_analytics_events), weight in scenario_runs solver_status and service_level_pct, and rank open shortages by production impact for the Supply Planner's queue.](/queries/exception-scoring-prioritization.md)
- [Look up governing sections of the Material Shortage Early Warning Monitor SOP and the Expedite & Allocation Authority Matrix via lookup_material_shortage_early_warning_monitor_sop, and confirm vendor risk_score/status and substitution equivalency before any resolution is proposed.](/queries/sop-authority-matrix-evidence-gate.md)
- [Draft the chosen resolution -- expedite, substitute, or reschedule -- as a purchase-order change in SAP S/4HANA MM via action_sap_s_4hana_mm_draft, gated on corroborating evidence from at least two source systems.](/queries/resolution-drafting.md)
- [Route line-down, single-source-disruption, and service-level-breach conditions to materials_manager, procurement_director, or the S&OP process owner with the audit_record_id and full evidence trail attached, per the escalation rules.](/queries/escalation-audit-handoff.md)
