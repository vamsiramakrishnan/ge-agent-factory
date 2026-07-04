---
type: Source System
title: SAP S/4HANA FI/MM
description: "PO and invoice line items with vendor, material group, cost center"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# SAP S/4HANA FI/MM

PO and invoice line items with vendor, material group, cost center

- **Protocol:** RFC/BAPI
- **Local backing:** alloydb

# Schema

- [gl_entries](/tables/gl-entries.md)
- [subledger_balances](/tables/subledger-balances.md)
- [open_items](/tables/open-items.md)

## Tools using this system

- [query_sap_s_4hana_fi_mm_gl_entries](/tools/query-sap-s-4hana-fi-mm-gl-entries.md)
- [action_sap_s_4hana_fi_mm_enrich](/tools/action-sap-s-4hana-fi-mm-enrich.md)
