---
type: Eval Scenario
title: "Run the Travel & Expense Compliance Agent workflow for the current period. Ci..."
description: "Run the Travel & Expense Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "travel-expense-compliance-agent-end-to-end"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Travel & Expense Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [policy-rule-validation](/queries/policy-rule-validation.md)

## Mechanisms to call

- [query_sap_concur_expense_reports](/tools/query-sap-concur-expense-reports.md)
- [query_egencia_navan_egencia_navan_records](/tools/query-egencia-navan-egencia-navan-records.md)
- [query_p_card_data_p_card_data_records](/tools/query-p-card-data-p-card-data-records.md)
- [query_policy_docs_policy_docs_records](/tools/query-policy-docs-policy-docs-records.md)
- [lookup_travel_expense_compliance_agent_policy_guide](/tools/lookup-travel-expense-compliance-agent-policy-guide.md)
- [action_sap_concur_submit](/tools/action-sap-concur-submit.md)

## Success rubric

Action submit executed against SAP Concur, with audit-trail entry and Indirect Procurement Lead notified of outcomes.

# Citations

- [Travel & Expense Compliance Agent Procurement Policy Guide](/documents/travel-expense-compliance-agent-policy-guide.md)
