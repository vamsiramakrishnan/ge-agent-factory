---
type: Policy
title: Escalation policy 4
description: "When Customer requests release of a deposit hold exceeding $25,000 or has had two or more case-by-case holds released early in the trailing 90 days; action: escalate_to_human; handoff: branch_operations_manager"
source_id: "escalation-4"
tags:
  - banking
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
| Customer requests release of a deposit hold exceeding $25,000 or has had two or more case-by-case holds released early in the trailing 90 days | escalate_to_human | branch_operations_manager | Repeated early hold releases are a known check-kiting grooming pattern; Reg CC exception holds above this size require an officer-level override with documented collectibility reasoning. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
