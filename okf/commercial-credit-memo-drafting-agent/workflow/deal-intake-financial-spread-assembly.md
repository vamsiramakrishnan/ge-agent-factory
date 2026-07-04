---
type: Workflow Stage
title: "Deal Intake & Financial Spread Assembly"
description: "Pull the borrower's loan_applications and credit_memos records from nCino Loan Origination via query_ncino_loan_origination_loan_applications, spreading requested_amount, dscr, ltv, and global_cash_flow into the standard memo template."
source_id: deal_intake_financial_spread_assembly
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Deal Intake & Financial Spread Assembly

Pull the borrower's loan_applications and credit_memos records from nCino Loan Origination via query_ncino_loan_origination_loan_applications, spreading requested_amount, dscr, ltv, and global_cash_flow into the standard memo template.

- **Mode:** sequential
- **Stage:** 1 of 6

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_banking_3_banking_3_records](/tools/query-banking-3-banking-3-records.md)
- [lookup_commercial_credit_memo_drafting_agent_compliance_policy](/tools/lookup-commercial-credit-memo-drafting-agent-compliance-policy.md)
- [action_ncino_loan_origination_generate](/tools/action-ncino-loan-origination-generate.md)

Next: [Global Exposure & Covenant Aggregation](/workflow/global-exposure-covenant-aggregation.md)
