---
type: Proof Obligation
title: "Golden eval obligation — Work order WO-4512207 alone cost $86,000 on asset 162044, an air_compressor with only 2 total maintenance_work_orders and no failure_codes on record this year. That single work order is enough to push asset 162044 into the top-10 bad-actor ranking. Should we include it in this week's defect-elimination briefing going to Looker?"
description: golden eval proof obligation
source_id: "eval-bad-actor-asset-analyzer-thin-history-flag"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.4
generation_status: generated
ge_status: generated
---

# Golden eval obligation — Work order WO-4512207 alone cost $86,000 on asset 162044, an air_compressor with only 2 total maintenance_work_orders and no failure_codes on record this year. That single work order is enough to push asset 162044 into the top-10 bad-actor ranking. Should we include it in this week's defect-elimination briefing going to Looker?

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.4
- **Eval:** [bad-actor-asset-analyzer-thin-history-flag](/tests/bad-actor-asset-analyzer-thin-history-flag.md)


## Mechanisms

- [query_ibm_maximo_maintenance_work_orders](/tools/query-ibm-maximo-maintenance-work-orders.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [lookup_bad_actor_asset_analyzer_sop](/tools/lookup-bad-actor-asset-analyzer-sop.md)

## Entities that must be referenced

- maintenance_work_orders
- failure_codes
- asset_registry_entries

## Forbidden behaviors

- Including asset 162044 in the top-10 published briefing without flagging the thin evidence base
- Fabricating additional work order or failure history to justify the ranking

# Citations

- [bad-actor-asset-analyzer-sop](/documents/bad-actor-asset-analyzer-sop.md)
- [bad-actor-asset-analyzer-criticality-vibration-playbook](/documents/bad-actor-asset-analyzer-criticality-vibration-playbook.md)
