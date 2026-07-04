---
type: Eval Scenario
title: Run the Fraud Detection Engine workflow for the current period. Cite the rele...
description: "Run the Fraud Detection Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "fraud-detection-engine-end-to-end"
generation_status: inferred
tags:
  - finance
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Fraud Detection Engine workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [transaction-ingestion](/queries/transaction-ingestion.md)

## Mechanisms to call

- [query_sap_s_4hana_transactions](/tools/query-sap-s-4hana-transactions.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_finance_3_finance_3_records](/tools/query-finance-3-finance-3-records.md)
- [lookup_fraud_detection_engine_controls_playbook](/tools/lookup-fraud-detection-engine-controls-playbook.md)

## Success rubric

Chief Audit Executive receives a fully-cited recommendation; no external state change without explicit approval.

# Citations

- [Fraud Detection Engine Controls Playbook](/documents/fraud-detection-engine-controls-playbook.md)
