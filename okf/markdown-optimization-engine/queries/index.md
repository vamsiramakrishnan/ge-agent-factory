---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull price_recommendations, price_zones, and elasticity_models from Revionics Price Optimization for the SKU-zone under review and join to item_master in Oracle Retail MFCS to confirm current_retail, unit_cost, and item_status before any ladder is touched.](/queries/elasticity-zone-intake.md)
- [Screen weeks_of_supply and markdown_cadence in price_recommendations against analytics_events and historical_metrics in BigQuery to surface item_master SKUs drifting toward their clearance-exit window before the warehouse flags space.](/queries/aging-inventory-detection.md)
- [Simulate first_markdown_25 through final_clearance_75 depth and timing per SKU-zone using own_price_elasticity and cross_price_elasticity from elasticity_models, scoring each option against sell_through_target_pct and margin_impact_dollars in price_recommendations.](/queries/markdown-ladder-simulation.md)
- [Reconcile the simulated ladder against merchandise_hierarchy markdown_budget_pct and gmroi_target, cross-check cost_changes for cost movements that could push a recommendation below unit_cost, and cite the Markdown Optimization Engine Retail Execution Playbook via lookup_markdown_optimization_engine_execution_playbook before anything is proposed.](/queries/playbook-guardrail-validation.md)
- [Execute action_oracle_retail_mfcs_escalate for approved markdown actions in Oracle Retail MFCS with a full audit trail, and route exceptions on price_zones or item_master records to the Pricing Analyst or divisional_merchandise_manager per the escalation rules.](/queries/escalate-audit.md)
