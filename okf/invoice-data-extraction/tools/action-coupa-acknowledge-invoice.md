---
type: Agent Tool
title: action_coupa_acknowledge_invoice
description: Send invoice acknowledgment to Coupa for supplier portal visibility.
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

# action_coupa_acknowledge_invoice

Send invoice acknowledgment to Coupa for supplier portal visibility.

- **Kind:** action
- **Source system:** [Coupa](/systems/coupa.md)
- **API:** POST /systems/sap-s4hana/invoices

## Inputs

- invoice_id
- sap_invoice_id

## Outputs

- ack_status

## Side Effects

- May change Coupa state because the spec classifies it as action.

## Idempotency

No idempotency key is declared in the spec or matched API; require one before production writes.

## Confirmation

- [Confirmation policy — action_coupa_acknowledge_invoice](/policies/confirmation-action-coupa-acknowledge-invoice.md)

## Permissions

No explicit permission scopes declared; source-system access is tied to [Coupa](/systems/coupa.md).

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

## Required inputs

- invoice_id
- sap_invoice_id

## Produces

- ack_status

# Examples

```
action_coupa_acknowledge_invoice(invoice_id=<invoice_id>, sap_invoice_id=<sap_invoice_id>)
```

# Citations

- [Coupa](/systems/coupa.md)
- [Confirmation policy — action_coupa_acknowledge_invoice](/policies/confirmation-action-coupa-acknowledge-invoice.md)
