---
type: Policy
title: Escalation policy 7
description: "When SOV-reported building or exposure valuation differs from the current rating_worksheets exposure_base valuation by more than 25% for the same quote_number; action: request_more_info; handoff: Submitting broker / producer of record"
source_id: "escalation-7"
tags:
  - insurance
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
| SOV-reported building or exposure valuation differs from the current rating_worksheets exposure_base valuation by more than 25% for the same quote_number | request_more_info | Submitting broker / producer of record | A material valuation gap between the broker's SOV and the carrier's rated exposure basis must be reconciled with source documentation before the submission can be quoted, or the resulting premium misstates the exposure. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
