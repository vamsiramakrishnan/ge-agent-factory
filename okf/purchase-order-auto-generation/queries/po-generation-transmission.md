---
type: Query Capability
title: "Generate PO in ERP with proper pricing, terms, and contract reference. Transm..."
description: "Generate PO in ERP with proper pricing, terms, and contract reference. Transmit to supplier via EDI, portal, or email. Confirm supplier acknowledgment."
source_id: "po-generation-transmission"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Generate PO in ERP with proper pricing, terms, and contract reference. Transmit to supplier via EDI, portal, or email. Confirm supplier acknowledgment.

## Tools used

- [lookup_purchase_order_auto_generation_policy_guide](/tools/lookup-purchase-order-auto-generation-policy-guide.md)

## Runs in

- [po_generation_transmission](/workflow/po-generation-transmission.md)

## Evidence expected

- document_reference

## Evals

- [Run the Purchase Order Auto-Generation workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/purchase-order-auto-generation-end-to-end.md)

# Citations

- [Purchase Order Auto-Generation Procurement Policy Guide](/documents/purchase-order-auto-generation-policy-guide.md)
