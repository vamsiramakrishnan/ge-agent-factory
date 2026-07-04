---
type: Policy
title: Escalation policy 1
description: "When Competitor signal latency regresses past the Weeks baseline by more than 20%; action: escalate_to_human; handoff: CMO"
source_id: "escalation-1"
tags:
  - marketing
  - okf
  - brd
timestamp: "2026-07-01T00:00:00.000Z"
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
| Competitor signal latency regresses past the Weeks baseline by more than 20% | escalate_to_human | CMO | Significant regressions need human judgment before automated remediation runs against production records. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
