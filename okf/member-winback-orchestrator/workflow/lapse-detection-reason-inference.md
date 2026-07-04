---
type: Workflow Stage
title: "Lapse Detection & Reason Inference"
description: "Query pos_transactions from Oracle Xstore POS for loyalty_id recency gaps past the 90-day lapse threshold, then cross-reference Segment segment_records and segment_events for store-proximity and browse signals (query_segment_segment_records) to infer whether each lapse looks like moved, channel-switched, or price-churned."
source_id: lapse_detection_reason_inference
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Lapse Detection & Reason Inference

Query pos_transactions from Oracle Xstore POS for loyalty_id recency gaps past the 90-day lapse threshold, then cross-reference Segment segment_records and segment_events for store-proximity and browse signals (query_segment_segment_records) to infer whether each lapse looks like moved, channel-switched, or price-churned.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_oracle_xstore_pos_pos_transactions](/tools/query-oracle-xstore-pos-pos-transactions.md)
- [query_segment_segment_records](/tools/query-segment-segment-records.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_member_winback_orchestrator_execution_playbook](/tools/lookup-member-winback-orchestrator-execution-playbook.md)
- [action_oracle_xstore_pos_generate](/tools/action-oracle-xstore-pos-generate.md)

Next: [Reactivation Value & Offer-Depth Scoring](/workflow/reactivation-value-offer-depth-scoring.md)
