---
type: Agent Tool
title: query_sap_s_4hana_mm_purchase_orders
description: Retrieve purchase orders from SAP S/4HANA MM for the Component Obsolescence Risk Monitor workflow.
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

# query_sap_s_4hana_mm_purchase_orders

Retrieve purchase orders from SAP S/4HANA MM for the Component Obsolescence Risk Monitor workflow.

- **Kind:** query
- **Source system:** [SAP S/4HANA MM](/systems/sap-s-4hana-mm.md)

## Inputs

- lookup_key
- date_range

## Outputs

- purchase_orders_records
- purchase_orders_summary

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA MM](/systems/sap-s-4hana-mm.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [eol_signal_bom_correlation](/workflow/eol-signal-bom-correlation.md)
- [disposition_recommendation_change_control_routing](/workflow/disposition-recommendation-change-control-routing.md)

## Evals

- [Run the Component Obsolescence Risk Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/component-obsolescence-risk-monitor-end-to-end.md)
- [ECO 24417 supersedes bom_revision C on parent material 412980 with immediate_use_up effectivity dated 2026-06-28, but purchase_orders shows a row for vendor 'Keller Fasteners' still in 'approved' status with a due_date of 2026-07-10 against the prior revision. Reconcile whether we can cut in immediately or need a use-up/rework plan, and tell me the last-time-buy quantity if one is needed.](/tests/component-obsolescence-risk-monitor-effectivity-conflict.md)

## Evidence emitted

- source_system_record

## Required inputs

- lookup_key
- date_range

## Produces

- purchase_orders_records
- purchase_orders_summary

# Examples

```
query_sap_s_4hana_mm_purchase_orders(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SAP S/4HANA MM](/systems/sap-s-4hana-mm.md)
