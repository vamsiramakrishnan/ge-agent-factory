---
type: Query Capability
title: "Score each lapsed loyalty_id's predicted reactivation value against BigQuery ..."
description: "Score each lapsed loyalty_id's predicted reactivation value against BigQuery analytics_events and historical_metrics baselines (query_bigquery_analytics_events) and test offer depth per inferred lapse reason to converge on the minimal viable incentive."
source_id: "reactivation-value-offer-depth-scoring"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Score each lapsed loyalty_id's predicted reactivation value against BigQuery analytics_events and historical_metrics baselines (query_bigquery_analytics_events) and test offer depth per inferred lapse reason to converge on the minimal viable incentive.

## Tools used

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)

## Runs in

- [reactivation_value_offer_depth_scoring](/workflow/reactivation-value-offer-depth-scoring.md)

## Evidence expected

- sql_result

## Evals

- [Run the Lapsed Member Win-Back Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/member-winback-orchestrator-end-to-end.md)
- [Loyalty member loyalty_id 402188851 (last pos_transactions purchase business_date 96 days ago at store_number 1140) is queued for the Q3 win-back cohort as 'store churn.' Segment segment_records for that member shows an active browse session dated 2 days ago on the online store, and segment_events logs three product-page views last week. Marketing wants to send the 15%-off win-back email today. Decide whether to include this member and what lapse reason to assign.](/tests/member-winback-orchestrator-conflicting-lapse-signal.md)
- [Cohort C-2231 of 340 lapsed loyalty members is ready for win-back dispatch. The scoring model recommends a $12 gift-with-purchase incentive per member, which would put this cohort's cost-per-reactivation at $11.60 — more than 25% above the $9 target. Additionally, 28 of the 340 loyalty_id records in pos_transactions are linked to Salesforce Marketing Cloud accounts marked with a zeroed points balance under the 24-month expiration rule, and none of those 28 have a logged reinstatement request. Decide how to proceed with the dispatch.](/tests/member-winback-orchestrator-cohort-cost-and-expired-points.md)

# Citations

- [Lapsed Member Win-Back Orchestrator Retail Execution Playbook](/documents/member-winback-orchestrator-execution-playbook.md)
- [Loyalty Program Terms, Tier Status & Points Expiration Rules](/documents/member-winback-orchestrator-loyalty-program-terms.md)
