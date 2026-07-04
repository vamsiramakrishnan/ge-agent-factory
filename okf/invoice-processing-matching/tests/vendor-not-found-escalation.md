---
type: Eval Scenario
title: "Process invoice INV-2025-0044 (vendor ID unknown, amount USD 8,000) against P..."
description: "Process invoice INV-2025-0044 (vendor ID unknown, amount USD 8,000) against PO PO-2025-1003. The vendor is not in Coupa supplier catalog."
source_id: "vendor-not-found-escalation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Process invoice INV-2025-0044 (vendor ID unknown, amount USD 8,000) against PO PO-2025-1003. The vendor is not in Coupa supplier catalog.

## Validates

- [posting-payment-queue](/queries/posting-payment-queue.md)

## Mechanisms to call

- [query_basware_invoices](/tools/query-basware-invoices.md)
- [query_sap_s4hana_purchase_orders](/tools/query-sap-s4hana-purchase-orders.md)
- [query_coupa_purchase_orders](/tools/query-coupa-purchase-orders.md)
- [evidence_ap_three_way_match_policy](/tools/evidence-ap-three-way-match-policy.md)
- [action_basware_route_exception](/tools/action-basware-route-exception.md)

## Success rubric

Exception routed to AP Manager with vendor-not-found flag; invoice held pending supplier vetting.

# Citations

- [AP Three-Way Match Policy](/documents/ap-three-way-match-policy.md)
