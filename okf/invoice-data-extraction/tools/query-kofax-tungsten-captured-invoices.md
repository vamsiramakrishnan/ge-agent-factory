---
type: Agent Tool
title: query_kofax_tungsten_captured_invoices
description: Retrieve captured invoice images and metadata from Kofax/Tungsten for initial classification and routing.
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

# query_kofax_tungsten_captured_invoices

Retrieve captured invoice images and metadata from Kofax/Tungsten for initial classification and routing.

- **Kind:** query
- **Source system:** [Kofax/Tungsten](/systems/kofax-tungsten.md)

## Inputs

- invoice_id
- date_range

## Outputs

- captured_invoice
- source_channel
- format_type

## Side Effects

- No mutation is declared by the spec for this tool.

## Idempotency

No idempotency key declared; no mutation is declared by the spec for this tool.

## Confirmation

No write confirmation policy is derivable from the spec.

## Permissions

No explicit permission scopes declared; source-system access is tied to [Kofax/Tungsten](/systems/kofax-tungsten.md).

## Failure Modes

No explicit failure modes are declared in the spec; rely on refusal/escalation policies for unsafe or incomplete evidence.

## Used By

- [invoice_ingestion_classification](/workflow/invoice-ingestion-classification.md)
- [llm_interpretation_entity_resolution](/workflow/llm-interpretation-entity-resolution.md)
- [validation_posting](/workflow/validation-posting.md)

## Evals

- [Process invoice INV-2024-05001 from Acme Corp, amount $5,000, dated 2024-05-20, PO# PO-98765. All fields clearly readable.](/tests/clean-ocr-happy-path.md)
- [Process handwritten invoice from supplier, vendor name unclear ('Acme' or 'Acme Industries?'), quantity written as 'approx 50 cases'. OCR confidence 0.55 on vendor field, 0.62 on quantity.](/tests/handwritten-llm-fallback.md)

## Evidence emitted

- source_system_record

## Required inputs

- invoice_id
- date_range

## Produces

- captured_invoice
- source_channel
- format_type

# Examples

```
query_kofax_tungsten_captured_invoices(invoice_id=<invoice_id>, date_range=<date_range>)
```

# Citations

- [Kofax/Tungsten](/systems/kofax-tungsten.md)
