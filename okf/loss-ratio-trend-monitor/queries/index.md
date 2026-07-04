---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull loss_cost_benchmarks, circular_updates, and territory_factors from Verisk ISO ERC via query_verisk_iso_erc_loss_cost_benchmarks so every state/class/tier cell is scored against a current rating basis, not a stale one.](/queries/benchmark-circular-intake.md)
- [Re-cut analytics_events against historical_metrics and cached_aggregates in BigQuery via query_bigquery_analytics_events to split each cell's movement into severity, frequency, and large-loss components across 400+ state/class/tier/cohort combinations.](/queries/segment-loss-ratio-decomposition.md)
- [Weight each cell's variance_pct by credibility_factor and benchmark it against Looker dashboards and metric_definitions via query_looker_dashboards, so a thin-volume blip is not mistaken for confirmed deterioration.](/queries/credibility-weighted-trend-confirmation.md)
- [Cite the Loss Ratio Trend Monitor Authority & Referral Guide via lookup_loss_ratio_trend_monitor_authority_guide, confirming coverage interpretation and reserving/payment thresholds before any driver analysis is drafted for the Chief Actuary.](/queries/authority-referral-gate.md)
- [Execute action_verisk_iso_erc_escalate against Verisk ISO ERC with a full audit trail, recommending which cells to fast-track for rate review and routing confirmed adverse trends to the Chief Actuary.](/queries/escalation-rate-review-fast-track.md)
