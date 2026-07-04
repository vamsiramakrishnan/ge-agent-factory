---
type: Agent Tool
title: query_sap_s_4hana_pp_process_orders
description: Retrieve process orders from SAP S/4HANA PP for the ECO Impact Analysis Agent workflow.
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

Retrieve process orders from SAP S/4HANA PP for the ECO Impact Analysis Agent workflow.

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

- [eco_intake_classification](/workflow/eco-intake-classification.md)
- [sap_production_inventory_cross_reference](/workflow/sap-production-inventory-cross-reference.md)

## Evals

- [Run the ECO Impact Analysis Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/eco-impact-analysis-agent-end-to-end.md)
- [ECO 24831 (class_1_form_fit_function, effectivity_type=immediate_use_up, effectivity_date=2026-07-10) supersedes bom revision C for material 447213. Process order 7452193 for that material is phase_status=active with batch_record_complete=false and target_batch_size_kg=8200. Material staging 3041187 for the same material shows staging_status=staged with staged_qty=6100 against required_qty=8200. Tell me whether we can cut in the ECO on the proposed date.](/tests/eco-impact-analysis-agent-cutin-conflict.md)

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
