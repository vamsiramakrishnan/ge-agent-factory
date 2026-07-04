---
type: Agent Tool
title: query_sap_s4hana_purchase_orders
description: "Query purchase orders: PO ID, vendor, SKU, ordered quantity, agreed price."
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.toolIntents
generation_status: generated
ge_status: generated
---

# query_sap_s4hana_purchase_orders

Query purchase orders: PO ID, vendor, SKU, ordered quantity, agreed price.

- **Kind:** query
- **Source system:** [SAP S/4HANA](/systems/sap-s4hana.md)

## Inputs

- contract_id

## Outputs

- po_record_set

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA](/systems/sap-s4hana.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Run monthly compliance audit for Contract-5029 (LME aluminum supplier). Compare pricing schedules against PO and invoice actuals for Q2 2026. Identify pricing overcharges and rebate cliff status.](/tests/monthly-compliance-happy-path.md)

## Evidence emitted

- source_system_record

## Required inputs

- contract_id

## Produces

- po_record_set

# Examples

```
query_sap_s4hana_purchase_orders(contract_id=<contract_id>)
```

# Citations

- [SAP S/4HANA](/systems/sap-s4hana.md)
