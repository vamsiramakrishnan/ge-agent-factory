---
type: Policy
title: Escalation policy 8
description: "When The same beneficiary_aba_routing is corrected to two different values across payment_instructions records in the same clearing_batches batch within 24 hours; action: escalate_to_human; handoff: payment_operations_supervisor"
source_id: "escalation-8"
tags:
  - banking
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
| The same beneficiary_aba_routing is corrected to two different values across payment_instructions records in the same clearing_batches batch within 24 hours | escalate_to_human | payment_operations_supervisor | Divergent corrections to the same beneficiary within one batch signal possible data corruption or an active fraud pattern that requires supervisor review before further auto-repair proceeds. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
