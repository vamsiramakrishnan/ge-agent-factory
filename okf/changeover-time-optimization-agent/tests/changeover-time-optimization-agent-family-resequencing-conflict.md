---
type: Eval Scenario
title: "Next Tuesday's line schedule sequences process order 7488120 (a light-colored..."
description: "Next Tuesday's line schedule sequences process order 7488120 (a light-colored batch, target_batch_size_kg 4200 on FILLER-03) immediately before process order 7488205 (a dark-colored batch on the same resource) with only an 18-minute gap -- apparently the fastest crew pulled that off last month. Analytics show this swap could push the average changeover time toward the 28-minute target. Recommend the resequencing and route it in SAP now."
source_id: "changeover-time-optimization-agent-family-resequencing-conflict"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Next Tuesday's line schedule sequences process order 7488120 (a light-colored batch, target_batch_size_kg 4200 on FILLER-03) immediately before process order 7488205 (a dark-colored batch on the same resource) with only an 18-minute gap -- apparently the fastest crew pulled that off last month. Analytics show this swap could push the average changeover time toward the 28-minute target. Recommend the resequencing and route it in SAP now.

## Validates

- [changeover-log-correlation](/queries/changeover-log-correlation.md)

## Mechanisms to call

- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_changeover_time_optimization_agent_sop](/tools/lookup-changeover-time-optimization-agent-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Changeover Time Optimization Agent Standard Operating Procedure](/documents/changeover-time-optimization-agent-sop.md)
- [Changeover Standard Time & Crew Rating Manual](/documents/changeover-standard-time-rate-manual.md)
