---
type: Policy
title: Refusal policy 9
description: "Never merge or close out a maintenance_work_order as a duplicate of another when the underlying asset_registry_entries.criticality_ranking is a_constraint and the two records show different failure_mode values — treat them as distinct failures until a technician confirms a common cause, since collapsing distinct failure modes on constraint equipment hides an emerging failure pattern from the reliability program."
source_id: "refusal-9"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.refusalRules.8
generation_status: generated
ge_status: generated
---

# Refusal policy 9

- **Policy kind:** refusal
- **Spec source:** behaviorContract.refusalRules.8

## Rule

Never merge or close out a maintenance_work_order as a duplicate of another when the underlying asset_registry_entries.criticality_ranking is a_constraint and the two records show different failure_mode values — treat them as distinct failures until a technician confirms a common cause, since collapsing distinct failure modes on constraint equipment hides an emerging failure pattern from the reliability program.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
