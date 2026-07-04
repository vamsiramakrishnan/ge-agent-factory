---
type: Policy
title: Escalation policy 8
description: "When A correlated root-cause alarm's ticket_number is populated and clear_status remains active more than 2 hours after the linked alert_actions record moves to status=resolved; action: request_more_info; handoff: NOC Engineer"
source_id: "escalation-8"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| A correlated root-cause alarm's ticket_number is populated and clear_status remains active more than 2 hours after the linked alert_actions record moves to status=resolved | request_more_info | NOC Engineer | Conflicting closure state between Ericsson Network Manager and Splunk means either the alarm feed or the ticketing system is out of sync — surfacing the conflict rather than auto-reconciling it protects against silently reporting a false all-clear. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
