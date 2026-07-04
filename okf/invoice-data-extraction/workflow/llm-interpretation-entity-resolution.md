---
type: Workflow Stage
title: "LLM Interpretation & Entity Resolution"
description: "Interpret invoices OCR cannot reliably handle: handwritten invoices, non-standard layouts, quantities like '2 pallets @ ~500 units each, actuals per delivery note.' Resolve vendor identity when invoice says 'Acme Corp' but vendor master has 'Acme Industries LLC' — reason about whether same entity or different."
source_id: llm_interpretation_entity_resolution
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# LLM Interpretation & Entity Resolution

Interpret invoices OCR cannot reliably handle: handwritten invoices, non-standard layouts, quantities like '2 pallets @ ~500 units each, actuals per delivery note.' Resolve vendor identity when invoice says 'Acme Corp' but vendor master has 'Acme Industries LLC' — reason about whether same entity or different.

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_kofax_tungsten_captured_invoices](/tools/query-kofax-tungsten-captured-invoices.md)
- [query_basware_invoice_queue](/tools/query-basware-invoice-queue.md)
- [query_sap_s4hana_vendor_master](/tools/query-sap-s4hana-vendor-master.md)
- [action_sap_s4hana_post_invoice](/tools/action-sap-s4hana-post-invoice.md)
- [action_coupa_acknowledge_invoice](/tools/action-coupa-acknowledge-invoice.md)
- [evidence_vendor_validation_rules](/tools/evidence-vendor-validation-rules.md)

Next: [Validation & Posting](/workflow/validation-posting.md)
