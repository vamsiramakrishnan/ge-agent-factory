---
type: Workflow Stage
title: "Revenue & Return-Rate Impact Scoring"
description: "Quantify each theme's dollar and return-rate impact by joining flagged tickets and online_orders against BigQuery analytics_events and historical_metrics baselines (query_bigquery_analytics_events) to separate a real defect trend from noise."
source_id: revenue_return_rate_impact_scoring
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Revenue & Return-Rate Impact Scoring

Quantify each theme's dollar and return-rate impact by joining flagged tickets and online_orders against BigQuery analytics_events and historical_metrics baselines (query_bigquery_analytics_events) to separate a real defect trend from noise.

- **Mode:** sequential
- **Stage:** 3 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

Next: [Playbook-Gated Validation](/workflow/playbook-gated-validation.md)
