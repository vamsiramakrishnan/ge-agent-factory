---
type: Query Capability
title: Ingest card transaction feed from commercial card provider at statement close...
description: Ingest card transaction feed from commercial card provider at statement close. Match transactions against receipt images in Concur. Identify transactions lacking supporting documentation.
source_id: "transaction-ingestion"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Ingest card transaction feed from commercial card provider at statement close. Match transactions against receipt images in Concur. Identify transactions lacking supporting documentation.

## Tools used

- [query_citibank_jp_morgan_commercial_card_citibank_jp_morgan_commercial_card_records](/tools/query-citibank-jp-morgan-commercial-card-citibank-jp-morgan-commercial-card-records.md)
- [query_sap_concur_expense_reports](/tools/query-sap-concur-expense-reports.md)
- [lookup_p_card_reconciliation_agent_policy_guide](/tools/lookup-p-card-reconciliation-agent-policy-guide.md)
- [action_citibank_jp_morgan_commercial_card_approve](/tools/action-citibank-jp-morgan-commercial-card-approve.md)

## Runs in

- [transaction_ingestion](/workflow/transaction-ingestion.md)

## Evidence expected

- source_system_record
- document_reference
- api_response
- generated_audit_trail

## Evals

- [Run the P-Card Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/p-card-reconciliation-agent-end-to-end.md)

# Citations

- [P-Card Reconciliation Agent Procurement Policy Guide](/documents/p-card-reconciliation-agent-policy-guide.md)
