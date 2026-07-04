---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Capture the what-if trigger (demand-shift, capacity-loss, or supplier-disruption) raised in the S&OP meeting and pull the relevant demand_signals and supply_plans rows from Kinaxis RapidResponse via query_kinaxis_rapidresponse_supply_plans to scope which material_number and customer_name records are in play.](/queries/scenario-intake-assumption-framing.md)
- [Runs the scenario_runs simulation in Kinaxis RapidResponse across scenario_type variants (capacity_constraint, demand_surge, supplier_disruption, network_redesign, inventory_optimization), tracks solver_status (optimal/feasible/infeasible/timeout), and lands service_level_pct and projected_inventory_value_usd outputs in BigQuery for comparison.](/queries/scenario-execution-in-rapid-response.md)
- [Joins scenario_runs outputs against demand_signals and supply_plans, then cross-references BigQuery analytics_events and historical_metrics via query_bigquery_analytics_events to translate the aggregate demand-supply gap into affected customer_name, abc_class tier, revenue, and margin exposure instead of raw units.](/queries/gap-attribution-financial-translation.md)
- [Calls lookup_demand_supply_gap_scenario_engine_sop and cites the Customer Service-Level Commitment & ATP/CTP Rate Schedule to validate solver_status, check service_level_pct against the contractual floor, and confirm supply_plans freshness before any recommendation is drafted.](/queries/sop-rate-schedule-evidence-gating.md)
- [Publishes the side-by-side scenario comparison to Looker dashboards via query_looker_dashboards, executes action_kinaxis_rapidresponse_publish in Kinaxis RapidResponse with a full audit trail, and escalates line-down, force-majeure, or service-floor breaches to the S&OP Manager, materials_manager, procurement_director, or sandop_process_owner before the meeting.](/queries/executive-briefing-publish-escalation.md)
