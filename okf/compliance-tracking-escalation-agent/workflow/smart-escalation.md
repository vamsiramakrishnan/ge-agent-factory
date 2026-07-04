---
type: Workflow Stage
title: Smart Escalation
description: "Tiered escalation engine: employee reminder, manager notification, HRBP alert, legal escalation. Channel selection based on urgency (Email for standard, Slack for urgent)."
source_id: smart_escalation
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Smart Escalation

Tiered escalation engine: employee reminder, manager notification, HRBP alert, legal escalation. Channel selection based on urgency (Email for standard, Slack for urgent).

- **Mode:** sequential
- **Stage:** 3 of 4

## Tools

- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_compliance_tracking_escalation_agent_policy_handbook](/tools/lookup-compliance-tracking-escalation-agent-policy-handbook.md)

Next: [Regulatory Reporting](/workflow/regulatory-reporting.md)
