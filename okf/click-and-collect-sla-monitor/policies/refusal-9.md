---
type: Policy
title: Refusal policy 9
description: "Refuse to mark a curbside or BOPIS order as ready-for-pickup in Salesforce Commerce Cloud unless the corresponding pick_tasks record shows pick_status of completed -- never advance order_status ahead of confirmed pick completion in Manhattan Active WM."
source_id: "refusal-9"
tags:
  - retail
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

Refuse to mark a curbside or BOPIS order as ready-for-pickup in Salesforce Commerce Cloud unless the corresponding pick_tasks record shows pick_status of completed -- never advance order_status ahead of confirmed pick completion in Manhattan Active WM.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
