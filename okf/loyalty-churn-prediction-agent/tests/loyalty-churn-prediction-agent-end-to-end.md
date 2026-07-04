---
type: Eval Scenario
title: Run the Loyalty Churn Prediction Agent workflow for the current period. Cite ...
description: "Run the Loyalty Churn Prediction Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "loyalty-churn-prediction-agent-end-to-end"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Loyalty Churn Prediction Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_segment_segment_records](/tools/query-segment-segment-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_loyalty_churn_prediction_agent_execution_playbook](/tools/lookup-loyalty-churn-prediction-agent-execution-playbook.md)
- [action_salesforce_commerce_cloud_recommend](/tools/action-salesforce-commerce-cloud-recommend.md)

## Success rubric

Action recommend executed against Salesforce Commerce Cloud, with audit-trail entry and Loyalty Program Manager notified of outcomes.

# Citations

- [Loyalty Churn Prediction Agent Retail Execution Playbook](/documents/loyalty-churn-prediction-agent-execution-playbook.md)
