---
type: Workflow Stage
title: Retrieve Records
description: Query trades and positions from Murex MX.3 and correlate with ServiceNow for the VaR Limit Breach Triage Monitor workflow.
source_id: retrieve_records
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Retrieve Records

Query trades and positions from Murex MX.3 and correlate with ServiceNow for the VaR Limit Breach Triage Monitor workflow.

- **Mode:** sequential
- **Stage:** 1 of 4

## Tools

- [query_murex_mx_3_trades](/tools/query-murex-mx-3-trades.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_var_limit_breach_triage_monitor_compliance_policy](/tools/lookup-var-limit-breach-triage-monitor-compliance-policy.md)
- [action_murex_mx_3_escalate](/tools/action-murex-mx-3-escalate.md)

Next: [Analyze & Detect](/workflow/analyze-detect.md)
