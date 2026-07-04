---
type: Policy
title: Escalation policy 7
description: "When An alert_actions record with category='hardware' and priority='P1' flagging a tower obstruction lighting outage remains status='open' more than 30 minutes after its created_at timestamp; action: escalate_to_human; handoff: regulatory_compliance_officer"
source_id: "escalation-7"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.6
generation_status: generated
ge_status: generated
---

# Escalation policy 7

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.6

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| An alert_actions record with category='hardware' and priority='P1' flagging a tower obstruction lighting outage remains status='open' more than 30 minutes after its created_at timestamp | escalate_to_human | regulatory_compliance_officer | FCC 47 CFR 17.48 requires notifying the FAA of a marked-structure lighting outage within 30 minutes of detection and filing NOTAMs until it is repaired; this is a hard regulatory clock the scheduling engine cannot silently fold into the standard maintenance queue. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
