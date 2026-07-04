---
type: Eval Scenario
title: Run the VaR Limit Breach Triage Monitor workflow for the current period. Cite...
description: "Run the VaR Limit Breach Triage Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "var-limit-breach-triage-monitor-end-to-end"
generation_status: inferred
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Run the VaR Limit Breach Triage Monitor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [retrieve-records](/queries/retrieve-records.md)

## Mechanisms to call

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_bigquery_analytics_events](/tools/query-bigquery-analytics-events.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_var_limit_breach_triage_monitor_compliance_policy](/tools/lookup-var-limit-breach-triage-monitor-compliance-policy.md)
- [action_murex_mx_3_escalate](/tools/action-murex-mx-3-escalate.md)

## Success rubric

Action escalate executed against Murex MX.3, with audit-trail entry and Market Risk Analyst notified of outcomes.

# Citations

- [VaR Limit Breach Triage Monitor Banking Compliance Policy](/documents/var-limit-breach-triage-monitor-compliance-policy.md)
