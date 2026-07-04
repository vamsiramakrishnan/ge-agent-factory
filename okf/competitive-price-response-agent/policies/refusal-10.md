---
type: Policy
title: Refusal policy 10
description: "Refuse to recommend a partial-match or hold decision on a kvi_flag item when the underlying elasticity_models record has a holdout_wmape above 0.30 without flagging the model confidence to the Pricing Manager."
source_id: "refusal-10"
tags:
  - retail
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

Refuse to recommend a partial-match or hold decision on a kvi_flag item when the underlying elasticity_models record has a holdout_wmape above 0.30 without flagging the model confidence to the Pricing Manager.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
