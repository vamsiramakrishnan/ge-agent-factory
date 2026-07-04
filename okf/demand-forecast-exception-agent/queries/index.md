---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Query demand_forecasts and forecast_overrides from Blue Yonder Demand Planning for the week's item-location rows, flagging any where wmape or bias_pct breaches tolerance, gated by frozen_period_flag.](/queries/nightly-exception-scan.md)
- [Cross-reference flagged SKU-store exceptions against analytics_events and historical_metrics in BigQuery to attach weather, promo, and social-signal context before severity scoring.](/queries/causal-driver-correlation.md)
- [Validate each exception against seasonal_profiles (profile_type, peak_week, build_weeks, post_peak_cliff_flag) to separate genuine bias drift from expected seasonal ramp or post-peak cliff behavior.](/queries/seasonal-profile-cross-check.md)
- [Draft an override_units recommendation with confidence bounds and cite the governing sections of the Demand Forecast Exception Agent Retail Execution Playbook via lookup_demand_forecast_exception_agent_execution_playbook before surfacing to the Demand Planner.](/queries/override-recommendation-playbook-citation.md)
- [Execute action_blue_yonder_demand_planning_publish for approved forecast_overrides with a full audit trail, then score every published override against statistical_baseline_units on Looker dashboards.](/queries/publish-forecast-value-added-scoring.md)
