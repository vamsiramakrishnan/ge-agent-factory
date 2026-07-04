---
type: Workflow Stage
title: "Feedback & Ticket Ingestion"
description: "Pull the full period's tickets and satisfaction_scores from Zendesk (query_zendesk_tickets) alongside online_orders and cart_events from Salesforce Commerce Cloud so no verbatim, macro, or CSAT record is sampled out before mining begins."
source_id: feedback_ticket_ingestion
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Feedback & Ticket Ingestion

Pull the full period's tickets and satisfaction_scores from Zendesk (query_zendesk_tickets) alongside online_orders and cart_events from Salesforce Commerce Cloud so no verbatim, macro, or CSAT record is sampled out before mining begins.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [query_ga4_session_events](/tools/query-ga4-session-events.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [action_salesforce_commerce_cloud_escalate](/tools/action-salesforce-commerce-cloud-escalate.md)

Next: [Theme & Sentiment Clustering](/workflow/theme-sentiment-clustering.md)
