---
type: Workflow Stage
title: "Compliance & Cure-Runbook Gating"
description: "Cite the Loan Documentation Exception Clearing Agent Banking Compliance Policy and the Collateral Perfection & Lien Documentation Cure Runbook via lookup_loan_doc_exception_clearing_agent_compliance_policy before any borrower letter, cure task, or escalation is issued."
source_id: compliance_cure_runbook_gating
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Compliance & Cure-Runbook Gating

Cite the Loan Documentation Exception Clearing Agent Banking Compliance Policy and the Collateral Perfection & Lien Documentation Cure Runbook via lookup_loan_doc_exception_clearing_agent_compliance_policy before any borrower letter, cure task, or escalation is issued.

- **Mode:** sequential
- **Stage:** 4 of 5

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [lookup_loan_doc_exception_clearing_agent_compliance_policy](/tools/lookup-loan-doc-exception-clearing-agent-compliance-policy.md)
- [action_ncino_loan_origination_escalate](/tools/action-ncino-loan-origination-escalate.md)

Next: [Cure Dispatch, Ticketing & Escalation](/workflow/cure-dispatch-ticketing-escalation.md)
