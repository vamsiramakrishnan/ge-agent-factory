---
type: Workflow Stage
title: "Exception Intake & Severity Triage"
description: "Poll nCino Loan Origination's loan_applications, credit_memos, and covenant_records the moment a new documentation gap posts, classifying each exception by risk_rating, decision_status, and cure path (UCC filing, insurance certificate, signed amendment)."
source_id: exception_intake_severity_triage
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Exception Intake & Severity Triage

Poll nCino Loan Origination's loan_applications, credit_memos, and covenant_records the moment a new documentation gap posts, classifying each exception by risk_rating, decision_status, and cure path (UCC filing, insurance certificate, signed amendment).

- **Mode:** sequential
- **Stage:** 1 of 5

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [lookup_loan_doc_exception_clearing_agent_compliance_policy](/tools/lookup-loan-doc-exception-clearing-agent-compliance-policy.md)
- [action_ncino_loan_origination_escalate](/tools/action-ncino-loan-origination-escalate.md)

Next: [Cure Evidence Correlation](/workflow/cure-evidence-correlation.md)
