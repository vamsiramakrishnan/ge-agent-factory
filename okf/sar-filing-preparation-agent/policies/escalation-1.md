---
type: Policy
title: Escalation policy 1
description: "When SAR filing timeliness (within 30 days) regresses past the 82% baseline by more than 20%; action: escalate_to_human; handoff: AML Compliance Officer"
source_id: "escalation-1"
tags:
  - banking
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.0
generation_status: generated
ge_status: generated
---

# Escalation policy 1

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.0

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| SAR filing timeliness (within 30 days) regresses past the 82% baseline by more than 20% | escalate_to_human | AML Compliance Officer | Significant regressions need human judgment before automated remediation runs against production records. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
