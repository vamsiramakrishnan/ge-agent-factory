---
type: Workflow Stage
title: "Churn Driver & CLV Triangulation"
description: "Cross-reference the account's queue_metrics and agent_schedules signals from Genesys Cloud CX against analytics_events and historical_metrics in BigQuery (query_bigquery_analytics_events) and the Looker dashboards (query_looker_dashboards) to separate a coverage-driven churn driver from a price-driven one and size the customer's lifetime value."
source_id: churn_driver_clv_triangulation
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Churn Driver & CLV Triangulation

Cross-reference the account's queue_metrics and agent_schedules signals from Genesys Cloud CX against analytics_events and historical_metrics in BigQuery (query_bigquery_analytics_events) and the Looker dashboards (query_looker_dashboards) to separate a coverage-driven churn driver from a price-driven one and size the customer's lifetime value.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_genesys_cloud_cx_customer_interactions](/tools/query-genesys-cloud-cx-customer-interactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_churn_save_desk_agent_assurance_runbook](/tools/lookup-churn-save-desk-agent-assurance-runbook.md)
- [action_genesys_cloud_cx_approve](/tools/action-genesys-cloud-cx-approve.md)

Next: [Save Offer Ranking Against Rate Card & Governance Cap](/workflow/save-offer-ranking-against-rate-card-governance-cap.md)
