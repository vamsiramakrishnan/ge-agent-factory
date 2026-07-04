---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull closed-deal records from Salesforce Communications Cloud's subscriber_accounts, service_quotes, and order_captures, and code each closed opportunity with a loss driver drawn from CRM notes, call summaries, and quote history.](/queries/closed-opportunity-intake-loss-coding.md)
- [Compare current mrr_usd and discount_pct values in service_quotes and order_captures against BigQuery's historical_metrics and analytics_events baselines to detect emerging competitor pricing moves by market and product_bundle.](/queries/competitive-pricing-signal-scan.md)
- [Cross-check every loss-driver and pricing finding against the Competitive Win-Loss Analyzer Service Assurance Runbook and the Discount Authority Matrix via lookup_competitive_win_loss_analyzer_assurance_runbook before any finding is published.](/queries/evidence-policy-reconciliation.md)
- [Use Looker dashboards, explore_queries, and metric_definitions to rank the three most contested market/product segments and draft counter-play recommendations for sales leadership.](/queries/segment-ranking-counter-play-briefing.md)
- [Execute action_salesforce_communications_cloud_recommend to publish the recommended counter-play with a full audit trail, routing discount-authority, credit, or enterprise-threshold breaches to the Sales Operations Analyst, sales_pricing_desk, or enterprise_deal_desk.](/queries/recommend-escalate.md)
