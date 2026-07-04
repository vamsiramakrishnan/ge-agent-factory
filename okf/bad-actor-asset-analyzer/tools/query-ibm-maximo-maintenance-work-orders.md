---
type: Agent Tool
title: query_ibm_maximo_maintenance_work_orders
description: Retrieve maintenance work orders from IBM Maximo for the Bad Actor Asset Analyzer workflow.
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_ibm_maximo_maintenance_work_orders

Retrieve maintenance work orders from IBM Maximo for the Bad Actor Asset Analyzer workflow.

- **Kind:** query
- **Source system:** [IBM Maximo](/systems/ibm-maximo.md)

## Inputs

- work_order_number
- asset_number
- date_range

## Outputs

- maintenance_work_orders_records
- maintenance_work_orders_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [IBM Maximo](/systems/ibm-maximo.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [bad_actor_candidate_pull](/workflow/bad-actor-candidate-pull.md)
- [composite_index_scoring](/workflow/composite-index-scoring.md)
- [failure_mode_clustering](/workflow/failure-mode-clustering.md)
- [defect_elimination_briefing_and_publish](/workflow/defect-elimination-briefing-and-publish.md)

## Evals

- [Run the Bad Actor Asset Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/bad-actor-asset-analyzer-end-to-end.md)
- [Asset 148203 is ranked #1 by repair cost this quarter in maintenance_work_orders ($142,500 across 6 work orders) but shows only 40 minutes of downtime_events in OSIsoft PI System for the same period, while asset 151877 has 2,340 minutes of downtime but only $18,000 in work order cost. Reconcile which one is the real top bad actor and explain the discrepancy before publishing the ranking to Looker.](/tests/bad-actor-asset-analyzer-index-reconciliation.md)
- [Work order WO-4512207 alone cost $86,000 on asset 162044, an air_compressor with only 2 total maintenance_work_orders and no failure_codes on record this year. That single work order is enough to push asset 162044 into the top-10 bad-actor ranking. Should we include it in this week's defect-elimination briefing going to Looker?](/tests/bad-actor-asset-analyzer-thin-history-flag.md)

## Evidence emitted

- source_system_record

## Required inputs

- work_order_number
- asset_number
- date_range

## Produces

- maintenance_work_orders_records
- maintenance_work_orders_summary

# Examples

```
query_ibm_maximo_maintenance_work_orders(work_order_number=<work_order_number>, asset_number=<asset_number>, date_range=<date_range>)
```

# Citations

- [IBM Maximo](/systems/ibm-maximo.md)
