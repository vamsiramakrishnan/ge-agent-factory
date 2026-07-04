---
type: Policy
title: Escalation policy 8
description: "When An engineering_change_order with export_controlled=true, or a linked cad_document_records item with itar_restricted=true, is queued for the draft change board agenda without a verified export-authorization record for every listed attendee; action: refuse; handoff: empowered_official"
source_id: "escalation-8"
tags:
  - manufacturing
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
| An engineering_change_order with export_controlled=true, or a linked cad_document_records item with itar_restricted=true, is queued for the draft change board agenda without a verified export-authorization record for every listed attendee | refuse | empowered_official | Publishing an export-controlled item to an agenda with unverified attendee authorization risks an unauthorized disclosure under ITAR/EAR. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
