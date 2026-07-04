---
type: Query Capability
title: Expense report validated against policy rule engine — meal limits by city tie...
description: "Expense report validated against policy rule engine — meal limits by city tier, hotel rate caps, mileage rates, receipt requirements. Cross-reference P-card transactions for duplicate claim detection."
source_id: "policy-rule-validation"
generation_status: inferred
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Expense report validated against policy rule engine — meal limits by city tier, hotel rate caps, mileage rates, receipt requirements. Cross-reference P-card transactions for duplicate claim detection.

## Tools used

- [query_sap_concur_expense_reports](/tools/query-sap-concur-expense-reports.md)
- [query_p_card_data_p_card_data_records](/tools/query-p-card-data-p-card-data-records.md)
- [query_policy_docs_policy_docs_records](/tools/query-policy-docs-policy-docs-records.md)
- [lookup_travel_expense_compliance_agent_policy_guide](/tools/lookup-travel-expense-compliance-agent-policy-guide.md)

## Runs in

- [policy_rule_validation](/workflow/policy-rule-validation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Travel & Expense Compliance Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/travel-expense-compliance-agent-end-to-end.md)

# Citations

- [Travel & Expense Compliance Agent Procurement Policy Guide](/documents/travel-expense-compliance-agent-policy-guide.md)
