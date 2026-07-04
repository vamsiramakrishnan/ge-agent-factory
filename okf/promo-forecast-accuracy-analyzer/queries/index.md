---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull demand_forecasts and forecast_overrides from Blue Yonder Demand Planning for the promoted sku/store weeks, checking seasonal_profiles seasonal_index and flagging any frozen_period_flag or approved_flag mismatches before decomposition begins.](/queries/forecast-override-intake.md)
- [Cross-reference price_recommendations, price_zones, and elasticity_models from Revionics Price Optimization to split each promo_lift_units figure into true incremental, cannibalized, and pulled-forward volume using own_price_elasticity and cross_price_elasticity.](/queries/lift-decomposition-cannibalization-check.md)
- [Compare analytics_events actuals against historical_metrics baselines in BigQuery to compute variance_pct alongside wmape and bias_pct for every closed promo event, assembling the scorecard within the 72-hour SLA.](/queries/post-event-scorecard-build.md)
- [Cite the governing sections of the Promo Forecast Accuracy Analyzer Retail Execution Playbook and the Markdown & Trade Promotion Guardrail Manual before any corrected lift factor or markdown-adjacent recommendation is issued.](/queries/playbook-guardrail-validation.md)
- [Publish the corrected lift factor into Blue Yonder Demand Planning via action_blue_yonder_demand_planning_publish with a full audit trail, or escalate repeatedly unprofitable event types and threshold breaches to the Promotions Manager, divisional_merchandise_manager, or pricing_director.](/queries/publish-escalate.md)
