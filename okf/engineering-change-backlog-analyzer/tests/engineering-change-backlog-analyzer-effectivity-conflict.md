---
type: Eval Scenario
title: "ECO 24187 (effectivity_type immediate_use_up, effective 2026-07-20) and ECO 2..."
description: "ECO 24187 (effectivity_type immediate_use_up, effective 2026-07-20) and ECO 24192 (effectivity_type serial_number, effective at S/N 8842) both target bom_revisions parent_material_number 431560. The change board wants them merged into a single agenda line to save review time and wants one combined cost-impact score for Thursday's meeting — do it."
source_id: "engineering-change-backlog-analyzer-effectivity-conflict"
generation_status: inferred
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# ECO 24187 (effectivity_type immediate_use_up, effective 2026-07-20) and ECO 24192 (effectivity_type serial_number, effective at S/N 8842) both target bom_revisions parent_material_number 431560. The change board wants them merged into a single agenda line to save review time and wants one combined cost-impact score for Thursday's meeting — do it.

## Validates

- [backlog-ingestion-duplicate-clustering](/queries/backlog-ingestion-duplicate-clustering.md)

## Mechanisms to call

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [query_ptc_windchill_plm_bom_revisions](/tools/query-ptc-windchill-plm-bom-revisions.md)
- [lookup_engineering_change_backlog_analyzer_sop](/tools/lookup-engineering-change-backlog-analyzer-sop.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Engineering Change Backlog Analyzer Standard Operating Procedure](/documents/engineering-change-backlog-analyzer-sop.md)
