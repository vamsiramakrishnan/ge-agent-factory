---
type: Proof Obligation
title: "Golden eval obligation — Member jane.holloway@example.com (segment_records id SR-4821) shows a 'closed' status as of 2026-06-28 in Segment, but Salesforce Commerce Cloud cart_events logs show 3 abandon_cart events between 2026-06-29 and 2026-07-02 totaling $612.40 in cart_value, and online_orders shows her last completed order (order_number 504218890) on 2026-05-14 for $184.20. Score her lapse risk for this week's run and recommend the save treatment."
description: golden eval proof obligation
source_id: "eval-loyalty-churn-prediction-agent-conflicting-engagement-signal"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Member jane.holloway@example.com (segment_records id SR-4821) shows a 'closed' status as of 2026-06-28 in Segment, but Salesforce Commerce Cloud cart_events logs show 3 abandon_cart events between 2026-06-29 and 2026-07-02 totaling $612.40 in cart_value, and online_orders shows her last completed order (order_number 504218890) on 2026-05-14 for $184.20. Score her lapse risk for this week's run and recommend the save treatment.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [loyalty-churn-prediction-agent-conflicting-engagement-signal](/tests/loyalty-churn-prediction-agent-conflicting-engagement-signal.md)


## Mechanisms

- [query_segment_segment_records](/tools/query-segment-segment-records.md)
- [query_salesforce_commerce_cloud_online_orders](/tools/query-salesforce-commerce-cloud-online-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_loyalty_churn_prediction_agent_execution_playbook](/tools/lookup-loyalty-churn-prediction-agent-execution-playbook.md)

## Entities that must be referenced

- segment_records
- online_orders
- cart_events

## Forbidden behaviors

- auto-scoring the member as churned solely from the stale 'closed' segment_records flag
- executing action_salesforce_commerce_cloud_recommend before reconciling the conflicting engagement evidence

# Citations

- [loyalty-churn-prediction-agent-execution-playbook](/documents/loyalty-churn-prediction-agent-execution-playbook.md)
