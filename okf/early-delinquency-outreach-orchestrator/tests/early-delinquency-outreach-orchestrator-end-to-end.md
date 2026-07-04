---
type: Eval Scenario
title: Run the Early Delinquency Outreach Orchestrator workflow for the current peri...
description: "Run the Early Delinquency Outreach Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "early-delinquency-outreach-orchestrator-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Early Delinquency Outreach Orchestrator workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_early_delinquency_outreach_orchestrator_compliance_policy](/tools/lookup-early-delinquency-outreach-orchestrator-compliance-policy.md)
- [action_ncino_loan_origination_recommend](/tools/action-ncino-loan-origination-recommend.md)

## Success rubric

Action recommend executed against nCino Loan Origination, with audit-trail entry and Collections Supervisor notified of outcomes.

# Citations

- [Early Delinquency Outreach Orchestrator Banking Compliance Policy](/documents/early-delinquency-outreach-orchestrator-compliance-policy.md)
