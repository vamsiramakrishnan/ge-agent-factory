---
type: Workflow Stage
title: "Memo Generation & Audit Trail"
description: "Execute action_ncino_loan_origination_generate to publish the finalized credit memo into nCino Loan Origination with a generated_audit_trail entry, notifying the Commercial Credit Analyst of the outcome."
source_id: memo_generation_audit_trail
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Memo Generation & Audit Trail

Execute action_ncino_loan_origination_generate to publish the finalized credit memo into nCino Loan Origination with a generated_audit_trail entry, notifying the Commercial Credit Analyst of the outcome.

- **Mode:** sequential
- **Stage:** 6 of 6

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [lookup_commercial_credit_memo_drafting_agent_compliance_policy](/tools/lookup-commercial-credit-memo-drafting-agent-compliance-policy.md)
- [action_ncino_loan_origination_generate](/tools/action-ncino-loan-origination-generate.md)
