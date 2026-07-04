---
type: Agent Tool
title: query_sap_s4hana_goods_receipts
description: "Retrieve goods receipt data (GR number, received quantities, receipt date) to validate physical delivery against the invoice."
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

# query_sap_s4hana_goods_receipts

Retrieve goods receipt data (GR number, received quantities, receipt date) to validate physical delivery against the invoice.

- **Kind:** query
- **Source system:** [SAP S/4HANA](/systems/sap-s4hana.md)

## Inputs

- po_number

## Outputs

- gr_record
- gr_line_items

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

- [three_way_matching](/workflow/three-way-matching.md)
- [posting_payment_queue](/workflow/posting-payment-queue.md)

## Evals

- [Process invoice INV-2025-0042 (vendor GE Supplier XYZ, amount USD 15,000) against PO PO-2025-1001 and goods receipt GR-2025-5003. The invoice quantity matches GR quantity and amount is within 2% of PO.](/tests/happy-path-three-way-match.md)

## Evidence emitted

- source_system_record

## Required inputs

- po_number

## Produces

- gr_record
- gr_line_items

# Examples

```
query_sap_s4hana_goods_receipts(po_number=<po_number>)
```

# Citations

- [SAP S/4HANA](/systems/sap-s4hana.md)
