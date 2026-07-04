---
type: Query Capability
title: "Stream financial transactions from all sub-ledgers. Enrich with vendor master..."
description: "Stream financial transactions from all sub-ledgers. Enrich with vendor master, employee master, and banking details for network analysis."
source_id: "transaction-ingestion"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Stream financial transactions from all sub-ledgers. Enrich with vendor master, employee master, and banking details for network analysis.

## Tools used

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)

## Runs in

- [transaction_ingestion](/workflow/transaction-ingestion.md)

## Evidence expected

- source_system_record

## Evals

- [Run the Fraud Detection Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/fraud-detection-engine-end-to-end.md)

# Citations

- [Fraud Detection Engine Controls Playbook](/documents/fraud-detection-engine-controls-playbook.md)
