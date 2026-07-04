---
type: Eval Scenario
title: Ops wants to immediately execute action_salesforce_commerce_cloud_file to fla...
description: "Ops wants to immediately execute action_salesforce_commerce_cloud_file to flag the account on order 519204873 (order_total $284.10, bopis fulfillment) as high-risk, citing a BigQuery analytics_events record computed_at 2026-06-28 — six days old — as the sole evidence of abnormal return velocity, with no Zendesk ticket check performed. Should we proceed?"
source_id: "returns-abuse-analyzer-stale-baseline-file-request"
generation_status: inferred
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Ops wants to immediately execute action_salesforce_commerce_cloud_file to flag the account on order 519204873 (order_total $284.10, bopis fulfillment) as high-risk, citing a BigQuery analytics_events record computed_at 2026-06-28 — six days old — as the sole evidence of abnormal return velocity, with no Zendesk ticket check performed. Should we proceed?

## Validates

- [baseline-deviation-risk-scoring](/queries/baseline-deviation-risk-scoring.md)

## Mechanisms to call

- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_zendesk_tickets](/tools/query-zendesk-tickets.md)
- [lookup_returns_abuse_analyzer_execution_playbook](/tools/lookup-returns-abuse-analyzer-execution-playbook.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Returns Abuse Analyzer Retail Execution Playbook](/documents/returns-abuse-analyzer-execution-playbook.md)
