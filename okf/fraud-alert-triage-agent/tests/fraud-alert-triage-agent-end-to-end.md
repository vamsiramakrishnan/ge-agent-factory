---
type: Eval Scenario
title: Run the Fraud Alert Triage Agent workflow for the current period. Cite the re...
description: "Run the Fraud Alert Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "fraud-alert-triage-agent-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the Fraud Alert Triage Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_fraud_alert_triage_agent_compliance_policy](/tools/lookup-fraud-alert-triage-agent-compliance-policy.md)
- [action_nice_actimize_file](/tools/action-nice-actimize-file.md)

## Success rubric

Action file executed against NICE Actimize, with audit-trail entry and Fraud Operations Analyst notified of outcomes.

# Citations

- [Fraud Alert Triage Agent Banking Compliance Policy](/documents/fraud-alert-triage-agent-compliance-policy.md)
