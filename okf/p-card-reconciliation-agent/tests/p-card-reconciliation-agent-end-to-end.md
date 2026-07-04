---
type: Eval Scenario
title: "Run the P-Card Reconciliation Agent workflow for the current period. Cite the..."
description: "Run the P-Card Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "p-card-reconciliation-agent-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the P-Card Reconciliation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [transaction-ingestion](/queries/transaction-ingestion.md)

## Mechanisms to call

- [query_citibank_jp_morgan_commercial_card_citibank_jp_morgan_commercial_card_records](/tools/query-citibank-jp-morgan-commercial-card-citibank-jp-morgan-commercial-card-records.md)
- [query_sap_concur_expense_reports](/tools/query-sap-concur-expense-reports.md)
- [query_coupa_requisitions](/tools/query-coupa-requisitions.md)
- [lookup_p_card_reconciliation_agent_policy_guide](/tools/lookup-p-card-reconciliation-agent-policy-guide.md)
- [action_citibank_jp_morgan_commercial_card_approve](/tools/action-citibank-jp-morgan-commercial-card-approve.md)

## Success rubric

Action approve executed against Citibank/JP Morgan Commercial Card, with audit-trail entry and Buyer notified of outcomes.

# Citations

- [P-Card Reconciliation Agent Procurement Policy Guide](/documents/p-card-reconciliation-agent-policy-guide.md)
