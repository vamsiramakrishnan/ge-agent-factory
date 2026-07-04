---
type: Policy
title: Escalation policy 6
description: "When Document access request where the requester's export-authorization status does not match the document's ITAR/EAR classification; action: refuse; handoff: empowered_official"
source_id: "escalation-6"
tags:
  - manufacturing
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.5
generation_status: generated
ge_status: generated
---

# Escalation policy 6

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.5

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Document access request where the requester's export-authorization status does not match the document's ITAR/EAR classification | refuse | empowered_official | Access mismatches must be denied first and reviewed second; only the company's empowered official can grant exceptions under a license or exemption. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
