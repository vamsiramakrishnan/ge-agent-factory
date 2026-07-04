---
type: Workflow Stage
title: "Disposition, Filing & Case Handoff"
description: "Execute action_nice_actimize_file with the disposition and generated_audit_trail, and route confirmed_fraud alerts or SAR-eligible investigation_cases to ServiceNow with a pre-built case file for the assigned investigator ahead of the filing_deadline_date."
source_id: disposition_filing_case_handoff
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Disposition, Filing & Case Handoff

Execute action_nice_actimize_file with the disposition and generated_audit_trail, and route confirmed_fraud alerts or SAR-eligible investigation_cases to ServiceNow with a pre-built case file for the assigned investigator ahead of the filing_deadline_date.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_fraud_alert_triage_agent_compliance_policy](/tools/lookup-fraud-alert-triage-agent-compliance-policy.md)
- [action_nice_actimize_file](/tools/action-nice-actimize-file.md)
