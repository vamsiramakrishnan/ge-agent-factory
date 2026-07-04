---
type: Workflow Stage
title: Transaction Ingestion
description: "Stream financial transactions from all sub-ledgers. Enrich with vendor master, employee master, and banking details for network analysis."
source_id: transaction_ingestion
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Transaction Ingestion

Stream financial transactions from all sub-ledgers. Enrich with vendor master, employee master, and banking details for network analysis.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)

Next: [Statistical Detection](/workflow/statistical-detection.md)
