---
type: Eval Scenario
title: Run the Loan Documentation Exception Clearing Agent workflow for the current ...
description: "Run the Loan Documentation Exception Clearing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "loan-doc-exception-clearing-agent-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Loan Documentation Exception Clearing Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_docusign_envelopes](/tools/query-docusign-envelopes.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_loan_doc_exception_clearing_agent_compliance_policy](/tools/lookup-loan-doc-exception-clearing-agent-compliance-policy.md)
- [action_ncino_loan_origination_escalate](/tools/action-ncino-loan-origination-escalate.md)

## Success rubric

Action escalate executed against nCino Loan Origination, with audit-trail entry and Loan Operations Manager notified of outcomes.

# Citations

- [Loan Documentation Exception Clearing Agent Banking Compliance Policy](/documents/loan-doc-exception-clearing-agent-compliance-policy.md)
