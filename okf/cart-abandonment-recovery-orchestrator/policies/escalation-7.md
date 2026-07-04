---
type: Policy
title: Escalation policy 7
description: "When Aggregate recovery incentive spend for a single dispatch run would push the rolling average discount per recovered order back above 8% — more than halfway toward the pre-agent 12% blanket-discount baseline.; action: escalate_to_human; handoff: Digital Marketing Manager"
source_id: "escalation-7"
tags:
  - retail
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
| Aggregate recovery incentive spend for a single dispatch run would push the rolling average discount per recovered order back above 8% — more than halfway toward the pre-agent 12% blanket-discount baseline. | escalate_to_human | Digital Marketing Manager | Reverting toward blanket-discount behavior defeats the margin-preserving purpose of the orchestrator and needs a human check on the scoring model before further sends. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
