---
type: Source System
title: SAP S/4HANA FI
description: "Sub-ledger transactions, GL posting rules, chart of accounts"
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# SAP S/4HANA FI

Sub-ledger transactions, GL posting rules, chart of accounts

- **Protocol:** RFC/BAPI
- **Local backing:** alloydb

# Schema

- [gl_entries](/tables/gl-entries.md)
- [subledger_balances](/tables/subledger-balances.md)
- [open_items](/tables/open-items.md)

## Tools using this system

- [query_sap_s_4hana_fi_gl_entries](/tools/query-sap-s-4hana-fi-gl-entries.md)
- [lookup_journal_entry_auto_posting_controls_playbook](/tools/lookup-journal-entry-auto-posting-controls-playbook.md)
- [action_sap_s_4hana_fi_match](/tools/action-sap-s-4hana-fi-match.md)
