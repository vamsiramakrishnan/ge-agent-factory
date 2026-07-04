---
type: Workflow Stage
title: Transaction Ingestion
description: Ingest card transaction feed from commercial card provider at statement close. Match transactions against receipt images in Concur. Identify transactions lacking supporting documentation.
source_id: transaction_ingestion
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Transaction Ingestion

Ingest card transaction feed from commercial card provider at statement close. Match transactions against receipt images in Concur. Identify transactions lacking supporting documentation.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_citibank_jp_morgan_commercial_card_citibank_jp_morgan_commercial_card_records](/tools/query-citibank-jp-morgan-commercial-card-citibank-jp-morgan-commercial-card-records.md)
- [query_sap_concur_expense_reports](/tools/query-sap-concur-expense-reports.md)
- [lookup_p_card_reconciliation_agent_policy_guide](/tools/lookup-p-card-reconciliation-agent-policy-guide.md)
- [action_citibank_jp_morgan_commercial_card_approve](/tools/action-citibank-jp-morgan-commercial-card-approve.md)

Next: [Auto-Categorization & Anomaly Detection](/workflow/auto-categorization-anomaly-detection.md)
