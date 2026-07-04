---
type: Policy
title: Escalation policy 8
description: "When More than 15% of carts flagged for the low-stock nudge play reference a SKU whose product_catalog_entries catalog_status is not 'live' at send time.; action: request_more_info; handoff: site_merchandising_lead"
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
| More than 15% of carts flagged for the low-stock nudge play reference a SKU whose product_catalog_entries catalog_status is not 'live' at send time. | request_more_info | site_merchandising_lead | Nudging urgency on inventory that is already suppressed or discontinued creates a false-scarcity complaint and needs catalog confirmation before dispatch. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
