---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the publish step in nCino Loan Origination with a full audit trail, and escalate exceptions to the Credit Portfolio Manager."
source_id: act_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the publish step in nCino Loan Origination with a full audit trail, and escalate exceptions to the Credit Portfolio Manager.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [lookup_credit_portfolio_concentration_monitor_compliance_policy](/tools/lookup-credit-portfolio-concentration-monitor-compliance-policy.md)
- [action_ncino_loan_origination_publish](/tools/action-ncino-loan-origination-publish.md)
