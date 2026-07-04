---
type: Claim
title: Invoice matched to PO and GR with variance within tolerance
description: "Evidence-backed claim: Invoice matched to PO and GR with variance within tolerance"
source_id: "invoice-matched-to-po-and-gr-with-variance-within-tolerance"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.evidenceRequirements.0
generation_status: generated
ge_status: generated
---

# Invoice matched to PO and GR with variance within tolerance

## Authority

- [sap_s4hana](/systems/sap-s4hana.md)
- [coupa](/systems/coupa.md)

## Required Evidence

- invoices.po_number
- invoices.amount
- purchase_orders.amount
- goods_receipts.received_qty
- ap-three-way-match-policy.tolerance-thresholds

## Citation Requirements

Must cite: invoices.po_number, invoices.amount, purchase_orders.amount, goods_receipts.received_qty, ap-three-way-match-policy.tolerance-thresholds

## Proof obligations

- [Evidence obligation — Invoice matched to PO and GR with variance within tolerance](/proof-obligations/evidence-invoice-matched-to-po-and-gr-with-variance-within-tolerance.md)

# Citations

- [AP Three-Way Match Policy](/documents/ap-three-way-match-policy.md)
- [Exception Resolution SOP](/documents/exception-resolution-sop.md)
