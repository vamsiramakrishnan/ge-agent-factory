---
type: Source System
title: SAP S/4HANA
description: "Vendor master for identity validation, PO data for cross-reference, invoice posting"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# SAP S/4HANA

Vendor master for identity validation, PO data for cross-reference, invoice posting

- **Protocol:** RFC/BAPI
- **Local backing:** json-api, alloydb

# Schema

- [vendors](/tables/vendors.md)
- [purchase_orders](/tables/purchase-orders.md)

## Tools using this system

- [query_sap_s4hana_vendor_master](/tools/query-sap-s4hana-vendor-master.md)
- [action_sap_s4hana_post_invoice](/tools/action-sap-s4hana-post-invoice.md)
- [evidence_vendor_validation_rules](/tools/evidence-vendor-validation-rules.md)
