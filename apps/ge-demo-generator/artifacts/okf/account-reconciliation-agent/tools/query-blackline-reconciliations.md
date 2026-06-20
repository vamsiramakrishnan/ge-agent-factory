---
type: Agent Tool
title: query_blackline_reconciliations
description: Retrieve reconciliations from BlackLine for the Account Reconciliation Agent workflow.
tags:
  - finance
  - okf
  - brd
timestamp: "2026-06-20T00:25:58.081Z"
---

# query_blackline_reconciliations

Retrieve reconciliations from BlackLine for the Account Reconciliation Agent workflow.

- **Kind:** query
- **Source system:** [BlackLine](/systems/blackline.md)

## Required inputs

- lookup_key
- date_range

## Produces

- reconciliations_records
- reconciliations_summary

## Evidence emitted

- source_system_record

# Examples

```
query_blackline_reconciliations(lookup_key=<lookup_key>, date_range=<date_range>)
```

## Used by

- [balance__document__pull](/workflow/balance-document-pull.md)
- [complex__account__validation](/workflow/complex-account-validation.md)
