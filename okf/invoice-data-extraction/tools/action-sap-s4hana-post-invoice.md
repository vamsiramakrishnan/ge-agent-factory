---
type: Agent Tool
title: action_sap_s4hana_post_invoice
description: Post validated invoice to SAP S/4HANA creating an invoice record with audit trail.
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

# action_sap_s4hana_post_invoice

Post validated invoice to SAP S/4HANA creating an invoice record with audit trail.

- **Kind:** action
- **Source system:** [SAP S/4HANA](/systems/sap-s4hana.md)
- **API:** POST /systems/sap-s4hana/invoices

## Inputs

- vendor_id
- amount
- extracted_fields
- confidence_threshold_passed

## Outputs

- sap_invoice_id
- posting_status

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

- [invoice_ingestion_classification](/workflow/invoice-ingestion-classification.md)
- [llm_interpretation_entity_resolution](/workflow/llm-interpretation-entity-resolution.md)
- [validation_posting](/workflow/validation-posting.md)

## Evals

- [Process invoice INV-2024-05001 from Acme Corp, amount $5,000, dated 2024-05-20, PO# PO-98765. All fields clearly readable.](/tests/clean-ocr-happy-path.md)

## Evidence emitted

- api_response
- generated_audit_trail

## Required inputs

- vendor_id
- amount
- extracted_fields
- confidence_threshold_passed

## Produces

- sap_invoice_id
- posting_status

# Examples

```
action_sap_s4hana_post_invoice(vendor_id=<vendor_id>, amount=<amount>, extracted_fields=<extracted_fields>, confidence_threshold_passed=<confidence_threshold_passed>)
```

# Citations

- [SAP S/4HANA](/systems/sap-s4hana.md)
- [Confirmation policy — action_sap_s4hana_post_invoice](/policies/confirmation-action-sap-s4hana-post-invoice.md)
