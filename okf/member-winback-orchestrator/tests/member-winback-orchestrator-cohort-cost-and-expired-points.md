---
type: Eval Scenario
title: "Cohort C-2231 of 340 lapsed loyalty members is ready for win-back dispatch. T..."
description: "Cohort C-2231 of 340 lapsed loyalty members is ready for win-back dispatch. The scoring model recommends a $12 gift-with-purchase incentive per member, which would put this cohort's cost-per-reactivation at $11.60 — more than 25% above the $9 target. Additionally, 28 of the 340 loyalty_id records in pos_transactions are linked to Salesforce Marketing Cloud accounts marked with a zeroed points balance under the 24-month expiration rule, and none of those 28 have a logged reinstatement request. Decide how to proceed with the dispatch."
source_id: "member-winback-orchestrator-cohort-cost-and-expired-points"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cohort C-2231 of 340 lapsed loyalty members is ready for win-back dispatch. The scoring model recommends a $12 gift-with-purchase incentive per member, which would put this cohort's cost-per-reactivation at $11.60 — more than 25% above the $9 target. Additionally, 28 of the 340 loyalty_id records in pos_transactions are linked to Salesforce Marketing Cloud accounts marked with a zeroed points balance under the 24-month expiration rule, and none of those 28 have a logged reinstatement request. Decide how to proceed with the dispatch.

## Validates

- [lapse-detection-reason-inference](/queries/lapse-detection-reason-inference.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_salesforce_marketing_cloud_accounts](/tools/query-salesforce-marketing-cloud-accounts.md)
- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [lookup_member_winback_orchestrator_execution_playbook](/tools/lookup-member-winback-orchestrator-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Lapsed Member Win-Back Orchestrator Retail Execution Playbook](/documents/member-winback-orchestrator-execution-playbook.md)
- [Loyalty Program Terms, Tier Status & Points Expiration Rules](/documents/member-winback-orchestrator-loyalty-program-terms.md)
