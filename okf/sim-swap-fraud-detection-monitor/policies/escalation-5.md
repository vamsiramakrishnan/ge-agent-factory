---
type: Policy
title: Escalation policy 5
description: "When Single-account adjustment request exceeding $500 on a consumer account or $5,000 on an enterprise account; action: escalate_to_human; handoff: billing_operations_supervisor"
source_id: "escalation-5"
tags:
  - telco
  - okf
  - brd
timestamp: "2026-07-04T00:00:00.000Z"
source_kind: generationSpec
source_path: behaviorContract.escalationRules.4
generation_status: generated
ge_status: generated
---

# Escalation policy 5

- **Policy kind:** escalation
- **Spec source:** behaviorContract.escalationRules.4

## Rule

| Trigger | Action | Handoff | Rationale |
| --- | --- | --- | --- |
| Single-account adjustment request exceeding $500 on a consumer account or $5,000 on an enterprise account | escalate_to_human | billing_operations_supervisor | Adjustments above delegation limits require second-person approval; large unreviewed credits are the classic internal-fraud and write-off leakage vector. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
