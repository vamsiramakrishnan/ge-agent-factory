---
type: Policy
title: Escalation policy 2
description: "When Vendor name not found in SAP master and alias matching returns no matches; action: escalate_to_human; handoff: Vendor Management"
source_id: "escalation-2"
tags:
  - procurement
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.1
generation_status: generated
ge_status: generated
---

# Escalation policy 2

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.1

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Vendor name not found in SAP master and alias matching returns no matches | escalate_to_human | Vendor Management | Unknown vendor requires compliance review and master data governance; agent cannot create new vendor records. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
