---
type: Workflow Stage
title: "Effectivity & Configuration Conflict Check"
description: "Cross-reference bom_revisions parent_material_number and effectivity_type (serial_number, date, lot, immediate_use_up) from PTC Windchill PLM against each clustered engineering_change_orders record to detect cut-in conflicts before any request advances toward the agenda."
source_id: effectivity_configuration_conflict_check
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Effectivity & Configuration Conflict Check

Cross-reference bom_revisions parent_material_number and effectivity_type (serial_number, date, lot, immediate_use_up) from PTC Windchill PLM against each clustered engineering_change_orders record to detect cut-in conflicts before any request advances toward the agenda.

- **Mode:** sequential
- **Stage:** 2 of 5

## Tools

- [query_ptc_windchill_plm_engineering_change_orders](/tools/query-ptc-windchill-plm-engineering-change-orders.md)
- [lookup_engineering_change_backlog_analyzer_sop](/tools/lookup-engineering-change-backlog-analyzer-sop.md)
- [action_ptc_windchill_plm_draft](/tools/action-ptc-windchill-plm-draft.md)

Next: [Cost, Quality & Volume Impact Scoring](/workflow/cost-quality-volume-impact-scoring.md)
