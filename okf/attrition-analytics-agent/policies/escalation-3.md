---
type: Policy
title: Escalation policy 3
description: "When Individual risk score request from non-HRBP or non-manager user; action: refuse"
source_id: "escalation-3"
tags:
  - hr
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.2
generation_status: generated
ge_status: generated
---

# Escalation policy 3

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.2

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Individual risk score request from non-HRBP or non-manager user | refuse |  | Individual attrition risk is PII-adjacent and must only be shared with designated HR and direct manager. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
