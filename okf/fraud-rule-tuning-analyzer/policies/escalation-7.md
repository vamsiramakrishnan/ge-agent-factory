---
type: Policy
title: Escalation policy 7
description: "When A recommended threshold loosening is projected to raise Alert volume per $1M protected by more than 15% even though modeled detection rate improves; action: escalate_to_human; handoff: Fraud Strategy Manager"
source_id: "escalation-7"
tags:
  - banking
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
| A recommended threshold loosening is projected to raise Alert volume per $1M protected by more than 15% even though modeled detection rate improves | escalate_to_human | Fraud Strategy Manager | Trading analyst queue capacity for marginal detection gains is a resourcing tradeoff that requires manager judgment, not automated approval. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
