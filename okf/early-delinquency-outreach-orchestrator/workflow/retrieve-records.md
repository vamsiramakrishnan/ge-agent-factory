---
type: Workflow Stage
title: Retrieve Records
description: Query loan applications and credit memos from nCino Loan Origination and correlate with ServiceNow for the Early Delinquency Outreach Orchestrator workflow.
source_id: retrieve_records
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query loan applications and credit memos from nCino Loan Origination and correlate with ServiceNow for the Early Delinquency Outreach Orchestrator workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_early_delinquency_outreach_orchestrator_compliance_policy](/tools/lookup-early-delinquency-outreach-orchestrator-compliance-policy.md)
- [action_ncino_loan_origination_recommend](/tools/action-ncino-loan-origination-recommend.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
