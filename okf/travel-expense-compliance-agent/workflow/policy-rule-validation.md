---
type: Workflow Stage
title: Policy Rule Validation
description: "Expense report validated against policy rule engine — meal limits by city tier, hotel rate caps, mileage rates, receipt requirements. Cross-reference P-card transactions for duplicate claim detection."
source_id: policy_rule_validation
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Policy Rule Validation

Expense report validated against policy rule engine — meal limits by city tier, hotel rate caps, mileage rates, receipt requirements. Cross-reference P-card transactions for duplicate claim detection.

- **Mode:** sequential
- **Stage:** 1 of 3

## Tools

- [query_sap_concur_expense_reports](/tools/query-sap-concur-expense-reports.md)
- [query_p_card_data_p_card_data_records](/tools/query-p-card-data-p-card-data-records.md)
- [query_policy_docs_policy_docs_records](/tools/query-policy-docs-policy-docs-records.md)
- [lookup_travel_expense_compliance_agent_policy_guide](/tools/lookup-travel-expense-compliance-agent-policy-guide.md)

Next: [Anomaly Detection](/workflow/anomaly-detection.md)
