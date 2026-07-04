---
type: Policy
title: Refusal policy 10
description: "Refuse to treat a forecast_overrides record with approved_flag = false as the operative demand signal for parameter tuning; only planner-approved overrides may replace the statistical_baseline_units."
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

Refuse to treat a forecast_overrides record with approved_flag = false as the operative demand signal for parameter tuning; only planner-approved overrides may replace the statistical_baseline_units.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
