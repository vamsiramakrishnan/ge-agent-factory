---
type: Agent Tool
title: query_sap_s_4hana_pp_process_orders
description: "Retrieve process orders from SAP S/4HANA PP for the BOM PLM-ERP Sync Monitor workflow."
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

# query_sap_s_4hana_pp_process_orders

Retrieve process orders from SAP S/4HANA PP for the BOM PLM-ERP Sync Monitor workflow.

- **Kind:** query
- **Source system:** [SAP S/4HANA PP](/systems/sap-s-4hana-pp.md)

## Inputs

- process_order_number
- batch_number
- date_range

## Outputs

- process_orders_records
- process_orders_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA PP](/systems/sap-s-4hana-pp.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [nightly_eco_bom_extract](/workflow/nightly-eco-bom-extract.md)
- [erp_bom_correlation](/workflow/erp-bom-correlation.md)
- [effectivity_build_risk_scoring](/workflow/effectivity-build-risk-scoring.md)

## Evals

- [Run the BOM PLM-ERP Sync Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/bom-plm-erp-sync-monitor-end-to-end.md)
- [ECO-24187 (change_class: class_1_form_fit_function) released bom_revisions 312044-D with immediate_use_up effectivity dated 2026-06-28, superseding revision C. SAP process order 7412903 (batch 812905) is currently active on REACTOR-01, staged against bom revision C, with material staging 3041207 already at staged_qty 480 of required_qty 500 for material_number 431207. Determine whether this build should proceed and what needs to happen before it does.](/tests/bom-plm-erp-sync-monitor-effectivity-conflict.md)

## Evidence emitted

- source_system_record

## Required inputs

- process_order_number
- batch_number
- date_range

## Produces

- process_orders_records
- process_orders_summary

# Examples

```
query_sap_s_4hana_pp_process_orders(process_order_number=<process_order_number>, batch_number=<batch_number>, date_range=<date_range>)
```

# Citations

- [SAP S/4HANA PP](/systems/sap-s-4hana-pp.md)
