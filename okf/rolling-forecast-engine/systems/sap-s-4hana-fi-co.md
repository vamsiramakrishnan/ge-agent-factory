---
type: Source System
title: SAP S/4HANA FI/CO
description: "Month-end actuals, GL balances, cost center data"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# SAP S/4HANA FI/CO

Month-end actuals, GL balances, cost center data

- **Protocol:** RFC/BAPI
- **Local backing:** alloydb

# Schema

- [gl_entries](/tables/gl-entries.md)
- [subledger_balances](/tables/subledger-balances.md)
- [open_items](/tables/open-items.md)

## Tools using this system

- [query_sap_s_4hana_fi_co_gl_entries](/tools/query-sap-s-4hana-fi-co-gl-entries.md)
- [action_sap_s_4hana_fi_co_generate](/tools/action-sap-s-4hana-fi-co-generate.md)
