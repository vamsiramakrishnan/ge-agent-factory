---
type: Agent Tool
title: query_sap_s_4hana_mm_fi_purchase_orders
description: Retrieve purchase orders from SAP S/4HANA MM/FI for the Inventory Valuation Agent workflow.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_sap_s_4hana_mm_fi_purchase_orders

Retrieve purchase orders from SAP S/4HANA MM/FI for the Inventory Valuation Agent workflow.

- **Kind:** query
- **Source system:** [SAP S/4HANA MM/FI](/systems/sap-s-4hana-mm-fi.md)

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

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA MM/FI](/systems/sap-s-4hana-mm-fi.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run the Inventory Valuation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/inventory-valuation-agent-end-to-end.md)

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
query_sap_s_4hana_mm_fi_purchase_orders(lookup_key=<lookup_key>, date_range=<date_range>)
```

# Citations

- [SAP S/4HANA MM/FI](/systems/sap-s-4hana-mm-fi.md)
