---
type: Policy
title: Escalation policy 8
description: "When product_bundle is managed_sdwan or enterprise_dia_100m spanning more than one site and serviceability_confirmed is false for any site in the bundle; action: escalate_to_human; handoff: network_provisioning_engineer"
source_id: "escalation-8"
tags:
  - telco
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
| product_bundle is managed_sdwan or enterprise_dia_100m spanning more than one site and serviceability_confirmed is false for any site in the bundle | escalate_to_human | network_provisioning_engineer | Multi-site SD-WAN and DIA builds carry special-construction cost exposure; committing an install date before every site's access circuit is confirmed risks a customer commitment the network side cannot honor. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
