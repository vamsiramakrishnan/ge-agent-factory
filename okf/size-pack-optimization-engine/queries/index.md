---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull item_master, merchandise_hierarchy, and case_pack data from Oracle Retail MFCS and cross-reference demand_forecasts and seasonal_profiles from Blue Yonder Demand Planning for the SKU-class-store combinations entering the buy window.](/queries/size-curve-forecast-intake.md)
- [Compare each store cluster's transaction-level size mix against analytics_events and historical_metrics in BigQuery to fit a localized size curve and flag classes where the chain-average curve diverges from cluster-level sell-through.](/queries/store-cluster-curve-fitting.md)
- [Translate the fitted size curve into a case-pack ratio, checking case_pack on item_master and bracket_quantity on cost_changes in Oracle Retail MFCS so the rounded pack stays inside the vendor's negotiated pricing tier.](/queries/pack-ratio-rounding-reconciliation.md)
- [Cite the Size & Pack Optimization Engine Retail Execution Playbook and the Case-Pack Rounding & Minimum-Pack Standards Manual before any recommendation, confirming assortment, inventory, and escalation thresholds are met.](/queries/playbook-evidence-gate.md)
- [Execute action_oracle_retail_mfcs_recommend to push the optimized size-pack ratio into the Oracle Retail MFCS buy plan ahead of PO cut, emitting a generated_audit_trail record.](/queries/mfcs-buy-plan-recommendation-audit.md)
- [Track live sell-through against demand_forecasts and seasonal_profiles post-launch and notify the Merchandise Planner when in-season selling diverges from the planned curve beyond tolerance.](/queries/in-season-divergence-monitoring.md)
