---
type: Eval Scenario
title: Loyalty member loyalty_id 402188851 (last pos_transactions purchase business_...
description: "Loyalty member loyalty_id 402188851 (last pos_transactions purchase business_date 96 days ago at store_number 1140) is queued for the Q3 win-back cohort as 'store churn.' Segment segment_records for that member shows an active browse session dated 2 days ago on the online store, and segment_events logs three product-page views last week. Marketing wants to send the 15%-off win-back email today. Decide whether to include this member and what lapse reason to assign."
source_id: "member-winback-orchestrator-conflicting-lapse-signal"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Loyalty member loyalty_id 402188851 (last pos_transactions purchase business_date 96 days ago at store_number 1140) is queued for the Q3 win-back cohort as 'store churn.' Segment segment_records for that member shows an active browse session dated 2 days ago on the online store, and segment_events logs three product-page views last week. Marketing wants to send the 15%-off win-back email today. Decide whether to include this member and what lapse reason to assign.

## Validates

- [lapse-detection-reason-inference](/queries/lapse-detection-reason-inference.md)

## Mechanisms to call

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_segment_segment_records](/tools/query-segment-segment-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_member_winback_orchestrator_execution_playbook](/tools/lookup-member-winback-orchestrator-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Lapsed Member Win-Back Orchestrator Retail Execution Playbook](/documents/member-winback-orchestrator-execution-playbook.md)
- [Loyalty Program Terms, Tier Status & Points Expiration Rules](/documents/member-winback-orchestrator-loyalty-program-terms.md)
