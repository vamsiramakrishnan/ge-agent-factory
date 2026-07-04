---
type: Query Capability
title: "Receive invoices via email, portal, or EDI. Extract header and line-item data..."
description: "Receive invoices via email, portal, or EDI. Extract header and line-item data using Document AI with confidence scoring on each field."
source_id: "invoice-ingestion-ocr"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Receive invoices via email, portal, or EDI. Extract header and line-item data using Document AI with confidence scoring on each field.

## Tools used

- [query_basware_invoices](/tools/query-basware-invoices.md)
- [action_sap_s4hana_post_invoice](/tools/action-sap-s4hana-post-invoice.md)

## Runs in

- [invoice_ingestion_ocr](/workflow/invoice-ingestion-ocr.md)

## Evidence expected

- source_system_record
- api_response
- generated_audit_trail

## Evals

- [Process invoice INV-2025-0042 (vendor GE Supplier XYZ, amount USD 15,000) against PO PO-2025-1001 and goods receipt GR-2025-5003. The invoice quantity matches GR quantity and amount is within 2% of PO.](/tests/happy-path-three-way-match.md)
- [Process invoice INV-2025-0043 (vendor GE Supplier ABC, amount USD 15,500) against PO PO-2025-1002 (PO amount USD 15,000). The price variance is 3.3%, exceeding the 2% tolerance.](/tests/tolerance-exception-escalation.md)
- [Process invoice INV-2025-0044 (vendor ID unknown, amount USD 8,000) against PO PO-2025-1003. The vendor is not in Coupa supplier catalog.](/tests/vendor-not-found-escalation.md)

# Citations

- [AP Three-Way Match Policy](/documents/ap-three-way-match-policy.md)
- [Exception Resolution SOP](/documents/exception-resolution-sop.md)
