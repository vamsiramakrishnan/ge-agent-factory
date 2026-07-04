---
type: Policy
title: Escalation policy 4
description: "When Requested endorsement produces a mid-term premium change greater than 25% of annual premium or adds a new exposure class; action: escalate_to_human; handoff: Servicing underwriter"
source_id: "escalation-4"
tags:
  - insurance
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
| Requested endorsement produces a mid-term premium change greater than 25% of annual premium or adds a new exposure class | escalate_to_human | Servicing underwriter | Material mid-term exposure changes require re-underwriting against filed rules and may trigger re-inspection or reinsurance notification. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
