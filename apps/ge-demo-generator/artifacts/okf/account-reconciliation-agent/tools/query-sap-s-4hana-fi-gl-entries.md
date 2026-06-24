---
type: Agent Tool
title: query_sap_s_4hana_fi_gl_entries
description: Retrieve gl entries from SAP S/4HANA FI for the Account Reconciliation Agent workflow.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-06-20T00:25:58.081Z"
---

# query_sap_s_4hana_fi_gl_entries

Retrieve gl entries from SAP S/4HANA FI for the Account Reconciliation Agent workflow.

- **Kind:** query
- **Source system:** [SAP S/4HANA FI](/systems/sap-s-4hana-fi.md)

## Required inputs

- lookup_key
- date_range

## Produces

- gl_entries_records
- gl_entries_summary

## Evidence emitted

- source_system_record

# Examples

```
query_sap_s_4hana_fi_gl_entries(lookup_key=<lookup_key>, date_range=<date_range>)
```

## Used by

- [balance__document__pull](/workflow/balance-document-pull.md)
- [complex__account__validation](/workflow/complex-account-validation.md)
