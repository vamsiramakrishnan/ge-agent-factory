---
type: Source System
title: SAP S/4HANA FI
description: "AP aging data, vendor balances, payment history, dispute records"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# SAP S/4HANA FI

AP aging data, vendor balances, payment history, dispute records

- **Protocol:** RFC/BAPI
- **Local backing:** alloydb

# Schema

- [gl_entries](/tables/gl-entries.md)
- [subledger_balances](/tables/subledger-balances.md)
- [open_items](/tables/open-items.md)

## Tools using this system

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [action_sap_s_4hana_fi_generate](/tools/action-sap-s-4hana-fi-generate.md)
