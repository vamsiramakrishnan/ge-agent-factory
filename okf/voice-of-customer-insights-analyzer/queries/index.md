---
type: Index
title: Query Capabilities
description: "The questions and requests this agent can answer, each with the tools it uses."
timestamp: "2026-07-04T00:00:00.000Z"
---

# Query Capabilities

- [Pull the full period's tickets and satisfaction_scores from Zendesk (query_zendesk_tickets) alongside online_orders and cart_events from Salesforce Commerce Cloud so no verbatim, macro, or CSAT record is sampled out before mining begins.](/queries/feedback-ticket-ingestion.md)
- [Mine ticket text, macros, and GA4 session_events (query_ga4_session_events) for repeating themes and sentiment shifts, then tag each cluster to the specific SKUs in product_catalog_entries and the vendors behind them.](/queries/theme-sentiment-clustering.md)
- [Quantify each theme's dollar and return-rate impact by joining flagged tickets and online_orders against BigQuery analytics_events and historical_metrics baselines (query_bigquery_analytics_events) to separate a real defect trend from noise.](/queries/revenue-return-rate-impact-scoring.md)
- [Cross-check every surfaced theme and proposed vendor callout against the Voice of Customer Insights Analyzer Retail Execution Playbook (lookup_voice_of_customer_insights_analyzer_execution_playbook) before any finding is allowed into the brief.](/queries/playbook-gated-validation.md)
- [Draft the weekly insights brief and execute action_salesforce_commerce_cloud_escalate to route confirmed emerging defect clusters to merchandising and quality owners with a full audit trail on online_orders and product_catalog_entries evidence.](/queries/weekly-insights-brief-escalation.md)
