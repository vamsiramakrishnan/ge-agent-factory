---
type: Workflow Stage
title: "Validation & Posting"
description: Validate extracted data against vendor master and PO. Post validated invoices to ERP or route to exception queue for manual review.
source_id: validation_posting
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Validation & Posting

Validate extracted data against vendor master and PO. Post validated invoices to ERP or route to exception queue for manual review.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_kofax_tungsten_captured_invoices](/tools/query-kofax-tungsten-captured-invoices.md)
- [query_basware_invoice_queue](/tools/query-basware-invoice-queue.md)
- [query_sap_s4hana_vendor_master](/tools/query-sap-s4hana-vendor-master.md)
- [action_sap_s4hana_post_invoice](/tools/action-sap-s4hana-post-invoice.md)
- [action_basware_route_to_exception_queue](/tools/action-basware-route-to-exception-queue.md)
- [action_coupa_acknowledge_invoice](/tools/action-coupa-acknowledge-invoice.md)
- [evidence_vendor_validation_rules](/tools/evidence-vendor-validation-rules.md)
