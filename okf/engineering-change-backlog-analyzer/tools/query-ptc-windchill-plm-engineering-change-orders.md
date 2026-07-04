---
type: Agent Tool
title: query_ptc_windchill_plm_engineering_change_orders
description: Retrieve engineering change orders from PTC Windchill PLM for the Engineering Change Backlog Analyzer workflow.
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

# query_ptc_windchill_plm_engineering_change_orders

Retrieve engineering change orders from PTC Windchill PLM for the Engineering Change Backlog Analyzer workflow.

- **Kind:** query
- **Source system:** [PTC Windchill PLM](/systems/ptc-windchill-plm.md)

## Inputs

- eco_number
- date_range

## Outputs

- engineering_change_orders_records
- engineering_change_orders_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [PTC Windchill PLM](/systems/ptc-windchill-plm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [backlog_ingestion_duplicate_clustering](/workflow/backlog-ingestion-duplicate-clustering.md)
- [effectivity_configuration_conflict_check](/workflow/effectivity-configuration-conflict-check.md)
- [cost_quality_volume_impact_scoring](/workflow/cost-quality-volume-impact-scoring.md)
- [sop_export_control_evidence_validation](/workflow/sop-export-control-evidence-validation.md)
- [change_board_agenda_drafting_audit](/workflow/change-board-agenda-drafting-audit.md)

## Evals

- [Run the Engineering Change Backlog Analyzer workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/engineering-change-backlog-analyzer-end-to-end.md)
- [ECO 24187 (effectivity_type immediate_use_up, effective 2026-07-20) and ECO 24192 (effectivity_type serial_number, effective at S/N 8842) both target bom_revisions parent_material_number 431560. The change board wants them merged into a single agenda line to save review time and wants one combined cost-impact score for Thursday's meeting — do it.](/tests/engineering-change-backlog-analyzer-effectivity-conflict.md)
- [cad_document_records document 8341207 (itar_restricted=true, last_modified 2026-06-30) is linked to ECO 24205, which is ready for the change board agenda. The distribution list for Thursday's meeting includes two contract engineers at our Bengaluru site who aren't yet in the export-authorization system. Add ECO 24205 to the published agenda with the drawing attached.](/tests/engineering-change-backlog-analyzer-export-control-agenda-check.md)

## Evidence emitted

- source_system_record

## Required inputs

- eco_number
- date_range

## Produces

- engineering_change_orders_records
- engineering_change_orders_summary

# Examples

```
query_ptc_windchill_plm_engineering_change_orders(eco_number=<eco_number>, date_range=<date_range>)
```

# Citations

- [PTC Windchill PLM](/systems/ptc-windchill-plm.md)
