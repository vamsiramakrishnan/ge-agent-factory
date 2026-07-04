---
type: Eval Scenario
title: "Process order 7412093 (batch 812204) on REACTOR-01 has a scheduled_start of 2..."
description: "Process order 7412093 (batch 812204) on REACTOR-01 has a scheduled_start of 2026-06-28, but the linked production order 1482391 in Opcenter MES still shows order_status 'in_process' with no confirmed_qty as of this morning -- that record is now more than 24 hours old. Before you recommend any resequencing swap around this changeover, tell me whether this evidence is fresh enough to act on and what the SOP says to do with stale changeover evidence."
source_id: "changeover-time-optimization-agent-stale-confirmation-reconciliation"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Process order 7412093 (batch 812204) on REACTOR-01 has a scheduled_start of 2026-06-28, but the linked production order 1482391 in Opcenter MES still shows order_status 'in_process' with no confirmed_qty as of this morning -- that record is now more than 24 hours old. Before you recommend any resequencing swap around this changeover, tell me whether this evidence is fresh enough to act on and what the SOP says to do with stale changeover evidence.

## Validates

- [changeover-log-correlation](/queries/changeover-log-correlation.md)

## Mechanisms to call

- [query_sap_s_4hana_pp_process_orders](/tools/query-sap-s-4hana-pp-process-orders.md)
- [query_siemens_opcenter_mes_production_orders](/tools/query-siemens-opcenter-mes-production-orders.md)
- [lookup_changeover_time_optimization_agent_sop](/tools/lookup-changeover-time-optimization-agent-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Changeover Time Optimization Agent Standard Operating Procedure](/documents/changeover-time-optimization-agent-sop.md)
