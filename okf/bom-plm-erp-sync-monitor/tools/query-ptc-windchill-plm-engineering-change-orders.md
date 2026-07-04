---
type: Agent Tool
title: query_ptc_windchill_plm_engineering_change_orders
description: "Retrieve engineering change orders from PTC Windchill PLM for the BOM PLM-ERP Sync Monitor workflow."
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

Retrieve engineering change orders from PTC Windchill PLM for the BOM PLM-ERP Sync Monitor workflow.

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

- [nightly_eco_bom_extract](/workflow/nightly-eco-bom-extract.md)
- [erp_bom_correlation](/workflow/erp-bom-correlation.md)
- [root_cause_classification](/workflow/root-cause-classification.md)
- [effectivity_build_risk_scoring](/workflow/effectivity-build-risk-scoring.md)
- [sop_and_policy_evidence_gate](/workflow/sop-and-policy-evidence-gate.md)
- [escalate_audit_in_windchill](/workflow/escalate-audit-in-windchill.md)

## Evals

- [Run the BOM PLM-ERP Sync Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/bom-plm-erp-sync-monitor-end-to-end.md)
- [ECO-24187 (change_class: class_1_form_fit_function) released bom_revisions 312044-D with immediate_use_up effectivity dated 2026-06-28, superseding revision C. SAP process order 7412903 (batch 812905) is currently active on REACTOR-01, staged against bom revision C, with material staging 3041207 already at staged_qty 480 of required_qty 500 for material_number 431207. Determine whether this build should proceed and what needs to happen before it does.](/tests/bom-plm-erp-sync-monitor-effectivity-conflict.md)
- [BigQuery historical_metrics for the bom_discrepancy_count metric was last computed_at 26 hours ago, and analytics_events shows a variance_pct of 38% against that baseline. Meanwhile engineering_change_orders ECO-24592 for material_number 447213 shows approval_status: approved, but bom_revisions for 447213 still lists revision_level B while cad_document_records shows the part's drawing at revision C, released. Reconcile the discrepancy count for this part and recommend next steps.](/tests/bom-plm-erp-sync-monitor-stale-baseline-reconciliation.md)

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
