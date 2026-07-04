---
type: Policy
title: Escalation policy 7
description: "When A technician's closure-quality audit failure rate exceeds 20% across their last 10 audited field_work_orders in a rolling 30-day window; action: escalate_to_human; handoff: field_quality_supervisor"
source_id: "escalation-7"
tags:
  - telco
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
| A technician's closure-quality audit failure rate exceeds 20% across their last 10 audited field_work_orders in a rolling 30-day window | escalate_to_human | field_quality_supervisor | A sustained double-digit failure rate signals a training or process gap the automated coaching loop can surface but not resolve — a supervisor must decide between retraining, ride-along audits, or a formal performance action. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
