---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull competitor-triggered price_recommendations and current price_zones from Revionics Price Optimization, matching each SKU to its price_zone_id and competitive_price_index before any move is scored.](/queries/competitor-feed-intake-zone-match.md)
- [Flag key-value items via kvi_flag in elasticity_models, and score each detected competitor move using own_price_elasticity and cross_price_elasticity against historical_metrics and analytics_events in BigQuery.](/queries/kvi-move-detection-elasticity-scoring.md)
- [Model the margin_impact_dollars and weeks_of_supply consequence of respond, hold, and partial-match options per item, weighting price-image sensitivity from the zone's pricing_strategy.](/queries/respond-hold-partial-match-modeling.md)
- [Cite the Competitive Price Response Agent Retail Execution Playbook and the MAP & Price-Comparison Compliance Policy via lookup_competitive_price_response_agent_execution_playbook before any recommendation clears for execution.](/queries/playbook-map-guardrail-check.md)
- [Execute the cleared recommendation through action_revionics_price_optimization_recommend in Revionics Price Optimization, writing an audit_record_id and notifying the Pricing Manager of the outcome.](/queries/rule-execution-audit.md)
- [Publish resulting competitive_price_index and margin movement to Looker dashboards so the Pricing Manager can track Price-index drift on KVIs against the +/-1.5% weekly target.](/queries/kpi-reporting-to-pricing-manager.md)
