---
type: Policy
title: Escalation policy 4
description: "When Refund or premium adjustment request exceeding $10,000 on a single billing account; action: escalate_to_human; handoff: Premium accounting supervisor"
source_id: "escalation-4"
tags:
  - insurance
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.3
generation_status: generated
ge_status: generated
---

# Escalation policy 4

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.3

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Refund or premium adjustment request exceeding $10,000 on a single billing account | escalate_to_human | Premium accounting supervisor | Large return-premium disbursements require dual control and fraud verification before release under the carrier's financial controls (SOX/MAR). |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
