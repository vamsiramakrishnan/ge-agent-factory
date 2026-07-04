---
type: Query Capability
title: "Tiered escalation engine: employee reminder, manager notification, HRBP alert..."
description: "Tiered escalation engine: employee reminder, manager notification, HRBP alert, legal escalation. Channel selection based on urgency (Email for standard, Slack for urgent)."
source_id: "smart-escalation"
generation_status: inferred
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Tiered escalation engine: employee reminder, manager notification, HRBP alert, legal escalation. Channel selection based on urgency (Email for standard, Slack for urgent).

## Tools used

- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_compliance_tracking_escalation_agent_policy_handbook](/tools/lookup-compliance-tracking-escalation-agent-policy-handbook.md)

## Runs in

- [smart_escalation](/workflow/smart-escalation.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Compliance Tracking & Escalation Agent workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/compliance-tracking-escalation-agent-end-to-end.md)

# Citations

- [Compliance Tracking & Escalation Agent Policy Handbook](/documents/compliance-tracking-escalation-agent-policy-handbook.md)
