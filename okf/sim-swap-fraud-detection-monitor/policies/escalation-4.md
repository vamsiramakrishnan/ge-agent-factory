---
type: Policy
title: Escalation policy 4
description: "When Mediation-to-billing reconciliation shows revenue leakage variance greater than 0.5% of billed revenue for the cycle; action: escalate_to_human; handoff: revenue_assurance_manager"
source_id: "escalation-4"
tags:
  - telco
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
| Mediation-to-billing reconciliation shows revenue leakage variance greater than 0.5% of billed revenue for the cycle | escalate_to_human | revenue_assurance_manager | Half a percent of billed revenue is materially above normal rating noise and typically means a rating-group misconfiguration, a stuck mediation batch, or systematic zero-rating — root cause must be owned before the next bill run compounds it. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
