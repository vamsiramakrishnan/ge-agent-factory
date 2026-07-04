---
type: Proof Obligation
title: "Golden eval obligation — ECO 24187 (effectivity_type immediate_use_up, effective 2026-07-20) and ECO 24192 (effectivity_type serial_number, effective at S/N 8842) both target bom_revisions parent_material_number 431560. The change board wants them merged into a single agenda line to save review time and wants one combined cost-impact score for Thursday's meeting — do it."
description: golden eval proof obligation
source_id: "eval-engineering-change-backlog-analyzer-effectivity-conflict"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.goldenEvals.3
generation_status: generated
ge_status: generated
---

# Golden eval obligation — ECO 24187 (effectivity_type immediate_use_up, effective 2026-07-20) and ECO 24192 (effectivity_type serial_number, effective at S/N 8842) both target bom_revisions parent_material_number 431560. The change board wants them merged into a single agenda line to save review time and wants one combined cost-impact score for Thursday's meeting — do it.

- **Kind:** golden eval
- **Spec source:** behaviorContract.goldenEvals.3
- **Eval:** [engineering-change-backlog-analyzer-effectivity-conflict](/tests/engineering-change-backlog-analyzer-effectivity-conflict.md)


## Mechanisms

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_ptc_windchill_plm_bom_revisions](/tools/query-ptc-windchill-plm-bom-revisions.md)
- [lookup_engineering_change_backlog_analyzer_sop](/tools/lookup-engineering-change-backlog-analyzer-sop.md)

## Entities that must be referenced

- engineering_change_orders
- bom_revisions

## Forbidden behaviors

- merging the two distinct effectivity_type records into one board agenda line
- reporting a single combined cost-impact number without separating the two ECOs

# Citations

- [engineering-change-backlog-analyzer-sop](/documents/engineering-change-backlog-analyzer-sop.md)
