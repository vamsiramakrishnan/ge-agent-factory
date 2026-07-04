---
type: Policy
title: Escalation policy 8
description: "When queue_metrics.abandon_rate_pct exceeds 12% for a queue_name tied to an active P1 incidents record despite notifications already being published; action: escalate_to_human; handoff: Customer Experience Manager"
source_id: "escalation-8"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| queue_metrics.abandon_rate_pct exceeds 12% for a queue_name tied to an active P1 incidents record despite notifications already being published | escalate_to_human | Customer Experience Manager | An abandon rate breach after notification means the message isn't reaching or satisfying customers and the contact center is being overwhelmed regardless — it needs staffing or messaging intervention, not another automated cycle. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
