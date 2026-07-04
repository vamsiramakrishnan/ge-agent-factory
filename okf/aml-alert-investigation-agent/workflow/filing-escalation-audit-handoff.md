---
type: Workflow Stage
title: "Filing, Escalation & Audit Handoff"
description: "Execute action_nice_actimize_file to close or advance the case with a generated_audit_trail, or route escalations for structuring, stale evidence, or filing-deadline risk on investigation_cases.filing_deadline_date to the BSA officer with the file attached."
source_id: filing_escalation_audit_handoff
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
---

# Filing, Escalation & Audit Handoff

Execute action_nice_actimize_file to close or advance the case with a generated_audit_trail, or route escalations for structuring, stale evidence, or filing-deadline risk on investigation_cases.filing_deadline_date to the BSA officer with the file attached.

- **Mode:** sequential
- **Stage:** 5 of 5

## Tools

- [query_nice_actimize_fraud_alerts](/tools/query-nice-actimize-fraud-alerts.md)
- [lookup_aml_alert_investigation_agent_compliance_policy](/tools/lookup-aml-alert-investigation-agent-compliance-policy.md)
- [action_nice_actimize_file](/tools/action-nice-actimize-file.md)
