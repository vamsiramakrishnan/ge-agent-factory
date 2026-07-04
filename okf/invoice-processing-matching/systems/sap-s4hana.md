---
type: Source System
title: SAP S/4HANA
description: SAP S/4HANA source system.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# SAP S/4HANA

- **Protocol:** RFC/BAPI
- **Local backing:** json-api, alloydb

# Schema

- [purchase_orders](/tables/purchase-orders.md)
- [goods_receipts](/tables/goods-receipts.md)
- [payment_records](/tables/payment-records.md)
- [invoices](/tables/invoices.md)

## Tools using this system

- [query_sap_s4hana_purchase_orders](/tools/query-sap-s4hana-purchase-orders.md)
- [query_sap_s4hana_goods_receipts](/tools/query-sap-s4hana-goods-receipts.md)
- [action_sap_s4hana_post_invoice](/tools/action-sap-s4hana-post-invoice.md)
- [calculation_tolerance_variance](/tools/calculation-tolerance-variance.md)
- [evidence_ap_three_way_match_policy](/tools/evidence-ap-three-way-match-policy.md)
