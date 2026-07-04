---
type: Proof Obligation
title: Evidence obligation — Invoice matched to PO and GR with variance within tolerance
description: evidence requirement proof obligation
source_id: "evidence-invoice-matched-to-po-and-gr-with-variance-within-tolerance"
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

# Evidence obligation — Invoice matched to PO and GR with variance within tolerance

- **Kind:** evidence requirement
- **Spec source:** behaviorContract.evidenceRequirements.0
- **Claim:** [Invoice matched to PO and GR with variance within tolerance](/claims/invoice-matched-to-po-and-gr-with-variance-within-tolerance.md)

## Required citations

- invoices.po_number
- invoices.amount
- purchase_orders.amount
- goods_receipts.received_qty
- ap-three-way-match-policy.tolerance-thresholds

## Source systems

- [sap_s4hana](/systems/sap-s4hana.md)
- [coupa](/systems/coupa.md)
