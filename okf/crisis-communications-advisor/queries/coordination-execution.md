---
type: Query Capability
title: "Alert crisis team via Slack, route response for CMO + Legal approval, coordin..."
description: "Alert crisis team via Slack, route response for CMO + Legal approval, coordinate channel-specific execution. Track response effectiveness and media sentiment recovery."
source_id: "coordination-execution"
generation_status: inferred
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
---

# Alert crisis team via Slack, route response for CMO + Legal approval, coordinate channel-specific execution. Track response effectiveness and media sentiment recovery.

## Tools used

- [query_slack_messages](/tools/query-slack-messages.md)
- [lookup_crisis_communications_advisor_playbook](/tools/lookup-crisis-communications-advisor-playbook.md)

## Runs in

- [coordination_execution](/workflow/coordination-execution.md)

## Evidence expected

- source_system_record
- document_reference

## Evals

- [Run the Crisis Communications Advisor workflow for the current period. Cite the relevant source-system evidence and surface any escalations required.](/tests/crisis-communications-advisor-end-to-end.md)

# Citations

- [Crisis Communications Advisor Playbook](/documents/crisis-communications-advisor-playbook.md)
