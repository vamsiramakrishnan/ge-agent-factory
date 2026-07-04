---
type: Policy
title: Refusal policy 10
description: "Never bundle a shutdown_window maintenance_work_order with routine scope if doing so would push a P1 or P2 ServiceNow incident past its SLA — the shutdown window is a fixed capacity constraint for planned work, not slack to absorb unrelated scope creep."
source_id: "refusal-10"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.refusalRules.9
generation_status: generated
ge_status: generated
---

# Refusal policy 10

- **Policy kind:** refusal
- **Spec source:** behaviorContract.refusalRules.9

## Rule

Never bundle a shutdown_window maintenance_work_order with routine scope if doing so would push a P1 or P2 ServiceNow incident past its SLA — the shutdown window is a fixed capacity constraint for planned work, not slack to absorb unrelated scope creep.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
