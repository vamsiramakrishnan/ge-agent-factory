---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the generate step in nCino Loan Origination with a full audit trail, and escalate exceptions to the Commercial Credit Analyst."
source_id: act_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the generate step in nCino Loan Origination with a full audit trail, and escalate exceptions to the Commercial Credit Analyst.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [lookup_commercial_credit_memo_drafting_agent_compliance_policy](/tools/lookup-commercial-credit-memo-drafting-agent-compliance-policy.md)
- [action_ncino_loan_origination_generate](/tools/action-ncino-loan-origination-generate.md)
