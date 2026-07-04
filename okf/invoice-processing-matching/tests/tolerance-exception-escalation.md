---
type: Eval Scenario
title: "Process invoice INV-2025-0043 (vendor GE Supplier ABC, amount USD 15,500) aga..."
description: "Process invoice INV-2025-0043 (vendor GE Supplier ABC, amount USD 15,500) against PO PO-2025-1002 (PO amount USD 15,000). The price variance is 3.3%, exceeding the 2% tolerance."
source_id: "tolerance-exception-escalation"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Process invoice INV-2025-0043 (vendor GE Supplier ABC, amount USD 15,500) against PO PO-2025-1002 (PO amount USD 15,000). The price variance is 3.3%, exceeding the 2% tolerance.

## Validates

- [posting-payment-queue](/queries/posting-payment-queue.md)

## Mechanisms to call

- [query_basware_invoices](/tools/query-basware-invoices.md)
- [query_sap_s4hana_purchase_orders](/tools/query-sap-s4hana-purchase-orders.md)
- [query_coupa_purchase_orders](/tools/query-coupa-purchase-orders.md)
- [calculation_tolerance_variance](/tools/calculation-tolerance-variance.md)
- [evidence_ap_three_way_match_policy](/tools/evidence-ap-three-way-match-policy.md)
- [action_basware_route_exception](/tools/action-basware-route-exception.md)

## Success rubric

Exception routed to AP Manager queue with variance calculation and policy citation; invoice NOT posted to payment queue.

# Citations

- [AP Three-Way Match Policy](/documents/ap-three-way-match-policy.md)
