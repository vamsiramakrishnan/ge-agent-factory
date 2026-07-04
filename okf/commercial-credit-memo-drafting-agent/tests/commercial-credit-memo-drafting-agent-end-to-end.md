---
type: Eval Scenario
title: Run the Commercial Credit Memo Drafting Agent workflow for the current period...
description: "Run the Commercial Credit Memo Drafting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "commercial-credit-memo-drafting-agent-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Commercial Credit Memo Drafting Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [deal-intake-financial-spread-assembly](/queries/deal-intake-financial-spread-assembly.md)

## Mechanisms to call

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_banking_3_banking_3_records](/tools/query-banking-3-banking-3-records.md)
- [lookup_commercial_credit_memo_drafting_agent_compliance_policy](/tools/lookup-commercial-credit-memo-drafting-agent-compliance-policy.md)
- [action_ncino_loan_origination_generate](/tools/action-ncino-loan-origination-generate.md)

## Success rubric

Action generate executed against nCino Loan Origination, with audit-trail entry and Commercial Credit Analyst notified of outcomes.

# Citations

- [Commercial Credit Memo Drafting Agent Banking Compliance Policy](/documents/commercial-credit-memo-drafting-agent-compliance-policy.md)
