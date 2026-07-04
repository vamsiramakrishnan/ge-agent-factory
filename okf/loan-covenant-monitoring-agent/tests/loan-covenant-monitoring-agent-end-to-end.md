---
type: Eval Scenario
title: Run the Loan Covenant Monitoring Agent workflow for the current period. Cite ...
description: "Run the Loan Covenant Monitoring Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "loan-covenant-monitoring-agent-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Loan Covenant Monitoring Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [covenant-calendar-extraction](/queries/covenant-calendar-extraction.md)

## Mechanisms to call

- [query_ncino_loan_origination_loan_applications](/tools/query-ncino-loan-origination-loan-applications.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_looker_dashboards](/tools/query-looker-dashboards.md)
- [lookup_loan_covenant_monitoring_agent_compliance_policy](/tools/lookup-loan-covenant-monitoring-agent-compliance-policy.md)
- [action_ncino_loan_origination_escalate](/tools/action-ncino-loan-origination-escalate.md)

## Success rubric

Action escalate executed against nCino Loan Origination, with audit-trail entry and Credit Risk Officer notified of outcomes.

# Citations

- [Loan Covenant Monitoring Agent Banking Compliance Policy](/documents/loan-covenant-monitoring-agent-compliance-policy.md)
