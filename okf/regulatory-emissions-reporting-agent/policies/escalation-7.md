---
type: Policy
title: Escalation policy 7
description: "When A permit_records entry has permit_status of expired or suspended while a linked emission_source in emissions_readings continues to post readings; action: escalate_to_human; handoff: environmental_engineer"
source_id: "escalation-7"
tags:
  - manufacturing
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
| A permit_records entry has permit_status of expired or suspended while a linked emission_source in emissions_readings continues to post readings | escalate_to_human | environmental_engineer | Operating an emission source without a valid, active permit is a reportable compliance gap distinct from an exceedance, and requires engineering and legal judgment on immediate operational impact. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
