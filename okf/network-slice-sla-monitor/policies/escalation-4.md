---
type: Policy
title: Escalation policy 4
description: "When Alarm storm: more than 500 correlated events within 15 minutes rooted to a single region or transport span; action: escalate_to_human; handoff: noc_tier3_incident_commander"
source_id: "escalation-4"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.3
generation_status: generated
ge_status: generated
---

# Escalation policy 4

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.3

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Alarm storm: more than 500 correlated events within 15 minutes rooted to a single region or transport span | escalate_to_human | noc_tier3_incident_commander | Storms of this size usually indicate a transport or power root cause masking child alarms; automated ticketing would flood the queue while the true fault ages — a human incident commander must take command and control. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
