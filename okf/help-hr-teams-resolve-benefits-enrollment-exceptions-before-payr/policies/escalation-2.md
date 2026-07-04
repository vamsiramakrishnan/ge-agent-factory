---
type: Policy
title: Escalation policy 2
description: "When SAP S/4HANA FI employee status is terminated but BlackLine deductions remain active; action: escalate_to_human; handoff: HR Specialist"
source_id: "escalation-2"
tags:
  - hr
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
| SAP S/4HANA FI employee status is terminated but BlackLine deductions remain active | escalate_to_human | HR Specialist | Terminated employee files involve complex offboarding logic and require manual verification of cutover details. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
