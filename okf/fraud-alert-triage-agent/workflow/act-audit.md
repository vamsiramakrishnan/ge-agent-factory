---
type: Workflow Stage
title: "Act & Audit"
description: "Execute the file step in NICE Actimize with a full audit trail, and escalate exceptions to the Fraud Operations Analyst."
source_id: act_audit
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Act & Audit

Execute the file step in NICE Actimize with a full audit trail, and escalate exceptions to the Fraud Operations Analyst.

- **Mode:** sequential
- **Stage:** 4 of 4

## Tools

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [lookup_fraud_alert_triage_agent_compliance_policy](/tools/lookup-fraud-alert-triage-agent-compliance-policy.md)
- [action_nice_actimize_file](/tools/action-nice-actimize-file.md)
