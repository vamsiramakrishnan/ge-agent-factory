---
type: Eval Scenario
title: "Member jane.holloway@example.com (segment_records id SR-4821) shows a 'closed..."
description: "Member jane.holloway@example.com (segment_records id SR-4821) shows a 'closed' status as of 2026-06-28 in Segment, but Salesforce Commerce Cloud cart_events logs show 3 abandon_cart events between 2026-06-29 and 2026-07-02 totaling $612.40 in cart_value, and online_orders shows her last completed order (order_number 504218890) on 2026-05-14 for $184.20. Score her lapse risk for this week's run and recommend the save treatment."
source_id: "loyalty-churn-prediction-agent-conflicting-engagement-signal"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Member jane.holloway@example.com (segment_records id SR-4821) shows a 'closed' status as of 2026-06-28 in Segment, but Salesforce Commerce Cloud cart_events logs show 3 abandon_cart events between 2026-06-29 and 2026-07-02 totaling $612.40 in cart_value, and online_orders shows her last completed order (order_number 504218890) on 2026-05-14 for $184.20. Score her lapse risk for this week's run and recommend the save treatment.

## Validates

- [member-signal-ingestion](/queries/member-signal-ingestion.md)

## Mechanisms to call

- [query_segment_segment_records](/tools/query-segment-segment-records.md)
- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_loyalty_churn_prediction_agent_execution_playbook](/tools/lookup-loyalty-churn-prediction-agent-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Loyalty Churn Prediction Agent Retail Execution Playbook](/documents/loyalty-churn-prediction-agent-execution-playbook.md)
