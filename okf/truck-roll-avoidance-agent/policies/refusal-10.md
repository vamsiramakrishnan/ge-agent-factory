---
type: Policy
title: Refusal policy 10
description: "Never authorize a second remote-only close on a work order that already shows repeat_within_30d=true with a prior truck_rolls count of 2 or more for the same premise — that pattern means the original root cause was missed and belongs to the quality loop, not another remote attempt."
source_id: "refusal-10"
tags:
  - telco
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

Never authorize a second remote-only close on a work order that already shows repeat_within_30d=true with a prior truck_rolls count of 2 or more for the same premise — that pattern means the original root cause was missed and belongs to the quality loop, not another remote attempt.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
