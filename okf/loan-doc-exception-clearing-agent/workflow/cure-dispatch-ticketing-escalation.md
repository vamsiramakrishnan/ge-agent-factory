---
type: Workflow Stage
title: "Cure Dispatch, Ticketing & Escalation"
description: "Draft borrower/insurer request letters, route signature items through DocuSign, open ServiceNow tickets, change_requests, or incidents for internal cure steps, and execute action_ncino_loan_origination_escalate for classified credits with a full audit trail to the Loan Operations Manager."
source_id: cure_dispatch_ticketing_escalation
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Cure Dispatch, Ticketing & Escalation

Draft borrower/insurer request letters, route signature items through DocuSign, open ServiceNow tickets, change_requests, or incidents for internal cure steps, and execute action_ncino_loan_origination_escalate for classified credits with a full audit trail to the Loan Operations Manager.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_loan_doc_exception_clearing_agent_compliance_policy](/tools/lookup-loan-doc-exception-clearing-agent-compliance-policy.md)
- [action_ncino_loan_origination_escalate](/tools/action-ncino-loan-origination-escalate.md)
