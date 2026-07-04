---
type: Agent Tool
title: query_coupa_purchase_orders
description: Query Coupa for PO details and supplier catalog to supplement SAP data and verify vendor eligibility.
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

# query_coupa_purchase_orders

Query Coupa for PO details and supplier catalog to supplement SAP data and verify vendor eligibility.

- **Kind:** query
- **Source system:** [Coupa](/systems/coupa.md)

## Inputs

- po_number
- vendor_id

## Outputs

- coupa_po_data
- supplier_record

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Coupa](/systems/coupa.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

_Not bound to a workflow stage._

## Evals

- [Process invoice INV-2025-0042 (vendor GE Supplier XYZ, amount USD 15,000) against PO PO-2025-1001 and goods receipt GR-2025-5003. The invoice quantity matches GR quantity and amount is within 2% of PO.](/tests/happy-path-three-way-match.md)
- [Process invoice INV-2025-0043 (vendor GE Supplier ABC, amount USD 15,500) against PO PO-2025-1002 (PO amount USD 15,000). The price variance is 3.3%, exceeding the 2% tolerance.](/tests/tolerance-exception-escalation.md)
- [Process invoice INV-2025-0044 (vendor ID unknown, amount USD 8,000) against PO PO-2025-1003. The vendor is not in Coupa supplier catalog.](/tests/vendor-not-found-escalation.md)

## Evidence emitted

- source_system_record

## Required inputs

- po_number
- vendor_id

## Produces

- coupa_po_data
- supplier_record

# Examples

```
query_coupa_purchase_orders(po_number=<po_number>, vendor_id=<vendor_id>)
```

# Citations

- [Coupa](/systems/coupa.md)
