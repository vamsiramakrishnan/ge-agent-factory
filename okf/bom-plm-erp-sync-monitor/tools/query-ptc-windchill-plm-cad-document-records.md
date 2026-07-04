---
type: Agent Tool
title: query_ptc_windchill_plm_cad_document_records
description: "Retrieve cad document records from PTC Windchill PLM for the BOM PLM-ERP Sync Monitor workflow."
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

# query_ptc_windchill_plm_cad_document_records

Retrieve cad document records from PTC Windchill PLM for the BOM PLM-ERP Sync Monitor workflow.

- **Kind:** query
- **Source system:** [PTC Windchill PLM](/systems/ptc-windchill-plm.md)

## Inputs

- document_number
- date_range

## Outputs

- cad_document_records_records

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

_Not bound to a workflow stage._

## Evals

- [BigQuery historical_metrics for the bom_discrepancy_count metric was last computed_at 26 hours ago, and analytics_events shows a variance_pct of 38% against that baseline. Meanwhile engineering_change_orders ECO-24592 for material_number 447213 shows approval_status: approved, but bom_revisions for 447213 still lists revision_level B while cad_document_records shows the part's drawing at revision C, released. Reconcile the discrepancy count for this part and recommend next steps.](/tests/bom-plm-erp-sync-monitor-stale-baseline-reconciliation.md)

## Evidence emitted

- source_system_record

## Required inputs

- document_number
- date_range

## Produces

- cad_document_records_records

# Examples

```
query_ptc_windchill_plm_cad_document_records(document_number=<document_number>, date_range=<date_range>)
```

# Citations

- [PTC Windchill PLM](/systems/ptc-windchill-plm.md)
