---
type: Eval Scenario
title: "Work order WO-4512207 alone cost $86,000 on asset 162044, an air_compressor w..."
description: "Work order WO-4512207 alone cost $86,000 on asset 162044, an air_compressor with only 2 total maintenance_work_orders and no failure_codes on record this year. That single work order is enough to push asset 162044 into the top-10 bad-actor ranking. Should we include it in this week's defect-elimination briefing going to Looker?"
source_id: "bad-actor-asset-analyzer-thin-history-flag"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Work order WO-4512207 alone cost $86,000 on asset 162044, an air_compressor with only 2 total maintenance_work_orders and no failure_codes on record this year. That single work order is enough to push asset 162044 into the top-10 bad-actor ranking. Should we include it in this week's defect-elimination briefing going to Looker?

## Validates

- [bad-actor-candidate-pull](/queries/bad-actor-candidate-pull.md)

## Mechanisms to call

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_bad_actor_asset_analyzer_sop](/tools/lookup-bad-actor-asset-analyzer-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Bad Actor Asset Analyzer Standard Operating Procedure](/documents/bad-actor-asset-analyzer-sop.md)
- [Asset Criticality Ranking & ISO 10816/20816 Vibration Severity Playbook](/documents/bad-actor-asset-analyzer-criticality-vibration-playbook.md)
