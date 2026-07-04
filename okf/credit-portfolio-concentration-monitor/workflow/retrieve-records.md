---
type: Workflow Stage
title: Retrieve Records
description: Query loan applications and credit memos from nCino Loan Origination for the Credit Portfolio Concentration Monitor workflow.
source_id: retrieve_records
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query loan applications and credit memos from nCino Loan Origination for the Credit Portfolio Concentration Monitor workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [lookup_credit_portfolio_concentration_monitor_compliance_policy](/tools/lookup-credit-portfolio-concentration-monitor-compliance-policy.md)
- [action_ncino_loan_origination_publish](/tools/action-ncino-loan-origination-publish.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
