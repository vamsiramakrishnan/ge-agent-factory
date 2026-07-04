---
type: Policy
title: Escalation policy 7
description: "When Two consecutive periods show the ranked #1 loss bucket flip between availability and quality with less than 3 percentage-point separation; action: request_more_info; handoff: Continuous Improvement Lead"
source_id: "escalation-7"
tags:
  - manufacturing
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
| Two consecutive periods show the ranked #1 loss bucket flip between availability and quality with less than 3 percentage-point separation | request_more_info | Continuous Improvement Lead | An unstable top-ranked bucket this close to the noise floor risks sending a kaizen team after the wrong constraint; confirm with an additional period of evidence before publishing the Pareto. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
