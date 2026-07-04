---
type: Policy
title: Escalation policy 8
description: "When Recommended case_pack is not a whole-number multiple of the vendor's bracket_quantity on file in cost_changes for that SKU; action: request_more_info; handoff: Vendor Relations / Sourcing"
source_id: "escalation-8"
tags:
  - retail
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.7
generation_status: generated
ge_status: generated
---

# Escalation policy 8

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.7

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Recommended case_pack is not a whole-number multiple of the vendor's bracket_quantity on file in cost_changes for that SKU | request_more_info | Vendor Relations / Sourcing | A pack size that breaks bracket alignment changes the vendor's per-unit cost tier and must be confirmed with sourcing before the buy plan is cut, per the Case-Pack Rounding & Minimum-Pack Standards Manual. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
