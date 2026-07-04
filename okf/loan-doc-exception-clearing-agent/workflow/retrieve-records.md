---
type: Workflow Stage
title: Retrieve Records
description: Query loan applications and credit memos from nCino Loan Origination and correlate with DocuSign for the Loan Documentation Exception Clearing Agent workflow.
source_id: retrieve_records
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query loan applications and credit memos from nCino Loan Origination and correlate with DocuSign for the Loan Documentation Exception Clearing Agent workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [lookup_loan_doc_exception_clearing_agent_compliance_policy](/tools/lookup-loan-doc-exception-clearing-agent-compliance-policy.md)
- [action_ncino_loan_origination_escalate](/tools/action-ncino-loan-origination-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
