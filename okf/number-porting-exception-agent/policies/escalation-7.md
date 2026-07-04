---
type: Policy
title: Escalation policy 7
description: "When Same order_number's port-in service_orders record is rejected a second time on a different mismatched field after a corrected resubmission; action: escalate_to_human; handoff: carrier_interconnection_desk"
source_id: "escalation-7"
tags:
  - telco
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
| Same order_number's port-in service_orders record is rejected a second time on a different mismatched field after a corrected resubmission | escalate_to_human | carrier_interconnection_desk | A second reject on a different field after a corrected resubmission indicates a losing-carrier CSR discrepancy the agent cannot resolve unilaterally; only the carrier interconnection desk can open an NPAC dispute with the losing carrier. |

## Used by

- [Playbook](/playbook.md)

# Citations

- [Playbook](/playbook.md)
