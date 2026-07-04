---
type: Policy
title: Escalation policy 8
description: "When Two or more pending parameter changes target the same cell_sites record from different initiatives (coverage, capacity, energy-saving) within the same change window; action: escalate_to_human; handoff: RF Optimization Engineer"
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
| Two or more pending parameter changes target the same cell_sites record from different initiatives (coverage, capacity, energy-saving) within the same change window | escalate_to_human | RF Optimization Engineer | Silent cross-team conflicts on the same cell are the specific regression pattern the runbook and playbook were written to stop; only a human owner can arbitrate which change proceeds. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
