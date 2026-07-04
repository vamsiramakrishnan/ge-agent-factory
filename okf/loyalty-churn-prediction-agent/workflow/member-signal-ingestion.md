---
type: Workflow Stage
title: Member Signal Ingestion
description: "Pull weekly online_orders and cart_events from Salesforce Commerce Cloud alongside segment_records and segment_events from Segment to build each member's purchase-cadence and engagement trail."
source_id: member_signal_ingestion
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Member Signal Ingestion

Pull weekly online_orders and cart_events from Salesforce Commerce Cloud alongside segment_records and segment_events from Segment to build each member's purchase-cadence and engagement trail.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_segment_segment_records](/tools/query-segment-segment-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_loyalty_churn_prediction_agent_execution_playbook](/tools/lookup-loyalty-churn-prediction-agent-execution-playbook.md)
- [action_salesforce_commerce_cloud_recommend](/tools/action-salesforce-commerce-cloud-recommend.md)

Next: [Lapse-Risk Scoring](/workflow/lapse-risk-scoring.md)
