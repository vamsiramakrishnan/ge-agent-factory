---
type: Workflow Stage
title: Exposure Aggregation
description: "Pull loan_applications, credit_memos, and covenant_records from nCino Loan Origination and roll up committed and outstanding exposure by industry, geography, and single-obligor group using query_ncino_loan_origination_loan_applications."
source_id: exposure_aggregation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Exposure Aggregation

Pull loan_applications, credit_memos, and covenant_records from nCino Loan Origination and roll up committed and outstanding exposure by industry, geography, and single-obligor group using query_ncino_loan_origination_loan_applications.

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [lookup_credit_portfolio_concentration_monitor_compliance_policy](/tools/lookup-credit-portfolio-concentration-monitor-compliance-policy.md)
- [action_ncino_loan_origination_publish](/tools/action-ncino-loan-origination-publish.md)

Next: [Concentration Limit Testing](/workflow/concentration-limit-testing.md)
