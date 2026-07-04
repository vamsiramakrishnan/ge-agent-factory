---
type: Agent Tool
title: action_sap_s4hana_post_invoice
description: "Post a three-way-matched invoice to SAP MIRO and create a payment queue record; returns MIRO document number and audit trail."
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

# action_sap_s4hana_post_invoice

Post a three-way-matched invoice to SAP MIRO and create a payment queue record; returns MIRO document number and audit trail.

- **Kind:** action
- **Source system:** [SAP S/4HANA](/systems/sap-s4hana.md)
- **API:** POST /systems/sap-s4hana/invoices

## Inputs

- invoice_id
- po_number
- vendor_id
- amount

## Outputs

- miro_document_number
- payment_queue_id
- audit_trail

## Side Effects

- May change SAP S/4HANA state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_sap_s4hana_post_invoice](/policies/confirmation-action-sap-s4hana-post-invoice.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [SAP S/4HANA](/systems/sap-s4hana.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [invoice_ingestion_ocr](/workflow/invoice-ingestion-ocr.md)
- [three_way_matching](/workflow/three-way-matching.md)
- [non_standard_interpretation](/workflow/non-standard-interpretation.md)
- [posting_payment_queue](/workflow/posting-payment-queue.md)

## Evals

- [Process invoice INV-2025-0042 (vendor GE Supplier XYZ, amount USD 15,000) against PO PO-2025-1001 and goods receipt GR-2025-5003. The invoice quantity matches GR quantity and amount is within 2% of PO.](/tests/happy-path-three-way-match.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- invoice_id
- po_number
- vendor_id
- amount

## Produces

- miro_document_number
- payment_queue_id
- audit_trail

# Examples

```
action_sap_s4hana_post_invoice(invoice_id=<invoice_id>, po_number=<po_number>, vendor_id=<vendor_id>, amount=<amount>)
```

# Citations

- [SAP S/4HANA](/systems/sap-s4hana.md)
- [Confirmation policy — action_sap_s4hana_post_invoice](/policies/confirmation-action-sap-s4hana-post-invoice.md)
