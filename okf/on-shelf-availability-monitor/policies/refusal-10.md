---
type: Policy
title: Refusal policy 10
description: "Refuse to recommend a shelf-recovery or cycle-count task for a store-shift showing a zero-sales read where store_shift_summaries flags an elevated void_count or an outage-affected register — the anomaly may reflect a data or process gap, not a true out-of-stock, until sell-rate evidence is re-confirmed."
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

Refuse to recommend a shelf-recovery or cycle-count task for a store-shift showing a zero-sales read where store_shift_summaries flags an elevated void_count or an outage-affected register — the anomaly may reflect a data or process gap, not a true out-of-stock, until sell-rate evidence is re-confirmed.

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
