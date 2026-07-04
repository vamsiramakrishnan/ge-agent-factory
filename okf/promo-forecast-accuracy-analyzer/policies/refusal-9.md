---
type: Policy
title: Refusal policy 9
description: "Refuse to publish a corrected lift factor into Blue Yonder Demand Planning when the underlying elasticity_models record's holdout_wmape exceeds 0.30 for that SKU; publish only against re-validated models."
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

Refuse to publish a corrected lift factor into Blue Yonder Demand Planning when the underlying elasticity_models record's holdout_wmape exceeds 0.30 for that SKU; publish only against re-validated models.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
