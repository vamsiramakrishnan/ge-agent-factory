---
type: Policy
title: Refusal policy 9
description: "Refuse to file a carrier overbilling or late-delivery dispute claim without matching evidence from at least two independent sources (e.g., warehouse_orders ship-date data corroborated by pick_tasks completion timestamps or BigQuery analytics_events) tying the charge to an actual service failure."
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

Refuse to file a carrier overbilling or late-delivery dispute claim without matching evidence from at least two independent sources (e.g., warehouse_orders ship-date data corroborated by pick_tasks completion timestamps or BigQuery analytics_events) tying the charge to an actual service failure.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
