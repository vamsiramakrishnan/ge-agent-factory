---
type: Policy
title: Escalation policy 7
description: "When Cpk on a CTQ characteristic falls below 1.33 across two consecutive quality_checks records for the same characteristic and production_order; action: escalate_to_human; handoff: Process Engineer"
source_id: "escalation-7"
tags:
  - manufacturing
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
| Cpk on a CTQ characteristic falls below 1.33 across two consecutive quality_checks records for the same characteristic and production_order | escalate_to_human | Process Engineer | A Cpk under 1.33 means the process is no longer demonstrably capable of holding tolerance under normal variation; only a process engineer can authorize a capability study or re-centering before more lots are produced against it. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
