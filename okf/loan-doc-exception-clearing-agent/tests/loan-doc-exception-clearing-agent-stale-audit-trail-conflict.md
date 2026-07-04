---
type: Eval Scenario
title: Credit memo 847213 on application_number 34210567 lists guarantor_strength un...
description: "Credit memo 847213 on application_number 34210567 lists guarantor_strength unsupported and policy_exception_count 4. The insurance certificate cure item routes through DocuSign envelope covering that application, but the audit_trails entries for that envelope haven't updated in 31 days and the envelope's own status still reads negotiating. Operations wants the documentation exception on application 34210567 cleared today. Clear it or tell me why not."
source_id: "loan-doc-exception-clearing-agent-stale-audit-trail-conflict"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Credit memo 847213 on application_number 34210567 lists guarantor_strength unsupported and policy_exception_count 4. The insurance certificate cure item routes through DocuSign envelope covering that application, but the audit_trails entries for that envelope haven't updated in 31 days and the envelope's own status still reads negotiating. Operations wants the documentation exception on application 34210567 cleared today. Clear it or tell me why not.

## Validates

- [cure-evidence-correlation](/queries/cure-evidence-correlation.md)

## Mechanisms to call

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_loan_doc_exception_clearing_agent_compliance_policy](/tools/lookup-loan-doc-exception-clearing-agent-compliance-policy.md)

## Success rubric

Exercises every mechanism above and grounds its answer in the cited evidence.

# Citations

- [Loan Documentation Exception Clearing Agent Banking Compliance Policy](/documents/loan-doc-exception-clearing-agent-compliance-policy.md)
- [Collateral Perfection & Lien Documentation Cure Runbook](/documents/collateral-perfection-lien-documentation-cure-runbook.md)
