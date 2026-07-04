---
type: Eval Scenario
title: "Run the Compliance Tracking & Escalation Agent workflow for the current perio..."
description: "Run the Compliance Tracking & Escalation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required."
source_id: "compliance-tracking-escalation-agent-end-to-end"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Run the Compliance Tracking & Escalation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.

## Validates

- [completion-monitoring](/queries/completion-monitoring.md)

## Mechanisms to call

- [query_lms_lms_records](/tools/query-lms-lms-records.md)
- [query_workday_employees](/tools/query-workday-employees.md)
- [query_slack_messages](/tools/query-slack-messages.md)
- [query_servicenow_tickets](/tools/query-servicenow-tickets.md)
- [lookup_compliance_tracking_escalation_agent_policy_handbook](/tools/lookup-compliance-tracking-escalation-agent-policy-handbook.md)
- [action_lms_execute](/tools/action-lms-execute.md)

## Success rubric

Action execute executed against LMS, with audit-trail entry and HR Ops Lead notified of outcomes.

# Citations

- [Compliance Tracking & Escalation Agent Policy Handbook](/documents/compliance-tracking-escalation-agent-policy-handbook.md)
