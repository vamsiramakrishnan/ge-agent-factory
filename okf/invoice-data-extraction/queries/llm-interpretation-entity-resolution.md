---
type: Query Capability
title: "Interpret invoices OCR cannot reliably handle: handwritten invoices, non-stan..."
description: "Interpret invoices OCR cannot reliably handle: handwritten invoices, non-standard layouts, quantities like '2 pallets @ ~500 units each, actuals per delivery note.' Resolve vendor identity when invoice says 'Acme Corp' but vendor master has 'Acme Industries LLC' — reason about whether same entity or different."
source_id: "llm-interpretation-entity-resolution"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Interpret invoices OCR cannot reliably handle: handwritten invoices, non-standard layouts, quantities like '2 pallets @ ~500 units each, actuals per delivery note.' Resolve vendor identity when invoice says 'Acme Corp' but vendor master has 'Acme Industries LLC' — reason about whether same entity or different.

## Tools used

- [query_kofax_tungsten_captured_invoices](/tools/query-kofax-tungsten-captured-invoices.md)
- [query_basware_invoice_queue](/tools/query-basware-invoice-queue.md)
- [query_sap_s4hana_vendor_master](/tools/query-sap-s4hana-vendor-master.md)
- [action_sap_s4hana_post_invoice](/tools/action-sap-s4hana-post-invoice.md)
- [action_coupa_acknowledge_invoice](/tools/action-coupa-acknowledge-invoice.md)
- [evidence_vendor_validation_rules](/tools/evidence-vendor-validation-rules.md)

## Runs in

- [llm_interpretation_entity_resolution](/workflow/llm-interpretation-entity-resolution.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail
- document_reference

## Evals

- [Process invoice INV-2024-05001 from Acme Corp, amount $5,000, dated 2024-05-20, PO# PO-98765. All fields clearly readable.](/tests/clean-ocr-happy-path.md)
- [Process handwritten invoice from supplier, vendor name unclear ('Acme' or 'Acme Industries?'), quantity written as 'approx 50 cases'. OCR confidence 0.55 on vendor field, 0.62 on quantity.](/tests/handwritten-llm-fallback.md)
- [Invoice from 'Acme Corp' but SAP master has 'Acme Industries LLC' and 'Acme Manufacturing' as separate vendors. Determine if same entity or different suppliers.](/tests/vendor-alias-resolution.md)

# Citations

- [Vendor Master Validation Rules & Alias Matching](/documents/vendor-master-validation-rules.md)
- [Invoice Exception Triage SOP](/documents/invoice-exception-triage-sop.md)
